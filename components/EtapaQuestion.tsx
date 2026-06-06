"use client";

import { useState } from "react";
import type { Option } from "@/lib/types";
import { Icon } from "./Icon";

export function EtapaQuestion({
  kicker,
  enunciado,
  opcoes,
  feedback,
  pontos,
  continueLabel = "Continuar",
  onComplete,
}: {
  kicker: string; // "Etapa 1 —" | "Reflexão —"
  enunciado: string;
  opcoes: Option[];
  feedback: string;
  pontos: number;
  continueLabel?: string;
  onComplete: (pontos: number) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [correct, setCorrect] = useState(false);

  function choose(opt: Option) {
    if (correct) return;
    setSelected(opt.id);
    if (opt.correct) {
      setCorrect(true);
    } else {
      setWrong((w) => new Set(w).add(opt.id));
    }
  }

  return (
    <div className="my-5">
      <div className="mb-3 text-[15.5px] font-bold text-ink">
        <span className="font-extrabold text-secondary">{kicker} </span>
        <span className="rich font-bold" dangerouslySetInnerHTML={{ __html: enunciado }} />
        <span className="ml-2 inline-block rounded-full border border-secondary-fixed-dim/60 bg-secondary-container/40 px-2.5 py-0.5 align-middle text-[11px] font-bold text-on-secondary-container">
          {pontos} pts
        </span>
      </div>

      <div className="space-y-2">
        {opcoes.map((opt) => {
          const isCorrect = correct && opt.correct;
          const isWrong = wrong.has(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => choose(opt)}
              disabled={correct}
              className={[
                "relative w-full rounded-xl border px-4 py-3 text-left text-[14.5px] transition-colors",
                isCorrect
                  ? "border-tertiary-fixed bg-tertiary-container/10 text-ink"
                  : isWrong
                    ? "border-error/40 bg-error/5 text-muted"
                    : "border-border-soft bg-surface-container-lowest text-muted hover:border-primary/40",
                correct && !opt.correct ? "opacity-60" : "",
              ].join(" ")}
            >
              {opt.text}
              {isCorrect && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-tertiary-container px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-on-tertiary-fixed">
                  ✔ CORRETA
                </span>
              )}
              {isWrong && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-error">
                  <Icon name="close" size={18} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!correct && wrong.size > 0 && (
        <p className="mt-3 text-[13px] font-semibold text-error">
          Não é essa — reveja os dados e tente novamente.
        </p>
      )}

      {correct && (
        <>
          <div className="mt-4 rounded-xl border border-tertiary-fixed bg-tertiary-container/10 px-4 py-3.5 text-[14px] leading-relaxed text-ink">
            <span className="font-extrabold text-secondary">✓ Correto. </span>
            <span className="rich" dangerouslySetInnerHTML={{ __html: feedback }} />
          </div>
          <button
            type="button"
            onClick={() => onComplete(pontos)}
            className="mt-4 flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-95"
          >
            {continueLabel}
            <Icon name="arrow_forward" size={18} />
          </button>
        </>
      )}
    </div>
  );
}
