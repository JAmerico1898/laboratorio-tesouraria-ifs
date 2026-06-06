"use client";

import type { CaseStudy } from "@/lib/types";
import { Icon } from "@/components/Icon";

function escapeCsvCell(value: string | number) {
  const cell = String(value);
  return /[",\r\n]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell;
}

export function DownloadExhibitsButton({ caso }: { caso: CaseStudy }) {
  function download() {
    const csv = caso.exhibits
      .map((exhibit) =>
        [
          [exhibit.titulo],
          exhibit.colunas,
          ...exhibit.linhas,
          ...(exhibit.totalRow ? [exhibit.totalRow] : []),
        ]
          .map((row) => row.map(escapeCsvCell).join(","))
          .join("\r\n"),
      )
      .join("\r\n\r\n");
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${caso.id}-exhibits.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-tertiary-container px-6 py-3 text-sm font-bold text-tertiary-fixed transition-colors hover:bg-tertiary active:scale-95"
    >
      <Icon name="download" size={18} />
      Baixar exhibits (CSV)
    </button>
  );
}
