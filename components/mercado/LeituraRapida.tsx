"use client";

import { leituraRapida } from "@/lib/mercado/metricas";
import { num, pct } from "@/lib/mercado/template";
import type { Curva } from "@/lib/mercado/types";

function Cartao({ titulo, valor, nota }: { titulo: string; valor: string; nota?: string }) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface-container-lowest p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted">{titulo}</div>
      <div className="mt-1 text-[15px] font-bold tabular-nums text-ink">{valor}</div>
      {nota && <div className="mt-0.5 text-[11.5px] leading-snug text-muted">{nota}</div>}
    </div>
  );
}

export function LeituraRapida({ curva }: { curva: Curva }) {
  const l = leituraRapida(curva);
  if (!l) return null;

  const fmt = (v: number | null) => (curva.unidade === "bps" ? `${num(v)} bps` : pct(v, 2));

  const trechos = l.inversoes
    .slice(0, 3)
    .map((i) => `${i.de.rotulo}→${i.para.rotulo}`)
    .join(", ");

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Cartao
        titulo="Nível"
        valor={`${fmt(l.curta.taxa)} → ${fmt(l.longa.taxa)}`}
        nota={`${l.curta.rotulo} (${l.duMin} du) a ${l.longa.rotulo} (${l.duMax} du)`}
      />
      <Cartao
        titulo="Inclinação"
        valor={`${l.inclinacaoBps >= 0 ? "+" : ""}${num(l.inclinacaoBps, 1)} bps`}
        nota={l.formato}
      />
      <Cartao
        titulo="Inversões"
        valor={String(l.inversoes.length)}
        nota={
          l.inversoes.length
            ? `${trechos}${l.inversoes.length > 3 ? ` e mais ${l.inversoes.length - 3}` : ""}`
            : "nenhum trecho descendente"
        }
      />
      <Cartao
        titulo="Vértices"
        valor={String(l.nVertices)}
        nota={`${l.duMin} a ${l.duMax} dias úteis`}
      />
    </div>
  );
}
