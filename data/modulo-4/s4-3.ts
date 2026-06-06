import type { Scenario } from "@/lib/types";

export const s4_3: Scenario = {
  id: "s4-3",
  codigo: "S4.3",
  empresa: "ALM bancário",
  titulo: "Duration × convexidade na decisão",
  nivel: "adv",
  duracaoMin: 22,
  contexto: "Dois títulos têm a <b>mesma duration (4,2)</b> e <b>convexidades diferentes</b> (<span class=\"num\">C = 12</span> vs <span class=\"num\">C = 24</span>), com preços próximos (PU ≈ R$ 980). Espera-se <b>alta volatilidade</b> de juros. O título mais convexo é ligeiramente mais caro.",
  chips: [
    {
      k: "Dmod (ambos)",
      v: "4,2"
    },
    {
      k: "Título 1",
      v: "C = 12"
    },
    {
      k: "Título 2",
      v: "C = 24"
    },
    {
      k: "PU",
      v: "≈ R$ 980"
    },
    {
      k: "Cenário",
      v: "Alta de vol"
    },
    {
      k: "Prêmio do convexo",
      v: "Ligeiro"
    }
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo: "Fórmula: <code>ΔP = (−Dmod·Δy + ½·C·Δy²)·PU</code>. O termo de convexidade é sempre positivo."
  },
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "Para o título C = 24 (Dmod 4,2, PU R$ 980) e um choque de <b>+50 bps</b>, qual a variação de preço com convexidade?",
      opcoes: [
        {
          id: "a",
          text: "≈ −R$ 20,29",
          correct: true
        },
        {
          id: "b",
          text: "≈ −R$ 20,58"
        },
        {
          id: "c",
          text: "≈ −R$ 19,80"
        },
        {
          id: "d",
          text: "≈ +R$ 20,29"
        }
      ],
      feedback: "<code>ΔP = (−4,2·0,005 + ½·24·0,005²)·980 = (−0,021 + 0,0003)·980 ≈ −R$ 20,29</code>. Só duration daria −20,58; a convexidade <b>suaviza</b> a queda.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "Para ±100 bps, a perda em +100 bps (−39,98) é <b>menor</b> que o ganho em −100 bps (+42,34). Por quê?",
      opcoes: [
        {
          id: "a",
          text: "Convexidade positiva: o termo ½·C·Δy² é sempre positivo — soma ao ganho e abate a perda",
          correct: true
        },
        {
          id: "b",
          text: "Erro de cálculo"
        },
        {
          id: "c",
          text: "Diferença de cupom"
        },
        {
          id: "d",
          text: "Efeito da inflação"
        }
      ],
      feedback: "Como <code>Δy²</code> é positivo nos dois sentidos, o termo de convexidade amplia o ganho na queda e reduz a perda na alta — a assimetria favorável da convexidade positiva.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Por que a convexidade é considerada desejável pelo investidor?",
      opcoes: [
        {
          id: "a",
          text: "A curva preço-taxa é convexa: para o mesmo |Δy|, ganha-se mais na queda e perde-se menos na alta",
          correct: true
        },
        {
          id: "b",
          text: "Reduz o cupom"
        },
        {
          id: "c",
          text: "Elimina o risco de crédito"
        },
        {
          id: "d",
          text: "Diminui a duration"
        }
      ],
      feedback: "A convexidade é uma assimetria a favor do detentor. Funciona como um “seguro” contra grandes movimentos — mas, como todo seguro, tem um custo (prêmio embutido no preço).",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Pagar pela convexidade?",
    subtitulo: "Convexidade é seguro: vale pelo cenário de volatilidade.",
    ramos: []
  },
  reflexao: {
    enunciado: "Como pensar a convexidade numa decisão de carteira?",
    opcoes: [
      {
        id: "a",
        text: "Convexidade é um “seguro” contra grandes movimentos: vale o prêmio quando se espera alta vol (ganha mais na queda, perde menos na alta), mas num mercado de lado o prêmio vira custo morto — a decisão depende da expectativa de vol, não só da duration",
        correct: true
      },
      {
        id: "b",
        text: "Convexidade é sempre melhor; pague o prêmio"
      },
      {
        id: "c",
        text: "Convexidade é irrelevante para a decisão"
      },
      {
        id: "d",
        text: "Convexidade reduz o risco de crédito"
      }
    ],
    feedback: "Duas carteiras de mesma duration não são iguais: a convexidade é o fator que as separa diante de choques. Comprá-la é uma decisão sobre volatilidade futura.",
    pontos: 25
  },
  pontuacaoMax: 85
};
