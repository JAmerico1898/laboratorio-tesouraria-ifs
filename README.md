# Laboratório de Tesouraria — Instituições Financeiras

Aplicação de simulações interativas para o curso **Operações de Tesouraria em Instituições
Financeiras** (Prof. José Américo). Visualmente idêntico ao *Laboratório de Tesouraria de Empresas*
(mesma identidade Material 3 + Inter/Manrope).

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** com tema Material 3 (tokens extraídos do app de referência)
- Fontes: **Inter** (corpo) + **Manrope** (títulos) + **Material Symbols Outlined** (ícones)
- Deploy: **Vercel**

## Estrutura

```
app/            # rotas (home, modulo-1..4, estudos-de-caso, contato)
  modulo-1/[scenarioId]/  # player de simulação (S1.1–S1.4)
components/      # AppHeader, ScenarioPlayer, EtapaQuestion, Encruzilhada, ...
data/modulo-1/   # conteúdo das 4 simulações (tipado) — nenhum texto fixo nos componentes
lib/             # types.ts (Scenario) + modules.ts (metadados dos módulos)
```

Regra de ouro: os componentes **só renderizam** o objeto `Scenario`. Todo enunciado, alternativa,
feedback, chip e ramo vem dos arquivos `data/modulo-1/s1-*.ts`.

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
```

## Status do conteúdo

- **Módulo 1** — completo (4 simulações jogáveis, placar /85).
- **Módulos 2–4** e **Estudos de Caso** — placeholders ("em breve").

## Módulo 5 — Mercado Hoje

Painel de consulta às curvas do dia (`pyield` via função Python na Vercel) mais 6 pautas
de debate. As pautas são **ancoradas em 21/08/2026**: suas árvores de decisão afirmam
fatos qualitativos sobre a curva ("desenha um U", "acima da banda") que só valem naquele
dia, então elas leem `public/data/mercado-fallback.json`, enquanto o painel livre é ao vivo.

```bash
npm run snapshot   # regenera o snapshot commitado (requer Python + pyield>=0.56.1)
npm run verify     # portão de entrega: typecheck + testes/evals com cobertura + build
```

`npm run verify` roda os evals quantitativos em `tests/evals.test.ts` (estrutura das pautas,
encadeamento, antiviés de posição 5/5/4/4 e de comprimento ±15%, cobertura das 19 curvas,
convenções DU/252 × linear 360) e a suíte de fidelidade WinAnsi do PDF do gabarito.
