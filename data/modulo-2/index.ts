import type { Scenario } from "@/lib/types";
import { s2_1 } from "./s2-1";
import { s2_2 } from "./s2-2";
import { s2_3 } from "./s2-3";
import { s2_4 } from "./s2-4";

export const modulo2Scenarios: Scenario[] = [s2_1, s2_2, s2_3, s2_4];

export function getScenario(id: string): Scenario | undefined {
  return modulo2Scenarios.find((s) => s.id === id);
}
