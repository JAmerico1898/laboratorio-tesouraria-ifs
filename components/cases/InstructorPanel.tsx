import type { RubricaItem } from "@/lib/types";

export function InstructorPanel({
  debrief,
  rubrica,
}: {
  debrief: string;
  rubrica: RubricaItem[];
}) {
  const total = rubrica.reduce((sum, item) => sum + item.pontos, 0);

  return (
    <details className="overflow-hidden rounded-2xl border border-border-soft bg-surface-container-lowest">
      <summary className="cursor-pointer list-none bg-tertiary-container px-5 py-4 text-[12.5px] font-extrabold uppercase tracking-[0.08em] text-tertiary-fixed">
        Proposta de Solução
      </summary>
      <div className="p-5">
        <div
          className="rich text-sm leading-relaxed text-muted"
          dangerouslySetInnerHTML={{ __html: debrief }}
        />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-[13.5px]">
            <thead>
              <tr>
                <th className="border-b border-border-soft px-3 py-2 text-left text-ink">Critério</th>
                <th className="border-b border-border-soft px-3 py-2 text-left text-ink">Descrição</th>
                <th className="border-b border-border-soft px-3 py-2 text-right text-ink">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {rubrica.map((item) => (
                <tr key={item.criterio}>
                  <td className="border-b border-border-soft px-3 py-2 text-muted">{item.criterio}</td>
                  <td className="border-b border-border-soft px-3 py-2 text-muted">{item.descricao}</td>
                  <td className="border-b border-border-soft px-3 py-2 text-right font-extrabold text-secondary">
                    {item.pontos}
                  </td>
                </tr>
              ))}
              <tr className="font-extrabold text-ink">
                <td className="px-3 py-2" colSpan={2}>
                  Total
                </td>
                <td className="px-3 py-2 text-right">{total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}
