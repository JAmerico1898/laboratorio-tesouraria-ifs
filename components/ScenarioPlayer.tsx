"use client";

import { useState } from "react";
import Link from "next/link";
import type { Scenario } from "@/lib/types";
import { ScorePill } from "./ScorePill";
import { ProgressSegments } from "./ProgressSegments";
import { DifficultyBadge } from "./DifficultyBadge";
import { ContextCard } from "./ContextCard";
import { CollapsibleData } from "./CollapsibleData";
import { EtapaQuestion } from "./EtapaQuestion";
import { Encruzilhada } from "./Encruzilhada";
import { Icon } from "./Icon";

type Step = "contexto" | "etapas" | "encruzilhada" | "reflexao" | "conclusao";

export function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const [step, setStep] = useState<Step>("contexto");
  const [etapaIdx, setEtapaIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [branch, setBranch] = useState<string | null>(null);

  const segCurrent =
    step === "contexto" ? 0 : step === "etapas" ? etapaIdx : scenario.etapas.length;

  function reset() {
    setStep("contexto");
    setEtapaIdx(0);
    setScore(0);
    setBranch(null);
  }

  function completeEtapa(pontos: number) {
    setScore((s) => s + pontos);
    if (etapaIdx < scenario.etapas.length - 1) {
      setEtapaIdx((i) => i + 1);
    } else {
      setStep("encruzilhada");
    }
  }

  const chosenBranch = scenario.encruzilhada.ramos.find((r) => r.id === branch);
  const showContext = step !== "conclusao";

  return (
    <div>
      <ScorePill score={score} max={scenario.pontuacaoMax} />

      <div className="mt-1 text-[13px] font-semibold text-muted">
        {scenario.codigo} · {scenario.empresa} · <DifficultyBadge level={scenario.nivel} />
      </div>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">{scenario.titulo}</h1>

      <ProgressSegments total={scenario.etapas.length} current={segCurrent} />

      {showContext && (
        <>
          <ContextCard contexto={scenario.contexto} chips={scenario.chips} />
          {scenario.dadosMercado && (
            <CollapsibleData
              titulo={scenario.dadosMercado.titulo}
              corpo={scenario.dadosMercado.corpo}
            />
          )}
        </>
      )}

      {step === "contexto" && (
        <button
          type="button"
          onClick={() => setStep("etapas")}
          className="mt-4 flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-95"
        >
          Começar
          <Icon name="arrow_forward" size={18} />
        </button>
      )}

      {step === "etapas" && (
        <EtapaQuestion
          key={scenario.etapas[etapaIdx].id}
          kicker={`Etapa ${etapaIdx + 1} —`}
          enunciado={scenario.etapas[etapaIdx].enunciado}
          opcoes={scenario.etapas[etapaIdx].opcoes}
          feedback={scenario.etapas[etapaIdx].feedback}
          pontos={scenario.etapas[etapaIdx].pontos}
          continueLabel={etapaIdx < scenario.etapas.length - 1 ? "Próxima etapa" : "Ir para a decisão"}
          onComplete={completeEtapa}
        />
      )}

      {step === "encruzilhada" && (
        <Encruzilhada
          titulo={scenario.encruzilhada.titulo}
          subtitulo={scenario.encruzilhada.subtitulo}
          ramos={scenario.encruzilhada.ramos}
          onComplete={(b) => {
            setBranch(b);
            setStep("reflexao");
          }}
        />
      )}

      {step === "reflexao" && (
        <EtapaQuestion
          kicker="Reflexão —"
          enunciado={scenario.reflexao.enunciado}
          opcoes={scenario.reflexao.opcoes}
          feedback={scenario.reflexao.feedback}
          pontos={scenario.reflexao.pontos}
          continueLabel="Ver resultado final"
          onComplete={(pontos) => {
            setScore((s) => s + pontos);
            setStep("conclusao");
          }}
        />
      )}

      {step === "conclusao" && (
        <div className="mt-4 rounded-2xl border border-border-soft bg-surface-container-lowest p-8 text-center shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Cenário concluído
          </div>
          <div className="my-1.5 text-5xl font-extrabold tracking-tight text-ink">
            {score} <span className="text-muted">/ {scenario.pontuacaoMax}</span>
          </div>
          {chosenBranch && (
            <p className="text-[14px] text-muted">
              Decisão escolhida:{" "}
              <span className="font-bold text-ink">
                Caminho {chosenBranch.id} — {chosenBranch.rotulo}
              </span>
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer rounded-xl border border-border-soft bg-surface-container-lowest px-6 py-3 text-sm font-bold text-ink transition-colors hover:bg-surface-container-low active:scale-95"
            >
              Tentar outro cenário
            </button>
            <Link
              href="/modulo-1"
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-95"
            >
              Finalizar e voltar
              <Icon name="arrow_forward" size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
