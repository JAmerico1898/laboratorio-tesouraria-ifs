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
          text: "≈ 5,90% a.a."
        },
        {
          id: "c",
          text: "≈ 6,00% a.a."
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
          text: "É a meta de inflação definida pelo Banco Central"
        },
        {
          id: "b",
          text: "É a inflação garantida pela NTN-B no período"
        },
        {
          id: "c",
          text: "É o cupom real pago pela NTN-B ao investidor"
        },
        {
          id: "d",
          text: "É o breakeven: a inflação na qual pré e IPCA+ rendem o mesmo — acima dela o IPCA+ vence; abaixo, o pré vence",
          correct: true
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
          text: "O pré, sempre, por travar a taxa nominal"
        },
        {
          id: "b",
          text: "IPCA+ (NTN-B): o real é preservado e o nominal supera o pré",
          correct: true
        },
        {
          id: "c",
          text: "A LFT, por acompanhar a Selic diária"
        },
        {
          id: "d",
          text: "Ambos rendem igual, por definição do breakeven"
        }
      ],
      feedback: "Inflação acima do breakeven faz o IPCA+ superar o pré em termos nominais — além de preservar o poder de compra.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Qual indexador escolher?",
    subtitulo: "Depende da sua leitura de inflação vs. o breakeven de 5,66%.",
    ramos: [
      {
        id: "A",
        rotulo: "Pré 12%",
        titulo: "Aplicar 100% pré a 12%",
        resumo: "Vence se a inflação ficar abaixo de 5,66%.",
        resultado: {
          titulo: "Aposta em inflação baixa",
          deltas: [
            { k: "Indexador", v: "Pré 12%", tone: "neu" },
            { k: "Se π < 5,66%", v: "Vence o IPCA+", tone: "pos" },
            { k: "Se π > 5,66%", v: "Perde para o IPCA+", tone: "neg" },
            { k: "Poder de compra", v: "Não protegido", tone: "neg" }
          ],
          analise: "Breakeven: <code>(1,12)/(1,06)−1 ≈ 5,66%</code>. Se π = 4,5% (&lt;5,66%): <code>real do pré = 1,12/1,045−1 ≈ 7,18%</code> vs <code>IPCA+ = 6,0%</code> — pré vence por 1,18 p.p. Se π = 7% (&gt;5,66%): <code>real do pré = 1,12/1,07−1 ≈ 4,67%</code> vs <code>IPCA+ = 6,0%</code> — pré perde por 1,33 p.p. Poder de compra não protegido se π superar 5,66%."
        }
      },
      {
        id: "B",
        rotulo: "IPCA+ 6%",
        titulo: "Aplicar 100% em NTN-B IPCA+6%",
        resumo: "Vence se a inflação superar 5,66%; protege o real.",
        resultado: {
          titulo: "Aposta em inflação alta / proteção real",
          deltas: [
            { k: "Indexador", v: "IPCA + 6%", tone: "neu" },
            { k: "Se π > 5,66%", v: "Vence o pré", tone: "pos" },
            { k: "Poder de compra", v: "Protegido", tone: "pos" },
            { k: "Se π < 5,66%", v: "Rende menos que o pré", tone: "neg" }
          ],
          analise: "Qualquer π: entrega <code>real = 6,0%</code>. Nominal = <code>(1,06)(1+π)−1</code>. Se π = 7%: <code>nominal = 1,06×1,07−1 = 13,42%</code> vs pré 12% → vantagem de +1,42 p.p. Se π = 4% (&lt;5,66%): <code>nominal = 1,06×1,04−1 = 10,24%</code> vs pré 12% → desvantagem de −1,76 p.p. Ponto de indiferença = breakeven de 5,66%."
        }
      },
      {
        id: "C",
        rotulo: "Barbell",
        titulo: "Metade pré, metade IPCA+",
        resumo: "Reparte a aposta de inflação; não maximiza nenhum cenário.",
        resultado: {
          titulo: "Diversificado — não aposta tudo",
          deltas: [
            { k: "Composição", v: "50% pré / 50% IPCA+", tone: "pos" },
            { k: "Erro de leitura", v: "Reduzido", tone: "pos" },
            { k: "Retorno máximo", v: "Abdicado", tone: "neu" },
            { k: "Proteção real", v: "Parcial", tone: "neu" }
          ],
          analise: "Carrego esperado com π = 5%: <code>50%×12% + 50%×[(1,06)(1,05)−1] = 50%×12% + 50%×11,3% = 11,65%</code>. Se π = 3%: <code>50%×12% + 50%×9,18% = 10,59%</code> (vs 12% puro pré). Se π = 8%: <code>50%×12% + 50%×14,48% = 13,24%</code> (vs 14,48% puro IPCA+). Reduz o erro de leitura pela metade ao custo de não maximizar o retorno."
        }
      }
    ]
  },
  reflexao: {
    enunciado: "Qual o papel da inflação implícita (breakeven) na decisão pré × IPCA+?",
    opcoes: [
      {
        id: "a",
        text: "O breakeven garante o retorno nominal do IPCA+"
      },
      {
        id: "b",
        text: "Abaixo do breakeven o IPCA+ sempre vence o pré"
      },
      {
        id: "c",
        text: "É o ponto de indiferença entre os dois: a escolha vira uma aposta sobre a inflação realizada vs. o breakeven, e o barbell é a forma de não apostar tudo numa única leitura",
        correct: true
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
