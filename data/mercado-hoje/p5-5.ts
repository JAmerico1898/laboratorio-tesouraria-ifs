import type { Pauta } from "@/lib/types";
import {
  bps,
  getVertice,
  taxaDe,
} from "@/lib/mercado/metricas";
import { bpsFmt, brl, num, pct } from "@/lib/mercado/template";
import {
  DU_ANO,
  NOCIONAL_PADRAO,
} from "@/lib/mercado/config";

export const p5_5: Pauta = {
  id: "p5-5",
  codigo: "P5.5",
  titulo: "DAP e NTN-B contam a mesma história?",
  nivel: "adv",
  duracaoMin: 20,
  familia: "taxas",
  curvaInicial: "dap",
  curvaComparacao: "ntnb-zero",
  icon: "stacked_line_chart",
  contexto: "Existem dois mercados de juro real no Brasil: o de caixa, na NTN-B, e o de futuro, no DAP da B3. Deveriam apontar para o mesmo lugar. Em 21/08/2026, o DAP de set/26 marcava 16,326%; o de out/26, 11,863%; o de dez/26, 10,049%; e o de jan/27, 8,677% — enquanto a NTN-B mais curta pagava 7,0024% de TIR real. A mesa quer saber se há arbitragem ou se está comparando coisas diferentes.",
  chips: [
    { k: "DAPU26 (set/26)", v: "{{dap.DAPU26.taxa}}" },
    { k: "DAPV26 (out/26)", v: "{{dap.DAPV26.taxa}}" },
    { k: "DAPZ26 (dez/26)", v: "{{dap.DAPZ26.taxa}}" },
    { k: "DAPF27 (jan/27)", v: "{{dap.DAPF27.taxa}}" },
    { k: "NTN-B 2027", v: "{{ntnb-tir.NTN-B 2027.taxa}}" },
    { k: "IPCA projetado (mês)", v: "{{ind.ipcaProjetado}}" },
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1 — Observação",
      enunciado: "Sobreponha o DAP à curva da NTN-B no painel e olhe o trecho curto. O que acontece com o DAP conforme o prazo avança?",
      opcoes: [
        {
          id: "a",
          texto: "O DAP decai fortemente com o prazo, saindo de 16,33% no primeiro vencimento para 8,68% no vencimento de janeiro de 2027",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "O DAP cai de 16,33% para 8,68% em 83 dias úteis e converge para o nível da curva da NTN-B conforme o prazo se alonga",
          leituraCurso: true,
          feedback: "registrar o destino da convergência é o que separa ruído de arbitragem",
        },
        {
          id: "c",
          texto: "O DAP se mantém estável em torno de 10% em todos os vencimentos observados, sem tendência clara relacionada ao prazo do contrato",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "O DAP é sistematicamente inferior à curva da NTN-B em todos os vencimentos comparáveis do trecho curto da estrutura a termo",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a convergência é a parte que importa. Uma leitura que só registra a queda perde o fato de que o <b>destino</b> dessa queda é o nível da NTN-B — e é isso que descarta arbitragem estrutural.",
      pontos: 15,
      next: "etapa-2",
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2 — Interpretação",
      enunciado: "O DAP curto marca mais que o dobro do juro real da NTN-B. Oportunidade ou convenção?",
      opcoes: [
        {
          id: "a",
          texto: "O DAP curto é dominado pela defasagem de indexação: com IPCA projetado negativo no mês, o carrego distorce fortemente a taxa anualizada",
          leituraCurso: true,
          feedback: "anualizar um prazo de 16 du amplifica qualquer distorção de carrego; a NTN-B tem defasagem de apenas 15 dias, mas o contrato curto de cupom carrega o mês corrente inteiro",
        },
        {
          id: "b",
          texto: "Há arbitragem aberta entre os dois mercados, e a mesa deve comprar NTN-B curta financiando a posição com venda de DAP no vencimento correspondente",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "A diferença decorre de o DAP ser indexado ao IGP-M enquanto a NTN-B segue o IPCA, o que explica integralmente o descolamento observado",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "O DAP curto é simplesmente ilíquido e sua taxa de ajuste não reflete negócio real, devendo ser descartada de qualquer análise de curva",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "o DAP também segue o IPCA. E anualizar 16 dias úteis com um carrego mensal negativo produz exatamente esse tipo de número — não é oportunidade, é <b>matemática de prazo curto</b>.",
      pontos: 15,
      next: "etapa-3",
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3 — Implicação",
      enunciado: "Dado o diagnóstico, o que a mesa faz com a curva de DAP na precificação interna?",
      opcoes: [
        {
          id: "a",
          texto: "Usar o DAP curto como referência de juro real para toda a precificação interna de operações indexadas com prazo de até um ano",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "Descartar o DAP inteiramente e utilizar apenas a curva da NTN-B como referência única de juro real em qualquer horizonte de análise",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "Ajustar a NTN-B para cima, de modo a alinhá-la ao DAP curto, corrigindo o que seria uma defasagem de apuração da taxa indicativa",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "Ignorar o primeiro vencimento do DAP e usar do segundo em diante, onde a defasagem de indexação já não domina a taxa",
          leituraCurso: true,
          feedback: "a distorção é concentrada e conhecida; o restante da curva é informativo",
        },
      ],
      feedback: "descartar o instrumento inteiro joga fora a informação boa junto com a ruim. A convenção da B3 é conhecida: o <b>primeiro vencimento</b> de contratos de cupom é sempre o mais distorcido, e o painel já o marca com asterisco.",
      pontos: 15,
      next: "etapa-4",
    },
    {
      id: "etapa-4",
      titulo: "Etapa 4 — Resolução da pauta",
      enunciado: "Três formas de operar juro real diante do descolamento observado no trecho curto.",
      opcoes: [
        {
          id: "A",
          texto: "Hedge de juro real via DAP — Vender DAP contra carteira de NTN-B",
          leituraCurso: true,
          feedback: "é o hedge líquido e executável; B consome balanço e C confunde convenção com prêmio",
        },
        {
          id: "B",
          texto: "Hedge via NTN-B a termo — Operar o papel, não o futuro",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "C",
          texto: "Base trade explícita — Assumir a diferença como posição de base",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "o descolamento do DAP curto é <b>convenção, não oportunidade</b>. A trilha ótima identifica a defasagem de indexação como causa, descarta o primeiro vencimento e usa o resto da curva, que de fato converge para o juro real da NTN-B.",
      pontos: 25,
      next: "",
    },
  ],
  posicoes: [
    {
      id: "A",
      rotulo: "Hedge de juro real via DAP",
      decisao: "Vender DAP contra carteira de NTN-B",
      consequencias: [
        { estado: "Consequência", efeito: "Casamento imperfeito no curto; funciona bem do 2º vencimento em diante" },
      ],
      contrafactual: (s) => `hedge via DAP a partir do 2º vencimento: distância à NTN-B cai de ${bpsFmt(bps(taxaDe(s, "dap", "DAPU26") - taxaDe(s, "ntnb-tir", "NTN-B 2027")))} no 1º para ${bpsFmt(bps(taxaDe(s, "dap", "DAPF27") - taxaDe(s, "ntnb-tir", "NTN-B 2027")))} no 5º`,
    },
    {
      id: "B",
      rotulo: "Hedge via NTN-B a termo",
      decisao: "Operar o papel, não o futuro",
      consequencias: [
        { estado: "Consequência", efeito: "Sem ruído de convenção; menos liquidez e mais consumo de balanço" },
      ],
      contrafactual: (s) => `operar o papel: juro real de ${pct(taxaDe(s, "ntnb-tir", "NTN-B 2027"))} sem ruído de convenção, ao custo de consumir balanço em ${brl(NOCIONAL_PADRAO)} de posição à vista`,
    },
    {
      id: "C",
      rotulo: "Base trade explícita",
      decisao: "Assumir a diferença como posição de base",
      consequencias: [
        { estado: "Consequência", efeito: "Exige entender a defasagem; o \"spread\" do 1º vencimento não é lucro" },
      ],
      contrafactual: (s) => `base trade: o "spread" do 1º vencimento é ${bpsFmt(bps(taxaDe(s, "dap", "DAPU26") - taxaDe(s, "ntnb-tir", "NTN-B 2027")))}, quase todo ele defasagem de indexação e não prêmio a capturar`,
    },
  ],
  posicaoCurso: "A",
  gabarito: {
    sintese: "o descolamento do DAP curto é <b>convenção, não oportunidade</b>. A trilha ótima identifica a defasagem de indexação como causa, descarta o primeiro vencimento e usa o resto da curva, que de fato converge para o juro real da NTN-B.",
    notas: [
      {
        etapaId: "etapa-1",
        answer: "queda de 16,33% para 8,68% em 83 du, convergindo ao nível da NTN-B",
        rationale: "registrar o destino da convergência é o que separa ruído de arbitragem",
        math: (s) => {
    const d1 = taxaDe(s, "dap", "DAPU26");
    const d4 = taxaDe(s, "dap", "DAPF27");
    const b = taxaDe(s, "ntnb-tir", "NTN-B 2027");
    const du1 = getVertice(s, "dap", "DAPU26")?.diasUteis ?? NaN;
    const du4 = getVertice(s, "dap", "DAPF27")?.diasUteis ?? NaN;
    return `queda total = ${pct(d1, 3)} − ${pct(d4, 3)} = ${bpsFmt(bps(d1 - d4))} em ${du4 - du1} dias úteis; distância do DAPF27 à NTN-B 2027 = ${bpsFmt(bps(d4 - b))}, contra ${bpsFmt(bps(d1 - b))} no primeiro vencimento`;
  },
      },
      {
        etapaId: "etapa-2",
        answer: "defasagem de indexação com IPCA projetado negativo",
        rationale: "anualizar um prazo de 16 du amplifica qualquer distorção de carrego; a NTN-B tem defasagem de apenas 15 dias, mas o contrato curto de cupom carrega o mês corrente inteiro",
        math: (s) => {
    const du1 = getVertice(s, "dap", "DAPU26")?.diasUteis ?? NaN;
    const ipca = s.indicadores.ipcaProjetado ?? NaN;
    return `fator de anualização em ${du1} du = ${DU_ANO}/${du1} = ${num(DU_ANO / du1)}×; com IPCA projetado de ${pct(ipca, 2)} no mês, o carrego negativo é multiplicado por essa alavancagem de prazo`;
  },
      },
      {
        etapaId: "etapa-3",
        answer: "ignorar o 1º vencimento, usar do 2º em diante",
        rationale: "a distorção é concentrada e conhecida; o restante da curva é informativo",
        math: (s) => {
    const b = taxaDe(s, "ntnb-tir", "NTN-B 2027");
    const ds = ["DAPV26", "DAPX26", "DAPZ26", "DAPF27"].map((r) => bps(taxaDe(s, "dap", r) - b));
    const media = ds.reduce((a, x) => a + x, 0) / ds.length;
    return `distância média à NTN-B do 2º ao 5º vencimento = (${ds.map((x) => num(x, 1)).join(" + ")})/4 ≈ ${bpsFmt(media, 1)}, decrescente e convergente`;
  },
      },
      {
        etapaId: "etapa-4",
        answer: "posição A, excluído o primeiro vencimento",
        rationale: "é o hedge líquido e executável; B consome balanço e C confunde convenção com prêmio",
        math: (s) => {
    const v = getVertice(s, "ntnb-tir", "NTN-B 2035");
    return `razão de hedge ≈ DV01 da carteira NTN-B ÷ DV01 do contrato DAP; para ${brl(NOCIONAL_PADRAO)} na NTN-B 2035 (DV01 ${num(v?.dv01, 4)} por título, PU ${num(v?.pu, 2)}), a exposição a cobrir é ≈ ${brl((NOCIONAL_PADRAO / (v?.pu ?? NaN)) * (v?.dv01 ?? NaN), 2)} por bp`;
  },
      },
    ],
    glossario: [
      { termo: "DAP", definicao: "futuro de cupom de IPCA da B3; juro real negociado no mercado futuro." },
      { termo: "Defasagem de indexação", definicao: "intervalo entre o período de apuração do índice e a data em que ele corrige o papel; 15 dias na NTN-B." },
      { termo: "Cupom de IPCA", definicao: "juro real embutido no contrato futuro." },
      { termo: "Taxa de ajuste", definicao: "taxa de fechamento usada na liquidação diária do futuro." },
      { termo: "Anualização", definicao: "conversão de taxa de prazo curto para base anual; amplifica distorções quando o prazo é muito curto." },
      { termo: "Base", definicao: "diferença entre o preço do futuro e o do ativo à vista." },
      { termo: "Razão de hedge", definicao: "quantidade de contratos por unidade de exposição, calculada por DV01." },
      { termo: "Vencimento curto distorcido", definicao: "convenção conhecida da B3 em contratos de cupom." },
    ],
  },
  pontuacaoMax: 70,
};
