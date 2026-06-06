export function ProgressSegments({
  total,
  current,
}: {
  total: number;
  /** índice da etapa ativa (0-based); etapas com índice menor ficam "done" */
  current: number;
}) {
  return (
    <div className="my-4 flex gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const on = i === current;
        return (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              done ? "bg-primary" : on ? "bg-secondary" : "bg-surface-container-highest"
            }`}
          />
        );
      })}
    </div>
  );
}
