"use client";

import { FORWARDS_CLASSICOS } from "@/lib/mercado/config";
import { forwardClassico } from "@/lib/mercado/metricas";
import { pct } from "@/lib/mercado/template";
import type { Curva } from "@/lib/mercado/types";

/**
 * Forwards clássicos interpolados sobre a curva selecionada. Cada cartão
 * mostra a taxa e, abaixo, os dois spots que a produziram — o aluno tem que
 * ver de onde o número veio.
 *
 * Só faz sentido em curvas de taxa na convenção DU/252: o cupom cambial é
 * linear em base 360 e a fórmula exponencial não se aplica a ele.
 */
export function CartoesForward({ curva }: { curva: Curva }) {
  if (curva.unidade !== "taxa" || curva.convencao !== "du252") return null;

  const cartoes = FORWARDS_CLASSICOS.map((f) => ({
    ...f,
    r: forwardClassico(curva, f.de, f.ate),
  })).filter((c) => c.r !== null);

  if (!cartoes.length) return null;

  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
        Forwards clássicos · interpolação flat forward em DU/252
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cartoes.map((c) => (
          <div
            key={c.rotulo}
            className="rounded-xl border border-border-soft bg-surface-container-lowest p-3"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-[12px] font-bold text-secondary">{c.rotulo}</span>
              <span className="text-[16px] font-bold tabular-nums text-ink">
                {pct(c.r!.taxa, 2)}
              </span>
            </div>
            <div className="mt-1.5 text-[11.5px] leading-snug text-muted">
              spot {c.de}a ({c.r!.du1} du) = {pct(c.r!.spot1, 2)}
              <br />
              spot {c.ate}a ({c.r!.du2} du) = {pct(c.r!.spot2, 2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
