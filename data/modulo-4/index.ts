import type { Scenario } from "@/lib/types";
import { s4_1 } from "./s4-1";
import { s4_2 } from "./s4-2";
import { s4_3 } from "./s4-3";
import { s4_4 } from "./s4-4";

export const modulo4Scenarios: Scenario[] = [s4_1, s4_2, s4_3, s4_4];

export function getScenario(id: string): Scenario | undefined {
  return modulo4Scenarios.find((s) => s.id === id);
}
