import type { Pauta } from "./types";
import type { MercadoSnapshot } from "./mercado/types";
import { dataBr } from "./mercado/template";

/**
 * As fontes padrão do jsPDF usam WinAnsi (cp1252). Caracteres fora dessa
 * página — setas, menos tipográfico, aproximadamente, multiplicação, gregos,
 * sobrescritos, emoji — **somem do PDF sem erro nenhum**. Por isso a
 * substituição é explícita, e não best-effort.
 */
const SUBSTITUICOES: [RegExp, string][] = [
  [/[→⇒]/g, "->"],
  [/[←⇐]/g, "<-"],
  [/[↔⇔]/g, "<->"],
  [/[−–—]/g, "-"],
  [/[≈≃]/g, "~"],
  [/≠/g, "!="],
  [/≤/g, "<="],
  [/≥/g, ">="],
  [/[×✕✖]/g, "x"],
  [/÷/g, "/"],
  // Somatório e sigma grego são pontos de código distintos (U+2211 e U+03A3);
  // cobrir só um deixa o outro ser removido em silêncio pelo passe final.
  [/[∑Σ]/g, "Soma"],
  [/[Δ∆]/g, "Delta"],
  [/[σς]/g, "sigma"],
  [/[μµ]/g, "mu"],
  [/[πΠ]/g, "pi"],
  [/√/g, "raiz de "],
  [/∞/g, "infinito"],
  [/[•◦]/g, "-"],
  [/[‘’‛]/g, "'"],
  [/[“”„]/g, '"'],
  [/…/g, "..."],
  [/ | | /g, " "],
  [/‰/g, "%o"],
];

const SOBRESCRITOS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const SUBSCRITOS = "₀₁₂₃₄₅₆₇₈₉";

/**
 * Reduz um texto ao repertório WinAnsi, preservando a acentuação portuguesa.
 * Sobrescritos e subscritos caem para o dígito correspondente via NFKD; o que
 * sobrar fora de cp1252 é removido, e não silenciosamente ignorado pelo jsPDF.
 */
export function sanitizarWinAnsi(texto: string): string {
  let t = texto.normalize("NFC");
  for (const [re, sub] of SUBSTITUICOES) t = t.replace(re, sub);

  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => String(SOBRESCRITOS.indexOf(c)));
  t = t.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (c) => String(SUBSCRITOS.indexOf(c)));

  // Decompõe o que sobrou e recompõe só o que cp1252 representa.
  t = t
    .split("")
    .map((c) => {
      const cp = c.codePointAt(0)!;
      if (cp <= 0xff) return c; // Latin-1, que cp1252 cobre
      if (cp >= 0x2010 && cp <= 0x2015) return "-";
      const nfkd = c.normalize("NFKD").replace(/[̀-ͯ]/g, "");
      return [...nfkd].every((x) => x.codePointAt(0)! <= 0xff) ? nfkd : "";
    })
    .join("");

  return t.replace(/[ \t]{2,}/g, " ").trim();
}

/** Remove marcação HTML das narrativas antes de escrever no PDF. */
export function semHtml(texto: string): string {
  return texto
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const prep = (t: string) => sanitizarWinAnsi(semHtml(t));

/**
 * Gera o gabarito comentado da pauta em PDF, no navegador. Sem servidor e sem
 * diálogo de impressão. Todo número vem do snapshot — os campos `math` são
 * funções, nunca strings congeladas.
 */
export async function gerarGabaritoPdf(
  pauta: Pauta,
  snap: MercadoSnapshot,
): Promise<import("jspdf").jsPDF> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const M = 48;
  const L = doc.internal.pageSize.getWidth() - M * 2;
  const fundo = doc.internal.pageSize.getHeight() - M;
  let y = M;

  const quebra = (altura: number) => {
    if (y + altura > fundo) {
      doc.addPage();
      y = M;
    }
  };

  const escrever = (texto: string, tamanho: number, estilo: "normal" | "bold" = "normal", cor = 25) => {
    doc.setFont("helvetica", estilo);
    doc.setFontSize(tamanho);
    doc.setTextColor(cor);
    const linhas = doc.splitTextToSize(prep(texto), L) as string[];
    for (const linha of linhas) {
      quebra(tamanho * 1.35);
      doc.text(linha, M, y);
      y += tamanho * 1.35;
    }
  };

  const espaco = (n: number) => {
    y += n;
  };

  escrever(`${pauta.codigo} — ${pauta.titulo}`, 16, "bold");
  escrever(
    `Módulo 5 · Mercado Hoje · Laboratório de Tesouraria | FGV — dados de ${dataBr(snap.dataEfetiva)}`,
    9,
    "normal",
    120,
  );
  espaco(10);

  escrever("Síntese", 12, "bold");
  escrever(pauta.gabarito.sintese, 10);
  espaco(8);

  escrever("Resolução etapa a etapa", 12, "bold");
  espaco(2);
  for (const nota of pauta.gabarito.notas) {
    const etapa = pauta.etapas.find((e) => e.id === nota.etapaId);
    escrever(etapa?.titulo ?? nota.etapaId, 10.5, "bold");
    escrever(`Leitura do curso: ${nota.answer}`, 10);
    escrever(`Por quê: ${nota.rationale}`, 10);
    let memoria: string;
    try {
      memoria = nota.math(snap);
    } catch {
      memoria = "memória de cálculo indisponível para este snapshot";
    }
    escrever(`Memória de cálculo: ${memoria}`, 10, "normal", 90);
    espaco(6);
  }

  espaco(4);
  escrever("Posições de mesa", 12, "bold");
  for (const pos of pauta.posicoes) {
    const marca = pos.id === pauta.posicaoCurso ? " (posição sustentada pelo gabarito)" : "";
    escrever(`${pos.id}: ${pos.rotulo} — ${pos.decisao}${marca}`, 10, "bold");
    for (const c of pos.consequencias) escrever(`${c.estado}: ${c.efeito}`, 9.5, "normal", 90);
    let contra: string;
    try {
      contra = pos.contrafactual(snap);
    } catch {
      contra = "contrafactual indisponível para este snapshot";
    }
    escrever(`Contrafactual: ${contra}`, 9.5, "normal", 90);
    espaco(5);
  }

  espaco(4);
  escrever("Glossário", 12, "bold");
  for (const g of pauta.gabarito.glossario) escrever(`${g.termo} — ${g.definicao}`, 9.5);

  return doc;
}

export async function baixarGabaritoPdf(pauta: Pauta, snap: MercadoSnapshot): Promise<void> {
  const doc = await gerarGabaritoPdf(pauta, snap);
  doc.save(`gabarito-${pauta.id}.pdf`);
}
