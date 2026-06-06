import type { CaseStudy } from "@/lib/types";

export const caso3: CaseStudy = {
  id: "caso-3",
  codigo: "3.D",
  modulo: "Módulo 3",
  titulo: "Remontando o book de renda fixa pós-Copom",
  situacao:
    'Após a decisão do Copom e a revisão do Focus, sua mesa precisa <span class="hl">rebalancear um book de R$ 500 mi</span> composto por <span class="hl">LTN, NTN-B, LFT e debêntures</span>. Você define o mix entre duration pré, proteção real e crédito privado, respeitando os limites de risco e de concentração.',
  chips: [
    "Evento: Pós-Copom",
    "Book (PV): R$ 500 mi",
    "Composição: LTN/NTN-B/LFT/deb.",
    "Focus (IPCA): ~4,4% / 4,86% (2026)",
    "Decisão: Pré × real × crédito",
    "Limites: DV01 + concentração",
  ],
  exhibits: [
    {
      id: "exhibit-1",
      titulo: "Exhibit 1 · Preços e taxas dos títulos — VN R$ 1.000; base DU/252",
      colunas: ["Título", "Indexador", "Prazo", "Taxa / Spread", "PU"],
      linhas: [
        ["LTN", "Pré", "126 du", "11,50%", "947,03"],
        ["LTN longa", "Pré", "504 du", "12,00%", "797,19"],
        ["NTN-F", "Pré (cupom 10%)", "252 du", "TIR 11,00%", "991,20"],
        ["NTN-B", "IPCA+", "504 du", "IPCA+6,00%", "s/ VNA"],
        ["LFT", "Pós-Selic", "—", "Selic", "≈ VNA"],
        ["Debênture", "IPCA+ (rating A)", "4 anos", "IPCA+6,20%", "par"],
        ["CDB pós", "% CDI", "252 du", "110% CDI", "—"],
      ],
    },
    {
      id: "exhibit-2",
      titulo: "Exhibit 2 · Spreads de crédito por rating e limites",
      colunas: ["Rating", "Spread sobre o soberano"],
      linhas: [
        ["AAA", "+1,0%"],
        ["AA", "+1,8%"],
        ["A", "+2,8%"],
        ["BBB", "+4,5%"],
      ],
      nota:
        "<b>Limites:</b> crédito privado ≤ 20% do book · por emissor ≤ 5% · DV01 agregado dentro do limite. <b>Liquidez:</b> alta (LTN/LFT/NTN-F/NTN-B), baixa (debêntures — FGC não cobre).",
    },
  ],
  perguntas: [
    {
      id: "i",
      enunciado: "<b>i.</b> A inflação implícita está cara ou barata?",
      resolucao:
        'Breakeven = pré 12,00% (504 du) vs NTN-B IPCA+6,00% → <code>(1,12)/(1,06) − 1 ≈ 5,66%</code>. Comparando com o Focus (~4,86% para 2026), o breakeven está <b>levemente caro</b>: a inflação esperada é menor que a implícita → leve preferência por pré, mantendo NTN-B como hedge de cauda inflacionária.',
    },
    {
      id: "ii",
      enunciado: "<b>ii.</b> O carrego das debêntures compensa o risco de crédito/liquidez?",
      resolucao:
        'A debênture rating A (IPCA+6,2%) paga um spread de crédito (~+2,8% sobre o soberano) que precisa cobrir perda esperada + iliquidez (FGC não cobre). Compensa apenas se o spread remunerar a probabilidade de migração de rating/perda; mesmo assim, limitar a <b>≤ 20% do book</b> e <b>≤ 5% por emissor</b> e diversificar.',
    },
    {
      id: "iii",
      enunciado: "<b>iii.</b> Que mix respeita os limites e o cenário?",
      resolucao:
        'Exemplo coerente: <b>40% LTN/NTN-F</b> (duration pré moderada conforme visão de Selic), <b>25% LFT</b> (defensivo/liquidez), <b>20% NTN-B</b> (proteção real / hedge de cauda), <b>15% debêntures</b> (carrego, dentro do limite de 20% e ≤ 5% por emissor) — verificando o DV01 agregado ≤ limite. O mix exato depende da convicção de Selic e do apetite de risco.',
    },
  ],
  entregavel:
    "alocação proposta (% por instrumento) + justificativa de uma página + cálculo dos PUs dos títulos prefixados.",
  debrief:
    'Conectar <b>apreçamento (Módulo 3)</b> à <b>gestão de risco/duration (Módulo 4)</b>. Gancho regulatório: discutir “o que acontece com o book se a isenção (LCI/LCA) cair?” — captações isentas carregam risco regulatório, mudanças vêm com transição mas alteram a economia das novas emissões.',
  rubrica: [
    { criterio: "Cálculo correto de PUs e breakeven", pontos: 25, descricao: "" },
    { criterio: "Avaliação spread × risco das debêntures", pontos: 20, descricao: "" },
    { criterio: "Mix coerente com o cenário pós-Copom", pontos: 25, descricao: "" },
    { criterio: "Respeito a limites de DV01 e concentração", pontos: 20, descricao: "" },
    { criterio: "Clareza da justificativa", pontos: 10, descricao: "" },
  ],
};
