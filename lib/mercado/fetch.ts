import { TIMEOUT_API_MS } from "./config";
import type { MercadoSnapshot } from "./types";

const FALLBACK_URL = "/data/mercado-fallback.json";

async function carregarFallback(): Promise<MercadoSnapshot> {
  const r = await fetch(FALLBACK_URL);
  if (!r.ok) throw new Error("snapshot de contingência indisponível");
  const s = (await r.json()) as MercadoSnapshot;
  return { ...s, contingencia: true };
}

/**
 * Snapshot de uma data. Tenta a função Python; se ela falhar, demorar mais
 * que `TIMEOUT_API_MS` ou vier vazia, cai no snapshot commitado.
 *
 * A aula nunca depende de a ANBIMA estar no ar.
 */
export async function carregarSnapshot(data: string): Promise<MercadoSnapshot> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_API_MS);
  try {
    const r = await fetch(`/api/mercado?date=${data}`, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`api respondeu ${r.status}`);
    const s = (await r.json()) as MercadoSnapshot;
    if (!s.curvas?.length) throw new Error(s.error ?? "payload vazio");
    return s;
  } catch {
    return carregarFallback();
  } finally {
    clearTimeout(t);
  }
}

/**
 * Snapshot de ancoragem das pautas — sempre o arquivo commitado, nunca a API.
 * As árvores de decisão afirmam fatos qualitativos sobre a curva daquele dia;
 * servi-las com o dado de hoje tornaria a leitura do curso possivelmente falsa
 * diante do próprio gráfico ao lado.
 */
export async function carregarAncora(): Promise<MercadoSnapshot> {
  const r = await fetch(FALLBACK_URL);
  if (!r.ok) throw new Error("snapshot de ancoragem indisponível");
  return (await r.json()) as MercadoSnapshot;
}

/** Data de hoje em YYYY-MM-DD, no fuso local. */
export function hojeIso(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Serializa a tabela de vértices em tela como CSV (separador ';', padrão pt-BR). */
export function paraCsv(cabecalho: string[], linhas: (string | number | null)[][]): string {
  const esc = (v: string | number | null) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cabecalho, ...linhas].map((l) => l.map(esc).join(";")).join("\r\n");
}
