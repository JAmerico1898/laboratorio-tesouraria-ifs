import Link from "next/link";
import { notFound } from "next/navigation";
import { modulo1Scenarios, getScenario } from "@/data/modulo-1";
import { ScenarioPlayer } from "@/components/ScenarioPlayer";
import { Icon } from "@/components/Icon";

export function generateStaticParams() {
  return modulo1Scenarios.map((s) => ({ scenarioId: s.id }));
}

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;
  const scenario = getScenario(scenarioId);
  if (!scenario) notFound();

  return (
    <div className="py-8">
      <Link
        href="/modulo-1"
        className="mb-5 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
      >
        <Icon name="arrow_back" size={16} /> Módulo 1
      </Link>
      <ScenarioPlayer scenario={scenario} />
    </div>
  );
}
