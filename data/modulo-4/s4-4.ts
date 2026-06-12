import type { Scenario } from "@/lib/types";

export const s4_4: Scenario = {
  id: "s4-4",
  codigo: "S4.4",
  empresa: "Comitê de investimentos",
  titulo: "Imunizando um passivo de 3 anos",
  nivel: "adv",
  duracaoMin: 22,
  contexto: "Você precisa proteger um <b>passivo de R$ 100 mi</b> com <b>duration 3,0</b> contra variações da curva. Estão disponíveis <span class=\"num\">zeros de 1 e 5 anos</span> e um <b>choque de juros é possível</b> — paralelo ou não-paralelo.",
  chips: [
    {
      k: "Passivo",
      v: "R$ 100 mi"
    },
    {
      k: "Duration-alvo",
      v: "3,0"
    },
    {
      k: "Ativos disponíveis",
      v: "Zeros 1a e 5a"
    },
    {
      k: "Estratégias",
      v: "Cash-flow × Barbell"
    },
    {
      k: "Choque",
      v: "Paralelo / Steepening"
    },
    {
      k: "Regra",
      v: "w·1 + (1−w)·5 = 3"
    }
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "O que a imunização por duration busca?",
      opcoes: [
        {
          id: "a",
          text: "Casar a duration (e o VP) de ativos e passivos para neutralizar o risco de juros",
          correct: true
        },
        {
          id: "b",
          text: "Maximizar o cupom recebido no período — escolher os ativos de maior taxa garante que o fluxo gerado supere o passivo e protege a carteira de variações de juros"
        },
        {
          id: "c",
          text: "Zerar a exposição à inflação — ao casar os fluxos reais de ativo e passivo com IPCA+, o valor do portfólio fica imune a choques de preços e variações da curva nominal"
        },
        {
          id: "d",
          text: "Eliminar o risco de crédito da carteira — ao selecionar ativos com duration equivalente ao passivo, concentra-se em emissores soberanos e afasta o risco de default"
        }
      ],
      feedback: "O objetivo é proteger o valor de um passivo/objetivo futuro contra variações da taxa, casando duration e valor presente entre ativos e passivos.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "Para atingir duration-alvo 3,0 com zeros de 1 e 5 anos (barbell), quais os pesos?",
      opcoes: [
        {
          id: "a",
          text: "25% / 75% (pesa mais o vencimento longo, resultando em duration 4,0)"
        },
        {
          id: "b",
          text: "50% / 50%",
          correct: true
        },
        {
          id: "c",
          text: "75% / 25% (pesa mais o vencimento curto, resultando em duration 2,0)"
        },
        {
          id: "d",
          text: "0% / 100% (alocar tudo no zero de 5 anos, resultando em duration 5,0)"
        }
      ],
      feedback: "<code>w·1 + (1−w)·5 = 3 → w = 0,5</code>. Metade em 1 ano e metade em 5 anos atinge duration 3,0 — com mais convexidade que um bullet de 3 anos.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "A carteira está imunizada (duration ativo = passivo) e a curva sofre <b>steepening</b> (movimento não-paralelo). O que ocorre?",
      opcoes: [
        {
          id: "a",
          text: "A imunização é perfeita e nada muda na carteira — desde que a duration de ativos e passivos esteja casada, qualquer formato de movimento da curva é integralmente compensado pela variação simétrica do portfólio"
        },
        {
          id: "b",
          text: "A convexidade da carteira simplesmente desaparece — o steepening redistribui o peso dos vencimentos e elimina o benefício assimétrico do barbell, tornando-o equivalente a um bullet de mesma duration"
        },
        {
          id: "c",
          text: "Descasamento residual: a imunização por duration protege contra choque paralelo, não contra inclinação/curvatura",
          correct: true
        },
        {
          id: "d",
          text: "O risco de crédito da carteira aumenta — o steepening sinaliza deterioração fiscal e eleva o spread soberano dos títulos longos, expondo o barbell a maior risco de default na ponta de 5 anos"
        }
      ],
      feedback: "Duration assume choque paralelo. Movimentos de inclinação/curvatura geram risco residual — daí o uso de medidas por fator (key-rate durations) e rebalanceamento.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Qual estratégia de proteção adotar?",
    subtitulo: "Precisão × custo × robustez a choques não-paralelos.",
    ramos: [
      {
        id: "A",
        rotulo: "Barbell duration",
        titulo: "Barbell 50/50 (zeros 1 e 5) p/ duration 3,0",
        resumo: "Casa a duration; protege o paralelo, deixa resíduo no não-paralelo.",
        resultado: {
          titulo: "Casa o nível — resíduo em steepening",
          deltas: [
            { k: "Duration", v: "Casada (3,0)", tone: "pos" },
            { k: "Choque paralelo", v: "Protegido", tone: "pos" },
            { k: "Steepening", v: "Descasamento residual", tone: "neg" },
            { k: "Convexidade", v: "Maior que bullet", tone: "pos" }
          ],
          analise: "<code>w×1+(1−w)×5=3 → w=0,5</code>: R$ 50 mi em zeros de 1a + R$ 50 mi em zeros de 5a. Choque paralelo +50 bps: <code>ΔPV_ativo ≈ −3,0×100mi×0,005 = −R$ 1,5 mi = ΔPV_passivo → descasamento zero ✓</code>. Choque de steepening (+30 bps em 1a, +70 bps em 5a): as pontas reagem de forma diferente → descasamento residual ≠ 0."
        }
      },
      {
        id: "B",
        rotulo: "Cash-flow",
        titulo: "Cash-flow matching (casar os fluxos)",
        resumo: "Casa fluxo a fluxo; robusto a qualquer formato de curva.",
        resultado: {
          titulo: "Robusto — imune ao formato da curva",
          deltas: [
            { k: "Casamento", v: "Fluxo a fluxo", tone: "pos" },
            { k: "Choque não-paralelo", v: "Protegido", tone: "pos" },
            { k: "Custo", v: "Maior / menos flexível", tone: "neg" },
            { k: "Reinvestimento", v: "Eliminado", tone: "pos" }
          ],
          analise: "Para casar o passivo de duration 3,0 (pagamento único em t=3), precisaria de um zero de 3 anos — não disponível aqui (só 1a e 5a). Quando o ativo existe: qualquer formato de curva (paralelo, inclinação, curvatura) é neutralizado pois cada fluxo do passivo tem ativo correspondente. Custo: engessamento e eventual escassez de papéis nos vencimentos exatos."
        }
      },
      {
        id: "C",
        rotulo: "Key-rate",
        titulo: "Duration + key-rate e rebalanceamento",
        resumo: "Cobre nível e inclinação por fator; exige monitoramento.",
        resultado: {
          titulo: "Por fator — cobre inclinação ao custo de gestão",
          deltas: [
            { k: "Medida", v: "Key-rate durations", tone: "pos" },
            { k: "Inclinação/curvatura", v: "Endereçada", tone: "pos" },
            { k: "Rebalanceamento", v: "Necessário", tone: "neu" },
            { k: "Custo", v: "Monitoramento contínuo", tone: "neg" }
          ],
          analise: "Decompõe a duration em sensibilidades por vértice: <code>KRD_1a = 0,5×1 = 0,5</code> e <code>KRD_5a = 0,5×5 = 2,5 → soma = 3,0 ✓</code>. Em steepening (+70 bps na ponta 5a): perda adicional ≈ <code>KRD_5a × 0,70% × PV = 2,5×0,007×100mi = R$ 1,75 mi</code>; rebalanceia para restaurar o casamento. Endereça o não-paralelo ao custo de monitoramento e giro contínuos."
        }
      }
    ]
  },
  reflexao: {
    enunciado: "Qual a principal limitação da imunização por duration e como mitigá-la?",
    opcoes: [
      {
        id: "a",
        text: "Não tem limitação: a imunização por duration é perfeita — ao casar Dmod e VP de ativos e passivos, a carteira fica protegida contra qualquer deslocamento da curva, paralelo ou não, e não requer rebalanceamento ao longo do tempo"
      },
      {
        id: "b",
        text: "A limitação é o risco de crédito do emissor: como os ativos são títulos soberanos, o principal risco residual após casar a duration é o default do Tesouro, que mitiga-se diversificando entre emissores de diferentes ratings"
      },
      {
        id: "c",
        text: "A duration captura qualquer formato de movimento da curva: por ser uma média ponderada dos prazos dos fluxos, a Dmod incorpora tanto deslocamentos paralelos quanto inclinações e curvaturas, protegendo a carteira de forma completa"
      },
      {
        id: "d",
        text: "Ela protege contra deslocamentos paralelos; inclinação/curvatura geram descasamento residual — mitiga-se com cash-flow matching (robusto, caro) ou com medidas por fator (key-rate) e rebalanceamento",
        correct: true
      }
    ],
    feedback: "Casar duration é necessário, mas não suficiente: a curva se move em nível, inclinação e curvatura. Proteger só o nível deixa um resíduo que exige cash-flow matching ou gestão por fator.",
    pontos: 25
  },
  pontuacaoMax: 85
};
