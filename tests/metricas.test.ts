import { describe, expect, it } from "vitest";
import {
  breakeven,
  forward,
  interpolar,
  inversoes,
  leituraRapida,
  recortarCurva,
  rotuloFormato,
} from "@/lib/mercado/metricas";
import { DU_ANO } from "@/lib/mercado/config";
import type { Curva, Vertice } from "@/lib/mercado/types";

const v = (du: number, taxa: number | null): Vertice => ({
  rotulo: `v${du}`,
  vencimento: "2027-01-01",
  diasUteis: du,
  taxa,
});

const curva = (vertices: Vertice[], extra: Partial<Curva> = {}): Curva => ({
  id: "teste",
  familia: "taxas",
  nome: "Curva de teste",
  fonte: "B3",
  unidade: "taxa",
  rotuloY: "Taxa (% a.a.)",
  convencao: "du252",
  vertices,
  ...extra,
});

describe("forward — fórmula DU/252", () => {
  it("reproduz o caso fechado de dois vértices com a mesma taxa", () => {
    // Curva plana: o forward entre quaisquer dois vértices é a própria taxa.
    expect(forward(252, 504, 0.1, 0.1)).toBeCloseTo(0.1, 12);
  });

  it("recompõe a taxa longa a partir da curta e do forward", () => {
    const du1 = 252;
    const du2 = 756;
    const t1 = 0.1374;
    const t2 = 0.1351;
    const f = forward(du1, du2, t1, t2);
    const recomposta =
      ((1 + t1) ** (du1 / DU_ANO) * (1 + f) ** ((du2 - du1) / DU_ANO)) ** (DU_ANO / du2) - 1;
    expect(recomposta).toBeCloseTo(t2, 12);
  });

  it("dá forward abaixo do spot quando a curva é invertida", () => {
    expect(forward(252, 504, 0.14, 0.13)).toBeLessThan(0.13);
  });

  it("recusa intervalo não crescente", () => {
    expect(() => forward(504, 252, 0.1, 0.1)).toThrow(RangeError);
    expect(() => forward(252, 252, 0.1, 0.1)).toThrow(RangeError);
  });
});

describe("rotuloFormato — os três regimes e os limites de ±25 bps", () => {
  it("classifica positiva, plana e invertida", () => {
    expect(rotuloFormato(120)).toBe("positivamente inclinada");
    expect(rotuloFormato(0)).toBe("plana");
    expect(rotuloFormato(-120)).toBe("invertida");
  });

  it("trata o limiar como estritamente aberto", () => {
    expect(rotuloFormato(24.99)).toBe("plana");
    expect(rotuloFormato(-24.99)).toBe("plana");
    expect(rotuloFormato(25)).toBe("positivamente inclinada");
    expect(rotuloFormato(-25)).toBe("invertida");
  });
});

describe("inversoes", () => {
  it("não acha nenhuma em curva monotonicamente crescente", () => {
    expect(inversoes(curva([v(21, 0.1), v(63, 0.11), v(252, 0.12)]))).toHaveLength(0);
  });

  it("acha exatamente uma no trecho descendente de uma curva em U", () => {
    const inv = inversoes(curva([v(28, 0.1374), v(213, 0.1351), v(278, 0.1377)]));
    expect(inv).toHaveLength(1);
    expect(inv[0].de.diasUteis).toBe(28);
    expect(inv[0].para.diasUteis).toBe(213);
  });

  it("não acha nenhuma em curva perfeitamente plana", () => {
    expect(inversoes(curva([v(21, 0.1), v(63, 0.1), v(252, 0.1)]))).toHaveLength(0);
  });

  it("acha todas em curva monotonicamente decrescente", () => {
    expect(inversoes(curva([v(21, 0.14), v(63, 0.13), v(252, 0.12)]))).toHaveLength(2);
  });

  it("ignora vértices sem taxa", () => {
    expect(inversoes(curva([v(21, 0.14), v(63, null), v(252, 0.12)]))).toHaveLength(1);
  });
});

describe("leituraRapida", () => {
  it("resume nível, inclinação, formato e contagem", () => {
    const l = leituraRapida(curva([v(28, 0.1374), v(213, 0.1351), v(278, 0.1377)]))!;
    expect(l.inclinacaoBps).toBeCloseTo(3, 1);
    expect(l.formato).toBe("plana");
    expect(l.inversoes).toHaveLength(1);
    expect(l.nVertices).toBe(3);
    expect(l.duMin).toBe(28);
    expect(l.duMax).toBe(278);
  });

  it("não multiplica por 10.000 uma curva já em bps", () => {
    const l = leituraRapida(
      curva([v(28, -8.79), v(213, -28)], { unidade: "bps" }),
    )!;
    expect(l.inclinacaoBps).toBeCloseTo(-19.21, 6);
  });

  it("devolve null com menos de dois vértices", () => {
    expect(leituraRapida(curva([v(28, 0.1)]))).toBeNull();
  });
});

describe("interpolar — flat forward, sem extrapolar", () => {
  it("devolve a própria taxa num vértice observado", () => {
    const vs = [v(252, 0.1374), v(504, 0.1351)];
    expect(interpolar(vs, 252)).toBeCloseTo(0.1374, 12);
    expect(interpolar(vs, 504)).toBeCloseTo(0.1351, 12);
  });

  it("fica entre os dois vértices no meio do intervalo", () => {
    const t = interpolar([v(252, 0.14), v(504, 0.12)], 378)!;
    expect(t).toBeLessThan(0.14);
    expect(t).toBeGreaterThan(0.12);
  });

  it("não extrapola: fora do intervalo devolve o vértice extremo", () => {
    const vs = [v(252, 0.14), v(504, 0.12)];
    expect(interpolar(vs, 10)).toBeCloseTo(0.14, 12);
    expect(interpolar(vs, 5000)).toBeCloseTo(0.12, 12);
  });

  it("devolve null sem vértices com taxa", () => {
    expect(interpolar([v(252, null)], 300)).toBeNull();
  });
});

describe("breakeven", () => {
  it("aplica Fisher exato, não a diferença simples", () => {
    const be = breakeven(0.1374, 0.07);
    expect(be).toBeCloseTo((1 + 0.1374) / (1 + 0.07) - 1, 12);
    expect(be).toBeLessThan(0.1374 - 0.07);
  });

  it("é zero quando nominal e real coincidem", () => {
    expect(breakeven(0.08, 0.08)).toBeCloseTo(0, 12);
  });
});

describe("recortarCurva — o trecho que a etapa discute", () => {
  const c = curva([v(28, 0.14), v(213, 0.13), v(1090, 0.12), v(2595, 0.11)]);

  it("sem janela, devolve a curva intacta", () => {
    expect(recortarCurva(c)).toBe(c);
    expect(recortarCurva(c, {})).toBe(c);
  });

  it("corta pelos dois extremos, inclusive", () => {
    expect(recortarCurva(c, { duMin: 28, duMax: 213 }).vertices.map((x) => x.diasUteis)).toEqual([
      28, 213,
    ]);
  });

  it("aceita janela aberta de um lado só", () => {
    expect(recortarCurva(c, { duMax: 213 }).vertices).toHaveLength(2);
    expect(recortarCurva(c, { duMin: 1090 }).vertices).toHaveLength(2);
  });

  it("janela vazia devolve a curva inteira em vez de um painel em branco", () => {
    expect(recortarCurva(c, { duMin: 9000 })).toBe(c);
  });

  it("não muta a curva original", () => {
    recortarCurva(c, { duMax: 28 });
    expect(c.vertices).toHaveLength(4);
  });
});
