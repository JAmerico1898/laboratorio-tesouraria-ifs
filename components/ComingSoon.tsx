import Link from "next/link";
import { Icon } from "./Icon";

export function ComingSoon({
  kicker,
  titulo,
  descricao,
  objetivos,
}: {
  kicker: string;
  titulo: string;
  descricao: string;
  objetivos?: string[];
}) {
  return (
    <div className="py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
      >
        <Icon name="arrow_back" size={16} /> Início
      </Link>

      <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
        {kicker}
      </div>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{titulo}</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{descricao}</p>

      {objetivos && objetivos.length > 0 && (
        <>
          <div className="mt-8 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Objetivos de aprendizagem
          </div>
          <ul className="mt-3 space-y-2">
            {objetivos.map((o, i) => (
              <li key={i} className="flex gap-2.5 text-[14.5px] text-muted">
                <Icon name="check_circle" size={18} className="mt-0.5 shrink-0 text-secondary" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-10 inline-flex items-center gap-2 rounded-xl border border-border-soft bg-surface-container-low px-5 py-3 text-[14px] font-semibold text-muted">
        <Icon name="schedule" size={18} className="text-secondary" />
        Conteúdo em desenvolvimento — disponível em breve.
      </div>
    </div>
  );
}
