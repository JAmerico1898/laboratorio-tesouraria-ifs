import type { Scenario } from "@/lib/types";
import { s1_1 } from "./s1-1";
import { s1_2 } from "./s1-2";
import { s1_3 } from "./s1-3";
import { s1_4 } from "./s1-4";

export const modulo1Scenarios: Scenario[] = [s1_1, s1_2, s1_3, s1_4];

export function getScenario(id: string): Scenario | undefined {
  return modulo1Scenarios.find((s) => s.id === id);
}
