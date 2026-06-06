import type { Scenario } from "@/lib/types";

export const s2_1: Scenario = {
  id: "s2-1",
  codigo: "S2.1",
  empresa: "Mesa de renda fixa",
  titulo: "Montando a curva com 4 vértices",
  nivel: "int",
  duracaoMin: 20,
  contexto: "Você recebe o <b>DI futuro</b> da B3 em quatro vértices (a.a., DU/252) e precisa <b>interpolar a taxa de 50 du</b> para apreçar um CDB. A curva está <span class=\"num\">positivamente inclinada</span>.",
  chips: [
    {
      k: "21 du",
      v: "12,00%"
    },
    {
      k: "42 du",
      v: "12,50%"
    },
    {
      k: "63 du",
      v: "12,80%"
    },
    {
      k: "126 du",
      v: "13,10%"
    },
    {
      k: "Alvo a interpolar",
      v: "50 du"
    },
    {
      k: "Base",
      v: "DU/252"
    }
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo: "padrões de interpolação (flat-forward × linear na taxa); fórmula da forward entre vértices; spread do CDB = 102% da taxa interpolada."
  },
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "O padrão de mercado (ANBIMA) para interpolar entre vértices é o flat-forward. O que ele mantém constante no intervalo?",
      opcoes: [
        {
          id: "a",
          text: "A taxa forward (a termo) implícita entre os vértices",
          correct: true
        },
        {
          id: "b",
          text: "A taxa spot"
        },
        {
          id: "c",
          text: "O PU do título"
        },
        {
          id: "d",
          text: "A duration"
        }
      ],
      feedback: "Flat-forward assume <b>forward constante</b> entre dois vértices, preservando a multiplicatividade dos fatores de capitalização — por isso é o padrão no mercado DU/252.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "Qual a forward implícita entre 42 du (12,50%) e 63 du (12,80%), anualizada?",
      opcoes: [
        {
          id: "a",
          text: "≈ 13,40% a.a.",
          correct: true
        },
        {
          id: "b",
          text: "≈ 12,65% a.a."
        },
        {
          id: "c",
          text: "≈ 12,80% a.a."
        },
        {
          id: "d",
          text: "≈ 13,10% a.a."
        }
      ],
      feedback: "<code>(1+f)^(21/252) = (1,128)^(63/252) / (1,125)^(42/252) = 1,01054</code> → anualizando <code>1,01054^12 ≈ 1,1340</code>, logo <b>f ≈ 13,40% a.a.</b> A média simples (12,65%) ignora a composição e subestima a forward numa curva que sobe.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Se você usasse interpolação <b>linear na taxa</b> (e não flat-forward) para o vértice de 50 du, o erro seria:",
      opcoes: [
        {
          id: "a",
          text: "Pequeno e sistemático em prazos curtos — mas pode virar marcação equivocada em vértices longos ou curva íngreme/invertida",
          correct: true
        },
        {
          id: "b",
          text: "Grande e aleatório, sem padrão"
        },
        {
          id: "c",
          text: "Nulo: os dois métodos são idênticos"
        },
        {
          id: "d",
          text: "Relevante apenas para títulos pós-fixados"
        }
      ],
      feedback: "Em 50 du a diferença é de poucos bps, mas o viés é <b>sistemático</b>. Em vértices longos ou curva muito inclinada o erro cresce; em <b>curva invertida</b> a linear pode até inverter a relação forward — daí a padronização do flat-forward.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Como interpolar e marcar o CDB de 50 du?",
    subtitulo: "Cada caminho equilibra rigor × atalho.",
    ramos: []
  },
  reflexao: {
    enunciado: "Por que o mercado padroniza o flat-forward em vez da interpolação linear na taxa?",
    opcoes: [
      {
        id: "a",
        text: "Porque preserva a multiplicatividade dos fatores (forward constante), evitando arbitragem; o erro da linear é pequeno em prazos curtos, mas sistemático e pode inverter a relação forward em curva invertida",
        correct: true
      },
      {
        id: "b",
        text: "Porque é mais fácil de calcular"
      },
      {
        id: "c",
        text: "Porque a linear não funciona com pós-fixados"
      },
      {
        id: "d",
        text: "Porque a ANBIMA proíbe cálculo composto"
      }
    ],
    feedback: "O flat-forward é coerente com a forma como os fatores se compõem no tempo; a linear é um atalho que acumula viés e, em curva invertida, distorce o sinal da forward.",
    pontos: 25
  },
  pontuacaoMax: 85
};
