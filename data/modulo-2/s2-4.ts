import type { Scenario } from "@/lib/types";

export const s2_4: Scenario = {
  id: "s2-4",
  codigo: "S2.4",
  empresa: "Gestor de renda fixa",
  titulo: "Inflação implícita: pré ou IPCA+?",
  nivel: "int",
  duracaoMin: 18,
  contexto: "Aplicação de <span class=\"num\">2 anos</span> (504 du). O <b>pré</b> está a <span class=\"num\">12,00% a.a.</span> e a <b>NTN-B</b> de prazo equivalente paga <span class=\"num\">IPCA + 6,00%</span>. Você precisa decidir o indexador a partir da inflação implícita.",
  chips: [
    {
      k: "Horizonte",
      v: "504 du (2 anos)"
    },
    {
      k: "Pré",
      v: "12,00% a.a."
    },
    {
      k: "NTN-B (real)",
      v: "IPCA + 6,00%"
    },
    {
      k: "Breakeven",
      v: "≈ 5,66%"
    },
    {
      k: "Base",
      v: "DU/252"
    },
    {
      k: "Decisão",
      v: "Pré × IPCA+ × Barbell"
    }
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "Qual a inflação implícita (breakeven) entre o pré 12,00% e a NTN-B IPCA+6,00%?",
      opcoes: [
        {
          id: "a",
          text: "≈ 5,66% a.a.",
          correct: true
        },
        {
          id: "b",
          text: "≈ 6,00% a.a."
        },
        {
          id: "c",
          text: "≈ 5,90% a.a."
        },
        {
          id: "d",
          text: "≈ 18,00% a.a."
        }
      ],
      feedback: "<code>(1,12)/(1,06) − 1 = 1,05660 − 1 ≈ 5,66%</code>. O distrator 6,00% é a diferença simples (12% − 6%), que ignora o termo cruzado da composição.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "O que significa essa inflação implícita de 5,66%?",
      opcoes: [
        {
          id: "a",
          text: "É o breakeven: a inflação na qual pré e IPCA+ rendem o mesmo — acima dela o IPCA+ vence; abaixo, o pré vence",
          correct: true
        },
        {
          id: "b",
          text: "É a meta de inflação do Banco Central"
        },
        {
          id: "c",
          text: "É a inflação garantida pela NTN-B"
        },
        {
          id: "d",
          text: "É o cupom real da NTN-B"
        }
      ],
      feedback: "O breakeven é o ponto de indiferença. A decisão pré × IPCA+ vira uma <b>aposta</b> sobre a inflação realizada em relação a 5,66%.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Você acredita que a inflação dos próximos 2 anos ficará <b>acima</b> de 5,66%. Qual título tende a entregar mais?",
      opcoes: [
        {
          id: "a",
          text: "IPCA+ (NTN-B): o real é preservado e o nominal supera o pré",
          correct: true
        },
        {
          id: "b",
          text: "O pré, sempre"
        },
        {
          id: "c",
          text: "A LFT"
        },
        {
          id: "d",
          text: "Ambos rendem igual por definição"
        }
      ],
      feedback: "Inflação acima do breakeven faz o IPCA+ superar o pré em termos nominais — além de preservar o poder de compra.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Qual indexador escolher?",
    subtitulo: "Depende da sua leitura de inflação vs. o breakeven de 5,66%.",
    ramos: []
  },
  reflexao: {
    enunciado: "Qual o papel da inflação implícita (breakeven) na decisão pré × IPCA+?",
    opcoes: [
      {
        id: "a",
        text: "É o ponto de indiferença entre os dois: a escolha vira uma aposta sobre a inflação realizada vs. o breakeven, e o barbell é a forma de não apostar tudo numa única leitura",
        correct: true
      },
      {
        id: "b",
        text: "O breakeven garante o retorno do IPCA+"
      },
      {
        id: "c",
        text: "Abaixo do breakeven o IPCA+ sempre vence"
      },
      {
        id: "d",
        text: "A inflação implícita é irrelevante para a decisão"
      }
    ],
    feedback: "O breakeven traduz a curva numa pergunta única: “a inflação virá acima ou abaixo de 5,66%?”. O barbell é a resposta para quem não quer apostar tudo na própria leitura.",
    pontos: 25
  },
  pontuacaoMax: 85
};
