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
        { id: "a", text: "≈ R$ 1.016/dia", correct: true },
        { id: "b", text: "≈ R$ 101.600/dia" },
        { id: "c", text: "≈ R$ 10.160/dia" },
        { id: "d", text: "≈ R$ 2.032/dia" },
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
          text: "O haircut consome o desconto aparente e o lastro pré (LTN) sofre marcação se a curva abrir — funding instável nas rolagens",
          correct: true,
        },
        { id: "b", text: "Não há risco: 99,8% do CDI é sempre melhor que 100%" },
        { id: "c", text: "O risco é de crédito do emissor do lastro (Tesouro Nacional)" },
        { id: "d", text: "O risco é exclusivamente cambial" },
      ],
      feedback:
        'A taxa de face (99,8% CDI) ignora dois efeitos: o <b>haircut</b> de 0,2% sobre o funding e o <b>risco de marcação</b> da LTN (prefixada) — se a curva pré abrir, o lastro desvaloriza e a rolagem fica cara/instável. Risco soberano de LTN é desprezível; o problema é de <b>marcação</b>, não de crédito. Trocar o lastro por <b>LFT</b> (pós-Selic) removeria a marcação.',
      pontos: 20,
    },
  ],
  encruzilhada: {
    titulo: "Escolha sua decisão de funding",
    subtitulo: "Cada caminho leva a um resultado diferente. Avalie custo × risco de rolagem.",
    ramos: [
      {
        id: "A",
        rotulo: "Interbancário 100%",
        titulo: "Captar 100% CDI no interbancário",
        resumo: "Custo mínimo do dia; spread preservado. Depende de disponibilidade de contraparte.",
        resultado: {
          titulo: "Custo mínimo, risco mínimo",
          deltas: [
            { k: "Custo do dia", v: "R$ 101.600", tone: "neu" },
            { k: "Δ vs base", v: "R$ 0", tone: "pos" },
            { k: "Risco de marcação", v: "Nenhum (pós)", tone: "pos" },
            { k: "Risco residual", v: "Execução/contraparte", tone: "neu" },
          ],
          analise:
            "Melhor prática para caixa tático: pós-fixado casa o prazo (1 du × 1 du), preserva o spread e não expõe a curva. Único cuidado: garantir liquidez de contraparte no interbancário.",
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
            "Aceitável quando a relação comercial com o institucional vale o prêmio de ~R$ 1.016/dia. Decisão de relacionamento, não de erro técnico.",
        },
      },
      {
        id: "C",
        rotulo: "Compromissada LTN",
        titulo: "Compromissada lastreada em LTN (99,8%, assume haircut)",
        resumo: "Taxa de face baixa; expõe a haircut + marcação do lastro pré.",
        resultado: {
          titulo: "Custo baixo de face, risco escondido",
          deltas: [
            { k: "Taxa de face", v: "99,8% CDI", tone: "pos" },
            { k: "Haircut", v: "−0,2% do funding", tone: "neg" },
            { k: "Lastro", v: "LTN (pré)", tone: "neg" },
            { k: "Risco residual", v: "Alto — marcação/rolagem", tone: "neg" },
          ],
          analise:
            "Armadilha clássica de olhar só a taxa de face: o haircut anula o desconto e a marcação da LTN torna a rolagem instável se a curva abrir. Se quisesse compromissada, o correto seria lastro em <b>LFT</b> (pós), eliminando a marcação.",
          risco: true,
        },
      },
    ],
  },
  reflexao: {
    enunciado:
      "Para um caixa <b>puramente tático overnight</b>, qual é a melhor prática de funding e por quê?",
    opcoes: [
      {
        id: "a",
        text: "Captar pós-fixado (100% CDI, ou compromissada com lastro em LFT): minimiza custo e elimina risco de marcação no overnight",
        correct: true,
      },
      { id: "b", text: "Aceitar sempre 101% CDI, pela conveniência de garantir volume" },
      { id: "c", text: "Usar sempre compromissada com LTN, por ter a menor taxa de face" },
      { id: "d", text: "Tanto faz: operações overnight não carregam risco relevante" },
    ],
    feedback:
      'No tático, o pós-fixado casa prazo e remoção de marcação; a taxa de face mais baixa (compromissada LTN) esconde haircut e risco de curva. O prêmio de 101% só se justifica por relacionamento. "Overnight sem risco" é falso quando há descasamento de lastro.',
    pontos: 25,
  },
  pontuacaoMax: 85,
};
