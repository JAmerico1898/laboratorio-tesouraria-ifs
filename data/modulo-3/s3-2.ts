import type { Scenario } from "@/lib/types";

export const s3_2: Scenario = {
  id: "s3-2",
  codigo: "S3.2",
  empresa: "Gestor de renda fixa",
  titulo: "Gross-up: comparando captações",
  nivel: "int",
  duracaoMin: 20,
  contexto: "A tesouraria decide como remunerar um <b>produto de varejo</b>. O CDI está em <span class=\"num\">10,40% a.a.</span>, horizonte <span class=\"num\">252 du</span>. As opções: <b>CDB tributado</b> (110% ou 115% do CDI) ou <b>LCI isenta</b> (92% ou 96% do CDI), para públicos com IR diferente.",
  chips: [
    {
      k: "CDI",
      v: "10,40% a.a."
    },
    {
      k: "Horizonte",
      v: "252 du"
    },
    {
      k: "CDB (tributado)",
      v: "110% / 115%"
    },
    {
      k: "LCI (isenta)",
      v: "92% / 96%"
    },
    {
      k: "IR PF longo",
      v: "15%"
    },
    {
      k: "IR PF curto",
      v: "22,5%"
    }
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo: "Lógica de gross-up: <code>taxa_bruta_equivalente = taxa_isenta / (1 − IR)</code>. % do CDI incide sobre o <b>fator diário</b> <code>i_d = (1,1040)^(1/252) − 1</code>. Tabela regressiva de IR: 22,5% (≤180d) … 15% (>720d)."
  },
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "Por que comparar uma LCI isenta com um CDB tributado exige “gross-up”?",
      opcoes: [
        {
          id: "a",
          text: "Porque o que importa ao investidor PF é o rendimento líquido: a isenção da LCI equivale a um CDB com taxa bruta maior",
          correct: true
        },
        {
          id: "b",
          text: "Porque o CDI usado é diferente para cada instrumento"
        },
        {
          id: "c",
          text: "Porque a LCI sempre rende mais em termos brutos"
        },
        {
          id: "d",
          text: "Porque a LCI tem cobertura do FGC e o CDB não"
        }
      ],
      feedback: "Comparar taxas brutas é enganoso: a LCI é isenta de IR para PF. Trazendo tudo ao líquido (ou “elevando” a LCI ao bruto equivalente), compara-se maçãs com maçãs.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "Qual a taxa efetiva <b>bruta</b> de um CDB a 110% do CDI (CDI 10,40%, 252 du)?",
      opcoes: [
        {
          id: "a",
          text: "≈ 11,44% a.a."
        },
        {
          id: "b",
          text: "≈ 11,5% a.a.",
          correct: true
        },
        {
          id: "c",
          text: "≈ 10,92% a.a."
        },
        {
          id: "d",
          text: "≈ 10,40% a.a."
        }
      ],
      feedback: "O percentual incide no fator diário: <code>i_d=(1,1040)^(1/252)−1</code>; <code>(1+1,10·i_d)^252 − 1 ≈ 11,5%</code>. Multiplicar a taxa anual direto (10,40×1,10 = 11,44%) subestima por ignorar a capitalização diária.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Para um PF com IR de 15%, o que rende mais <b>líquido</b>: LCI 96% isenta ou CDB 110%?",
      opcoes: [
        {
          id: "a",
          text: "O CDB, sempre, por ter o maior percentual de CDI"
        },
        {
          id: "b",
          text: "Empatam: a isenção compensa exatamente o IR"
        },
        {
          id: "c",
          text: "A LCI: ≈ 10,0% líquido vs. ≈ 9,8% do CDB (11,5% bruto × 0,85)",
          correct: true
        },
        {
          id: "d",
          text: "Depende apenas da cobertura do FGC"
        }
      ],
      feedback: "LCI 96% isenta ≈ <b>10,0%</b> líquido; CDB 110% bruto 11,5%, menos IR de 15% ≈ <b>9,8%</b>. A isenção faz a LCI vencer mesmo com percentual menor de CDI — é o gross-up na prática.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Qual produto ofertar para captar?",
    subtitulo: "A decisão muda com o público e seu IR.",
    ramos: [
      {
        id: "A",
        rotulo: "LCI isenta",
        titulo: "Ofertar LCI a 96% do CDI (isenta)",
        resumo: "Vence no líquido para PF com % menor; funding mais barato.",
        resultado: {
          titulo: "Funding eficiente para PF",
          deltas: [
            { k: "Produto", v: "LCI 96% (isenta)", tone: "pos" },
            { k: "Líquido ao PF", v: "≈ 10,0%", tone: "pos" },
            { k: "Custo de funding", v: "Menor (% do CDI)", tone: "pos" },
            { k: "Restrição", v: "Lastro imobiliário", tone: "neu" }
          ],
          analise: "Bruto ao banco: <code>96% CDI → ≈10,0% a.a.</code> Gross-up para o PF (IR 15%): equivale a CDB de <code>10,0%/(1−0,15) ≈ 11,76% bruto</code> — acima do CDB 110% (11,5%). Custo ao banco: 10,0% para entregar 10,0% líquido; CDB 110% custa 11,5% para entregar 9,8% líquido. Funding 1,5 p.p. mais barato por entregar 0,2 p.p. a mais ao investidor."
        }
      },
      {
        id: "B",
        rotulo: "CDB tributado",
        titulo: "Ofertar CDB a 110% do CDI (tributado)",
        resumo: "Maior % bruto; útil para PJ e quem valoriza FGC/flexibilidade.",
        resultado: {
          titulo: "Flexível, sem restrição de lastro",
          deltas: [
            { k: "Produto", v: "CDB 110%", tone: "neu" },
            { k: "Líquido ao PF (15%)", v: "≈ 9,8%", tone: "neu" },
            { k: "Cobertura FGC", v: "Sim", tone: "pos" },
            { k: "Restrição de lastro", v: "Nenhuma", tone: "pos" }
          ],
          analise: "Bruto: <code>(1+110%×i_d)^252−1 ≈ 11,5% a.a.</code> Líquido PF (IR 15%): <code>11,5% × 0,85 = 9,78%</code> — abaixo dos 10,0% da LCI 96%. Diferença: <code>−0,22 p.p. líquido</code> a um custo de funding 1,5 p.p. maior. Justificado para PJ (sem isenção) e quando FGC ou ausência de lastro imobiliário é determinante."
        }
      },
      {
        id: "C",
        rotulo: "Maior % bruto",
        titulo: "Ofertar o maior % bruto (CDB 115%) sem olhar o IR",
        resumo: "'Parece' o mais competitivo, mas encarece o funding.",
        resultado: {
          titulo: "Competitividade aparente — funding caro",
          deltas: [
            { k: "Produto", v: "CDB 115%", tone: "neg" },
            { k: "Comparação", v: "Só taxa bruta", tone: "neg" },
            { k: "Custo de funding", v: "Mais alto", tone: "neg" },
            { k: "Ganho real vs LCI", v: "Nenhum", tone: "neg" }
          ],
          analise: "Bruto: <code>≈ 12,1% a.a.</code> Líquido PF: <code>12,1% × 0,85 ≈ 10,3%</code> — marginal acima da LCI (10,0%). Custo ao banco: <code>+2,1 p.p.</code> vs LCI para ganhar apenas <code>+0,3 p.p.</code> de líquido ao PF. Competitividade aparente: paga-se mais caro por uma margem que o investidor mal percebe.",
          risco: true
        }
      }
    ]
  },
  reflexao: {
    enunciado: "O que a lógica de gross-up ensina sobre captação no varejo?",
    opcoes: [
      {
        id: "a",
        text: "Ofereça sempre o maior percentual de CDI possível"
      },
      {
        id: "b",
        text: "LCI e CDB são equivalentes para o investidor final"
      },
      {
        id: "c",
        text: "O IR não afeta a decisão de funding do banco"
      },
      {
        id: "d",
        text: "O que importa é o líquido: a isenção da LCI permite captar a um % menor do CDI e ainda vencer o CDB; o IR regressivo muda a decisão por prazo, e olhar só a taxa bruta encarece o funding",
        correct: true
      }
    ],
    feedback: "Gross-up alinha a oferta ao rendimento líquido do cliente e ao custo real do funding — evitando pagar caro por uma competitividade apenas aparente.",
    pontos: 25
  },
  pontuacaoMax: 85
};
