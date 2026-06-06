import Link from "next/link";
import { casos } from "@/data/estudos-de-caso";
import { Icon } from "@/components/Icon";

export default function EstudosDeCasoPage() {
  return (
    <div className="pb-10">
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
      >
        <Icon name="arrow_back" size={16} /> Início
      </Link>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Estudos de Caso
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {casos.map((caso) => (
          <article
            key={caso.id}
            className="flex flex-col rounded-2xl border border-border-soft bg-surface-container-lowest p-5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-tertiary-fixed px-2.5 py-1 text-[11px] font-extrabold uppercase text-on-tertiary-fixed">
                {caso.modulo}
              </span>
            </div>
            <h2 className="mt-3 text-[17px] font-bold text-ink">{caso.titulo}</h2>
            <Link
              href={`/estudos-de-caso/${caso.id}`}
              className="mt-6 flex w-fit items-center gap-2 rounded-xl bg-tertiary-container px-6 py-2.5 text-sm font-bold text-tertiary-fixed transition-colors hover:bg-tertiary active:scale-95"
            >
              Abrir caso <Icon name="arrow_forward" size={18} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
