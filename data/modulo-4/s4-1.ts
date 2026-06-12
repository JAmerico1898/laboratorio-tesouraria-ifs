import type { Scenario } from "@/lib/types";

export const s4_1: Scenario = {
  id: "s4-1",
  codigo: "S4.1",
  empresa: "Gestor de renda fixa",
  titulo: "Definindo o perfil da carteira",
  nivel: "int",
  duracaoMin: 20,
  contexto: "Você tem <span class=\"num\">R$ 500 mi</span> para alocar por <span class=\"num\">~3 anos</span>. A curva está <b>íngreme e ascendente</b> e o Copom está <b>perto do fim do ciclo</b>. Você precisa escolher o perfil da carteira (bullet, barbell ou ladder) e o indexador.",
  chips: [
    {
      k: "Volume",
      v: "R$ 500 mi"
    },
    {
      k: "Horizonte",
      v: "~3 anos"
    },
    {
      k: "Curva",
      v: "Íngreme"
    },
    {
      k: "Copom",
      v: "Fim do ciclo"
    },
    {
      k: "Perfis",
      v: "Bullet / Barbell / Ladder"
    },
    {
      k: "Indexador",
      v: "Pré / IPCA+ / Misto"
    }
  ],
  dadosMercado: {
    titulo: "Dados de mercado",
    corpo: "bullet (concentra no vértice-alvo), barbell (1+5, maior convexidade), ladder (1-2-3-4-5, reinvestimento escalonado). Mesma duration → barbell tem mais convexidade que o bullet."
  },
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "O que diferencia um <b>barbell (1+5)</b> de um <b>bullet (3)</b> de mesma duration?",
      opcoes: [
        {
          id: "a",
          text: "O barbell tem maior convexidade — ganha mais na queda e perde menos na alta de juros",
          correct: true
        },
        {
          id: "b",
          text: "O barbell carrega maior risco de crédito — concentra vencimentos nos extremos e eleva a exposição a emissores de prazos mais longos"
        },
        {
          id: "c",
          text: "O barbell tem sempre menor carrego — ao dividir o capital entre pontas curta e longa, dilui o prêmio de prazo e comprime a taxa média da carteira"
        },
        {
          id: "d",
          text: "O barbell tem menor duration que o bullet — a ponta curta domina o peso do portfólio e comprime a sensibilidade média à variação de taxa"
        }
      ],
      feedback: "Para a mesma duration, distribuir o fluxo nas pontas (1 e 5) gera mais convexidade que concentrar no centro (3). Maior convexidade = assimetria favorável diante de grandes movimentos.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "O que caracteriza uma estratégia <b>ladder</b> (1-2-3-4-5)?",
      opcoes: [
        {
          id: "a",
          text: "Concentra todo o fluxo no vértice de 3 anos — casar o prazo único ao horizonte da carteira minimiza o risco de reinvestimento e maximiza o carrego"
        },
        {
          id: "b",
          text: "Distribui vencimentos uniformemente, com reinvestimento escalonado e carrego estável — perfil defensivo",
          correct: true
        },
        {
          id: "c",
          text: "Maximiza a duration total da carteira — ao escalonar vencimentos até o prazo mais longo disponível, eleva a sensibilidade média e o carrego do portfólio"
        },
        {
          id: "d",
          text: "Elimina por completo o risco de reinvestimento — cada vencimento escalonado é reaplicado à taxa travada no início, imunizando a carteira de variações futuras da Selic"
        }
      ],
      feedback: "A ladder escalona vencimentos: a cada ano um pedaço vence e é reinvestido na taxa vigente. Reduz a dependência de uma única visão de curva — defensiva sob incerteza.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Você monta um <b>bullet de 3 anos pré</b> apostando em queda, mas a curva <b>sobe</b>. O que acontece?",
      opcoes: [
        {
          id: "a",
          text: "Ganho de marcação, por ser bullet — a concentração no vértice de 3 anos amplifica a valorização quando a curva se move em qualquer direção"
        },
        {
          id: "b",
          text: "Neutro: por ser pré, não marca a mercado — títulos prefixados carregam até o vencimento sem atualização do PU, independentemente do movimento da curva"
        },
        {
          id: "c",
          text: "Marcação negativa e carrego inferior — a aposta de duration foi na direção errada",
          correct: true
        },
        {
          id: "d",
          text: "Protegido, justamente por ser um bullet — a concentração em único vértice reduz a exposição a movimentos em diferentes pontos da curva"
        }
      ],
      feedback: "Bullet pré é aposta concentrada de duration. Se a curva sobe (em vez de cair), o PU recua (marcação negativa) e ainda se carrega taxa menor que a nova de mercado — o trade-off duration × convicção.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Qual perfil de carteira montar?",
    subtitulo: "O perfil expressa sua visão de curva e seu apetite por convexidade.",
    ramos: [
      {
        id: "A",
        rotulo: "Barbell",
        titulo: "Barbell 1+5 pré (alta convexidade)",
        resumo: "Maximiza convexidade; aposta em queda da curva.",
        resultado: {
          titulo: "Convexidade máxima — aposta em queda",
          deltas: [
            { k: "Perfil", v: "Barbell 1+5", tone: "neu" },
            { k: "Convexidade", v: "Máxima (p/ a duration)", tone: "pos" },
            { k: "Se a curva cair", v: "Ganho amplificado", tone: "pos" },
            { k: "Se a curva subir", v: "Perde menos que o bullet", tone: "pos" }
          ],
          analise: "Peso: <code>w×1+(1−w)×5=3 → w=0,5</code>; alocar <code>R$ 250 mi em zeros de 1a + R$ 250 mi em zeros de 5a</code>. Convexidade: <code>C_barbell = 0,5×1²+0,5×5² = 0,5+12,5 = 13</code> vs bullet de 3a: <code>C_bullet = 3² = 9</code>. Para |Δy|=1%: vantagem de convexidade ≈ <code>½×(13−9)×0,01²×PV = 0,02%×PV</code> — o benefício assimétrico de ter as pontas distantes."
        }
      },
      {
        id: "B",
        rotulo: "Ladder",
        titulo: "Ladder 1-2-3-4-5 (defensivo)",
        resumo: "Vencimentos uniformes; reinvestimento escalonado.",
        resultado: {
          titulo: "Defensivo — robusto à curva",
          deltas: [
            { k: "Perfil", v: "Ladder 1–5", tone: "neu" },
            { k: "Reinvestimento", v: "Escalonado", tone: "pos" },
            { k: "Dependência da curva", v: "Baixa", tone: "pos" },
            { k: "Upside direcional", v: "Limitado", tone: "neu" }
          ],
          analise: "Alocação: <code>R$ 100 mi cada em 1, 2, 3, 4 e 5 anos (20% × R$ 500 mi)</code>. Duration média: <code>(1+2+3+4+5)/5 = 3,0 ✓</code>. Convexidade: <code>C_ladder = 0,2×(1+4+9+16+25) = 0,2×55 = 11</code> — entre bullet (9) e barbell (13). A cada ano vence R$ 100 mi para reinvestir à taxa vigente: se a Selic subiu, reinveste a taxas maiores — perfil defensivo sem aposta direcional."
        }
      },
      {
        id: "C",
        rotulo: "Bullet",
        titulo: "Bullet 3 anos pré (concentrado)",
        resumo: "Aposta concentrada de duration; pune erro de direção.",
        resultado: {
          titulo: "Aposta concentrada — assimétrica",
          deltas: [
            { k: "Perfil", v: "Bullet 3a", tone: "neu" },
            { k: "Convexidade", v: "Menor que o barbell", tone: "neg" },
            { k: "Se a curva cair", v: "Ganha", tone: "pos" },
            { k: "Se a curva subir", v: "Marcação negativa + carrego menor", tone: "neg" }
          ],
          analise: "Todo o capital concentrado em zeros de 3 anos. Convexidade: <code>C_bullet = 3² = 9</code> — menor que barbell (13) e ladder (11). Se a curva subir 1%: <code>ΔPU/PU ≈ −Dmod×0,01 ≈ −3% → −R$ 15 mi sobre R$ 500 mi</code> de marcação adversa. Além da marcação, passa a carregar taxa abaixo do novo nível de mercado — dupla penalidade por errar a direção.",
          risco: true
        }
      }
    ]
  },
  reflexao: {
    enunciado: "Como cenário de curva e perfil de carteira se relacionam?",
    opcoes: [
      {
        id: "a",
        text: "O perfil da carteira independe do cenário de curva: bullet, barbell e ladder têm o mesmo comportamento de marcação e carrego — a escolha é apenas operacional e não expressa nenhuma visão direcional de taxa ou apetite por convexidade"
      },
      {
        id: "b",
        text: "O bullet é sempre superior aos demais perfis: concentrar o fluxo no vértice-alvo maximiza o carrego e a convexidade — barbell e ladder sacrificam retorno sem oferecer proteção adicional em nenhum cenário de curva"
      },
      {
        id: "c",
        text: "A convexidade não tem valor numa carteira de renda fixa: como os títulos soberanos são marcados pelo carrego contratado, variações da curva não afetam o PU e o benefício assimétrico da convexidade nunca se materializa no resultado do portfólio"
      },
      {
        id: "d",
        text: "O perfil (bullet/barbell/ladder) e o indexador expressam a visão de curva e o apetite por convexidade: barbell maximiza convexidade para apostar em queda, ladder é defensivo sob incerteza e bullet pré é aposta concentrada que pune o erro de direção",
        correct: true
      }
    ],
    feedback: "Não há perfil “certo” em abstrato: a escolha traduz convicção de curva e tolerância a risco de marcação. Convexidade e duration são as alavancas dessa tradução.",
    pontos: 25
  },
  pontuacaoMax: 85
};
