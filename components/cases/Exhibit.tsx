import type { Exhibit as ExhibitData } from "@/lib/types";

export function Exhibit({ exhibit }: { exhibit: ExhibitData }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border-soft bg-surface-container-lowest shadow-sm">
      <h3 className="bg-tertiary-fixed px-5 py-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-on-tertiary-fixed">
        {exhibit.titulo}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-[13.5px]">
          <thead>
            <tr className="bg-surface-container-low">
              {exhibit.colunas.map((coluna) => (
                <th
                  key={coluna}
                  className="border-b border-border-soft px-5 py-3 text-left text-[12px] font-bold text-ink"
                >
                  {coluna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exhibit.linhas.map((linha, index) => (
              <tr key={index} className="even:bg-surface-container-low/50">
                {linha.map((celula, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border-b border-border-soft px-5 py-3 text-muted last:border-b"
                  >
                    {celula}
                  </td>
                ))}
              </tr>
            ))}
            {exhibit.totalRow && (
              <tr className="bg-tertiary-fixed font-extrabold text-on-tertiary-fixed">
                {exhibit.totalRow.map((celula, index) => (
                  <td key={index} className="px-5 py-3">
                    {celula}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {exhibit.nota && (
        <div
          className="rich border-t border-border-soft px-5 py-3 text-[12.5px] text-muted"
          dangerouslySetInnerHTML={{ __html: exhibit.nota }}
        />
      )}
    </section>
  );
}
