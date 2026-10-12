import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  cdiEsperadoFocus,
  diVsFocus,
  focusSelicReuniao,
  juroRealExAnte,
  neutroNominal,
  rotuloFocus,
  selicImplicita,
  spreadOver,
} from "@/lib/mercado/ancoras";
import { interpolar } from "@/lib/mercado/metricas";
import type { Ancoras, Vertice } from "@/lib/mercado/types";

/** Dados reais de 09/10/2026 — Apêndice A da spec do card. Nenhum teste toca a rede. */
const fx = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "tests", "fixtures", "ancoras-2026-10-09.json"), "utf-8"),
) as {
  indicadores: { selicMeta: number; diOver: number };
  di1: [string, number, number][];
  ancoras: Ancoras;
};

const ind = fx.indicadores;
const a = fx.ancoras;
const di: Vertice[] = fx.di1.map(([rotulo, diasUteis, taxa]) => ({
  rotulo,
  vencimento: "",
  diasUteis,
  taxa,
}));

/** Tolerância da spec: 0,1 bp. */
const perto = (obtido: number | null | undefined, esperado: number, tol = 1e-5) => {
  expect(obtido).not.toBeNull();
  expect(Math.abs((obtido as number) - esperado), `${obtido} vs ${esperado}`).toBeLessThanOrEqual(tol);
};

describe("âncoras — valores de ouro de 09/10/2026", () => {
  it("spreadOver e neutroNominal", () => {
    perto(spreadOver(ind), 0.001, 1e-12);
    perto(neutroNominal(0.05, 0.03), 0.0815, 1e-12);
  });

  it("selicImplicita nas 2 próximas reuniões", () => {
    const [r7, r8] = selicImplicita(di, a, ind);
    expect(r7!.reuniao.id).toBe("R7/2026");
    expect(r7!.contrato).toBe("DI1Z26");
    perto(r7!.selic, 0.13526);
    perto(r7!.movimentoBps, -22.4, 0.1);
    expect(r7!.focus).toBe(0.135);

    expect(r8!.reuniao.id).toBe("R8/2026");
    expect(r8!.contrato).toBe("DI1F27");
    perto(r8!.selic, 0.13325);
    perto(r8!.movimentoBps, -20.1, 0.1);
    expect(r8!.focus).toBe(0.135);
  });

  it.each([
    [56, 0.13476],
    [179, 0.13247],
    [307, 0.12863],
    [431, 0.1245],
    [555, 0.12041],
  ])("cdiEsperadoFocus em %i DU", (du, esperado) => {
    perto(cdiEsperadoFocus(du, a, ind), esperado);
  });

  it("diVsFocus: 5 linhas, com diferença, leitura e marca de estimada", () => {
    const linhas = diVsFocus(di, a, ind);
    expect(linhas.map((l) => l.rotulo)).toEqual(["F27", "N27", "F28", "N28", "F29"]);
    [-3.6, -26.5, -33.5, -13.8, 18.3].forEach((d, i) => perto(linhas[i].difBps, d, 0.1));
    expect(linhas.map((l) => l.leitura)).toEqual([
      "alinhados",
      "mercado mais dovish",
      "mercado mais dovish",
      "mercado mais dovish",
      "curva acima do Focus",
    ]);
    expect(linhas.map((l) => l.estimada)).toEqual([false, false, false, true, true]);
  });

  it("juroRealExAnte: DI de 252 DU contra o IPCA 12 meses", () => {
    perto(interpolar(di, 252), 0.12701);
    perto(juroRealExAnte(di, a.focus!.ipca12m), 0.07754);
  });

  it("focusSelicReuniao cai na mediana anual quando o Focus não cobre a reunião", () => {
    const r7de28 = a.reunioes.find((r) => r.id === "R7/2028")!;
    expect(r7de28.focusSelic).toBeNull();
    expect(focusSelicReuniao(r7de28, a.focus)).toBe(0.105);
    expect(focusSelicReuniao(r7de28, null)).toBeNull();
  });
});

describe("âncoras — bordas", () => {
  const semFocus: Ancoras = { ...a, focus: null };

  it("sem Focus: CDI esperado nulo e tabela sem leitura, sem lançar", () => {
    expect(cdiEsperadoFocus(179, semFocus, ind)).toBeNull();
    const linhas = diVsFocus(di, semFocus, ind);
    expect(linhas).toHaveLength(5);
    for (const l of linhas) {
      expect(l.focus).toBeNull();
      expect(l.difBps).toBeNull();
      expect(l.leitura).toBeNull();
    }
    expect(juroRealExAnte(di, null)).toBeNull();
  });

  it("Focus que não cobre uma reunião anterior ao prazo devolve nulo", () => {
    const furado: Ancoras = {
      ...a,
      focus: { ...a.focus!, selicAnual: {} },
      reunioes: a.reunioes.map((r) => ({ ...r, focusSelic: null })),
    };
    expect(cdiEsperadoFocus(179, furado, ind)).toBeNull();
    // Antes da 1ª reunião não há Focus a consultar: vale o DI over do dia.
    perto(cdiEsperadoFocus(10, furado, ind), ind.diOver, 1e-12);
  });

  it("selicImplicita sem vértice DI dentro do regime devolve nulo na posição", () => {
    const semZ26 = di.filter((v) => v.diasUteis <= 17 || v.diasUteis > 41);
    expect(selicImplicita(semZ26, a, ind)).toEqual([null, null]);

    const semF27 = di.filter((v) => v.diasUteis <= 41 || v.diasUteis > 74);
    const [r7, r8] = selicImplicita(semF27, a, ind);
    expect(r7!.contrato).toBe("DI1Z26");
    expect(r8).toBeNull();
  });

  it("selicImplicita sem reuniões ou sem indicadores não lança", () => {
    expect(selicImplicita(di, { ...a, reunioes: [] }, ind)).toEqual([null, null]);
    expect(selicImplicita(di, a, { selicMeta: null, diOver: null })).toEqual([null, null]);
    expect(spreadOver({ selicMeta: 0.1375, diOver: null })).toBeNull();
    expect(cdiEsperadoFocus(56, a, { selicMeta: null, diOver: 0.1365 })).toBeNull();
    expect(juroRealExAnte([], 0.045)).toBeNull();
  });

  it("rotuloFocus nos limites exatos de ±10 bps é alinhados", () => {
    expect(rotuloFocus(-10)).toBe("alinhados");
    expect(rotuloFocus(10)).toBe("alinhados");
    expect(rotuloFocus(-10.01)).toBe("mercado mais dovish");
    expect(rotuloFocus(10.01)).toBe("curva acima do Focus");
  });
});
