import { Icon } from "./Icon";

const STEPS = [
  {
    n: 1,
    icon: "menu_book",
    tone: "secondary" as const,
    titulo: "Seleção do Módulo",
    desc: "Escolha entre os 4 módulos do curso de operações de tesouraria em instituições financeiras.",
  },
  {
    n: 2,
    icon: "account_tree",
    tone: "secondary" as const,
    titulo: "Análise de Cenários",
    desc: "Percorra simulações com árvore decisória: contexto, etapas e reflexão final.",
  },
  {
    n: 3,
    icon: "verified",
    tone: "tertiary" as const,
    titulo: "Validação Técnica",
    desc: "Avalie impactos financeiros, ganhe pontos e consolide o raciocínio com rigor analítico.",
  },
];

export function MethodologyCards() {
  return (
    <section className="py-4">
      <h2 className="text-center text-2xl font-extrabold text-ink">Metodologia de Aprendizado</h2>
      <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-secondary" />

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="rounded-2xl border border-border-soft bg-surface-container-lowest p-6 text-center shadow-sm"
          >
            <div
              className={`mx-auto grid h-12 w-12 place-items-center rounded-xl ${
                s.tone === "tertiary"
                  ? "bg-tertiary-container text-tertiary-fixed"
                  : "bg-secondary text-on-secondary"
              }`}
            >
              <Icon name={s.icon} size={24} />
            </div>
            <div className="mt-4 text-[15px] font-bold text-secondary">
              {s.n}. {s.titulo}
            </div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
