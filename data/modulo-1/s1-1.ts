import type { Scenario } from "@/lib/types";

export const s1_1: Scenario = {
  id: "s1-1",
  codigo: "S1.1",
  empresa: "Banco médio",
  titulo: "A escolha do funding overnight",
  nivel: "int",
  duracaoMin: 20,
  contexto:
    'Você é tesoureiro(a) de um <b>banco médio</b> e precisa captar <span class="num">R$ 200 milhões</span> por <span class="num">1 dia útil</span> (caixa puramente tático). A Selic-over projetada para o dia é <span class="num">0,0508%/du</span> e o <b>CDI ≈ Selic-over</b>. Objetivo: <b>menor custo possível</b> sem assumir risco escondido de rolagem.',
  chips: [
    { k: "Papel", v: "Banco médio" },
    { k: "Volume a captar", v: "R$ 200 mi" },
    { k: "Prazo", v: "1 du" },
    { k: "Selic-over", v: "0,0508%/du" },
    { k: "CDI ≈ over", v: "0,0508%/du" },
    { k: "≈ a.a. (DU/252)", v: "13,65%" },
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo:
      'Equivalência <code>(1,000508)^252 − 1 ≈ 13,65% a.a.</code> Alternativas de funding: interbancário 100% CDI, depósito institucional 101% CDI, compromissada lastreada em LTN a 99,8% do CDI (haircut 0,2%) ou lastreada em LFT.',
  },
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1 — Custo do dia",
      enunciado:
        "Captando R$ 200 mi por 1 du a 100% do CDI (0,0508%/du), qual o custo financeiro de juros do overnight?",
      opcoes: [
        { id: "a", text: "R$ 101.600", correct: true },
        { id: "b", text: "R$ 1.016.000" },
        { id: "c", text: "R$ 10.160" },
        { id: "d", text: "R$ 1.016" },
      ],
      feedback:
        'Custo = <code>200.000.000 × 0,0508% = 200.000.000 × 0,000508 = R$ 101.600</code> em 1 dia útil. Os distratores erram a posição decimal (escala ×10 / ÷10) ou trocam o custo total pelo custo marginal de 1% do CDI.',
      pontos: 20,
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2 — O custo de 101% do CDI",
      enunciado:
        "Um cliente institucional só aceita aplicar a <b>101% do CDI</b>. Quanto custa <i>a mais</i>, por dia, aceitar 101% em vez de 100%?",
      opcoes: [
        { id: "a", text: "≈ R$ 101.600/dia" },
        { id: "b", text: "≈ R$ 10.160/dia" },
        { id: "c", text: "≈ R$ 2.032/dia" },
        { id: "d", text: "≈ R$ 1.016/dia", correct: true },
      ],
      feedback:
        'O 1% adicional incide sobre o custo-base: <code>1% × R$ 101.600 = R$ 1.016/dia</code> por R$ 200 mi. É um prêmio pequeno em termos absolutos — daí ser uma decisão de <b>conveniência/relacionamento</b>, não de cálculo.',
      pontos: 20,
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3 — O risco escondido da compromissada",
      enunciado:
        "A compromissada lastreada em <b>LTN a 99,8% do CDI</b> parece a mais barata. Qual é o risco escondido em relação a captar 100% CDI puro?",
      opcoes: [
        {
          id: "a",
          text: "Haircut: os 0,2% de sobrecolateral já anulam todo o desconto da taxa",
        },
        {
          id: "b",
          text: "Crédito: o risco é de calote do emissor do lastro (Tesouro Nacional)",
        },
        {
          id: "c",
          text: "Marcação: se a curva pré abrir, a LTN desvaloriza e a rolagem encarece — o haircut é de 2ª ordem",
          correct: true,
        },
        { id: "d", text: "Nenhum: 99,8% do CDI é sempre melhor que captar a 100%" },
      ],
      feedback:
        'A taxa de 99,8% do CDI esconde dois efeitos. O <b>haircut</b> — você sobrecolateraliza em LTN, imobilizando garantia — mas, a 0,2%, isso quase não corrói o desconto da taxa (efeito de <b>segunda ordem</b>). O que importa é o <b>risco de marcação</b> da LTN (prefixada): se a curva pré abrir, o lastro desvaloriza e a rolagem fica cara e instável. O risco de crédito do Tesouro é desprezível — o problema é de <b>marcação, não de crédito</b>. Trocar o lastro por <b>LFT</b> (pós-Selic) removeria a marcação.',
      pontos: 20,
    },
  ],
  encruzilhada: {
    titulo: "Escolha sua decisão de funding",
    subtitulo: "Cada caminho leva a um resultado diferente. Avalie custo marginal × estabilidade do lastro.",
    ramos: [
      {
        id: "A",
        rotulo: "Interbancário 100%",
        titulo: "Captar 100% CDI no interbancário",
        resumo: "Custo limpo do dia, sem lastro a gerir. Depende de disponibilidade de contraparte.",
        resultado: {
          titulo: "Simples e sem marcação",
          deltas: [
            { k: "Custo do dia", v: "R$ 101.600", tone: "neu" },
            { k: "Δ vs LTN", v: "+R$ 203/dia", tone: "neu" },
            { k: "Risco de marcação", v: "Nenhum (pós)", tone: "pos" },
            { k: "Risco residual", v: "Execução/contraparte", tone: "neu" },
          ],
          analise:
            "Custo: <code>200.000.000 × 0,000508 = R$ 101.600/dia</code>. Comparado com a compromissada LTN (99,8%): <code>200.000.000 × 0,000508 × (1−0,998) = +R$ 203/dia a mais</code>. Sem colateral a marcar, sem risco de lastro pré. Não é a mais barata, mas é a mais simples — adequado quando a disponibilidade de contraparte interbancária está garantida.",
        },
      },
      {
        id: "B",
        rotulo: "Institucional 101%",
        titulo: "Aceitar 101% CDI do institucional",
        resumo: "Volume garantido com a contraparte; paga ~R$ 1.016/dia a mais.",
        resultado: {
          titulo: "Custo médio, conveniência",
          deltas: [
            { k: "Custo do dia", v: "R$ 102.616", tone: "neu" },
            { k: "Δ vs base", v: "+R$ 1.016/dia", tone: "neg" },
            { k: "Volume", v: "Garantido", tone: "pos" },
            { k: "Risco de marcação", v: "Nenhum (pós)", tone: "pos" },
          ],
          analise:
            "Custo: <code>200.000.000 × 0,000508 × 1,01 = R$ 102.616/dia</code> — delta de <code>R$ 1.016/dia</code> vs 100% CDI (= 1% × R$ 101.600). Em R$ 200 mi, R$ 1.016/dia é residual frente ao valor do relacionamento. Decisão de conveniência comercial, não de cálculo de custo.",
        },
      },
      {
        id: "C",
        rotulo: "Compromissada LTN",
        titulo: "Compromissada lastreada em LTN (99,8%, assume haircut)",
        resumo: "A mais barata de face; introduz o lastro pré (marcação/rolagem) a observar.",
        resultado: {
          titulo: "A mais barata; lastro pré a observar",
          deltas: [
            { k: "Taxa de face", v: "99,8% CDI", tone: "pos" },
            { k: "Custo do dia", v: "≈ R$ 101.397", tone: "pos" },
            { k: "Haircut", v: "2ª ordem", tone: "neu" },
            { k: "Lastro", v: "LTN — marcação/rolagem", tone: "neg" },
          ],
          analise:
            "Custo: <code>200.000.000 × 0,000508 × 0,998 ≈ R$ 101.397/dia</code> — economia de <code>R$ 203/dia</code> vs 100% CDI. Haircut 0,2%: imobiliza colateral extra em LTN, mas o desconto da taxa já absorve o custo (efeito de 2ª ordem). Risco principal: marcação do lastro pré — se a curva pré abrir, o colateral LTN desvaloriza e a rolagem fica instável. Lastrear em <b>LFT</b> mantém o desconto sem esse risco.",
        },
      },
    ],
  },
  reflexao: {
    enunciado:
      "Para um caixa <b>puramente tático overnight</b>, qual leitura de custo × risco do funding é a correta?",
    opcoes: [
      {
        id: "a",
        text: "O interbancário a 100% é sempre o mais barato; a compromissada em LTN é uma armadilha que sai mais cara",
      },
      {
        id: "b",
        text: "A compromissada em LTN (99,8%) é a mais barata — o haircut é de 2ª ordem; o risco real é a marcação do lastro pré, desprezível em 1 du e crítica na rolagem. Lastro em LFT preserva o desconto sem marcar",
        correct: true,
      },
      {
        id: "c",
        text: "A compromissada em LTN é mais barata e, por ser overnight, não há nenhum risco de lastro a considerar",
      },
      {
        id: "d",
        text: "Tanto faz: no overnight não há diferença de custo nem risco relevante entre as captações",
      },
    ],
    feedback:
      'No tático de 1 du, o desconto de 0,2% da compromissada em LTN sobrevive ao haircut (efeito de <b>2ª ordem</b>). O que pesa é a <b>marcação</b> do lastro pré: irrelevante para 1 dia, mas instável na rolagem. Trocar o lastro por <b>LFT</b> entrega o mesmo desconto sem risco de marcação.',
    pontos: 25,
  },
  pontuacaoMax: 85,
};
