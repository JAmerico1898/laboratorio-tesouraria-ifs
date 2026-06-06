export function ScorePill({ score, max }: { score: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  return (
    <div className="flex items-center justify-end gap-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Pontuação</span>
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-[15px] font-bold">
        <span className="text-ink">{score}</span>{" "}
        <span className="text-muted font-semibold">/ {max}</span>
      </div>
    </div>
  );
}
