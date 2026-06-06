import type { Scenario } from "@/lib/types";

export const s3_4: Scenario = {
  id: "s3-4",
  codigo: "S3.4",
  empresa: "Gestor de crédito privado",
  titulo: "Inflação implícita: NTN-F × NTN-B",
  nivel: "int",
  duracaoMin: 18,
  contexto: "Você compara uma <b>NTN-F</b> (pré) a <span class=\"num\">~12,0% a.a.</span> com uma <b>NTN-B</b> de prazo equivalente pagando <span class=\"num\">IPCA + 6,0%</span>. A inflação implícita (breakeven) é <span class=\"num\">~5,66%</span>. A decisão depende da inflação esperada <b>e</b> de você carregar ou operar a marcação.",
  chips: [
    {
      k: "NTN-F (pré)",
      v: "~12,0% a.a."
    },
    {
      k: "NTN-B (real)",
      v: "IPCA + 6,0%"
    },
    {
      k: "Breakeven",
      v: "~5,66%"
    },
    {
      k: "Horizonte",
      v: "Carregar × Operar"
    },
    {
      k: "Tamanho",
      v: "Plena × Barbell"
    },
    {
      k: "Base",
      v: "DU/252"
    }
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo: "Breakeven: <code>(1,12)/(1,06) − 1 ≈ 5,66%</code>. Diferença em relação à S2.4: aqui o foco é <b>apreçamento/marcação</b> e o efeito de <b>carregar até o vencimento × operar</b>."
  },
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "Se você vai <b>carregar até o vencimento</b>, o que determina o vencedor entre NTN-F e NTN-B?",
      opcoes: [
        {
          id: "a",
          text: "A inflação realizada vs. o breakeven (5,66%): a marcação intermediária é irrelevante se carrega até o fim",
          correct: true
        },
        {
          id: "b",
          text: "A marcação diária a mercado"
        },
        {
          id: "c",
          text: "O rating de crédito do Tesouro"
        },
        {
          id: "d",
          text: "Apenas o cupom nominal da NTN-F"
        }
      ],
      feedback: "Carregando até o vencimento, o resultado se resolve no fluxo final: se a inflação superar 5,66%, a NTN-B vence; abaixo, a NTN-F. Oscilações de preço pelo caminho não alteram o desfecho.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "Se em vez de carregar você vai <b>operar a marcação</b>, o que passa a importar mais?",
      opcoes: [
        {
          id: "a",
          text: "O movimento das curvas (pré e real): a NTN-B ganha se o cupom real cair, a NTN-F se a curva pré cair",
          correct: true
        },
        {
          id: "b",
          text: "Só a inflação realizada no vencimento"
        },
        {
          id: "c",
          text: "Nada muda em relação a carregar"
        },
        {
          id: "d",
          text: "Apenas o IPCA do mês corrente"
        }
      ],
      feedback: "Operando marcação, o ganho/perda vem do <b>preço antes do vencimento</b>: cada título responde à sua própria curva (real para a NTN-B, pré para a NTN-F).",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Qual a vantagem de montar um <b>barbell</b> (parte NTN-F, parte NTN-B)?",
      opcoes: [
        {
          id: "a",
          text: "Diversifica o indexador e reduz o erro de leitura de inflação, ao custo de não maximizar o retorno",
          correct: true
        },
        {
          id: "b",
          text: "Elimina todo o risco da carteira"
        },
        {
          id: "c",
          text: "Garante o maior retorno possível"
        },
        {
          id: "d",
          text: "Remove o risco de marcação"
        }
      ],
      feedback: "O barbell reparte a aposta de inflação entre pré e IPCA+: protege contra errar a leitura, mas abre mão de maximizar caso você acerte a direção. Antecipa as estratégias de carteira do Módulo 4.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Como posicionar entre NTN-F e NTN-B?",
    subtitulo: "Depende da sua leitura de inflação e do horizonte.",
    ramos: []
  },
  reflexao: {
    enunciado: "No apreçamento de NTN-F × NTN-B, por que decidir <b>carregar</b> ou <b>operar</b> muda a análise?",
    opcoes: [
      {
        id: "a",
        text: "Se carrega até o vencimento, só importa a inflação realizada vs. o breakeven; se opera marcação, os movimentos das curvas pré e real passam a dominar o resultado antes do vencimento",
        correct: true
      },
      {
        id: "b",
        text: "Carregar e operar são equivalentes"
      },
      {
        id: "c",
        text: "A marcação nunca importa em título público"
      },
      {
        id: "d",
        text: "Só o breakeven importa em qualquer caso"
      }
    ],
    feedback: "O horizonte define o que precifica: fluxo final (carregar) ou preço de mercado (operar). A mesma posição tem riscos diferentes conforme a intenção de manter ou negociar.",
    pontos: 25
  },
  pontuacaoMax: 85
};
