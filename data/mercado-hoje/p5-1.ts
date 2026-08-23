import type { Pauta } from "@/lib/types";
import {
  bps,
  getCurva,
  taxaPorDu,
  verticesValidos,
} from "@/lib/mercado/metricas";
import { bpsFmt, brl, pct } from "@/lib/mercado/template";
import {
  DU_ANO,
  NOCIONAL_PADRAO,
} from "@/lib/mercado/config";

export const p5_1: Pauta = {
  id: "p5-1",
  codigo: "P5.1",
  titulo: "A curva está precificando corte ou alta?",
  nivel: "int",
  duracaoMin: 15,
  familia: "taxas",
  curvaInicial: "pre-zero",
  curvaComparacao: "di1",
  icon: "trending_down",
  contexto: "O comitê de ALCO se reúne em uma hora. A pergunta na mesa é uma só: mantemos o funding curto e barato ou travamos prazo agora? Ninguém tem a ata do próximo Copom, mas todos têm a curva. Abra o painel na curva PRE zero-cupom do dia — o DI futuro entra como curva de comparação — e leia o que o mercado já cobrou. Na referência de 21/08/2026, a Selic meta estava em 14,00% e o DI over em 13,90%; a curva PRE abria em 13,74% nos 28 dias úteis e recuava para 13,51% em 213 dias úteis, voltando a subir para 13,77% em 278 dias úteis.",
  chips: [
    { k: "Selic meta", v: "{{ind.selicMeta}} a.a." },
    { k: "DI over", v: "{{ind.diOver}} a.a." },
    { k: "PRE 28 du", v: "{{pre-zero.28.taxa}}" },
    { k: "PRE 213 du", v: "{{pre-zero.213.taxa}}" },
    { k: "PRE 278 du", v: "{{pre-zero.278.taxa}}" },
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1 — Observação",
      enunciado: "Olhe o desenho da curva no painel, do vértice mais curto ao mais longo. Qual das descrições abaixo é fiel ao que está em tela?",
      opcoes: [
        {
          id: "a",
          texto: "A curva sai de 13,74% no vértice de 28 dias úteis, cai até 13,51% perto de um ano e volta a subir depois disso — não é monotônica, tem uma barriga",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "A curva parte abaixo do DI over de 13,90%, desce até o mínimo em torno de 213 du e retoma a alta a partir dali, desenhando um U",
          leituraCurso: true,
          feedback: "descrever o formato, e não a inclinação ponta-a-ponta, preserva a informação; a leitura \"plana\" é derrubada pelo próprio dado",
        },
        {
          id: "c",
          texto: "A curva é monotonicamente decrescente do primeiro ao último vértice, sinal clássico de ciclo de corte já contratado pelo mercado",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "A curva está essencialmente plana: 3 bps entre a ponta curta e a de 278 du não configuram inclinação relevante alguma",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "as três primeiras leituras descrevem o mesmo desenho com precisão crescente. A quarta usa a inclinação ponta-a-ponta e por isso perde a informação: <b>os 3 bps líquidos escondem uma queda de 23 bps seguida de uma alta de 26 bps</b>. Inclinação agregada é um resumo; formato é a informação.",
      pontos: 15,
      next: "etapa-2",
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2 — Interpretação",
      enunciado: "Você descreveu o formato. Agora atribua causa: o que cada trecho da curva está precificando?",
      opcoes: [
        {
          id: "a",
          texto: "O trecho descendente reflete apenas o carrego: taxas curtas convergem naturalmente para a Selic corrente e nada mais precisa ser lido ali",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "O formato em U mistura duas coisas distintas: expectativa de afrouxamento no horizonte próximo e prêmio de prazo crescente depois disso",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "O trecho descendente precifica cortes no horizonte de até um ano; a retomada adiante é prêmio de prazo, não expectativa de nova alta da Selic",
          leituraCurso: true,
          feedback: "a Selic corrente (14,00%) está acima de todo o trecho curto, o que só se sustenta se o mercado espera que ela caia; a retomada adiante não pode ser nova alta esperada porque conviveria com queda precificada logo antes",
        },
        {
          id: "d",
          texto: "O trecho ascendente ao fim indica que o mercado espera um novo ciclo de aperto começando logo após o afrouxamento inicial precificado",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a distinção entre expectativa e prêmio é o coração do Módulo 2 e reaparece aqui em dado real. A quarta leitura é a armadilha mais comum: <b>curva subindo no longo não é previsão de alta de juros</b> — é remuneração por incerteza, e a Pauta 2 quantifica isso.",
      pontos: 15,
      next: "etapa-3",
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3 — Implicação",
      enunciado: "A leitura está feita. Onde a tesouraria capta, dado esse formato?",
      opcoes: [
        {
          id: "a",
          texto: "Manter todo o funding no overnight, capturando a queda das taxas curtas conforme ela se materializa ao longo dos próximos trimestres",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "b",
          texto: "Travar imediatamente o prazo mais longo disponível, que é onde a curva oferece a maior taxa nominal em todo o espectro observado",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "c",
          texto: "Ignorar o formato e decidir só pelo nível: com Selic a 14%, qualquer prazo captado hoje sai historicamente caro para o balanço",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "d",
          texto: "Captar no trecho da barriga, perto de 213 du: é onde o custo é mínimo e onde já se compra parte do afrouxamento sem pagar prêmio de prazo",
          leituraCurso: true,
          feedback: "é o mínimo da curva; captar mais curto renuncia à trava, captar mais longo compra prêmio de prazo desnecessário para funding",
        },
      ],
      feedback: "a leitura do curso usa o formato para escolher o ponto da curva, não o nível. Overnight puro deixa o banco exposto se a queda não vier; a ponta longa paga prêmio de prazo que a tesouraria não precisa comprar para gerir funding.",
      pontos: 15,
      next: "etapa-4",
    },
    {
      id: "etapa-4",
      titulo: "Etapa 4 — Resolução da pauta",
      enunciado: "Três posições de mesa defensáveis diante da <b>mesma</b> curva. Não há uma certa — há consequências diferentes.",
      opcoes: [
        {
          id: "A",
          texto: "Funding curto — Rolar CDB no overnight",
          leituraCurso: false,
          feedback: "",
        },
        {
          id: "B",
          texto: "Barriga da curva — Captar ~1 ano no mínimo da curva",
          leituraCurso: true,
          feedback: "domina A em cenário de surpresa hawkish e domina C em cenário de realização da curva; é a única que não aposta em um único desfecho",
        },
        {
          id: "C",
          texto: "Ponta longa — Captar 4 anos+",
          leituraCurso: false,
          feedback: "",
        },
      ],
      feedback: "a curva do dia não é uma previsão de Selic — é uma previsão <b>mais</b> um preço de risco. A trilha ótima separa as duas coisas antes de decidir, e usa o <b>ponto de mínimo</b> da curva como o ponto de captação, porque é ali que a expectativa de queda já está comprada e o prêmio de prazo ainda não pesa.",
      pontos: 25,
      next: "",
    },
  ],
  posicoes: [
    {
      id: "A",
      rotulo: "Funding curto",
      decisao: "Rolar CDB no overnight",
      consequencias: [
        { estado: "Consequência se a curva se realizar", efeito: "Custo cai junto com a Selic; ganho de carrego" },
        { estado: "Consequência se o Copom surpreender com aperto", efeito: "Custo sobe imediatamente; margem comprimida no trimestre" },
      ],
      contrafactual: (s) => `custo inicial ≈ DI over ${pct(s.indicadores.diOver)}; sobre ${brl(NOCIONAL_PADRAO)}, cada 100 bps de surpresa altista custam ${brl(NOCIONAL_PADRAO * 0.01 * (213 / DU_ANO))} no mesmo horizonte de 213 du`,
    },
    {
      id: "B",
      rotulo: "Barriga da curva",
      decisao: "Captar ~1 ano no mínimo da curva",
      consequencias: [
        { estado: "Consequência se a curva se realizar", efeito: "Custo travado no ponto mais barato do espectro" },
        { estado: "Consequência se o Copom surpreender com aperto", efeito: "Perda de oportunidade limitada ao prazo travado" },
      ],
      contrafactual: (s) => `custo travado ${pct(taxaPorDu(s, "pre-zero", 213))} por 213 du; economia contra a ponta curta = ${brl(NOCIONAL_PADRAO * (taxaPorDu(s, "pre-zero", 28) - taxaPorDu(s, "pre-zero", 213)) * (213 / DU_ANO))} sobre ${brl(NOCIONAL_PADRAO)}`,
    },
    {
      id: "C",
      rotulo: "Ponta longa",
      decisao: "Captar 4 anos+",
      consequencias: [
        { estado: "Consequência se a curva se realizar", efeito: "Paga prêmio de prazo que não se realiza" },
        { estado: "Consequência se o Copom surpreender com aperto", efeito: "Protegido; o prêmio pago vira seguro barato" },
      ],
      contrafactual: (s) => {
      const longa = verticesValidos(getCurva(s, "pre-zero")!).at(-1)!;
      const extra = longa.taxa! - taxaPorDu(s, "pre-zero", 213);
      return `custo ${pct(longa.taxa)} em ${longa.diasUteis} du, ou seja ${bpsFmt(bps(extra))} acima da barriga, ou ${brl(NOCIONAL_PADRAO * extra * (longa.diasUteis / DU_ANO))} de prêmio de prazo pago sobre ${brl(NOCIONAL_PADRAO)}`;
    },
    },
  ],
  posicaoCurso: "B",
  gabarito: {
    sintese: "a curva do dia não é uma previsão de Selic — é uma previsão <b>mais</b> um preço de risco. A trilha ótima separa as duas coisas antes de decidir, e usa o <b>ponto de mínimo</b> da curva como o ponto de captação, porque é ali que a expectativa de queda já está comprada e o prêmio de prazo ainda não pesa.",
    notas: [
      {
        etapaId: "etapa-1",
        answer: "a curva parte abaixo do DI over, atinge mínimo perto de 213 du e sobe depois",
        rationale: "descrever o formato, e não a inclinação ponta-a-ponta, preserva a informação; a leitura \"plana\" é derrubada pelo próprio dado",
        math: (s) => {
    const a = taxaPorDu(s, "pre-zero", 28);
    const b = taxaPorDu(s, "pre-zero", 213);
    const c = taxaPorDu(s, "pre-zero", 278);
    return `inclinação líquida = ${pct(c)} − ${pct(a)} = ${bpsFmt(bps(c - a))}; queda do trecho curto = ${pct(b)} − ${pct(a)} = ${bpsFmt(bps(b - a))}; alta do trecho seguinte = ${pct(c)} − ${pct(b)} = ${bpsFmt(bps(c - b))}`;
  },
      },
      {
        etapaId: "etapa-2",
        answer: "trecho descendente = expectativa de corte; trecho ascendente = prêmio de prazo",
        rationale: "a Selic corrente (14,00%) está acima de todo o trecho curto, o que só se sustenta se o mercado espera que ela caia; a retomada adiante não pode ser nova alta esperada porque conviveria com queda precificada logo antes",
        math: (s) => {
    const a = taxaPorDu(s, "pre-zero", 28);
    const di = s.indicadores.diOver ?? NaN;
    const selic = s.indicadores.selicMeta ?? NaN;
    return `spread do primeiro vértice contra o DI over = ${pct(a)} − ${pct(di)} = ${bpsFmt(bps(a - di))}; contra a Selic meta = ${pct(a)} − ${pct(selic)} = ${bpsFmt(bps(a - selic))}`;
  },
      },
      {
        etapaId: "etapa-3",
        answer: "captar na barriga, perto de 213 du",
        rationale: "é o mínimo da curva; captar mais curto renuncia à trava, captar mais longo compra prêmio de prazo desnecessário para funding",
        math: (s) => {
    const a = taxaPorDu(s, "pre-zero", 28);
    const b = taxaPorDu(s, "pre-zero", 213);
    const economia = a - b;
    return `economia contra a ponta curta = ${pct(a)} − ${pct(b)} = ${bpsFmt(bps(economia))} a.a.; sobre ${brl(NOCIONAL_PADRAO)} por 213 du ≈ ${brl(NOCIONAL_PADRAO * economia * (213 / DU_ANO))}`;
  },
      },
      {
        etapaId: "etapa-4",
        answer: "posição B",
        rationale: "domina A em cenário de surpresa hawkish e domina C em cenário de realização da curva; é a única que não aposta em um único desfecho",
        math: (s) => {
    const b = taxaPorDu(s, "pre-zero", 213);
    const longa = verticesValidos(getCurva(s, "pre-zero")!).at(-1)!;
    return `custo travado em B = ${pct(b)} a.a. por 213 du; custo de C no vértice de ${longa.diasUteis} du = ${pct(longa.taxa)}, que embute o prêmio de prazo quantificado na Pauta 2; custo de A ≈ média dos forwards do trecho curto`;
  },
      },
    ],
    glossario: [
      { termo: "DI over", definicao: "taxa média das operações compromissadas de um dia entre instituições; referência de custo overnight, e aqui o ponto de partida contra o qual a curva é lida." },
      { termo: "Selic meta", definicao: "taxa definida pelo Copom; teto prático do trecho curto quando há corte precificado." },
      { termo: "Inclinação", definicao: "diferença entre taxa longa e curta, em bps; resume o nível relativo, mas apaga o formato." },
      { termo: "Barriga da curva", definicao: "trecho intermediário onde a taxa atinge mínimo local; ponto de captação de menor custo." },
      { termo: "Prêmio de prazo", definicao: "remuneração exigida por carregar risco de taxa em prazos longos; explica curva ascendente sem expectativa de alta." },
      { termo: "Vértice", definicao: "cada prazo com taxa observada; no DI, cada vencimento de contrato." },
      { termo: "Curva invertida", definicao: "trecho em que a taxa mais longa é menor que a mais curta." },
      { termo: "Flat forward", definicao: "convenção de interpolação que supõe taxa a termo constante entre vértices; padrão da mesa brasileira." },
    ],
  },
  pontuacaoMax: 70,
};
