"use client";

import { focusIpcaMedio, juroRealExAnte, neutroNominal } from "@/lib/mercado/ancoras";
import {
  BANDA_SUPERIOR,
  META_INFLACAO,
  NEUTRO_REAL,
  PRAZO_CURTO_DU,
  PRAZO_LONGO_DU,
} from "@/lib/mercado/config";
import { bps, forwardClassico, getCurva, maisProximo } from "@/lib/mercado/metricas";
import { num, pct } from "@/lib/mercado/template";
import type { MercadoSnapshot, Vertice } from "@/lib/mercado/types";
import { bpsSinal } from "./TabelaDiFocus";

export const BLOCO = "rounded-xl border border-border-soft bg-surface-container-lowest p-3";
export const ROTULO = "text-[10px] font-bold uppercase tracking-wider text-muted";
export const TH = `${ROTULO} pb-1 text-right`;
export const TD = "py-0.5 text-right text-[13px] tabular-nums text-ink";
const TH_LINHA = "py-0.5 text-left text-[13px] font-normal text-muted";

export function Linha({ k, v, nota }: { k: string; v: string; nota?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
      <span className="text-muted">{k}</span>
      <span className="font-semibold tabular-nums text-ink">{v}</span>
      {nota && <span className="text-[11.5px] tabular-nums text-muted">{nota}</span>}
    </div>
  );
}

/** Diferença em bps com sinal, ou "—" quando falta um dos lados. */
const dif = (a: number | null | undefined, b: number | null) =>
  a == null || b === null ? "—" : bpsSinal(bps(a - b));

/** Ponta longa, juro real e inflação implícita lidos contra as âncoras. */
export function LeiturasAncoras({ s }: { s: MercadoSnapshot }) {
  const f = s.ancoras?.focus ?? null;
  const ref = s.dataEfetiva ?? "";
  const di = getCurva(s, "di1")?.vertices ?? [];

  const neutro = neutroNominal(NEUTRO_REAL, META_INFLACAO);
  const diLongo = di
    .filter((v) => v.taxa !== null && v.rotulo[3] === "F")
    .reduce<Vertice | null>(
      (m, v) =>
        !m || Math.abs(v.diasUteis - PRAZO_LONGO_DU) < Math.abs(m.diasUteis - PRAZO_LONGO_DU) ? v : m,
      null,
    );
  const anoLongo = f ? Object.keys(f.selicAnual).sort().at(-1) : undefined;
  const selicLonga = f && anoLongo ? f.selicAnual[anoLongo] : null;

  const ntnb = maisProximo(s, "ntnb-tir", PRAZO_CURTO_DU);
  const zeroReal = getCurva(s, "ntnb-zero");
  const reais: [string, number | null | undefined][] = [
    ["Ex-ante 1 ano", juroRealExAnte(di, f?.ipca12m ?? null)],
    [ntnb?.rotulo ?? "NTN-B curta", ntnb?.taxa],
    ["Forward real 5a5a", zeroReal ? forwardClassico(zeroReal, 5, 10)?.taxa : null],
  ];

  const implicitas = [PRAZO_CURTO_DU, PRAZO_LONGO_DU]
    .map((du) => maisProximo(s, "be-ntnb-pre", du))
    .filter((v, i, vs): v is Vertice => !!v && vs.indexOf(v) === i);

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className={`${BLOCO} space-y-1`}>
        <div className={ROTULO}>Ponta longa · quanto é prêmio?</div>
        <Linha k={`DI ${diLongo?.rotulo.slice(3) ?? "longo"}`} v={pct(diLongo?.taxa, 2)} />
        <Linha k="− Neutro nominal" v={pct(neutro, 2)} />
        <Linha
          k="= Prêmio de prazo + fiscal"
          v={diLongo?.taxa == null ? "—" : `${num((diLongo.taxa - neutro) * 100, 2)} p.p.`}
        />
        {selicLonga !== null && (
          <Linha
            k={`Selic longa do Focus (${anoLongo})`}
            v={pct(selicLonga, 2)}
            nota={`(DI ${dif(diLongo?.taxa, selicLonga)} bps)`}
          />
        )}
        <p className="text-[11.5px] leading-snug text-muted">
          Parte do prêmio pode ser o mercado vendo um neutro acima de {pct(NEUTRO_REAL, 2)}.
        </p>
      </div>

      <div className={BLOCO}>
        <div className={ROTULO}>Juro real · acima do neutro?</div>
        <table className="mt-1 w-full border-collapse">
          <thead>
            <tr>
              <td />
              <th scope="col" className={TH}>Juro real</th>
              <th scope="col" className={TH}>vs. neutro {pct(NEUTRO_REAL, 2)}</th>
            </tr>
          </thead>
          <tbody>
            {reais.map(([nome, taxa]) => (
              <tr key={nome}>
                <th scope="row" className={TH_LINHA}>{nome}</th>
                <td className={TD}>{pct(taxa, 2)}</td>
                <td className={TD}>{dif(taxa, NEUTRO_REAL)} bps</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={BLOCO}>
        <div className={ROTULO}>Inflação implícita · coerente?</div>
        <table className="mt-1 w-full border-collapse">
          <thead>
            <tr>
              <td />
              <th scope="col" className={`${TH} pl-2`}>Implícita</th>
              <th scope="col" className={`${TH} pl-2`}>Focus</th>
              <th scope="col" className={`${TH} pl-2`}>vs. Focus</th>
              <th scope="col" className={`${TH} pl-2`}>vs. meta</th>
              <th scope="col" className={`${TH} pl-2`}>vs. teto</th>
            </tr>
          </thead>
          <tbody>
            {implicitas.map((v) => {
              const focus = focusIpcaMedio(ref, v.vencimento, f);
              return (
                <tr key={v.rotulo}>
                  <th scope="row" className={TH_LINHA}>{v.rotulo}</th>
                  <td className={`${TD} pl-2`}>{pct(v.taxa, 2)}</td>
                  <td className={`${TD} pl-2`}>{pct(focus, 2)}</td>
                  <td className={`${TD} pl-2`}>{dif(v.taxa, focus)}</td>
                  <td className={`${TD} pl-2`}>{dif(v.taxa, META_INFLACAO)}</td>
                  <td className={`${TD} pl-2`}>{dif(v.taxa, BANDA_SUPERIOR)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-1 text-[11.5px] leading-snug text-muted">
          Diferenças em bps. Focus: IPCA médio projetado até o vencimento.
        </p>
      </div>
    </div>
  );
}
