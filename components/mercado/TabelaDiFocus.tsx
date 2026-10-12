"use client";

import type { LinhaDiFocus } from "@/lib/mercado/ancoras";
import { pct } from "@/lib/mercado/template";

/** Pontos-base com sinal e sem casas: "−27", "+18", "0". */
export function bpsSinal(v: number | null | undefined): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  const r = Math.round(v);
  return `${r > 0 ? "+" : r < 0 ? "−" : ""}${Math.abs(r)}`;
}

/** DI × CDI esperado pelo Focus, com a leitura de cada vencimento. */
export function TabelaDiFocus({ linhas }: { linhas: LinhaDiFocus[] }) {
  const th = "px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted";
  const td = "px-3 py-1.5 text-[13px] text-ink tabular-nums";

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border-soft">
        <table className="w-full min-w-[520px] border-collapse">
          <caption className="sr-only">DI contra o CDI esperado pelo Focus</caption>
          <thead className="bg-surface-container-high">
            <tr>
              <th scope="col" className={th}>Vencimento</th>
              <th scope="col" className={`${th} text-right`}>DI (tela)</th>
              <th scope="col" className={`${th} text-right`}>CDI esperado (Focus)</th>
              <th scope="col" className={`${th} text-right`}>DI − Focus</th>
              <th scope="col" className={th}>Leitura</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.rotulo} className="border-t border-border-soft">
                <td className={`${td} font-semibold`}>
                  {l.rotulo}
                  {l.estimada && "*"}
                </td>
                <td className={`${td} text-right`}>{pct(l.di, 2)}</td>
                <td className={`${td} text-right`}>{pct(l.focus, 2)}</td>
                <td className={`${td} text-right`}>
                  {l.difBps === null ? "—" : `${bpsSinal(l.difBps)} bps`}
                </td>
                <td className={td}>{l.leitura ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {linhas.some((l) => l.estimada) && (
        <p className="mt-1.5 text-[11.5px] text-muted">
          * inclui reuniões do Copom com data ainda não oficial.
        </p>
      )}
      <details className="mt-2 text-[12.5px] leading-relaxed text-muted">
        <summary className="cursor-pointer font-semibold text-secondary">Como calculamos</summary>
        <ul className="mt-1.5 list-disc space-y-1 pl-5">
          <li>
            <b>CDI esperado (Focus):</b> a Selic que o Focus projeta para cada reunião do Copom,
            menos o spread Selic − DI over do dia, acumulada dia útil a dia útil até o vencimento
            e convertida em taxa ao ano (base 252).
          </li>
          <li>
            <b>Selic implícita:</b> o CDI a termo entre dois contratos de DI vizinhos de cada
            reunião, mais o mesmo spread.
          </li>
          <li>
            <b>Leitura:</b> diferença menor que −10 bps, mercado mais dovish que o Focus; maior
            que +10 bps, curva acima do Focus (nos prazos longos, isso é prêmio, não expectativa).
          </li>
          <li>
            <b>Juro real ex-ante:</b> DI de 1 ano (252 dias úteis) descontado do IPCA 12 meses do
            Focus. <b>Neutro nominal:</b> (1 + neutro real) × (1 + meta) − 1.
          </li>
        </ul>
      </details>
    </>
  );
}
