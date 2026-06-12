"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import type {
  CaseMtmLft,
  MtmCheckpoint,
  MtmOpcao,
  MtmTimelineMarco,
  MtmReflexao,
  MtmEspelhoLinha,
} from "@/lib/types";

// ─── Colors ──────────────────────────────────────────────────────────────────

const C = {
  navy: "#1F3A5F",
  teal: "#1F6F6F",
  gold: "#B07D2B",
  red: "#9B2D2D",
  green: "#2E7D52",
};

const MOD_COLORS: Record<string, string> = {
  M1: "#2E5E8C",
  M2: "#1F6F6F",
  M3: "#B07D2B",
  M4: "#7A4E8C",
};

// ─── LocalStorage ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "mtmlft:v1";

type SimuladorPersistedState = {
  s0: number;
  s1: number;
  du: number;
  vna: number;
  modoAprox: boolean;
};

type MtmLftSaved = {
  cpRespostas: Record<string, string>;
  marcosLidos: string[];
  simulador: SimuladorPersistedState | null;
};

function loadState(): MtmLftSaved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MtmLftSaved;
  } catch {}
  return { cpRespostas: {}, marcosLidos: [], simulador: null };
}

function saveState(s: MtmLftSaved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

// ─── Math ─────────────────────────────────────────────────────────────────────

export function calcCotacao(s: number, du: number): number {
  return 100 / Math.pow(1 + s, du / 252);
}

export function calcMtmExato(s0: number, s1: number, du: number): number {
  return calcCotacao(s1, du) / calcCotacao(s0, du) - 1;
}

export function calcMtmAprox(s0: number, s1: number, du: number): {
  total: number;
  duration: number;
  convexidade: number;
} {
  const tau = du / 252;
  const ds = s1 - s0;
  const duration = -(tau / (1 + s0)) * ds;
  const convexidade = 0.5 * ((tau * (tau + 1)) / Math.pow(1 + s0, 2)) * ds * ds;
  return { total: duration + convexidade, duration, convexidade };
}

// ─── ModTag ───────────────────────────────────────────────────────────────────

function ModTag({ m }: { m: string }) {
  return (
    <span
      className="rounded-full px-1.5 py-0.5 text-[11px] font-extrabold text-white"
      style={{ backgroundColor: MOD_COLORS[m] ?? C.navy }}
    >
      {m}
    </span>
  );
}

// ─── FeedbackBlock ────────────────────────────────────────────────────────────

function FeedbackBlock({
  opcao,
  oQueAconteceu,
  ponte,
}: {
  opcao: MtmOpcao;
  oQueAconteceu: string;
  ponte: string;
}) {
  return (
    <div className="space-y-3 text-sm">
      <div
        className="rounded-lg border-l-4 p-3"
        style={{
          borderColor: opcao.leituraCurso ? C.teal : C.red,
          background: opcao.leituraCurso ? "#E4F0F0" : "#F8ECEC",
        }}
      >
        {opcao.leituraCurso && (
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: C.teal }}>
            leitura do curso
          </div>
        )}
        <p
          className="leading-relaxed"
          dangerouslySetInnerHTML={{ __html: opcao.feedback }}
          style={{ color: opcao.leituraCurso ? C.teal : C.red }}
        />
      </div>

      <div className="rounded-lg border-l-4 p-3" style={{ borderColor: C.red, background: "#F8ECEC" }}>
        <div className="mb-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: C.red }}>
          o que de fato aconteceu
        </div>
        <p className="leading-relaxed text-[#5a1a1a]" dangerouslySetInnerHTML={{ __html: oQueAconteceu }} />
      </div>

      <div className="rounded-lg border-l-4 p-3" style={{ borderColor: C.teal, background: "#E4F0F0" }}>
        <div className="mb-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: C.teal }}>
          ↳ ponte para o curso
        </div>
        <p className="leading-relaxed" style={{ color: C.teal }} dangerouslySetInnerHTML={{ __html: ponte }} />
      </div>
    </div>
  );
}

// ─── CheckpointBlock ──────────────────────────────────────────────────────────

function CheckpointBlock({
  cp,
  resposta,
  onResponder,
}: {
  cp: MtmCheckpoint;
  resposta: string | undefined;
  onResponder: (cpId: string, opcaoId: string) => void;
}) {
  const opcaoEscolhida = cp.opcoes.find((o) => o.id === resposta);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border" style={{ borderColor: "#C9CFD8" }}>
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"
        style={{ background: C.navy }}
      >
        <span className="font-serif text-[15px] font-bold text-white">{cp.titulo}</span>
        <div className="flex gap-1">
          {cp.modulos.map((m) => (
            <ModTag key={m} m={m} />
          ))}
        </div>
      </div>

      <div className="bg-[#F8F9FB] p-4 space-y-3">
        <div
          className="text-sm leading-relaxed [&_b]:font-semibold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: cp.contexto }}
        />

        {cp.usaSimulador && cp.simuladorDica && (
          <div className="rounded-lg border-l-4 p-3 text-sm" style={{ borderColor: C.teal, background: "#E4F0F0" }}>
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: C.teal }}>
              ↳ use o simulador antes de responder
            </div>
            <p
              className="leading-relaxed [&_b]:font-semibold"
              style={{ color: C.teal }}
              dangerouslySetInnerHTML={{ __html: cp.simuladorDica }}
            />
          </div>
        )}

        {!resposta ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold" style={{ color: C.navy }}>
              {cp.pergunta}
            </p>
            {cp.opcoes.map((op) => (
              <button
                key={op.id}
                onClick={() => onResponder(cp.id, op.id)}
                className="w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors hover:border-[#1F3A5F] hover:bg-white"
                style={{ borderColor: "#C9CFD8", background: "#fff" }}
              >
                <span className="font-bold">{op.id}.</span>{" "}
                <span dangerouslySetInnerHTML={{ __html: op.texto }} />
              </button>
            ))}
          </div>
        ) : opcaoEscolhida ? (
          <div className="space-y-2">
            <p className="text-[13px] text-muted">
              Sua resposta: <span className="font-bold">{opcaoEscolhida.id}</span>
            </p>
            <FeedbackBlock
              opcao={opcaoEscolhida}
              oQueAconteceu={cp.oQueAconteceu}
              ponte={cp.ponte}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── TimelineMarco ────────────────────────────────────────────────────────────

function TimelineMarco({
  marco,
  checkpoint,
  cpResposta,
  onResponder,
  onMarcoRead,
  isRead,
}: {
  marco: MtmTimelineMarco;
  checkpoint?: MtmCheckpoint;
  cpResposta?: string;
  onResponder: (cpId: string, opcaoId: string) => void;
  onMarcoRead: (id: string) => void;
  isRead: boolean;
}) {
  const [expanded, setExpanded] = useState(isRead);

  const handleToggle = useCallback(() => {
    if (!expanded) onMarcoRead(marco.id);
    setExpanded((v) => !v);
  }, [expanded, marco.id, onMarcoRead]);

  const dotColor = marco.tipo === "critico" ? C.red : C.gold;

  return (
    <div className="relative pb-6 pl-8">
      {/* vertical line */}
      <div
        className="absolute left-[10px] top-0 bottom-0 w-[3px] rounded-full"
        style={{ background: "#C9CFD8" }}
      />
      {/* dot */}
      <div
        className="absolute left-0 top-[5px] flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white"
        style={{ background: dotColor, boxShadow: `0 0 0 2px ${dotColor}` }}
      />

      <button
        onClick={handleToggle}
        className="w-full text-left"
        aria-expanded={expanded}
      >
        <div className="flex flex-wrap items-start gap-2">
          <span className="text-sm font-bold" style={{ color: C.navy }}>
            {marco.data}
          </span>
          {marco.cpId && (
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
              style={{ background: C.red }}
            >
              ▶ {marco.cpId.toUpperCase()}
            </span>
          )}
          {marco.modulos.map((m) => (
            <ModTag key={m} m={m} />
          ))}
        </div>
        <p
          className="mt-0.5 text-sm leading-relaxed [&_b]:font-semibold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: marco.evento }}
        />
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {marco.numero && (
            <div
              className="inline-block rounded px-2.5 py-1 text-sm font-bold"
              style={{ background: "#F5EEDD", color: C.gold }}
            >
              {marco.numero}
            </div>
          )}
          {marco.leitura && (
            <p className="text-sm italic" style={{ color: "#666" }}>
              {marco.leitura}
            </p>
          )}
          {checkpoint && (
            <CheckpointBlock
              cp={checkpoint}
              resposta={cpResposta}
              onResponder={onResponder}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── ReflexaoCard ─────────────────────────────────────────────────────────────

function ReflexaoCard({ item }: { item: MtmReflexao }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "#C9CFD8", background: "#F8F9FB" }}>
      <div className="flex flex-wrap gap-1 mb-2">
        {item.modulos.map((m) => (
          <ModTag key={m} m={m} />
        ))}
        {item.usaSimulador && (
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
            style={{ background: C.teal }}
          >
            usa simulador
          </span>
        )}
      </div>
      <p
        className="text-sm font-medium leading-relaxed [&_b]:font-semibold"
        dangerouslySetInnerHTML={{ __html: item.pergunta }}
      />
      <p className="mt-2 text-[12px] italic" style={{ color: "#888" }}>
        Não há gabarito — o objetivo é o raciocínio.
      </p>
    </div>
  );
}

// ─── Tabelas Estáticas ────────────────────────────────────────────────────────

const thStyle: React.CSSProperties = {
  background: C.navy,
  color: "#fff",
  fontWeight: "bold",
  padding: "7px 10px",
  textAlign: "left",
  border: "1px solid #C9CFD8",
  fontSize: 13,
};

const tdStyle: React.CSSProperties = {
  padding: "7px 10px",
  border: "1px solid #C9CFD8",
  fontSize: 13,
  verticalAlign: "top",
};

function TabelaChoque() {
  const rows = [
    ["Câmbio BRL/USD", "~2,35", ">3,0 (jul); ~4,0 (set)", "3,5333"],
    ["Risco-Brasil (Embi)", "857 p.b. (abr)", "2.390 p.b. (jul)", "queda após out"],
    ["Spread swap DI×pré 360d / Selic", "~0,9 p.p.", "8,5 p.p. (3º tri)", "4,2 p.p. (dez)"],
    ["Selic-meta", "18,0%", "21% (out) · 22% (nov)", "25,0% (dez)"],
    ["Deságio exigido nas LFTs", "0,35% a.a. (fev)", "1,95% a.a. (ago)", "−0,08% a 1,78% (out)"],
  ];
  return (
    <div className="overflow-x-auto">
      <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: 6 }}>
        <thead>
          <tr>
            {["Indicador", "Início de 2002", "Pior momento", "Fechamento"].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#F4F6F9" }}>
              {r.map((c, j) => (
                <td key={j} style={{ ...tdStyle, fontWeight: j === 0 ? 600 : 400 }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[12px] italic" style={{ color: "#888" }}>
        Fonte: Relatório Anual 2002 e Relatórios de Inflação do BCB.
      </p>
    </div>
  );
}

function TabelaFundos() {
  const rows = [
    ["Patrimônio FIF — mai/2002", "R$ 335,9 bi", "Nível pré-ajuste completo"],
    ["Patrimônio FIF — ago/2002", "R$ 302,0 bi", "Queda de R$ 32,5 bi vs. maio"],
    ["Resgates líquidos FIF (31/5–10/9)", "R$ 50,5 bi", "Saída maciça de passivo resgatável"],
    ["Captação — Poupança (mesmo período)", "+R$ 14,6 bi", "Migração para o percebido como estável"],
    ["Captação — CDB (mesmo período)", "+R$ 17,6 bi", "Migração para o percebido como estável"],
    ["Patrimônio FIF — dez/2002", "R$ 321,4 bi", "Recuperação parcial após medidas"],
  ];
  return (
    <div className="overflow-x-auto">
      <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: 6 }}>
        <thead>
          <tr>
            {["Evidência", "Dado", "Leitura de ALM"].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#F4F6F9" }}>
              {r.map((c, j) => (
                <td key={j} style={{ ...tdStyle, fontWeight: j === 0 ? 600 : 400 }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[12px] italic" style={{ color: "#888" }}>
        Fonte: Relatórios de Inflação (jun/set) e Relatório Anual 2002 do BCB.
      </p>
    </div>
  );
}

function TabelaSensibilidade() {
  const rows = [
    ["63 du", "99,9127", "99,5184", "−0,395%"],
    ["126 du", "99,8255", "99,0390", "−0,788%"],
    ["252 du (≈ 1 ano)", "99,6512", "98,0873", "−1,569%"],
    ["504 du (≈ 2 anos)", "99,3037", "96,2112", "−3,114%"],
  ];
  return (
    <div className="overflow-x-auto">
      <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: 6 }}>
        <thead>
          <tr>
            {["Prazo remanescente", "Cotação @ spread 0,35%", "Cotação @ spread 1,95%", "Variação MtM"].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#F4F6F9" }}>
              {r.map((c, j) => (
                <td key={j} style={{ ...tdStyle, fontWeight: j === 3 ? 700 : j === 0 ? 600 : 400, color: j === 3 ? C.red : undefined }}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[12px] italic" style={{ color: "#888" }}>
        Fonte: cálculo com base nas fórmulas oficiais de cotação da LFT e nos spreads observados pelo BCB (fev × ago/2002). Estes valores são reproduzidos exatamente pelo simulador.
      </p>
    </div>
  );
}

// ─── Quadro-Espelho ───────────────────────────────────────────────────────────

function QuadroEspelho({ linhas }: { linhas: MtmEspelhoLinha[] }) {
  return (
    <div className="overflow-x-auto">
      <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: 6 }}>
        <thead>
          <tr>
            {["Dimensão", "Brasil 2002 (fundos)", "SVB 2023 (banco)", "O que o curso ensina", "Mód."].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#F4F6F9" }}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{l.dimensao}</td>
              <td style={tdStyle}>{l.br2002}</td>
              <td style={tdStyle}>{l.svb}</td>
              <td style={tdStyle}>{l.cursoEnsina}</td>
              <td style={tdStyle}>
                <div className="flex flex-wrap gap-1">
                  {l.modulos.map((m) => <ModTag key={m} m={m} />)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── SimuladorLFT ─────────────────────────────────────────────────────────────

const PRESETS = [
  { label: "Fev→Ago 2002", s0: 0.0035, s1: 0.0195 },
  { label: "Ágio (spread −0,5%)", s0: 0.0000, s1: -0.005 },
] as const;

const DU_PRESETS = [63, 126, 252, 504] as const;

const ARQUETIPOS = [
  { nome: "Caixa / liquidez", comp: "40% LFT 63 du + 60% caixa", duPeso: [[63, 0.4]] as [number, number][] },
  { nome: "DI conservador", comp: "80% LFT 126 du + 20% caixa", duPeso: [[126, 0.8]] as [number, number][] },
  { nome: "DI tradicional", comp: "90% LFT 252 du + 10% caixa", duPeso: [[252, 0.9]] as [number, number][] },
  { nome: "DI alongado", comp: "90% LFT 504 du + 10% caixa", duPeso: [[504, 0.9]] as [number, number][] },
];

type SimState = {
  s0: number;
  s1: number;
  du: number;
  vna: number;
  modoAprox: boolean;
  carteiraAberta: boolean;
};

function SimuladorLFT({
  initialState,
  onStateChange,
}: {
  initialState?: SimuladorPersistedState | null;
  onStateChange: (s: SimuladorPersistedState) => void;
}) {
  const [sim, setSim] = useState<SimState>({
    s0: initialState?.s0 ?? 0.0035,
    s1: initialState?.s1 ?? 0.0195,
    du: initialState?.du ?? 252,
    vna: initialState?.vna ?? 10000,
    modoAprox: initialState?.modoAprox ?? false,
    carteiraAberta: false,
  });

  const update = useCallback((patch: Partial<SimState>) => {
    setSim((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    onStateChange({ s0: sim.s0, s1: sim.s1, du: sim.du, vna: sim.vna, modoAprox: sim.modoAprox });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.s0, sim.s1, sim.du, sim.vna, sim.modoAprox]);

  const cot0 = calcCotacao(sim.s0, sim.du);
  const cot1 = calcCotacao(sim.s1, sim.du);
  const mtmExato = calcMtmExato(sim.s0, sim.s1, sim.du);
  const mtmAproxResult = calcMtmAprox(sim.s0, sim.s1, sim.du);
  const mtmDisplay = sim.modoAprox ? mtmAproxResult.total : mtmExato;
  const perdaReais = sim.vna * mtmDisplay;

  // SVG chart: cotação × spread, 2 curvas
  const svgW = 300;
  const svgH = 160;
  const pad = { top: 12, right: 12, bottom: 24, left: 36 };
  const chartW = svgW - pad.left - pad.right;
  const chartH = svgH - pad.top - pad.bottom;

  const sMin = 0;
  const sMax = 0.025;
  const N = 60;

  const cotMin = 94;
  const cotMax = 101;

  const sToX = (s: number) => pad.left + ((s - sMin) / (sMax - sMin)) * chartW;
  const cotToY = (c: number) => pad.top + ((cotMax - c) / (cotMax - cotMin)) * chartH;

  const makeLine = (du: number) =>
    Array.from({ length: N }, (_, i) => {
      const s = sMin + (i / (N - 1)) * (sMax - sMin);
      return `${sToX(s).toFixed(1)},${cotToY(calcCotacao(s, du)).toFixed(1)}`;
    }).join(" ");

  const line1 = useMemo(() => makeLine(sim.du), [sim.du]);
  const line504 = useMemo(() => makeLine(504), []);

  const xS0 = sToX(Math.max(sMin, Math.min(sMax, sim.s0)));
  const xS1 = sToX(Math.max(sMin, Math.min(sMax, sim.s1)));
  const yS0 = cotToY(cot0);
  const yS1 = cotToY(cot1);

  // Carteira NAV calc
  const carteiraRows = ARQUETIPOS.map((a) => {
    const nav = a.duPeso.reduce((acc, [du, w]) => acc + w * calcMtmExato(sim.s0, sim.s1, du), 0);
    return { ...a, nav };
  });

  return (
    <div
      className="overflow-hidden rounded-2xl border-2"
      style={{ borderColor: C.teal }}
      id="simulador"
    >
      {/* Header */}
      <div className="px-4 py-3" style={{ background: C.teal }}>
        <h3 className="font-serif text-base font-bold text-white">
          SIMULADOR — A LFT sob choque de spread
        </h3>
      </div>

      <div className="bg-white p-4 space-y-5">
        {/* Entradas */}
        <div className="space-y-3">
          {/* s0 */}
          <div>
            <div className="flex justify-between text-[13px] font-semibold mb-1" style={{ color: C.navy }}>
              <span>Spread base (s₀)</span>
              <span>{(sim.s0 * 100).toFixed(2)}% a.a.</span>
            </div>
            <input
              type="range"
              min={-0.005}
              max={0.02}
              step={0.0005}
              value={sim.s0}
              onChange={(e) => update({ s0: parseFloat(e.target.value) })}
              className="w-full accent-[#1F6F6F]"
              aria-label="Spread base s0"
              aria-valuenow={sim.s0}
            />
          </div>
          {/* s1 */}
          <div>
            <div className="flex justify-between text-[13px] font-semibold mb-1" style={{ color: C.navy }}>
              <span>Spread de choque (s₁)</span>
              <span>{(sim.s1 * 100).toFixed(2)}% a.a.</span>
            </div>
            <input
              type="range"
              min={-0.005}
              max={0.025}
              step={0.0005}
              value={sim.s1}
              onChange={(e) => update({ s1: parseFloat(e.target.value) })}
              className="w-full accent-[#9B2D2D]"
              aria-label="Spread de choque s1"
              aria-valuenow={sim.s1}
            />
          </div>
          {/* du */}
          <div>
            <div className="flex justify-between text-[13px] font-semibold mb-1" style={{ color: C.navy }}>
              <span>Prazo remanescente (du)</span>
              <span>{sim.du} dias úteis</span>
            </div>
            <input
              type="range"
              min={21}
              max={756}
              step={1}
              value={sim.du}
              onChange={(e) => update({ du: parseInt(e.target.value) })}
              className="w-full accent-[#1F3A5F]"
              aria-label="Prazo em dias úteis"
              aria-valuenow={sim.du}
            />
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {DU_PRESETS.map((d) => (
                <button
                  key={d}
                  onClick={() => update({ du: d })}
                  className="rounded-md border px-2.5 py-0.5 text-[12px] font-semibold transition-colors"
                  style={{
                    borderColor: sim.du === d ? C.navy : "#C9CFD8",
                    background: sim.du === d ? C.navy : "#fff",
                    color: sim.du === d ? "#fff" : C.navy,
                  }}
                >
                  {d} du
                </button>
              ))}
            </div>
          </div>
          {/* VNA */}
          <div className="flex items-center gap-3">
            <label className="text-[13px] font-semibold shrink-0" style={{ color: C.navy }}>
              VNA (R$)
            </label>
            <input
              type="number"
              value={sim.vna}
              onChange={(e) => update({ vna: Math.max(1, parseFloat(e.target.value) || 10000) })}
              className="rounded-lg border px-3 py-1.5 text-sm w-32"
              style={{ borderColor: "#C9CFD8" }}
            />
          </div>
          {/* Toggle */}
          <div className="flex gap-2">
            {[false, true].map((aprox) => (
              <button
                key={String(aprox)}
                onClick={() => update({ modoAprox: aprox })}
                className="rounded-lg border px-3 py-1 text-[13px] font-semibold transition-colors"
                style={{
                  borderColor: sim.modoAprox === aprox ? C.teal : "#C9CFD8",
                  background: sim.modoAprox === aprox ? C.teal : "#fff",
                  color: sim.modoAprox === aprox ? "#fff" : C.teal,
                }}
              >
                {aprox ? "≈ Aprox (duration + convex.)" : "⚙ Exato"}
              </button>
            ))}
          </div>
        </div>

        {/* Cenários */}
        <div>
          <p className="text-[12px] uppercase font-bold tracking-wide mb-1.5" style={{ color: "#888" }}>
            Cenários de 1 clique
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => update({ s0: p.s0, s1: p.s1 })}
                className="rounded-full border px-3 py-0.5 text-[12px] font-semibold transition-colors hover:bg-[#E4F0F0]"
                style={{ borderColor: C.teal, color: C.teal }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Saídas */}
        <div
          className="rounded-xl p-4 space-y-2"
          style={{ background: "#F8F9FB", border: "1px solid #C9CFD8" }}
          aria-live="polite"
        >
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wide mb-0.5" style={{ color: "#888" }}>
                Cotação base
              </div>
              <div className="font-bold tabular-nums" style={{ color: C.navy }}>
                {cot0.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wide mb-0.5" style={{ color: "#888" }}>
                Cotação pós-choque
              </div>
              <div className="font-bold tabular-nums" style={{ color: mtmDisplay < 0 ? C.red : C.green }}>
                {cot1.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="text-center py-2">
            <div className="text-[12px] uppercase font-bold tracking-wide mb-0.5" style={{ color: "#888" }}>
              Variação MtM {sim.modoAprox ? "(aprox.)" : "(exato)"}
            </div>
            <div
              className="text-3xl font-extrabold tabular-nums"
              style={{ color: mtmDisplay < 0 ? C.red : C.green }}
            >
              {(mtmDisplay * 100).toFixed(3)}%
            </div>
            <div className="text-sm font-semibold mt-0.5" style={{ color: mtmDisplay < 0 ? C.red : C.green }}>
              Perda: R${" "}
              {perdaReais.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {sim.modoAprox && (
            <div
              className="rounded-lg p-3 text-[13px] space-y-1"
              style={{ background: "#E4F0F0", border: "1px solid #BDE0DC" }}
            >
              <div className="font-bold mb-1" style={{ color: C.teal }}>
                Decomposição (aprox. 2ª ordem)
              </div>
              <div className="flex justify-between tabular-nums">
                <span>Spread duration (1º termo)</span>
                <span style={{ color: C.red }}>
                  {(mtmAproxResult.duration * 100).toFixed(3)}%
                </span>
              </div>
              <div className="flex justify-between tabular-nums">
                <span>Convexidade (2º termo)</span>
                <span style={{ color: C.green }}>
                  +{(mtmAproxResult.convexidade * 100).toFixed(3)}%
                </span>
              </div>
              <div className="flex justify-between tabular-nums font-bold border-t pt-1" style={{ borderColor: "#BDE0DC" }}>
                <span>Total aprox.</span>
                <span style={{ color: mtmAproxResult.total < 0 ? C.red : C.green }}>
                  {(mtmAproxResult.total * 100).toFixed(3)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mini-gráfico SVG */}
        <div>
          <p className="text-[12px] uppercase font-bold tracking-wide mb-2" style={{ color: "#888" }}>
            Cotação × Spread (curva ao vivo)
          </p>
          <div className="overflow-x-auto">
            <svg width={svgW} height={svgH} style={{ fontFamily: "inherit" }}>
              {/* Grid lines */}
              {[95, 97, 99, 101].map((c) => (
                <line
                  key={c}
                  x1={pad.left} y1={cotToY(c)}
                  x2={svgW - pad.right} y2={cotToY(c)}
                  stroke="#E8EDF3" strokeWidth={1}
                />
              ))}
              {/* Y labels */}
              {[95, 97, 99, 101].map((c) => (
                <text key={c} x={pad.left - 4} y={cotToY(c) + 4} textAnchor="end" fontSize={9} fill="#999">{c}</text>
              ))}
              {/* X labels */}
              {[0, 0.5, 1.0, 1.5, 2.0, 2.5].map((pct) => (
                <text key={pct} x={sToX(pct / 100)} y={svgH - pad.bottom + 14} textAnchor="middle" fontSize={9} fill="#999">
                  {pct.toFixed(1)}%
                </text>
              ))}

              {/* Linha 504 du (navy dashed) */}
              {sim.du !== 504 && (
                <polyline
                  points={line504}
                  fill="none"
                  stroke={C.navy}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  opacity={0.5}
                />
              )}

              {/* Linha du atual (teal) */}
              <polyline points={line1} fill="none" stroke={C.teal} strokeWidth={2} />

              {/* Marcador s0 (gold) */}
              <line x1={xS0} y1={pad.top} x2={xS0} y2={svgH - pad.bottom} stroke={C.gold} strokeWidth={1.5} strokeDasharray="3 2" />
              <circle cx={xS0} cy={yS0} r={4} fill={C.gold} />

              {/* Marcador s1 (red) */}
              <line x1={xS1} y1={pad.top} x2={xS1} y2={svgH - pad.bottom} stroke={C.red} strokeWidth={1.5} strokeDasharray="3 2" />
              <circle cx={xS1} cy={yS1} r={4} fill={C.red} />

              {/* Legenda */}
              <rect x={pad.left + 2} y={pad.top + 2} width={90} height={36} fill="white" opacity={0.85} rx={3} />
              <line x1={pad.left + 8} y1={pad.top + 11} x2={pad.left + 22} y2={pad.top + 11} stroke={C.teal} strokeWidth={2} />
              <text x={pad.left + 26} y={pad.top + 14} fontSize={9} fill={C.teal}>{sim.du} du (atual)</text>
              {sim.du !== 504 && (
                <>
                  <line x1={pad.left + 8} y1={pad.top + 25} x2={pad.left + 22} y2={pad.top + 25} stroke={C.navy} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.5} />
                  <text x={pad.left + 26} y={pad.top + 28} fontSize={9} fill={C.navy} opacity={0.6}>504 du (ref.)</text>
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Modo carteira */}
        <div>
          <button
            onClick={() => setSim((s) => ({ ...s, carteiraAberta: !s.carteiraAberta }))}
            className="flex items-center gap-1 text-[13px] font-semibold transition-colors"
            style={{ color: C.teal }}
            aria-expanded={sim.carteiraAberta}
          >
            <span>{sim.carteiraAberta ? "▾" : "▸"}</span>
            Modo carteira — impacto no NAV por arquétipo de fundo
          </button>

          {sim.carteiraAberta && (
            <div className="mt-2 overflow-x-auto">
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    {["Arquétipo", "Composição", "Choque no NAV"].map((h) => (
                      <th key={h} style={{ ...thStyle, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {carteiraRows.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#F4F6F9" }}>
                      <td style={{ ...tdStyle, fontWeight: 600, fontSize: 12 }}>{r.nome}</td>
                      <td style={{ ...tdStyle, fontSize: 12 }}>{r.comp}</td>
                      <td style={{ ...tdStyle, fontSize: 13, fontWeight: 700, color: r.nav < 0 ? C.red : C.green }}>
                        {(r.nav * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] italic mt-1" style={{ color: "#888" }}>
                Hipóteses ilustrativas. Choque: spread base → s₁ especificado acima. "Caixa" = MtM zero.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MtmLftPlayer({ caso }: { caso: CaseMtmLft }) {
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState<MtmLftSaved>({ cpRespostas: {}, marcosLidos: [], simulador: null });

  useEffect(() => {
    setSaved(loadState());
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const cpMap = Object.fromEntries(caso.checkpoints.map((cp) => [cp.id, cp]));
  const totalCps = caso.checkpoints.length;
  const respondidos = Object.keys(saved.cpRespostas).length;

  const handleResponder = (cpId: string, opcaoId: string) => {
    setSaved((prev) => {
      const next = { ...prev, cpRespostas: { ...prev.cpRespostas, [cpId]: opcaoId } };
      saveState(next);
      return next;
    });
  };

  const handleMarcoRead = (id: string) => {
    setSaved((prev) => {
      if (prev.marcosLidos.includes(id)) return prev;
      const next = { ...prev, marcosLidos: [...prev.marcosLidos, id] };
      saveState(next);
      return next;
    });
  };

  const handleSimuladorChange = (s: SimuladorPersistedState) => {
    setSaved((prev) => {
      const next = { ...prev, simulador: s };
      saveState(next);
      return next;
    });
  };

  const handleRestart = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSaved({ cpRespostas: {}, marcosLidos: [], simulador: null });
  };

  const progressPct = totalCps > 0 ? (respondidos / totalCps) * 100 : 0;

  return (
    <div className="pb-16 max-w-3xl mx-auto">
      {/* Nav */}
      <div className="flex items-center justify-between mt-4">
        <Link
          href="/estudos-de-caso"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
        >
          ← Estudos de Caso
        </Link>
        <button
          onClick={handleRestart}
          className="text-[12px] font-semibold text-muted hover:text-ink transition-colors"
        >
          Recomeçar o caso
        </button>
      </div>

      {/* Header */}
      <div className="mt-4">
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: C.navy }}>
          {caso.titulo}
        </h1>
        <p className="mt-1 text-sm text-muted">{caso.subtitulo}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {["M3", "M4"].map((m) => <ModTag key={m} m={m} />)}
        </div>
      </div>

      {/* Aviso */}
      <div
        className="mt-5 rounded-lg border-l-4 p-4 text-sm"
        style={{ borderColor: C.red, background: "#F8ECEC" }}
      >
        <div className="font-bold mb-1" style={{ color: C.red }}>
          Enquadramento honesto
        </div>
        <p style={{ color: "#5a1a1a" }}>{caso.aviso}</p>
      </div>

      {/* Progresso */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[12px] text-muted mb-1">
          <span>{respondidos} de {totalCps} checkpoints respondidos</span>
          {respondidos === totalCps && totalCps > 0 && (
            <span className="font-bold" style={{ color: C.green }}>✓ Autópsia concluída</span>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-[#E8EDF3] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: C.teal }}
          />
        </div>
      </div>

      {/* Dados-âncora */}
      <section className="mt-10">
        <h2
          className="font-serif text-xl font-bold pb-2 border-b-[3px] mb-4"
          style={{ color: C.navy, borderColor: C.gold }}
        >
          Dados-âncora do caso (factuais)
        </h2>

        <h3 className="font-semibold mb-2 text-sm" style={{ color: C.teal }}>
          5.1 O choque macro de 2002
        </h3>
        <TabelaChoque />

        <h3 className="font-semibold mt-5 mb-2 text-sm" style={{ color: C.teal }}>
          5.2 O impacto nos fundos (FIF)
        </h3>
        <TabelaFundos />

        <h3 className="font-semibold mt-5 mb-2 text-sm" style={{ color: C.teal }}>
          5.3 Sensibilidade da LFT ao spread
        </h3>
        <TabelaSensibilidade />
      </section>

      {/* Simulador */}
      <section className="mt-10">
        <h2
          className="font-serif text-xl font-bold pb-2 border-b-[3px] mb-4"
          style={{ color: C.navy, borderColor: C.gold }}
        >
          O Simulador da LFT
        </h2>
        <div
          className="mb-4 rounded-lg border-l-4 p-3 text-sm"
          style={{ borderColor: C.gold, background: "#F5EEDD" }}
        >
          <p style={{ color: "#5a3a00" }}>
            <b>A fórmula oficial:</b>{" "}
            <code className="rounded px-1 py-0.5 text-[13px]" style={{ background: "#0F2A45", color: "#EAF0F6" }}>
              cotação = 100 / (1 + s)^(du/252)
            </code>
            {" "}— mova os sliders e veja a cotação e a perda de MtM reprecificarem ao vivo.
          </p>
        </div>
        <SimuladorLFT
          initialState={saved.simulador}
          onStateChange={handleSimuladorChange}
        />
      </section>

      {/* Autópsia Cronológica */}
      <section className="mt-10">
        <h2
          className="font-serif text-xl font-bold pb-2 border-b-[3px] mb-4"
          style={{ color: C.navy, borderColor: C.gold }}
        >
          Autópsia Cronológica — fev → dez/2002
        </h2>
        <p className="text-sm text-muted mb-5">
          Clique em cada marco para expandir. Marcos em{" "}
          <span className="font-bold" style={{ color: C.red }}>vermelho</span>{" "}
          disparam checkpoints.
        </p>
        <div className="relative">
          {caso.timeline.map((marco) => (
            <TimelineMarco
              key={marco.id}
              marco={marco}
              checkpoint={marco.cpId ? cpMap[marco.cpId] : undefined}
              cpResposta={marco.cpId ? saved.cpRespostas[marco.cpId] : undefined}
              onResponder={handleResponder}
              onMarcoRead={handleMarcoRead}
              isRead={saved.marcosLidos.includes(marco.id)}
            />
          ))}
        </div>
      </section>

      {/* Quadro-Espelho */}
      <section className="mt-12">
        <h2
          className="font-serif text-xl font-bold pb-2 border-b-[3px] mb-4"
          style={{ color: C.navy, borderColor: C.gold }}
        >
          Quadro-espelho: 2002 × Curso × SVB
        </h2>
        <QuadroEspelho linhas={caso.espelho} />
        <div
          className="mt-4 rounded-lg p-4 text-sm"
          style={{ background: "#F5EEDD", border: `1px solid ${C.gold}` }}
        >
          <b>A síntese do par:</b> 2002 e SVB são a mesma física de balanço — ativo longo + passivo curto + a
          regra que torna a perda visível no pior momento. Mudam a moeda, o instrumento e a década; não muda o ALM.{" "}
          <Link href="/estudos-de-caso/svb" className="font-semibold underline" style={{ color: C.teal }}>
            Ver caso SVB →
          </Link>
        </div>
      </section>

      {/* Reflexão */}
      <section className="mt-12">
        <h2
          className="font-serif text-xl font-bold pb-2 border-b-[3px] mb-2"
          style={{ color: C.navy, borderColor: C.gold }}
        >
          Pontos de Reflexão
        </h2>
        <p className="text-sm text-muted mb-4">
          Sem gabarito — o objetivo é o raciocínio. Perguntas de transferência para a sua prática.
        </p>
        <div className="space-y-3">
          {caso.reflexao.map((item, i) => (
            <ReflexaoCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* Fontes */}
      <section className="mt-12 pt-6 border-t" style={{ borderColor: "#C9CFD8" }}>
        <h3 className="font-semibold text-sm mb-2" style={{ color: C.navy }}>
          Fontes primárias
        </h3>
        <ul className="text-[12px] space-y-1" style={{ color: "#666" }}>
          <li>Banco Central do Brasil — Relatório Anual 2002</li>
          <li>Banco Central do Brasil — Relatórios de Inflação (jun, set/2002)</li>
          <li>Circular BCB 3.086/2002 — critérios de avaliação a valor de mercado e hedge contábil</li>
          <li>CVM Instrução 365/2002 — marcação a mercado de cotas de fundos</li>
          <li>CVM Instrução 375/2002 — flexibilização "mantidos até o vencimento"</li>
          <li>Carta-Circular BCB 2.929/2000 — vedação à avaliação pela curva/PU de compromissadas</li>
          <li>Tesouro Direto / B3 / ANBIMA — metodologia de cotação da LFT</li>
        </ul>
      </section>

      {/* Restart */}
      <div className="mt-8 text-center">
        <button
          onClick={handleRestart}
          className="rounded-xl border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-[#F4F6F9]"
          style={{ borderColor: "#C9CFD8", color: "#888" }}
        >
          Recomeçar o caso
        </button>
      </div>
    </div>
  );
}
