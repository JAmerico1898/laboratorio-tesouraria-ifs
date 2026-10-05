import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ANIMACOES, SIMULADORES } from "@/lib/recursos";
import { MODULES } from "@/lib/modules";

const pub = (...p: string[]) => path.join(process.cwd(), "public", ...p);

describe("animações pedagógicas", () => {
  it("cada animação registrada tem o HTML em public/animacoes", () => {
    for (const a of ANIMACOES) expect(fs.existsSync(pub("animacoes", `${a.slug}.html`))).toBe(true);
  });

  it("todo HTML em public/animacoes está registrado", () => {
    const files = fs.readdirSync(pub("animacoes")).map((f) => f.replace(/\.html$/, ""));
    expect(files.sort()).toEqual(ANIMACOES.map((a) => a.slug).sort());
  });

  it("distribuição por módulo segue a lista do professor", () => {
    const por = (n: number) => ANIMACOES.filter((a) => a.modulo === n).length;
    expect([por(1), por(2), por(3), por(4)]).toEqual([2, 5, 3, 2]);
  });

  it("o módulo declara o total de animações", () => {
    expect(MODULES.find((m) => m.slug === "animacoes")!.totalSimulacoes).toBe(ANIMACOES.length);
  });
});

describe("simulações em Excel", () => {
  it("cada simulador registrado tem o .xlsx em public/simulacoes", () => {
    for (const s of SIMULADORES) expect(fs.existsSync(pub("simulacoes", s.arquivo))).toBe(true);
  });

  it("todo .xlsx em public/simulacoes está registrado", () => {
    expect(fs.readdirSync(pub("simulacoes")).sort()).toEqual(SIMULADORES.map((s) => s.arquivo).sort());
  });

  it("nomes de arquivo são ASCII (URLs de download seguras)", () => {
    for (const s of SIMULADORES) expect(s.arquivo).toMatch(/^[a-z0-9-]+\.xlsx$/);
  });

  it("distribuição por módulo segue a lista do professor", () => {
    const por = (n: number) => SIMULADORES.filter((s) => s.modulo === n).length;
    expect([por(1), por(2), por(3), por(4)]).toEqual([1, 7, 4, 3]);
  });

  it("o módulo declara o total de simuladores", () => {
    expect(MODULES.find((m) => m.slug === "simulacoes")!.totalSimulacoes).toBe(SIMULADORES.length);
  });
});
