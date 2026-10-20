import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname) },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["lib/mercado/**/*.ts", "lib/gabarito-pdf.ts"],
      // types.ts é só declaração de tipo: não tem linha executável.
      exclude: ["lib/mercado/types.ts"],
      thresholds: { lines: 80 },
    },
  },
});
