import type { Scenario } from "@/lib/types";
import { s3_1 } from "./s3-1";
import { s3_2 } from "./s3-2";
import { s3_3 } from "./s3-3";
import { s3_4 } from "./s3-4";

export const modulo3Scenarios: Scenario[] = [s3_1, s3_2, s3_3, s3_4];

export function getScenario(id: string): Scenario | undefined {
  return modulo3Scenarios.find((s) => s.id === id);
}
