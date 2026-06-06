import { getModule } from "@/lib/modules";
import { ComingSoon } from "@/components/ComingSoon";

export default function Modulo3Page() {
  const mod = getModule("modulo-3")!;
  return (
    <ComingSoon
      kicker={`Módulo ${mod.numero}`}
      titulo={mod.titulo}
      descricao={mod.descricao}
      objetivos={mod.objetivos}
    />
  );
}
