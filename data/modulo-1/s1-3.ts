import type { Scenario } from "@/lib/types";

export const s1_3: Scenario = {
  id: "s1-3",
  codigo: "S1.3",
  empresa: "Crédito corporativo",
  titulo: "Decompondo a taxa de um cliente corporativo",
  nivel: "int",
  duracaoMin: 20,
  contexto:
    'Um cliente corporativo pede <b>crédito de 6 meses</b>. O <b>funding interno</b> custa <span class="num">11,00% a.a.</span> e o rating interno do cliente é <span class="num">BB</span>. O papel <b>não é negociável</b> (ficará no balanço até o vencimento). Você precisa montar a taxa cobrada, bloco a bloco.',
  chips: [
    { k: "Prazo", v: "6 meses" },
    { k: "Funding interno", v: "11,00% a.a." },
    { k: "Rating interno", v: "BB" },
    { k: "Liquidez do papel", v: "Não-negociável" },
    { k: "Prêmio crédito", v: "+1,5% / +2,5%" },
    { k: "Margem comercial", v: "+1,0% / +1,8%" },
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo:
      "Convenção aditiva de spreads do curso: taxa ao cliente = funding interno + prêmio de crédito + prêmio de liquidez + margem comercial. Prêmio de liquidez para papel não-negociável: +0,5%.",
  },
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1 — Os blocos da taxa",
      enunciado:
        "A taxa cobrada do cliente decompõe-se em quais blocos, do funding ao preço final?",
      opcoes: [
        { id: "a", text: "Apenas funding interno mais a margem comercial do banco" },
        { id: "b", text: "Apenas o prêmio de crédito do rating do cliente" },
        { id: "c", text: "Apenas a inflação esperada para o período do crédito" },
        {
          id: "d",
          text: "Funding interno + prêmio de crédito + prêmio de liquidez + margem comercial",
          correct: true,
        },
      ],
      feedback:
        "A taxa observada agrega o <b>custo de captação</b> mais os prêmios por <b>crédito</b>, <b>liquidez</b> e <b>prazo</b>, e a <b>margem comercial</b>. Omitir blocos subprecifica o risco.",
      pontos: 20,
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2 — Por que o prêmio de liquidez",
      enunciado: "Por que um papel <b>não-negociável</b> exige um prêmio de liquidez adicional?",
      opcoes: [
        { id: "a", text: "Porque o papel passa automaticamente a ter maior risco de crédito" },
        { id: "b", text: "Porque a inflação esperada é maior nesses papéis ilíquidos" },
        {
          id: "c",
          text: "Porque o banco não conseguirá vendê-lo facilmente e precisa ser compensado por carregar o ativo ilíquido",
          correct: true,
        },
        { id: "d", text: "Não exige: a liquidez não afeta o preço do crédito" },
      ],
      feedback:
        "Mantidos crédito e prazo, o que sobra é o <b>fator liquidez</b>: o investidor/banco exige spread extra para carregar um papel difícil de negociar. É o mesmo princípio do prêmio de liquidez de mercado.",
      pontos: 20,
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3 — O preço conservador",
      enunciado:
        "Cálculo do preço (postura conservadora): funding 11,0% + crédito 2,5% + liquidez 0,5% + margem 1,8%. Qual a taxa ao cliente (soma de spreads)?",
      opcoes: [
        { id: "a", text: "15,8% a.a.", correct: true },
        { id: "b", text: "13,5% a.a." },
        { id: "c", text: "14,5% a.a." },
        { id: "d", text: "11,0% a.a." },
      ],
      feedback:
        "<code>11,0 + 2,5 + 0,5 + 1,8 = 15,8% a.a.</code> (convenção aditiva de spreads do curso). Os demais valores correspondem a outras combinações de prêmios — vistas na encruzilhada.",
      pontos: 20,
    },
  ],
  encruzilhada: {
    titulo: "Qual postura de precificação adotar?",
    subtitulo: "Cada postura equilibra proteção do banco × competitividade.",
    ramos: [
      {
        id: "A",
        rotulo: "Conservador",
        titulo: "Crédito +2,5 · Liquidez +0,5 · Margem +1,8 → 15,8%",
        resumo: "Protege o banco; pode perder o negócio.",
        resultado: {
          titulo: "Conservador — 15,8%",
          deltas: [
            { k: "Preço", v: "15,8% a.a.", tone: "neu" },
            { k: "Cobertura de risco", v: "Completa", tone: "pos" },
            { k: "Margem", v: "Confortável", tone: "pos" },
            { k: "Risco", v: "Perder o cliente", tone: "neg" },
          ],
          analise:
            "<code>11,0% + 2,5% + 0,5% + 1,8% = 15,8% a.a.</code> Cobre todos os blocos: crédito BB (2,5%), iliquidez de papel não-negociável (0,5%) e margem adequada (1,8%). Qualquer piora do rating BB caberia dentro do prêmio de crédito. Risco: cliente encontra concorrente disposto a sacrificar os 2,3 p.p. de prêmio.",
        },
      },
      {
        id: "B",
        rotulo: "Competitivo",
        titulo: "Crédito +1,5 · Liquidez +0 · Margem +1,0 → 13,5%",
        resumo: "Ganha o cliente; comprime margem.",
        resultado: {
          titulo: "Competitivo — 13,5%",
          deltas: [
            { k: "Preço", v: "13,5% a.a.", tone: "neu" },
            { k: "Atratividade", v: "Alta", tone: "pos" },
            { k: "Margem", v: "Fina", tone: "neg" },
            { k: "Risco", v: "Rating BB pode piorar", tone: "neg" },
          ],
          analise:
            "<code>11,0% + 1,5% + 0% + 1,0% = 13,5% a.a.</code> Crédito comprimido de 2,5% → 1,5% (−1 p.p.) e liquidez zerada (−0,5 p.p.); margem cai de 1,8% → 1,0% (−0,8 p.p.). Buffer restante: apenas 1,0% de margem para absorver qualquer deterioração do rating BB ao longo dos 6 meses.",
        },
      },
      {
        id: "C",
        rotulo: "Desalinhado",
        titulo: "Crédito +2,5 · Liquidez +0 · Margem +1,0 → 14,5%",
        resumo: '"Parece" equilibrado, mas ignora a iliquidez.',
        resultado: {
          titulo: "Desalinhado — 14,5%",
          deltas: [
            { k: "Preço", v: "14,5% a.a.", tone: "neu" },
            { k: "Prêmio de liquidez", v: "Ignorado", tone: "neg" },
            { k: "Crédito", v: "Coberto", tone: "pos" },
            { k: "Risco residual", v: "Papel ilíquido no balanço", tone: "neg" },
          ],
          analise:
            "<code>11,0% + 2,5% + 0% + 1,0% = 14,5% a.a.</code> Parece intermediário, mas o prêmio de liquidez (0,5%) está ausente: o banco carrega o papel no balanço por 6 meses sem ser compensado pela iliquidez. Vs conservador: <code>15,8% − 14,5% = 1,3 p.p.</code> faltante — sendo 0,5 p.p. de risco não remunerado e 0,8 p.p. de margem sacrificada.",
          risco: true,
        },
      },
    ],
  },
  reflexao: {
    enunciado: "Qual o erro mais comum e perigoso na precificação de crédito corporativo?",
    opcoes: [
      { id: "a", text: "Cobrar prêmio de crédito em excesso, encarecendo a operação" },
      { id: "b", text: "Usar o funding interno como referência de preço" },
      { id: "c", text: "Somar os spreads em vez de compô-los multiplicativamente" },
      {
        id: "d",
        text: "Subprecificar o prêmio de liquidez de um papel não-negociável: a taxa parece competitiva, mas não remunera o risco de carregar o ativo ilíquido",
        correct: true,
      },
    ],
    feedback:
      "Crédito costuma ser olhado; <b>liquidez é o bloco esquecido</b>. Ignorá-lo num papel que ficará no balanço gera carteira mal remunerada — exatamente o caminho C.",
    pontos: 25,
  },
  pontuacaoMax: 85,
};
