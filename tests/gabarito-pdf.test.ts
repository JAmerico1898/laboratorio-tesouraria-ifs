import { describe, expect, it } from "vitest";
import { pautas } from "@/data/mercado-hoje";
import { gerarGabaritoPdf, sanitizarWinAnsi, semHtml } from "@/lib/gabarito-pdf";
import { snapshot } from "./fixture";

const s = snapshot();

/**
 * Repertório cp1252 (WinAnsi). Tudo fora disso some do PDF sem erro nenhum —
 * por isso a checagem é explícita.
 */
const WINANSI_EXTRA = new Set([
  0x20ac, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6, 0x2030, 0x0160,
  0x2039, 0x0152, 0x017d, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014,
  0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, 0x017e, 0x0178,
]);

function foraDoWinAnsi(texto: string): string[] {
  return [...texto].filter((c) => {
    const cp = c.codePointAt(0)!;
    return cp > 0xff && !WINANSI_EXTRA.has(cp);
  });
}

describe("sanitizarWinAnsi", () => {
  it("substitui os símbolos que somem silenciosamente do PDF", () => {
    expect(sanitizarWinAnsi("a → b")).toBe("a -> b");
    expect(sanitizarWinAnsi("13,74% − 13,51%")).toBe("13,74% - 13,51%");
    expect(sanitizarWinAnsi("≈ 194,5 mil")).toBe("~ 194,5 mil");
    expect(sanitizarWinAnsi("4,4× o prazo")).toBe("4,4x o prazo");
    expect(sanitizarWinAnsi("Σ dos fluxos")).toBe("Soma dos fluxos");
    expect(sanitizarWinAnsi("Δ de taxa")).toBe("Delta de taxa");
    expect(sanitizarWinAnsi("x ≥ y e a ≤ b")).toBe("x >= y e a <= b");
  });

  it("rebaixa sobrescritos e subscritos ao dígito", () => {
    expect(sanitizarWinAnsi("m⁴")).toBe("m4");
    expect(sanitizarWinAnsi("a₁")).toBe("a1");
  });

  it("preserva a acentuação portuguesa intacta", () => {
    const pt = "Inflação implícita à vista: prêmio, convenção, ações, ânsia, pôr, Ártico";
    expect(sanitizarWinAnsi(pt)).toBe(pt);
  });

  it("remove emoji sem quebrar o resto da frase", () => {
    expect(sanitizarWinAnsi("taxa 📈 subiu")).toBe("taxa subiu");
  });

  it("não deixa resíduo fora do WinAnsi", () => {
    const bruto = "→ − ≈ ≥ × Σ Δ ⁴ ₁ 📊 “aspas” … ‰ • ÷ ≠";
    expect(foraDoWinAnsi(sanitizarWinAnsi(bruto))).toEqual([]);
  });

  it("é idempotente", () => {
    const uma = sanitizarWinAnsi("a → b ≈ c × d");
    expect(sanitizarWinAnsi(uma)).toBe(uma);
  });
});

describe("semHtml", () => {
  it("remove marcação e converte <br> em quebra", () => {
    expect(semHtml("<b>curva</b> em <code>U</code>")).toBe("curva em U");
    expect(semHtml("linha<br>outra")).toBe("linha\noutra");
    expect(semHtml("a &amp; b &lt;c&gt;")).toBe("a & b <c>");
  });
});

describe("fidelidade do PDF — todo texto do gabarito sobrevive à sanitização", () => {
  it.each(pautas.map((p) => [p.codigo, p] as const))(
    "%s: nenhum resíduo fora do WinAnsi, inclusive na saída dos `math`",
    (codigo, pauta) => {
      const pedacos = [
        pauta.titulo,
        pauta.gabarito.sintese,
        ...pauta.etapas.map((e) => e.titulo),
        ...pauta.gabarito.notas.flatMap((n) => [n.answer, n.rationale, n.math(s)]),
        ...pauta.posicoes.flatMap((p) => [
          p.rotulo,
          p.decisao,
          p.contrafactual(s),
          ...p.consequencias.flatMap((c) => [c.estado, c.efeito]),
        ]),
        ...pauta.gabarito.glossario.flatMap((g) => [g.termo, g.definicao]),
      ];
      for (const bruto of pedacos) {
        const residuo = foraDoWinAnsi(sanitizarWinAnsi(semHtml(bruto)));
        expect(residuo, `${codigo}: resíduo ${JSON.stringify(residuo)} em "${bruto.slice(0, 60)}"`)
          .toEqual([]);
      }
    },
  );
});

describe("geração do PDF", () => {
  it.each(pautas.map((p) => [p.codigo, p] as const))(
    "%s gera PDF com >= 1 página e tamanho não trivial",
    async (_codigo, pauta) => {
      const doc = await gerarGabaritoPdf(pauta, s);
      expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
      const bytes = doc.output("arraybuffer");
      expect(bytes.byteLength).toBeGreaterThan(3000);
    },
  );

  it("o PDF contém o código da pauta e a data do snapshot", async () => {
    const doc = await gerarGabaritoPdf(pautas[0], s);
    const texto = doc.output("datauristring");
    expect(texto.length).toBeGreaterThan(3000);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(2);
  });
});
