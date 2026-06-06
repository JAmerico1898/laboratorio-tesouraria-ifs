import type { Pergunta } from "@/lib/types";

export function GuidingQuestion({ pergunta }: { pergunta: Pergunta }) {
  return (
    <article className="overflow-hidden rounded-xl border border-border-soft bg-surface-container-lowest">
      <div
        className="rich px-5 py-4 text-[14.5px] font-semibold text-ink"
        dangerouslySetInnerHTML={{ __html: pergunta.enunciado }}
      />
      <details className="group border-t border-border-soft">
        <summary className="cursor-pointer list-none bg-surface-container-low px-5 py-3 text-[12.5px] font-bold text-secondary">
          Ver linha de resolução
        </summary>
        <div
          className="rich border-t border-border-soft bg-tertiary-fixed/35 px-5 py-4 text-sm text-muted"
          dangerouslySetInnerHTML={{ __html: pergunta.resolucao }}
        />
      </details>
    </article>
  );
}
