"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type {
  CaseNarrativo,
  CpOpcao,
  CheckpointRotulo,
} from "@/lib/types";

const STORAGE_KEY = "meridiano:v1";

const MOD_CORES: Record<string, string> = {
  M1: "#2E5E8C",
  M2: "#1F6F6F",
  M3: "#B07D2B",
  M4: "#7A4E8C",
};

const ROTULO_STYLE: Record<
  CheckpointRotulo,
  { bg: string; border: string; label: string; color: string }
> = {
  forte:     { bg: "#EAF5EE", border: "#BFE0CC", label: "Forte",     color: "#2E7D52" },
  parcial:   { bg: "#FFF8E6", border: "#FFD97D", label: "Parcial",   color: "#7A5A00" },
  armadilha: { bg: "#FFF0E6", border: "#FFBA80", label: "Armadilha", color: "#B05000" },
  fraca:     { bg: "#F8ECEC", border: "#E6C7C7", label: "Fraca",     color: "#9B2D2D" },
};

type Phase =
  | "question"
  | "feedback"
  | "segunda"
  | "segunda_feedback"
  | "done";

interface Decision {
  cpId: string;
  titulo: string;
  modulos: string[];
  opcaoId: string;
  opcaoTexto: string;
  rotulo: CheckpointRotulo;
  opcaoId2?: string;
  opcaoTexto2?: string;
  rotulo2?: CheckpointRotulo;
}

interface SavedState {
  cpIndex: number;
  phase: Phase;
  selectedId: string | null;
  selected2Id: string | null;
  decisions: Decision[];
}

export function CaseNarrativoPlayer({ caso }: { caso: CaseNarrativo }) {
  const [cpIndex, setCpIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [selected, setSelected] = useState<CpOpcao | null>(null);
  const [selected2, setSelected2] = useState<CpOpcao | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: SavedState = JSON.parse(raw);
        const cp = caso.checkpoints[saved.cpIndex];
        if (cp) {
          setCpIndex(saved.cpIndex);
          setPhase(saved.phase);
          setDecisions(saved.decisions ?? []);
          if (saved.selectedId) {
            setSelected(cp.opcoes.find((o) => o.id === saved.selectedId) ?? null);
          }
          if (saved.selected2Id && cp.segunda_pergunta) {
            setSelected2(
              cp.segunda_pergunta.opcoes.find((o) => o.id === saved.selected2Id) ?? null
            );
          }
        }
      }
    } catch {}
    setHydrated(true);
  }, [caso]);

  useEffect(() => {
    if (!hydrated) return;
    const saved: SavedState = {
      cpIndex,
      phase,
      selectedId: selected?.id ?? null,
      selected2Id: selected2?.id ?? null,
      decisions,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [cpIndex, phase, selected, selected2, decisions, hydrated]);

  if (!hydrated) return null;

  const cp = caso.checkpoints[cpIndex];
  const totalCps = caso.checkpoints.length - 1; // 7 (CP0 is briefing)

  function handleSelectOption(opcao: CpOpcao) {
    if (phase !== "question") return;
    setSelected(opcao);
    setDecisions((prev) => [
      ...prev,
      {
        cpId: cp.id,
        titulo: cp.titulo,
        modulos: cp.modulos,
        opcaoId: opcao.id,
        opcaoTexto: opcao.texto,
        rotulo: opcao.rotulo,
      },
    ]);
    setPhase("feedback");
  }

  function handleSelectSegunda(opcao: CpOpcao) {
    if (phase !== "segunda") return;
    setSelected2(opcao);
    setDecisions((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.cpId === cp.id) {
        updated[updated.length - 1] = {
          ...last,
          opcaoId2: opcao.id,
          opcaoTexto2: opcao.texto,
          rotulo2: opcao.rotulo,
        };
      }
      return updated;
    });
    setPhase("segunda_feedback");
  }

  function handleNext() {
    if (phase === "feedback" && cp.segunda_pergunta) {
      setPhase("segunda");
      return;
    }
    if (cpIndex < caso.checkpoints.length - 1) {
      setCpIndex(cpIndex + 1);
      setPhase("question");
      setSelected(null);
      setSelected2(null);
    } else {
      setPhase("done");
    }
  }

  function handleRestart() {
    localStorage.removeItem(STORAGE_KEY);
    setCpIndex(0);
    setPhase("question");
    setSelected(null);
    setSelected2(null);
    setDecisions([]);
  }

  if (phase === "done") {
    return (
      <RetrospectivaScreen
        decisions={decisions}
        caso={caso}
        onRestart={handleRestart}
      />
    );
  }

  const progressLabel =
    cpIndex === 0 ? "Briefing" : `Checkpoint ${cpIndex} de ${totalCps}`;

  const mainAnswered = phase !== "question";
  const showSegunda =
    cp.segunda_pergunta && (phase === "segunda" || phase === "segunda_feedback");
  const showNextBtn = phase === "feedback" || phase === "segunda_feedback";
  const nextLabel =
    phase === "feedback" && cp.segunda_pergunta
      ? "Continuar →"
      : cpIndex === caso.checkpoints.length - 1
      ? "Ver retrospectiva →"
      : "Próximo →";

  return (
    <div className="pb-16">
      <Link
        href="/estudos-de-caso"
        className="mt-8 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
      >
        ← Estudos de Caso
      </Link>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {caso.titulo}
      </h1>
      <p className="mt-1 text-sm text-muted">{caso.subtitulo}</p>

      {/* Progress */}
      <div className="mt-6 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(cpIndex / totalCps) * 100}%`,
              backgroundColor: "#1F3A5F",
            }}
          />
        </div>
        <span className="shrink-0 text-[13px] font-semibold text-muted">
          {progressLabel}
        </span>
      </div>

      <div className="mt-8 space-y-5">
        {/* Module tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          {cp.modulos.map((m) => (
            <span
              key={m}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-extrabold text-white"
              style={{ backgroundColor: MOD_CORES[m] }}
            >
              {m}
            </span>
          ))}
          <span className="rounded-full border border-border-soft px-2.5 py-0.5 text-[11px] font-semibold text-muted">
            {cp.titulo}
          </span>
        </div>

        {/* Scene */}
        <div
          className="rounded-r-xl border-l-4 p-5 text-[15px] leading-relaxed text-ink"
          style={{ borderLeftColor: "#1F6F6F", backgroundColor: "#E4F0F0" }}
          dangerouslySetInnerHTML={{ __html: cp.cena }}
        />

        {/* Calculo guiado */}
        {cp.calculo_guiado && (
          <div
            className="rounded-r-xl border-l-4 p-5"
            style={{ borderLeftColor: "#B07D2B", backgroundColor: "#F5EEDD" }}
          >
            <p
              className="mb-2 text-[12px] font-bold uppercase tracking-wider"
              style={{ color: "#B07D2B" }}
            >
              {cp.calculo_guiado.label}
            </p>
            <div
              className="text-[14.5px] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cp.calculo_guiado.corpo }}
            />
          </div>
        )}

        {/* Main question */}
        <p className="text-[15px] font-semibold text-ink">{cp.pergunta}</p>

        {/* Main options */}
        <div className="space-y-3">
          {cp.opcoes.map((opcao) => {
            const isSelected = selected?.id === opcao.id;
            const s = ROTULO_STYLE[opcao.rotulo];
            return (
              <button
                key={opcao.id}
                onClick={() => handleSelectOption(opcao)}
                disabled={mainAnswered}
                aria-pressed={isSelected}
                className="w-full rounded-xl border-2 p-4 text-left text-[14.5px] leading-snug transition-colors disabled:cursor-default"
                style={
                  isSelected
                    ? { borderColor: s.border, backgroundColor: s.bg }
                    : mainAnswered
                    ? {
                        borderColor: "#E0E0E0",
                        backgroundColor: "#FAFAFA",
                        opacity: 0.55,
                      }
                    : { borderColor: "#E0E0E0", backgroundColor: "#FFFFFF" }
                }
              >
                <span className="font-bold">{opcao.id}.</span> {opcao.texto}
              </button>
            );
          })}
        </div>

        {/* Main feedback */}
        {mainAnswered && selected && (
          <FeedbackPanel opcao={selected} />
        )}

        {/* Segunda pergunta */}
        {showSegunda && cp.segunda_pergunta && (
          <>
            <hr className="border-border-soft" />
            <p className="text-[15px] font-semibold text-ink">
              {cp.segunda_pergunta.pergunta}
            </p>
            <div className="space-y-3">
              {cp.segunda_pergunta.opcoes.map((opcao) => {
                const isSelected2 = selected2?.id === opcao.id;
                const locked = phase === "segunda_feedback";
                const s = ROTULO_STYLE[opcao.rotulo];
                return (
                  <button
                    key={opcao.id}
                    onClick={() => handleSelectSegunda(opcao)}
                    disabled={locked}
                    aria-pressed={isSelected2}
                    className="w-full rounded-xl border-2 p-4 text-left text-[14.5px] leading-snug transition-colors disabled:cursor-default"
                    style={
                      isSelected2
                        ? { borderColor: s.border, backgroundColor: s.bg }
                        : locked
                        ? {
                            borderColor: "#E0E0E0",
                            backgroundColor: "#FAFAFA",
                            opacity: 0.55,
                          }
                        : { borderColor: "#E0E0E0", backgroundColor: "#FFFFFF" }
                    }
                  >
                    <span className="font-bold">{opcao.id}.</span> {opcao.texto}
                  </button>
                );
              })}
            </div>
            {phase === "segunda_feedback" && selected2 && (
              <FeedbackPanel opcao={selected2} />
            )}
          </>
        )}

        {/* Next button */}
        {showNextBtn && (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#1F3A5F" }}
          >
            {nextLabel}
          </button>
        )}

        <p className="text-[12px] text-muted">
          ⚠ Dados simulados para fins pedagógicos. Em decisão real, atualizar com
          Tesouro Nacional, ANBIMA, B3, BCB/SGS e Focus.
        </p>
      </div>
    </div>
  );
}

function FeedbackPanel({ opcao }: { opcao: CpOpcao }) {
  const s = ROTULO_STYLE[opcao.rotulo];
  return (
    <div
      className="rounded-xl border p-5 text-[14.5px] leading-relaxed"
      style={{ backgroundColor: s.bg, borderColor: s.border }}
      aria-live="polite"
    >
      <p className="mb-2 font-bold" style={{ color: s.color }}>
        {s.label}
      </p>
      <div
        className="text-ink [&_b]:font-semibold [&_em]:italic"
        dangerouslySetInnerHTML={{ __html: opcao.feedback }}
      />
      {opcao.continua && (
        <p className="mt-2 text-[13px] italic text-muted">{opcao.continua}</p>
      )}
    </div>
  );
}

function RetrospectivaScreen({
  decisions,
  caso,
  onRestart,
}: {
  decisions: Decision[];
  caso: CaseNarrativo;
  onRestart: () => void;
}) {
  return (
    <div className="pb-16">
      <Link
        href="/estudos-de-caso"
        className="mt-8 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
      >
        ← Estudos de Caso
      </Link>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Retrospectiva do caso
      </h1>
      <p className="mt-1 text-sm text-muted">{caso.titulo}</p>

      <div className="mt-8 space-y-4">
        {decisions.map((d, i) => {
          const s1 = ROTULO_STYLE[d.rotulo];
          const s2 = d.rotulo2 ? ROTULO_STYLE[d.rotulo2] : null;
          return (
            <div
              key={d.cpId}
              className="rounded-2xl border border-border-soft bg-surface-container-lowest p-5"
            >
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[13px] font-bold" style={{ color: "#1F3A5F" }}>
                  {i === 0 ? "Briefing" : `CP${i}`}
                </span>
                <span className="text-[13px] text-muted">· {d.titulo}</span>
                {d.modulos.map((m) => (
                  <span
                    key={m}
                    className="rounded-full px-2 py-0.5 text-[11px] font-extrabold text-white"
                    style={{ backgroundColor: MOD_CORES[m] }}
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span
                    className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
                    style={{
                      backgroundColor: s1.bg,
                      color: s1.color,
                      border: `1px solid ${s1.border}`,
                    }}
                  >
                    {s1.label}
                  </span>
                  <p className="text-[14px] text-ink">
                    <span className="font-bold">{d.opcaoId}.</span> {d.opcaoTexto}
                  </p>
                </div>
                {s2 && d.opcaoId2 && d.opcaoTexto2 && (
                  <div className="flex items-start gap-2">
                    <span
                      className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
                      style={{
                        backgroundColor: s2.bg,
                        color: s2.color,
                        border: `1px solid ${s2.border}`,
                      }}
                    >
                      {s2.label}
                    </span>
                    <p className="text-[14px] text-ink">
                      <span className="font-bold">{d.opcaoId2}.</span> {d.opcaoTexto2}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Closing quote */}
      <blockquote
        className="mt-10 rounded-r-xl border-l-4 p-6 text-[16px] italic leading-relaxed text-ink"
        style={{ borderLeftColor: "#1F3A5F", backgroundColor: "#E8EDF3" }}
      >
        "Gestão de tesouraria é esta escolha — medir o valor e o resultado, ancorar
        no passivo, e repetir com disciplina. O cenário você não controla; o processo,
        sim."
      </blockquote>

      <button
        onClick={onRestart}
        className="mt-8 rounded-xl border-2 px-6 py-2.5 text-sm font-bold transition-colors hover:bg-surface-container"
        style={{ borderColor: "#1F3A5F", color: "#1F3A5F" }}
      >
        Recomeçar o caso
      </button>
    </div>
  );
}
