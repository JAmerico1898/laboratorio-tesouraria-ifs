export type Familia = "taxas" | "precos" | "termo" | "implicita";

export interface Vertice {
  rotulo: string; // "DI1F27" | "NTN-B 2035" | "mai/27"
  vencimento: string; // ISO "YYYY-MM-DD"
  diasUteis: number;
  taxa: number | null; // decimal: 0.1374 = 13,74% — exceto unidade "bps"
  pu?: number | null;
  duration?: number | null;
  dv01?: number | null;
  nota?: string; // ex.: "1º vencimento distorcido pelo casado"
}

export interface Curva {
  id: string; // "pre-zero" | "di1" | "ntnb-zero" | ...
  familia: Familia;
  nome: string;
  fonte: string; // "ANBIMA" | "B3"
  /** O que a série plotada é. Nunca "preço": o PU vive na tabela, em coluna própria. */
  unidade: "taxa" | "bps";
  /** Rótulo do eixo Y, declarado pelo backend, que sabe qual campo alimentou a série. */
  rotuloY: string;
  convencao: "du252" | "linear360";
  vertices: Vertice[];
}

export interface Indicadores {
  selicMeta: number | null;
  diOver: number | null;
  ptax: number | null;
  vnaNtnb: number | null;
  vnaNtnbData: string | null;
  vnaNtnbProjetado: number | null;
  vnaLft: number | null;
  ipcaProjetado: number | null;
}

export interface MercadoSnapshot {
  dataSolicitada: string;
  dataEfetiva: string | null;
  contingencia: boolean;
  indicadores: Indicadores;
  curvas: Curva[];
  /** Opcional: payloads anteriores ao card Âncoras continuam válidos. */
  ancoras?: Ancoras | null;
  error?: string;
}

/** Rótulo automático da inclinação — ver limiar em `config.ts`. */
export type FormatoCurva = "positivamente inclinada" | "plana" | "invertida";

export interface LeituraRapida {
  curta: Vertice;
  longa: Vertice;
  inclinacaoBps: number;
  formato: FormatoCurva;
  inversoes: { de: Vertice; para: Vertice }[];
  nVertices: number;
  duMin: number;
  duMax: number;
}

/** Trecho de uma curva, em dias úteis. Extremos inclusivos; ambos opcionais. */
export interface JanelaDu {
  duMin?: number;
  duMax?: number;
}

// ── âncoras ────────────────────────────────────────────────────────────────

export interface FocusAncora {
  dataBase: string; // ISO; Data da pesquisa, sempre ≤ dataEfetiva
  selicAnual: Record<string, number>; // decimal, chave = ano
  ipcaAnual: Record<string, number>;
  ipca12m: number | null;
}

export interface ReuniaoCopom {
  id: string; // "R7/2026"
  dataDecisao: string; // ISO, 2º dia da reunião
  duEfetiva: number; // DU da data de referência ao 1º dia útil após a decisão
  estimada: boolean;
  focusSelic: number | null;
}

export interface DecisaoCopom {
  id: string;
  numero: number; // 281
  dataDecisao: string;
  selic: number; // decimal, após a decisão
  variacaoBps: number;
  unanime: boolean | null;
  fraseChave: string | null;
  fonteUrl: string | null;
}

export interface Ancoras {
  focus: FocusAncora | null;
  reunioes: ReuniaoCopom[];
  ultimoCopom: DecisaoCopom | null;
  avisos: string[];
}
