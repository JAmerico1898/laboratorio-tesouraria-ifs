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

/** Juro real neutro de referência, em decimal. Atualize, com a fonte, quando o BCB revisar. */
export const NEUTRO_REAL = 0.05;
export const NEUTRO_FONTE =
  "Copom, ata de dez/2024: taxa real neutra elevada de 4,75% para 5,00% a.a. É uma estimativa do BCB, não um cálculo do painel.";

/** Abaixo deste módulo (bps), DI e Focus são lidos como alinhados. */
export const LIMIAR_FOCUS_BPS = 10;

/** Prazo máximo (DU) da tabela DI × Focus — além disso o prêmio domina. */
export const PRAZO_MAX_DI_FOCUS_DU = 600;

/** Prazos (DU) das leituras de juro real, break-even e ponta longa: 2 e 10 anos. */
export const PRAZO_CURTO_DU = 2 * DU_ANO;
export const PRAZO_LONGO_DU = 10 * DU_ANO;

/** Reuniões com Selic implícita extraída da curva. */
export const N_REUNIOES_IMPLICITAS = 2;
