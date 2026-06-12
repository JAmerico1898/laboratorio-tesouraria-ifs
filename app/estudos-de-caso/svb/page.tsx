import { svb } from "@/data/estudos-de-caso/svb";
import { SvbPlayer } from "@/components/cases/SvbPlayer";

export default function SvbPage() {
  return <SvbPlayer caso={svb} />;
}
