import type { Scenario } from "@/lib/types";

export const s4_4: Scenario = {
  id: "s4-4",
  codigo: "S4.4",
  empresa: "Comitê de investimentos",
  titulo: "Imunizando um passivo de 3 anos",
  nivel: "adv",
  duracaoMin: 22,
  contexto: "Você precisa proteger um <b>passivo de R$ 100 mi</b> com <b>duration 3,0</b> contra variações da curva. Estão disponíveis <span class=\"num\">zeros de 1 e 5 anos</span> e um <b>choque de juros é possível</b> — paralelo ou não-paralelo.",
  chips: [
    {
      k: "Passivo",
      v: "R$ 100 mi"
    },
    {
      k: "Duration-alvo",
      v: "3,0"
    },
    {
      k: "Ativos disponíveis",
      v: "Zeros 1a e 5a"
    },
    {
      k: "Estratégias",
      v: "Cash-flow × Barbell"
    },
    {
      k: "Choque",
      v: "Paralelo / Steepening"
    },
    {
      k: "Regra",
      v: "w·1 + (1−w)·5 = 3"
    }
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "O que a imunização por duration busca?",
      opcoes: [
        {
          id: "a",
          text: "Casar a duration (e o VP) de ativos e passivos para neutralizar o risco de juros",
          correct: true
        },
        {
          id: "b",
          text: "Eliminar o risco de crédito"
        },
        {
          id: "c",
          text: "Maximizar o cupom"
        },
        {
          id: "d",
          text: "Zerar a inflação"
        }
      ],
      feedback: "O objetivo é proteger o valor de um passivo/objetivo futuro contra variações da taxa, casando duration e valor presente entre ativos e passivos.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "Para atingir duration-alvo 3,0 com zeros de 1 e 5 anos (barbell), quais os pesos?",
      opcoes: [
        {
          id: "a",
          text: "50% / 50%",
          correct: true
        },
        {
          id: "b",
          text: "25% / 75%"
        },
        {
          id: "c",
          text: "75% / 25%"
        },
        {
          id: "d",
          text: "0% / 100%"
        }
      ],
      feedback: "<code>w·1 + (1−w)·5 = 3 → w = 0,5</code>. Metade em 1 ano e metade em 5 anos atinge duration 3,0 — com mais convexidade que um bullet de 3 anos.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "A carteira está imunizada (duration ativo = passivo) e a curva sofre <b>steepening</b> (movimento não-paralelo). O que ocorre?",
      opcoes: [
        {
          id: "a",
          text: "Descasamento residual: a imunização por duration protege contra choque paralelo, não contra inclinação/curvatura",
          correct: true
        },
        {
          id: "b",
          text: "A imunização é perfeita e nada muda"
        },
        {
          id: "c",
          text: "A convexidade some"
        },
        {
          id: "d",
          text: "O risco de crédito aumenta"
        }
      ],
      feedback: "Duration assume choque paralelo. Movimentos de inclinação/curvatura geram risco residual — daí o uso de medidas por fator (key-rate durations) e rebalanceamento.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Qual estratégia de proteção adotar?",
    subtitulo: "Precisão × custo × robustez a choques não-paralelos.",
    ramos: []
  },
  reflexao: {
    enunciado: "Qual a principal limitação da imunização por duration e como mitigá-la?",
    opcoes: [
      {
        id: "a",
        text: "Ela protege contra deslocamentos paralelos; inclinação/curvatura geram descasamento residual — mitiga-se com cash-flow matching (robusto, caro) ou com medidas por fator (key-rate) e rebalanceamento",
        correct: true
      },
      {
        id: "b",
        text: "Não tem limitação: é perfeita"
      },
      {
        id: "c",
        text: "A limitação é o risco de crédito"
      },
      {
        id: "d",
        text: "A duration captura qualquer formato de curva"
      }
    ],
    feedback: "Casar duration é necessário, mas não suficiente: a curva se move em nível, inclinação e curvatura. Proteger só o nível deixa um resíduo que exige cash-flow matching ou gestão por fator.",
    pontos: 25
  },
  pontuacaoMax: 85
};
