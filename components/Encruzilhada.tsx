"use client";

import { useState } from "react";
import type { Branch } from "@/lib/types";
import { Resultado } from "./Resultado";
import { Icon } from "./Icon";

export function Encruzilhada({
  titulo,
  subtitulo,
  ramos,
  onComplete,
}: {
  titulo: string;
  subtitulo: string;
  ramos: Branch[];
  onComplete: (branchId: string) => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  const chosenBranch = ramos.find((r) => r.id === chosen) ?? null;

  return (
    <div className="my-6">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Encruzilhada</div>
      <h3 className="mt-1 text-xl font-extrabold text-ink">{titulo}</h3>
      <p className="mb-3 text-[13.5px] text-muted">{subtitulo}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ramos.map((r) => {
          const active = r.id === chosen;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setChosen(r.id)}
              className={[
                "rounded-2xl border bg-surface-container-lowest p-4 text-left transition-colors",
                active
                  ? "border-primary ring-1 ring-primary"
                  : "border-border-soft hover:border-primary/40",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[13px] font-bold text-on-primary">
                  {r.id}
                </span>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted">
                  {r.rotulo}
                </span>
              </div>
              <h4 className="mt-2.5 text-[15px] font-bold text-ink">{r.titulo}</h4>
              <p className="mt-1 text-[13px] text-muted">{r.resumo}</p>
            </button>
          );
        })}
      </div>

      {chosenBranch && (
        <>
          <Resultado branch={chosenBranch} />
          <button
            type="button"
            onClick={() => onComplete(chosenBranch.id)}
            className="mt-2 flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-95"
          >
            Ir para a reflexão
            <Icon name="arrow_forward" size={18} />
          </button>
        </>
      )}
    </div>
  );
}
