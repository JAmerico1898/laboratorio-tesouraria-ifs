import type { CaseStudy } from "@/lib/types";

export const caso2: CaseStudy = {
  id: "caso-2",
  codigo: "2.D",
  modulo: "Módulo 2",
  titulo: "Reposicionando o book após a abertura da curva",
  situacao:
    'Duas semanas após um choque fiscal, a curva de juros abriu e mudou de inclinação. Sua mesa administra um book de títulos <span class="hl">prefixados e IPCA+</span> e precisa interpretar spots, forwards e inflação implícita antes de decidir o reposicionamento, respeitando o limite de <span class="num">DV01</span>.',
  chips: [
    "Evento: choque fiscal",
    "Comparação: Data 1 × Data 2",
    "Book: pré + IPCA+",
    "DV01 atual: R$ 40 mil/bp",
    "Limite de DV01: R$ 25 mil/bp",
    "Decisão: duration + indexador",
  ],
  exhibits: [
    {
      id: "exhibit-1",
      titulo: "Exhibit 1 · Curva prefixada — taxas spot a.a.",
      colunas: ["Vértice", "Data 1", "Data 2"],
      linhas: [
        ["1 ano", "10,50%", "11,80%"],
        ["2 anos", "11,20%", "12,40%"],
        ["3 anos", "11,80%", "12,70%"],
        ["5 anos", "12,20%", "13,00%"],
      ],
      nota: "<b>Leitura:</b> a curva abriu, com mudança da inclinação e do prêmio de prazo.",
    },
    {
      id: "exhibit-2",
      titulo: "Exhibit 2 · Curva real (NTN-B) e inflação implícita",
      colunas: ["Vértice", "Real Data 1", "Real Data 2", "Breakeven Data 1", "Breakeven Data 2"],
      linhas: [
        ["2 anos", "5,30%", "5,70%", "≈ 5,6%", "≈ 6,3%"],
        ["5 anos", "5,80%", "6,20%", "≈ 6,0%", "≈ 6,4%"],
      ],
      nota:
        "<b>Meta de inflação:</b> 4,5% (teto). <b>Risco:</b> DV01 atual de R$ 40 mil/bp, acima do limite de R$ 25 mil/bp.",
    },
  ],
  perguntas: [
    {
      id: "i",
      enunciado: "<b>i.</b> O que a curva e as forwards sinalizam entre as duas datas?",
      resolucao:
        "A curva abriu, mas o movimento relativo entre vértices altera a inclinação e as taxas forward. A leitura deve separar nível, inclinação e prêmio de prazo; a forward sintetiza a taxa futura implícita entre dois vértices.",
    },
    {
      id: "ii",
      enunciado: "<b>ii.</b> O que aconteceu com a inflação implícita?",
      resolucao:
        'O breakeven subiu de <code>≈ 5,6%</code> na Data 1 para <code>≈ 6,3%</code> na Data 2 — acima do teto da meta (4,5%). A inflação implícita ficou mais <b>cara</b>, refletindo prêmio de risco fiscal: pagar por proteção via IPCA+ custa um breakeven elevado.',
    },
    {
      id: "iii",
      enunciado: "<b>iii.</b> Qual reposicionamento entre pré/IPCA+ e por quê?",
      resolucao:
        "Com DV01 acima do limite (40 > 25) e risco de abertura, <b>reduzir duration pré</b> (encurtar/vender longos ou hedge de DI) é mandatório para enquadrar. Trocar parte por IPCA+ protege do risco inflacionário precificado, mas o breakeven já caro significa pagar caro pela proteção — daí <b>reduzir duration primeiro</b> e dosar IPCA+ conforme convicção.",
    },
  ],
  entregavel:
    "memorando de uma página + planilha de forwards e breakeven (calcular a forward entre vértices por flat-forward e o breakeven nas duas datas).",
  debrief:
    "Ligar <b>forward</b>, <b>inflação implícita</b> e <b>prêmio de prazo</b>: a curva é informação, não só carrego. Mostrar que o enquadramento de DV01 precede a visão. Preparar para o <b>apreçamento de títulos (Módulo 3)</b>.",
  rubrica: [
    { criterio: "Leitura da forward e do flattening", pontos: 25, descricao: "" },
    { criterio: "Cálculo do breakeven nas duas datas", pontos: 25, descricao: "" },
    { criterio: "Decisão de duration coerente com o limite de DV01", pontos: 25, descricao: "" },
    { criterio: "Reposicionamento pré/IPCA+ justificado", pontos: 15, descricao: "" },
    { criterio: "Clareza do memorando", pontos: 10, descricao: "" },
  ],
};
