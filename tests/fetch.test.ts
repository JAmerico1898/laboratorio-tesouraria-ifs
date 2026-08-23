import { describe, expect, it } from "vitest";
import { hojeIso, paraCsv } from "@/lib/mercado/fetch";

describe("paraCsv", () => {
  it("usa ponto e vírgula, o separador que o Excel pt-BR espera", () => {
    expect(paraCsv(["a", "b"], [[1, 2]])).toBe("a;b\r\n1;2");
  });

  it("escapa aspas, ponto e vírgula e quebra de linha", () => {
    expect(paraCsv(["x"], [['diz "oi"']])).toBe('x\r\n"diz ""oi"""');
    expect(paraCsv(["x"], [["a;b"]])).toBe('x\r\n"a;b"');
    expect(paraCsv(["x"], [["a\nb"]])).toBe('x\r\n"a\nb"');
  });

  it("rende célula vazia para nulo, e não a string 'null'", () => {
    expect(paraCsv(["a", "b"], [[null, 0]])).toBe("a;b\r\n;0");
  });

  it("aceita tabela sem linhas", () => {
    expect(paraCsv(["a"], [])).toBe("a");
  });
});

describe("hojeIso", () => {
  it("devolve YYYY-MM-DD com zero à esquerda", () => {
    expect(hojeIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("usa a data local, não UTC", () => {
    const d = new Date();
    const esperado = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
    expect(hojeIso()).toBe(esperado);
  });
});
