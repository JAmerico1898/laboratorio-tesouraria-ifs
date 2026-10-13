"use client";

import { Icon } from "@/components/Icon";
import {
  diVsFocus,
  focusSelicReuniao,
  neutroNominal,
  selicImplicita,
} from "@/lib/mercado/ancoras";
import {
  BANDA_INFERIOR,
  BANDA_SUPERIOR,
  META_INFLACAO,
  NEUTRO_FONTE,
  NEUTRO_REAL,
} from "@/lib/mercado/config";
import { getCurva } from "@/lib/mercado/metricas";
import { dataBr, num, pct } from "@/lib/mercado/template";
import type { MercadoSnapshot } from "@/lib/mercado/types";
import { BLOCO, LeiturasAncoras, Linha, ROTULO, TD, TH } from "./LeiturasAncoras";
import { bpsSinal, TabelaDiFocus } from "./TabelaDiFocus";

/** Âncoras contra as quais a curva é lida: Copom, Focus, meta e juro neutro. */
export function CardAncoras({ s }: { s: MercadoSnapshot }) {
  const a = s.ancoras;
  if (!a) return null;

  const f = a.focus;
  const u = a.ultimoCopom;
  const di = getCurva(s, "di1")?.vertices ?? [];
  const implicitas = selicImplicita(di, a, s.indicadores);
  const anoBase = Number(s.dataEfetiva?.slice(0, 4));
  const anos = [0, 1, 2, 3, 4].map((i) => String(anoBase + i));
  const pp = (v: number | undefined) => num(v === undefined ? null : v * 100, 2);

  return (
    <div className="rounded-xl border border-border-soft bg-surface-container-lowest p-4">
      <h3 className="flex items-center gap-1.5 text-[15px] font-extrabold tracking-tight text-ink">
        <Icon name="anchor" size={18} /> Âncoras
        <span className="text-[12px] font-normal italic text-muted">
          Contra o que o mercado é lido
        </span>
      </h3>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className={BLOCO}>
          <div className={ROTULO}>Copom</div>
          <p className="mt-1 text-[13px] tabular-nums text-ink">
            <span className="text-muted">Último Copom · </span>
            {u
              ? `${dataBr(u.dataDecisao)} · ${bpsSinal(u.variacaoBps)} bps → ${pct(u.selic, 2)}${
                  u.unanime === null ? "" : u.unanime ? " · unânime" : " · não unânime"
                }`
              : "—"}
          </p>
          {u?.fraseChave && (
            <p className="mt-1 text-[12.5px] italic leading-snug text-muted">
              “{u.fraseChave}”
              {u.fonteUrl && (
                <a
                  href={u.fonteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1.5 font-semibold not-italic text-secondary hover:underline"
                >
                  ata
                </a>
              )}
            </p>
          )}
          <p className="mt-1 text-[13px] tabular-nums text-ink">
            <span className="text-muted">Próxima reunião · </span>
            {dataBr(a.reunioes[0]?.dataDecisao)}
          </p>
          <table className="mt-2 w-full border-collapse">
            <thead>
              <tr>
                <th scope="col" className={`${ROTULO} pb-1 text-left`}>Selic implícita na curva</th>
                <th scope="col" className={TH}>Curva</th>
                {f && <th scope="col" className={TH}>Focus</th>}
              </tr>
            </thead>
            <tbody>
              {implicitas.map((imp, k) => {
                const r = a.reunioes[k];
                if (!r) return null;
                return (
                  <tr key={r.id}>
                    <td className="py-0.5 text-[13px] tabular-nums text-ink">
                      {dataBr(r.dataDecisao).slice(0, 5)} ({r.id}){r.estimada && "*"}
                    </td>
                    <td className={TD}>
                      {imp ? `${pct(imp.selic, 2)} (${bpsSinal(imp.movimentoBps)})` : "—"}
                    </td>
                    {f && <td className={TD}>{pct(focusSelicReuniao(r, f), 2)}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={BLOCO}>
          <div className={ROTULO}>Focus{f && ` · data-base ${dataBr(f.dataBase)}`}</div>
          {f ? (
            <>
              <table className="mt-1 w-full border-collapse">
                <thead>
                  <tr>
                    <td />
                    {anos.map((ano) => (
                      <th key={ano} scope="col" className={TH}>{ano}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([["Selic (fim)", f.selicAnual], ["IPCA", f.ipcaAnual]] as const).map(([nome, serie]) => (
                    <tr key={nome}>
                      <th scope="row" className="py-0.5 text-left text-[13px] font-normal text-muted">
                        {nome}
                      </th>
                      {anos.map((ano) => (
                        <td key={ano} className={TD}>{pp(serie[ano])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2">
                <Linha k="IPCA 12 meses à frente:" v={pct(f.ipca12m, 2)} />
              </div>
            </>
          ) : (
            <p className="mt-1 text-[13px] text-muted">Indisponível no momento.</p>
          )}
        </div>

        <div className={`${BLOCO} space-y-1`}>
          <div className={ROTULO}>Referências</div>
          <Linha
            k="Meta de inflação"
            v={pct(META_INFLACAO, 2)}
            nota={`(banda ${num(BANDA_INFERIOR * 100, 2)}–${num(BANDA_SUPERIOR * 100, 2)})`}
          />
          <Linha k="Juro neutro real" v={pct(NEUTRO_REAL, 2)} />
          <p className="text-[11.5px] leading-snug text-muted">Fonte: {NEUTRO_FONTE}</p>
          <Linha
            k="Neutro nominal"
            v={pct(neutroNominal(NEUTRO_REAL, META_INFLACAO), 2)}
            nota={`= (${num(1 + NEUTRO_REAL, 2)} × ${num(1 + META_INFLACAO, 2)}) − 1`}
          />
        </div>
      </div>

      <LeiturasAncoras s={s} />

      <div className="mt-3">
        {f ? (
          <TabelaDiFocus linhas={diVsFocus(di, a, s.indicadores)} />
        ) : (
          <p className="text-[13px] text-muted">
            Focus indisponível no momento — as demais âncoras seguem válidas.
          </p>
        )}
      </div>

      {a.avisos.length > 0 && (
        <p className="mt-2 text-[11.5px] text-muted">{a.avisos.join(" · ")}</p>
      )}
    </div>
  );
}
