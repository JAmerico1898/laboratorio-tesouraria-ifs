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
          text: "Porque a LCI tem FGC e o CDB não"
        },
        {
          id: "c",
          text: "Porque o CDI é diferente para cada instrumento"
        },
        {
          id: "d",
          text: "Porque a LCI sempre rende mais bruto"
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
          text: "≈ 11,5% a.a.",
          correct: true
        },
        {
          id: "b",
          text: "≈ 11,44% a.a."
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
          text: "A LCI: ≈ 10,0% líquido vs. ≈ 9,8% do CDB (11,5% bruto × 0,85)",
          correct: true
        },
        {
          id: "b",
          text: "O CDB, sempre"
        },
        {
          id: "c",
          text: "Empatam"
        },
        {
          id: "d",
          text: "Depende do FGC"
        }
      ],
      feedback: "LCI 96% isenta ≈ <b>10,0%</b> líquido; CDB 110% bruto 11,5%, menos IR de 15% ≈ <b>9,8%</b>. A isenção faz a LCI vencer mesmo com percentual menor de CDI — é o gross-up na prática.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Qual produto ofertar para captar?",
    subtitulo: "A decisão muda com o público e seu IR.",
    ramos: []
  },
  reflexao: {
    enunciado: "O que a lógica de gross-up ensina sobre captação no varejo?",
    opcoes: [
      {
        id: "a",
        text: "O que importa é o líquido: a isenção da LCI permite captar a um % menor do CDI e ainda vencer o CDB; o IR regressivo muda a decisão por prazo, e olhar só a taxa bruta encarece o funding",
        correct: true
      },
      {
        id: "b",
        text: "Sempre ofereça o maior % de CDI possível"
      },
      {
        id: "c",
        text: "LCI e CDB são equivalentes ao investidor"
      },
      {
        id: "d",
        text: "O IR não afeta a decisão de funding"
      }
    ],
    feedback: "Gross-up alinha a oferta ao rendimento líquido do cliente e ao custo real do funding — evitando pagar caro por uma competitividade apenas aparente.",
    pontos: 25
  },
  pontuacaoMax: 85
};
