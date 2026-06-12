import Link from "next/link";
import { Icon } from "@/components/Icon";

const casos = [
  {
    id: "meridiano",
    titulo: "Banco Meridiano — A semana do ALCO",
    subtitulo: "Caso-síntese integrador",
    descricao:
      "Do diagnóstico macro ao parecer ao ALCO: mobilize os quatro módulos numa decisão real de balanço.",
    modulos: ["M1", "M2", "M3", "M4"],
    duracaoMin: 45,
    href: "/estudos-de-caso/meridiano",
  },
  {
    id: "mtm-lft",
    titulo: "2002: a LFT que parecia caixa",
    subtitulo: "Material Extra · Caso Real · Simulador",
    descricao:
      "Um título pós-fixado à Selic perdeu −3,11% com a Selic subindo. Simule ao vivo e entenda o spread duration — o segundo fator de risco que derrubou os fundos DI em 2002.",
    modulos: ["M3", "M4"],
    duracaoMin: 50,
    href: "/estudos-de-caso/mtm-lft",
  },
  {
    id: "svb",
    titulo: "SVB: Autópsia de um Colapso de ALM",
    subtitulo: "Material Extra · Caso Real",
    descricao:
      "Autópsia cronológica do Silicon Valley Bank (2019–2023): como a soma de falhas de duration, hedge, EVE e funding levou ao colapso em 48 horas.",
    modulos: ["M1", "M2", "M3", "M4"],
    duracaoMin: 60,
    href: "/estudos-de-caso/svb",
  },
];

const moduloCores: Record<string, string> = {
  M1: "#2E5E8C",
  M2: "#1F6F6F",
  M3: "#B07D2B",
  M4: "#7A4E8C",
};

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
      <p className="mt-2 text-base text-muted">
        Casos narrativos que integram os quatro módulos em decisões reais de tesouraria.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {casos.map((caso) => (
          <article
            key={caso.id}
            className="flex flex-col rounded-2xl border border-border-soft bg-surface-container-lowest p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-[11px] font-semibold uppercase text-muted">
                {caso.subtitulo}
              </span>
              {caso.modulos.map((m) => (
                <span
                  key={m}
                  className="rounded-full px-2 py-0.5 text-[11px] font-extrabold text-white"
                  style={{ backgroundColor: moduloCores[m] }}
                >
                  {m}
                </span>
              ))}
            </div>

            <h2 className="mt-3 text-[17px] font-bold text-ink">{caso.titulo}</h2>
            <p className="mt-1.5 text-sm text-muted">{caso.descricao}</p>

            <div className="mt-3 flex items-center gap-1 text-[13px] text-muted">
              <Icon name="schedule" size={15} />
              <span>~{caso.duracaoMin} min</span>
            </div>

            <Link
              href={caso.href}
              className="mt-6 flex w-fit items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-colors hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#1F3A5F" }}
            >
              Iniciar caso <Icon name="arrow_forward" size={18} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
