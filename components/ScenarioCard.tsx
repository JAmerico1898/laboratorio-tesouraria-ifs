import Link from "next/link";
import type { Scenario } from "@/lib/types";
import { DifficultyBadge } from "./DifficultyBadge";
import { Icon } from "./Icon";

export function ScenarioCard({ scenario, moduleSlug }: { scenario: Scenario; moduleSlug: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border-soft bg-surface-container-lowest p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <DifficultyBadge level={scenario.nivel} />
        <span className="font-mono text-[12px] font-semibold text-secondary">{scenario.codigo}</span>
        <span className="ml-auto text-[11px] font-semibold uppercase tracking-wide text-muted">
          ~{scenario.duracaoMin} min
        </span>
      </div>

      <h3 className="mt-3 text-[17px] font-bold text-ink">{scenario.titulo}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{scenario.empresa}</p>

      <Link
        href={`/${moduleSlug}/${scenario.id}`}
        className="mt-6 flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-95"
      >
        Iniciar cenário
        <Icon name="arrow_forward" size={18} />
      </Link>
    </div>
  );
}
