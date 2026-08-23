"use client";

import { dataBr, num, pct } from "@/lib/mercado/template";
import type { MercadoSnapshot } from "@/lib/mercado/types";

/** Cartões de contexto do dia: taxas de referência e VNAs. */
export function Indicadores({ s }: { s: MercadoSnapshot }) {
  const i = s.indicadores;
  const itens: [string, string][] = [
    ["Selic meta", pct(i.selicMeta, 2)],
    ["DI over", pct(i.diOver, 2)],
    ["PTAX", num(i.ptax, 4)],
    ["VNA LFT", num(i.vnaLft, 6)],
    ["VNA NTN-B publicado", `${num(i.vnaNtnb, 6)} (${dataBr(i.vnaNtnbData)})`],
    ["VNA NTN-B projetado", num(i.vnaNtnbProjetado, 6)],
    ["IPCA projetado (mês)", pct(i.ipcaProjetado, 2)],
  ];
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {itens.map(([k, v]) => (
        <div key={k}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted">{k}</div>
          <div className="text-[13.5px] font-semibold tabular-nums text-ink">{v}</div>
        </div>
      ))}
    </div>
  );
}
