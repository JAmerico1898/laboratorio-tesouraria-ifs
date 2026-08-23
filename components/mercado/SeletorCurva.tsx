"use client";

import { FAMILIAS } from "@/lib/mercado/config";
import type { Curva, Familia } from "@/lib/mercado/types";
import { Icon } from "@/components/Icon";

export function SeletorCurva({
  curvas,
  familia,
  curvaId,
  comparacaoId,
  eixoData,
  onFamilia,
  onCurva,
  onComparacao,
  onEixo,
  onCsv,
}: {
  curvas: Curva[];
  familia: Familia;
  curvaId: string;
  comparacaoId: string;
  eixoData: boolean;
  onFamilia: (f: Familia) => void;
  onCurva: (id: string) => void;
  onComparacao: (id: string) => void;
  onEixo: (data: boolean) => void;
  onCsv: () => void;
}) {
  const daFamilia = curvas.filter((c) => c.familia === familia);
  const select =
    "rounded-lg border border-border-soft bg-surface-container-lowest px-3 py-2 text-[13.5px] text-ink";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Família de curva">
        {FAMILIAS.map((f) => {
          const on = f.id === familia;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onFamilia(f.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                on
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-muted hover:text-ink"
              }`}
            >
              <Icon name={f.icon} size={16} />
              {f.rotulo}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Curva</span>
          <select className={select} value={curvaId} onChange={(e) => onCurva(e.target.value)}>
            {daFamilia.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Comparar com
          </span>
          <select
            className={select}
            value={comparacaoId}
            onChange={(e) => onComparacao(e.target.value)}
          >
            <option value="">—</option>
            {daFamilia
              .filter((c) => c.id !== curvaId)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Eixo X</span>
          <button
            type="button"
            onClick={() => onEixo(!eixoData)}
            className="rounded-lg border border-border-soft bg-surface-container-lowest px-3 py-2 text-[13.5px] font-semibold text-ink hover:bg-surface-container-high"
          >
            {eixoData ? "Data de vencimento" : "Dias úteis"}
          </button>
        </label>

        <button
          type="button"
          onClick={onCsv}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border-soft px-3 py-2 text-[13px] font-semibold text-muted hover:text-ink"
        >
          <Icon name="download" size={16} /> Baixar CSV
        </button>
      </div>
    </div>
  );
}
