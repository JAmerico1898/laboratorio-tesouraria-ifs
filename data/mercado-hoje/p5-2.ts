import type { Pauta } from "@/lib/types";
import {
  bps,
  taxaDe,
} from "@/lib/mercado/metricas";
import { bpsFmt, num, pct } from "@/lib/mercado/template";

export const p5_2: Pauta = {
  id: "p5-2",
  codigo: "P5.2",
  titulo: "Prêmio ou expectativa? O spread PRE − DI",
  nivel: "int",
  duracaoMin: 15,
  familia: "implicita",
  curvaInicial: "spread-pre-di",
  icon: "compare_arrows",
  contexto: "Duas curvas nominais convivem no mesmo mercado e no mesmo dia: a do DI futuro, que é o preço da B3, e a PRE zero-cupom da ANBIMA, construída a partir de LTN e NTN-F. Elas não coincidem. Em 21/08/2026, o prêmio da LTN de out/26 sobre o DI era de −8,79 bps; o da LTN de abr/27, −17,92 bps; o da de jul/27, −28,00 bps. Prefixado soberano negociando <b>abaixo</b> do DI é um fato que exige explicação.",
  chips: [
    { k: "Prêmio LTN out/26", v: "{{spread-pre-di.LTN out/26.taxa}}" },
    { k: "Prêmio LTN abr/27", v: "{{spread-pre-di.LTN abr/27.taxa}}" },
    { k: "Prêmio LTN jul/27", v: "{{spread-pre-di.LTN jul/27.taxa}}" },
    { k: "PRE 213 du", v: "{{pre-zero.213.taxa}}" },
    { k: "Implícita 2027 · PRE × DI", v: "{{be-ntnb-pre.mai/27.taxa}} × {{be-ntnb-di.mai/27.taxa}}" },
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1 — Observação",
      enunciado: "Compare o prêmio de cada papel sobre o DI, vértice a vértice, no painel. O que o padrão mostra?",
      opcoes: [
        {
          id: "a",
          texto: "Nas LTN o prêmio é negativo em todos os vértices do trecho e se aprofunda com o prazo: −8,79 bps em out/26 e −28,00 em jul/27",
          leituraCurso: true,
          feedback: "padrão sistemático, não ruído",
        },
        {
          id: "b",
          texto: "O prêmio é negativo apenas no vértice mais curto e converge rapidamente para zero à medida que o prazo dos papéis se estende",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "Os prêmios oscilam sem padrão discernível de prazo, refletindo apenas ruído de apuração das taxas indicativas da ANBIMA",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "O prêmio é positivo e crescente, indicando que o soberano prefixado paga acima do DI em toda a extensão da amostra observada",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "o que importa é o sinal se manter e a magnitude crescer ao longo do trecho. Um prêmio negativo isolado seria ruído; <b>um prêmio que fica sistematicamente mais negativo com o prazo é um preço</b>, e um preço tem causa. A NTN-F de jan/27 sai da linha das LTN porque paga cupom semestral, e por isso a comparação limpa é entre papéis do mesmo tipo.",
      pontos: 15,
      next: "etapa-2",
      janela: { duMin: 28, duMax: 213 },
      destaques: ["LTN out/26", "LTN abr/27", "LTN jul/27"],
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2 — Interpretação",
      enunciado: "O prêmio é negativo e cresce em módulo com o prazo. Por quê?",
      opcoes: [
        {
          id: "a",
          texto: "Uma das duas fontes está com defeito de apuração e o dado da ANBIMA deve ser descartado em favor do ajuste da B3",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "A diferença é integralmente explicada por convenções distintas de contagem de dias úteis entre os dois mercados de referência",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "O DI embute risco de contraparte da câmara enquanto a LTN é soberana, e o spread mede exatamente esse diferencial de crédito",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "O soberano prefixado tem demanda cativa e tratamento regulatório que o DI não tem, e isso comprime sua taxa abaixo da curva de swap",
          leituraCurso: true,
          feedback: "risco de crédito produziria spread de sinal oposto; convenção de contagem é idêntica nos dois mercados",
        },
      ],
      feedback: "a leitura de crédito tem o sinal invertido — se fosse risco de contraparte, o DI pagaria <b>mais</b>, não menos. A leitura de convenção não sobrevive: ambos rodam em DU/252. Descartar uma fonte é a saída preguiçosa: <b>as duas estão certas, medindo coisas diferentes</b>.",
      pontos: 15,
      next: "etapa-3",
      janela: { duMin: 28, duMax: 213 },
      destaques: ["LTN jul/27"],
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3 — Implicação",
      enunciado: "Duas curvas nominais, no mesmo dia, com preços diferentes. Qual delas a mesa usa?",
      opcoes: [
        {
          id: "a",
          texto: "Usar sempre a curva DI, por ser a mais líquida e a que a mesa de fato consegue executar em qualquer tamanho de posição",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "Escolher a curva conforme a pergunta: DI para hedge e marcação de derivativo, PRE para avaliar o custo soberano e a implícita",
          leituraCurso: true,
          feedback: "hedge exige a curva executável (DI); custo soberano e implícita exigem a curva soberana (PRE)",
        },
        {
          id: "c",
          texto: "Usar sempre a curva PRE, por ser soberana e portanto a única referência legítima de taxa livre de risco na economia brasileira",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "Calcular a média aritmética das duas curvas vértice a vértice, obtendo assim uma referência única e neutra entre as duas fontes",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a média não é neutra — é uma curva que <b>ninguém negocia</b> e que não serve nem para hedge nem para valuation. Curva é ferramenta: escolhe-se pela pergunta.",
      pontos: 15,
      next: "etapa-4",
    },
    {
      id: "etapa-4",
      titulo: "Etapa 4 — Resolução da pauta",
      enunciado: "Três políticas de curva de referência. Cada uma é internamente coerente; elas divergem no que erram.",
      opcoes: [
        {
          id: "A",
          texto: "Curva DI como padrão único — Marcar tudo em DI",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "B",
          texto: "Curva conforme a pergunta — DI para hedge, PRE para implícita e custo soberano",
          leituraCurso: true,
          feedback: "A e C são internamente consistentes mas cada uma erra sistematicamente em metade das perguntas; B é a única que não transporta o viés de uma pergunta para outra",
        },
        {
          id: "C",
          texto: "Curva PRE como padrão único — Marcar tudo em PRE",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "o spread PRE − DI não é erro de dado, é <b>preço de duas coisas diferentes</b>. Ele reaparece, com sinal e magnitude previsíveis, na diferença entre as duas inflações implícitas — e é por isso que a escolha da curva nominal precisa ser declarada antes de qualquer número de break-even.",
      pontos: 25,
      next: "",
    },
  ],
  posicoes: [
    {
      id: "A",
      rotulo: "Curva DI como padrão único",
      decisao: "Marcar tudo em DI",
      consequencias: [
        { estado: "Consequência", efeito: "Hedge consistente; implícita da NTN-B sai ~22 bps mais alta que a soberana" },
      ],
      contrafactual: (s) => `marcando tudo em DI, a implícita de 2027 sai, a mais, ${bpsFmt(bps(taxaDe(s, "be-ntnb-di", "mai/27") - taxaDe(s, "be-ntnb-pre", "mai/27")))} acima da soberana, erro sistemático em toda decisão de indexação`,
    },
    {
      id: "B",
      rotulo: "Curva conforme a pergunta",
      decisao: "DI para hedge, PRE para implícita e custo soberano",
      consequencias: [
        { estado: "Consequência", efeito: "Exige disciplina de documentação, mas cada número responde ao que foi perguntado" },
      ],
      contrafactual: (s) => `cada número responde à sua pergunta: hedge em DI, implícita em PRE (${pct(taxaDe(s, "be-ntnb-pre", "mai/27"))} em mai/27). Custo: documentar qual curva foi usada em cada cálculo`,
    },
    {
      id: "C",
      rotulo: "Curva PRE como padrão único",
      decisao: "Marcar tudo em PRE",
      consequencias: [
        { estado: "Consequência", efeito: "Coerente com o funding soberano; descasa da marcação dos derivativos em DI" },
      ],
      contrafactual: (s) => {
      const p = taxaDe(s, "spread-pre-di", "LTN jul/27");
      return `marcando tudo em PRE, o hedge descasa da curva executável em ${num(Math.abs(p))} bps no vértice de jul/27: o derivativo não liquida na curva soberana`;
    },
    },
  ],
  posicaoCurso: "B",
  gabarito: {
    sintese: "o spread PRE − DI não é erro de dado, é <b>preço de duas coisas diferentes</b>. Ele reaparece, com sinal e magnitude previsíveis, na diferença entre as duas inflações implícitas — e é por isso que a escolha da curva nominal precisa ser declarada antes de qualquer número de break-even.",
    notas: [
      {
        etapaId: "etapa-1",
        answer: "nas LTN, prêmio negativo em todo o trecho e mais negativo quanto mais longo o papel",
        rationale: "padrão sistemático, não ruído",
        math: (s) => {
    const p1 = taxaDe(s, "spread-pre-di", "LTN out/26");
    const p2 = taxaDe(s, "spread-pre-di", "LTN abr/27");
    const p3 = taxaDe(s, "spread-pre-di", "LTN jul/27");
    return `variação do prêmio entre out/26 e jul/27 = ${num(p3)} − (${num(p1)}) = ${num(p3 - p1)} bps; média dos três vértices = ${num((p1 + p2 + p3) / 3)} bps`;
  },
      },
      {
        etapaId: "etapa-2",
        answer: "demanda cativa e tratamento regulatório/tributário do soberano comprimem a taxa da LTN",
        rationale: "risco de crédito produziria spread de sinal oposto; convenção de contagem é idêntica nos dois mercados",
        math: (s) => {
    const p = taxaDe(s, "spread-pre-di", "LTN jul/27");
    return `prêmio, por definição, = taxa_indicativa_PRE − taxa_ajuste_DI; em jul/27, ${num(p)} bps = ${num(p / 100, 4)} p.p. a.a.`;
  },
      },
      {
        etapaId: "etapa-3",
        answer: "escolher a curva conforme a pergunta",
        rationale: "hedge exige a curva executável (DI); custo soberano e implícita exigem a curva soberana (PRE)",
        math: (s) => {
    const pre = taxaDe(s, "be-ntnb-pre", "mai/27");
    const di = taxaDe(s, "be-ntnb-di", "mai/27");
    return `efeito na implícita de 2027 = ${pct(di)} (contra DI) − ${pct(pre)} (contra PRE) = ${bpsFmt(bps(di - pre))}, da mesma ordem de grandeza do prêmio médio observado`;
  },
      },
      {
        etapaId: "etapa-4",
        answer: "posição B",
        rationale: "A e C são internamente consistentes mas cada uma erra sistematicamente em metade das perguntas; B é a única que não transporta o viés de uma pergunta para outra",
        math: (s) => {
    const pre = taxaDe(s, "be-ntnb-pre", "mai/27");
    const di = taxaDe(s, "be-ntnb-di", "mai/27");
    return `custo do erro de usar DI para a implícita ≈ ${bpsFmt(bps(di - pre))} de inflação implícita superestimada`;
  },
      },
    ],
    glossario: [
      { termo: "Prêmio (spread sobre o DI)", definicao: "<code>taxa indicativa do PRE − taxa de ajuste do DI</code>, em bps; mede o quanto o soberano prefixado sai da curva de swap." },
      { termo: "Curva PRE", definicao: "ETTJ nominal zero-cupom construída de LTN e NTN-F pela ANBIMA." },
      { termo: "Taxa de ajuste", definicao: "taxa de fechamento do contrato futuro, usada para liquidação diária." },
      { termo: "Taxa indicativa", definicao: "taxa de referência da ANBIMA, apurada junto a informantes." },
      { termo: "Ponto-base (bps)", definicao: "0,01 p.p.; unidade em que spreads são discutidos." },
      { termo: "Demanda cativa", definicao: "parcela da demanda por soberano que não é sensível a preço (regulatória, previdenciária)." },
      { termo: "Curva de swap", definicao: "curva construída de derivativos de juros, aqui o DI futuro." },
      { termo: "Bootstrap", definicao: "extração sequencial de taxas zero a partir de títulos com cupom." },
    ],
  },
  pontuacaoMax: 70,
};
