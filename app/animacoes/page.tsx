import Link from "next/link";
import { getModule } from "@/lib/modules";
import { ANIMACOES, MODULOS_RECURSOS } from "@/lib/recursos";
import { Icon } from "@/components/Icon";

export const metadata = {
  title: "Animações Pedagógicas",
};

export default function AnimacoesPage() {
  const mod = getModule("animacoes")!;

  return (
    <div className="pb-10">
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
      >
        <Icon name="arrow_back" size={16} /> Início
      </Link>

      <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
        Módulo {mod.numero}
      </div>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {mod.titulo}
      </h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">{mod.descricao}</p>

      {MODULOS_RECURSOS.map((g) => (
        <section key={g.numero}>
          <div className="mt-10 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Módulo {g.numero} · {g.nome}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ANIMACOES.filter((a) => a.modulo === g.numero).map((a) => (
              <a
                key={a.slug}
                href={`/animacoes/${a.slug}.html`}
                target="_blank"
                rel="noopener"
                className="flex flex-col rounded-2xl border border-border-soft bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary-container/50 text-secondary">
                  <Icon name="play_circle" size={22} />
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-ink">{a.titulo}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{a.descricao}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-bold text-secondary">
                  Abrir animação <Icon name="open_in_new" size={16} />
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
