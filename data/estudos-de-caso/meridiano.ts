import type { CaseNarrativo } from "@/lib/types";

export const meridiano: CaseNarrativo = {
  id: "meridiano",
  titulo: "Banco Meridiano — A semana do ALCO",
  subtitulo: "Caso-síntese · Operações de Tesouraria em Instituições Financeiras",
  chips: [
    "Banco médio brasileiro",
    "Carteira: R$ 400 mi",
    "Captação futura: R$ 200 mi em 6 meses",
    "Passivo: majoritariamente pós/CDI",
    "Horizonte: reunião do ALCO na sexta",
    "Cenário: choque fiscal + dúvida sobre corte do COPOM",
  ],
  dados: {
    curva: { "126": 14.9, "252": 14.4, "504": 13.8, "1008": 13.6 },
    forwards: { f126x252: 13.9, "1y1y": 13.2 },
    balanco: { dv01_juros: 26700, dv01_spread_liq: 64000, gap12m: -140 },
  },
  checkpoints: [
    // ── CP0 ────────────────────────────────────────────────────────────────
    {
      id: "cp0",
      titulo: "Briefing — o mandato da mesa",
      modulos: ["M1", "M4"],
      cena: `<p>O <b>Banco Meridiano</b> é um banco médio brasileiro, de varejo e middle-market. Você acaba de assumir a <b>mesa de tesouraria</b>. É <b>segunda-feira de manhã</b>; daqui a duas semanas o COPOM se reúne, e o ALCO marcou para sexta uma reunião em que cobrará da sua mesa um <b>parecer único</b> sobre como posicionar o balanço para o ciclo que vem.</p>
<p>Três fatos definem o seu problema:</p>
<ul>
  <li>O banco <b>vai captar R$ 200 milhões daqui a 6 meses</b>, por prazo de 1 ano, para casar com uma carteira de crédito já contratada.</li>
  <li>A tesouraria <b>carrega hoje</b> uma carteira de R$ 400 milhões (mix de pré e pós) e um <b>passivo de depósitos</b> majoritariamente à vista/CDI.</li>
  <li>O <b>quadro fiscal piorou</b> na semana passada; a curva longa abriu, e o mercado discute se o COPOM ainda corta neste ciclo.</li>
</ul>
<p>A CRO abre a semana: <em>"Antes de você olhar um único número de tela, quero que você me diga uma coisa: <b>para quem essa mesa trabalha?</b> O que define se uma decisão nossa foi boa não é o que o CDI fez depois — é se ela protegeu o nosso passivo. Então: qual é o nosso mandato?"</em></p>`,
      pergunta:
        "Qual frase descreve melhor o mandato da tesouraria do Meridiano, dado o balanço que você herdou?",
      opcoes: [
        {
          id: "A",
          texto: `Maximizar o retorno da carteira de títulos, buscando os papéis de maior taxa de tela.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `Nenhum papel é bom em abstrato. A pergunta certa não é "qual título paga mais?" — é "qual posição casa com o meu passivo?". O analista júnior defende essa visão; a CRO rebate: "taxa de tela não paga depósito à vista". O mandato é relativo ao passivo, não ao ativo em isolamento.`,
        },
        {
          id: "B",
          texto: `Proteger o resultado e o valor do balanço, casando os riscos da carteira com um passivo majoritariamente pós-fixado e de curto prazo.`,
          rotulo: "forte",
          esperada: true,
          feedback: `Exato. Você ancorou no princípio central do M1: <b>risco é relativo ao mandato</b>. Como o passivo é pós/curto, o NII (resultado dos próximos 12 meses) é a métrica que mais vincula — não o EVE absoluto. Guarde esse norte: ele vai aparecer cobrado no CP7, quando a CRO pedir "pelo que você quer ser julgado?".`,
        },
        {
          id: "C",
          texto: `Eliminar todo o risco de mercado, migrando 100% da carteira para LFT.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `"Zerar risco" é ilusão: a LFT troca risco de juro por risco de <b>spread</b> (deságio de mercado) e risco de <b>liquidez</b>. Não existe posição sem risco — há posições cujo risco casa com o passivo e posições cujo risco não casa. Isso reaparece no CP4 (M3) e no CP6 (M4).`,
        },
        {
          id: "D",
          texto: `Travar o maior carrego possível agora, independentemente do formato do passivo.`,
          rotulo: "armadilha",
          esperada: false,
          feedback: `Essa é a armadilha clássica: carrego sem mandato é aposta. Uma posição pré longa gera carrego alto — mas se o passivo é pós/curto e os juros caem, o carrego compensa as perdas de MtM? A resposta depende da métrica e do horizonte. O curso combate exatamente isso: <b>decisão ≠ resultado</b>.`,
        },
      ],
    },

    // ── CP1 ────────────────────────────────────────────────────────────────
    {
      id: "cp1",
      titulo: "Ler o cenário macro",
      modulos: ["M1"],
      cena: `<p>Na tela: Selic meta em <b>14,75%</b>, comunicado do último COPOM com tom <b>duro</b>, e a curva DI do dia — <b>invertida</b> (14,90% no curto, caindo a 13,60% no longo). O Focus projeta Selic a <b>12,75%</b> em 12 meses.</p>
<p>O analista júnior: <em>"A curva tá caindo, então é só esperar — o juro vai despencar, não precisa fazer nada."</em></p>`,
      pergunta: "Como você lê o formato da curva e a divisão de trabalho entre as pontas?",
      opcoes: [
        {
          id: "A",
          texto: `A ponta curta é ancorada pelo COPOM; a inversão adiante mostra que o mercado precifica cortes — mas a ponta longa carrega prêmio (de prazo e fiscal), então "a curva cair" é parte expectativa, parte prêmio.`,
          rotulo: "forte",
          esperada: true,
          feedback: `Correto. Você separou os dois motores da curva: ponta curta segue o COPOM (expectativa de curto prazo), ponta longa embutiu prêmio de prazo e risco fiscal. A fala do júnior confunde os dois: "a curva caiu" pode ser só compressão de prêmio, não corte de Selic. Esse diagnóstico é o insumo do CP2 — separar prêmio de expectativa.`,
        },
        {
          id: "B",
          texto: `A curva inteira é controlada pelo Banco Central, que decidiu derrubar todas as taxas.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `O BCB controla diretamente apenas o juro de <b>1 dia</b> (Selic-over, via operações overnight). O restante da curva é formado pelo mercado — expectativas, fluxo, prêmio de prazo e risco fiscal. Uma inversão reflete o que o mercado precifica, não uma decisão do BC sobre toda a curva.`,
        },
        {
          id: "C",
          texto: `A inversão é erro de marcação; curvas normais são sempre ascendentes.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `Curva invertida é <b>informação</b>, não erro. Ela sinaliza que o mercado precifica queda de juros mais adiante do que o nível atual — o custo do dinheiro hoje é alto, mas cai à frente. Nos EUA de 2006–2007 a curva se inverteu antes da recessão; no Brasil, curvas invertidas precederam ciclos de corte. Leia como sinal, não como anomalia.`,
        },
        {
          id: "D",
          texto: `A curva prevê com exatidão a Selic futura; basta ler o nível das taxas longas.`,
          rotulo: "armadilha",
          esperada: false,
          feedback: `Essa é a armadilha que o M2 nomeia: <b>forward não é previsão</b>. A taxa longa embute expectativa <em>e</em> prêmio. O prêmio pode subir ou cair por razões fiscais, de fluxo ou de liquidez, sem que o cenário de Selic mude. Ler taxa longa como previsão é exatamente o erro que o CP2 vai desconstruir.`,
        },
      ],
    },

    // ── CP2 ────────────────────────────────────────────────────────────────
    {
      id: "cp2",
      titulo: "A curva fala do futuro",
      modulos: ["M2"],
      cena: `<p>A CRO quer saber quanto da curva longa é "opinião" e quanto é "pedágio". O app exibe a <b>1y1y já calculada (13,20%)</b> e o <b>CDI médio do ano 2 implícito no Focus (≈ 12,55%)</b>.</p>
<p><em>"Me diz: se o Focus não mudou e a 1y1y subiu 40 bps essa semana, o que aconteceu?"</em></p>`,
      calculo_guiado: {
        label: "Prêmio embutido na curva de médio prazo",
        corpo: `<p>Prêmio ≈ 1y1y − CDI(ano 2, Focus)</p>
<p style="font-variant-numeric: tabular-nums; font-size: 1.05em; font-weight: bold;">13,20% − 12,55% ≈ <b>65 bps</b></p>
<p style="font-size: 0.88em; color: #555;">Se a 1y1y sobe para 13,60% com o Focus parado → prêmio abre para ~105 bps. O cenário de Selic não mudou — o que mudou foi o apetite do mercado pelo risco fiscal.</p>`,
      },
      pergunta: "Se a 1y1y subiu para 13,60% com o Focus parado, o que aconteceu?",
      opcoes: [
        {
          id: "A",
          texto: `O prêmio abriu (~40 bps) com o Focus parado → é deterioração fiscal precificada como prêmio, não revisão do cenário de Selic.`,
          rotulo: "forte",
          esperada: true,
          feedback: `Exato. O Focus parado é a pista decisiva: se fosse revisão de expectativa de Selic, o Focus teria andado junto. Como não andou, a alta da 1y1y é <b>prêmio fiscal</b>. Isso importa no CP6: esse mesmo prêmio é o que empina a parte longa da curva e deteriora o EVE dos prefixados.`,
        },
        {
          id: "B",
          texto: `O mercado passou a esperar Selic mais alta; é revisão pura de expectativa.`,
          rotulo: "parcial",
          esperada: false,
          feedback: `Você reconheceu que algo mudou — certo. Mas confundiu prêmio com expectativa. A pista que separa os dois é o <b>Focus parado</b>: revisão de expectativa move o Focus; abertura de prêmio move a curva sem mover o Focus. A diferença entre 1y1y e CDI implícito no Focus é a régua do prêmio (M2).`,
        },
        {
          id: "C",
          texto: `Não há informação nova; 1y1y e Focus medem a mesma coisa.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `1y1y e Focus medem coisas diferentes: o Focus é a <em>expectativa mediana do mercado</em> para a Selic pontual no futuro; a 1y1y é a <em>taxa de equilíbrio</em> derivada da curva, que inclui expectativa <b>mais</b> prêmio de prazo e risco. A diferença entre eles é exatamente o prêmio — e é nela que mora a informação.`,
        },
        {
          id: "D",
          texto: `O Focus está certo e a curva, errada; a diferença vai sumir amanhã.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `Nem a curva nem o Focus estão "certos" ou "errados" — eles medem coisas diferentes. O Focus tem defasagem (é pesquisa semanal); a curva precifica instantaneamente. Em choques fiscais é comum a curva abrir prêmio vários dias antes do Focus se mover. Tratar a diferença como "ruído" é ignorar o sinal.`,
        },
      ],
    },

    // ── CP3 ────────────────────────────────────────────────────────────────
    {
      id: "cp3",
      titulo: "Travar a captação",
      modulos: ["M2"],
      cena: `<p>Volta o problema da captação: <b>R$ 200 mi em 6 meses, por 1 ano</b> (entra no mês 6, sai no mês 18). O risco de taxa já existe, embora o dinheiro ainda não. O app mostra a <b>forward do trecho 126×252 ≈ 13,90%</b> como a taxa contratável hoje para esse trecho futuro.</p>
<p>A CRO: <em>"Temos um passivo futuro que já é risco hoje. O que você propõe?"</em></p>`,
      pergunta: "O que você faz, e como lê os 13,90%?",
      opcoes: [
        {
          id: "A",
          texto: `Monto um FRA de DI sintético (compro taxa no vértice longo, vendo no curto, calibro pelos PUs) para travar o trecho a ~13,90%, ciente de que a forward é opinião + prêmio, não previsão — pago o prêmio porque há um passivo a proteger.`,
          rotulo: "forte",
          esperada: true,
          feedback: `Exato. Você montou o instrumento certo <b>e</b> leu a forward como ela é: opinião com prêmio, não previsão. Pagar o prêmio é racional porque há um passivo a proteger. Guarde isto — daqui a pouco essa trava vira uma posição viva, com DV01 próprio, marcada todo dia.`,
          continua: "A CRO autoriza a trava. A narrativa segue com a trava montada.",
        },
        {
          id: "B",
          texto: `Espero, porque a forward indica que o juro vai cair e vou captar mais barato depois.`,
          rotulo: "armadilha",
          esperada: false,
          feedback: `Essa é a armadilha número um da mesa: ler a forward como previsão. A pergunta certa não é "a forward vai se confirmar?", e sim "<b>o prêmio embutido compensa o risco do meu passivo?</b>". O ALCO vai travar mesmo assim — e o caso vai te mostrar por quê.`,
          continua: "O ALCO decidiu travar mesmo assim. A narrativa segue com a trava montada.",
        },
        {
          id: "C",
          texto: `Compro uma LTN de 18 meses para travar — é a mesma coisa que o FRA.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `A LTN de 18 meses tem outro perfil de fluxo e outro DV01: ela expõe todo o trecho 0–18m, não só o trecho 6–18m que você quer travar. O FRA sintético (comprar o 18m, vender o 6m) isola exatamente o trecho futuro. Instrumentos parecidos podem ter riscos bem diferentes.`,
          continua: "O ALCO montou o FRA mesmo assim. A narrativa segue com a trava montada.",
        },
        {
          id: "D",
          texto: `Não faço nada; captação futura não tem risco até existir.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `O risco de taxa existe <em>antes</em> do desembolso — esse é o coração do caso condutor do M2. Se a taxa sobe 200 bps entre hoje e o dia da captação, o custo do funding aumenta R$ 4 mi/ano mesmo que o dinheiro ainda não tenha entrado. Compromisso futuro = risco presente.`,
          continua: "O ALCO decidiu travar mesmo assim. A narrativa segue com a trava montada.",
        },
      ],
    },

    // ── CP4 ────────────────────────────────────────────────────────────────
    {
      id: "cp4",
      titulo: "Apreçar e medir a dor",
      modulos: ["M3"],
      cena: `<p>A CRO: <em>"Quero o risco da carteira em <b>reais</b>, não em duration. Se a curva subir 50 bps amanhã, quanto perdemos nos prefixados?"</em></p>
<p>O app traz os DV01 prontos: LTN R$ 9,2 mil/bp; NTN-F R$ 17,5 mil/bp.</p>`,
      calculo_guiado: {
        label: "DV01 de juros (pré) e choque de +50 bps",
        corpo: `<p>DV01 de juros (pré) = 9.200 + 17.500 = <b>R$ 26.700/bp</b></p>
<p>Choque +50 bps → <span style="font-variant-numeric: tabular-nums;">50 × R$ 26.700 ≈ <b>−R$ 1,34 mi</b></span></p>
<p style="font-size: 0.88em; color: #555;">Nota: esse cálculo vale para choques pequenos (medida local). Para choques grandes, a convexidade da carteira suaviza a perda real.</p>`,
      },
      pergunta:
        "O júnior quer reportar exatamente −R$ 1,34 mi para um choque de +200 bps, multiplicando por 200. O que você corrige?",
      opcoes: [
        {
          id: "A",
          texto: `O DV01 é uma reta tangente (medida local de 1 bp). Para +200 bps, a convexidade faz a perda real ser um pouco menor numa alta — reportar a reta superestima a dor; em estresse, reapreço o título à nova curva.`,
          rotulo: "forte",
          esperada: true,
          feedback: `Exato. Quem está comprado em título prefixado tem <b>convexidade positiva</b>: para choques grandes de alta, a perda real é menor do que a reta do DV01 sugere. O correto em estresse é reapreçar os títulos à nova curva, não multiplicar o DV01. Isso evita tanto subestimar quanto superestimar a perda.`,
        },
        {
          id: "B",
          texto: `Nada a corrigir; basta multiplicar o DV01 pelo número de bps em qualquer tamanho de choque.`,
          rotulo: "armadilha",
          esperada: false,
          feedback: `Essa é uma das armadilhas nomeadas do M3: <b>linearizar o DV01 em choques grandes</b>. O DV01 é uma aproximação de primeira ordem válida para variações pequenas (~1 bp). Para 200 bps, a curvatura da relação preço-taxa (convexidade) passa a importar muito — e a perda real é <em>menor</em> do que 200×DV01 para quem está comprado.`,
        },
        {
          id: "C",
          texto: `A perda real seria maior, porque a convexidade penaliza quem está comprado.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `O sinal está invertido. A convexidade <em>beneficia</em> quem está comprado em título prefixado: para uma alta grande de taxas, a perda é menor do que a reta do DV01; para uma queda grande, o ganho é maior. Penalizado pela convexidade está quem está <em>vendido</em> (ex.: emissor de opções de taxa).`,
        },
        {
          id: "D",
          texto: `O DV01 some em choques grandes; só vale a duration de Macaulay.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `O DV01 não "some" — ele continua sendo a medida local correta para variações de 1 bp. A duration de Macaulay é um conceito relacionado mas não idêntico (mede o prazo médio ponderado, não a sensibilidade direta a bps). Para choques grandes, o certo é somar DV01 com a correção de segunda ordem (convexidade), não substituir por Macaulay.`,
        },
      ],
    },

    // ── CP5 ────────────────────────────────────────────────────────────────
    {
      id: "cp5",
      titulo: "O segundo preço e a captação",
      modulos: ["M3"],
      cena: `<p>A área comercial trouxe duas formas de captar os R$ 200 mi quando a hora chegar: um <b>CDB a 110% do CDI</b> e uma <b>LF a CDI + 1,20%</b>. O CDI de referência é <b>14,40% a.a.</b></p>
<p>O analista júnior: <em>"110% do CDI é tipo CDI + 1,5%, então a LF a CDI+1,20 é mais barata, fácil."</em></p>`,
      calculo_guiado: {
        label: "Conversão correta: 110% do CDI → CDI + spread equivalente",
        corpo: `<p>A incidência de 110% é sobre a <b>taxa diária</b>, que capitaliza ao longo do ano:</p>
<p style="font-variant-numeric: tabular-nums;">110% do CDI (14,40%) → anualizado ≈ <b>15,95% a.a.</b></p>
<p style="font-variant-numeric: tabular-nums;">Spread equivalente = (1,1595 ÷ 1,1440) − 1 ≈ <b>CDI + 1,35%</b></p>
<p style="font-size: 0.88em; color: #555;">A "conta de cabeça" do júnior (1,10 × 14,40 = CDI + 1,44%) erra porque ignora a capitalização composta. A comparação correta é a multiplicativa.</p>`,
      },
      pergunta:
        "Sabendo que a curva precifica queda de juros (1y1y 13,20% < 14,40%), qual captação você prefere e por quê?",
      opcoes: [
        {
          id: "A",
          texto: `Prefiro pagar "% do CDI" (CDB), porque o spread equivalente de um "% do CDI" derrete quando o CDI cai — num ciclo de corte, o CDB a 110% fica relativamente mais barato que a LF a CDI+1,20 fixo.`,
          rotulo: "forte",
          esperada: true,
          feedback: `Exato. Você usou a conversão multiplicativa (M3) <b>e</b> os forwards do M2: se o CDI cai de 14,40% para 12,75% (Focus), o spread equivalente do CDB a 110% cai junto (porque a base CDI encolheu), enquanto a LF paga CDI+1,20 fixo sobre a nova base menor. A curva vira insumo de decisão comercial.`,
        },
        {
          id: "B",
          texto: `Prefiro a LF a CDI+1,20 porque CDI + 1,20 < CDI + 1,35 hoje, e isso não muda no tempo.`,
          rotulo: "armadilha",
          esperada: false,
          feedback: `Você comparou taxas de um único dia e assumiu que a relação é estável — mas o spread equivalente do "% do CDI" <em>muda com o nível do CDI</em>. Num ciclo de corte (que é o que a curva precifica), o CDB a 110% fica progressivamente mais barato que a LF a CDI+1,20, porque a base CDI encolhe. Comparação estática em mercado dinâmico é outra armadilha clássica.`,
        },
        {
          id: "C",
          texto: `São equivalentes; o indexador não afeta o custo ao longo do ciclo.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `O indexador afeta muito: "% do CDI" é um multiplicador sobre uma taxa variável, então o custo real (em R$) muda se o CDI muda. "CDI + spread" é uma taxa variável com piso de spread fixo. Num ciclo de alta de juros, o CDB a 110% encarece mais rápido; num ciclo de corte, fica mais barato. A dinâmica do indexador é a informação central do M3.`,
        },
        {
          id: "D",
          texto: `Prefiro o CDB porque % do CDI é sempre mais barato que CDI + spread.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `Depende do nível e da trajetória do CDI. Com CDI alto, o multiplicador de 110% incide sobre uma base maior, tornando o CDB caro. Com CDI baixo (ciclo de corte), o 110% incide sobre base menor, tornando o CDB barato. Não há "sempre" — há um ponto de cruzamento que depende do nível do CDI.`,
        },
      ],
    },

    // ── CP6 ────────────────────────────────────────────────────────────────
    {
      id: "cp6",
      titulo: "O balanço dói",
      modulos: ["M4"],
      cena: `<p>Sobe o nível: do título para o balanço inteiro. O app mostra os agregados do balanço: <b>DV01 de juros ≈ R$ 26,7 mil/bp</b>; <b>DV01 de spread líquido ≈ R$ 64 mil/bp</b>; <b>gap de reprecificação 12m ≈ −R$ 140 mi</b>.</p>
<p>O choque fiscal sugere um <b>steepener</b>: curto −200 bps, longo +100 bps.</p>`,
      calculo_guiado: {
        label: "Cenário steepener: curto −200 bps, longo +100 bps",
        corpo: `<p style="font-variant-numeric: tabular-nums;"><b>ΔNII (12m) ≈ +R$ 4 mi</b> &nbsp;·&nbsp; <b>ΔEVE ≈ −R$ 2,7 mi</b></p>
<p style="font-size: 0.88em; color: #555;">NII: passivo pós líquido (~R$ 200 mi) barateia com a queda do curto → resultado melhora.<br/>EVE: alta do longo derruba os prefixados, onde mora o DV01 de juros → valor cai.</p>`,
      },
      pergunta: `"Nesse cenário, ganhamos ou perdemos?" — Qual é a sua resposta ao ALCO?`,
      opcoes: [
        {
          id: "A",
          texto: `Depende da métrica: o resultado (NII) melhora e o valor (EVE) piora — não há contradição, são duas lentes diferentes. Reporto as duas.`,
          rotulo: "forte",
          esperada: true,
          feedback: `Exato — essa é a "pegadinha produtiva" do M4. Quem responde "ganha" ou "perde" sem perguntar "em qual métrica?" responde pela metade. O NII mede o <b>fluxo de 12 meses</b>; o EVE mede o <b>valor econômico do balanço</b>. Como o passivo do Meridiano é pós/curto, o NII é a métrica que mais vincula — mas o EVE sinaliza como a riqueza do banco evolui no longo prazo.`,
        },
        {
          id: "B",
          texto: `Ganhamos — o NII melhora, então o balanço está protegido.`,
          rotulo: "parcial",
          esperada: false,
          feedback: `Você leu a lente certa para o passivo do Meridiano (NII) — mas ignorou o EVE. A resposta completa ao ALCO mostra as duas: NII melhora (+R$ 4 mi) e EVE piora (−R$ 2,7 mi). Reportar só o NII deixa o conselho sem a visão de como o valor do banco evolui. O regulador (IRRBB) exige as duas métricas.`,
        },
        {
          id: "C",
          texto: `Perdemos — o EVE piora, então a posição está errada.`,
          rotulo: "parcial",
          esperada: false,
          feedback: `Você leu uma lente — mas ignorou o NII. Para um banco com passivo pós/curto, o EVE piorar num steepener é esperado (pré longo sobe, derruba os títulos), mas o NII melhora porque o custo do passivo curto cai mais rápido. A posição pode estar certa para o mandato e ainda assim mostrar EVE negativo num determinado cenário.`,
        },
        {
          id: "D",
          texto: `Não dá para dizer; faltam dados de crédito e liquidez.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `Crédito e liquidez são riscos reais, mas o IRRBB — gestão de risco de taxa de juros no balanço — é autônomo: mede EVE e NII para o portfólio de taxa de juros, separado de crédito e liquidez. Com os dados que você tem (DV01, gap, cenário de choque), a análise é perfeitamente possível.`,
        },
      ],
    },

    // ── CP7 ────────────────────────────────────────────────────────────────
    {
      id: "cp7",
      titulo: "Parecer ao ALCO",
      modulos: ["M1", "M2", "M3", "M4"],
      cena: `<p>Sexta-feira, reunião do ALCO. Tudo converge: você tem o diagnóstico macro (CP1), o prêmio da curva (CP2), a trava montada (CP3), a dor da carteira em reais (CP4), a escolha de captação (CP5) e o retrato do balanço por métrica (CP6).</p>
<p>A CRO: <em>"Uma recomendação, uma página: <b>fechamos o risco ou carregamos?</b> E quero o critério pelo qual você quer ser julgado."</em></p>
<p>Como o passivo do Meridiano é majoritariamente <b>pós/curto</b> (NII é a métrica que vincula), uma recomendação coerente com esse mandato é:</p>`,
      pergunta: "Qual é a sua recomendação de posicionamento?",
      opcoes: [
        {
          id: "A",
          texto: `Carregar a duration dos prefixados (não é a métrica que aperta) e atacar o funding: alongar parte dos depósitos para encolher o gap de −R$ 140 mi e proteger o NII; manter a trava da captação como proteção de um passivo já comprometido.`,
          rotulo: "forte",
          esperada: true,
          feedback: `Recomendação amarrada ao mandato. Com passivo pós/curto, o NII é a métrica que vincula — e o gap de −R$ 140 mi é o risco que mais incomoda. A trava do CP3 protege a captação futura. <b>Nota:</b> para um banco com passivo longo (ex.: fundo de previdência), a recomendação oposta — fechar a duration agora — seria igualmente defensável. O passivo decide, não o cenário.`,
        },
        {
          id: "B",
          texto: `Fechar toda a duration agora vendendo os prefixados, porque o EVE piorou no cenário.`,
          rotulo: "fraca",
          esperada: false,
          feedback: `Você resolveu o risco que não vincula (EVE) para o perfil de passivo do Meridiano. Como o passivo é pós/curto, o NII é a métrica central — e fechar a duration dos prefixados sacrifica o carrego sem resolver o gap de reprecificação. O EVE piora num steepener, mas isso é esperado e tolerável se o NII está protegido.`,
        },
        {
          id: "C",
          texto: `Migrar 100% para LFT para "zerar o risco".`,
          rotulo: "fraca",
          esperada: false,
          feedback: `Repetição da armadilha do CP0: "zerar o risco" é ilusão. A LFT troca risco de juro por risco de spread (deságio de 0,40% a.a. já visível no balanço) e sinaliza saída de duration num momento em que a curva precifica cortes. Além disso, vender R$ 200 mi de prefixados no mercado move preços — o custo de implementação pode superar o benefício.`,
        },
        {
          id: "D",
          texto: `Desmontar a trava e esperar os cortes que a curva precifica.`,
          rotulo: "armadilha",
          esperada: false,
          feedback: `Volta a armadilha do CP3: ler a forward como previsão. A trava existe porque há um passivo a proteger — não porque você "aposta" que o juro sobe. Desmontar a trava é ceder ao cenário (cortes que a curva precifica) sem mandato para isso. E se o COPOM não cortar? O risco de taxa da captação volta a ficar aberto.`,
        },
      ],
      segunda_pergunta: {
        pergunta: "Pelo que você quer que este parecer seja julgado?",
        opcoes: [
          {
            id: "i",
            texto: `Pelo processo e pelas premissas — curva certa, fatores separados (pré × pós, EVE × NII), cenário declarado, recomendação amarrada ao passivo.`,
            rotulo: "forte",
            esperada: true,
            feedback: `Com isso, você fecha o curso. O princípio que o M2 planta — <b>decisão ≠ resultado</b> — chega aqui em sua forma mais concreta: uma decisão é boa se o processo foi rigoroso, não se o cenário se confirmou. O CDI pode andar diferente do que a curva precifica; o que está no seu controle é a qualidade do raciocínio. Gestão de tesouraria é essa escolha — repetida com disciplina.`,
          },
          {
            id: "ii",
            texto: `Pelo acerto do cenário — se o CDI andar para onde eu apostei.`,
            rotulo: "armadilha",
            esperada: false,
            feedback: `Esse é o erro que o curso combate desde o M2. Julgar pelo cenário realizado é confundir sorte com competência — e incentiva posições especulativas que não casam com o mandato. A CRO: "Se você quer ser julgado pelo CDI, você não está gerindo um banco — está gerindo um fundo long-only". O critério correto é sempre o processo.`,
          },
        ],
      },
    },
  ],
};
