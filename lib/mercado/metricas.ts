import { DU_ANO, LIMIAR_PLANA_BPS } from "./config";
import type {
  Curva,
  FormatoCurva,
  JanelaDu,
  LeituraRapida,
  MercadoSnapshot,
  Vertice,
} from "./types";

/** Vértices com taxa observada, na ordem de prazo. */
export function verticesValidos(curva: Curva): Vertice[] {
  return curva.vertices.filter((v): v is Vertice & { taxa: number } => v.taxa !== null);
}

export function bps(x: number): number {
  return x * 10_000;
}

export function rotuloFormato(inclinacaoBps: number): FormatoCurva {
  if (Math.abs(inclinacaoBps) < LIMIAR_PLANA_BPS) return "plana";
  return inclinacaoBps > 0 ? "positivamente inclinada" : "invertida";
}

/**
 * Taxa a termo entre dois vértices, na convenção exponencial DU/252.
 *
 * Não usar em DDI/FRC: o cupom cambial é linear em base 360 dias corridos.
 */
export function forward(du1: number, du2: number, t1: number, t2: number): number {
  if (du2 <= du1) throw new RangeError("forward: du2 precisa ser maior que du1");
  const fator = (1 + t2) ** (du2 / DU_ANO) / (1 + t1) ** (du1 / DU_ANO);
  return fator ** (DU_ANO / (du2 - du1)) - 1;
}

/**
 * Interpolação flat forward em DU/252 — a convenção da mesa brasileira.
 * Fora do intervalo observado devolve a taxa do vértice extremo (não
 * extrapola: extrapolação silenciosa é o tipo de número que o aluno leva
 * para a prova sem saber que foi inventado).
 */
export function interpolar(vertices: Vertice[], du: number): number | null {
  const vs = vertices.filter((v) => v.taxa !== null).sort((a, b) => a.diasUteis - b.diasUteis);
  if (vs.length === 0) return null;
  if (du <= vs[0].diasUteis) return vs[0].taxa;
  if (du >= vs[vs.length - 1].diasUteis) return vs[vs.length - 1].taxa;

  for (let i = 0; i < vs.length - 1; i++) {
    const a = vs[i];
    const b = vs[i + 1];
    if (du >= a.diasUteis && du <= b.diasUteis) {
      const fa = (1 + a.taxa!) ** (a.diasUteis / DU_ANO);
      const fb = (1 + b.taxa!) ** (b.diasUteis / DU_ANO);
      const f = fa * (fb / fa) ** ((du - a.diasUteis) / (b.diasUteis - a.diasUteis));
      return f ** (DU_ANO / du) - 1;
    }
  }
  return null;
}

/** Forward entre dois prazos em anos, interpolando a curva. Ex.: 5a5a. */
export function forwardClassico(curva: Curva, deAnos: number, ateAnos: number) {
  const du1 = Math.round(deAnos * DU_ANO);
  const du2 = Math.round(ateAnos * DU_ANO);
  const t1 = interpolar(curva.vertices, du1);
  const t2 = interpolar(curva.vertices, du2);
  if (t1 === null || t2 === null) return null;
  return { taxa: forward(du1, du2, t1, t2), du1, du2, spot1: t1, spot2: t2 };
}

/** Break-even de inflação a partir das taxas nominal e real do mesmo prazo. */
export function breakeven(nominal: number, real: number): number {
  return (1 + nominal) / (1 + real) - 1;
}

/** Pares consecutivos em que a taxa cai — os trechos invertidos da curva. */
export function inversoes(curva: Curva): { de: Vertice; para: Vertice }[] {
  const vs = verticesValidos(curva);
  const out: { de: Vertice; para: Vertice }[] = [];
  for (let i = 0; i < vs.length - 1; i++) {
    if (vs[i + 1].taxa! < vs[i].taxa!) out.push({ de: vs[i], para: vs[i + 1] });
  }
  return out;
}

/** Os quatro cartões acima do gráfico: nível, inclinação, inversões, vértices. */
export function leituraRapida(curva: Curva): LeituraRapida | null {
  const vs = verticesValidos(curva);
  if (vs.length < 2) return null;
  const curta = vs[0];
  const longa = vs[vs.length - 1];
  // Curvas em bps já vêm na unidade; taxas vêm em decimal.
  const inclinacaoBps =
    curva.unidade === "bps" ? longa.taxa! - curta.taxa! : bps(longa.taxa! - curta.taxa!);
  return {
    curta,
    longa,
    inclinacaoBps,
    formato: rotuloFormato(inclinacaoBps),
    inversoes: inversoes(curva),
    nVertices: vs.length,
    duMin: curta.diasUteis,
    duMax: longa.diasUteis,
  };
}

// ── acesso ao snapshot ─────────────────────────────────────────────────────

export function getCurva(s: MercadoSnapshot, id: string): Curva | undefined {
  return s.curvas.find((c) => c.id === id);
}

export function getVertice(s: MercadoSnapshot, curvaId: string, rotulo: string) {
  return getCurva(s, curvaId)?.vertices.find((v) => v.rotulo === rotulo);
}

/** Vértice de uma curva pelo prazo exato em dias úteis. */
export function getPorDu(s: MercadoSnapshot, curvaId: string, du: number) {
  return getCurva(s, curvaId)?.vertices.find((v) => v.diasUteis === du);
}

/** Vértice cujo prazo é o mais próximo do pedido — usado nas narrativas. */
export function maisProximo(s: MercadoSnapshot, curvaId: string, du: number) {
  const vs = getCurva(s, curvaId)?.vertices.filter((v) => v.taxa !== null) ?? [];
  if (!vs.length) return undefined;
  return vs.reduce((a, b) =>
    Math.abs(a.diasUteis - du) <= Math.abs(b.diasUteis - du) ? a : b,
  );
}

/**
 * Taxa de um vértice pelo rótulo. Devolve `NaN` quando o vértice não existe —
 * os formatadores rendem `—`, e o gabarito nunca quebra por dado faltante.
 */
export function taxaDe(s: MercadoSnapshot, curvaId: string, rotulo: string): number {
  return getVertice(s, curvaId, rotulo)?.taxa ?? NaN;
}

/** Taxa de um vértice pelo prazo exato em dias úteis. */
export function taxaPorDu(s: MercadoSnapshot, curvaId: string, du: number): number {
  return getPorDu(s, curvaId, du)?.taxa ?? NaN;
}

/** Vértice de menor taxa — a "barriga" da curva. */
export function minimo(curva: Curva): Vertice | undefined {
  const vs = verticesValidos(curva);
  if (!vs.length) return undefined;
  return vs.reduce((a, b) => (a.taxa! <= b.taxa! ? a : b));
}

/** Vértice de maior taxa. */
export function maximo(curva: Curva): Vertice | undefined {
  const vs = verticesValidos(curva);
  if (!vs.length) return undefined;
  return vs.reduce((a, b) => (a.taxa! >= b.taxa! ? a : b));
}

/**
 * Recorta a curva ao trecho que uma etapa discute, em dias úteis.
 *
 * Sem janela — ou com janela vazia — devolve a curva intacta. Um recorte que
 * não sobra vértice nenhum também devolve a curva intacta: melhor mostrar a
 * curva inteira do que um painel em branco.
 */
export function recortarCurva(curva: Curva, janela?: JanelaDu): Curva {
  if (!janela || (janela.duMin === undefined && janela.duMax === undefined)) return curva;
  const vertices = curva.vertices.filter(
    (v) =>
      (janela.duMin === undefined || v.diasUteis >= janela.duMin) &&
      (janela.duMax === undefined || v.diasUteis <= janela.duMax),
  );
  return vertices.length ? { ...curva, vertices } : curva;
}
