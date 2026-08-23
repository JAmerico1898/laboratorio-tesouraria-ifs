"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { carregarAncora, carregarSnapshot, hojeIso, paraCsv } from "@/lib/mercado/fetch";
import { recortarCurva } from "@/lib/mercado/metricas";
import { dataBr } from "@/lib/mercado/template";
import type { Curva, Familia, JanelaDu, MercadoSnapshot } from "@/lib/mercado/types";
import { CartoesForward } from "./CartoesForward";
import { GraficoCurva } from "./GraficoCurva";
import { Indicadores } from "./Indicadores";
import { LeituraRapida } from "./LeituraRapida";
import { SeletorCurva } from "./SeletorCurva";
import { TabelaVertices } from "./TabelaVertices";

export interface PresetPainel {
  familia: Familia;
  curva: string;
  comparacao?: string;
  /**
   * Trecho da curva que a etapa discute. O painel abre nele — cartões, gráfico
   * e CSV falam do mesmo pedaço de curva que as alternativas — e o aluno abre a
   * curva inteira com um clique.
   */
  janela?: JanelaDu;
}


export function PainelMercado({
  snapshotFixo,
  preset,
  destaques = [],
  compacto = false,
}: {
  /** Snapshot congelado — usado pelas pautas, que são ancoradas numa data. */
  snapshotFixo?: MercadoSnapshot;
  preset?: PresetPainel;
  destaques?: string[];
  compacto?: boolean;
}) {
  const [data, setData] = useState(hojeIso);
  const [snap, setSnap] = useState<MercadoSnapshot | null>(snapshotFixo ?? null);
  const [carregando, setCarregando] = useState(!snapshotFixo);
  const [familia, setFamilia] = useState<Familia>(preset?.familia ?? "taxas");
  const [curvaId, setCurvaId] = useState(preset?.curva ?? "");
  const [comparacaoId, setComparacaoId] = useState(preset?.comparacao ?? "");
  const [eixoData, setEixoData] = useState(false);
  const [projecao, setProjecao] = useState(false);
  const [curvaInteira, setCurvaInteira] = useState(false);

  useEffect(() => {
    if (snapshotFixo) {
      setSnap(snapshotFixo);
      return;
    }
    let vivo = true;
    setCarregando(true);
    carregarSnapshot(data)
      .catch(() => carregarAncora())
      .then((s) => vivo && setSnap(s))
      .finally(() => vivo && setCarregando(false));
    return () => {
      vivo = false;
    };
  }, [data, snapshotFixo]);

  // O preset da etapa reconfigura os seletores, mas o aluno segue livre.
  useEffect(() => {
    if (!preset) return;
    setFamilia(preset.familia);
    setCurvaId(preset.curva);
    setComparacaoId(preset.comparacao ?? "");
    setCurvaInteira(false);
  }, [preset]);

  const curvas = snap?.curvas ?? [];
  const curvaCheia: Curva | undefined =
    curvas.find((c) => c.id === curvaId) ?? curvas.find((c) => c.familia === familia);
  const comparacaoCheia = curvas.find((c) => c.id === comparacaoId);

  const foraDoRecorte =
    !!preset && (curvaCheia?.id !== preset.curva || comparacaoId !== (preset.comparacao ?? ""));

  // A janela só vale para a curva da etapa: se o aluno trocou de curva, não há
  // trecho a recortar. Tudo abaixo consome a curva já recortada, para que os
  // cartões, o gráfico e o CSV nunca contradigam o enunciado.
  const janela = !preset?.janela || curvaInteira || foraDoRecorte ? undefined : preset.janela;
  const curva = useMemo(
    () => (curvaCheia ? recortarCurva(curvaCheia, janela) : undefined),
    [curvaCheia, janela],
  );
  const comparacao = useMemo(
    () => (comparacaoCheia ? recortarCurva(comparacaoCheia, janela) : undefined),
    [comparacaoCheia, janela],
  );
  const recortou = !!curvaCheia && !!curva && curva.vertices.length < curvaCheia.vertices.length;

  const trocarFamilia = useCallback(
    (f: Familia) => {
      setFamilia(f);
      const primeira = curvas.find((c) => c.familia === f);
      setCurvaId(primeira?.id ?? "");
      setComparacaoId("");
    },
    [curvas],
  );

  const baixarCsv = useCallback(() => {
    if (!curva) return;
    const csv = paraCsv(
      ["Vertice", "Vencimento", "DiasUteis", "Taxa", "PU", "Duration", "DV01", "Nota"],
      curva.vertices.map((v) => [
        v.rotulo,
        v.vencimento,
        v.diasUteis,
        v.taxa,
        v.pu ?? "",
        v.duration ?? "",
        v.dv01 ?? "",
        v.nota ?? "",
      ]),
    );
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${curva.id}-${snap?.dataEfetiva ?? data}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [curva, snap, data]);

  const aviso = useMemo(() => {
    if (!snap) return null;
    if (snap.contingencia) {
      return `Dados de contingência de ${dataBr(snap.dataEfetiva)} — a fonte ao vivo está indisponível`;
    }
    if (snapshotFixo) {
      return `Pauta ancorada em ${dataBr(snap.dataEfetiva)} — a leitura do curso descreve a curva deste dia`;
    }
    if (snap.dataEfetiva && snap.dataEfetiva !== snap.dataSolicitada) {
      return `Data solicitada: ${dataBr(snap.dataSolicitada)} · Dados disponíveis para: ${dataBr(snap.dataEfetiva)}`;
    }
    return null;
  }, [snap, snapshotFixo]);

  if (carregando) {
    return (
      <div className="rounded-2xl border border-border-soft bg-surface-container-lowest p-8 text-center text-[14px] text-muted">
        Carregando as curvas do dia…
      </div>
    );
  }
  if (!snap || !curva) {
    return (
      <div className="rounded-2xl border border-danger/30 bg-error-container/40 p-5 text-[14px] text-ink">
        {snap?.error ?? "Não foi possível carregar as curvas."}
      </div>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-border-soft bg-surface-container-lowest p-4 sm:p-5 ${
        projecao ? "fixed inset-2 z-50 overflow-auto shadow-2xl" : ""
      }`}
      aria-label="Painel de Mercado"
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-[15px] font-extrabold tracking-tight text-ink">Painel de Mercado</h2>
        {!snapshotFixo && (
          <label className="flex items-center gap-2 text-[12px] text-muted">
            Data de referência
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="rounded-lg border border-border-soft bg-surface px-2 py-1 text-[13px] text-ink"
            />
          </label>
        )}
        <button
          type="button"
          onClick={() => setProjecao((v) => !v)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border-soft px-3 py-1.5 text-[12px] font-semibold text-muted hover:text-ink"
        >
          <Icon name={projecao ? "close_fullscreen" : "present_to_all"} size={16} />
          {projecao ? "Sair da projeção" : "Modo projeção"}
        </button>
      </div>

      {aviso && (
        <p className="mt-2 rounded-lg bg-surface-container-high px-3 py-1.5 text-[12px] text-muted">
          {aviso}
        </p>
      )}

      <div className="mt-4">
        <SeletorCurva
          curvas={curvas}
          familia={familia}
          curvaId={curva.id}
          comparacaoId={comparacaoId}
          eixoData={eixoData}
          onFamilia={trocarFamilia}
          onCurva={setCurvaId}
          onComparacao={setComparacaoId}
          onEixo={setEixoData}
          onCsv={baixarCsv}
        />
      </div>

      {foraDoRecorte && preset && (
        <button
          type="button"
          onClick={() => {
            setFamilia(preset.familia);
            setCurvaId(preset.curva);
            setComparacaoId(preset.comparacao ?? "");
          }}
          className="mt-3 text-[12px] font-semibold text-secondary hover:underline"
        >
          ← Voltar ao recorte da etapa
        </button>
      )}

      {preset?.janela && !foraDoRecorte && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-muted">
          {recortou ? (
            <>
              <span>
                Mostrando {curva.vertices[0].rotulo} a{" "}
                {curva.vertices[curva.vertices.length - 1].rotulo} — o trecho que esta etapa
                discute
              </span>
              <button
                type="button"
                onClick={() => setCurvaInteira(true)}
                className="font-semibold text-secondary hover:underline"
              >
                Ver a curva inteira
              </button>
            </>
          ) : (
            <>
              <span>Mostrando a curva inteira</span>
              <button
                type="button"
                onClick={() => setCurvaInteira(false)}
                className="font-semibold text-secondary hover:underline"
              >
                Ver só o trecho da etapa
              </button>
            </>
          )}
        </p>
      )}

      <div className="mt-4">
        <LeituraRapida curva={curva} />
      </div>

      <div className="mt-4">
        <GraficoCurva
          curva={curva}
          comparacao={comparacao}
          eixoData={eixoData}
          destaques={destaques}
          altura={projecao ? 520 : compacto ? 260 : 320}
        />
      </div>

      {!compacto && (
        <>
          <div className="mt-5">
            <CartoesForward curva={curva} />
          </div>
          <div className="mt-5">
            <Indicadores s={snap} />
          </div>
          <div className="mt-4">
            <TabelaVertices curva={curva} />
          </div>
        </>
      )}
    </section>
  );
}
