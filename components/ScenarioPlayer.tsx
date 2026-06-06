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

export function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  // Sequência linear de fases (cursor = posição atual)
  const phases = [
    "contexto",
    ...scenario.etapas.map((_, i) => `etapa-${i}`),
    "encruzilhada",
    "reflexao",
    "conclusao",
  ];
  const [cursor, setCursor] = useState(0);
  const [earned, setEarned] = useState<Record<string, number>>({});
  const [branch, setBranch] = useState<string | null>(null);

  const phase = phases[cursor];
  const score = Object.values(earned).reduce((a, b) => a + b, 0);

  // índice da etapa ativa (para barra de segmentos)
  const etapaIdx = phase.startsWith("etapa-") ? Number(phase.split("-")[1]) : -1;
  const segCurrent =
    phase === "contexto" ? 0 : etapaIdx >= 0 ? etapaIdx : scenario.etapas.length;

  function advance() {
    setCursor((c) => Math.min(phases.length - 1, c + 1));
  }

  function goBack() {
    setCursor((c) => {
      const nc = Math.max(0, c - 1);
      // ao voltar, zera a pontuação da fase de destino em diante (será refeita)
      setEarned((prev) => {
        const copy = { ...prev };
        phases.slice(nc).forEach((p) => delete copy[p]);
        return copy;
      });
      return nc;
    });
  }

  function reset() {
    setCursor(0);
    setEarned({});
    setBranch(null);
  }

  function completeEtapa(idx: number, pontos: number) {
    setEarned((prev) => ({ ...prev, [`etapa-${idx}`]: pontos }));
    advance();
  }

  const chosenBranch = scenario.encruzilhada.ramos.find((r) => r.id === branch);
  const showContext = phase !== "conclusao";

  return (
    <div>
      {/* Navegação superior: Início + Etapa anterior */}
      <div className="mb-5 flex items-center gap-4 text-[13px] font-semibold">
        <Link href="/" className="inline-flex items-center gap-1 text-muted hover:text-ink">
          <Icon name="arrow_back" size={16} /> Início
        </Link>
        {cursor > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex cursor-pointer items-center gap-1 text-muted hover:text-ink"
          >
            <Icon name="arrow_back" size={16} /> Etapa anterior
          </button>
        )}
      </div>

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

      {phase === "contexto" && (
        <button
          type="button"
          onClick={advance}
          className="mt-4 flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-95"
        >
          Começar
          <Icon name="arrow_forward" size={18} />
        </button>
      )}

      {etapaIdx >= 0 && (
        <EtapaQuestion
          key={scenario.etapas[etapaIdx].id}
          kicker={`Etapa ${etapaIdx + 1} —`}
          enunciado={scenario.etapas[etapaIdx].enunciado}
          opcoes={scenario.etapas[etapaIdx].opcoes}
          feedback={scenario.etapas[etapaIdx].feedback}
          pontos={scenario.etapas[etapaIdx].pontos}
          continueLabel={
            etapaIdx < scenario.etapas.length - 1 ? "Próxima etapa" : "Ir para a decisão"
          }
          onComplete={(pontos) => completeEtapa(etapaIdx, pontos)}
        />
      )}

      {phase === "encruzilhada" && (
        <Encruzilhada
          titulo={scenario.encruzilhada.titulo}
          subtitulo={scenario.encruzilhada.subtitulo}
          ramos={scenario.encruzilhada.ramos}
          onComplete={(b) => {
            setBranch(b);
            advance();
          }}
        />
      )}

      {phase === "reflexao" && (
        <EtapaQuestion
          key="reflexao"
          kicker="Reflexão —"
          enunciado={scenario.reflexao.enunciado}
          opcoes={scenario.reflexao.opcoes}
          feedback={scenario.reflexao.feedback}
          pontos={scenario.reflexao.pontos}
          continueLabel="Ver resultado final"
          onComplete={(pontos) => {
            setEarned((prev) => ({ ...prev, reflexao: pontos }));
            advance();
          }}
        />
      )}

      {phase === "conclusao" && (
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
