import type { Scenario } from "@/lib/types";

export const s1_2: Scenario = {
  id: "s1-2",
  codigo: "S1.2",
  empresa: "Mesa proprietária",
  titulo: "Pré ou pós? A primeira decisão de gap",
  nivel: "int",
  duracaoMin: 18,
  contexto:
    'Há <b>liquidez sobrando por 21 du</b>. O cenário macro indica <b>Copom dividido</b>: parte do mercado vê corte de Selic, parte vê alta. A Selic atual ≈ <span class="num">10,40% a.a.</span> (DU/252). Você decide como aplicar e quanto risco de <b>descasamento (gap)</b> assumir.',
  chips: [
    { k: "Liquidez", v: "Aplicar 21 du" },
    { k: "Selic atual", v: "10,40% a.a." },
    { k: "Cenário Copom", v: "Dividido" },
    { k: "Pré 21 du", v: "10,60% a.a." },
    { k: "Pré 63 du", v: "10,50% a.a." },
    { k: "Pós", v: "100–102% CDI" },
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1 — Rendimento de referência",
      enunciado:
        "Como referência, qual o rendimento esperado de aplicar 100% do CDI por 21 du <b>se a Selic não mudar</b> (10,40% a.a., DU/252)?",
      opcoes: [
        { id: "a", text: "≈ 0,828% no período", correct: true },
        { id: "b", text: "≈ 0,867% no período" },
        { id: "c", text: "≈ 10,40% no período" },
        { id: "d", text: "≈ 0,433% no período" },
      ],
      feedback:
        "<code>(1,1040)^(21/252) − 1 ≈ 0,828%</code>. O distrator 0,867% usa juros lineares (<code>10,40% × 21/252</code>), superestimando por ignorar a capitalização DU/252.",
      pontos: 20,
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2 — O que o descasamento cria",
      enunciado:
        "Aplicar <b>pré de 63 du</b> tendo caixa disponível por apenas <b>21 du</b> cria o quê?",
      opcoes: [
        {
          id: "a",
          text: "Um descasamento de prazos (gap): uma aposta direcional em juros, com risco de marcação/rolagem",
          correct: true,
        },
        { id: "b", text: "Elimina o risco, pois trava a taxa" },
        { id: "c", text: "Um risco de crédito do emissor" },
        { id: "d", text: "Um risco cambial" },
      ],
      feedback:
        "Ativo mais longo que o funding = <b>gap</b>. Você passa a depender da direção da Selic: trava taxa hoje, mas fica exposto a marcação adversa e ao custo de rolar o caixa. É decisão que exige <b>limite de risco</b>.",
      pontos: 20,
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3 — Efeito na marcação",
      enunciado:
        "Você aplicou <b>pré 21 du a 10,60%</b> e, no dia seguinte, a taxa de mercado desse vértice <b>sobe</b> para 11,60%. Efeito imediato na marcação a mercado da posição?",
      opcoes: [
        { id: "a", text: "Perda de marcação: o PU cai quando a taxa exigida sobe", correct: true },
        { id: "b", text: "Ganho de marcação" },
        { id: "c", text: "Neutro: por ser pré, não marca a mercado" },
        { id: "d", text: "Depende apenas do CDI do dia" },
      ],
      feedback:
        "Em renda fixa prefixada, <b>preço e taxa andam em sentidos opostos</b>: subir a taxa exigida derruba o PU. É exatamente o risco de marcação que o gap introduz — invisível em quem só olha o carrego.",
      pontos: 20,
    },
  ],
  encruzilhada: {
    titulo: "Qual posição expressa sua visão?",
    subtitulo: 'Não há resposta "certa": é uma aposta de cenário que precisa de limite.',
    ramos: [
      {
        id: "A",
        rotulo: "Aposta em corte",
        titulo: "Pré 63 du a 10,50% (alongar)",
        resumo: "Trava taxa alta antes da queda; cria duration/gap.",
        resultado: {
          titulo: "Se o corte vier, ganho de marcação",
          deltas: [
            { k: "Taxa travada", v: "10,50% (63 du)", tone: "neu" },
            { k: "Duration/gap", v: "Criado", tone: "neg" },
            { k: "Se Selic cair", v: "Ganho de marcação", tone: "pos" },
            { k: "Se Selic subir", v: "Marcação adversa", tone: "neg" },
          ],
          analise:
            "Maximiza o ganho se o corte se confirmar, mas é assimétrico: aposta direcional que só compensa com leitura de cenário acertada e <b>limite de DV01</b> respeitado.",
        },
      },
      {
        id: "B",
        rotulo: "Neutro",
        titulo: "Pós 100% CDI por 21 du",
        resumo: "Casa prazo, acompanha a Selic; sem aposta direcional.",
        resultado: {
          titulo: "Neutro, sem aposta",
          deltas: [
            { k: "Rendimento", v: "≈ carrego do CDI", tone: "neu" },
            { k: "Gap", v: "Nenhum", tone: "pos" },
            { k: "Upside direcional", v: "Nenhum", tone: "neu" },
            { k: "Risco de marcação", v: "Mínimo", tone: "pos" },
          ],
          analise:
            "Escolha disciplinada quando não há convicção de cenário (Copom dividido). Acompanha a Selic seja qual for a direção.",
        },
      },
      {
        id: "C",
        rotulo: "Aposta em alta",
        titulo: "Pós 102% CDI com prazo maior do cliente",
        resumo: "Acompanha alta e ainda adiciona spread; assume prazo do cliente.",
        resultado: {
          titulo: "Acompanha alta + spread",
          deltas: [
            { k: "Indexador", v: "Pós 102% CDI", tone: "pos" },
            { k: "Se Selic subir", v: "Acompanha + spread", tone: "pos" },
            { k: "Prazo", v: "Maior (cliente)", tone: "neg" },
            { k: "Risco residual", v: "Liquidez", tone: "neg" },
          ],
          analise:
            "Boa expressão de visão de alta, com spread extra. O preço é o <b>risco de liquidez</b> do prazo maior exigido pelo cliente.",
        },
      },
    ],
  },
  reflexao: {
    enunciado:
      "Qual frase melhor descreve a natureza de uma decisão pré × pós com descasamento de prazo?",
    opcoes: [
      {
        id: "a",
        text: 'É uma aposta direcional em juros que exige limite de risco e disciplina de stop — não existe escolha "certa" sem uma visão de cenário',
        correct: true,
      },
      { id: "b", text: "Pré é sempre superior porque trava a taxa" },
      { id: "c", text: "Pós elimina todo o risco da tesouraria" },
      { id: "d", text: "É uma decisão de risco de crédito" },
    ],
    feedback:
      "O gap transforma uma aplicação em <b>posição direcional</b>. Apostar pré e a Selic subir gera marcação negativa e custo de oportunidade; por isso o limite de risco precede a convicção.",
    pontos: 25,
  },
  pontuacaoMax: 85,
};
