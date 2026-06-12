import type { ModuleMeta } from "./types";

export const MODULES: ModuleMeta[] = [
  {
    id: "modulo-1",
    numero: 1,
    slug: "modulo-1",
    nav: "Operações de Tesouraria",
    titulo: "Principais operações de tesouraria",
    descricao:
      "Base de matemática financeira e leitura do mercado monetário: funding, gap préÃ—pós, precificação de crédito e defesa do juro real.",
    icon: "account_balance",
    objetivos: [
      "Aplicar modelos fundamentais de matemática financeira (equivalência de taxas, capitalização DU/252).",
      "Conhecer a dinâmica do mercado monetário e suas taxas (Selic-meta Ã— Selic-over, CDI).",
      "Compreender o impacto do cenário econômico na formação da taxa de juros.",
      "Aplicar a dinâmica de juros a partir do estudo dos riscos financeiros (gap, crédito, liquidez, inflação).",
    ],
    totalSimulacoes: 4,
    disponivel: true,
  },
  {
    id: "modulo-2",
    numero: 2,
    slug: "modulo-2",
    nav: "ETTJ",
    titulo: "Estrutura temporal das taxas de juros no Brasil",
    descricao:
      "Componentes da taxa de juros, construção da ETTJ, taxa spot, taxa forward (FRA) e cupom cambial.",
    icon: "show_chart",
    objetivos: [
      "Aplicar a dinâmica das taxas de juros no tempo a partir dos seus componentes.",
      "Construir e relacionar taxas em momentos diferentes do tempo (ETTJ).",
      "Conhecer as taxas spot e calcular taxas forward (FRA) e o cupom cambial.",
    ],
    totalSimulacoes: 4,
    disponivel: true,
  },
  {
    id: "modulo-3",
    numero: 3,
    slug: "modulo-3",
    nav: "Apreçamento",
    titulo: "Apreçamento das operações de tesouraria",
    descricao:
      "Precificação de títulos públicos federais, títulos privados de instituições financeiras e de empresas.",
    icon: "request_quote",
    objetivos: [
      "Calcular os principais títulos públicos federais e avaliar seu impacto nas estratégias de investimento.",
      "Calcular o valor dos principais títulos privados de instituições financeiras.",
      "Calcular títulos privados de empresas e o spread de crédito.",
    ],
    totalSimulacoes: 4,
    disponivel: true,
  },
  {
    id: "modulo-4",
    numero: 4,
    slug: "modulo-4",
    nav: "Gestão de Risco",
    titulo: "Gestão de carregamento de ativos",
    descricao:
      "Estratégias de carregamento na renda fixa, risco de taxa de juros, duration, convexidade e imunização.",
    icon: "shield",
    objetivos: [
      "Relacionar cenário, dinâmica de juros e estratégias de carregamento na renda fixa.",
      "Compreender o risco de taxa de juros e seus fatores.",
      "Aplicar duration, convexidade e imunização de carteiras.",
    ],
    totalSimulacoes: 4,
    disponivel: true,
  },
  {
    id: "modulo-5",
    numero: 5,
    slug: "estudos-de-caso",
    nav: "Estudos de Caso",
    titulo: "Estudos de Caso",
    descricao: "Casos narrativos que integram os quatro módulos em decisões reais de tesouraria â€” do diagnóstico macro ao parecer ao ALCO.",
    icon: "menu_book",
    objetivos: [
      "Mobilizar os quatro módulos simultaneamente numa decisão real de balanço.",
      "Distinguir prêmio de expectativa na curva de juros.",
      "Apreçar posições e medir exposição em reais (DV01, EVE, NII).",
      "Ancorar recomendações no mandato e no passivo da instituição.",
    ],
    totalSimulacoes: 3,
    disponivel: true,
  },
];

export function getModule(slug: string): ModuleMeta | undefined {
  return MODULES.find((m) => m.slug === slug);
}

