import type { Pauta } from "@/lib/types";
import { p5_1 } from "./p5-1";
import { p5_2 } from "./p5-2";
import { p5_3 } from "./p5-3";
import { p5_4 } from "./p5-4";
import { p5_5 } from "./p5-5";
import { p5_6 } from "./p5-6";

export const pautas: Pauta[] = [p5_1, p5_2, p5_3, p5_4, p5_5, p5_6];

export function getPauta(id: string): Pauta | undefined {
  return pautas.find((p) => p.id === id);
}
