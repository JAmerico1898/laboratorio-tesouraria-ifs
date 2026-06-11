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
    { k: "IPCA+ (real)", v: "+6,5%" },
    { k: "Equação", v: "Fisher" },
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo:
      "Equação de Fisher: <code>(1 + i) = (1 + r)(1 + π)</code>. O valor que trava exatamente 6,5% real com inflação de 4,5% é <code>i = 11,29%</code>. A soma simples (6,5% + 4,5% = 11,0%) ignora o termo cruzado <code>r·π</code>. A NTN-B disponível paga <b>IPCA + 6,5%</b> (cupom real = exatamente o mandato).",
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
        { id: "a", text: "Porque a inflação realizada tende a vir acima de 4,5%" },
        { id: "b", text: "Porque o IR incide sobre o rendimento nominal do papel" },
        { id: "c", text: "Não subdimensiona: a soma simples já é exata" },
        {
          id: "d",
          text: "Ignora o termo cruzado r·π de Fisher (≈ 0,065 × 0,045 ≈ 0,29 p.p.)",
          correct: true,
        },
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
        { id: "a", text: "Prefixado, sempre: travar o nominal já garante o real" },
        { id: "b", text: "LFT / pós-Selic: acompanha a Selic e protege o real" },
        {
          id: "c",
          text: "IPCA+ (NTN-B) com cupom real de 6,5%: entrega o juro real do mandato qualquer que seja a inflação",
          correct: true,
        },
        { id: "d", text: "Tanto faz sob incerteza: todos entregam o mesmo real" },
      ],
      feedback:
        "A NTN-B garante o <b>seu próprio cupom real</b>, não um número qualquer: para cumprir o mandato de 6,5%, é preciso um papel com cupom real <b>≥ 6,5%</b>. Um IPCA+ a 6,0% protegeria contra a inflação, mas entregaria só 6,0% real — abaixo do mandato. O pré só trava o real se a inflação vier <i>exatamente</i> em 4,5%; o IPCA+ a 6,5% defende o mandato aconteça o que acontecer com a inflação.",
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
            "Fisher: <code>(1,065)(1,045) = 1,11293 → i = 11,29%</code>. Se π = 4,5%: <code>real = 1,1129/1,045−1 = 6,5% ✓</code>. Se π surpreender para 5,5%: <code>real = 1,1129/1,055−1 ≈ 5,5%</code> — abaixo do mandato. A trava nominal só cumpre o mandato no cenário central — cada 1 p.p. de inflação acima do previsto corrói ~1 p.p. do real.",
        },
      },
      {
        id: "B",
        rotulo: "Proteção real",
        titulo: "IPCA+ 6,5%",
        resumo: "Cumpre o mandato qualquer que seja a inflação.",
        resultado: {
          titulo: "IPCA+ 6,5% — cumpre o mandato",
          deltas: [
            { k: "Real garantido", v: "6,5% + IPCA", tone: "pos" },
            { k: "Mandato", v: "Cumprido (qualquer π)", tone: "pos" },
            { k: "Dependência da inflação", v: "Nenhuma", tone: "pos" },
            { k: "Risco residual", v: "Marcação (se vender antes)", tone: "neg" },
          ],
          analise:
            "Qualquer π: <code>real entregue = cupom real do papel = 6,5%</code>. Nominal = <code>(1,065)(1+π)−1</code> — cresce com a inflação. Condição necessária: cupom real ≥ 6,5% (um IPCA+ a 6,0% entregaria apenas 6,0% real — abaixo do mandato mesmo protegendo contra inflação). Carregada até 12 meses: sem risco de marcação; domina o pré sob incerteza inflacionária.",
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
            "Soma simples ignora o termo cruzado r·π. Real efetivo: <code>1,11/1,045−1 ≈ 6,22%</code> — déficit de <code>0,28 p.p. vs mandato</code> (= r·π = 6,5% × 4,5%). Se π sobe para 5,5%: <code>real = 1,11/1,055−1 ≈ 5,21%</code>. O mandato de 6,5% não é cumprido em nenhum cenário inflacionário realista com i = 11,0%.",
          risco: true,
        },
      },
    ],
  },
  reflexao: {
    enunciado:
      "Qual a lição central de Fisher para defender um mandato de juro real sob incerteza inflacionária?",
    opcoes: [
      { id: "a", text: "Basta somar juro real + inflação esperada para travar o mandato" },
      {
        id: "b",
        text: "O termo cruzado importa (não basta somar) e, sob incerteza, um IPCA+ com cupom real ≥ 6,5% domina o pré: garante o mandato qualquer que seja a inflação",
        correct: true,
      },
      { id: "c", text: "O prefixado é sempre superior, pois trava a taxa nominal" },
      { id: "d", text: "A inflação realizada não afeta o juro real efetivamente entregue" },
    ],
    feedback:
      "Dois aprendizados: (1) usar <code>(1+r)(1+π)</code>, não a soma; (2) sob incerteza, o indexado à inflação protege o mandato de forma robusta — <b>desde que o cupom real do papel cumpra os 6,5%</b>. Um IPCA+ abaixo de 6,5% protege contra a inflação, mas não entrega o mandato; o pré só acerta no cenário exato de 4,5%.",
    pontos: 25,
  },
  pontuacaoMax: 85,
};
