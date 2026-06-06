import type { Branch } from "@/lib/types";

const toneClass: Record<string, string> = {
  pos: "text-secondary",
  neg: "text-error",
  neu: "text-ink",
};

export function Resultado({ branch }: { branch: Branch }) {
  const r = branch.resultado;
  return (
    <div className="my-3 rounded-2xl border border-border-soft bg-surface-container-lowest p-5 shadow-sm">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        Resultado · Caminho {branch.id}
      </div>
      <div className="mb-3 mt-1 text-base font-bold text-ink">{r.titulo}</div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
        {r.deltas.map((d, i) => (
          <div key={i} className="rounded-xl border border-border-soft px-3 py-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">{d.k}</div>
            <div className={`mt-0.5 text-[14.5px] font-bold ${toneClass[d.tone]}`}>{d.v}</div>
          </div>
        ))}
      </div>

      <div
        className={[
          "rich mt-3 rounded-xl border px-4 py-3 text-[13.5px] leading-relaxed",
          r.risco
            ? "border-error/30 bg-error/5 text-error"
            : "border-tertiary-fixed bg-tertiary-container/10 text-ink",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: r.analise }}
      />
    </div>
  );
}
