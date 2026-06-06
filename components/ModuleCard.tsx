import Link from "next/link";
import type { ModuleMeta } from "@/lib/types";
import { Icon } from "./Icon";

export function ModuleCard({ mod }: { mod: ModuleMeta }) {
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary-container/50 text-secondary">
          <Icon name={mod.icon} size={22} />
        </div>
        {!mod.disponivel && (
          <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted">
            Em breve
          </span>
        )}
      </div>

      <h3 className="mt-4 text-[17px] font-bold text-ink">{mod.titulo}</h3>
      <p className="mt-1.5 line-clamp-3 text-[13.5px] leading-relaxed text-muted">{mod.descricao}</p>

      <div className="mt-5 flex items-center justify-between border-t border-border-soft pt-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Progresso</span>
        <span className="text-[12px] font-bold text-ink">
          0/{mod.totalSimulacoes} concluídos
        </span>
      </div>
    </>
  );

  const base =
    "block rounded-2xl border border-border-soft bg-surface-container-lowest p-5 shadow-sm transition-all";

  if (mod.disponivel) {
    return (
      <Link href={`/${mod.slug}`} className={`${base} hover:-translate-y-0.5 hover:shadow-lg`}>
        {inner}
      </Link>
    );
  }
  return <div className={`${base} opacity-70`}>{inner}</div>;
}
