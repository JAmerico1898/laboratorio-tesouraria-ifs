import Link from "next/link";
import { getModule } from "@/lib/modules";
import { modulo1Scenarios } from "@/data/modulo-1";
import { ScenarioCard } from "@/components/ScenarioCard";
import { Icon } from "@/components/Icon";

export default function Modulo1Page() {
  const mod = getModule("modulo-1")!;

  return (
    <div className="pb-10">
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
      >
        <Icon name="arrow_back" size={16} /> Início
      </Link>

      <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
        Módulo {mod.numero}
      </div>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {mod.titulo}
      </h1>

      {/* Objetivos */}
      <div className="mt-8 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        Objetivos de aprendizagem
      </div>
      <ul className="mt-3 space-y-2">
        {mod.objetivos.map((o, i) => (
          <li key={i} className="flex gap-2.5 text-[14.5px] text-muted">
            <Icon name="check_circle" size={18} className="mt-0.5 shrink-0 text-secondary" />
            <span>{o}</span>
          </li>
        ))}
      </ul>

      {/* Cenários */}
      <div className="mt-10 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        Cenários
      </div>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {modulo1Scenarios.map((s) => (
          <ScenarioCard key={s.id} scenario={s} moduleSlug="modulo-1" />
        ))}
      </div>
    </div>
  );
}
