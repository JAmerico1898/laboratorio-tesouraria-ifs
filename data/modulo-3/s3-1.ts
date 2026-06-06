import type { Scenario } from "@/lib/types";

export const s3_1: Scenario = {
  id: "s3-1",
  codigo: "S3.1",
  empresa: "Mesa de títulos públicos",
  titulo: "Pré ou pós no caixa de 6 meses?",
  nivel: "int",
  duracaoMin: 20,
  contexto: "Você tem <span class=\"num\">R$ 300 mi</span> para aplicar por <span class=\"num\">~126 du</span>. A <b>LTN de 126 du</b> está a <span class=\"num\">11,50% a.a.</span> (PU R$ 947,03). A Selic atual é <span class=\"num\">10,40%</span> e o Focus está <b>dividido</b> entre cortes e estabilidade/alta.",
  chips: [
    {
      k: "Volume",
      v: "R$ 300 mi"
    },
    {
      k: "Prazo",
      v: "126 du"
    },
    {
      k: "LTN 126 du",
      v: "11,50% a.a."
    },
    {
      k: "PU da LTN",
      v: "R$ 947,03"
    },
    {
      k: "Selic atual",
      v: "10,40%"
    },
    {
      k: "Focus",
      v: "Dividido"
    }
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo: "LTN (pré, zero-cupom, <code>PU = 1000/(1+i)^(du/252)</code>), LFT (pós-Selic, marcação estável) e CDB pós (102% CDI, risco de crédito do emissor)."
  },
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "Qual o PU da LTN de 126 du a 11,50% a.a. (VN R$ 1.000, DU/252)?",
      opcoes: [
        {
          id: "a",
          text: "R$ 947,03",
          correct: true
        },
        {
          id: "b",
          text: "R$ 892,86"
        },
        {
          id: "c",
          text: "R$ 1.057,00"
        },
        {
          id: "d",
          text: "R$ 885,00"
        }
      ],
      feedback: "<code>PU = 1000/(1,115)^(126/252) = 1000/√1,115 = 1000/1,05594 ≈ R$ 947,03</code>. O distrator R$ 892,86 usa <code>1000/1,115</code> como se fosse 252 du (1 ano inteiro).",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "Você compra a LTN a 11,50%. Se a Selic <b>cair</b> (a curva pré recua), o que acontece com o PU dessa LTN?",
      opcoes: [
        {
          id: "a",
          text: "O PU sobe — ganho de marcação, pois a taxa de mercado fica abaixo dos 11,50% travados",
          correct: true
        },
        {
          id: "b",
          text: "O PU cai"
        },
        {
          id: "c",
          text: "O PU não muda: a taxa está travada"
        },
        {
          id: "d",
          text: "Depende apenas do CDI diário"
        }
      ],
      feedback: "Em prefixados, preço e taxa andam em sentidos opostos. Travar 11,50% e a curva cair gera <b>ganho de marcação</b> — exatamente o atrativo do pré numa aposta de corte.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Se em vez da LTN você tivesse escolhido <b>LFT</b> e a Selic <b>subisse</b>, o efeito na marcação seria:",
      opcoes: [
        {
          id: "a",
          text: "Mínimo: a LFT acompanha a Selic (VNA), com marcação quase imune ao nível da curva pré",
          correct: true
        },
        {
          id: "b",
          text: "Grande perda de marcação"
        },
        {
          id: "c",
          text: "Grande ganho de marcação"
        },
        {
          id: "d",
          text: "Igual ao da LTN"
        }
      ],
      feedback: "A LFT é pós-Selic: o VNA acompanha a taxa, então sua marcação é muito estável. É o ativo de <b>caixa defensivo</b> quando se teme alta de juros.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Como aplicar os R$ 300 mi?",
    subtitulo: "A escolha expressa sua visão de Selic e seu apetite por marcação.",
    ramos: []
  },
  reflexao: {
    enunciado: "Por que uma LTN longa carrega um payoff direcional assimétrico?",
    opcoes: [
      {
        id: "a",
        text: "É aposta prefixada: acertar o corte gera ganho (limitado), mas errar a direção amplifica a perda pela duration — ganha pouco se a Selic ficar estável e perde muito se subir",
        correct: true
      },
      {
        id: "b",
        text: "Porque a LTN tem risco de crédito do Tesouro"
      },
      {
        id: "c",
        text: "Porque a LFT é mais arriscada que a LTN"
      },
      {
        id: "d",
        text: "Porque o CDB sempre rende mais"
      }
    ],
    feedback: "Quanto maior a duration, maior a sensibilidade do PU à taxa. A LTN longa é uma aposta de convexidade desfavorável ao gestor desatento — daí a disciplina de limite de duration.",
    pontos: 25
  },
  pontuacaoMax: 85
};
