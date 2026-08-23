"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { dataBr, num, pct } from "@/lib/mercado/template";
import type { Curva } from "@/lib/mercado/types";

function valor(v: number | null | undefined, curva: Curva): string {
  if (v === null || v === undefined) return "—";
  return curva.unidade === "bps" ? num(v) : pct(v);
}

/**
 * Tabela completa de vértices. Recolhida por padrão: com 45 contratos de DI
 * ela domina a tela, e o gráfico mais os cartões de leitura rápida já contam a
 * história. Quem precisa do número exato abre.
 */
export function TabelaVertices({ curva }: { curva: Curva }) {
  const [aberta, setAberta] = useState(false);

  const temPu = curva.vertices.some((v) => v.pu !== null && v.pu !== undefined);
  const temDur = curva.vertices.some((v) => v.duration !== null && v.duration !== undefined);
  const temDv01 = curva.vertices.some((v) => v.dv01 !== null && v.dv01 !== undefined);
  const temNota = curva.vertices.some((v) => v.nota);

  const th = "px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted";
  const td = "px-3 py-1.5 text-[13px] text-ink tabular-nums";

  const n = curva.vertices.length;

  return (
    <div className="overflow-hidden rounded-xl border border-border-soft">
      <button
        type="button"
        onClick={() => setAberta((a) => !a)}
        aria-expanded={aberta}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-primary hover:bg-surface-container-high"
      >
        <span>
          Vértices da curva {curva.nome}
          <span className="ml-2 font-semibold normal-case tracking-normal text-muted">
            {n} {n === 1 ? "vértice" : "vértices"}
          </span>
        </span>
        <Icon name={aberta ? "remove" : "add"} className="shrink-0 text-muted" size={18} />
      </button>

      {aberta && (
        <div className="overflow-x-auto border-t border-border-soft">
          <table className="w-full min-w-[540px] border-collapse">
            <caption className="sr-only">Vértices da curva {curva.nome}</caption>
            <thead className="bg-surface-container-high">
              <tr>
                <th scope="col" className={th}>
                  Vértice
                </th>
                <th scope="col" className={th}>
                  Vencimento
                </th>
                <th scope="col" className={`${th} text-right`}>
                  Dias úteis
                </th>
                <th scope="col" className={`${th} text-right`}>
                  {curva.rotuloY}
                </th>
                {temPu && (
                  <th scope="col" className={`${th} text-right`}>
                    PU
                  </th>
                )}
                {temDur && (
                  <th scope="col" className={`${th} text-right`}>
                    Duration
                  </th>
                )}
                {temDv01 && (
                  <th scope="col" className={`${th} text-right`}>
                    DV01
                  </th>
                )}
                {temNota && (
                  <th scope="col" className={th}>
                    Nota
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {curva.vertices.map((v) => (
                <tr key={`${v.rotulo}-${v.diasUteis}`} className="border-t border-border-soft">
                  <td className={`${td} font-semibold`}>
                    {v.rotulo}
                    {v.nota && <span className="text-danger"> *</span>}
                  </td>
                  <td className={td}>{dataBr(v.vencimento)}</td>
                  <td className={`${td} text-right`}>{v.diasUteis}</td>
                  <td className={`${td} text-right`}>{valor(v.taxa, curva)}</td>
                  {temPu && <td className={`${td} text-right`}>{num(v.pu, 6)}</td>}
                  {temDur && <td className={`${td} text-right`}>{num(v.duration)}</td>}
                  {temDv01 && <td className={`${td} text-right`}>{num(v.dv01, 4)}</td>}
                  {temNota && <td className={`${td} text-[12px] text-muted`}>{v.nota ?? ""}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
