import type { Familia } from "./types";

export interface VerbeteCurva {
  id: string;
  /** Igual ao `nome` da curva no snapshot, para o aluno reconhecer o item do dropdown. */
  nome: string;
  texto: string;
}

export interface VerbeteFamilia {
  familia: Familia;
  descricao: string;
  curvas: VerbeteCurva[];
}

/**
 * Glossário do Painel de Mercado: o que cada aba de família e cada curva do
 * dropdown mostra. A ordem segue `FAMILIAS` e a ordem das curvas no snapshot.
 */
export const GLOSSARIO: VerbeteFamilia[] = [
  {
    familia: "taxas",
    descricao:
      "Estrutura a termo das taxas à vista: quanto o mercado cobra hoje, ao ano, para cada prazo. Reúne curvas nominais (prefixadas), reais (sobre o IPCA) e de cupom cambial (sobre o dólar).",
    curvas: [
      {
        id: "pre-zero",
        nome: "PRE zero-cupom (ANBIMA)",
        texto:
          "Curva prefixada sem pagamentos intermediários, estimada pela ANBIMA a partir das LTN e NTN-F. Cada ponto é a taxa de um fluxo único naquele prazo, em base 252 dias úteis. É a referência para descontar fluxos em reais.",
      },
      {
        id: "di1",
        nome: "DI Futuro (B3)",
        texto:
          "Taxa de ajuste dos contratos DI1 da B3: a expectativa do CDI acumulado até cada vencimento. É a curva de juros mais líquida do país e a base de hedge e de precificação do crédito pós-fixado. A tabela traz o DV01 de cada contrato.",
      },
      {
        id: "ntnb-zero",
        nome: "Juro real zero (NTN-B)",
        texto:
          "Juro real zero-cupom extraído das NTN-B: quanto o mercado paga acima do IPCA por um fluxo único em cada prazo. Remove o efeito dos cupons semestrais, o que permite comparar prazos diferentes de forma direta.",
      },
      {
        id: "ntnb-tir",
        nome: "TIR real (NTN-B)",
        texto:
          "Taxa indicativa ANBIMA de cada NTN-B, ou seja, a taxa interna de retorno do título com cupons. Difere da curva zero porque mistura os prazos dos cupons com o prazo do principal.",
      },
      {
        id: "dap",
        nome: "Cupom de IPCA (DAP)",
        texto:
          "Taxa de ajuste dos futuros DAP da B3: o cupom de IPCA (juro real) negociado em bolsa. Serve de hedge para carteiras de NTN-B. O 1º vencimento vem marcado porque a defasagem da indexação ao IPCA distorce a taxa.",
      },
      {
        id: "ddi",
        nome: "Cupom cambial sujo (DDI)",
        texto:
          "Futuro de cupom cambial da B3: juro em dólar no Brasil, medido contra a PTAX do dia anterior. Usa base linear de 360 dias corridos. É \"sujo\" porque carrega a variação cambial de um dia. O 1º vencimento vem marcado porque a operação casada distorce a taxa.",
      },
      {
        id: "frc",
        nome: "FRA de cupom cambial (FRC)",
        texto:
          "Operação a termo de cupom cambial: DDI curto contra DDI longo, que elimina a distorção da PTAX defasada. Gera o cupom \"limpo\", em base linear de 360 dias. É a forma usual de negociar o juro em dólar.",
      },
    ],
  },
  {
    familia: "precos",
    descricao:
      "Títulos públicos federais um a um, com a taxa indicativa da ANBIMA no gráfico. A tabela de vértices traz o PU (preço unitário), a duration e o DV01 de cada papel, usados para marcar carteiras a mercado e medir sua sensibilidade.",
    curvas: [
      {
        id: "ltn-pu",
        nome: "PU LTN",
        texto:
          "Letra do Tesouro Nacional: título prefixado sem cupom que paga R$ 1.000 no vencimento. O PU é esse valor descontado pela taxa indicativa. A duration é igual ao prazo do título.",
      },
      {
        id: "ntnf-pu",
        nome: "PU NTN-F",
        texto:
          "Nota do Tesouro Nacional série F: título prefixado com cupom semestral de 10% a.a. A taxa no gráfico é a TIR do título. Por causa dos cupons, a duration é menor que o prazo.",
      },
      {
        id: "ntnb-pu",
        nome: "PU NTN-B",
        texto:
          "Nota do Tesouro Nacional série B: título atrelado ao IPCA, com cupom semestral de 6% a.a. sobre o VNA (valor nominal atualizado pela inflação). A taxa no gráfico é a TIR real.",
      },
      {
        id: "lft-pu",
        nome: "PU LFT",
        texto:
          "Letra Financeira do Tesouro: título pós-fixado que rende a Selic. O gráfico mostra o ágio ou deságio sobre a Selic: taxa negativa significa papel negociado acima do VNA; taxa positiva, abaixo. Por isso o risco de mercado da LFT é pequeno.",
      },
    ],
  },
  {
    familia: "termo",
    descricao:
      "Taxas a termo (forwards): a taxa implícita entre dois vencimentos consecutivos, extraída das taxas à vista. Mostra o juro que o mercado já embute para cada período futuro, onde aparecem as apostas de corte ou de alta.",
    curvas: [
      {
        id: "fwd-pre",
        nome: "Forward do PRE",
        texto:
          "Taxa a termo prefixada entre vértices consecutivos das LTN. Indica o juro nominal que o mercado projeta para cada intervalo, não o juro acumulado desde hoje.",
      },
      {
        id: "fwd-di",
        nome: "Forward do DI",
        texto:
          "Taxa a termo entre contratos consecutivos de DI1. É a leitura mais usada para o caminho esperado da Selic, pois cada trecho reflete o CDI médio previsto entre dois vencimentos.",
      },
      {
        id: "fwd-real",
        nome: "Forward do juro real",
        texto:
          "Juro real a termo entre vencimentos consecutivos de NTN-B. Mostra o juro acima do IPCA que o mercado exige para cada período futuro.",
      },
      {
        id: "fwd-implicita",
        nome: "Forward da inflação implícita",
        texto:
          "Inflação implícita a termo entre vencimentos de NTN-B. Isola a inflação que o mercado espera para cada período futuro, e não a média desde hoje.",
      },
    ],
  },
  {
    familia: "implicita",
    descricao:
      "Inflação implícita (break-even): a inflação que iguala o retorno de um título prefixado ao de um título indexado ao IPCA no mesmo prazo. Pela equação de Fisher, (1 + nominal) = (1 + real) × (1 + implícita). Inclui também o prêmio de risco dos prefixados.",
    curvas: [
      {
        id: "be-ntnb-pre",
        nome: "Break-even NTN-B × PRE",
        texto:
          "Inflação implícita da TIR das NTN-B contra a curva PRE da ANBIMA, no mesmo prazo. Se a inflação realizada ficar acima dela, a NTN-B rende mais; abaixo, o prefixado rende mais. Vértice fora do alcance da curva nominal vem marcado e sem valor.",
      },
      {
        id: "be-ntnb-di",
        nome: "Break-even NTN-B × DI",
        texto:
          "Mesma conta, com o DI Futuro como curva nominal. Como o DI é mais líquido, a leitura costuma ser mais estável. A diferença para a versão contra o PRE reflete o spread entre títulos prefixados e DI.",
      },
      {
        id: "spread-pre-di",
        nome: "Spread PRE − DI",
        texto:
          "Diferença, em pontos-base, entre a taxa de cada LTN ou NTN-F e o DI Futuro do mesmo prazo. Mede quanto o Tesouro paga acima (ou abaixo) do DI: termômetro da demanda por prefixados e do risco fiscal.",
      },
      {
        id: "be-forward",
        nome: "Break-even forward",
        texto:
          "Inflação implícita a termo entre vértices consecutivos do break-even NTN-B × PRE. Mostra a inflação embutida para cada período futuro, útil para comparar com a meta de inflação no longo prazo.",
      },
    ],
  },
];
