import type { Chip } from "@/lib/types";
import { DataChips } from "./DataChips";

export function ContextCard({ contexto, chips }: { contexto: string; chips: Chip[] }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-surface-container-lowest p-5 shadow-sm sm:p-6">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-secondary">
        Contexto
      </div>
      <div
        className="rich text-[15px] leading-relaxed text-muted"
        dangerouslySetInnerHTML={{ __html: contexto }}
      />
      <DataChips chips={chips} />
    </div>
  );
}
