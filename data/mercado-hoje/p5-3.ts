import type { Pauta } from "@/lib/types";
import {
  bps,
  getCurva,
  getVertice,
  maximo,
  taxaDe,
  verticesValidos,
} from "@/lib/mercado/metricas";
import { bpsFmt, num, pct } from "@/lib/mercado/template";

export const p5_3: Pauta = {
  id: "p5-3",
  codigo: "P5.3",
  titulo: "O juro real que o mercado exige hoje",
  nivel: "adv",
  duracaoMin: 20,
  familia: "taxas",
  curvaInicial: "ntnb-zero",
  curvaComparacao: "ntnb-tir",
  icon: "savings",
  contexto: "A carteira de banking book do banco tem duração longa e passivo indexado à inflação. O ALCO quer saber quanto de juro real o mercado está exigindo e onde a curva real oferece o melhor ponto de entrada. Em 21/08/2026, a NTN-B 2027 pagava 7,0024% de TIR real; a 2028, 8,0700%; e a curva se achatava em torno de 8,0% no miolo, recuando para 7,4100% em 2055 e 7,3602% de taxa zero em 2050.",
  chips: [
    { k: "NTN-B 2027 — TIR real", v: "{{ntnb-tir.NTN-B 2027.taxa}}" },
    { k: "NTN-B 2028 — TIR real", v: "{{ntnb-tir.NTN-B 2028.taxa}}" },
    { k: "NTN-B 2035 — TIR / zero", v: "{{ntnb-tir.NTN-B 2035.taxa}} / {{ntnb-zero.NTN-B 2035.taxa}}" },
    { k: "NTN-B 2050 — TIR / zero", v: "{{ntnb-tir.NTN-B 2050.taxa}} / {{ntnb-zero.NTN-B 2050.taxa}}" },
    { k: "Duration NTN-B 2035", v: "{{ntnb-tir.NTN-B 2035.duration}} anos" },
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1 — Observação",
      enunciado: "Compare a TIR real e a taxa zero real dos mesmos papéis no painel. O que a diferença entre elas revela?",
      opcoes: [
        {
          id: "a",
          texto: "A TIR real e a taxa zero são praticamente idênticas nos vencimentos curtos e se separam progressivamente conforme o prazo do papel aumenta",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "A TIR real e a taxa zero coincidem em toda a extensão da curva, o que confirma que o bootstrap é irrelevante para papéis indexados",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "A diferença entre TIR e zero é nula no papel mais curto e chega a 26 bps em 2055, porque o peso dos cupons cresce com o prazo",
          leituraCurso: true,
          feedback: "quanto mais longo o papel, mais peso têm os cupons intermediários, e é isso que o bootstrap corrige",
        },
        {
          id: "d",
          texto: "A taxa zero está acima da TIR real em todos os vértices, refletindo o desconto adicional aplicado aos fluxos intermediários de cupom",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a primeira e a terceira leituras dizem o mesmo; a terceira <b>quantifica e explica</b>. A quarta generaliza para toda a curva um sinal que só vale no miolo, onde a zero fica 1 a 2 bps acima da TIR; na ponta longa, que é onde a diferença é material, o sinal é o oposto. A segunda é a mais perigosa: se TIR e zero coincidissem, o bootstrap da seção 3.2 não teria razão de existir — e teria.",
      pontos: 15,
      next: "etapa-2",
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2 — Interpretação",
      enunciado: "A curva real cede no trecho longo. Qual explicação sobrevive ao que o painel mostra?",
      opcoes: [
        {
          id: "a",
          texto: "A queda da taxa real no trecho longo indica que o mercado espera uma economia estruturalmente mais fraca e com menor produtividade adiante",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "O trecho longo cede porque a demanda estrutural de fundos de pensão comprime o juro real onde o passivo deles é mais longo",
          leituraCurso: true,
          feedback: "o efeito aparece igualmente na TIR e na zero, o que descarta artefato de bootstrap",
        },
        {
          id: "c",
          texto: "O trecho longo cede simplesmente porque há menos papéis emitidos naqueles vencimentos, e a escassez de oferta derruba mecanicamente a taxa",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "A queda no trecho longo é artefato do bootstrap e desapareceria caso a curva fosse construída diretamente a partir das TIRs observadas",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a hipótese de artefato é testável <b>no próprio painel</b> — compare TIR e zero: as duas caem no longo. Escassez de oferta e demanda cativa são primas, mas a segunda explica por que a demanda é insensível a preço.",
      pontos: 15,
      next: "etapa-3",
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3 — Implicação",
      enunciado: "Você tem o par (juro real, DV01) de cada vértice. Onde a carteira se concentra?",
      opcoes: [
        {
          id: "a",
          texto: "Concentrar no trecho de 2028 a 2033, onde o juro real é máximo e a duration ainda não impõe o DV01 elevado da ponta longa",
          leituraCurso: true,
          feedback: "é onde a taxa real é máxima e a duration ainda é moderada",
        },
        {
          id: "b",
          texto: "Concentrar na NTN-B 2060, que oferece o horizonte mais longo de proteção real disponível no mercado para casar com passivo perpétuo",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "Concentrar na NTN-B 2027, cuja TIR real de 7,0024% é a menor da curva e portanto a de menor risco de reprecificação adversa",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "Distribuir uniformemente por todos os 14 vencimentos, neutralizando qualquer aposta direcional sobre o formato da curva real observada",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a ponta longa oferece taxa <b>menor</b> com DV01 muito <b>maior</b> — pior nas duas dimensões para quem busca prêmio real. Escolher o papel curto por ter a menor taxa confunde nível com risco.",
      pontos: 15,
      next: "etapa-4",
    },
    {
      id: "etapa-4",
      titulo: "Etapa 4 — Resolução da pauta",
      enunciado: "Três desenhos de carteira sobre a mesma curva real. O que muda é o par prêmio/risco que cada um compra.",
      opcoes: [
        {
          id: "A",
          texto: "Barbell 2027 + 2060 — Extremos da curva",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "B",
          texto: "Bullet 2028–2033 — Miolo, juro real máximo",
          leituraCurso: true,
          feedback: "maximiza prêmio real por unidade de DV01; o barbell compra risco de taxa onde o prêmio é menor, e o ladder dilui exatamente o trecho que se quer capturar",
        },
        {
          id: "C",
          texto: "Ladder 14 vencimentos — Escada completa",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a curva real do dia paga <b>mais</b> no miolo do que na ponta longa, e cobra muito menos risco de taxa ali. A trilha ótima lê o par (juro real, DV01) em conjunto — nível sozinho leva à ponta longa, que é o pior dos dois mundos neste dia.",
      pontos: 25,
      next: "",
    },
  ],
  posicoes: [
    {
      id: "A",
      rotulo: "Barbell 2027 + 2060",
      decisao: "Extremos da curva",
      consequencias: [
        { estado: "Consequência se a curva real subir 50 bps", efeito: "Perna longa domina a perda; DV01 alto" },
        { estado: "Consequência se o juro real ceder 50 bps", efeito: "Ganho concentrado na perna longa" },
      ],
      contrafactual: (s) => {
      const c = verticesValidos(getCurva(s, "ntnb-tir")!);
      const curto = c[0], longo = c.at(-1)!;
      return `barbell ${curto.rotulo} + ${longo.rotulo}: taxa média ${pct(((curto.taxa! + longo.taxa!) / 2))}, DV01 médio ${num(((curto.dv01 ?? 0) + (longo.dv01 ?? 0)) / 2, 4)}: a perna longa domina o risco`;
    },
    },
    {
      id: "B",
      rotulo: "Bullet 2028–2033",
      decisao: "Miolo, juro real máximo",
      consequencias: [
        { estado: "Consequência se a curva real subir 50 bps", efeito: "Perda moderada, compatível com o prêmio capturado" },
        { estado: "Consequência se o juro real ceder 50 bps", efeito: "Ganho moderado e carrego real alto no caminho" },
      ],
      contrafactual: (s) => {
      const v = getVertice(s, "ntnb-tir", "NTN-B 2028");
      return `bullet no miolo: ${pct(v?.taxa)} de juro real com DV01 ${num(v?.dv01, 4)}; prêmio sobre a ponta longa = ${bpsFmt(bps(taxaDe(s, "ntnb-tir", "NTN-B 2028") - taxaDe(s, "ntnb-tir", "NTN-B 2050")))}`;
    },
    },
    {
      id: "C",
      rotulo: "Ladder 14 vencimentos",
      decisao: "Escada completa",
      consequencias: [
        { estado: "Consequência se a curva real subir 50 bps", efeito: "Perda média da curva; sem escolha ativa" },
        { estado: "Consequência se o juro real ceder 50 bps", efeito: "Ganho médio; renuncia ao prêmio do miolo" },
      ],
      contrafactual: (s) => {
      const vs = verticesValidos(getCurva(s, "ntnb-tir")!);
      const media = vs.reduce((a, v) => a + v.taxa!, 0) / vs.length;
      return `ladder pelos ${vs.length} vencimentos: juro real médio ${pct(media)}, ou ${bpsFmt(bps(taxaDe(s, "ntnb-tir", "NTN-B 2028") - media))} abaixo do miolo que se queria capturar`;
    },
    },
  ],
  posicaoCurso: "B",
  gabarito: {
    sintese: "a curva real do dia paga <b>mais</b> no miolo do que na ponta longa, e cobra muito menos risco de taxa ali. A trilha ótima lê o par (juro real, DV01) em conjunto — nível sozinho leva à ponta longa, que é o pior dos dois mundos neste dia.",
    notas: [
      {
        etapaId: "etapa-1",
        answer: "a diferença TIR − zero é nula no curto e chega a ~26 bps em 2055",
        rationale: "quanto mais longo o papel, mais peso têm os cupons intermediários, e é isso que o bootstrap corrige",
        math: (s) => {
    const linha = (ano: string) => {
      const t = taxaDe(s, "ntnb-tir", `NTN-B ${ano}`);
      const z = taxaDe(s, "ntnb-zero", `NTN-B ${ano}`);
      return `${ano} → ${pct(t)} − ${pct(z)} = ${bpsFmt(bps(t - z))}`;
    };
    return [linha("2027"), linha("2050"), linha("2055")].join("; ");
  },
      },
      {
        etapaId: "etapa-2",
        answer: "demanda estrutural de passivos longos comprime o juro real na ponta",
        rationale: "o efeito aparece igualmente na TIR e na zero, o que descarta artefato de bootstrap",
        math: (s) => {
    const pico = maximo(getCurva(s, "ntnb-tir")!)!;
    const t50 = taxaDe(s, "ntnb-tir", "NTN-B 2050");
    const zPico = taxaDe(s, "ntnb-zero", pico.rotulo);
    const z50 = taxaDe(s, "ntnb-zero", "NTN-B 2050");
    return `queda do pico (${pico.rotulo}) ao vértice de 2050 = ${pct(pico.taxa)} − ${pct(t50)} = ${bpsFmt(bps(pico.taxa! - t50))} de TIR; em taxa zero = ${pct(zPico)} − ${pct(z50)} = ${bpsFmt(bps(zPico - z50))}`;
  },
      },
      {
        etapaId: "etapa-3",
        answer: "concentrar entre 2028 e 2033",
        rationale: "é onde a taxa real é máxima e a duration ainda é moderada",
        math: (s) => {
    const t28 = taxaDe(s, "ntnb-tir", "NTN-B 2028");
    const t50 = taxaDe(s, "ntnb-tir", "NTN-B 2050");
    const v35 = getVertice(s, "ntnb-tir", "NTN-B 2035");
    return `prêmio do miolo sobre a ponta longa = ${pct(t28)} − ${pct(t50)} = ${bpsFmt(bps(t28 - t50))}; NTN-B 2035: duration ${num(v35?.duration)} anos e DV01 ${num(v35?.dv01, 4)} por contrato, lidos do próprio pyield`;
  },
      },
      {
        etapaId: "etapa-4",
        answer: "posição B",
        rationale: "maximiza prêmio real por unidade de DV01; o barbell compra risco de taxa onde o prêmio é menor, e o ladder dilui exatamente o trecho que se quer capturar",
        math: (s) => {
    const v35 = getVertice(s, "ntnb-tir", "NTN-B 2035");
    const v60 = verticesValidos(getCurva(s, "ntnb-tir")!).at(-1);
    const perda = (v35?.dv01 ?? NaN) * 50;
    return `perda aproximada de B para +50 bps ≈ DV01 × 50 = ${num(perda, 2)} por título da 2035; a perna longa de A (${v60?.rotulo}) tem DV01 ${num(v60?.dv01, 4)}, ou ${num((v60?.dv01 ?? NaN) / (v35?.dv01 ?? NaN))}× o risco por título`;
  },
      },
    ],
    glossario: [
      { termo: "TIR real", definicao: "taxa interna de retorno do papel indexado, sobre o principal corrigido; é yield-to-maturity, não taxa zero." },
      { termo: "Taxa zero real", definicao: "taxa de desconto de um fluxo único naquele prazo, extraída por bootstrap dos papéis com cupom." },
      { termo: "VNA", definicao: "valor nominal atualizado da NTN-B pelo IPCA; a base sobre a qual a cotação é aplicada." },
      { termo: "Duration", definicao: "sensibilidade percentual do preço a variação de taxa, em anos." },
      { termo: "DV01", definicao: "variação do PU, em reais, para 1 bp de taxa; a métrica de risco em moeda." },
      { termo: "Bullet", definicao: "carteira concentrada num prazo." },
      { termo: "Barbell", definicao: "carteira nos dois extremos da curva." },
      { termo: "Ladder", definicao: "carteira distribuída uniformemente pelos vencimentos." },
    ],
  },
  pontuacaoMax: 70,
};
