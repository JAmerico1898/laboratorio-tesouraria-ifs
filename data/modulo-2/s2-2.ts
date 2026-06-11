import type { Scenario } from "@/lib/types";

export const s2_2: Scenario = {
  id: "s2-2",
  codigo: "S2.2",
  empresa: "Mesa proprietária",
  titulo: "Discordar da forward",
  nivel: "adv",
  duracaoMin: 20,
  contexto: "A <b>forward implícita</b> do trecho <span class=\"num\">63 → 126 du</span> está em <span class=\"num\">13,40% a.a.</span> Seu cenário macro é de <b>corte de Selic</b>, o que tornaria a forward “justa” em torno de <span class=\"num\">12,80%</span>. Você acha que o mercado está <b>caro</b> nesse trecho.",
  chips: [
    {
      k: "Forward 63→126",
      v: "13,40% a.a."
    },
    {
      k: "Sua estimativa",
      v: "≈ 12,80%"
    },
    {
      k: "Visão",
      v: "Corte de Selic"
    },
    {
      k: "Instrumento",
      v: "FRA de DI"
    },
    {
      k: "Limite",
      v: "DV01"
    },
    {
      k: "Base",
      v: "DU/252"
    }
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "Se a sua visão estiver certa (forward realizada ~12,80% < 13,40% de mercado), qual posição ganha?",
      opcoes: [
        {
          id: "a",
          text: "Vender a taxa do trecho (FRA de DI vendido): você 'recebe' 13,40% e espera realizar 12,80%",
          correct: true
        },
        {
          id: "b",
          text: "Comprar a taxa do trecho (FRA de DI comprado), travando 13,40%"
        },
        {
          id: "c",
          text: "Não há instrumento para operar essa visão de curva"
        },
        {
          id: "d",
          text: "Comprar dólar futuro como proxy da queda de juros"
        }
      ],
      feedback: "Forward de mercado (13,40%) acima da sua expectativa (12,80%) → você <b>vende a taxa</b> do trecho. Se a taxa realizada cair, a posição vendida ganha.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "Qual o risco principal dessa posição vendida?",
      opcoes: [
        {
          id: "a",
          text: "Risco de crédito do Tesouro emissor dos títulos"
        },
        {
          id: "b",
          text: "Risco cambial sobre o valor da posição"
        },
        {
          id: "c",
          text: "Se a Selic surpreender para cima, a forward se confirma/sobe e a posição perde — é aposta direcional em juros",
          correct: true
        },
        {
          id: "d",
          text: "Nenhum: é arbitragem pura, sem risco de mercado"
        }
      ],
      feedback: "Operar contra a forward é uma <b>aposta direcional</b>. Não é arbitragem: se a Selic subir, a forward não cai (ou sobe) e a perda é proporcional ao tamanho.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "O que deve definir o tamanho dessa posição?",
      opcoes: [
        {
          id: "a",
          text: "A convicção do gestor, sem necessidade de limite"
        },
        {
          id: "b",
          text: "Nada: o tamanho é livre em FRA de DI"
        },
        {
          id: "c",
          text: "Só o limite de posições cambiais se aplica aqui"
        },
        {
          id: "d",
          text: "O limite de risco (DV01): limites precedem a convicção; tamanho acima do limite exige aprovação",
          correct: true
        }
      ],
      feedback: "O <b>DV01</b> (sensibilidade a 1 bp) mede o risco do trecho. A disciplina é: dimensionar pela tolerância de risco, não pela força da convicção.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Como expressar a discordância da forward?",
    subtitulo: "Aposta direcional — sem resposta “certa”, mas com graus de disciplina.",
    ramos: [
      {
        id: "A",
        rotulo: "Dimensionada",
        titulo: "Vender o trecho dentro do limite de DV01",
        resumo: "Expressa a visão com tamanho compatível com o limite de risco.",
        resultado: {
          titulo: "Disciplinada — risco enquadrado",
          deltas: [
            { k: "Posição", v: "FRA de DI vendido", tone: "neu" },
            { k: "Tamanho", v: "Dentro do DV01", tone: "pos" },
            { k: "Se a Selic cair", v: "Ganha (~12,80%)", tone: "pos" },
            { k: "Se a Selic subir", v: "Perda limitada", tone: "neg" }
          ],
          analise: "Gap de taxa: <code>13,40%−12,80% = 60 bps</code>. Ganho se forward realizar em 12,80%: <code>DV01 × 60 bps</code> — ex. R$ 10.000/bp → R$ 600.000. Cenário adverso (Selic sobe +60 bps, forward → ~14,0%): perda = mesmo valor. O limite de DV01 define o teto: a convicção não reduz a distribuição de probabilidade."
        }
      },
      {
        id: "B",
        rotulo: "Alavancada",
        titulo: "Vender em tamanho cheio (acima do limite)",
        resumo: "Aposta grande na convicção; estoura o limite de DV01.",
        resultado: {
          titulo: "Convicção sem limite — risco alto",
          deltas: [
            { k: "Posição", v: "FRA de DI vendido", tone: "neu" },
            { k: "Tamanho", v: "Acima do DV01", tone: "neg" },
            { k: "Se acertar", v: "Ganho amplificado", tone: "pos" },
            { k: "Se a Selic subir", v: "Perda além do limite", tone: "neg" }
          ],
          analise: "O mesmo gap de 60 bps, mas com DV01 acima do limite — ex. 2× → R$ 20.000/bp. Cenário adverso (+60 bps na Selic): perda = <code>R$ 20.000 × 60 = R$ 1.200.000</code> — o dobro do máximo aprovado. A convicção não altera a distribuição de retornos: operar acima do limite exige aprovação formal, não é decisão da mesa.",
          risco: true
        }
      },
      {
        id: "C",
        rotulo: "De fora",
        titulo: "Não operar — respeitar a forward",
        resumo: "Trata a forward como melhor estimativa e fica neutro.",
        resultado: {
          titulo: "Conservador — sem exposição",
          deltas: [
            { k: "Posição", v: "Nenhuma", tone: "neu" },
            { k: "Risco direcional", v: "Zero", tone: "pos" },
            { k: "Upside da visão", v: "Abdicado", tone: "neg" },
            { k: "Custo", v: "Oportunidade", tone: "neu" }
          ],
          analise: "P&L = zero, independente da realização da forward. Custo de oportunidade: <code>DV01 × 60 bps</code> abdicado se a leitura se confirmar — ex. R$ 600.000 por R$ 10.000/bp. Legítimo quando a convicção não supera o ruído de estimativa ou quando o limite de DV01 já está alocado em outras posições."
        }
      }
    ]
  },
  reflexao: {
    enunciado: "Qual o princípio central ao operar uma discordância da forward de mercado?",
    opcoes: [
      {
        id: "a",
        text: "Se a convicção é alta, dispensa-se o limite de risco"
      },
      {
        id: "b",
        text: "É uma aposta direcional em juros; o limite de risco (DV01/stop) precede a convicção, pois a forward pode se confirmar ou abrir contra você",
        correct: true
      },
      {
        id: "c",
        text: "A forward de mercado é sempre a melhor estimativa; não se opera contra ela"
      },
      {
        id: "d",
        text: "FRA de DI não carrega risco de mercado relevante"
      }
    ],
    feedback: "Discordar da forward é legítimo, mas o tamanho deriva do risco tolerado, com stop definido — não da intensidade da opinião.",
    pontos: 25
  },
  pontuacaoMax: 85
};
