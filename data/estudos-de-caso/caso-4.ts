import type { CaseStudy } from "@/lib/types";

export const caso4: CaseStudy = {
  id: "caso-4",
  codigo: "4.D",
  modulo: "Módulo 4",
  titulo: "Imunizando o passivo atuarial de um fundo de pensão",
  situacao:
    'Um <span class="hl">fundo de pensão</span> tem obrigações de pagamento em <span class="num">3, 7 e 12 anos</span> (corrigidas pela inflação) e precisa <span class="hl">proteger o valor presente</span> contra movimentos da curva. Você monta a carteira imunizante e define a política de rebalanceamento.',
  chips: [
    "Entidade: Fundo de pensão",
    "Obrigações: 3 · 7 · 12 anos",
    "Passivo indexado a: IPCA",
    "Duration do passivo: ≈ 7,8 anos",
    "Universo: NTN-B / NTN-F / zeros",
    "Dilema: Cash-flow × duration",
  ],
  exhibits: [
    {
      id: "exhibit-1",
      titulo: "Exhibit 1 · Fluxo do passivo — VP descontado a ~6% real (NTN-B)",
      colunas: ["Vencimento", "Valor (R$ mi)", "VP (R$ mi)"],
      linhas: [
        ["3 anos", 50, "41,98"],
        ["7 anos", 80, "53,20"],
        ["12 anos", 120, "59,64"],
      ],
      totalRow: ["Total", 250, "154,82"],
      nota:
        "<b>Duration de Macaulay do passivo</b> = Σ(t·VP)/ΣVP = 1.214,0 / 154,8 ≈ <b>7,8 anos</b>.",
    },
    {
      id: "exhibit-2",
      titulo: "Exhibit 2 · Universo de títulos disponíveis",
      colunas: ["Título", "Indexador", "Duration", "Convexidade", "Liquidez"],
      linhas: [
        ["NTN-B 2027", "IPCA+", "1,9", "baixa", "alta"],
        ["NTN-B 2035", "IPCA+", "7,0", "média", "alta"],
        ["NTN-B 2045", "IPCA+", "12,5", "alta", "média"],
        ["NTN-F 2031", "Pré", "4,5", "média", "alta"],
        ["Zero 10a", "Pré", "10,0", "—", "média"],
      ],
    },
    {
      id: "exhibit-3",
      titulo: "Exhibit 3 · Curvas pré e real — Taxas a.a.",
      colunas: ["Vértice", "Pré", "Real (NTN-B)"],
      linhas: [
        ["3 anos", "12,5%", "6,2%"],
        ["7 anos", "13,0%", "6,4%"],
        ["12 anos", "13,3%", "6,6%"],
      ],
    },
  ],
  perguntas: [
    {
      id: "i",
      enunciado: "<b>i.</b> Qual carteira atinge a duration-alvo (~7,8)?",
      resolucao:
        'Barbell de NTN-B 2027 (D≈1,9) e NTN-B 2045 (D≈12,5): <code>w·1,9 + (1−w)·12,5 = 7,8 → w ≈ 0,44</code> → ~<b>44% curta / 56% longa</b>. Verificação: <code>0,44·1,9 + 0,56·12,5 ≈ 7,8</code>. Alternativa: bullet em NTN-B 2035 (D≈7,0) com pequeno ajuste. O barbell casa a duration com <b>maior convexidade</b>.',
    },
    {
      id: "ii",
      enunciado: "<b>ii.</b> Qual a exposição a choques não-paralelos e como mitigá-la?",
      resolucao:
        'A imunização por duration protege contra choque <b>paralelo</b>; com vencimentos em 3/7/12 anos, um <i>steepening/twist</i> gera <b>descasamento residual</b> entre as pontas. Mitiga-se com <b>key-rate durations</b> (casar exposição em cada vértice), cash-flow matching parcial nas pontas e <b>rebalanceamento periódico</b>.',
    },
    {
      id: "iii",
      enunciado: "<b>iii.</b> Convém usar IPCA+ para casar passivo indexado à inflação?",
      resolucao:
        "<b>Sim.</b> Como o passivo atuarial é corrigido pela inflação, casar com <b>NTN-B (IPCA+)</b> elimina o risco inflacionário do descasamento. Usar pré/NTN-F deixaria risco de inflação residual — o indexador do ativo deve espelhar o do passivo.",
    },
    {
      id: "iv",
      enunciado: "<b>iv.</b> Qual a política de rebalanceamento?",
      resolucao:
        "Rebalancear quando a duration do ativo desviar da meta além de uma banda (ex.: ±0,25 ano) ou em janelas fixas (trimestral), e após movimentos não-paralelos relevantes; monitorar convexidade agregada e limites de concentração/liquidez.",
    },
  ],
  entregavel:
    "carteira imunizante proposta (pesos), cálculo de duration/convexidade agregadas e plano de rebalanceamento de uma página.",
  debrief:
    "Amarrar <b>todo o curso</b>: equivalência de taxas (M1), ETTJ/forward (M2), apreçamento (M3) e gestão de risco/imunização (M4). Reforçar que casar duration é necessário, não suficiente — a curva se move em nível, inclinação e curvatura. É o caso de fechamento (capstone).",
  rubrica: [
    { criterio: "Cálculo da duration do passivo", pontos: 20, descricao: "" },
    { criterio: "Carteira que casa a duration (pesos do barbell)", pontos: 25, descricao: "" },
    { criterio: "Tratamento do risco não-paralelo (key-rate)", pontos: 20, descricao: "" },
    { criterio: "Escolha de indexador (IPCA+) justificada", pontos: 15, descricao: "" },
    { criterio: "Política de rebalanceamento", pontos: 10, descricao: "" },
    { criterio: "Clareza do entregável", pontos: 10, descricao: "" },
  ],
};
