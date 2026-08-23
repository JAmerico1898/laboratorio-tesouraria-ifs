import fs from "node:fs";
import path from "node:path";
import type { MercadoSnapshot } from "@/lib/mercado/types";

/**
 * Snapshot commitado. É a fixture de toda a suíte — nenhum teste toca a rede,
 * e é o mesmo arquivo que ancora as pautas em produção.
 */
export function snapshot(): MercadoSnapshot {
  const p = path.join(process.cwd(), "public", "data", "mercado-fallback.json");
  return JSON.parse(fs.readFileSync(p, "utf-8")) as MercadoSnapshot;
}
