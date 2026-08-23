import { describe, expect, it } from "vitest";
import { bpsFmt, brl, dataBr, num, pct, preencher } from "@/lib/mercado/template";
import { snapshot } from "./fixture";

const s = snapshot();

describe("formatadores", () => {
  it("formata taxas em pt-BR", () => {
    expect(pct(0.137391)).toBe("13,7391%");
    expect(pct(0.14, 2)).toBe("14,00%");
  });

  it("rende travessão para valores ausentes ou não finitos", () => {
    expect(pct(null)).toBe("—");
    expect(pct(undefined)).toBe("—");
    expect(pct(NaN)).toBe("—");
    expect(num(Infinity)).toBe("—");
    expect(bpsFmt(NaN)).toBe("—");
    expect(brl(NaN)).toBe("—");
    expect(dataBr(null)).toBe("—");
  });

  it("formata datas em DD/MM/AAAA", () => {
    expect(dataBr("2026-08-21")).toBe("21/08/2026");
  });
});

describe("preencher", () => {
  it("resolve marcador por dias úteis", () => {
    expect(preencher("PRE 28 du = {{pre-zero.28.taxa}}", s)).toBe("PRE 28 du = 13,7391%");
  });

  it("resolve marcador por rótulo com espaços e barra", () => {
    expect(preencher("{{ntnb-tir.NTN-B 2035.taxa}}", s)).toBe("7,8962%");
    expect(preencher("{{spread-pre-di.LTN jul/27.taxa}}", s)).toBe("-28,00 bps");
    expect(preencher("{{be-ntnb-pre.mai/27.taxa}}", s)).toBe("6,1016%");
  });

  it("resolve indicadores e datas", () => {
    expect(preencher("{{ind.selicMeta}}", s)).toBe("14,00%");
    expect(preencher("{{ind.ptax}}", s)).toBe("5,1625");
    expect(preencher("{{ind.dataEfetiva}}", s)).toBe("21/08/2026");
  });

  it("resolve campos que não são taxa", () => {
    expect(preencher("{{ntnb-tir.NTN-B 2035.duration}}", s)).toBe("6,65");
    expect(preencher("{{pre-zero.28.du}}", s)).toBe("28");
  });

  it("marcador ausente vira travessão, nunca a chave crua", () => {
    const out = preencher("x = {{pre-zero.99999.taxa}}", s);
    expect(out).toBe("x = —");
    expect(out).not.toContain("{{");
  });

  it("curva inexistente também vira travessão", () => {
    expect(preencher("{{curva-que-nao-existe.28.taxa}}", s)).toBe("—");
  });

  it("marcador malformado não lança", () => {
    expect(() => preencher("{{}}", s)).not.toThrow();
    expect(() => preencher("{{sozinho}}", s)).not.toThrow();
    expect(() => preencher("{{a.b}}", s)).not.toThrow();
    expect(preencher("{{ind.campoInexistente}}", s)).toBe("—");
  });

  it("texto sem marcador passa intacto", () => {
    expect(preencher("nada aqui", s)).toBe("nada aqui");
  });

  it("resolve vários marcadores na mesma frase", () => {
    expect(preencher("{{ind.selicMeta}} e {{ind.diOver}}", s)).toBe("14,00% e 13,90%");
  });
});
