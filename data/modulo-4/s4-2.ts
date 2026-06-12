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
          text: "R$ 380.000/bp (Dmod × PV sem o fator 0,0001)"
        },
        {
          id: "c",
          text: "R$ 3.800/bp (aplica 0,001 em vez de 0,0001 sobre Dmod × PV)"
        },
        {
          id: "d",
          text: "R$ 380/bp (divide por 100 mi em vez de multiplicar o PV)"
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
          text: "R$ 25.000/bp (confunde o limite-alvo com a redução necessária)"
        },
        {
          id: "b",
          text: "R$ 38.000/bp (zera o DV01 ao invés de enquadrá-lo no limite)"
        },
        {
          id: "c",
          text: "R$ 63.000/bp (soma limite e DV01 atual em vez de subtrair)"
        },
        {
          id: "d",
          text: "≈ R$ 13.000/bp (de 38 para 25 → Dmod de 3,8 para ~2,5)",
          correct: true
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
          text: "Porque a LFT paga um cupom maior que o pré — o excesso de carrego sobre a taxa prefixada absorve parte do DV01 e reduz a sensibilidade líquida do book"
        },
        {
          id: "b",
          text: "A LFT é pós-Selic, com duration de taxa pré ~zero (marcação estável) — não contribui para o DV01 da curva pré",
          correct: true
        },
        {
          id: "c",
          text: "Porque a LFT tem mais convexidade que o pré — a curvatura positiva do título pós-fixado compensa o DV01 do prefixado e neutraliza o risco de taxa do book"
        },
        {
          id: "d",
          text: "Porque a LFT elimina o risco de crédito do book — sendo emitida pelo Tesouro, substitui papéis privados e remove o spread de crédito que infla o DV01 da carteira"
        }
      ],
      feedback: "Como o VNA da LFT acompanha a Selic, sua sensibilidade à curva pré é mínima. Substituir pré por LFT corta o DV01 de forma estrutural (no balanço), não apenas via derivativo.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Como enquadrar o book no limite?",
    subtitulo: "Reduzir risco no balanço, via derivativo, ou não agir.",
    ramos: [
      {
        id: "A",
        rotulo: "LFT no balanço",
        titulo: "Trocar pré por LFT (reduzir no balanço)",
        resumo: "Corta o DV01 de forma estrutural; baixa a Dmod.",
        resultado: {
          titulo: "Corte estrutural do DV01",
          deltas: [
            { k: "Ação", v: "Pré → LFT", tone: "neu" },
            { k: "DV01", v: "Reduzido p/ ≤ 25 mil", tone: "pos" },
            { k: "Dmod", v: "3,8 → ~2,5", tone: "pos" },
            { k: "Custo", v: "Realiza marcação / gira book", tone: "neg" }
          ],
          analise: "DV01 atual: <code>3,8×100mi×0,0001 = R$ 38.000/bp</code>. Dmod alvo: <code>25.000/(100mi×0,0001) = 2,5</code>. Fração a substituir: <code>(3,8−2,5)/3,8 ≈ 34%</code> do book pré → LFT (Dmod pré ≈ 0). Novo DV01: <code>2,5×100mi×0,0001 = R$ 25.000/bp ✓</code>. Corte estrutural no balanço; custo = girar ~R$ 34 mi e eventualmente realizar marcação."
        }
      },
      {
        id: "B",
        rotulo: "DI futuro",
        titulo: "Hedgear via DI futuro (overlay)",
        resumo: "Corta o DV01 sem vender os papéis; mantém o book.",
        resultado: {
          titulo: "Overlay — hedge sem girar o book",
          deltas: [
            { k: "Ação", v: "Vender DI futuro", tone: "neu" },
            { k: "DV01", v: "Reduzido p/ ≤ 25 mil", tone: "pos" },
            { k: "Papéis do book", v: "Mantidos", tone: "pos" },
            { k: "Custo", v: "Margem / ajuste diário", tone: "neg" }
          ],
          analise: "Vender DI futuro com DV01 de <code>R$ 13.000/bp</code> (= R$ 38.000 − R$ 25.000). DV01 resultante: <code>R$ 38.000 − R$ 13.000 = R$ 25.000/bp ✓</code>. Sem girar os papéis do book; o ajuste é rápido e reversível. Custo: margem de garantia + ajuste diário do futuro. Adequado se a alta de vol for temporária."
        }
      },
      {
        id: "C",
        rotulo: "Não agir",
        titulo: "Não agir — esperar a vol passar",
        resumo: "Mantém DV01 acima do limite; aposta na calmaria.",
        resultado: {
          titulo: "Acima do limite — risco descoberto",
          deltas: [
            { k: "DV01", v: "R$ 38 mil (> limite)", tone: "neg" },
            { k: "Enquadramento", v: "Estourado", tone: "neg" },
            { k: "Se a vol subir", v: "Perda além do apetite", tone: "neg" },
            { k: "Governança", v: "Limite violado", tone: "neg" }
          ],
          analise: "DV01 permanece em R$ 38.000/bp — <code>R$ 13.000/bp acima do limite</code>. Para choque de +100 bps: perda = <code>R$ 38.000 × 100 = R$ 3,8 mi</code> vs máximo autorizado de <code>R$ 25.000 × 100 = R$ 2,5 mi</code>. Excesso: <code>R$ 1,3 mi por 100 bps</code> de choque — fora do mandato, passível de acionamento imediato do comitê de risco.",
          risco: true
        }
      }
    ]
  },
  reflexao: {
    enunciado: "O que o DV01 e seu limite representam na gestão do book?",
    opcoes: [
      {
        id: "a",
        text: "O limite de DV01 é apenas uma sugestão flexível: o gestor pode excedê-lo quando tem convicção direcional forte — o comitê de risco avalia caso a caso e a penalidade é só documental, sem impacto no mandato de gestão"
      },
      {
        id: "b",
        text: "DV01 mede o risco de crédito do book: quanto maior o spread dos emissores, maior o DV01 — o limite serve para controlar a concentração em papéis de menor rating e proteger o portfólio de eventos de default"
      },
      {
        id: "c",
        text: "DV01 é a métrica linear de risco de taxa (perda/ganho por bp); o limite é disciplina obrigatória — ao estourá-lo, reduz-se duration (LFT/venda de longos) ou hedgeia-se (DI futuro), nunca se ignora",
        correct: true
      },
      {
        id: "d",
        text: "Estar acima do limite não tem consequência se a vol cair: quando a volatilidade recua, o DV01 elevado se converte em ganho — o excesso de risco funciona como alavancagem natural e compensa o custo de enquadramento"
      }
    ],
    feedback: "O limite traduz o apetite de risco da instituição em um número operável. Geri-lo é rotina: diagnosticar, enquadrar e documentar — antes do movimento de mercado, não depois.",
    pontos: 25
  },
  pontuacaoMax: 85
};
