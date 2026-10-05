// Material complementar: animações HTML (public/animacoes) e simuladores Excel
// (public/simulacoes), agrupados pelo módulo a que pertencem.

export interface Animacao {
  slug: string; // nome do arquivo sem .html
  modulo: number; // 1–4
  titulo: string;
  descricao: string;
}

export interface Simulador {
  arquivo: string; // nome do arquivo em public/simulacoes
  modulo: number; // 1–4
  titulo: string;
  descricao: string;
}

export const MODULOS_RECURSOS: { numero: number; nome: string }[] = [
  { numero: 1, nome: "Operações de Tesouraria" },
  { numero: 2, nome: "ETTJ" },
  { numero: 3, nome: "Apreçamento" },
  { numero: 4, nome: "Gestão de Risco" },
];

export const ANIMACOES: Animacao[] = [
  {
    slug: "arvore_taxas_transmissao_selic",
    modulo: 1,
    titulo: "A árvore das taxas e a transmissão da Selic",
    descricao:
      "Um choque na Selic meta escorre pelos ramos da árvore — mas não com a mesma velocidade nem com a mesma força.",
  },
  {
    slug: "inflacao_implicita_breakeven",
    modulo: 1,
    titulo: "Inflação implícita não é expectativa pura",
    descricao:
      "O breakeven da LTN/NTN-F contra a NTN-B mistura expectativa de IPCA, prêmio de risco de inflação e liquidez.",
  },
  {
    slug: "flat_forward_interpolacao",
    modulo: 2,
    titulo: "Flat-forward: a taxa entre os vértices",
    descricao:
      "O padrão brasileiro supõe taxa a termo constante entre dois vértices do DI1 — e interpola fatores, não taxas.",
  },
  {
    slug: "fra_di1_trava_termo",
    modulo: 2,
    titulo: "FRA de DI1: travar um trecho da curva",
    descricao:
      "Duas pontas de DI1 em sentidos opostos deixam o operador exposto apenas à taxa a termo entre os vencimentos.",
  },
  {
    slug: "forward_1y1y_premio_focus",
    modulo: 2,
    titulo: "Forward 1y1y: o que o mercado cobra além do Focus",
    descricao:
      "A taxa de um ano daqui a um ano, comparada ao CDI esperado pelos economistas, vira régua de prêmio.",
  },
  {
    slug: "movimentos_curva_juros",
    modulo: 2,
    titulo: "Os movimentos da curva de juros",
    descricao:
      "Nível, inclinação e curvatura: qual ponta se mexeu e para onde diz se a posição ganhou ou perdeu.",
  },
  {
    slug: "cupom_cambial_ddi_frc",
    modulo: 2,
    titulo: "Cupom cambial, DDI e FRC",
    descricao:
      "De onde sai o cupom, por que o DDI o entrega “sujo”, como o FRC o limpa e como a curva é montada.",
  },
  {
    slug: "titulos_publicos_cdi_spread_fiscal",
    modulo: 3,
    titulo: "Quanto rende de verdade?",
    descricao:
      "PU dos títulos públicos, % do CDI em CDI + spread e gross-up da isenção: compare fatores, no mesmo prazo e após imposto.",
  },
  {
    slug: "duration_macaulay_modificada",
    modulo: 3,
    titulo: "Duration: Macaulay e Modificada",
    descricao:
      "Macaulay é o centro de gravidade dos fluxos; a Modificada diz quanto o PU muda quando a taxa se mexe.",
  },
  {
    slug: "convexidade",
    modulo: 3,
    titulo: "Convexidade: a curva que a duration não vê",
    descricao:
      "A duration é uma reta; o PU é uma curva. A convexidade corrige a estimativa para choques grandes.",
  },
  {
    slug: "deve_dnii_irrbb",
    modulo: 4,
    titulo: "Um choque, dois visores: ΔEVE e ΔNII",
    descricao:
      "O ΔEVE mede o impacto no valor do banco; o ΔNII, no resultado de 12 meses. Podem apontar para lados opostos.",
  },
  {
    slug: "imunizacao_duration",
    modulo: 4,
    titulo: "Imunização: casar a duration do ativo com a do passivo",
    descricao:
      "Mexa na carteira de um banco fictício, aplique choques na curva pré e veja onde a proteção racha.",
  },
];

export const SIMULADORES: Simulador[] = [
  {
    arquivo: "revisao-modelos-matematica-financeira.xlsx",
    modulo: 1,
    titulo: "Revisão — modelos de matemática financeira",
    descricao: "Kit de cálculo: VP e VF, equivalência de taxas, LTN, fluxo com cupons, TIR e YTM.",
  },
  {
    arquivo: "simulador-inflacao-implicita.xlsx",
    modulo: 2,
    titulo: "Inflação implícita",
    descricao: "Breakeven, NTN-B e a decomposição do prêmio.",
  },
  {
    arquivo: "simulador-flat-forward.xlsx",
    modulo: 2,
    titulo: "Flat-forward",
    descricao: "Interpolação da curva de DI entre vértices.",
  },
  {
    arquivo: "simulador-fra-di.xlsx",
    modulo: 2,
    titulo: "FRA de DI",
    descricao: "Taxa forward e trava sintética com dois DI1.",
  },
  {
    arquivo: "simulador-mtm-trava.xlsx",
    modulo: 2,
    titulo: "MtM da trava",
    descricao: "Decisão ≠ resultado: a trava sob marcação a mercado, com número.",
  },
  {
    arquivo: "simulador-focus-1y1y.xlsx",
    modulo: 2,
    titulo: "Focus → 1y1y",
    descricao: "Medindo o prêmio da curva contra a expectativa do Focus.",
  },
  {
    arquivo: "simulador-ddi.xlsx",
    modulo: 2,
    titulo: "DDI",
    descricao: "Cupom cambial e o futuro de cupom.",
  },
  {
    arquivo: "simulador-frc.xlsx",
    modulo: 2,
    titulo: "FRC",
    descricao: "Cupom limpo e a construção da curva do cupom.",
  },
  {
    arquivo: "simulador-ntn-f-contra-curva.xlsx",
    modulo: 3,
    titulo: "NTN-F contra a curva",
    descricao: "PU justo, TIR e DV01 da NTN-F.",
  },
  {
    arquivo: "simulador-duration-convexidade.xlsx",
    modulo: 3,
    titulo: "Duration e convexidade",
    descricao: "Do fluxo ao book.",
  },
  {
    arquivo: "simulador-dv01-juros-spread.xlsx",
    modulo: 3,
    titulo: "DV01: juros × spread",
    descricao: "DV01 do book no balanço completo, juros e spread em colunas separadas.",
  },
  {
    arquivo: "simulador-segundo-preco.xlsx",
    modulo: 3,
    titulo: "O segundo preço",
    descricao: "LFT, spread duration, indexador e gross-up.",
  },
  {
    arquivo: "simulador-imunizacao.xlsx",
    modulo: 4,
    titulo: "Imunização",
    descricao: "Casar antes de carregar.",
  },
  {
    arquivo: "simulador-bullet-barbell-ladder.xlsx",
    modulo: 4,
    titulo: "Bullet × Barbell × Ladder",
    descricao: "Estratégias de posicionamento na curva.",
  },
  {
    arquivo: "simulador-eve-nii.xlsx",
    modulo: 4,
    titulo: "ΔEVE × ΔNII",
    descricao: "A dor no valor e a dor no resultado.",
  },
];
