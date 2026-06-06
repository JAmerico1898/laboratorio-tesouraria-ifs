import type { CaseStudy } from "@/lib/types";
import { caso1 } from "./caso-1";
import { caso2 } from "./caso-2";
import { caso3 } from "./caso-3";
import { caso4 } from "./caso-4";

export const casos: CaseStudy[] = [caso1, caso2, caso3, caso4];

export function getCase(id: string): CaseStudy | undefined {
  return casos.find((caso) => caso.id === id);
}
