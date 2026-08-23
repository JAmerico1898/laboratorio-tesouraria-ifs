"use client";

import type { MercadoSnapshot } from "@/lib/mercado/types";
import type { Pauta } from "@/lib/types";

/**
 * Painel de resultado da pauta (§5.3): a posição escolhida com suas
 * consequências nos dois estados de mundo, e o contrafactual numérico das
 * outras duas — "e se você tivesse escolhido a posição X?", calculado do
 * mesmo snapshot que alimenta o gráfico ao lado.
 */
export function ResolucaoPanel({
  pauta,
  snap,
  escolhida,
}: {
  pauta: Pauta;
  snap: MercadoSnapshot;
  escolhida: string;
}) {
  return (
    <div className="mt-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        Consequências e contrafactuais
      </div>
      <div className="mt-2 space-y-2.5">
        {pauta.posicoes.map((p) => {
          const sua = p.id === escolhida;
          let contra: string;
          try {
            contra = p.contrafactual(snap);
          } catch {
            contra = "contrafactual indisponível para este snapshot";
          }
          return (
            <div
              key={p.id}
              className={`rounded-xl border p-3.5 ${
                sua ? "border-primary bg-surface-container-high" : "border-border-soft"
              }`}
            >
              <div className="text-[13px] font-bold text-ink">
                {p.id}: {p.rotulo}
                {sua ? (
                  <span className="ml-2 text-[11px] text-secondary">sua escolha</span>
                ) : (
                  <span className="ml-2 text-[11px] font-normal text-muted">
                    e se você tivesse escolhido esta?
                  </span>
                )}
              </div>
              <ul className="mt-1.5 space-y-1">
                {p.consequencias.map((c) => (
                  <li key={c.estado} className="text-[12.5px] leading-relaxed text-muted">
                    <b className="text-ink">{c.estado}:</b> {c.efeito}
                  </li>
                ))}
              </ul>
              <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-secondary">
                {contra}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
