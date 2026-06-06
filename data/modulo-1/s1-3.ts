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
        {
          id: "a",
          text: "Funding interno + prêmio de crédito + prêmio de liquidez + margem comercial",
          correct: true,
        },
        { id: "b", text: "Apenas funding interno + margem comercial" },
        { id: "c", text: "Apenas o prêmio de crédito" },
        { id: "d", text: "Apenas a inflação esperada" },
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
        {
          id: "a",
          text: "Porque o banco não conseguirá vendê-lo facilmente e precisa ser compensado por carregar o ativo ilíquido",
          correct: true,
        },
        { id: "b", text: "Porque automaticamente tem maior risco de crédito" },
        { id: "c", text: "Porque a inflação esperada é maior nesses papéis" },
        { id: "d", text: "Não exige: liquidez não afeta o preço" },
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
            "Protege o banco e remunera todos os riscos. O custo é comercial: o cliente pode buscar um concorrente mais agressivo.",
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
            "Ganha o negócio ao custo de margem comprimida. Aceitável se houver <b>monitoramento ativo do rating</b> e relação de longo prazo.",
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
            "Erro recorrente: o preço parece intermediário, mas <b>não remunera a iliquidez</b>. O banco carrega um papel não-negociável sem ser pago por isso — subprecificação de risco.",
          risco: true,
        },
      },
    ],
  },
  reflexao: {
    enunciado: "Qual o erro mais comum e perigoso na precificação de crédito corporativo?",
    opcoes: [
      {
        id: "a",
        text: "Subprecificar o prêmio de liquidez de um papel não-negociável: a taxa parece competitiva, mas não remunera o risco de carregar o ativo ilíquido",
        correct: true,
      },
      { id: "b", text: "Cobrar prêmio de crédito em excesso" },
      { id: "c", text: "Usar o funding interno como referência" },
      { id: "d", text: "Somar os spreads em vez de compô-los" },
    ],
    feedback:
      "Crédito costuma ser olhado; <b>liquidez é o bloco esquecido</b>. Ignorá-lo num papel que ficará no balanço gera carteira mal remunerada — exatamente o caminho C.",
    pontos: 25,
  },
  pontuacaoMax: 85,
};
