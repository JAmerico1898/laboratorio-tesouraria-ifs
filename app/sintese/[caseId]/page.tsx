import { notFound } from "next/navigation";
import { casos, getCase } from "@/data/estudos-de-caso";
import { CaseStudyPage } from "@/components/cases/CaseStudyPage";

export function generateStaticParams() {
  return casos.map((caso) => ({ caseId: caso.id }));
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const caso = getCase(caseId);
  if (!caso) notFound();

  return <CaseStudyPage caso={caso} />;
}
