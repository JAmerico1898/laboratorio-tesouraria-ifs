import { notFound } from "next/navigation";
import { getPauta, pautas } from "@/data/mercado-hoje";
import { PautaPlayer } from "@/components/mercado/PautaPlayer";

export function generateStaticParams() {
  return pautas.map((p) => ({ pautaId: p.id }));
}

export default async function PautaPage({
  params,
}: {
  params: Promise<{ pautaId: string }>;
}) {
  const { pautaId } = await params;
  if (!getPauta(pautaId)) notFound();
  // Só o id atravessa a fronteira: a pauta carrega funções (`math`,
  // `contrafactual`) que o RSC não serializa.
  return <PautaPlayer pautaId={pautaId} />;
}
