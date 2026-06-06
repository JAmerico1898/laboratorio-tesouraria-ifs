import type { Scenario } from "@/lib/types";

export const s4_1: Scenario = {
  id: "s4-1",
  codigo: "S4.1",
  empresa: "Gestor de renda fixa",
  titulo: "Definindo o perfil da carteira",
  nivel: "int",
  duracaoMin: 20,
  contexto: "Você tem <span class=\"num\">R$ 500 mi</span> para alocar por <span class=\"num\">~3 anos</span>. A curva está <b>íngreme</b> e o Copom está <b>perto do fim do ciclo</b>. Você precisa escolher o perfil da carteira (bullet, barbell ou ladder) e o indexador.",
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
          text: "O barbell tem menor duration"
        },
        {
          id: "c",
          text: "O barbell tem maior risco de crédito"
        },
        {
          id: "d",
          text: "O barbell tem sempre menor carrego"
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
          text: "Distribui vencimentos uniformemente, com reinvestimento escalonado e carrego estável — perfil defensivo",
          correct: true
        },
        {
          id: "b",
          text: "Concentra tudo no vértice de 3 anos"
        },
        {
          id: "c",
          text: "Maximiza a duration da carteira"
        },
        {
          id: "d",
          text: "Elimina o risco de reinvestimento"
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
          text: "Marcação negativa e carrego inferior — a aposta de duration foi na direção errada",
          correct: true
        },
        {
          id: "b",
          text: "Ganho de marcação"
        },
        {
          id: "c",
          text: "Neutro: por ser pré, não marca"
        },
        {
          id: "d",
          text: "Protegido, porque é um bullet"
        }
      ],
      feedback: "Bullet pré é aposta concentrada de duration. Se a curva sobe (em vez de cair), o PU recua (marcação negativa) e ainda se carrega taxa menor que a nova de mercado — o trade-off duration × convicção.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "Qual perfil de carteira montar?",
    subtitulo: "O perfil expressa sua visão de curva e seu apetite por convexidade.",
    ramos: []
  },
  reflexao: {
    enunciado: "Como cenário de curva e perfil de carteira se relacionam?",
    opcoes: [
      {
        id: "a",
        text: "O perfil (bullet/barbell/ladder) e o indexador expressam a visão de curva e o apetite por convexidade: barbell maximiza convexidade para apostar em queda, ladder é defensivo sob incerteza e bullet pré é aposta concentrada que pune o erro de direção",
        correct: true
      },
      {
        id: "b",
        text: "O perfil da carteira não depende do cenário"
      },
      {
        id: "c",
        text: "O bullet é sempre superior"
      },
      {
        id: "d",
        text: "A convexidade não tem valor numa carteira"
      }
    ],
    feedback: "Não há perfil “certo” em abstrato: a escolha traduz convicção de curva e tolerância a risco de marcação. Convexidade e duration são as alavancas dessa tradução.",
    pontos: 25
  },
  pontuacaoMax: 85
};
