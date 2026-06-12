import Link from "next/link";
import type { CaseStudy } from "@/lib/types";
import { Icon } from "@/components/Icon";
import { DownloadExhibitsButton } from "./DownloadExhibitsButton";
import { Exhibit } from "./Exhibit";
import { GuidingQuestion } from "./GuidingQuestion";
import { InstructorPanel } from "./InstructorPanel";

export function CaseStudyPage({ caso }: { caso: CaseStudy }) {
  return (
    <div className="py-8">
      <Link
        href="/sintese"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
      >
        <Icon name="arrow_back" size={16} /> Síntese
      </Link>

      <header className="mt-5 rounded-2xl bg-tertiary-container p-6 text-tertiary-fixed sm:p-8">
        <div className="font-mono text-[12px] font-bold uppercase tracking-[0.14em]">
          {caso.modulo}
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{caso.titulo}</h1>
      </header>

      <section className="mt-8">
        <SectionTitle>Situação</SectionTitle>
        <div
          className="rich mt-3 text-[14.5px] leading-relaxed text-muted"
          dangerouslySetInnerHTML={{ __html: caso.situacao }}
        />
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {caso.chips.map((chip) => (
            <div
              key={chip}
              className="rounded-xl border border-border-soft bg-tertiary-fixed/30 px-4 py-3 text-sm font-bold text-secondary"
            >
              {chip}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionTitle>Exhibits</SectionTitle>
          <DownloadExhibitsButton caso={caso} />
        </div>
        <div className="mt-4 space-y-5">
          {caso.exhibits.map((exhibit) => (
            <Exhibit key={exhibit.id} exhibit={exhibit} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle>Perguntas norteadoras</SectionTitle>
        <div className="mt-4 space-y-3">
          {caso.perguntas.map((pergunta) => (
            <GuidingQuestion key={pergunta.id} pergunta={pergunta} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle>Entregável do aluno</SectionTitle>
        <div
          className="rich mt-3 rounded-r-xl border-l-4 border-tertiary-container bg-tertiary-fixed/30 px-5 py-4 text-sm text-muted"
          dangerouslySetInnerHTML={{ __html: caso.entregavel }}
        />
      </section>

      <div className="mt-8">
        <InstructorPanel debrief={caso.debrief} rubrica={caso.rubrica} />
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-tertiary">
      {children}
    </h2>
  );
}
