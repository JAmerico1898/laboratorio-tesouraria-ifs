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
          text: "A marcação diária a mercado dos dois papéis"
        },
        {
          id: "b",
          text: "A inflação realizada vs. o breakeven (5,66%): a marcação intermediária é irrelevante se carrega até o fim",
          correct: true
        },
        {
          id: "c",
          text: "O rating de crédito do Tesouro Nacional"
        },
        {
          id: "d",
          text: "Apenas o cupom nominal pago pela NTN-F"
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
          text: "Só a inflação realizada lá no vencimento"
        },
        {
          id: "b",
          text: "Nada muda em relação a carregar até o fim"
        },
        {
          id: "c",
          text: "O movimento das curvas (pré e real): a NTN-B ganha se o cupom real cair, a NTN-F se a curva pré cair",
          correct: true
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
          text: "Garante o maior retorno possível em qualquer cenário"
        },
        {
          id: "c",
          text: "Remove totalmente o risco de marcação"
        },
        {
          id: "d",
          text: "Elimina por completo o risco da carteira"
        }
      ],
      feedback: "O barbell reparte a aposta de inflação entre pré e IPCA+: protege contra errar a leitura, mas abre mão de maximizar caso você acerte a direção. Antecipa as estratégias de carteira do Módulo 4.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Como posicionar entre NTN-F e NTN-B?",
    subtitulo: "Depende da sua leitura de inflação e do horizonte.",
    ramos: [
      {
        id: "A",
        rotulo: "NTN-F pré",
        titulo: "Carteira 100% NTN-F (pré 12%)",
        resumo: "Aposta em inflação baixa; carrego nominal travado.",
        resultado: {
          titulo: "Aposta em inflação < breakeven",
          deltas: [
            { k: "Indexador", v: "Pré 12%", tone: "neu" },
            { k: "Se π < 5,66%", v: "Vence a NTN-B", tone: "pos" },
            { k: "Se π > 5,66%", v: "Perde para a NTN-B", tone: "neg" },
            { k: "Marcação (operar)", v: "Sensível à curva pré", tone: "neu" }
          ],
          analise: "Breakeven: <code>(1,12)/(1,06)−1 ≈ 5,66%</code>. Carregando: se π = 4,5% (&lt;5,66%), NTN-F entrega 12% nominal vs NTN-B entrega <code>(1,06)(1,045)−1 = 10,77%</code> — vantagem de +1,23 p.p. Operando: se curva pré recuar 50 bps, ganho de marcação ≈ Dmod(NTN-F) × 0,5% × nocional. Risco: π &gt; 5,66% corrói o real."
        }
      },
      {
        id: "B",
        rotulo: "NTN-B IPCA+",
        titulo: "Carteira 100% NTN-B (IPCA + 6%)",
        resumo: "Protege o real; vence se a inflação superar 5,66%.",
        resultado: {
          titulo: "Proteção real / aposta em inflação alta",
          deltas: [
            { k: "Indexador", v: "IPCA + 6%", tone: "neu" },
            { k: "Poder de compra", v: "Protegido", tone: "pos" },
            { k: "Se π > 5,66%", v: "Vence a NTN-F", tone: "pos" },
            { k: "Marcação (operar)", v: "Sensível ao cupom real", tone: "neu" }
          ],
          analise: "Carregando: se π = 7% (&gt;5,66%), NTN-B entrega <code>(1,06)(1,07)−1 = 13,42%</code> nominal vs NTN-F 12% — vantagem de +1,42 p.p. Operando: se cupom real de mercado cair de 6,0% para 5,5% (−50 bps), ganho de marcação ≈ Dmod(NTN-B) × 0,5% × nocional. Se π = 4% (&lt;5,66%): <code>(1,06)(1,04)−1 = 10,24%</code> vs NTN-F 12% — desvantagem de −1,76 p.p."
        }
      },
      {
        id: "C",
        rotulo: "Barbell",
        titulo: "Barbell: parte NTN-F, parte NTN-B",
        resumo: "Diversifica o indexador; reduz o erro de leitura de inflação.",
        resultado: {
          titulo: "Diversificado — robusto à leitura",
          deltas: [
            { k: "Composição", v: "NTN-F + NTN-B", tone: "pos" },
            { k: "Erro de leitura", v: "Reduzido", tone: "pos" },
            { k: "Retorno máximo", v: "Abdicado", tone: "neu" },
            { k: "Indexador", v: "Pré + real", tone: "pos" }
          ],
          analise: "Se π = 4,5%: <code>50%×12% + 50%×10,77% = 11,39%</code> nominal. Se π = 7%: <code>50%×12% + 50%×13,42% = 12,71%</code>. Desvio máximo do ótimo ≈ metade do ganho de acertar a direção — o custo de não apostar tudo numa só leitura. Antecipa as estratégias de carteira do Módulo 4."
        }
      }
    ]
  },
  reflexao: {
    enunciado: "No apreçamento de NTN-F × NTN-B, por que decidir <b>carregar</b> ou <b>operar</b> muda a análise?",
    opcoes: [
      {
        id: "a",
        text: "Carregar e operar são equivalentes para o resultado"
      },
      {
        id: "b",
        text: "Se carrega até o vencimento, só importa a inflação realizada vs. o breakeven; se opera marcação, os movimentos das curvas pré e real passam a dominar o resultado antes do vencimento",
        correct: true
      },
      {
        id: "c",
        text: "A marcação nunca importa em título público federal"
      },
      {
        id: "d",
        text: "Só o breakeven importa, em qualquer horizonte"
      }
    ],
    feedback: "O horizonte define o que precifica: fluxo final (carregar) ou preço de mercado (operar). A mesma posição tem riscos diferentes conforme a intenção de manter ou negociar.",
    pontos: 25
  },
  pontuacaoMax: 85
};
