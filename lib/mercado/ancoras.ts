import {
  DU_ANO,
  LIMIAR_FOCUS_BPS,
  N_REUNIOES_IMPLICITAS,
  NOCIONAL_PADRAO,
  PRAZO_MAX_DI_FOCUS_DU,
} from "./config";
import { bps, forward, interpolar } from "./metricas";
import type { Ancoras, FocusAncora, Indicadores, ReuniaoCopom, Vertice } from "./types";

/**
 * Motor do card Âncoras. Funções puras, convenção exponencial DU/252.
 * Nenhuma lança por dado faltante: o que não dá para calcular vira `null`.
 */

type Taxas = Pick<Indicadores, "selicMeta" | "diOver">;

export type LeituraFocus = "mercado mais dovish" | "curva acima do Focus" | "alinhados";

export interface SelicImplicita {
  reuniao: ReuniaoCopom;
  /** Contrato DI usado na extração, ex.: "DI1Z26". */
  contrato: string;
  selic: number;
  /** Movimento implícito contra a reunião anterior (ou contra a Selic meta). */
  movimentoBps: number;
  focus: number | null;
}

export interface LinhaDiFocus {
  rotulo: string; // "F27"
  diasUteis: number;
  di: number;
  focus: number | null;
  difBps: number | null;
  leitura: LeituraFocus | null;
  /** Custo (R$, nocional padrão) de travar a pré em vez de pagar o CDI do Focus; negativo = economia. */
  travarReais: number | null;
  /** O cálculo usa ao menos uma reunião com data ainda não oficial. */
  estimada: boolean;
}

/** Spread Selic meta − DI over do dia, em decimal. */
export function spreadOver(ind: Taxas): number | null {
  if (ind.selicMeta === null || ind.diOver === null) return null;
  return ind.selicMeta - ind.diOver;
}

export function neutroNominal(real: number, meta: number): number {
  return (1 + real) * (1 + meta) - 1;
}

/** Selic do Focus para a reunião; sem mediana por reunião, vale a do fim do ano. */
export function focusSelicReuniao(r: ReuniaoCopom, focus: FocusAncora | null): number | null {
  return r.focusSelic ?? focus?.selicAnual[r.dataDecisao.slice(0, 4)] ?? null;
}

/**
 * CDI que a trajetória de Selic do Focus implica até `du`, como taxa DU/252
 * comparável a um vértice do DI.
 */
export function cdiEsperadoFocus(du: number, a: Ancoras, ind: Taxas): number | null {
  const spread = spreadOver(ind);
  if (!a.focus || spread === null) return null;
  let fator = 1;
  let prev = 0;
  let cdi = ind.diOver as number;
  for (const r of a.reunioes) {
    if (r.duEfetiva >= du) break;
    const selic = focusSelicReuniao(r, a.focus);
    if (selic === null) return null;
    fator *= (1 + cdi) ** ((r.duEfetiva - prev) / DU_ANO);
    prev = r.duEfetiva;
    cdi = selic - spread;
  }
  fator *= (1 + cdi) ** ((du - prev) / DU_ANO);
  return fator ** (DU_ANO / du) - 1;
}

/**
 * Selic implícita na curva DI para as `n` próximas reuniões, por bootstrap.
 *
 * O regime da reunião k vai de sua data efetiva até a da reunião seguinte. Usa
 * o último vértice com `prev < du ≤ fim`: o contrato que vence no dia em que a
 * taxa seguinte entra em vigor acumula CDI só até a véspera.
 */
export function selicImplicita(
  di: Vertice[],
  a: Ancoras,
  ind: Taxas,
  n = N_REUNIOES_IMPLICITAS,
): (SelicImplicita | null)[] {
  const out: (SelicImplicita | null)[] = Array(n).fill(null);
  const spread = spreadOver(ind);
  if (spread === null || !a.reunioes.length) return out;

  let prev = a.reunioes[0].duEfetiva;
  let taxaPrev = ind.diOver as number; // taxa acumulada de hoje até `prev`
  let selicAnterior = ind.selicMeta as number;
  for (let k = 0; k < n && k + 1 < a.reunioes.length; k++) {
    const fim = a.reunioes[k + 1].duEfetiva;
    const v = di.filter((x) => x.taxa !== null && x.diasUteis > prev && x.diasUteis <= fim).at(-1);
    if (!v) break;
    const cdi = forward(prev, v.diasUteis, taxaPrev, v.taxa as number);
    const selic = cdi + spread;
    out[k] = {
      reuniao: a.reunioes[k],
      contrato: v.rotulo,
      selic,
      movimentoBps: bps(selic - selicAnterior),
      focus: focusSelicReuniao(a.reunioes[k], a.focus),
    };
    const fator = (1 + taxaPrev) ** (prev / DU_ANO) * (1 + cdi) ** ((fim - prev) / DU_ANO);
    taxaPrev = fator ** (DU_ANO / fim) - 1;
    prev = fim;
    selicAnterior = selic;
  }
  return out;
}

/** Juro real ex-ante de 1 ano: DI de 252 DU deflacionado pelo IPCA 12m do Focus. */
export function juroRealExAnte(di: Vertice[], ipca12m: number | null): number | null {
  const di1a = interpolar(di, DU_ANO);
  if (di1a === null || ipca12m === null) return null;
  return (1 + di1a) / (1 + ipca12m) - 1;
}

const ANO_MS = 365.25 * 864e5;

/**
 * IPCA médio (a.a.) que o Focus projeta da data de referência até `venc`: os
 * primeiros 12 meses pela mediana de 12 meses à frente; o restante pelas
 * medianas anuais, ponderadas pelo tempo em cada ano-calendário.
 */
export function focusIpcaMedio(ref: string, venc: string, f: FocusAncora | null): number | null {
  if (!f || f.ipca12m === null) return null;
  const t0 = Date.parse(ref);
  const fim = Date.parse(venc);
  if (!(fim > t0)) return null;
  const t1 = t0 + ANO_MS;
  if (fim <= t1) return f.ipca12m;
  let log = Math.log(1 + f.ipca12m);
  for (let ano = new Date(t1).getUTCFullYear(); ano <= new Date(fim).getUTCFullYear(); ano++) {
    const ipca = f.ipcaAnual[String(ano)];
    if (ipca === undefined) return null;
    const de = Math.max(t1, Date.UTC(ano, 0, 1));
    const ate = Math.min(fim, Date.UTC(ano + 1, 0, 1));
    log += (Math.log(1 + ipca) * (ate - de)) / ANO_MS;
  }
  return Math.exp(log / ((fim - t0) / ANO_MS)) - 1;
}

export function rotuloFocus(difBps: number): LeituraFocus {
  if (difBps < -LIMIAR_FOCUS_BPS) return "mercado mais dovish";
  if (difBps > LIMIAR_FOCUS_BPS) return "curva acima do Focus";
  return "alinhados";
}

/** Tabela DI × CDI esperado pelo Focus: contratos de janeiro (F) e julho (N). */
export function diVsFocus(di: Vertice[], a: Ancoras, ind: Taxas): LinhaDiFocus[] {
  return di
    .filter(
      (v) =>
        v.taxa !== null &&
        v.rotulo.startsWith("DI1") &&
        (v.rotulo[3] === "F" || v.rotulo[3] === "N") &&
        v.diasUteis <= PRAZO_MAX_DI_FOCUS_DU,
    )
    .map((v) => {
      const taxa = v.taxa as number;
      const focus = cdiEsperadoFocus(v.diasUteis, a, ind);
      const difBps = focus === null ? null : bps(taxa - focus);
      return {
        rotulo: v.rotulo.slice(3),
        diasUteis: v.diasUteis,
        di: taxa,
        focus,
        difBps,
        leitura: difBps === null ? null : rotuloFocus(difBps),
        travarReais:
          focus === null
            ? null
            : NOCIONAL_PADRAO *
              ((1 + taxa) ** (v.diasUteis / DU_ANO) - (1 + focus) ** (v.diasUteis / DU_ANO)),
        estimada: a.reunioes.some((r) => r.estimada && r.duEfetiva < v.diasUteis),
      };
    });
}
