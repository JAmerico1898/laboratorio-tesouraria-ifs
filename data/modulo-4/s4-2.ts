import type { Scenario } from "@/lib/types";

export const s4_2: Scenario = {
  id: "s4-2",
  codigo: "S4.2",
  empresa: "Gestor de renda fixa",
  titulo: "Gerindo o DV01 do book",
  nivel: "adv",
  duracaoMin: 20,
  contexto: "Seu book tem <b>Dmod 3,8</b> e <b>PV de R$ 100 mi</b>. O limite interno de risco é <span class=\"num\">R$ 25 mil/bp</span> de DV01 e espera-se <b>alta de volatilidade</b> de juros. Você precisa diagnosticar e enquadrar o risco.",
  chips: [
    {
      k: "Dmod",
      v: "3,8"
    },
    {
      k: "PV do book",
      v: "R$ 100 mi"
    },
    {
      k: "Limite DV01",
      v: "R$ 25 mil/bp"
    },
    {
      k: "Cenário",
      v: "Alta de vol"
    },
    {
      k: "Ferramentas",
      v: "LFT · DI futuro"
    },
    {
      k: "Fórmula",
      v: "Dmod×PV×0,0001"
    }
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "Qual o DV01 do book (variação de valor para +1 bp)?",
      opcoes: [
        {
          id: "a",
          text: "R$ 38.000/bp",
          correct: true
        },
        {
          id: "b",
          text: "R$ 3.800/bp"
        },
        {
          id: "c",
          text: "R$ 380.000/bp"
        },
        {
          id: "d",
          text: "R$ 380/bp"
        }
      ],
      feedback: "<code>DV01 = Dmod × PV × 0,0001 = 3,8 × 100.000.000 × 0,0001 = R$ 38.000/bp</code>. É a métrica linear de risco de taxa da mesa.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "O limite é R$ 25 mil/bp. Quanto de DV01 precisa ser reduzido para enquadrar?",
      opcoes: [
        {
          id: "a",
          text: "≈ R$ 13.000/bp (de 38 para 25 → Dmod de 3,8 para ~2,5)",
          correct: true
        },
        {
          id: "b",
          text: "R$ 25.000/bp"
        },
        {
          id: "c",
          text: "R$ 38.000/bp"
        },
        {
          id: "d",
          text: "R$ 63.000/bp"
        }
      ],
      feedback: "<code>38.000 − 25.000 = R$ 13.000/bp</code>. Equivale a baixar a Dmod para <code>25.000 / (100mm × 0,0001) = 2,5</code> — reduzir cerca de 34% do risco de taxa.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Por que trocar parte do book pré por <b>LFT</b> reduz o DV01?",
      opcoes: [
        {
          id: "a",
          text: "A LFT é pós-Selic, com duration de taxa pré ~zero (marcação estável) — não contribui para o DV01 da curva pré",
          correct: true
        },
        {
          id: "b",
          text: "Porque a LFT tem cupom maior"
        },
        {
          id: "c",
          text: "Porque a LFT tem mais convexidade"
        },
        {
          id: "d",
          text: "Porque a LFT elimina o risco de crédito"
        }
      ],
      feedback: "Como o VNA da LFT acompanha a Selic, sua sensibilidade à curva pré é mínima. Substituir pré por LFT corta o DV01 de forma estrutural (no balanço), não apenas via derivativo.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Como enquadrar o book no limite?",
    subtitulo: "Reduzir risco no balanço, via derivativo, ou não agir.",
    ramos: []
  },
  reflexao: {
    enunciado: "O que o DV01 e seu limite representam na gestão do book?",
    opcoes: [
      {
        id: "a",
        text: "DV01 é a métrica linear de risco de taxa (perda/ganho por bp); o limite é disciplina obrigatória — ao estourá-lo, reduz-se duration (LFT/venda de longos) ou hedgeia-se (DI futuro), nunca se ignora",
        correct: true
      },
      {
        id: "b",
        text: "O limite é uma sugestão flexível"
      },
      {
        id: "c",
        text: "DV01 mede risco de crédito"
      },
      {
        id: "d",
        text: "Estar acima do limite não tem consequência se a vol cair"
      }
    ],
    feedback: "O limite traduz o apetite de risco da instituição em um número operável. Geri-lo é rotina: diagnosticar, enquadrar e documentar — antes do movimento de mercado, não depois.",
    pontos: 25
  },
  pontuacaoMax: 85
};
