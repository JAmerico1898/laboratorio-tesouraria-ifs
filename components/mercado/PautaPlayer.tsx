"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProgressSegments } from "@/components/ProgressSegments";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { carregarAncora } from "@/lib/mercado/fetch";
import { preencher } from "@/lib/mercado/template";
import type { MercadoSnapshot } from "@/lib/mercado/types";
import type { Pauta, PautaEtapa } from "@/lib/types";
import { getPauta } from "@/data/mercado-hoje";
import { GabaritoPanel } from "./GabaritoPanel";
import { PainelMercado, type PresetPainel } from "./PainelMercado";
import { ResolucaoPanel } from "./ResolucaoPanel";

type Escolhas = Record<string, string>;

function chave(pautaId: string) {
  return `mercado-hoje:${pautaId}`;
}

/** Trilha de etapas seguindo o encadeamento explícito por `next`. */
function trilha(pauta: Pauta): PautaEtapa[] {
  const porId = new Map(pauta.etapas.map((e) => [e.id, e]));
  const out: PautaEtapa[] = [];
  let atual = pauta.etapas[0];
  const vistos = new Set<string>();
  while (atual && !vistos.has(atual.id)) {
    vistos.add(atual.id);
    out.push(atual);
    atual = porId.get(atual.next)!;
  }
  return out;
}

/**
 * Recebe o id, e não a pauta: `math` e `contrafactual` são funções, e função
 * não atravessa a fronteira Server -> Client Component. O player resolve a
 * pauta no próprio bundle do cliente.
 */
export function PautaPlayer({ pautaId }: { pautaId: string }) {
  const pauta = getPauta(pautaId)!;
  const etapas = useMemo(() => trilha(pauta), [pauta]);
  const [snap, setSnap] = useState<MercadoSnapshot | null>(null);
  const [escolhas, setEscolhas] = useState<Escolhas>({});
  const [indice, setIndice] = useState(0);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    carregarAncora().then(setSnap).catch(() => setSnap(null));
  }, []);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(chave(pauta.id));
      if (bruto) {
        const s = JSON.parse(bruto) as { escolhas: Escolhas; indice: number };
        setEscolhas(s.escolhas ?? {});
        setIndice(Math.min(s.indice ?? 0, etapas.length - 1));
      }
    } catch {
      /* progresso corrompido: começa do zero, sem quebrar a aula */
    }
    setPronto(true);
  }, [pauta.id, etapas.length]);

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(chave(pauta.id), JSON.stringify({ escolhas, indice }));
    } catch {
      /* modo privativo: segue sem persistir */
    }
  }, [escolhas, indice, pauta.id, pronto]);

  const etapa = etapas[indice];
  const escolhida = escolhas[etapa?.id ?? ""];
  const ultima = indice === etapas.length - 1;
  const resolvida = !!escolhas[etapas[etapas.length - 1].id];

  const escolher = useCallback(
    (opcaoId: string) => {
      if (!etapa) return;
      setEscolhas((atual) => {
        if (atual[etapa.id] === opcaoId) return atual;
        // Re-escolher descarta as etapas subsequentes e recalcula o estado.
        const novo: Escolhas = {};
        for (let i = 0; i < indice; i++) novo[etapas[i].id] = atual[etapas[i].id];
        novo[etapa.id] = opcaoId;
        return novo;
      });
    },
    [etapa, etapas, indice],
  );

  const pontos = useMemo(
    () => etapas.reduce((t, e) => t + (escolhas[e.id] ? e.pontos : 0), 0),
    [etapas, escolhas],
  );

  const preset: PresetPainel = useMemo(
    () => ({
      familia: pauta.familia,
      curva: pauta.curvaInicial,
      comparacao: pauta.curvaComparacao,
      janela: etapa?.janela,
    }),
    // A janela é literal no módulo de dados: a referência só muda quando a
    // etapa muda de trecho, então o painel não reseta a cada avanço de etapa.
    [pauta, etapa?.janela],
  );

  // Rótulos de vértices, não chaves de chip: o gráfico casa por `rotulo`.
  const destaques = useMemo(() => etapa?.destaques ?? [], [etapa]);
  const txt = useCallback((t: string) => (snap ? preencher(t, snap) : t), [snap]);

  if (!snap || !etapa) {
    return (
      <div className="py-16 text-center text-[14px] text-muted">Carregando a pauta…</div>
    );
  }

  return (
    <div className="pb-12">
      <Link
        href="/mercado-hoje"
        className="mt-8 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
      >
        <Icon name="arrow_back" size={16} /> Mercado Hoje
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
          {pauta.codigo}
        </span>
        <DifficultyBadge level={pauta.nivel} />
        <span className="text-[12px] text-muted">{pauta.duracaoMin} min</span>
        <span className="ml-auto rounded-full bg-secondary-container px-3 py-1 text-[12px] font-bold text-on-secondary-container">
          {pontos} / {pauta.pontuacaoMax} pontos
        </span>
      </div>

      <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {pauta.titulo}
      </h1>

      <p
        className="mt-3 text-[14.5px] leading-relaxed text-muted"
        dangerouslySetInnerHTML={{ __html: txt(pauta.contexto) }}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {pauta.chips.map((c) => (
          <span
            key={c.k}
            className="rounded-lg bg-surface-container-high px-2.5 py-1 text-[12px] text-muted"
          >
            <b className="text-ink">{c.k}:</b> {txt(c.v)}
          </span>
        ))}
      </div>

      {/* O painel nunca desmonta durante a pauta. */}
      <div className="mt-6">
        <PainelMercado snapshotFixo={snap} preset={preset} destaques={destaques} compacto />
      </div>

      <div className="mt-8">
        <ProgressSegments total={etapas.length} current={indice} />
        <div className="flex flex-wrap gap-1.5">
          {etapas.map((e, i) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setIndice(i)}
              disabled={i > 0 && !escolhas[etapas[i - 1].id]}
              className={`rounded-lg px-2.5 py-1 text-[11.5px] font-semibold transition-colors disabled:opacity-40 ${
                i === indice
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-muted hover:text-ink"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-5 rounded-2xl border border-border-soft bg-surface-container-lowest p-5">
        <h2 className="text-[15px] font-extrabold text-ink">{etapa.titulo}</h2>
        <p
          className="mt-1.5 text-[14px] leading-relaxed text-muted"
          dangerouslySetInnerHTML={{ __html: txt(etapa.enunciado) }}
        />

        <div className="mt-4 space-y-2.5">
          {etapa.opcoes.map((o) => {
            const marcada = escolhida === o.id;
            const revelar = !!escolhida;
            const curso = revelar && o.leituraCurso;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => escolher(o.id)}
                aria-pressed={marcada}
                className={`w-full rounded-xl border p-3.5 text-left transition-colors ${
                  curso
                    ? "border-secondary bg-secondary-container/40"
                    : marcada
                      ? "border-primary bg-surface-container-high"
                      : "border-border-soft hover:bg-surface-container-high"
                }`}
              >
                <div className="flex gap-2.5">
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                      marcada ? "bg-primary text-on-primary" : "bg-surface-container-highest text-muted"
                    }`}
                  >
                    {o.id.toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <span
                      className="text-[13.5px] leading-relaxed text-ink"
                      dangerouslySetInnerHTML={{ __html: txt(o.texto) }}
                    />
                    {curso && (
                      <div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary">
                        Leitura do curso
                      </div>
                    )}
                    {revelar && o.feedback && (
                      <p
                        className="mt-1 text-[12.5px] leading-relaxed text-muted"
                        dangerouslySetInnerHTML={{ __html: txt(o.feedback) }}
                      />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {escolhida && (
          <div className="mt-4 rounded-xl bg-surface-container-high p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Contraditório
            </div>
            <p
              className="mt-1 text-[13.5px] leading-relaxed text-ink"
              dangerouslySetInnerHTML={{ __html: txt(etapa.feedback) }}
            />
          </div>
        )}

        {ultima && escolhida && (
          <ResolucaoPanel pauta={pauta} snap={snap} escolhida={escolhida} />
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border-soft pt-4">
          {indice > 0 && (
            <button
              type="button"
              onClick={() => setIndice(indice - 1)}
              className="text-[13px] font-semibold text-muted hover:text-ink"
            >
              ← Etapa anterior
            </button>
          )}
          {!ultima && escolhida && (
            <button
              type="button"
              onClick={() => setIndice(indice + 1)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-on-primary"
            >
              Próxima etapa <Icon name="arrow_forward" size={16} />
            </button>
          )}
        </div>
      </section>

      <GabaritoPanel
        pauta={pauta}
        snap={snap}
        liberado={resolvida}
        onVoltarEtapa={() => setIndice(Math.max(0, etapas.length - 2))}
        onVoltarPautas={() => {
          window.location.href = "/mercado-hoje";
        }}
      />
    </div>
  );
}
