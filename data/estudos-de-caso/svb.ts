import type { CaseSvb } from "@/lib/types";

export const svb: CaseSvb = {
  id: "svb",
  titulo: "SVB: Autópsia de um Colapso de ALM",
  subtitulo: "Material Extra · Caso Real",
  aviso:
    `Este é um <b>estudo de caso real</b> baseado em fontes primárias (10-K de 2022 do SVBFG, o ` +
    `<em>Review</em> do Federal Reserve de abril/2023, cartas supervisoras, relatório do DFPI e ` +
    `comunicados da FDIC). Os números são factuais e citados do relatório-base. O objetivo é ` +
    `<b>pedagógico</b>: mostrar como os conceitos dos Módulos 1 a 4 explicam, um a um, a mecânica ` +
    `do colapso. Não é aconselhamento de investimento nem julgamento de pessoas — é uma ` +
    `<b>autópsia de processo</b>.`,

  // ── Timeline ──────────────────────────────────────────────────────────────
  timeline: [
    {
      id: "t-crescimento",
      data: "2019–2021",
      evento: `Ativos saltam de ~US$ 71 bi para &gt; US$ 211 bi.`,
      numero: "US$ 71 bi → US$ 211 bi",
      modulos: ["M1"],
      leitura: `O balanço cresceu mais rápido que a governança de risco. "Risco é relativo ao mandato" — e o mandato de risco não acompanhou o tamanho.`,
      tipo: "normal",
    },
    {
      id: "t-100bi",
      data: "jun/2021",
      evento: `Cruza US$ 100 bi em ativos médios → regime regulatório mais exigente (com transição longa).`,
      modulos: [],
      leitura: `Cruzar o limiar de US$ 100 bi ativaria regras mais estritas de capital e liquidez — mas a transição foi longa o suficiente para não gerar pressão imediata.`,
      tipo: "normal",
    },
    {
      id: "t-carta-nov2021",
      data: "nov/2021",
      evento: `Carta supervisória aponta falhas <b>"fundacionais"</b> em testes de estresse de liquidez (ILST), limites e plano de funding contingente (CFP).`,
      modulos: ["M4"],
      leitura: `Liquidez frágil já era conhecida pelo regulador antes do ciclo de alta — o problema estava identificado, mas não corrigido.`,
      tipo: "normal",
    },
    {
      id: "t-duration",
      data: "2021–2022",
      evento: `Carteira de títulos cresce e <b>alonga</b>: duração da carteira fixa 4,0 → 5,7 anos; HTM 4,1 → 6,2 anos.`,
      numero: "HTM: 4,1 → 6,2 anos",
      modulos: ["M4", "M2"],
      leitura: `Ativo alonga entrando no ciclo de alta — combinação de banking book + duration crescente no pior momento.`,
      tipo: "critico",
      cpId: "cp1",
    },
    {
      id: "t-deposit-duration",
      data: "abr/2022",
      evento: `Administração <b>alonga a duração modelada dos depósitos</b> com suporte classificado pelo Fed como "poorly supported".`,
      modulos: ["M4"],
      leitura: `Reduziu o risco medido sem reduzir o risco real. Fracasso clássico de model governance: o modelo passa a servir o balanço politicamente.`,
      tipo: "critico",
      cpId: "cp3",
    },
    {
      id: "t-hedge",
      data: "mar–jul/2022",
      evento: `SVB <b>desmonta US$ 11 bi de hedges</b> AFS para "capturar ganhos" e "reduzir asset sensitivity".`,
      numero: "Cash flow hedges: US$ 5 bi → US$ 0",
      modulos: ["M4"],
      leitura: `Desarmou o amortecedor no pior momento — hedge estrutural vendido como se fosse posição especulativa com lucro a realizar.`,
      tipo: "critico",
      cpId: "cp4",
    },
    {
      id: "t-cro",
      data: "mai/2022",
      evento: `Carta de governança cita três MRIAs; CRO de fato <b>vago</b> (saída em abr/2022; nova CRO só em dez/2022).`,
      modulos: ["M1"],
      leitura: `Oito meses sem Chief Risk Officer efetivo durante o período mais crítico de mudança de juro da última década.`,
      tipo: "normal",
    },
    {
      id: "t-funding",
      data: "2º sem/2022",
      evento: `Depósitos caem; funding migra para remunerados e atacado; short-term borrowings US$ 0,07 bi → US$ 13,6 bi.`,
      numero: "Borrowings: US$ 0,07 bi → US$ 13,6 bi",
      modulos: ["M4"],
      leitura: `Passivo encurta e encarece simultaneamente — o pior cenário para um ativo longo e ilíquido.`,
      tipo: "normal",
    },
    {
      id: "t-eve",
      data: "nov/2022",
      evento: `CAMELS: simulações de risco de juros (IRR) <b>não confiáveis</b>; EVE fora do apetite de risco do board havia anos.`,
      modulos: ["M4"],
      leitura: `A ferramenta central de ALM estava oficialmente desacreditada — o banco operava sem instrumentos de medição confiáveis.`,
      tipo: "critico",
      cpId: "cp2",
    },
    {
      id: "t-perdas",
      data: "31/12/2022",
      evento: `Perdas não realizadas (AFS+HTM) = <b>US$ 17,7 bi</b> &gt; patrimônio de US$ 16,0 bi. CET1 ainda "forte" (12%).`,
      numero: "Perdas: US$ 17,7 bi vs. PL: US$ 16,0 bi",
      modulos: ["M3"],
      leitura: `O capital regulatório parecia sólido, mas a marcação econômica já tornava o banco insolvente — o HTM escondia a realidade.`,
      tipo: "normal",
    },
    {
      id: "t-jan2023",
      data: "jan/2023",
      evento: `SVB comunica "strong capital ratios" e "multiple levers to manage liquidity".`,
      modulos: [],
      leitura: `Comunicação pública contradiz a realidade econômica do balanço — perda de credibilidade que agravará a corrida.`,
      tipo: "normal",
    },
    {
      id: "t-venda",
      data: "08/03/2023",
      evento: `Vende <b>US$ 21 bi de AFS</b>, realiza perda de US$ 1,8 bi após impostos, anuncia captação de US$ 2,25 bi.`,
      numero: "Perda realizada: US$ 1,8 bi",
      modulos: ["M4"],
      leitura: `Os três planos — contábil, econômico e operacional — se encontram em horas. O mercado lê como reconhecimento de insolvência latente.`,
      tipo: "critico",
      cpId: "cp5",
    },
    {
      id: "t-corrida",
      data: "09/03/2023",
      evento: `Saídas &gt; <b>US$ 40 bi</b> em um dia (~25% dos depósitos). Corrida digital.`,
      numero: "US$ 40 bi em 24h",
      modulos: ["M4"],
      leitura: `"O modelo calibrado na calmaria é testado na corrida — e corridas hoje têm aplicativo e acontecem no fim de semana."`,
      tipo: "critico",
    },
    {
      id: "t-fechamento",
      data: "10/03/2023",
      evento: `Expectativa de mais US$ 100 bi em saídas; DFPI fecha o banco; FDIC vira <em>receiver</em>.`,
      modulos: [],
      leitura: `Em menos de 48 horas da venda do AFS, o segundo maior colapso bancário da história dos EUA estava consumado.`,
      tipo: "critico",
    },
    {
      id: "t-fdic",
      data: "12/03/2023",
      evento: `Tesouro, Fed e FDIC protegem todos os depositantes (exceção de risco sistêmico).`,
      modulos: [],
      leitura: `Fim da autópsia: a proteção excepcional confirma que o risco era sistêmico — e que tudo que o curso ensina sobre ALM integrado estava em jogo.`,
      tipo: "normal",
    },
  ],

  // ── Checkpoints ───────────────────────────────────────────────────────────
  checkpoints: [
    {
      id: "cp1",
      titulo: "O ativo longo no banking book",
      modulos: ["M4", "M3", "M2"],
      contexto: `<p>Os depósitos jorram do ecossistema de venture capital — US$ 189 bi, baratos, "pegajosos". Você precisa alocar esse caixa. A diretoria gosta do carrego dos MBS longos, e classificá-los como <b>HTM</b> evita que oscilações de preço batam no resultado. Os juros estão baixíssimos, mas há ruído de inflação no horizonte.</p>`,
      pergunta: "O que você faria?",
      opcoes: [
        {
          id: "A",
          texto: `<b>A.</b> Aloco pesado em MBS longo classificado em HTM — preserva o valor contábil e maximiza o carrego enquanto os depósitos estão estáveis.`,
          leituraCurso: false,
          feedback: `O SVB escolheu exatamente isso: 55% dos ativos em securities (pares: 25%), 78% em HTM (pares: 42%), e <b>alongou</b> a carteira (4,0 → 5,7 anos; HTM 6,2 anos) <em>entrando</em> no ciclo de alta. Em MBS, a alta de juros derruba o pré-pagamento e <b>estende</b> a duration — o ativo ficou mais longo justo quando o funding encurtava.`,
        },
        {
          id: "B",
          texto: `<b>B.</b> Aloco em títulos longos, mas mantenho a maioria em <b>AFS</b> e limito a duração e o % de securities sobre ativos, porque o passivo é <b>comportamental</b> e pode encurtar.`,
          leituraCurso: true,
          feedback: `<b>Por que esta é a leitura do curso (M4):</b> "carregar não é esconder" — o HTM adia o reconhecimento contábil, mas <b>não muda o risco econômico</b>. A perda existia desde sempre; o HTM apenas a tornava invisível. Carregar só funciona <b>se o passivo der tempo</b> — e um passivo comportamental, concentrado e digital, raramente dá. O HTM é o exemplo-mãe de banking book vs. trading book: a pergunta que o SVB não fez foi "e se eu precisar vender antes do vencimento?"`,
        },
        {
          id: "C",
          texto: `<b>C.</b> Fico 100% em caixa/overnight para zerar qualquer risco de marcação.`,
          leituraCurso: false,
          feedback: `Esta opção sacrifica todo o carrego por um medo absoluto — o erro simétrico ao do SVB. Zerar o risco de marcação não é mandato de tesouraria; é paralisar o balanço. O curso ensina a <em>gerir</em> o risco, não a abdicar do ativo.`,
        },
        {
          id: "D",
          texto: `<b>D.</b> Aloco em crédito corporativo flutuante, ignorando o livro de títulos.`,
          leituraCurso: false,
          feedback: `Ignora o problema central: o coração do balanço do SVB era o livro de títulos, não o crédito. Trocar o risco de duration por risco de crédito sem endereçar a concentração de passivo não resolve o ALM — apenas troca um risco por outro.`,
        },
      ],
      svbFez: `O SVB escolheu, na prática, <b>A</b>: 55% dos ativos em securities (pares: 25%), 78% delas em <b>HTM</b> (pares: 42%), e <b>alongou</b> a carteira (duração HTM: 4,1 → 6,2 anos) <em>entrando</em> no ciclo de alta. Em MBS, a alta de juros derruba o pré-pagamento e <b>estende</b> a duration — o ativo ficou mais longo justo quando o funding encurtava.`,
      ponte: `O HTM é o exemplo-mãe de <b>banking book × trading book</b> (M4). A pergunta que o SVB não fez: "e se eu precisar vender antes do vencimento?". A resposta dependia do passivo — e ninguém olhou o passivo. A contabilidade escolheu <em>quando</em> a dor aparecia; o passivo decidiu se havia tempo.`,
    },
    {
      id: "cp2",
      titulo: "EVE fora do RAS do board",
      modulos: ["M4"],
      contexto: `<p>O apetite de risco aprovado pelo conselho mede o risco de juros <b>só por NII</b>, em um cenário relativamente benigno (queda de 100 bps em rampa de 12 meses). A métrica de <b>EVE</b> — o valor econômico do patrimônio — existe nos modelos, mas <b>não está no apetite de risco do board</b>, e vem estourando limites internos há tempos. A narrativa interna é que o banco é "asset sensitive": juros sobem, NII melhora.</p>`,
      pergunta: "O que você faria?",
      opcoes: [
        {
          id: "A",
          texto: `<b>A.</b> Mantenho o foco em NII — se o resultado de intermediação melhora com juros altos, o banco está protegido.`,
          leituraCurso: false,
          feedback: `O SVB estava próximo desta postura: o board tinha apenas NII no apetite de risco; a EVE estourava limites <b>sem chegar ao conselho pleno</b>. ΔEVE (dor no <em>valor</em>) e ΔNII (dor no <em>resultado</em>) divergem — o SVB tinha NII bonito e EVE devastada. Olhar só o NII foi gerir metade.`,
        },
        {
          id: "B",
          texto: `<b>B.</b> Levo a <b>EVE ao board como limite formal</b>, ao lado do NII, e reporto choques <b>não paralelos</b> (steepener/flattener), porque "gerir uma métrica é gerir metade".`,
          leituraCurso: true,
          feedback: `<b>Por que esta é a leitura do curso (M4):</b> ΔEVE e ΔNII <b>divergem</b> — e ambas vinculam. O IRRBB <b>exige</b> EVE <b>e</b> NII, aprovados pelo board, sob choques paralelos <b>e</b> não paralelos. Os cenários regulatórios (paralelo, steepener, flattener, choques curtos) são literalmente o quadro de deformações do Módulo 2 virado norma. O SVB tratou IRR como risco de <em>earnings</em>; era risco de <b>sobrevivência</b>.`,
        },
        {
          id: "C",
          texto: `<b>C.</b> Removo a EVE dos relatórios, já que ela só assusta o board sem mudar o NII.`,
          leituraCurso: false,
          feedback: `Remover a EVE seria o fracasso mais explícito de governança de risco possível — e, ainda assim, foi basicamente o que aconteceu: a EVE existia nos modelos mas não chegava ao board com força de limite. Informação que não chega ao decisor é informação inexistente na prática.`,
        },
        {
          id: "D",
          texto: `<b>D.</b> Troco a EVE por uma métrica de crédito, que parece mais relevante para um banco de tech.`,
          leituraCurso: false,
          feedback: `Trocar EVE por métrica de crédito ignora que o risco dominante era de <em>taxa de juros</em>, não de crédito. O SVB tinha CET1 de 12% (acima dos pares em crédito) — o buraco estava no risco de mercado do banking book, que só a EVE captura adequadamente.`,
        },
      ],
      svbFez: `Próximo de <b>A/C</b>: o board só tinha NII no apetite de risco; a EVE estourava limites <b>sem chegar ao conselho pleno</b>. A política de IRR não especificava cenários, backtesting nem calibração de limites, e modelava basicamente <b>choques paralelos</b>. Em nov/2022 o próprio CAMELS declarou as simulações de IRR <b>não confiáveis</b> — a ferramenta central de ALM estava oficialmente desacreditada.`,
      ponte: `Aqui o curso e o regulador dizem a mesma coisa: o IRRBB <b>exige</b> EVE <b>e</b> NII, aprovados pelo board, sob choques paralelos <b>e</b> não paralelos. O SVB tratou IRR como risco de <em>earnings</em>; era risco de <b>sobrevivência</b>. Os cenários de deformação da curva do Módulo 2 são literalmente a linguagem normativa do IRRBB.`,
    },
    {
      id: "cp3",
      titulo: "A premissa de depósito conveniente",
      modulos: ["M4"],
      contexto: `<p>O modelo de IRR mostra um descasamento de duração desconfortável: o ativo é longo, e se os depósitos forem tratados como curtos, o gap "medido" fica feio. Um estudo de consultoria sugere que o <b>núcleo</b> de depósitos é mais estável do que se assumia — o que permitiria <b>alongar a duração modelada</b> do passivo e, no modelo, encolher o gap. Os juros estão subindo e a base é 94% não segurada, concentrada em tech/VC.</p>`,
      pergunta: "O que você faria?",
      opcoes: [
        {
          id: "A",
          texto: `<b>A.</b> Adoto a duração mais longa do estudo — reduz o gap medido e tranquiliza o board.`,
          leituraCurso: false,
          feedback: `O SVB escolheu exatamente isso: alongou a duração modelada dos depósitos com suporte classificado pelo Fed como "poorly supported" — diante do crescimento recente dos depósitos, da falta de histórico, da alta de juros e da singularidade da base. <b>Reduziu o risco medido sem reduzir o risco real.</b> É o fracasso clássico de model governance.`,
        },
        {
          id: "B",
          texto: `<b>B.</b> <b>Rejeito o alongamento:</b> a alta de juros tende a <b>encurtar</b> a duração do depósito, a base é nova e correlacionada, e mudar a premissa não tira risco do balanço — só do relatório.`,
          leituraCurso: true,
          feedback: `<b>Por que esta é a leitura do curso (M4):</b> a duration de um depósito é um <b>modelo — opinião</b>, não um fato. Os dois erros simétricos: tratar como overnight (imuniza demais, sacrifica NII) e como funding eterno (o erro do SVB). A premissa que separa núcleo de excedente é "a mais importante e menos verificável de todo o ALM" — por isso o regulador impõe <b>tetos de prazo</b> ao núcleo. "Durationar depósito é opinar" (eco de "interpolar é opinar" do M2).`,
        },
        {
          id: "C",
          texto: `<b>C.</b> Trato todos os depósitos como overnight para ser "conservador".`,
          leituraCurso: false,
          feedback: `O erro simétrico ao do SVB: tratar tudo como overnight ignora a estabilidade real de parte dos depósitos e força imunização excessiva, sacrificando NII. O curso ensina a distinguir núcleo de excedente com <em>suporte empírico</em> — não a colapsar os dois extremos.`,
        },
        {
          id: "D",
          texto: `<b>D.</b> Mantenho a premissa antiga sem revalidar, já que "sempre funcionou".`,
          leituraCurso: false,
          feedback: `"Sempre funcionou" é a frase mais perigosa em modelagem de ALM. A premissa foi calibrada num ambiente de juro baixo e crescimento de depósitos — ambos terminando. Revalidação frequente sob novos cenários é requisito explícito do curso e do regulador.`,
        },
      ],
      svbFez: `Escolheu <b>A</b>: alongou a duração modelada dos depósitos com suporte que o Fed classificou como "poorly supported" — diante do crescimento recente dos depósitos, da falta de histórico, da alta de juros e da singularidade da base. <b>Reduziu o risco medido sem reduzir o risco real.</b> É o fracasso clássico de <em>model governance</em>: o modelo deixa de explicar o balanço e passa a servi-lo politicamente.`,
      ponte: `"O modelo calibrado na calmaria é testado na corrida — e corridas hoje têm aplicativo e acontecem no fim de semana." O SVB calibrou na euforia do VC; foi testado em 48 horas digitais. A duration comportamental é <b>opinião com consequências reais</b> — e quando a opinião estava errada, o passivo não deu tempo de corrigir.`,
    },
    {
      id: "cp4",
      titulo: "Desmontar o hedge na alta",
      modulos: ["M4", "M2"],
      contexto: `<p>Você tem US$ 11 bi de <em>receive-floating</em> hedges sobre a carteira AFS, montados em 2021. Com os juros subindo, esses hedges acumularam <b>ganho</b>: dá para monetizá-los agora e melhorar o resultado do trimestre. A mensagem que a diretoria quer passar ao mercado é de "asset sensitivity" — banco que ganha com juros altos.</p>`,
      pergunta: "O que você faria?",
      opcoes: [
        {
          id: "A",
          texto: `<b>A.</b> Monetizo os hedges e capturo o ganho — reduz <em>asset sensitivity</em> e melhora o NII reportado agora.`,
          leituraCurso: false,
          feedback: `O SVB fez exatamente isso: monetizou US$ 5 bi no 1T22 (ganho de US$ 204 mi) e os US$ 6 bi restantes em julho (US$ 313 mi). No fim de 2022, os cash flow hedges haviam ido a <b>zero</b> e os fair value hedges caíram de US$ 10,7 bi para US$ 0,55 bi. Decisão boa no resultado de curto prazo; catastrófica no risco estrutural.`,
        },
        {
          id: "B",
          texto: `<b>B.</b> <b>Mantenho (ou reforço) o hedge estrutural</b>, com governança independente do P&amp;L de curto prazo — a proteção existe para o cenário ruim, não para ser vendida quando "está dando lucro".`,
          leituraCurso: true,
          feedback: `<b>Por que esta é a leitura do curso (M4):</b> "convexidade é seguro pago em carrego" — e seguro existe para o choque que você <b>não pode atravessar</b>. Vender a proteção porque ela "está dando lucro" na alta inverte a lógica: troca robustez por <b>lucro contábil de curto prazo</b>. O curso é explícito: hedge estrutural precisa de <b>governança independente do P&amp;L de curto prazo</b>, justamente para impedir o desmonte oportunista.`,
        },
        {
          id: "C",
          texto: `<b>C.</b> Desmonto os hedges e não reponho nada, apostando que os juros vão cair logo.`,
          leituraCurso: false,
          feedback: `Desmonte sem reposição transforma o ALM em especulação direcional. Apostar na queda de juros enquanto o Fed sinaliza alta acelerada é uma decisão de <em>trading</em> disfarçada de gestão de balanço. O Fed resumiu: o banco <b>protegeu cenários de queda</b> e <b>removeu proteção contra a alta</b>.`,
        },
        {
          id: "D",
          texto: `<b>D.</b> Troco os hedges de juros por hedge cambial, que não endereça o risco do balanço.`,
          leituraCurso: false,
          feedback: `O risco dominante era de <em>taxa de juros</em> no banking book, não cambial. Substituir o hedge errado é pior do que não substituir: dá falsa sensação de proteção enquanto deixa o risco real descoberto.`,
        },
      ],
      svbFez: `Escolheu <b>A/C</b>: monetizou US$ 5 bi no 1T22 (ganho de US$ 204 mi) e os US$ 6 bi restantes em julho (US$ 313 mi). No fim de 2022, os <em>cash flow hedges</em> haviam ido a <b>zero</b> e os <em>fair value hedges</em> caíram de US$ 10,7 bi para US$ 0,55 bi. O Fed resumiu: o banco <b>protegeu cenários de queda</b> de juros e <b>removeu proteção contra a alta</b> — desarmou o amortecedor no pior momento.`,
      ponte: `Decisão × resultado, ao contrário: o SVB foi <b>premiado no resultado</b> (ganho realizado) por uma decisão <b>ruim no processo</b> (ficar desprotegido na alta). O curso ensina a julgar o <em>processo</em> — o mercado, nove meses depois, cobrou o <em>resultado</em>.`,
    },
    {
      id: "cp5",
      titulo: "Quando os três planos se encontram",
      modulos: ["M4", "M3", "M1"],
      contexto: `<p>Os depósitos sangram. Você precisa de caixa. A única carteira que pode vender sem "quebrar" a classificação é a <b>AFS</b> (US$ 26 bi) — mas vendê-la <b>realiza</b> a perda que estava latente. Vender também sinaliza ao mercado que há um buraco. O capital regulatório ainda diz "forte" (CET1 12%), mas as perdas não realizadas (US$ 17,7 bi) já superam o patrimônio (US$ 16,0 bi).</p>`,
      pergunta: "O que você faria?",
      opcoes: [
        {
          id: "A",
          texto: `<b>A.</b> Vendo US$ 21 bi de AFS de uma vez, realizo a perda e anuncio captação de capital — resolve a liquidez imediata.`,
          leituraCurso: false,
          feedback: `O SVB fez isso em 08/03. O mercado leu como reconhecimento de insolvência latente. Em 09/03 saíram <b>&gt; US$ 40 bi</b> (~25% dos depósitos); em 10/03 o banco foi fechado. Não havia mais boa escolha em março — qualquer movimento brusco virava <em>sinal público de insolvência</em> numa base concentrada e digital.`,
        },
        {
          id: "B",
          texto: `<b>B.</b> Reconheço que o erro foi <b>meses antes</b>: o ajuste deveria ter sido <b>gradual e cedo</b> — em março, qualquer movimento brusco vira <b>sinal público de insolvência</b> numa base concentrada e digital.`,
          leituraCurso: true,
          feedback: `<b>Por que esta é a leitura do curso (M4):</b> "a contabilidade escolhe <em>quando</em> a dor aparece; o passivo decide <em>se há tempo</em>" — e o passivo do SVB <b>não dava tempo</b>. Não havia mais boa escolha em março. A lição é que a janela de ação estava <b>lá atrás</b>, nos CP1–CP4. Aqui só restava administrar o estrago.`,
        },
        {
          id: "C",
          texto: `<b>C.</b> Não faço nada e espero os depósitos voltarem.`,
          leituraCurso: false,
          feedback: `Inação com saída de depósitos é colapso diferido. Com 94% não segurados e comunicação em rede, a velocidade de saída era incompatível com qualquer estratégia passiva. "Corridas hoje têm aplicativo e acontecem no fim de semana" — e a janela de inação é de horas, não de dias.`,
        },
        {
          id: "D",
          texto: `<b>D.</b> Vendo o HTM, que é maior — assim levanto mais caixa de uma vez.`,
          leituraCurso: false,
          feedback: `Vender HTM forçaria remarcar <b>toda</b> a carteira HTM (US$ 91 bi) a mercado, revelando os US$ 15 bi de perdas não realizadas de uma vez. Seria pior do que vender AFS: confirmaria publicamente a insolvência econômica que o HTM havia escondido até ali.`,
        },
      ],
      svbFez: `Escolheu <b>A</b>: em 08/03 vendeu US$ 21 bi de AFS, realizou perda de US$ 1,8 bi após impostos e anunciou captação de US$ 2,25 bi. O mercado leu como reconhecimento de insolvência latente. Em 09/03 saíram <b>&gt; US$ 40 bi</b> (~25% dos depósitos); em 10/03 o banco foi fechado. Os <b>três planos</b> — contábil (capital "forte"), econômico (perdas &gt; patrimônio) e operacional (liquidez) — <b>se encontraram em horas</b>.`,
      ponte: `Fechamento: <b>ALM é um sistema</b>. Nenhuma falha isolada (CP1–CP4) teria sido fatal. Foi a soma — ativo longo + EVE ignorada + premissa conveniente + hedge desarmado + funding concentrado — convergindo no pior momento. O curso inteiro existe para que essas peças sejam geridas <b>juntas</b>.`,
    },
  ],

  // ── Quadro-espelho ────────────────────────────────────────────────────────
  espelho: [
    {
      dimensao: "Mismatch de duration",
      svbFez: "Alongou a carteira fixa, sobretudo em HTM (6,2 anos)",
      cursoEnsina: "Casar duration ativo×passivo; vigiar o gap; convexidade descasada é rachadura",
      modulos: ["M4"],
    },
    {
      dimensao: "Métricas de IRR",
      svbFez: "Só NII no RAS do board; choques paralelos; EVE de fora",
      cursoEnsina: "EVE e NII, board, choques paralelos e não paralelos",
      modulos: ["M4"],
    },
    {
      dimensao: "Premissa de depósitos",
      svbFez: "Alongou a duração modelada sem suporte",
      cursoEnsina: "Duration comportamental é modelo; revalidar; tetos ao núcleo",
      modulos: ["M4"],
    },
    {
      dimensao: "Hedge",
      svbFez: "Desmontou a proteção para capturar ganho de curto prazo",
      cursoEnsina: "Hedge estrutural contínuo; governança independente do P&L",
      modulos: ["M4"],
    },
    {
      dimensao: "Banking book / HTM",
      svbFez: "78% em HTM; perdas fora do capital até a venda forçada",
      cursoEnsina: "Carregar não é esconder; só funciona se o passivo der tempo",
      modulos: ["M4", "M3"],
    },
    {
      dimensao: "Funding",
      svbFez: "94% não segurado, concentrado em VC/tech",
      cursoEnsina: "Risco é relativo ao mandato; estabilidade do passivo é parâmetro de risco",
      modulos: ["M1"],
    },
    {
      dimensao: "Capital",
      svbFez: "CET1 'forte' mascarava perdas econômicas",
      cursoEnsina: "Overlay de capital econômico mark-to-market",
      modulos: ["M3"],
    },
  ],

  // ── Pontos de reflexão ────────────────────────────────────────────────────
  reflexao: [
    {
      pergunta:
        `No seu banco, a EVE chega ao comitê com a mesma força que o NII? Se a curva brasileira empinar (bear steepening do M2), qual das duas métricas “aperta” primeiro?`,
      modulos: ["M4", "M2"],
      leituraCurso: `Em carteiras com ativos longos (NTN-B, LTN, debêntures), um bear steepening costuma pressionar a <b>EVE</b> antes do NII — porque o NII captura o fluxo dos próximos 12 meses (onde os ativos pós-fixados ajudam), enquanto a EVE desconta todo o estoque pelo valor presente. A pergunta relevante: o seu RAS tem <b>limites formais de EVE</b> aprovados pelo board, ou a EVE é só relatório?`,
    },
    {
      pergunta:
        "Qual é a duration comportamental que a sua instituição assume para os depósitos à vista? Quem é o dono dessa premissa, e quando ela foi revalidada pela última vez?",
      modulos: ["M4"],
      leituraCurso: `A premissa de duration de depósito é a mais importante e menos verificável de todo o ALM. O regulador brasileiro (Res. CMN 4.557) e o Basileia III IRRBB impõem <b>tetos ao núcleo de depósitos</b> (geralmente 5 anos). O risco do SVB foi exatamente calibrar na euforia e não revalidar no ciclo adverso. Boa prática: dono único da premissa (ALM/Risco, não a área comercial), backtesting trimestral e revisão formal a cada ciclo de política monetária.`,
    },
    {
      pergunta:
        "Há quanto do seu balanço está em banking book por decisão de risco — e quanto por conveniência contábil? O seu passivo daria tempo de carregar até o vencimento?",
      modulos: ["M4", "M3"],
      leituraCurso: `"Carregar não é esconder" (M4). A distinção relevante não é contábil (HTM/AFS) mas <em>econômica</em>: você teria capacidade de absorver a perda realizada se precisasse vender? O teste prático: se o seu principal grupo de funding saísse 30% em 72h (como no SVB), quais ativos você venderia, a que preço e com que impacto no capital? O banking book só faz sentido quando o passivo <b>garante o tempo de carregamento</b>.`,
    },
    {
      pergunta:
        "Pensando no contexto brasileiro: a LFT e a marcação a mercado de 2002 são o espelho doméstico do HTM do SVB? Onde mora hoje, no seu balanço, uma perda que a contabilidade está 'adiando'?",
      modulos: ["M4", "M3", "M1"],
      leituraCurso: `A marcação a mercado dos fundos de 2002 foi exatamente a revelação de que o "carrego em accrual" escondia perdas econômicas reais — o mesmo mecanismo do HTM do SVB. No Brasil hoje, as perdas "adiadas" mais comuns estão em: (a) <b>NTN-B longas em banking book</b> carregadas em accrual; (b) <b>crédito repactuado</b> sem reclassificação de risco; (c) <b>derivativos de hedge</b> com efetividade não testada. A LFT — indexada à Selic overnight — foi historicamente a defesa brasileira contra o risco de duration; bancos com menos LFT no passivo estão mais expostos ao descasamento que derrubou o SVB.`,
    },
  ],
};
