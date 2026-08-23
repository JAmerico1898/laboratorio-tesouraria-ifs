import type { Curva, MercadoSnapshot, Vertice } from "./types";

/**
 * Narrativas parametrizadas.
 *
 * Um marcador tem a forma `{{alvo.seletor.campo}}`:
 *
 *   {{pre-zero.213.taxa}}      → taxa do vértice de 213 dias úteis da curva PRE
 *   {{ntnb-tir.NTN-B 2035.taxa}} → busca pelo rótulo do vértice
 *   {{spread-pre-di.LTN jul/27.taxa}} → curvas em bps saem com sufixo " bps"
 *   {{ind.selicMeta}}          → indicador do snapshot
 *   {{ind.dataEfetiva}}        → data do dado, em DD/MM/AAAA
 *
 * Marcador que não resolve vira `—` e um `console.warn` em desenvolvimento.
 * A chave crua nunca chega ao aluno.
 */

const MARCADOR = /\{\{([^}]+)\}\}/g;

// ── formatação ─────────────────────────────────────────────────────────────

export function pct(v: number | null | undefined, casas = 4): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  return `${(v * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })}%`;
}

export function bpsFmt(v: number | null | undefined, casas = 2): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  return `${v.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })} bps`;
}

export function num(v: number | null | undefined, casas = 2): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  return v.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

export function brl(v: number | null | undefined, casas = 0): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  return `R$ ${num(v, casas)}`;
}

export function dataBr(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [a, m, d] = iso.split("-");
  return d ? `${d}/${m}/${a}` : iso;
}

// ── resolução de marcadores ────────────────────────────────────────────────

function acharVertice(curva: Curva, seletor: string): Vertice | undefined {
  const du = Number(seletor);
  if (Number.isFinite(du) && seletor.trim() !== "") {
    return curva.vertices.find((v) => v.diasUteis === du);
  }
  return curva.vertices.find((v) => v.rotulo === seletor);
}

function campoDoVertice(curva: Curva, v: Vertice, campo: string): string | null {
  switch (campo) {
    case "taxa":
      if (v.taxa === null) return null;
      return curva.unidade === "bps" ? bpsFmt(v.taxa) : pct(v.taxa);
    case "pu":
      return v.pu === null || v.pu === undefined ? null : num(v.pu, 6);
    case "duration":
      return v.duration === null || v.duration === undefined ? null : num(v.duration);
    case "dv01":
      return v.dv01 === null || v.dv01 === undefined ? null : num(v.dv01, 4);
    case "du":
      return String(v.diasUteis);
    case "rotulo":
      return v.rotulo;
    case "vencimento":
      return dataBr(v.vencimento);
    default:
      return null;
  }
}

function resolverChave(s: MercadoSnapshot, chave: string): string | null {
  const partes = chave.split(".").map((p) => p.trim());

  if (partes[0] === "ind") {
    const campo = partes[1];
    if (campo === "dataEfetiva") return dataBr(s.dataEfetiva);
    if (campo === "vnaNtnbData") return dataBr(s.indicadores.vnaNtnbData);
    const v = (s.indicadores as unknown as Record<string, number | null>)[campo];
    if (v === undefined || v === null) return null;
    if (campo === "ptax") return num(v, 4);
    if (campo === "vnaNtnb" || campo === "vnaNtnbProjetado" || campo === "vnaLft") {
      return num(v, 6);
    }
    return pct(v, campo === "ipcaProjetado" ? 2 : 2);
  }

  if (partes.length < 3) return null;
  const campo = partes[partes.length - 1];
  const curvaId = partes[0];
  const seletor = partes.slice(1, -1).join(".");

  const curva = s.curvas.find((c) => c.id === curvaId);
  if (!curva) return null;
  const v = acharVertice(curva, seletor);
  if (!v) return null;
  return campoDoVertice(curva, v, campo);
}

/** Interpola os marcadores de um texto contra o snapshot. Nunca lança. */
export function preencher(texto: string, s: MercadoSnapshot): string {
  return texto.replace(MARCADOR, (_bruto, chave: string) => {
    let valor: string | null = null;
    try {
      valor = resolverChave(s, chave);
    } catch {
      valor = null;
    }
    if (valor === null) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[mercado/template] marcador não resolvido: {{${chave}}}`);
      }
      return "—";
    }
    return valor;
  });
}
