import type { Scenario } from "@/lib/types";

export const s3_3: Scenario = {
  id: "s3-3",
  codigo: "S3.3",
  empresa: "Tesouraria bancária",
  titulo: "Marcando uma debênture quando o spread muda",
  nivel: "adv",
  duracaoMin: 22,
  contexto: "No book da tesouraria há uma <b>debênture IPCA + 6,2%</b>, prazo <span class=\"num\">4 anos</span>. Uma <b>notícia piora o setor</b> do emissor e o mercado passa a exigir <span class=\"num\">IPCA + 7,2%</span> para papéis de risco semelhante. Você decide o que fazer com a posição.",
  chips: [
    {
      k: "Papel",
      v: "Debênture IPCA+6,2%"
    },
    {
      k: "Prazo",
      v: "4 anos"
    },
    {
      k: "Spread exigido (novo)",
      v: "IPCA+7,2%"
    },
    {
      k: "Δ spread",
      v: "+100 bps"
    },
    {
      k: "FGC",
      v: "Não cobre"
    },
    {
      k: "Hedge possível",
      v: "NTN-B"
    }
  ],
  etapas: [
    {
      id: "etapa-1",
      titulo: "Etapa 1",
      enunciado: "Com o spread exigido subindo de 6,2% para 7,2% (cupom real maior), o efeito imediato no PU da debênture é:",
      opcoes: [
        {
          id: "a",
          text: "O PU cai — perda de marcação, pois a taxa exigida subiu",
          correct: true
        },
        {
          id: "b",
          text: "O PU não muda, pois o papel é IPCA+"
        },
        {
          id: "c",
          text: "O PU sobe, acompanhando o novo cupom"
        },
        {
          id: "d",
          text: "Depende apenas do IPCA do mês corrente"
        }
      ],
      feedback: "Mais cupom real exigido = maior desconto dos fluxos = <b>PU menor</b>. A correção pelo IPCA protege o poder de compra, mas não o preço de marcação quando o <b>spread</b> abre.",
      pontos: 20
    },
    {
      id: "etapa-2",
      titulo: "Etapa 2",
      enunciado: "Qual risco se materializou nessa perda de marcação?",
      opcoes: [
        {
          id: "a",
          text: "Risco de inflação medido pelo IPCA"
        },
        {
          id: "b",
          text: "Risco cambial sobre o valor do papel"
        },
        {
          id: "c",
          text: "Nenhum risco real — é apenas ruído contábil"
        },
        {
          id: "d",
          text: "Risco de crédito: a piora do setor elevou o prêmio de crédito exigido do emissor",
          correct: true
        }
      ],
      feedback: "O movimento é de <b>spread de crédito</b>, não de inflação nem de juro real de mercado em geral. A marcação a mercado torna visível um risco que já existia.",
      pontos: 20
    },
    {
      id: "etapa-3",
      titulo: "Etapa 3",
      enunciado: "Como separar o risco de <b>juro real</b> do risco de <b>crédito</b> nesse papel?",
      opcoes: [
        {
          id: "a",
          text: "Comprar mais da mesma debênture para baratear o preço médio"
        },
        {
          id: "b",
          text: "Hedgear o juro real vendendo NTN-B equivalente, deixando exposto apenas o risco de crédito (spread)",
          correct: true
        },
        {
          id: "c",
          text: "Trocar toda a posição por LFT pós-Selic"
        },
        {
          id: "d",
          text: "Não há como separar juro real de crédito"
        }
      ],
      feedback: "Vender NTN-B de prazo semelhante neutraliza o componente de juro real; o que sobra na posição é o <b>risco de crédito</b> do emissor — que você mantém por convicção, conscientemente.",
      pontos: 20
    }
  ],
  encruzilhada: {
    titulo: "O que fazer com a debênture?",
    subtitulo: "Decisão de gestão de risco — não há resposta única.",
    ramos: [
      {
        id: "A",
        rotulo: "Vender",
        titulo: "Vender a debênture e realizar a perda",
        resumo: "Sai do crédito; cristaliza a marcação negativa.",
        resultado: {
          titulo: "Corta o risco — realiza a perda",
          deltas: [
            { k: "Posição", v: "Zerada", tone: "neu" },
            { k: "Perda", v: "Realizada", tone: "neg" },
            { k: "Risco de crédito", v: "Eliminado", tone: "pos" },
            { k: "Liquidez", v: "Venda pode sair com desconto", tone: "neg" }
          ],
          analise: "Δspread = +100 bps, Dmod ≈ 3,6 (4 anos, cupom 6,2%): <code>ΔPU/PU ≈ −3,6 × 1% = −3,6%</code>. Vender realiza essa perda agora. Se o setor piorar mais (+100 bps adicionais): <code>ΔPU/PU ≈ −7,2%</code> — a perda dobra. Sair ao primeiro sinal evita a cauda do risco, ao custo de vender num papel ilíquido com spread de venda amplo."
        }
      },
      {
        id: "B",
        rotulo: "Decompor",
        titulo: "Hedgear o juro real (vender NTN-B), manter o crédito",
        resumo: "Neutraliza o juro real; mantém só o spread por convicção.",
        resultado: {
          titulo: "Decomposição — carrega só o que escolhe",
          deltas: [
            { k: "Juro real", v: "Hedgeado (NTN-B)", tone: "pos" },
            { k: "Risco mantido", v: "Crédito do emissor", tone: "neu" },
            { k: "Marcação de juro real", v: "Neutralizada", tone: "pos" },
            { k: "Custo", v: "Operacional do hedge", tone: "neu" }
          ],
          analise: "Vender NTN-B 4 anos (Dmod ≈ 3,6): <code>zera a sensibilidade ao juro real</code>. Posição residual = long crédito (IPCA+6,2%) + short NTN-B (IPCA+X%) = spread de crédito puro de <code>+100 bps</code>. Se o setor melhorar e spread voltar de 7,2% a 6,2%: <code>ganho ≈ +3,6% × nocional</code>. Carrega-se apenas o que se escolheu — não o juro real por inércia. <b>Operacionalização:</b> (1) identificar NTN-B com vencimento mais próximo dos 4 anos (ex.: NTN-B 2028 ou 2029); (2) calcular o volume necessário: <code>Q_NTN-B = (Dmod_deb × PU_deb × Q_deb) / (Dmod_NTN-B × PU_NTN-B)</code> para igualar o BPV das duas pontas; (3) montar uma <b>posição vendida em NTN-B</b> via aluguel de títulos (BTC/B3), repo reverso ou derivativos (swap IPCA+ vs CDI) — instrumentos que mantêm o hedge ativo enquanto a debênture permanecer no book, sem implicar venda definitiva do ativo. Como debênture e NTN-B compartilham o indexador IPCA, movimentos paralelos da ETTJ real se anulam: o que resta é exatamente o spread de crédito de +100 bps."
        }
      },
      {
        id: "C",
        rotulo: "Carregar",
        titulo: "Não fazer nada — carregar a posição inteira",
        resumo: "Mantém juro real + crédito; aposta na recuperação.",
        resultado: {
          titulo: "Inércia — exposição plena",
          deltas: [
            { k: "Juro real", v: "Exposto", tone: "neg" },
            { k: "Crédito", v: "Exposto", tone: "neg" },
            { k: "Se o setor melhorar", v: "Recupera a marcação", tone: "pos" },
            { k: "Se piorar mais", v: "Perda amplia", tone: "neg" }
          ],
          analise: "Mantém juro real (Dmod ≈ 3,6) + crédito (+100 bps). Se o setor piorar +100 bps mais: <code>ΔPU/PU ≈ −3,6 × 2% = −7,2%</code> — combinação de juro real e crédito impossível de isolar. O gestor não sabe quanto da perda vem de cada fonte, tornando o stop e o rebalanceamento difíceis de calibrar.",
          risco: true
        }
      }
    ]
  },
  reflexao: {
    enunciado: "Qual a boa prática ao gerir um papel de crédito cujo spread se abriu?",
    opcoes: [
      {
        id: "a",
        text: "Sempre vender ao primeiro sinal negativo do setor"
      },
      {
        id: "b",
        text: "Sempre carregar o papel até o vencimento"
      },
      {
        id: "c",
        text: "Decompor os riscos: separar o risco de mercado (juro real, hedgeável via NTN-B) do risco de crédito (spread do emissor) e decidir conscientemente qual carregar",
        correct: true
      },
      {
        id: "d",
        text: "Ignorar a marcação, pois é apenas contábil"
      }
    ],
    feedback: "Nem pânico (vender tudo) nem inércia (carregar no escuro): a decomposição permite cobrir o risco que não se quer e manter, por convicção, apenas o risco de crédito.",
    pontos: 25
  },
  pontuacaoMax: 85
};
