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
          text: "≈ −R$ 20,58"
        },
        {
          id: "b",
          text: "≈ −R$ 20,29",
          correct: true
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
          text: "É apenas um erro de cálculo na conta"
        },
        {
          id: "b",
          text: "É efeito da diferença de cupom entre os papéis"
        },
        {
          id: "c",
          text: "Convexidade positiva: o termo ½·C·Δy² é sempre positivo — soma ao ganho e abate a perda",
          correct: true
        },
        {
          id: "d",
          text: "É efeito da inflação sobre os fluxos"
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
          text: "Porque a convexidade elimina o risco de crédito"
        },
        {
          id: "c",
          text: "Porque a convexidade diminui a duration"
        },
        {
          id: "d",
          text: "Porque a convexidade reduz o cupom pago"
        }
      ],
      feedback: "A convexidade é uma assimetria a favor do detentor. Funciona como um “seguro” contra grandes movimentos — mas, como todo seguro, tem um custo (prêmio embutido no preço).",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Pagar pela convexidade?",
    subtitulo: "Convexidade é seguro: vale pelo cenário de volatilidade.",
    ramos: [
      {
        id: "A",
        rotulo: "Convexo (C=24)",
        titulo: "Comprar o título mais convexo (C=24)",
        resumo: "Paga o prêmio; assimetria favorável sob alta vol.",
        resultado: {
          titulo: "Seguro contratado — bom sob alta vol",
          deltas: [
            { k: "Convexidade", v: "24 (alta)", tone: "pos" },
            { k: "Sob alta vol", v: "Ganha mais / perde menos", tone: "pos" },
            { k: "Prêmio pago", v: "Ligeiro (mais caro)", tone: "neg" },
            { k: "Se mercado de lado", v: "Prêmio vira custo", tone: "neg" }
          ],
          analise: "<code>ΔP = (−4,2×Δy + ½×24×Δy²)×980</code>. Em +100 bps: <code>(−0,042+0,0012)×980 = −R$ 39,98</code>. Em −100 bps: <code>(+0,042+0,0012)×980 = +R$ 42,34</code>. Assimetria favorável: <code>42,34−39,98 = R$ 2,36/PU</code> por 1% de choque bilateral — o valor do seguro comprado ao pagar o prêmio de convexidade."
        }
      },
      {
        id: "B",
        rotulo: "Pouco convexo (C=12)",
        titulo: "Comprar o título menos convexo (C=12)",
        resumo: "Economiza o prêmio; melhor em mercado de lado.",
        resultado: {
          titulo: "Sem seguro — melhor em mercado calmo",
          deltas: [
            { k: "Convexidade", v: "12 (baixa)", tone: "neu" },
            { k: "Preço", v: "Mais barato", tone: "pos" },
            { k: "Se mercado de lado", v: "Não desperdiça prêmio", tone: "pos" },
            { k: "Sob alta vol", v: "Assimetria menor", tone: "neg" }
          ],
          analise: "<code>ΔP = (−4,2×Δy + ½×12×Δy²)×980</code>. Em +100 bps: <code>(−0,042+0,0006)×980 = −R$ 40,37</code>. Em −100 bps: <code>(+0,042+0,0006)×980 = +R$ 41,15</code>. Assimetria: <code>41,15−40,37 = R$ 0,78/PU</code> — vs R$ 2,36 do C=24. Economiza o prêmio ao custo de R$ 1,58/PU a menos de seguro por 1% de choque bilateral."
        }
      },
      {
        id: "C",
        rotulo: "Só pelo carrego",
        titulo: "Decidir só pelo carrego/preço, ignorando a vol",
        resumo: "Escolhe pelo número de hoje; ignora a expectativa de vol.",
        resultado: {
          titulo: "Processo incompleto — decisão cega à vol",
          deltas: [
            { k: "Critério", v: "Só carrego/preço", tone: "neg" },
            { k: "Expectativa de vol", v: "Ignorada", tone: "neg" },
            { k: "Risco", v: "Pagar/abrir mão na hora errada", tone: "neg" },
            { k: "Convexidade", v: "Tratada como detalhe", tone: "neg" }
          ],
          analise: "PU similar (≈R$ 980) e mesma Dmod (4,2): quem olha só o carrego trata os papéis como idênticos. A diferença de convexidade vale: <code>R$ 2,36−R$ 0,78 = R$ 1,58/PU por 1% de choque bilateral</code>. Em um book de R$ 100 mi (≈102.000 títulos): <code>R$ 1,58×102.000 ≈ R$ 161.000</code> por 1% de movimento — custo implícito de ignorar a convexidade.",
          risco: true
        }
      }
    ]
  },
  reflexao: {
    enunciado: "Como pensar a convexidade numa decisão de carteira?",
    opcoes: [
      {
        id: "a",
        text: "Convexidade é sempre melhor; pague o prêmio em qualquer caso"
      },
      {
        id: "b",
        text: "Convexidade é um “seguro” contra grandes movimentos: vale o prêmio quando se espera alta vol (ganha mais na queda, perde menos na alta), mas num mercado de lado o prêmio vira custo morto — a decisão depende da expectativa de vol, não só da duration",
        correct: true
      },
      {
        id: "c",
        text: "Convexidade é irrelevante para a decisão de carteira"
      },
      {
        id: "d",
        text: "Convexidade serve para reduzir o risco de crédito"
      }
    ],
    feedback: "Duas carteiras de mesma duration não são iguais: a convexidade é o fator que as separa diante de choques. Comprá-la é uma decisão sobre volatilidade futura.",
    pontos: 25
  },
  pontuacaoMax: 85
};
