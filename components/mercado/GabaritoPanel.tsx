"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { baixarGabaritoPdf } from "@/lib/gabarito-pdf";
import type { MercadoSnapshot } from "@/lib/mercado/types";
import type { Pauta } from "@/lib/types";

/**
 * Gabarito comentado. Só existe depois da escolha na Resolução — antes disso
 * entregaria a leitura do curso de todas as etapas anteriores — e o corpo é
 * montado apenas quando o bloco é aberto, para não deixar o gabarito no DOM
 * de quem não pediu.
 */
export function GabaritoPanel({
  pauta,
  snap,
  liberado,
  onVoltarEtapa,
  onVoltarPautas,
}: {
  pauta: Pauta;
  snap: MercadoSnapshot;
  liberado: boolean;
  onVoltarEtapa: () => void;
  onVoltarPautas: () => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [baixando, setBaixando] = useState(false);

  if (!liberado) return null;

  const memoria = (fn: (s: MercadoSnapshot) => string) => {
    try {
      return fn(snap);
    } catch {
      return "memória de cálculo indisponível para este snapshot";
    }
  };

  return (
    <details
      className="mt-6 rounded-2xl border border-border-soft bg-surface-container-lowest"
      onToggle={(e) => setAberto((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer list-none px-5 py-4 text-[14px] font-bold text-ink">
        <span className="inline-flex items-center gap-2">
          <Icon name="menu_book" size={18} className="text-secondary" />
          Gabarito comentado — {pauta.codigo}
        </span>
      </summary>

      {aberto && (
        <div className="border-t border-border-soft px-5 py-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Síntese</h3>
          <p
            className="mt-2 text-[14px] leading-relaxed text-ink"
            dangerouslySetInnerHTML={{ __html: pauta.gabarito.sintese }}
          />

          <h3 className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Resolução etapa a etapa
          </h3>
          <ol className="mt-2 space-y-4">
            {pauta.gabarito.notas.map((n) => {
              const etapa = pauta.etapas.find((e) => e.id === n.etapaId);
              return (
                <li key={n.etapaId} className="rounded-xl bg-surface-container-high p-3.5">
                  <div className="text-[13px] font-bold text-ink">{etapa?.titulo ?? n.etapaId}</div>
                  <p
                    className="mt-1.5 text-[13.5px] leading-relaxed text-ink"
                    dangerouslySetInnerHTML={{ __html: `<b>Leitura do curso:</b> ${n.answer}` }}
                  />
                  <p
                    className="mt-1 text-[13.5px] leading-relaxed text-muted"
                    dangerouslySetInnerHTML={{ __html: `<b>Por quê:</b> ${n.rationale}` }}
                  />
                  <p className="mt-1.5 font-mono text-[12.5px] leading-relaxed text-secondary">
                    {memoria(n.math)}
                  </p>
                </li>
              );
            })}
          </ol>

          <h3 className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Glossário
          </h3>
          <dl className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {pauta.gabarito.glossario.map((g) => (
              <div key={g.termo} className="text-[13px] leading-relaxed">
                <dt className="inline font-bold text-ink">{g.termo}</dt>
                <dd className="inline text-muted"> — {g.definicao}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border-soft pt-4">
            <button
              type="button"
              disabled={baixando}
              onClick={async () => {
                setBaixando(true);
                try {
                  await baixarGabaritoPdf(pauta, snap);
                } finally {
                  setBaixando(false);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-bold text-on-primary disabled:opacity-60"
            >
              <Icon name="download" size={16} />
              {baixando ? "Gerando…" : "Baixar gabarito (PDF)"}
            </button>
            <button
              type="button"
              onClick={onVoltarEtapa}
              className="text-[13px] font-semibold text-muted hover:text-ink"
            >
              ← Voltar à etapa anterior
            </button>
            <button
              type="button"
              onClick={onVoltarPautas}
              className="text-[13px] font-semibold text-muted hover:text-ink"
            >
              ← Voltar às pautas
            </button>
          </div>
        </div>
      )}
    </details>
  );
}
