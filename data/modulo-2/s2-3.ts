import type { Scenario } from "@/lib/types";

export const s2_3: Scenario = {
  id: "s2-3",
  codigo: "S2.3",
  empresa: "Exportador",
  titulo: "Cupom cambial para o exportador",
  nivel: "adv",
  duracaoMin: 22,
  contexto: "Um <b>exportador</b> receberá <span class=\"num\">US$ 10 mi em 180 dc</span>. O dólar pronto é <span class=\"num\">S = R$ 5,00</span>, o futuro de 180 dc está em <span class=\"num\">F = R$ 5,12</span> e o pré de 126 du ≈ <span class=\"num\">12,50% a.a.</span> Você decide a estrutura de hedge e qual cupom cambial usar.",
  chips: [
    {
      k: "Recebível",
      v: "US$ 10 mi"
    },
    {
      k: "Prazo",
      v: "180 dc"
    },
    {
      k: "Dólar pronto (S)",
      v: "R$ 5,00"
    },
    {
      k: "Futuro 180 dc (F)",
      v: "R$ 5,12"
    },
    {
      k: "Pré 126 du",
      v: "12,50% a.a."
    },
    {
      k: "Base cupom",
      v: "360 (dc)"
    }
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "Travando os US$ 10 mi via futuro de dólar a F = 5,12, quantos reais o exportador garante?",
      opcoes: [
        {
          id: "a",
          text: "R$ 50,0 milhões"
        },
        {
          id: "b",
          text: "R$ 5,12 milhões"
        },
        {
          id: "c",
          text: "R$ 512 milhões"
        },
        {
          id: "d",
          text: "R$ 51,2 milhões",
          correct: true
        }
      ],
      feedback: "<code>US$ 10.000.000 × 5,12 = R$ 51,2 mi</code>. Usar o pronto (5,00) daria R$ 50,0 mi, mas o hedge trava o <b>futuro</b>, não o pronto.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "O cupom cambial é o juro em dólar implícito na paridade. Pela aproximação base 360, <code>(1 + cupom·180/360) ≈ (1+i_pré,período) × S/F</code>, quanto é o cupom?",
      opcoes: [
        {
          id: "a",
          text: "≈ 2,4% a.a."
        },
        {
          id: "b",
          text: "≈ 7,2% a.a.",
          correct: true
        },
        {
          id: "c",
          text: "≈ 12,5% a.a."
        },
        {
          id: "d",
          text: "≈ 3,6% a.a."
        }
      ],
      feedback: "<code>(1,125)^(126/252) × (5,00/5,12) = 1,06066 × 0,97656 = 1,0358</code> → <code>cupom = 0,0358 / 0,5 ≈ 7,2% a.a.</code> O distrator 2,4% é apenas o prêmio do dólar <code>(F−S)/S</code>; 12,5% é o pré em reais; 3,6% é o fator do período não anualizado.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Qual a diferença entre cupom cambial <b>limpo</b> e <b>sujo</b>?",
      opcoes: [
        {
          id: "a",
          text: "O limpo usa a PTAX de D−1 (operação 'casada'), eliminando a variação cambial do próprio dia; o sujo usa o dólar pronto de D",
          correct: true
        },
        {
          id: "b",
          text: "O limpo já desconta o IR sobre o cupom"
        },
        {
          id: "c",
          text: "O limpo usa base 252 em vez de 360"
        },
        {
          id: "d",
          text: "O limpo inclui o cupom real da NTN-B no cálculo"
        }
      ],
      feedback: "Cupom limpo = referência casada com PTAX de D−1; isola o juro em dólar da variação cambial intradia. O sujo embute o pronto de D.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Qual estrutura de hedge montar?",
    subtitulo: "Decisão de mandato (previsibilidade × upside), não só de cálculo.",
    ramos: [
      {
        id: "A",
        rotulo: "Hedge cheio",
        titulo: "Travar 100% via futuro/NDF a 5,12",
        resumo: "Garante R$ 51,2 mi; zera o risco cambial e o upside.",
        resultado: {
          titulo: "Previsibilidade total",
          deltas: [
            { k: "Reais travados", v: "R$ 51,2 mi", tone: "pos" },
            { k: "Risco cambial", v: "Zerado", tone: "pos" },
            { k: "Upside se dólar subir", v: "Abdicado", tone: "neg" },
            { k: "Cupom cambial", v: "≈ 7,2% (travado)", tone: "neu" }
          ],
          analise: "Trava: <code>US$ 10 mi × 5,12 = R$ 51,2 mi</code>. Cupom cambial implícito: <code>(1,125)^(126/252) × (5,00/5,12) ≈ 1,0358 → cupom ≈ 7,2% a.a.</code> Recebe R$ 51,2 mi em 180 dc independente do câmbio no vencimento. Se S subir para 5,30: custo de oportunidade = <code>US$ 10 mi × (5,30−5,12) = R$ 1,8 mi</code> não capturados."
        }
      },
      {
        id: "B",
        rotulo: "Hedge parcial",
        titulo: "Travar 50% e deixar 50% exposto",
        resumo: "Metade garantida a 5,12; metade aberta ao câmbio.",
        resultado: {
          titulo: "Equilíbrio — meio-termo",
          deltas: [
            { k: "Reais travados", v: "≈ R$ 25,6 mi", tone: "pos" },
            { k: "Parcela exposta", v: "50% ao câmbio", tone: "neu" },
            { k: "Se dólar subir", v: "Captura metade", tone: "pos" },
            { k: "Se dólar cair", v: "Perde na metade aberta", tone: "neg" }
          ],
          analise: "50% travado: <code>US$ 5 mi × 5,12 = R$ 25,6 mi garantidos</code>. 50% aberto: se S(180dc) = 5,30 → <code>US$ 5 mi × 5,30 = R$ 26,5 mi; total R$ 52,1 mi</code>. Se S cair para 4,80 → <code>US$ 5 mi × 4,80 = R$ 24,0 mi; total R$ 49,6 mi</code> (< R$ 51,2 mi do hedge cheio). A proporção hedge/aberto deve seguir a política, não apenas a visão cambial."
        }
      },
      {
        id: "C",
        rotulo: "Sem hedge",
        titulo: "Não travar — ficar exposto ao câmbio",
        resumo: "Aposta na alta do dólar; recebível fica incerto.",
        resultado: {
          titulo: "Aposta cambial — recebível incerto",
          deltas: [
            { k: "Reais travados", v: "R$ 0", tone: "neg" },
            { k: "Se dólar subir", v: "Ganha tudo", tone: "pos" },
            { k: "Se dólar cair", v: "Recebível encolhe", tone: "neg" },
            { k: "Risco", v: "Cambial pleno", tone: "neg" }
          ],
          analise: "Nenhum travamento. Se S(180dc) = 5,30: <code>US$ 10 mi × 5,30 = R$ 53,0 mi (+R$ 1,8 mi vs hedge cheio)</code>. Se S cair para 4,80: <code>US$ 10 mi × 4,80 = R$ 48,0 mi (−R$ 3,2 mi vs hedge cheio)</code>. O forward de R$ 5,12 já embute um prêmio de R$ 1,2 mi vs o pronto — abrir mão do hedge é apostar contra essa vantagem já embutida na paridade.",
          risco: true
        }
      }
    ]
  },
  reflexao: {
    enunciado: "O que o cupom cambial representa e por que distinguir limpo de sujo?",
    opcoes: [
      {
        id: "a",
        text: "É a variação esperada do câmbio no período do hedge"
      },
      {
        id: "b",
        text: "É o IR incidente sobre a receita de exportação"
      },
      {
        id: "c",
        text: "Limpo e sujo dão sempre exatamente o mesmo número"
      },
      {
        id: "d",
        text: "É a taxa de juro em dólar doméstico implícita na paridade entre pré, pronto e futuro; o cupom limpo (PTAX D−1) isola o juro da variação cambial do dia, sendo a referência para operações casadas",
        correct: true
      }
    ],
    feedback: "O cupom cambial é o “juro do dólar dentro do Brasil”. A distinção limpo/sujo importa porque define se a variação cambial do dia entra ou não na conta.",
    pontos: 25
  },
  pontuacaoMax: 85
};
