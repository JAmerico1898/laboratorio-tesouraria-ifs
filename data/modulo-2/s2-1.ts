import type { Scenario } from "@/lib/types";

export const s2_1: Scenario = {
  id: "s2-1",
  codigo: "S2.1",
  empresa: "Mesa de renda fixa",
  titulo: "Montando a curva com 4 vértices",
  nivel: "int",
  duracaoMin: 20,
  contexto: "Você recebe o <b>DI futuro</b> da B3 em quatro vértices (a.a., DU/252) e precisa <b>interpolar a taxa de 50 du</b> para apreçar um CDB. A curva está <span class=\"num\">positivamente inclinada</span>.",
  chips: [
    {
      k: "21 du",
      v: "12,00%"
    },
    {
      k: "42 du",
      v: "12,50%"
    },
    {
      k: "63 du",
      v: "12,80%"
    },
    {
      k: "126 du",
      v: "13,10%"
    },
    {
      k: "Alvo a interpolar",
      v: "50 du"
    },
    {
      k: "Base",
      v: "DU/252"
    }
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo: "padrões de interpolação (flat-forward × linear na taxa); fórmula da forward entre vértices; spread do CDB = 102% da taxa interpolada."
  },
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "O padrão de mercado (ANBIMA) para interpolar entre vértices é o flat-forward. O que ele mantém constante no intervalo?",
      opcoes: [
        {
          id: "a",
          text: "A taxa spot de cada vértice — mantida uniforme em todo o intervalo, de modo que pontos intermediários usam o mesmo nível de juros do vértice mais próximo"
        },
        {
          id: "b",
          text: "O PU do título no intervalo — calculado pelo desconto linear do valor de face, preservando a consistência de preço entre os vértices adjacentes"
        },
        {
          id: "c",
          text: "A taxa forward (a termo) implícita entre os vértices",
          correct: true
        },
        {
          id: "d",
          text: "A duration do papel — ponderada pelos fluxos do trecho, garantindo que a sensibilidade a variações de taxa seja uniforme entre os dois vértices"
        }
      ],
      feedback: "Flat-forward assume <b>forward constante</b> entre dois vértices, preservando a multiplicatividade dos fatores de capitalização — por isso é o padrão no mercado DU/252.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "Qual a forward implícita entre 42 du (12,50%) e 63 du (12,80%), anualizada?",
      opcoes: [
        {
          id: "a",
          text: "≈ 12,65% a.a. (média aritmética simples das duas taxas spot adjacentes, sem composição dos fatores de capitalização)"
        },
        {
          id: "b",
          text: "≈ 12,80% a.a. (taxa spot do vértice de 63 du utilizada diretamente como forward do trecho, ignorando o efeito do segmento anterior)"
        },
        {
          id: "c",
          text: "≈ 13,10% a.a. (taxa spot do vértice de 126 du extrapolada para o trecho de 21 du, sem descontar o fator acumulado até 42 du)"
        },
        {
          id: "d",
          text: "≈ 13,40% a.a.",
          correct: true
        }
      ],
      feedback: "<code>(1+f)^(21/252) = (1,128)^(63/252) / (1,125)^(42/252) = 1,01054</code> → anualizando <code>1,01054^12 ≈ 1,1340</code>, logo <b>f ≈ 13,40% a.a.</b> A média simples (12,65%) ignora a composição e subestima a forward numa curva que sobe.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Se você usasse interpolação <b>linear na taxa</b> (e não flat-forward) para o vértice de 50 du, o erro seria:",
      opcoes: [
        {
          id: "a",
          text: "Pequeno e sistemático em prazos curtos — mas vira marcação equivocada em vértices longos ou curva íngreme/invertida",
          correct: true
        },
        {
          id: "b",
          text: "Grande e aleatório, sem padrão identificável — cada ponto da curva produziria um desvio diferente dependendo da inclinação local no dia"
        },
        {
          id: "c",
          text: "Nulo: os dois métodos são sempre idênticos — produzem a mesma taxa interpolada porque a relação entre fator de capitalização e taxa é linear na base DU/252"
        },
        {
          id: "d",
          text: "Relevante apenas para títulos pós-fixados — pois nesses papéis a taxa de referência muda diariamente e a interpolação precisa acompanhar o CDI do período"
        }
      ],
      feedback: "Em 50 du a diferença é de poucos bps, mas o viés é <b>sistemático</b>. Em vértices longos ou curva muito inclinada o erro cresce; em <b>curva invertida</b> a linear pode até inverter a relação forward — daí a padronização do flat-forward.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Como interpolar e marcar o CDB de 50 du?",
    subtitulo: "Cada caminho equilibra rigor × atalho.",
    ramos: [
      {
        id: "A",
        rotulo: "Flat-forward",
        titulo: "Interpolar via flat-forward (padrão ANBIMA)",
        resumo: "Forward constante entre vértices; marcação coerente e sem arbitragem.",
        resultado: {
          titulo: "Rigoroso — padrão de mercado",
          deltas: [
            { k: "Método", v: "Flat-forward", tone: "pos" },
            { k: "Taxa 50 du", v: "≈ 12,64%", tone: "neu" },
            { k: "Arbitragem", v: "Sem brecha", tone: "pos" },
            { k: "Esforço", v: "Maior (composto)", tone: "neu" }
          ],
          analise: "<code>F₄₂=(1,125)^(42/252)≈1,01982; F₆₃=(1,128)^(63/252)≈1,03057.</code> Forward entre vértices: <code>FF=1,03057/1,01982≈1,01054 → f=1,01054^12−1≈13,40% a.a.</code> Ponto 50 du (8 du além de 42): <code>F₅₀=1,01982×1,01054^(8/21)≈1,02390 → r₅₀=1,02390^(252/50)−1≈12,64%.</code> CDB: <code>12,64%×1,02≈12,89% a.a.</code> Padrão ANBIMA: forward constante preserva a multiplicatividade — sem brecha de arbitragem."
        }
      },
      {
        id: "B",
        rotulo: "Linear na taxa",
        titulo: "Interpolar linearmente na taxa (atalho)",
        resumo: "Rápido; erro de poucos bps em 50 du, mas com viés sistemático.",
        resultado: {
          titulo: "Atalho — viés pequeno mas sistemático",
          deltas: [
            { k: "Método", v: "Linear na taxa", tone: "neu" },
            { k: "Taxa 50 du", v: "≈ 12,61%", tone: "neu" },
            { k: "Erro vs flat-fwd", v: "≈ −3 bps", tone: "neg" },
            { k: "Esforço", v: "Menor", tone: "pos" }
          ],
          analise: "Interpolação linear: <code>r₅₀ = 12,50% + (12,80%−12,50%) × (50−42)/(63−42) = 12,50% + 0,30%×8/21 ≈ 12,61%</code>. Erro vs flat-fwd: <code>12,64%−12,61% = −3 bps</code>; CDB: <code>12,61%×1,02≈12,86%</code>. Aceitável para conferência rápida; em vértices longos ou curva íngreme/invertida o viés cresce e pode inverter o sinal da forward."
        }
      },
      {
        id: "C",
        rotulo: "Vértice cheio",
        titulo: "Usar o vértice de 63 du sem interpolar",
        resumo: "Pega a taxa de um vértice publicado; ignora o prazo exato.",
        resultado: {
          titulo: "Atalho grosseiro — marcação equivocada",
          deltas: [
            { k: "Método", v: "Vértice de 63 du", tone: "neg" },
            { k: "Taxa usada", v: "12,80%", tone: "neg" },
            { k: "Erro vs flat-fwd", v: "≈ +16 bps", tone: "neg" },
            { k: "Risco", v: "Marcação inflada", tone: "neg" }
          ],
          analise: "Usa 12,80% de 63 du para um papel de 50 du. Erro: <code>12,80%−12,64% = +16 bps</code>; CDB inflado: <code>12,80%×1,02 = 13,06%</code> vs <code>12,89%</code> correto. Em um book de R$ 100 mi, +16 bps representam ~R$ 160 mil de marcação equivocada por ano — exatamente o acúmulo que o flat-forward existe para evitar.",
          risco: true
        }
      }
    ]
  },
  reflexao: {
    enunciado: "Por que o mercado padroniza o flat-forward em vez da interpolação linear na taxa?",
    opcoes: [
      {
        id: "a",
        text: "Porque é simplesmente mais fácil e rápido de calcular — a operação de divisão linear entre dois vértices dispensa exponenciação e reduz o tempo de processamento nos sistemas de precificação"
      },
      {
        id: "b",
        text: "Porque a interpolação linear não funciona com pós-fixados — a taxa do CDI varia a cada dia útil, tornando qualquer método de interpolação por trecho incompatível com a remarcação diária da LFT"
      },
      {
        id: "c",
        text: "Porque preserva a multiplicatividade dos fatores (forward constante), evitando arbitragem; o erro da linear é pequeno em prazos curtos, mas sistemático e pode inverter a relação forward em curva invertida",
        correct: true
      },
      {
        id: "d",
        text: "Porque a ANBIMA proíbe o uso de cálculo composto nos vértices intermediários — a norma de marcação a mercado exige desconto linear para garantir comparabilidade entre carteiras de diferentes gestores"
      }
    ],
    feedback: "O flat-forward é coerente com a forma como os fatores se compõem no tempo; a linear é um atalho que acumula viés e, em curva invertida, distorce o sinal da forward.",
    pontos: 25
  },
  pontuacaoMax: 85
};
