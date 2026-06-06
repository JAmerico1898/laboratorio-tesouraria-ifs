import type { Scenario } from "@/lib/types";

export const s1_4: Scenario = {
  id: "s1-4",
  codigo: "S1.4",
  empresa: "Mandato de juro real",
  titulo: "Fisher na prática: defendendo o juro real",
  nivel: "adv",
  duracaoMin: 22,
  contexto:
    'Seu mandato é <b>preservar 6,5% de juro real</b> em uma aplicação de <span class="num">12 meses</span>. O Focus projeta inflação de <span class="num">4,5%</span>. Você decide o indexador e a taxa exigida para defender o real mesmo sob incerteza inflacionária.',
  chips: [
    { k: "Mandato (real)", v: "6,5% a.a." },
    { k: "Horizonte", v: "12 meses" },
    { k: "Inflação (Focus)", v: "4,5%" },
    { k: "Pré (trava nominal)", v: "11,0% / 11,29%" },
    { k: "IPCA+ (real)", v: "+5,5% / +6,0%" },
    { k: "Equação", v: "Fisher" },
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo:
      "Equação de Fisher: <code>(1 + i) = (1 + r)(1 + π)</code>. O valor que trava exatamente 6,5% real com inflação de 4,5% é <code>i = 11,29%</code>. A soma simples (6,5% + 4,5% = 11,0%) ignora o termo cruzado <code>r·π</code>.",
  },
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1 — Taxa nominal por Fisher",
      enunciado:
        "Pela equação de Fisher, qual taxa nominal trava exatamente <b>6,5% real</b> com inflação esperada de <b>4,5%</b>?",
      opcoes: [
        { id: "a", text: "11,29% a.a.", correct: true },
        { id: "b", text: "11,00% a.a." },
        { id: "c", text: "10,77% a.a." },
        { id: "d", text: "9,55% a.a." },
      ],
      feedback:
        "<code>(1+i) = (1,065)(1,045) = 1,112925 → i = 11,29%</code>. O distrator 11,00% é a soma simples (6,5% + 4,5%) que ignora o termo cruzado; 10,77% usa 6,0% real por engano.",
      pontos: 20,
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2 — O termo cruzado",
      enunciado:
        "Por que somar simplesmente juro real + inflação (= 11,00%) subdimensiona a taxa nominal?",
      opcoes: [
        {
          id: "a",
          text: "Ignora o termo cruzado r·π de Fisher (≈ 0,065 × 0,045 ≈ 0,29 p.p.)",
          correct: true,
        },
        { id: "b", text: "Porque a inflação será maior que 4,5%" },
        { id: "c", text: "Porque o IR incide sobre o rendimento" },
        { id: "d", text: "Não subdimensiona: a soma simples está correta" },
      ],
      feedback:
        "<code>(1+r)(1+π) = 1 + r + π + r·π</code>. O termo <code>r·π ≈ 0,29 p.p.</code> é o que falta na soma simples — pequeno, mas é a diferença entre travar e não travar o mandato.",
      pontos: 20,
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3 — Indexador sob incerteza",
      enunciado:
        "Havendo <b>incerteza relevante</b> sobre a inflação realizada, qual indexador protege melhor o mandato de juro real?",
      opcoes: [
        {
          id: "a",
          text: "IPCA+ (NTN-B): entrega o cupom real independentemente da inflação realizada",
          correct: true,
        },
        { id: "b", text: "Prefixado, sempre" },
        { id: "c", text: "LFT / pós-Selic" },
        { id: "d", text: "Tanto faz sob incerteza" },
      ],
      feedback:
        "O IPCA+ corrige o principal pela inflação e paga um cupom real fixo — protege o real <b>aconteça o que acontecer</b> com a inflação. O pré só trava o real se a inflação vier <i>exatamente</i> como esperado.",
      pontos: 20,
    },
  ],
  encruzilhada: {
    titulo: "Como defender o juro real?",
    subtitulo: "A escolha depende da sua convicção sobre a inflação.",
    ramos: [
      {
        id: "A",
        rotulo: "Travar nominal",
        titulo: "Pré a 11,29%",
        resumo: "Trava 6,5% real se a inflação ficar em 4,5%.",
        resultado: {
          titulo: "Pré 11,29% — trava condicional",
          deltas: [
            { k: "Real (se π=4,5%)", v: "6,5%", tone: "pos" },
            { k: "Nominal travado", v: "11,29%", tone: "neu" },
            { k: "Se π > 4,5%", v: "Real corroído", tone: "neg" },
            { k: "Risco", v: "Surpresa inflacionária", tone: "neg" },
          ],
          analise:
            "Cumpre o mandato <b>exatamente</b> no cenário central. O risco é assimétrico: se a inflação surpreender para cima, o real entregue cai abaixo de 6,5%.",
        },
      },
      {
        id: "B",
        rotulo: "Proteção real",
        titulo: "IPCA+ 6,0%",
        resumo: "Garante o real qualquer que seja a inflação.",
        resultado: {
          titulo: "IPCA+ 6,0% — proteção plena",
          deltas: [
            { k: "Real garantido", v: "6,0% + IPCA", tone: "pos" },
            { k: "Dependência da inflação", v: "Nenhuma", tone: "pos" },
            { k: "Risco residual", v: "Marcação (cupom real)", tone: "neg" },
            { k: "Sob incerteza", v: "Superior ao pré", tone: "pos" },
          ],
          analise:
            "Proteção superior ao pré quando a inflação é incerta: o real fica garantido. O risco que sobra não é inflação (coberta), e sim <b>marcação</b> se o cupom real exigido subir antes do vencimento.",
        },
      },
      {
        id: "C",
        rotulo: "Subdimensionado",
        titulo: "Pré a 11,0% (soma simples)",
        resumo: "Entrega menos que o mandato — armadilha do termo cruzado.",
        resultado: {
          titulo: "Pré 11,0% — abaixo do mandato",
          deltas: [
            { k: "Real (se π=4,5%)", v: "≈ 6,2%", tone: "neg" },
            { k: "Mandato", v: "Não cumprido", tone: "neg" },
            { k: "Se π sobe", v: "Cai mais", tone: "neg" },
            { k: "Causa", v: "Termo cruzado ignorado", tone: "neg" },
          ],
          analise:
            "A soma simples entrega só <code>1,11/1,045 − 1 ≈ 6,2%</code> real a 4,5% de inflação — <b>abaixo</b> do mandato de 6,5% — e piora se a inflação subir. Ilustra por que o termo cruzado de Fisher importa na prática.",
          risco: true,
        },
      },
    ],
  },
  reflexao: {
    enunciado:
      "Qual a lição central de Fisher para defender um mandato de juro real sob incerteza inflacionária?",
    opcoes: [
      {
        id: "a",
        text: "O termo cruzado importa (não basta somar) e, sob incerteza, o IPCA+ domina o pré, pois garante o real independentemente da inflação realizada",
        correct: true,
      },
      { id: "b", text: "Basta somar juro real + inflação esperada" },
      { id: "c", text: "O prefixado é sempre superior" },
      { id: "d", text: "A inflação não afeta o juro real entregue" },
    ],
    feedback:
      "Dois aprendizados: (1) usar <code>(1+r)(1+π)</code>, não a soma; (2) quando a inflação é incerta, o indexado à inflação protege o mandato de forma robusta, enquanto o pré só acerta no cenário exato.",
    pontos: 25,
  },
  pontuacaoMax: 85,
};
