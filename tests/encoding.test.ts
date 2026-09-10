import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const RAIZ = path.resolve(__dirname, "..");
const PASTAS = ["app", "components", "data", "lib", "tests", "public/data"];
const EXTENSOES = new Set([".ts", ".tsx", ".css", ".json"]);

/**
 * Sequências que só aparecem quando bytes UTF-8 foram lidos como latin1/cp1252
 * e regravados — "Ã—" no lugar de "×", "â€”" no lugar de "—". Um editor com
 * codificação errada reintroduz isso em silêncio, e o texto acentuado do app
 * chega quebrado à tela.
 */
const MOJIBAKE = /[ÂÃÅÐÑ][ -¿–—‘-”†-…€]|â€|�/;

function arquivosFonte(): string[] {
  const saida: string[] = [];
  const visitar = (dir: string) => {
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
      const alvo = path.join(dir, entrada.name);
      if (entrada.isDirectory()) visitar(alvo);
      else if (alvo === __filename) continue; // contém os padrões que procura
      else if (EXTENSOES.has(path.extname(entrada.name))) saida.push(alvo);
    }
  };
  for (const pasta of PASTAS) visitar(path.join(RAIZ, pasta));
  return saida;
}

describe("codificação dos fontes", () => {
  const arquivos = arquivosFonte();

  it("encontra os arquivos de texto do app", () => {
    expect(arquivos.length).toBeGreaterThan(50);
  });

  it("não tem mojibake nem BOM em nenhum arquivo", () => {
    const problemas: string[] = [];

    for (const arquivo of arquivos) {
      const bytes = fs.readFileSync(arquivo);
      const relativo = path.relative(RAIZ, arquivo);

      // O BOM vira um caractere invisível no início do módulo e quebra
      // parsers de JSON.
      if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
        problemas.push(`${relativo}: BOM UTF-8 no início do arquivo`);
      }

      const texto = bytes.toString("utf8");
      texto.split(/\r?\n/).forEach((linha, i) => {
        if (MOJIBAKE.test(linha)) {
          problemas.push(`${relativo}:${i + 1}: ${linha.trim().slice(0, 100)}`);
        }
      });
    }

    expect(problemas).toEqual([]);
  });
});
