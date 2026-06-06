import type { CaseStudy } from "@/lib/types";

export const caso1: CaseStudy = {
  id: "caso-1",
  codigo: "1.D",
  modulo: "Módulo 1",
  titulo: "A decisão de funding de um banco médio",
  situacao:
    'A tesouraria de um <span class="hl">banco médio</span> precisa captar <span class="num">R$ 500 milhões</span> por um ano. A mesa compara alternativas prefixadas, pós-fixadas e isentas, considerando custo efetivo, liquidez, concentração e o risco de descasamento entre ativos e passivos.',
  chips: [
    "Necessidade: R$ 500 mi",
    "Horizonte: 1 ano",
    "Base: 252 dias úteis",
    "Cenário: Selic/CDI incertos",
    "Decisão: pré × pós",
    "Restrição: liquidez e concentração",
  ],
  exhibits: [
    {
      id: "exhibit-1",
      titulo: "Exhibit 1 · Alternativas de captação",
      colunas: ["Instrumento", "Prazo", "Remuneração", "Liquidez", "Observação"],
      linhas: [
        ["CDB pós", "1 ano", "110% CDI", "média", "FGC"],
        ["CDB pré", "1 ano", "13,00% a.a.", "média", "FGC"],
        ["LCI/LCA", "1 ano", "92% CDI", "baixa", "isenta para PF"],
        ["Interbancário", "overnight", "CDI + 0,20%", "alta", "rolagem diária"],
        ["Compromissada", "overnight", "Selic-over", "alta", "com lastro"],
      ],
      nota:
        "<b>Premissa:</b> comparar os custos na mesma base e considerar o risco de rolagem das alternativas overnight.",
    },
  ],
  perguntas: [
    {
      id: "i",
      enunciado: "<b>i.</b> Como comparar corretamente o custo das alternativas?",
      resolucao:
        "Converter todas as taxas para a mesma base e horizonte, incorporando spreads, percentuais do CDI e custos acessórios. A alternativa de menor taxa nominal não é necessariamente a de menor custo econômico quando liquidez, concentração e risco de rolagem são considerados.",
    },
    {
      id: "ii",
      enunciado: "<b>ii.</b> Qual é o principal risco de financiar ativos longos com captação overnight?",
      resolucao:
        "O banco assume <b>risco de liquidez e de rolagem</b>: o custo pode subir rapidamente ou a fonte pode desaparecer antes do vencimento dos ativos. O descasamento também amplia a exposição a movimentos do CDI/Selic.",
    },
    {
      id: "iii",
      enunciado: "<b>iii.</b> Que combinação de funding é recomendável?",
      resolucao:
        "Uma combinação diversificada entre captação de prazo compatível com os ativos e uma parcela pós-fixada reduz concentração e risco de rolagem. A decisão final depende da visão de juros, do gap pré × pós e dos limites internos de liquidez.",
    },
  ],
  entregavel:
    "memorando de uma página com a recomendação de funding + planilha de equivalência de taxas e custo efetivo.",
  debrief:
    "Reforçar que a decisão de funding combina matemática financeira, visão de cenário e gestão de liquidez. O menor custo observado hoje pode criar exposição relevante a juros ou rolagem amanhã.",
  rubrica: [
    { criterio: "Equivalência e comparação correta das taxas", pontos: 30, descricao: "" },
    { criterio: "Diagnóstico do gap pré × pós", pontos: 25, descricao: "" },
    { criterio: "Tratamento do risco de liquidez e rolagem", pontos: 20, descricao: "" },
    { criterio: "Recomendação de funding justificada", pontos: 15, descricao: "" },
    { criterio: "Clareza do memorando", pontos: 10, descricao: "" },
  ],
};
