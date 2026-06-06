import { notFound } from "next/navigation";
import { modulo4Scenarios, getScenario } from "@/data/modulo-4";
import { ScenarioPlayer } from "@/components/ScenarioPlayer";

export function generateStaticParams() {
  return modulo4Scenarios.map((s) => ({ scenarioId: s.id }));
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
      <ScenarioPlayer scenario={scenario} />
    </div>
  );
}
