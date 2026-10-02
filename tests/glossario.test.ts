import { describe, expect, it } from "vitest";
import { FAMILIAS } from "@/lib/mercado/config";
import { GLOSSARIO } from "@/lib/mercado/glossario";
import { snapshot } from "./fixture";

describe("glossário do Painel de Mercado", () => {
  const s = snapshot();

  it("explica as quatro famílias, na ordem das abas", () => {
    expect(GLOSSARIO.map((g) => g.familia)).toEqual(FAMILIAS.map((f) => f.id));
    for (const g of GLOSSARIO) expect(g.descricao.length).toBeGreaterThan(40);
  });

  it("explica cada curva do snapshot, na família em que ela aparece", () => {
    for (const c of s.curvas) {
      const g = GLOSSARIO.find((x) => x.familia === c.familia);
      const verbete = g?.curvas.find((v) => v.id === c.id);
      expect(verbete, `${c.familia}/${c.id}`).toBeDefined();
      expect(verbete!.nome).toBe(c.nome);
      expect(verbete!.texto.length).toBeGreaterThan(40);
    }
  });

  it("não explica curva que o painel não tem", () => {
    const ids = new Set(s.curvas.map((c) => c.id));
    for (const g of GLOSSARIO) for (const v of g.curvas) expect(ids.has(v.id), v.id).toBe(true);
  });
});
