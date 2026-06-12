"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CaseSvb, SvbCheckpoint as SvbCheckpointType, SvbOpcao } from "@/lib/types";

const STORAGE_KEY = "svb:v1";

const C = {
  navy: "#1F3A5F",
  teal: "#1F6F6F",
  gold: "#B07D2B",
  red: "#9B2D2D",
  green: "#2E7D52",
};

const MOD_COLORS: Record<string, string> = {
  M1: "#2E5E8C",
  M2: "#1F6F6F",
  M3: "#B07D2B",
  M4: "#7A4E8C",
};

type SavedState = {
  cpRespostas: Record<string, string>; // cpId → opcaoId escolhida
};

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SavedState;
  } catch {}
  return { cpRespostas: {} };
}

function saveState(s: SavedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

// ── Subcomponentes ────────────────────────────────────────────────────────────

function ModTag({ m }: { m: string }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-extrabold text-white"
      style={{ backgroundColor: MOD_COLORS[m] ?? C.navy }}
    >
      {m}
    </span>
  );
}

function CheckpointBlock({
  cp,
  resposta,
  onResponder,
}: {
  cp: SvbCheckpointType;
  resposta: string | undefined;
  onResponder: (cpId: string, opcaoId: string) => void;
}) {
  const opcaoEscolhida = resposta ? cp.opcoes.find((o) => o.id === resposta) : null;

  return (
    <div
      className="mt-4 rounded-xl overflow-hidden"
      style={{ border: `1px solid ${C.navy}`, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{ backgroundColor: C.navy }}
      >
        <span className="font-serif font-bold text-white text-[15px]">{cp.titulo}</span>
        <div className="flex gap-1">
          {cp.modulos.map((m) => (
            <ModTag key={m} m={m} />
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4" style={{ backgroundColor: "#F8F9FB" }}>
        {/* Contexto */}
        <div
          className="text-sm text-ink [&_b]:font-semibold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: cp.contexto }}
        />

        {/* Pergunta + opções */}
        {!opcaoEscolhida ? (
          <div>
            <p className="text-sm font-semibold text-ink mb-2">{cp.pergunta}</p>
            <div className="space-y-2">
              {cp.opcoes.map((op) => (
                <button
                  key={op.id}
                  onClick={() => onResponder(cp.id, op.id)}
                  className="w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-colors hover:border-[#1F3A5F] hover:bg-white"
                  style={{ borderColor: "#C9CFD8", backgroundColor: "white" }}
                  dangerouslySetInnerHTML={{ __html: op.texto }}
                />
              ))}
            </div>
          </div>
        ) : (
          <FeedbackBlock opcao={opcaoEscolhida} svbFez={cp.svbFez} ponte={cp.ponte} />
        )}
      </div>
    </div>
  );
}

function FeedbackBlock({
  opcao,
  svbFez,
  ponte,
}: {
  opcao: SvbOpcao;
  svbFez: string;
  ponte: string;
}) {
  const borderColor = opcao.leituraCurso ? C.teal : C.red;
  const bgColor = opcao.leituraCurso ? "#E4F0F0" : "#F8ECEC";

  return (
    <div className="space-y-3">
      {/* Opção escolhida */}
      <div
        className="rounded-lg p-3 text-sm"
        style={{ borderLeft: `4px solid ${borderColor}`, backgroundColor: bgColor }}
      >
        {opcao.leituraCurso && (
          <span
            className="inline-block text-[11px] font-bold rounded-full px-2 py-0.5 mb-2 text-white"
            style={{ backgroundColor: C.teal }}
          >
            leitura do curso
          </span>
        )}
        <p
          className="text-ink [&_b]:font-semibold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: opcao.feedback }}
        />
      </div>

      {/* O que o SVB fez (sempre visível após escolha) */}
      <div
        className="rounded-lg p-3 text-sm"
        style={{ borderLeft: `4px solid ${C.red}`, backgroundColor: "#F8ECEC" }}
      >
        <p className="font-bold text-[12px] mb-1" style={{ color: C.red }}>
          O que o SVB de fato fez
        </p>
        <p
          className="text-ink [&_b]:font-semibold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: svbFez }}
        />
      </div>

      {/* Ponte para o curso */}
      <div
        className="rounded-lg p-3 text-sm"
        style={{ borderLeft: `4px solid ${C.teal}`, backgroundColor: "#E4F0F0" }}
      >
        <p className="font-bold text-[12px] mb-1" style={{ color: C.teal }}>
          ↳ Ponte para o curso
        </p>
        <p
          className="text-ink [&_b]:font-semibold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: ponte }}
        />
      </div>
    </div>
  );
}

function TimelineMarco({
  marco,
  checkpoint,
  cpResposta,
  onResponder,
}: {
  marco: CaseSvb["timeline"][number];
  checkpoint?: SvbCheckpointType;
  cpResposta?: string;
  onResponder: (cpId: string, opcaoId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isCritico = marco.tipo === "critico";
  const dotColor = isCritico ? C.red : C.gold;

  return (
    <div className="relative pl-8 pb-6">
      {/* Linha vertical */}
      <div
        className="absolute left-[11px] top-0 bottom-0 w-[3px] rounded-full"
        style={{ backgroundColor: "#C9CFD8" }}
      />
      {/* Bolinha */}
      <div
        className="absolute left-0 top-[5px] w-[22px] h-[22px] rounded-full border-2 border-white shadow-sm flex items-center justify-center"
        style={{ backgroundColor: dotColor }}
      />

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left"
        aria-expanded={expanded}
      >
        <div className="flex flex-wrap items-start gap-2">
          <span className="font-bold text-sm" style={{ color: C.navy }}>
            {marco.data}
          </span>
          {isCritico && marco.cpId && (
            <span
              className="text-[11px] font-bold rounded-full px-2 py-0.5 text-white"
              style={{ backgroundColor: C.red }}
            >
              ▶ Checkpoint
            </span>
          )}
          {marco.modulos.map((m) => (
            <ModTag key={m} m={m} />
          ))}
        </div>
        <p
          className="mt-1 text-sm text-ink [&_b]:font-semibold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: marco.evento }}
        />
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {marco.numero && (
            <div
              className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[13px] font-bold"
              style={{ backgroundColor: "#F5EEDD", color: C.gold }}
            >
              {marco.numero}
            </div>
          )}
          <p
            className="text-sm italic [&_b]:font-semibold"
            style={{ color: "#555" }}
          >
            {marco.leitura}
          </p>

          {/* Checkpoint embutido */}
          {checkpoint && (
            <CheckpointBlock
              cp={checkpoint}
              resposta={cpResposta}
              onResponder={onResponder}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ReflexaoCard({ item }: { item: CaseSvb["reflexao"][number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl border p-4 space-y-3"
      style={{ borderColor: "#C9CFD8", backgroundColor: "#F8F9FB" }}
    >
      <div className="flex flex-wrap gap-1">
        {item.modulos.map((m) => (
          <ModTag key={m} m={m} />
        ))}
      </div>
      <p className="text-sm font-medium text-ink">{item.pergunta}</p>
      <p className="text-[12px] italic" style={{ color: "#666" }}>
        Não há gabarito — o objetivo é o raciocínio, não o acerto de cenário (decisão ≠ resultado).
      </p>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-[13px] font-semibold transition-colors"
        style={{ color: C.teal }}
        aria-expanded={open}
      >
        {open ? "▾" : "▸"} Leitura do curso
      </button>
      {open && (
        <div
          className="rounded-lg p-3 text-sm [&_b]:font-semibold [&_em]:italic"
          style={{ borderLeft: `4px solid ${C.teal}`, backgroundColor: "#E4F0F0" }}
          dangerouslySetInnerHTML={{ __html: item.leituraCurso }}
        />
      )}
    </div>
  );
}

// ── Tabelas de dados-âncora ───────────────────────────────────────────────────

function TabelaBalanco() {
  const rows = [
    ["Depósitos totais", "US$ 189,2 bi", "US$ 173,1 bi", "Funding já encolhia antes da corrida"],
    ["Securities totais", "US$ 128,0 bi", "US$ 120,1 bi", "Peso de títulos enorme (55% dos ativos; pares 25%)"],
    ["HTM", "US$ 98,2 bi", "US$ 91,3 bi", `78% das securities "presas" no banking book`],
    ["AFS", "US$ 27,2 bi", "US$ 26,1 bi", "Livro pequeno para absorver choques"],
    ["Duração — carteira fixa", "4,0 anos", "5,7 anos", "Ativo alongou entrando no ciclo de alta"],
    ["Duração — HTM", "4,1 anos", "6,2 anos", "Sensibilidade a juros disparou"],
    ["Perdas não realizadas — AFS", "US$ 0,313 bi", "US$ 2,533 bi", "Batia direto em AOCI"],
    ["Perdas não realizadas — HTM", "US$ 1,343 bi", "US$ 15,160 bi", "Choque fora do capital regulatório"],
    ["Depósitos não remunerados / total", "67%", "47%", "Passivo encurtando e encarecendo"],
    ["Short-term borrowings", "US$ 0,071 bi", "US$ 13,6 bi", "Dependência de funding atacadista"],
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr style={{ backgroundColor: C.navy }}>
            {["Métrica", "31/12/2021", "31/12/2022", "Leitura do curso"].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-white font-bold border border-[#3a5a7f]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([m, v1, v2, l], i) => (
            <tr key={m} style={{ backgroundColor: i % 2 === 0 ? "white" : "#F4F6F9" }}>
              <td className="px-3 py-2 border border-[#C9CFD8] font-medium">{m}</td>
              <td className="px-3 py-2 border border-[#C9CFD8] font-mono">{v1}</td>
              <td className="px-3 py-2 border border-[#C9CFD8] font-mono">{v2}</td>
              <td className="px-3 py-2 border border-[#C9CFD8] text-[12px] text-muted">{l}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1 text-[12px] italic text-muted">
        Fonte: 10-K 2022 do SVBFG. Soma das perdas não realizadas (AFS+HTM) em 2022 ={" "}
        <strong>US$ 17,693 bi</strong>, contra patrimônio líquido de{" "}
        <strong>US$ 16,004 bi</strong>.
      </p>
    </div>
  );
}

function TabelaPares() {
  const rows = [
    ["Securities / ativos", "55%", "25%"],
    ["HTM / securities", "78%", "42%"],
    ["Depósitos não segurados / total", "94%", "41%"],
    ["CET1 / RWA", "12%", "10%"],
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr style={{ backgroundColor: C.navy }}>
            {["Métrica", "SVB", "Média pares"].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-white font-bold border border-[#3a5a7f]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([m, svb, par], i) => (
            <tr key={m} style={{ backgroundColor: i % 2 === 0 ? "white" : "#F4F6F9" }}>
              <td className="px-3 py-2 border border-[#C9CFD8] font-medium">{m}</td>
              <td className="px-3 py-2 border border-[#C9CFD8] font-mono font-bold" style={{ color: C.red }}>{svb}</td>
              <td className="px-3 py-2 border border-[#C9CFD8] font-mono">{par}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1 text-[12px] italic text-muted">
        Fonte: <em>Review of the Federal Reserve&apos;s Supervision and Regulation of SVB</em> (abr/2023).
        Note o paradoxo: o capital regulatório parecia <strong>acima</strong> dos pares.
      </p>
    </div>
  );
}

function TabelaHedges() {
  const rows = [
    ["Cash flow hedges", "US$ 5,0 bi", "US$ 0"],
    ["Fair value hedges (swaps)", "US$ 10,715 bi", "US$ 0,550 bi"],
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr style={{ backgroundColor: C.navy }}>
            {["Hedge", "Fim 2021", "Fim 2022"].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-white font-bold border border-[#3a5a7f]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([h, v1, v2], i) => (
            <tr key={h} style={{ backgroundColor: i % 2 === 0 ? "white" : "#F4F6F9" }}>
              <td className="px-3 py-2 border border-[#C9CFD8] font-medium">{h}</td>
              <td className="px-3 py-2 border border-[#C9CFD8] font-mono">{v1}</td>
              <td className="px-3 py-2 border border-[#C9CFD8] font-mono font-bold" style={{ color: C.red }}>{v2}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1 text-[12px] italic text-muted">
        Em 2022 o SVB monetizou US$ 5 bi de hedges AFS no 1T (ganho de US$ 204 mi) e os US$ 6 bi
        restantes em julho (US$ 313 mi), descrevendo isso como "capturar ganhos" e "reduzir asset
        sensitivity".
      </p>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export function SvbPlayer({ caso }: { caso: CaseSvb }) {
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState<SavedState>({ cpRespostas: {} });

  useEffect(() => {
    setSaved(loadState());
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const cpMap = Object.fromEntries(caso.checkpoints.map((cp) => [cp.id, cp]));

  function handleResponder(cpId: string, opcaoId: string) {
    const next: SavedState = {
      cpRespostas: { ...saved.cpRespostas, [cpId]: opcaoId },
    };
    setSaved(next);
    saveState(next);
  }

  function handleRestart() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSaved({ cpRespostas: {} });
  }

  const totalCps = caso.checkpoints.length;
  const respondidos = Object.keys(saved.cpRespostas).length;

  return (
    <div className="pb-16 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/estudos-de-caso"
        className="mt-8 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
      >
        ← Estudos de Caso
      </Link>

      {/* Header */}
      <div className="mt-4">
        <span
          className="inline-block text-[11px] font-bold rounded-full px-2.5 py-0.5 text-white mb-2"
          style={{ backgroundColor: C.teal }}
        >
          {caso.subtitulo}
        </span>
        <h1 className="font-serif text-3xl font-bold" style={{ color: C.navy }}>
          {caso.titulo}
        </h1>
        <div className="flex flex-wrap gap-1 mt-2">
          {["M1", "M2", "M3", "M4"].map((m) => (
            <ModTag key={m} m={m} />
          ))}
        </div>
      </div>

      {/* Banner de aviso */}
      <div
        className="mt-5 rounded-lg p-4 text-sm [&_b]:font-semibold [&_em]:italic"
        style={{ borderLeft: `6px solid ${C.red}`, backgroundColor: "#F8ECEC", color: "#333" }}
        aria-live="polite"
      >
        <p className="font-bold mb-1" style={{ color: C.red }}>
          ⚠ Caso real · fins didáticos · não é recomendação de investimento
        </p>
        <p dangerouslySetInnerHTML={{ __html: caso.aviso }} />
      </div>

      {/* Progresso */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[12px] text-muted mb-1">
          <span>{respondidos} de {totalCps} checkpoints respondidos</span>
          {respondidos === totalCps && (
            <span className="font-bold" style={{ color: C.green }}>
              ✓ Autópsia concluída
            </span>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(respondidos / totalCps) * 100}%`, backgroundColor: C.navy }}
          />
        </div>
      </div>

      {/* Dados-âncora */}
      <section className="mt-10">
        <h2
          className="font-serif text-xl font-bold border-b-2 pb-2 mb-5"
          style={{ color: C.navy, borderColor: C.gold }}
        >
          Dados-âncora do caso (factuais)
        </h2>
        <h3 className="font-semibold text-[15px] mb-2" style={{ color: C.teal }}>
          Balanço — 31/12/2022 vs. 31/12/2021
        </h3>
        <TabelaBalanco />
        <h3 className="font-semibold text-[15px] mt-6 mb-2" style={{ color: C.teal }}>
          SVB vs. pares (LBOs) — 4T22
        </h3>
        <TabelaPares />
        <h3 className="font-semibold text-[15px] mt-6 mb-2" style={{ color: C.teal }}>
          Hedges — o amortecedor desarmado em 2022
        </h3>
        <TabelaHedges />
      </section>

      {/* Timeline */}
      <section className="mt-10">
        <h2
          className="font-serif text-xl font-bold border-b-2 pb-2 mb-6"
          style={{ color: C.navy, borderColor: C.gold }}
        >
          A autópsia cronológica (2019 → 2023)
        </h2>
        <p className="text-sm text-muted mb-6">
          Clique em cada marco para expandir o evento, o número factual e a leitura do curso.
          Marcos em{" "}
          <span className="font-bold" style={{ color: C.red }}>
            vermelho
          </span>{" "}
          são críticos e contêm um checkpoint interativo.
        </p>
        <div>
          {caso.timeline.map((marco) => (
            <TimelineMarco
              key={marco.id}
              marco={marco}
              checkpoint={marco.cpId ? cpMap[marco.cpId] : undefined}
              cpResposta={marco.cpId ? saved.cpRespostas[marco.cpId] : undefined}
              onResponder={handleResponder}
            />
          ))}
        </div>
      </section>

      {/* Quadro-espelho */}
      <section className="mt-12">
        <h2
          className="font-serif text-xl font-bold border-b-2 pb-2 mb-5"
          style={{ color: C.navy, borderColor: C.gold }}
        >
          Quadro-espelho: SVB × o que o curso ensina
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr style={{ backgroundColor: C.navy }}>
                {["Dimensão", "O que o SVB fez", "O que o curso ensina", "Módulo"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left text-white font-bold border border-[#3a5a7f]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {caso.espelho.map((linha, i) => (
                <tr key={linha.dimensao} style={{ backgroundColor: i % 2 === 0 ? "white" : "#F4F6F9" }}>
                  <td className="px-3 py-2 border border-[#C9CFD8] font-semibold">{linha.dimensao}</td>
                  <td className="px-3 py-2 border border-[#C9CFD8] text-[12px]" style={{ color: C.red }}>
                    {linha.svbFez}
                  </td>
                  <td className="px-3 py-2 border border-[#C9CFD8] text-[12px]">{linha.cursoEnsina}</td>
                  <td className="px-3 py-2 border border-[#C9CFD8]">
                    <div className="flex flex-wrap gap-1">
                      {linha.modulos.map((m) => (
                        <ModTag key={m} m={m} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 text-[12px] italic text-muted">
            Fonte: síntese do relatório-base (10-K 2022, <em>Review</em> do Fed, cartas supervisoras).
          </p>
        </div>
      </section>

      {/* Pontos de reflexão */}
      <section className="mt-12">
        <h2
          className="font-serif text-xl font-bold border-b-2 pb-2 mb-2"
          style={{ color: C.navy, borderColor: C.gold }}
        >
          Pontos de reflexão
        </h2>
        <p className="text-sm text-muted mb-5">
          Perguntas de transferência para a realidade da tesouraria brasileira. Sem nota, sem gabarito.
          Clique em "Leitura do curso" para uma orientação de raciocínio.
        </p>
        <div className="space-y-4">
          {caso.reflexao.map((item, i) => (
            <ReflexaoCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* Rodapé de fontes */}
      <section className="mt-12 pt-6 border-t border-border-soft">
        <h3 className="text-[13px] font-bold text-muted mb-2">Fontes primárias</h3>
        <ul className="text-[12px] text-muted space-y-1 list-disc list-inside">
          <li>Silicon Valley Bank Financial Group — <em>Annual Report on Form 10-K</em> (exercício 2022)</li>
          <li>
            Board of Governors of the Federal Reserve System —{" "}
            <em>Review of the Federal Reserve&apos;s Supervision and Regulation of Silicon Valley Bank</em>{" "}
            (abril/2023)
          </li>
          <li>
            California Department of Financial Protection and Innovation (DFPI) — relatório de encerramento
            (março/2023)
          </li>
          <li>
            Federal Deposit Insurance Corporation (FDIC) — comunicados e relatório de resolução
            (março/2023)
          </li>
          <li>
            Federal Reserve — cartas supervisoras ao SVBFG (2021–2023)
          </li>
        </ul>
        <p className="mt-3 text-[12px] italic text-muted">
          Este material é de natureza exclusivamente didática. Não constitui recomendação de investimento,
          análise de crédito nem julgamento de pessoas. Os números reproduzem fielmente as fontes acima.
        </p>
      </section>

      {/* Recomeçar */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleRestart}
          className="rounded-xl border px-5 py-2 text-sm font-semibold transition-colors hover:bg-surface-container"
          style={{ borderColor: C.navy, color: C.navy }}
        >
          Recomeçar o caso
        </button>
      </div>
    </div>
  );
}
