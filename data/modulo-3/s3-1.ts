import type { Scenario } from "@/lib/types";

export const s3_1: Scenario = {
  id: "s3-1",
  codigo: "S3.1",
  empresa: "Mesa de títulos públicos",
  titulo: "Pré ou pós no caixa de 6 meses?",
  nivel: "int",
  duracaoMin: 20,
  contexto: "Você tem <span class=\"num\">R$ 300 mi</span> para aplicar por <span class=\"num\">~126 du</span>. A <b>LTN de 126 du</b> está a <span class=\"num\">11,50% a.a.</span> (PU R$ 947,03). A Selic atual é <span class=\"num\">10,40%</span> e o Focus está <b>dividido</b> entre cortes e estabilidade/alta.",
  chips: [
    {
      k: "Volume",
      v: "R$ 300 mi"
    },
    {
      k: "Prazo",
      v: "126 du"
    },
    {
      k: "LTN 126 du",
      v: "11,50% a.a."
    },
    {
      k: "Selic atual",
      v: "10,40%"
    },
    {
      k: "Focus",
      v: "Dividido"
    }
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo: "LTN (pré, zero-cupom, <code>PU = 1000/(1+i)^(du/252)</code>), LFT (pós-Selic, marcação estável) e CDB pós (102% CDI, risco de crédito do emissor)."
  },
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "Qual o PU da LTN de 126 du a 11,50% a.a. (VN R$ 1.000, DU/252)?",
      opcoes: [
        {
          id: "a",
          text: "R$ 892,86 — resultado de descontar R$ 1.000 por 252 du inteiros a 11,50%, ignorando que o prazo é de apenas meio ano"
        },
        {
          id: "b",
          text: "R$ 947,03",
          correct: true
        },
        {
          id: "c",
          text: "R$ 1.057,00 — valor acima do VN, como se a taxa negativa descontasse fluxo futuro abaixo de zero, invertendo a lógica de precificação do zero-cupom"
        },
        {
          id: "d",
          text: "R$ 885,00 — cálculo aplicando 11,50% como taxa linear sobre 126 dias corridos, em vez de potência fracionária sobre dias úteis (DU/252)"
        }
      ],
      feedback: "<code>PU = 1000/(1,115)^(126/252) = 1000/√1,115 = 1000/1,05594 ≈ R$ 947,03</code>. O distrator R$ 892,86 usa <code>1000/1,115</code> como se fosse 252 du (1 ano inteiro).",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "Você compra a LTN a 11,50%. Se a Selic <b>cair</b> (a curva pré recua), o que acontece com o PU dessa LTN?",
      opcoes: [
        {
          id: "a",
          text: "O PU sobe — ganho de marcação, pois a taxa de mercado fica abaixo dos 11,50% travados",
          correct: true
        },
        {
          id: "b",
          text: "O PU não muda — a taxa travada na compra congela o desconto do fluxo, tornando o papel imune a oscilações da curva pré até o vencimento"
        },
        {
          id: "c",
          text: "O PU cai acompanhando a queda da Selic — pois o prefixado replica o carrego do pós, reduzindo seu valor à medida que o CDI recua"
        },
        {
          id: "d",
          text: "Depende apenas do CDI diário acumulado — pois o pré é reprecificado pelo fator DI overnight que vai compondo o PU até o vencimento"
        }
      ],
      feedback: "Em prefixados, preço e taxa andam em sentidos opostos. Travar 11,50% e a curva cair gera <b>ganho de marcação</b> — exatamente o atrativo do pré numa aposta de corte.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Se em vez da LTN você tivesse escolhido <b>LFT</b> e a Selic <b>subisse</b>, o efeito na marcação seria:",
      opcoes: [
        {
          id: "a",
          text: "Grande perda de marcação, como na LTN — pois a alta da Selic eleva a taxa de desconto do VNA, gerando impacto simétrico ao do prefixado"
        },
        {
          id: "b",
          text: "Grande ganho de marcação com a alta — pois o aumento da Selic valoriza o VNA acima do par, produzindo ganho imediato no PU da LFT"
        },
        {
          id: "c",
          text: "Igual ao efeito sofrido pela LTN — pois ambos são títulos públicos com a mesma duration efetiva e sensibilidade à curva de juros"
        },
        {
          id: "d",
          text: "Mínimo: a LFT acompanha a Selic (VNA), com marcação quase imune ao nível da curva pré",
          correct: true
        }
      ],
      feedback: "A LFT é pós-Selic: o VNA acompanha a taxa, então sua marcação é muito estável. É o ativo de <b>caixa defensivo</b> quando se teme alta de juros.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Como aplicar os R$ 300 mi?",
    subtitulo: "A escolha expressa sua visão de Selic e seu apetite por marcação.",
    ramos: [
      {
        id: "A",
        rotulo: "LTN pré",
        titulo: "Aplicar em LTN 126 du a 11,50%",
        resumo: "Aposta em corte; ganho de marcação se a curva recuar.",
        resultado: {
          titulo: "Aposta direcional em corte",
          deltas: [
            { k: "Indexador", v: "Pré 11,50%", tone: "neu" },
            { k: "Se Selic cair", v: "Ganho de marcação", tone: "pos" },
            { k: "Se Selic subir", v: "Perda de marcação", tone: "neg" },
            { k: "Carrego", v: "Travado em 11,50%", tone: "neu" }
          ],
          analise: "PU compra: R$ 947,03. Volume: <code>R$ 300 mi / 947,03 ≈ 316.772 títulos</code>. Se curva pré recuar 50 bps (→ 11,0%): <code>PU_novo = 1000/(1,110)^(126/252) ≈ R$ 950,32 → ganho ≈ R$ 3,29/título × 316.772 ≈ R$ 1,04 mi</code>. Se subir 50 bps (→ 12,0%): <code>PU_novo ≈ R$ 943,79 → perda ≈ R$ 1,03 mi</code>. Aposta simétrica ao redor do carrego de 11,5%."
        }
      },
      {
        id: "B",
        rotulo: "LFT pós",
        titulo: "Aplicar em LFT (pós-Selic)",
        resumo: "Defensivo; marcação estável, acompanha a Selic.",
        resultado: {
          titulo: "Defensivo — marcação estável",
          deltas: [
            { k: "Indexador", v: "Pós-Selic", tone: "neu" },
            { k: "Risco de marcação", v: "Mínimo", tone: "pos" },
            { k: "Se Selic subir", v: "Acompanha", tone: "pos" },
            { k: "Upside direcional", v: "Nenhum", tone: "neu" }
          ],
          analise: "VNA acompanha a Selic diariamente. Carrego: <code>(1,1040)^(126/252)−1 ≈ 5,07%</code> no período vs <code>5,47%</code> da LTN a 11,5%. Delta = <code>−0,40 p.p.</code> — o prêmio de risco pago pela aposta direcional da LTN. Se a Selic subir, o carrego aumenta automaticamente; marcação quase imune ao nível da curva pré."
        }
      },
      {
        id: "C",
        rotulo: "CDB 102%",
        titulo: "Aplicar em CDB pós a 102% do CDI",
        resumo: "Acompanha a Selic com spread; assume risco de crédito do emissor.",
        resultado: {
          titulo: "Pós com spread, risco de crédito",
          deltas: [
            { k: "Indexador", v: "102% CDI", tone: "pos" },
            { k: "Spread vs Selic", v: "+2% do CDI", tone: "pos" },
            { k: "Risco de crédito", v: "Do emissor", tone: "neg" },
            { k: "Liquidez", v: "Menor que título público", tone: "neg" }
          ],
          analise: "Carrego 102% do CDI: taxa diária <code>i_d = (1,1040)^(1/252) − 1 ≈ 0,03929%</code>; aplicando 102%: <code>1,02 × i_d ≈ 0,04007%</code> ao dia; reanualizado: <code>(1,0004007)^252 − 1 ≈ 10,64% a.a.</code>; para 126 du: <code>(1,0004007)^126 − 1 ≈ 5,19%</code> no período. Delta vs LFT pura (5,07%): <code>+0,12 p.p.</code> → sobre R$ 300 mi: <code>R$ 300 mi × 0,0012 ≈ R$ 360 mil adicionais em 126 du</code>. Contrapartida: risco de crédito do emissor do CDB e menor liquidez vs título público — aceitável dentro de limites de concentração por emissor."
        }
      }
    ]
  },
  reflexao: {
    enunciado: "Por que uma LTN longa carrega um payoff direcional assimétrico?",
    opcoes: [
      {
        id: "a",
        text: "Porque a LTN carrega risco de crédito do Tesouro — emissor soberano que pode alterar o fluxo prometido, tornando o payoff incerto nos dois sentidos"
      },
      {
        id: "b",
        text: "É aposta prefixada: acertar o corte gera ganho (limitado), mas errar a direção amplifica a perda pela duration — ganha pouco se a Selic ficar estável e perde muito se subir",
        correct: true
      },
      {
        id: "c",
        text: "Porque a LFT é mais arriscada que a LTN longa — sua duration mais elevada amplifica a sensibilidade a choques de juro, gerando perdas assimétricas maiores"
      },
      {
        id: "d",
        text: "Porque o CDB pós sempre rende mais que a LTN — o spread de crédito do emissor privado compensa o risco direcional do prefixado em qualquer cenário de Selic"
      }
    ],
    feedback: "Quanto maior a duration, maior a sensibilidade do PU à taxa. A LTN longa é uma aposta de convexidade desfavorável ao gestor desatento — daí a disciplina de limite de duration.",
    pontos: 25
  },
  pontuacaoMax: 85
};
