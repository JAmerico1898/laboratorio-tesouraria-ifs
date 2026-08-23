import type { Pauta } from "@/lib/types";
import {
  bps,
  getVertice,
  taxaDe,
} from "@/lib/mercado/metricas";
import { bpsFmt, num, pct } from "@/lib/mercado/template";
import {
  NOCIONAL_PADRAO,
} from "@/lib/mercado/config";

export const p5_6: Pauta = {
  id: "p5-6",
  codigo: "P5.6",
  titulo: "Quanto custa captar em dólar hoje?",
  nivel: "sup",
  duracaoMin: 25,
  familia: "taxas",
  curvaInicial: "frc",
  curvaComparacao: "ddi",
  icon: "currency_exchange",
  contexto: "O banco tem uma linha externa vencendo e precisa decidir entre rolar em dólar ou captar em reais e sintetizar a exposição. Em 21/08/2026, o DDI de set/26 marcava 37,154% — um número que não é taxa de nada —, o de out/26 caía para 13,602% e o de dez/26 para 8,518%. O FRC, no mesmo dia, marcava 4,91% em out/26, 5,00% em dez/26 e 5,18% em jan/27. A PTAX do dia era 5,1625.",
  chips: [
    { k: "DDIU26 (1º venc.)", v: "{{ddi.DDIU26.taxa}}" },
    { k: "DDIV26 (out/26)", v: "{{ddi.DDIV26.taxa}}" },
    { k: "DDIZ26 (dez/26)", v: "{{ddi.DDIZ26.taxa}}" },
    { k: "FRCV26 (out/26)", v: "{{frc.FRCV26.taxa}}" },
    { k: "FRCZ26 (dez/26)", v: "{{frc.FRCZ26.taxa}}" },
    { k: "FRCF27 (jan/27)", v: "{{frc.FRCF27.taxa}}" },
    { k: "PTAX", v: "{{ind.ptax}}" },
    { k: "PRE 28 du", v: "{{pre-zero.28.taxa}}" },
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1 — Observação",
      enunciado: "Compare as duas curvas de cupom cambial no painel, vértice a vértice. O que cada uma faz ao longo do prazo?",
      opcoes: [
        {
          id: "a",
          texto: "O DDI é maior que o FRC em todos os vencimentos comparáveis e a distância entre as duas curvas encolhe conforme o prazo aumenta",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "O DDI e o FRC praticamente coincidem a partir do segundo vencimento, divergindo apenas no primeiro contrato de cada estrutura a termo",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "O DDI parte de 37,15% no 1º vencimento e cai a 8,52% em dezembro, enquanto o FRC apenas sobe suavemente de 4,91% a 5,18%",
          leituraCurso: true,
          feedback: "inclinações de sinal oposto entre curvas que supostamente medem o mesmo objeto são a evidência de que não medem",
        },
        {
          id: "d",
          texto: "O FRC é maior que o DDI em todos os vencimentos, o que é esperado por o FRC ser uma taxa a termo e o DDI uma taxa à vista",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a primeira leitura também é verdadeira — o DDI fica acima do FRC em todos os vértices e a distância encolhe com o prazo —, mas descreve o nível. A terceira descreve o movimento: as duas curvas têm <b>inclinações de sinais opostos</b>, o DDI despenca e o FRC sobe de leve. Isso, sozinho, já indica que não medem a mesma coisa.",
      pontos: 15,
      next: "etapa-2",
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2 — Interpretação",
      enunciado: "As duas curvas medem \"cupom cambial\" e divergem em centenas de bps. O que separa uma da outra?",
      opcoes: [
        {
          id: "a",
          texto: "O DDI está sujo por embutir risco de crédito da contraparte no mercado offshore, e o FRC é a mesma taxa depois de retirado esse risco",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "O DDI é sujo pelo casado: carrega a variação cambial do dia anterior; o FRC é o cupom a termo entre dois vencimentos, já limpo",
          leituraCurso: true,
          feedback: "a contaminação pela PTAX defasada é máxima no vencimento mais curto e se dilui com o prazo, o que reproduz exatamente o decaimento observado",
        },
        {
          id: "c",
          texto: "O DDI é cotado em base 252 dias úteis e o FRC em base 360 dias corridos, e toda a diferença observada vem dessa mudança de convenção",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "O FRC é apenas o DDI de vencimento mais longo renomeado, sem qualquer diferença econômica relevante entre os dois instrumentos negociados",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "\"sujo\" no jargão do cupom cambial significa <b>contaminado pela PTAX defasada</b>, não por risco de crédito. Ambos os contratos usam base 360 em dias corridos — a convenção é a mesma.",
      pontos: 15,
      next: "etapa-3",
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3 — Implicação",
      enunciado: "Você precisa de um número para comparar com a linha externa ofertada. Qual?",
      opcoes: [
        {
          id: "a",
          texto: "Usar o FRC como custo limpo de captação sintética em dólar e comparar com a linha externa que foi efetivamente ofertada",
          leituraCurso: true,
          feedback: "é a taxa a termo, comparável termo a termo com a oferta da linha externa",
        },
        {
          id: "b",
          texto: "Usar o DDI do primeiro vencimento como custo de captação em dólar, por ser o contrato de referência mais líquido de toda a estrutura",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "Usar a diferença entre DDI e FRC como estimativa direta do prêmio de risco país embutido na captação externa da instituição financeira",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "Usar a paridade coberta a partir do DI e da PTAX, ignorando as duas curvas de cupom por serem redundantes com o mercado de juros",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a diferença DDI − FRC é <b>efeito do casado</b>, não risco país. E a paridade coberta calculada a partir do DI e da PTAX é exatamente o que o mercado de cupom já precifica — checar contra ele é bom; substituí-lo por ele, não.",
      pontos: 15,
      next: "etapa-4",
    },
    {
      id: "etapa-4",
      titulo: "Etapa 4 — Resolução da pauta",
      enunciado: "Três formas de resolver o vencimento da linha externa, com o cupom do dia em tela.",
      opcoes: [
        {
          id: "A",
          texto: "Rolar a linha externa — Captar direto em USD",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "B",
          texto: "Sintetizar via FRC — Captar em BRL + FRC",
          leituraCurso: true,
          feedback: "a decisão é uma comparação de dois números observáveis no dia, não uma visão de mercado",
        },
        {
          id: "C",
          texto: "Meio a meio — Metade em cada",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "DDI e FRC não são a mesma taxa em prazos diferentes — são taxas <b>diferentes</b>. O DDI carrega a defasagem do casado; o FRC é o cupom limpo a termo, e é ele que se compara com a linha externa ofertada.",
      pontos: 25,
      next: "",
    },
  ],
  posicoes: [
    {
      id: "A",
      rotulo: "Rolar a linha externa",
      decisao: "Captar direto em USD",
      consequencias: [
        { estado: "Consequência se o cupom subir 100 bps", efeito: "Custo sobe na renovação seguinte" },
        { estado: "Consequência se o cupom ceder 100 bps", efeito: "Custo cai; sem consumo de limite local" },
      ],
      contrafactual: (s) => `rolar em USD: 100 bps de alta do cupom sobre US$ ${num(NOCIONAL_PADRAO / (s.indicadores.ptax ?? 1), 0)} de exposição equivalem a US$ ${num((NOCIONAL_PADRAO / (s.indicadores.ptax ?? 1)) * 0.01, 0)} ao ano`,
    },
    {
      id: "B",
      rotulo: "Sintetizar via FRC",
      decisao: "Captar em BRL + FRC",
      consequencias: [
        { estado: "Consequência se o cupom subir 100 bps", efeito: "Custo travado no cupom de hoje" },
        { estado: "Consequência se o cupom ceder 100 bps", efeito: "Perde a queda; trava conhecida" },
      ],
      contrafactual: (s) => `sintetizar: trava o cupom em ${pct(taxaDe(s, "frc", "FRCZ26"), 3)} para dez/26: vale se a linha externa ofertada custar mais que isso`,
    },
    {
      id: "C",
      rotulo: "Meio a meio",
      decisao: "Metade em cada",
      consequencias: [
        { estado: "Consequência se o cupom subir 100 bps", efeito: "Exposição parcial nos dois sentidos" },
        { estado: "Consequência se o cupom ceder 100 bps", efeito: "Idem, com custo médio" },
      ],
      contrafactual: (s) => `meio a meio: custo médio ${pct((taxaDe(s, "frc", "FRCZ26") + taxaDe(s, "ddi", "DDIZ26")) / 2, 3)} entre a trava do FRC e a exposição do cupom à vista`,
    },
  ],
  posicaoCurso: "B",
  gabarito: {
    sintese: "DDI e FRC não são a mesma taxa em prazos diferentes — são taxas <b>diferentes</b>. O DDI carrega a defasagem do casado; o FRC é o cupom limpo a termo, e é ele que se compara com a linha externa ofertada.",
    notas: [
      {
        etapaId: "etapa-1",
        answer: "DDI decrescente de 37,15% a 8,52%; FRC crescente de 4,91% a 5,18%",
        rationale: "inclinações de sinal oposto entre curvas que supostamente medem o mesmo objeto são a evidência de que não medem",
        math: (s) => {
    const d1 = taxaDe(s, "ddi", "DDIU26");
    const dz = taxaDe(s, "ddi", "DDIZ26");
    const f1 = taxaDe(s, "frc", "FRCV26");
    const f3 = taxaDe(s, "frc", "FRCF27");
    const fz = taxaDe(s, "frc", "FRCZ26");
    return `queda do DDI = ${pct(d1, 3)} − ${pct(dz, 3)} = ${bpsFmt(bps(d1 - dz))}; alta do FRC = ${pct(f3, 3)} − ${pct(f1, 3)} = ${bpsFmt(bps(f3 - f1))}; distância DDI − FRC em dez/26 = ${pct(dz, 3)} − ${pct(fz, 3)} = ${bpsFmt(bps(dz - fz))}`;
  },
      },
      {
        etapaId: "etapa-2",
        answer: "DDI sujo pelo casado, FRC limpo e a termo",
        rationale: "a contaminação pela PTAX defasada é máxima no vencimento mais curto e se dilui com o prazo, o que reproduz exatamente o decaimento observado",
        math: (s) => {
    const v1 = getVertice(s, "ddi", "DDIU26");
    const v2 = getVertice(s, "ddi", "DDIZ26");
    const fatorTaxa = (v1?.taxa ?? NaN) / (v2?.taxa ?? NaN);
    const fatorPrazo = (v2?.diasUteis ?? NaN) / (v1?.diasUteis ?? NaN);
    return `o efeito se dilui com o prazo: de ${v1?.diasUteis} du (${pct(v1?.taxa, 3)}) a ${v2?.diasUteis} du (${pct(v2?.taxa, 3)}), a taxa cai por fator ≈ ${num(fatorTaxa, 1)}× enquanto o prazo cresce ≈ ${num(fatorPrazo, 1)}×`;
  },
      },
      {
        etapaId: "etapa-3",
        answer: "usar o FRC como custo limpo de captação sintética",
        rationale: "é a taxa a termo, comparável termo a termo com a oferta da linha externa",
        math: (s) => {
    const fz = taxaDe(s, "frc", "FRCZ26");
    const du = getVertice(s, "frc", "FRCZ26")?.diasUteis ?? NaN;
    const diPrazo = taxaDe(s, "di1", "DI1Z26");
    const ptax = s.indicadores.ptax ?? NaN;
    return `custo sintético aproximado em dez/26 = DI do prazo (${pct(diPrazo)} em ${du} du) combinado com FRC ${pct(fz, 3)}; a checagem de paridade usa a PTAX ${num(ptax, 4)} como spot`;
  },
      },
      {
        etapaId: "etapa-4",
        answer: "posição B se o FRC estiver abaixo do custo da linha externa ofertada; caso contrário, A",
        rationale: "a decisão é uma comparação de dois números observáveis no dia, não uma visão de mercado",
        math: (s) => {
    const fz = taxaDe(s, "frc", "FRCZ26");
    return `decidir por B se custo_linha_externa > FRC do prazo; em dez/26, o limiar é ${pct(fz, 3)} a.a.`;
  },
      },
    ],
    glossario: [
      { termo: "Cupom cambial", definicao: "juro em dólar dentro do mercado brasileiro; remuneração de USD aplicado localmente." },
      { termo: "DDI", definicao: "futuro de cupom cambial \"sujo\", contaminado pela PTAX do dia anterior." },
      { termo: "FRC", definicao: "Forward Rate Agreement de cupom cambial; o cupom limpo entre dois vencimentos." },
      { termo: "Casado", definicao: "operação combinada de dólar à vista e futuro que dá origem à contaminação do DDI." },
      { termo: "PTAX", definicao: "taxa de câmbio de referência divulgada pelo Banco Central." },
      { termo: "Base 360 dias corridos", definicao: "convenção linear dos contratos de cupom, distinta do DU/252 dos juros em reais." },
      { termo: "Paridade coberta de juros", definicao: "relação entre juro doméstico, juro externo e câmbio spot/forward." },
      { termo: "Captação sintética", definicao: "obter exposição em moeda estrangeira combinando captação local com derivativo." },
    ],
  },
  pontuacaoMax: 70,
};
