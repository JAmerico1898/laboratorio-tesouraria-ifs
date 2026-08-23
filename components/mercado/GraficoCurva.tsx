"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BANDA_INFERIOR, BANDA_SUPERIOR, META_INFLACAO } from "@/lib/mercado/config";
import { dataBr, num, pct } from "@/lib/mercado/template";
import type { Curva } from "@/lib/mercado/types";

// Cores da paleta congelada em app/globals.css — nenhum token novo (§2).
const COR_PRINCIPAL = "#00314a"; // --color-primary
// A segunda curva é vermelha e tracejada: matiz e traço são dois canais
// distintos, então a discriminação sobrevive ao daltonismo e ao projetor.
const COR_COMPARACAO = "#ba1a1a"; // --color-error
// Meta e bandas saem do vermelho para o cinza de contorno: são limiares, não
// séries, e disputariam a leitura com a curva de comparação na família
// Inflação implícita — que é justamente onde a Pauta 4 sobrepõe duas curvas.
const COR_REFERENCIA = "#6f7976"; // --color-outline
const COR_DESTAQUE = "#006b5f"; // --color-secondary

type Ponto = { x: number; rotulo: string; vencimento: string; a: number | null; b?: number | null };

function montar(curva: Curva, comparacao: Curva | undefined, eixoData: boolean): Ponto[] {
  const chave = (du: number, venc: string) => (eixoData ? Date.parse(venc) : du);
  const mapa = new Map<number, Ponto>();

  for (const v of curva.vertices) {
    if (v.taxa === null) continue;
    const x = chave(v.diasUteis, v.vencimento);
    mapa.set(x, { x, rotulo: v.rotulo, vencimento: v.vencimento, a: v.taxa });
  }
  if (comparacao) {
    for (const v of comparacao.vertices) {
      if (v.taxa === null) continue;
      const x = chave(v.diasUteis, v.vencimento);
      const p = mapa.get(x);
      if (p) p.b = v.taxa;
      else mapa.set(x, { x, rotulo: v.rotulo, vencimento: v.vencimento, a: null, b: v.taxa });
    }
  }
  return [...mapa.values()].sort((p, q) => p.x - q.x);
}

function formatarValor(v: number | null | undefined, curva: Curva): string {
  if (v === null || v === undefined) return "—";
  return curva.unidade === "bps" ? `${num(v)} bps` : pct(v, 4);
}

export function GraficoCurva({
  curva,
  comparacao,
  eixoData,
  destaques = [],
  altura = 320,
}: {
  curva: Curva;
  comparacao?: Curva;
  eixoData: boolean;
  /** Rótulos de vértices citados no gabarito, marcados com linha vertical. */
  destaques?: string[];
  altura?: number;
}) {
  const dados = montar(curva, comparacao, eixoData);
  const metaVisivel = curva.familia === "implicita" && curva.unidade === "taxa";

  const xTick = (x: number) =>
    eixoData ? dataBr(new Date(x).toISOString().slice(0, 10)).slice(3) : String(x);
  const yTick = (v: number) => (curva.unidade === "bps" ? num(v, 0) : pct(v, 2));

  const marcados = dados.filter((p) => destaques.includes(p.rotulo));

  return (
    <div className="w-full" style={{ height: altura }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e6e6" />
          <XAxis
            dataKey="x"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={xTick}
            tick={{ fontSize: 11, fill: "#6f7976" }}
            label={{
              value: eixoData ? "Vencimento" : "Dias úteis",
              position: "insideBottom",
              offset: -2,
              style: { fontSize: 11, fill: "#6f7976" },
            }}
          />
          <YAxis
            tickFormatter={yTick}
            tick={{ fontSize: 11, fill: "#6f7976" }}
            // Na família Inflação implícita o eixo é forçado a conter a meta e a
            // banda superior: sem isso elas caem fora da escala e o aluno não vê
            // o que a pauta manda comparar.
            domain={
              metaVisivel
                ? [
                    (min: number) => Math.min(min, META_INFLACAO),
                    (max: number) => Math.max(max, BANDA_SUPERIOR),
                  ]
                : ["auto", "auto"]
            }
            width={78}
            label={{
              value: curva.rotuloY,
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: "#6f7976", textAnchor: "middle" },
            }}
          />
          <Tooltip
            formatter={(v, nome) => [
              formatarValor(typeof v === "number" ? v : null, nome === curva.nome ? curva : (comparacao ?? curva)),
              String(nome),
            ]}
            labelFormatter={(x) => {
              const p = dados.find((d) => d.x === x);
              return p ? `${p.rotulo} · ${dataBr(p.vencimento)}` : String(x);
            }}
            contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#e2e6e6" }}
            cursor={{ stroke: "#6f7976", strokeDasharray: "3 3" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />

          {metaVisivel && (
            <>
              <ReferenceLine
                y={META_INFLACAO}
                stroke={COR_REFERENCIA}
                strokeDasharray="6 4"
                label={{
                  value: `meta ${pct(META_INFLACAO, 2)}`,
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: COR_REFERENCIA,
                }}
              />
              <ReferenceLine
                y={BANDA_SUPERIOR}
                stroke={COR_REFERENCIA}
                strokeDasharray="2 4"
                label={{
                  value: `banda ${pct(BANDA_SUPERIOR, 2)}`,
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: COR_REFERENCIA,
                }}
              />
              <ReferenceLine y={BANDA_INFERIOR} stroke={COR_REFERENCIA} strokeDasharray="2 4" />
            </>
          )}

          {marcados.map((p) => (
            <ReferenceLine key={p.rotulo} x={p.x} stroke={COR_DESTAQUE} strokeDasharray="4 4" />
          ))}

          <Line
            type="monotone"
            dataKey="a"
            name={curva.nome}
            stroke={COR_PRINCIPAL}
            strokeWidth={2}
            dot={{ r: 2.5 }}
            // O vértice sob o cursor ganha um anel branco: o aluno vê em qual
            // ponto da curva o tooltip está lendo, não só o valor.
            activeDot={{ r: 5, fill: COR_PRINCIPAL, stroke: "#ffffff", strokeWidth: 2 }}
            connectNulls
            isAnimationActive={false}
          />
          {comparacao && (
            <Line
              type="monotone"
              dataKey="b"
              name={comparacao.nome}
              stroke={COR_COMPARACAO}
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={{ r: 2.5 }}
              activeDot={{ r: 5, fill: COR_COMPARACAO, stroke: "#ffffff", strokeWidth: 2 }}
              connectNulls
              isAnimationActive={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <p className="mt-1 text-[11px] text-muted">
        Convenção:{" "}
        {curva.convencao === "linear360"
          ? "linear, base 360 dias corridos"
          : "exponencial, DU/252"}{" "}
        · Fonte: {curva.fonte}
        {comparacao && comparacao.convencao !== curva.convencao && (
          <>
            {" "}
            · {comparacao.nome}:{" "}
            {comparacao.convencao === "linear360" ? "linear 360" : "DU/252"}
          </>
        )}
      </p>
    </div>
  );
}
