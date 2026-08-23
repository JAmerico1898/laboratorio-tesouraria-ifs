import type { Familia } from "./types";

/**
 * Constantes editáveis do módulo. Nada aqui é buscado por API — o professor
 * altera neste arquivo e o módulo inteiro acompanha.
 */

/** Meta contínua de inflação do Banco Central, em decimal. */
export const META_INFLACAO = 0.03;

/** Intervalo de tolerância em torno da meta, em pontos percentuais decimais. */
export const BANDA_INFLACAO = 0.015;

export const BANDA_SUPERIOR = META_INFLACAO + BANDA_INFLACAO;
export const BANDA_INFERIOR = META_INFLACAO - BANDA_INFLACAO;

/** Abaixo deste módulo de inclinação (em bps), a curva é chamada de plana. */
export const LIMIAR_PLANA_BPS = 25;

/** Dias úteis por ano na convenção brasileira de juros em reais. */
export const DU_ANO = 252;

/** Dias corridos por ano na convenção linear do cupom cambial. */
export const DC_ANO = 360;

/**
 * Nocional de referência dos contrafactuais das Resoluções. A spec só fixa
 * tamanho de posição uma vez (R$ 100 mi, no gabarito da P5.1); adotamos o
 * mesmo valor nas seis pautas para que os números sejam comparáveis entre si.
 */
export const NOCIONAL_PADRAO = 100_000_000;

/**
 * Data de ancoragem das pautas. As árvores de decisão afirmam fatos
 * qualitativos sobre a curva ("desenha um U", "acima da banda", "prêmio
 * monotonicamente mais negativo") que só são verdadeiros neste dia; por isso
 * as pautas leem o snapshot commitado, enquanto o painel livre é ao vivo.
 */
export const DATA_ANCORA_PAUTAS = "2026-08-21";

/** Tempo além do qual o cliente desiste da API e cai no snapshot commitado. */
export const TIMEOUT_API_MS = 15_000;

/** Quantos dias corridos o backend recua procurando dado publicado. */
export const MAX_RECUO_DIAS = 10;

export const FAMILIAS: { id: Familia; rotulo: string; icon: string }[] = [
  { id: "taxas", rotulo: "Taxas", icon: "percent" },
  { id: "precos", rotulo: "Preços", icon: "sell" },
  { id: "termo", rotulo: "A termo", icon: "linear_scale" },
  { id: "implicita", rotulo: "Inflação implícita", icon: "trending_up" },
];

/** Prazos dos cartões de forward clássicos, em anos: (início, fim). */
export const FORWARDS_CLASSICOS: { rotulo: string; de: number; ate: number }[] = [
  { rotulo: "1a1a", de: 1, ate: 2 },
  { rotulo: "2a1a", de: 2, ate: 3 },
  { rotulo: "5a5a", de: 5, ate: 10 },
];
