"use client";

import { useRef } from "react";
import { Icon } from "@/components/Icon";
import { FAMILIAS } from "@/lib/mercado/config";
import { GLOSSARIO } from "@/lib/mercado/glossario";
import type { Familia } from "@/lib/mercado/types";

/** Botão que abre o glossário das curvas, rolado até a família da aba ativa. */
export function Glossario({ familia }: { familia: Familia }) {
  const ref = useRef<HTMLDialogElement>(null);

  function abrir() {
    ref.current?.showModal();
    ref.current?.querySelector(`#glossario-${familia}`)?.scrollIntoView({ block: "start" });
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border-soft px-3 py-1.5 text-[12px] font-semibold text-muted hover:text-ink"
      >
        <Icon name="menu_book" size={16} /> Glossário
      </button>

      <dialog
        ref={ref}
        aria-label="Glossário do Painel de Mercado"
        onClick={(e) => e.target === ref.current && ref.current.close()}
        className="m-auto max-h-[85vh] w-[min(720px,calc(100vw-32px))] rounded-2xl border border-border-soft bg-surface-container-lowest p-0 text-ink shadow-2xl backdrop:bg-black/40"
      >
        <div className="sticky top-0 flex items-center gap-3 border-b border-border-soft bg-surface-container-lowest px-5 py-3">
          <h2 className="text-[15px] font-extrabold tracking-tight">Glossário do Painel de Mercado</h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Fechar glossário"
            className="ml-auto rounded-lg p-1 text-muted hover:text-ink"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="space-y-6 px-5 py-4">
          {GLOSSARIO.map((g) => {
            const aba = FAMILIAS.find((f) => f.id === g.familia)!;
            return (
              <section key={g.familia} id={`glossario-${g.familia}`} className="scroll-mt-16">
                <h3 className="flex items-center gap-1.5 text-[14px] font-extrabold text-primary">
                  <Icon name={aba.icon} size={18} /> {aba.rotulo}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{g.descricao}</p>
                <dl className="mt-3 space-y-3">
                  {g.curvas.map((c) => (
                    <div key={c.id}>
                      <dt className="text-[13.5px] font-bold">{c.nome}</dt>
                      <dd className="mt-0.5 text-[13px] leading-relaxed text-ink">{c.texto}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      </dialog>
    </>
  );
}
