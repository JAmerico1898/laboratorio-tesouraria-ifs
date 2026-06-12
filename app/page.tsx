import Link from "next/link";
import { MODULES } from "@/lib/modules";
import { ModuleCard } from "@/components/ModuleCard";
import { MethodologyCards } from "@/components/MethodologyCards";
import { Icon } from "@/components/Icon";

export default function HomePage() {
  return (
    <div className="pb-10">
      {/* Hero */}
      <section className="py-12 sm:py-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Laboratório de Tesouraria de Instituições Financeiras
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
          Simulações interativas para a aprendizagem prática das operações de tesouraria em
          instituições financeiras — matemática financeira, estrutura temporal das taxas,
          apreçamento e gestão de risco.
        </p>
      </section>

      <MethodologyCards />

      {/* Grid de módulos */}
      <section className="pt-12">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          Acesse os módulos clicando abaixo
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <ModuleCard key={m.id} mod={m} />
          ))}

          {/* Card especial: Síntese */}
          <Link
            href="/sintese"
            className="flex flex-col rounded-2xl bg-secondary-container p-5 text-on-secondary-container shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/60 text-secondary">
              <Icon name="menu_book" size={22} />
            </div>
            <h3 className="mt-4 text-[17px] font-bold text-on-secondary-container">
              Síntese
            </h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-on-secondary-container/85">
              Casos abertos que integram os tópicos de cada módulo, com diagnóstico, análise e
              encaminhamento.
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-bold text-secondary">
              Acessar casos <Icon name="arrow_forward" size={16} />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
