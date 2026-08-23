import type { Pauta } from "@/lib/types";
import {
  bps,
  getCurva,
  minimo,
  taxaDe,
} from "@/lib/mercado/metricas";
import { bpsFmt, num, pct } from "@/lib/mercado/template";
import {
  BANDA_SUPERIOR,
  META_INFLACAO,
} from "@/lib/mercado/config";

export const p5_4: Pauta = {
  id: "p5-4",
  codigo: "P5.4",
  titulo: "A implícita acredita na meta?",
  nivel: "adv",
  duracaoMin: 20,
  familia: "implicita",
  curvaInicial: "be-ntnb-pre",
  curvaComparacao: "be-ntnb-di",
  icon: "target",
  contexto: "A meta contínua do Banco Central é 3,00% com tolerância de ±1,50 p.p. Em 21/08/2026, a inflação implícita contra a curva PRE era de 6,10% no vencimento de mai/2027, cedia para 5,52% em 2028 e voltava a subir de forma monotônica até 6,33% em 2035. Toda a curva de break-even está fora da banda superior da meta. O comitê de risco quer saber o que isso significa para a política de indexação do passivo.",
  chips: [
    { k: "Meta / banda superior", v: "3,00% / 4,50%" },
    { k: "Implícita mai/2027", v: "{{be-ntnb-pre.mai/27.taxa}}" },
    { k: "Implícita ago/2028", v: "{{be-ntnb-pre.ago/28.taxa}}" },
    { k: "Implícita mai/2031", v: "{{be-ntnb-pre.mai/31.taxa}}" },
    { k: "Implícita mai/2035", v: "{{be-ntnb-pre.mai/35.taxa}}" },
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1 — Observação",
      enunciado: "Confronte a curva de break-even com a meta e a banda de tolerância, marcadas no gráfico. O que está em tela?",
      opcoes: [
        {
          id: "a",
          texto: "A implícita fica acima da banda superior em todos os vértices e desenha um U, com mínimo em 2028 e alta contínua depois disso",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "A implícita fica acima da meta central de 3,00% mas dentro da banda de tolerância na maior parte dos vencimentos observados hoje",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "A implícita converge suavemente para a meta central de 3,00% conforme o horizonte se alonga, como manda o regime de metas",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "A implícita supera a banda de 4,50% em todos os vértices, com mínimo de 5,52% em 2028 e alta monotônica até 6,33% em 2035",
          leituraCurso: true,
          feedback: "é a descrição do que está em tela, incluindo a violação da banda no ponto mais favorável",
        },
      ],
      feedback: "a primeira leitura acerta o desenho, mas para no qualitativo; a quarta ancora os dois extremos em número, e é desses números que a Resolução parte. A segunda erra o fato — 5,52% já está acima de 4,50%. A terceira descreve o que o regime <b>deveria</b> produzir, não o que a tela mostra. Ler o que se espera ver em vez do que está na tela é o erro mais caro deste módulo.",
      pontos: 15,
      next: "etapa-2",
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2 — Interpretação",
      enunciado: "A implícita supera a banda em toda a extensão. O que exatamente esse excesso mede?",
      opcoes: [
        {
          id: "a",
          texto: "A implícita é expectativa mais prêmio de risco de inflação; parte do excesso sobre a meta remunera incerteza, não descrença",
          leituraCurso: true,
          feedback: "o prêmio de liquidez é empiricamente nulo no caso brasileiro e a convexidade é de ordem de 1 bp; sobra o prêmio de risco de inflação como explicação do excesso",
        },
        {
          id: "b",
          texto: "A implícita é expectativa de inflação pura, de modo que o mercado projeta literalmente 6,33% de IPCA ao ano até o ano de 2035",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "A implícita está contaminada por prêmio de liquidez elevado da NTN-B, e no Brasil esse componente domina a diferença observada",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "A implícita não é comparável à meta porque mede variação do IGP-M, e não a variação do IPCA a que a meta se refere",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a NTN-B é indexada ao <b>IPCA</b> (a NTN-C é que segue o IGP-M) — a quarta leitura confunde os papéis. Quanto à liquidez: o trabalho do BCB sobre o tema estima esse prêmio como <b>estatisticamente não distinguível de zero</b> no Brasil, porque a NTN-B é tipicamente carregada até o vencimento.",
      pontos: 15,
      next: "etapa-3",
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3 — Implicação",
      enunciado: "A implícita é um preço. Como esse preço entra na política de indexação do passivo?",
      opcoes: [
        {
          id: "a",
          texto: "Migrar todo o passivo para indexação ao IPCA, travando o custo real e eliminando de vez a exposição do balanço à inflação futura",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "Migrar todo o passivo para prefixado, já que a implícita elevada torna o custo real da indexação proibitivo em qualquer horizonte",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "Comparar a implícita de cada prazo com a projeção própria de IPCA: indexar onde a implícita está barata, prefixar onde está cara",
          leituraCurso: true,
          feedback: "indexar quando a implícita está abaixo da projeção própria é comprar proteção barata; prefixar no caso oposto",
        },
        {
          id: "d",
          texto: "Manter a política de indexação inalterada, pois a implícita oscila demais no dia a dia para servir de insumo a decisão estrutural",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a implícita é um <b>preço</b>, e preço se compara com valor. As duas primeiras leituras decidem pelo instrumento; a leitura do curso decide pelo diferencial entre preço de mercado e projeção própria, prazo a prazo.",
      pontos: 15,
      next: "etapa-4",
    },
    {
      id: "etapa-4",
      titulo: "Etapa 4 — Resolução da pauta",
      enunciado: "Três políticas de indexação do passivo diante da mesma curva de break-even.",
      opcoes: [
        {
          id: "A",
          texto: "Passivo prefixado — Travar nominal na curva PRE",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "B",
          texto: "Passivo indexado ao IPCA — Pagar juro real + IPCA",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "C",
          texto: "Misto pelo diferencial — Indexar onde implícita < projeção própria",
          leituraCurso: true,
          feedback: "A e B apostam num único regime de inflação; C usa a estrutura a termo da implícita, que é justamente a informação que o painel oferece e as outras duas descartam",
        },
      ],
      feedback: "o break-even do dia está integralmente acima da banda da meta, mas isso <b>não</b> é o mercado projetando 6% de IPCA. É expectativa somada a um prêmio de risco de inflação; a decomposição — não o nível bruto — é o que orienta a política de indexação.",
      pontos: 25,
      next: "",
    },
  ],
  posicoes: [
    {
      id: "A",
      rotulo: "Passivo prefixado",
      decisao: "Travar nominal na curva PRE",
      consequencias: [
        { estado: "Consequência se o IPCA vier em 4,5%", efeito: "Custo real efetivo maior que o esperado" },
        { estado: "Consequência se vier em 7,0%", efeito: "Custo real cai; a inflação corrói o passivo" },
      ],
      contrafactual: (s) => `prefixado: trava a taxa nominal e paga o prêmio de risco de inflação embutido, de ${bpsFmt(bps(taxaDe(s, "be-ntnb-pre", "mai/35") - BANDA_SUPERIOR))} acima da banda no topo da curva, em 2035`,
    },
    {
      id: "B",
      rotulo: "Passivo indexado ao IPCA",
      decisao: "Pagar juro real + IPCA",
      consequencias: [
        { estado: "Consequência se o IPCA vier em 4,5%", efeito: "Custo real conhecido; economiza o prêmio embutido" },
        { estado: "Consequência se vier em 7,0%", efeito: "Custo real conhecido; sem surpresa" },
      ],
      contrafactual: (s) => `indexado: custo real conhecido de ${pct(taxaDe(s, "ntnb-zero", "NTN-B 2028"))} em 2028, qualquer que seja o IPCA: economiza o prêmio, abre mão do ganho se a inflação vier baixa`,
    },
    {
      id: "C",
      rotulo: "Misto pelo diferencial",
      decisao: "Indexar onde implícita < projeção própria",
      consequencias: [
        { estado: "Consequência se o IPCA vier em 4,5%", efeito: "Captura o erro de precificação prazo a prazo" },
        { estado: "Consequência se vier em 7,0%", efeito: "Idem, com hedge parcial contra o cenário adverso" },
      ],
      contrafactual: (s) => {
      const min = minimo(getCurva(s, "be-ntnb-pre")!)!;
      return `misto: indexar onde a implícita está mais barata (${min.rotulo}, ${pct(min.taxa)}) e prefixar onde está cara, capturando a estrutura a termo que A e B descartam`;
    },
    },
  ],
  posicaoCurso: "C",
  gabarito: {
    sintese: "o break-even do dia está integralmente acima da banda da meta, mas isso <b>não</b> é o mercado projetando 6% de IPCA. É expectativa somada a um prêmio de risco de inflação; a decomposição — não o nível bruto — é o que orienta a política de indexação.",
    notas: [
      {
        etapaId: "etapa-1",
        answer: "acima de 4,50% em todos os vértices, mínimo de 5,52% em 2028, alta monotônica até 6,33% em 2035",
        rationale: "é a descrição do que está em tela, incluindo a violação da banda no ponto mais favorável",
        math: (s) => {
    const min = minimo(getCurva(s, "be-ntnb-pre")!)!;
    const t35 = taxaDe(s, "be-ntnb-pre", "mai/35");
    return `excesso sobre a banda no mínimo (${min.rotulo}) = ${pct(min.taxa)} − ${pct(BANDA_SUPERIOR)} = ${bpsFmt(bps(min.taxa! - BANDA_SUPERIOR))}; no topo da curva, em 2035 = ${pct(t35)} − ${pct(BANDA_SUPERIOR)} = ${bpsFmt(bps(t35 - BANDA_SUPERIOR))}; excesso sobre a meta central em 2035 = ${bpsFmt(bps(t35 - META_INFLACAO))}`;
  },
      },
      {
        etapaId: "etapa-2",
        answer: "implícita = expectativa + prêmio de risco de inflação (+ convexidade − prêmio de liquidez)",
        rationale: "o prêmio de liquidez é empiricamente nulo no caso brasileiro e a convexidade é de ordem de 1 bp; sobra o prêmio de risco de inflação como explicação do excesso",
        math: (s) => {
    const t35 = taxaDe(s, "be-ntnb-pre", "mai/35");
    return `se a expectativa fosse ${pct(BANDA_SUPERIOR)}, o prêmio implícito em 2035 seria ${pct(t35)} − ${pct(BANDA_SUPERIOR)} = ${bpsFmt(bps(t35 - BANDA_SUPERIOR))}; a convexidade, na ordem de 1 bp, é imaterial diante disso`;
  },
      },
      {
        etapaId: "etapa-3",
        answer: "comparar implícita contra projeção própria, prazo a prazo",
        rationale: "indexar quando a implícita está abaixo da projeção própria é comprar proteção barata; prefixar no caso oposto",
        math: (s) => {
    const t28 = taxaDe(s, "be-ntnb-pre", "ago/28");
    const semPar = getCurva(s, "be-ntnb-pre")!.vertices.filter((v) => v.taxa === null);
    return `diferencial no vértice de 2028 = ${pct(t28)} − projeção própria de IPCA do prazo; repetir em cada vértice e ordenar por diferencial. ${semPar.length} vencimentos (${semPar.map((v) => v.rotulo).join(", ")}) ficam fora do alcance da curva nominal e não têm implícita`;
  },
      },
      {
        etapaId: "etapa-4",
        answer: "posição C",
        rationale: "A e B apostam num único regime de inflação; C usa a estrutura a termo da implícita, que é justamente a informação que o painel oferece e as outras duas descartam",
        math: (s) => {
    const z28 = taxaDe(s, "ntnb-zero", "NTN-B 2028");
    const nPre = taxaDe(s, "pre-zero", "jul/28");
    return `custo real de B = taxa zero real do prazo (${pct(z28)} em 2028); custo real esperado de A = taxa nominal PRE do vértice mais próximo (${pct(nPre)} em jul/28) − projeção própria de IPCA`;
  },
      },
    ],
    glossario: [
      { termo: "Inflação implícita (break-even)", definicao: "taxa que iguala o retorno de um nominal e de um indexado no mesmo prazo." },
      { termo: "Prêmio de risco de inflação", definicao: "remuneração exigida por carregar risco de perda de poder de compra no título nominal." },
      { termo: "Prêmio de liquidez", definicao: "compensação pela dificuldade de sair da posição no papel indexado; empiricamente nulo no mercado brasileiro." },
      { termo: "Convexidade (correção de Jensen)", definicao: "ajuste por a relação preço-taxa não ser linear; ordem de 1 bp." },
      { termo: "Meta contínua", definicao: "regime em que a meta é perseguida permanentemente, não por ano-calendário." },
      { termo: "Banda de tolerância", definicao: "±1,50 p.p. em torno da meta." },
      { termo: "IPCA", definicao: "índice de preços ao consumidor amplo, indexador da NTN-B e âncora do regime." },
      { termo: "Extrapolação", definicao: "estender a curva além do último vértice observado; <b>não</b> utilizada aqui, por isso os seis vencimentos longos aparecem sem implícita." },
    ],
  },
  pontuacaoMax: 70,
};
