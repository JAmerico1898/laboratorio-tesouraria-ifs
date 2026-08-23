import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { pautas } from "@/data/mercado-hoje";
import { recortarCurva } from "@/lib/mercado/metricas";
import { MODULES } from "@/lib/modules";
import { snapshot } from "./fixture";
import type { MercadoSnapshot } from "@/lib/mercado/types";

const s: MercadoSnapshot = snapshot();

/** Curvas declaradas na §3.2 da spec — as 19, por família. */
const CURVAS_DECLARADAS = [
  "pre-zero", "di1", "ntnb-zero", "ntnb-tir", "dap", "ddi", "frc",
  "ltn-pu", "ntnf-pu", "ntnb-pu", "lft-pu",
  "fwd-pre", "fwd-di", "fwd-real", "fwd-implicita",
  "be-ntnb-pre", "be-ntnb-di", "spread-pre-di", "be-forward",
];

/** Etapas com menu de 4 alternativas — as Resoluções usam A/B/C. */
const etapasDeMenu = pautas.flatMap((p) => p.etapas.filter((e) => e.opcoes.length === 4));

describe("estrutura das pautas", () => {
  it("são 6 pautas: 2 intermediárias, 3 avançadas, 1 super desafio", () => {
    expect(pautas).toHaveLength(6);
    expect(pautas.filter((p) => p.nivel === "int")).toHaveLength(2);
    expect(pautas.filter((p) => p.nivel === "adv")).toHaveLength(3);
    expect(pautas.filter((p) => p.nivel === "sup")).toHaveLength(1);
  });

  it("etapas por pauta: >= 4, encadeadas (100%)", () => {
    for (const p of pautas) expect(p.etapas.length, p.codigo).toBeGreaterThanOrEqual(4);
  });

  it("encadeamento: todo `next` aponta para etapa existente, exceto na última (100%)", () => {
    for (const p of pautas) {
      const ids = new Set(p.etapas.map((e) => e.id));
      p.etapas.slice(0, -1).forEach((e) => {
        expect(ids.has(e.next), `${p.codigo}/${e.id} -> ${e.next}`).toBe(true);
      });
      expect(p.etapas.at(-1)!.next, p.codigo).toBe("");
    }
  });

  it("resolução presente: a última etapa é a Resolução, com 3 posições (100%)", () => {
    for (const p of pautas) {
      expect(p.etapas.at(-1)!.titulo, p.codigo).toContain("Resolução");
      expect(p.posicoes.map((x) => x.id), p.codigo).toEqual(["A", "B", "C"]);
      expect(["A", "B", "C"], p.codigo).toContain(p.posicaoCurso);
    }
  });

  it("cada etapa tem exatamente uma leitura do curso", () => {
    for (const p of pautas) {
      for (const e of p.etapas) {
        const n = e.opcoes.filter((o) => o.leituraCurso).length;
        expect(n, `${p.codigo}/${e.id}`).toBe(1);
      }
    }
  });

  it("ids de opção são únicos dentro da etapa", () => {
    for (const p of pautas) {
      for (const e of p.etapas) {
        expect(new Set(e.opcoes.map((o) => o.id)).size, `${p.codigo}/${e.id}`).toBe(
          e.opcoes.length,
        );
      }
    }
  });

  it("pontuação: 3 x 15 + 25 = 70 por pauta", () => {
    for (const p of pautas) {
      expect(p.etapas.reduce((t, e) => t + e.pontos, 0), p.codigo).toBe(p.pontuacaoMax);
      expect(p.pontuacaoMax, p.codigo).toBe(70);
    }
  });

  it("a Resolução da posição do curso é a marcada como leitura do curso", () => {
    for (const p of pautas) {
      const res = p.etapas.at(-1)!;
      expect(res.opcoes.find((o) => o.leituraCurso)!.id, p.codigo).toBe(p.posicaoCurso);
    }
  });
});

describe("antiviés", () => {
  it("posição: 18 etapas de menu, distribuição 5/5/4/4", () => {
    expect(etapasDeMenu).toHaveLength(18);
    const cont = [0, 0, 0, 0];
    for (const e of etapasDeMenu) cont[e.opcoes.findIndex((o) => o.leituraCurso)]++;
    expect(cont).toEqual([5, 5, 4, 4]);
    for (const c of cont) {
      expect(c).toBeGreaterThanOrEqual(4);
      expect(c).toBeLessThanOrEqual(5);
    }
  });

  it("comprimento: todo distrator a ±15% da leitura do curso (100%)", () => {
    for (const p of pautas) {
      for (const e of etapasDeMenu.filter((x) => p.etapas.includes(x))) {
        const alvo = e.opcoes.find((o) => o.leituraCurso)!.texto.length;
        for (const o of e.opcoes) {
          const desvio = Math.abs(o.texto.length - alvo) / alvo;
          expect(desvio, `${p.codigo}/${e.id}/${o.id} desvio ${(desvio * 100).toFixed(1)}%`)
            .toBeLessThanOrEqual(0.15);
        }
      }
    }
  });
});

describe("gabarito", () => {
  it("presente e completo: síntese, uma nota por etapa e glossário (100%)", () => {
    for (const p of pautas) {
      expect(p.gabarito.sintese.length, p.codigo).toBeGreaterThan(50);
      expect(p.gabarito.notas.map((n) => n.etapaId), p.codigo).toEqual(
        p.etapas.map((e) => e.id),
      );
      expect(p.gabarito.glossario.length, p.codigo).toBeGreaterThanOrEqual(6);
      for (const n of p.gabarito.notas) {
        expect(n.answer.length, `${p.codigo}/${n.etapaId}`).toBeGreaterThan(5);
        expect(n.rationale.length, `${p.codigo}/${n.etapaId}`).toBeGreaterThan(10);
      }
      for (const g of p.gabarito.glossario) {
        expect(g.termo.length, p.codigo).toBeGreaterThan(1);
        expect(g.definicao.length, `${p.codigo}/${g.termo}`).toBeGreaterThan(10);
      }
    }
  });

  it("parametrizado: todo `math` é função do snapshot, e não string (100%)", () => {
    for (const p of pautas) {
      for (const n of p.gabarito.notas) {
        expect(typeof n.math, `${p.codigo}/${n.etapaId}`).toBe("function");
        expect(n.math.length, `${p.codigo}/${n.etapaId}`).toBe(1);
      }
    }
  });

  it("todo `math` roda contra o snapshot e não devolve travessão solto", () => {
    for (const p of pautas) {
      for (const n of p.gabarito.notas) {
        const out = n.math(s);
        expect(typeof out, `${p.codigo}/${n.etapaId}`).toBe("string");
        expect(out.length, `${p.codigo}/${n.etapaId}`).toBeGreaterThan(20);
        expect(out, `${p.codigo}/${n.etapaId} tem valor não resolvido`).not.toMatch(/—/);
        expect(out, `${p.codigo}/${n.etapaId} tem NaN`).not.toMatch(/NaN/);
      }
    }
  });

  it("todo contrafactual é função, roda e produz número", () => {
    for (const p of pautas) {
      for (const pos of p.posicoes) {
        expect(typeof pos.contrafactual, `${p.codigo}/${pos.id}`).toBe("function");
        const out = pos.contrafactual(s);
        expect(out.length, `${p.codigo}/${pos.id}`).toBeGreaterThan(20);
        expect(out, `${p.codigo}/${pos.id}`).not.toMatch(/—|NaN/);
        expect(out, `${p.codigo}/${pos.id} sem número`).toMatch(/\d/);
      }
    }
  });
});

describe("painel e payload", () => {
  it("cobertura de curvas: as 19 da §3.2 estão no payload (100%)", () => {
    const presentes = new Set(s.curvas.map((c) => c.id));
    for (const id of CURVAS_DECLARADAS) expect(presentes.has(id), id).toBe(true);
    expect(s.curvas).toHaveLength(CURVAS_DECLARADAS.length);
  });

  it("toda curva tem vértices", () => {
    for (const c of s.curvas) expect(c.vertices.length, c.id).toBeGreaterThan(0);
  });

  it("convenção declarada: linear360 em DDI/FRC, du252 nas demais (100%)", () => {
    for (const c of s.curvas) {
      expect(c.convencao, c.id).toBe(c.id === "ddi" || c.id === "frc" ? "linear360" : "du252");
    }
  });

  it("nenhuma taxa fora de [-1, 2]", () => {
    for (const c of s.curvas) {
      if (c.unidade === "bps") continue;
      for (const v of c.vertices) {
        if (v.taxa === null) continue;
        expect(v.taxa, `${c.id}/${v.rotulo}`).toBeGreaterThanOrEqual(-1);
        expect(v.taxa, `${c.id}/${v.rotulo}`).toBeLessThanOrEqual(2);
      }
    }
  });

  it("toda curva declara o rótulo do eixo Y, e ele diz a unidade", () => {
    for (const c of s.curvas) {
      expect(c.rotuloY, c.id).toBeTruthy();
      // O eixo precisa dizer se está em % ou em bps — foi a ausência disso que
      // fez as curvas de preço renderizarem "0" no eixo.
      expect(c.rotuloY, c.id).toMatch(c.unidade === "bps" ? /\(bps\)/ : /%/);
    }
  });

  it("nenhuma curva plota PU: a série é sempre taxa ou bps", () => {
    for (const c of s.curvas) {
      expect(["taxa", "bps"], c.id).toContain(c.unidade);
      // Se fosse PU, os valores estariam na casa das centenas ou milhares.
      if (c.unidade === "taxa") {
        for (const v of c.vertices) {
          if (v.taxa !== null) expect(Math.abs(v.taxa), `${c.id}/${v.rotulo}`).toBeLessThan(2);
        }
      }
    }
  });

  it("vértices ordenados por dias úteis crescente", () => {
    for (const c of s.curvas) {
      const du = c.vertices.map((v) => v.diasUteis);
      expect(du, c.id).toEqual([...du].sort((a, b) => a - b));
    }
  });

  it("o 1º vencimento do DDI é marcado como distorcido pelo casado", () => {
    const ddi = s.curvas.find((c) => c.id === "ddi")!;
    expect(ddi.vertices[0].nota).toMatch(/casado/i);
  });

  it("break-even não extrapola: vértices sem par nominal ficam nulos", () => {
    const be = s.curvas.find((c) => c.id === "be-ntnb-pre")!;
    const pre = s.curvas.find((c) => c.id === "pre-zero")!;
    const alcance = Math.max(...pre.vertices.map((v) => v.diasUteis));
    for (const v of be.vertices) {
      if (v.diasUteis > alcance) expect(v.taxa, v.rotulo).toBeNull();
    }
    expect(be.vertices.some((v) => v.taxa === null)).toBe(true);
  });

  it("indicadores completos: nenhum nulo, e o VNA projetado de fato projeta", () => {
    const i = s.indicadores;
    for (const [k, v] of Object.entries(i)) {
      expect(v, `indicador ${k} nulo`).not.toBeNull();
    }
    // vna_projetado espera inflação em percentual e taxa_projetada devolve
    // decimal; trocar as unidades faz o projetado colar no publicado.
    expect(i.vnaNtnbProjetado).not.toBe(i.vnaNtnb);
    const variacao = i.vnaNtnbProjetado! / i.vnaNtnb! - 1;
    expect(Math.abs(variacao), "VNA projetado idêntico ao publicado").toBeGreaterThan(1e-6);
    expect(Math.abs(variacao), "VNA projetado fora de escala").toBeLessThan(0.05);
    // IPCA projetado é decimal mensal: |taxa| < 5% ao mês.
    expect(Math.abs(i.ipcaProjetado!)).toBeLessThan(0.05);
  });

  it("cada pauta abre numa curva que existe no payload", () => {
    const ids = new Set(s.curvas.map((c) => c.id));
    for (const p of pautas) {
      expect(ids.has(p.curvaInicial), `${p.codigo} curvaInicial`).toBe(true);
      const curva = s.curvas.find((c) => c.id === p.curvaInicial)!;
      expect(curva.familia, `${p.codigo} família`).toBe(p.familia);
      if (p.curvaComparacao) {
        expect(ids.has(p.curvaComparacao), `${p.codigo} curvaComparacao`).toBe(true);
      }
    }
  });

  it("todo chip da pauta resolve contra o snapshot", async () => {
    const { preencher } = await import("@/lib/mercado/template");
    for (const p of pautas) {
      for (const c of p.chips) {
        expect(preencher(c.v, s), `${p.codigo}/${c.k}`).not.toMatch(/—|\{\{/);
      }
    }
  });
});

describe("registro do módulo", () => {
  it("mercado-hoje entra como número 5, entre o módulo 4 e os estudos de caso", () => {
    const slugs = MODULES.map((m) => m.slug);
    expect(slugs.indexOf("mercado-hoje")).toBe(slugs.indexOf("modulo-4") + 1);
    expect(slugs.indexOf("estudos-de-caso")).toBe(slugs.indexOf("mercado-hoje") + 1);
  });

  it("estudos-de-caso vira número 6 e mantém o slug", () => {
    const ec = MODULES.find((m) => m.slug === "estudos-de-caso")!;
    expect(ec.numero).toBe(6);
    expect(ec.slug).toBe("estudos-de-caso");
  });

  it("a numeração continua sem buracos nem repetições", () => {
    expect(MODULES.map((m) => m.numero)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(MODULES.map((m) => m.id)).size).toBe(MODULES.length);
  });

  it("o módulo declara 6 simulações — as 6 pautas", () => {
    const m = MODULES.find((x) => x.slug === "mercado-hoje")!;
    expect(m.totalSimulacoes).toBe(pautas.length);
    expect(m.icon).toBe("insights");
    expect(m.disponivel).toBe(true);
  });
});

describe("recorte do painel — o que a etapa mostra é o que a etapa afirma", () => {
  const curvaDa = (pautaId: string, curvaId: string) => {
    const c = s.curvas.find((x) => x.id === curvaId);
    expect(c, `${pautaId}: curva ${curvaId} ausente no snapshot`).toBeDefined();
    return c!;
  };

  it("toda janela declarada deixa pelo menos 2 vértices na curva da pauta", () => {
    for (const p of pautas) {
      for (const e of p.etapas) {
        if (!e.janela) continue;
        const c = recortarCurva(curvaDa(p.codigo, p.curvaInicial), e.janela);
        expect(c.vertices.length, `${p.codigo}/${e.id}`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("todo destaque casa com um rótulo de vértice da curva da pauta", () => {
    for (const p of pautas) {
      for (const e of p.etapas) {
        for (const d of e.destaques ?? []) {
          const rotulos = curvaDa(p.codigo, p.curvaInicial).vertices.map((v) => v.rotulo);
          expect(rotulos, `${p.codigo}/${e.id}: destaque "${d}"`).toContain(d);
        }
      }
    }
  });

  it("todo destaque cai dentro da janela da própria etapa", () => {
    for (const p of pautas) {
      for (const e of p.etapas) {
        if (!e.janela || !e.destaques?.length) continue;
        const visiveis = recortarCurva(curvaDa(p.codigo, p.curvaInicial), e.janela).vertices.map(
          (v) => v.rotulo,
        );
        for (const d of e.destaques) {
          expect(visiveis, `${p.codigo}/${e.id}: destaque "${d}" fora da janela`).toContain(d);
        }
      }
    }
  });

  it("P5.2/etapa-1: no trecho exibido o prêmio é negativo em todos os vértices", () => {
    // A alternativa do curso afirma isso. Se o snapshot mudar de dia e o sinal
    // virar, o texto passa a mentir — e este teste falha antes do aluno ver.
    const e = pautas.find((p) => p.id === "p5-2")!.etapas[0];
    const c = recortarCurva(curvaDa("P5.2", "spread-pre-di"), e.janela);
    for (const v of c.vertices) expect(v.taxa, v.rotulo).toBeLessThan(0);
  });

  it("P5.2/etapa-1: entre as LTN destacadas o prêmio se aprofunda com o prazo", () => {
    const e = pautas.find((p) => p.id === "p5-2")!.etapas[0];
    const c = curvaDa("P5.2", "spread-pre-di");
    const taxas = e.destaques!.map((r) => c.vertices.find((v) => v.rotulo === r)!.taxa!);
    for (let i = 1; i < taxas.length; i++) {
      expect(taxas[i], e.destaques![i]).toBeLessThan(taxas[i - 1]);
    }
  });
});

describe("gabarito × snapshot — o que a função cita tem de existir", () => {
  const fonte = (id: string) =>
    fs.readFileSync(path.join(process.cwd(), "data", "mercado-hoje", `${id}.ts`), "utf-8");

  /** Chamadas `taxaDe(s, "curva", "rótulo")` e `getVertice(s, "curva", "rótulo")`. */
  const citacoes = (src: string) =>
    [...src.matchAll(/(?:taxaDe|getVertice)\(s,\s*"([\w-]+)",\s*"([^"]+)"\)/g)].map((m) => ({
      curva: m[1],
      rotulo: m[2],
    }));

  /** Todo id de curva que o arquivo da pauta toca, por qualquer helper. */
  const curvasCitadas = (src: string) =>
    new Set(
      [...src.matchAll(/(?:taxaDe|taxaPorDu|getVertice|getCurva)\(s,\s*"([\w-]+)"/g)].map(
        (m) => m[1],
      ),
    );

  it("todo rótulo citado no gabarito existe na curva do snapshot", () => {
    // A P5.4 citava `pre-zero/ago/28`, que não existe: o guard de NaN engolia o
    // número e o aluno lia a frase sem o valor. Um rótulo errado falha aqui.
    for (const p of pautas) {
      for (const { curva, rotulo } of citacoes(fonte(p.id))) {
        const c = s.curvas.find((x) => x.id === curva);
        expect(c, `${p.codigo}: curva ${curva}`).toBeDefined();
        const rotulos = c!.vertices.map((v) => v.rotulo);
        expect(rotulos, `${p.codigo}: rótulo "${rotulo}" em ${curva}`).toContain(rotulo);
      }
    }
  });

  it("a pauta abre na curva que o próprio gabarito usa", () => {
    // A P5.1 abria em `di1` e argumentava inteira sobre a `pre-zero`.
    for (const p of pautas) {
      expect([...curvasCitadas(fonte(p.id))], `${p.codigo}: curvaInicial`).toContain(
        p.curvaInicial,
      );
    }
  });

  it("nenhum contrafactual devolve travessão solto", () => {
    for (const p of pautas) {
      for (const pos of p.posicoes) {
        expect(pos.contrafactual(s), `${p.codigo}/${pos.id}`).not.toMatch(/(^|\s)—(\s|$)/);
      }
    }
  });
});
