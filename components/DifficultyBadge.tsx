import type { Level } from "@/lib/types";

export function DifficultyBadge({ level }: { level: Level }) {
  if (level === "sup") {
    return (
      <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold tracking-wide bg-tertiary-container text-tertiary-fixed">
        SUPER DESAFIO
      </span>
    );
  }
  if (level === "adv") {
    return (
      <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold tracking-wide bg-primary text-on-primary">
        AVANÇADO
      </span>
    );
  }
  return (
    <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold tracking-wide bg-accent-soft text-primary">
      INTERMEDIÁRIO
    </span>
  );
}
