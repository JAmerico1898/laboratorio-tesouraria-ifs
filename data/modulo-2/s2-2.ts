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
          text: "Vender a taxa do trecho (FRA de DI vendido): você “recebe” 13,40% e espera realizar 12,80%",
          correct: true
        },
        {
          id: "b",
          text: "Comprar a taxa do trecho (FRA de DI comprado)"
        },
        {
          id: "c",
          text: "Não há como operar essa visão"
        },
        {
          id: "d",
          text: "Comprar dólar futuro"
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
          text: "Se a Selic surpreender para cima, a forward se confirma/sobe e a posição perde — é aposta direcional em juros",
          correct: true
        },
        {
          id: "b",
          text: "Risco de crédito do Tesouro"
        },
        {
          id: "c",
          text: "Risco cambial"
        },
        {
          id: "d",
          text: "Nenhum: é arbitragem sem risco"
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
          text: "O limite de risco (DV01): limites precedem a convicção; tamanho acima do limite exige aprovação",
          correct: true
        },
        {
          id: "b",
          text: "A convicção do gestor, sem necessidade de limite"
        },
        {
          id: "c",
          text: "O tamanho é livre em FRA de DI"
        },
        {
          id: "d",
          text: "O limite só se aplica a posições cambiais"
        }
      ],
      feedback: "O <b>DV01</b> (sensibilidade a 1 bp) mede o risco do trecho. A disciplina é: dimensionar pela tolerância de risco, não pela força da convicção.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Como expressar a discordância da forward?",
    subtitulo: "Aposta direcional — sem resposta “certa”, mas com graus de disciplina.",
    ramos: []
  },
  reflexao: {
    enunciado: "Qual o princípio central ao operar uma discordância da forward de mercado?",
    opcoes: [
      {
        id: "a",
        text: "É uma aposta direcional em juros; o limite de risco (DV01/stop) precede a convicção, pois a forward pode se confirmar ou abrir contra você",
        correct: true
      },
      {
        id: "b",
        text: "Se a convicção é alta, dispensa-se o limite"
      },
      {
        id: "c",
        text: "A forward de mercado é sempre a melhor estimativa; não se opera contra"
      },
      {
        id: "d",
        text: "FRA de DI não tem risco de mercado"
      }
    ],
    feedback: "Discordar da forward é legítimo, mas o tamanho deriva do risco tolerado, com stop definido — não da intensidade da opinião.",
    pontos: 25
  },
  pontuacaoMax: 85
};
