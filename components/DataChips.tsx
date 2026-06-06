import type { Chip } from "@/lib/types";

export function DataChips({ chips }: { chips: Chip[] }) {
  return (
    <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
      {chips.map((c, i) => (
        <div
          key={i}
          className="rounded-xl border border-secondary-fixed-dim/60 bg-secondary-container/40 px-3 py-2.5"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted">{c.k}</div>
          <div className="mt-0.5 text-[15px] font-bold text-on-secondary-container">{c.v}</div>
        </div>
      ))}
    </div>
  );
}
