import Link from "next/link";
import { getModule } from "@/lib/modules";
import { pautas } from "@/data/mercado-hoje";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Icon } from "@/components/Icon";
import { PainelMercado } from "@/components/mercado/PainelMercado";

export const metadata = {
  title: "Mercado Hoje — Curvas, Taxas e Preços",
};

export default function MercadoHojePage() {
  const mod = getModule("mercado-hoje")!;

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
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">
        Uma sala de consulta ao vivo: escolha a curva e leia-a em tela — a mesma que a mesa olhou
        naquele dia. Não é um simulador com resposta certa; é a fonte de dados que sustenta o
        debate, com pautas guiadas para não olhar o gráfico sem saber o que procurar.
      </p>

      {/* O painel funciona sozinho, sem nenhuma pauta aberta — é o modo consulta. */}
      <div className="mt-8">
        <PainelMercado />
      </div>

      <div className="mt-10 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        Pautas de debate
      </div>
      <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-muted">
        Cada pauta abre o painel pré-configurado na curva que discute e conduz quatro etapas
        encadeadas — <b>Observação → Interpretação → Implicação → Resolução</b>. As alternativas
        são leituras concorrentes do mesmo dado: uma é a leitura que o curso sustenta, e as
        demais recebem o contraditório. Nenhuma resposta subtrai pontos.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {pautas.map((p) => (
          <Link
            key={p.id}
            href={`/mercado-hoje/${p.id}`}
            className="flex flex-col rounded-2xl border border-border-soft bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary-container/50 text-secondary">
                <Icon name={p.icon} size={22} />
              </div>
              <DifficultyBadge level={p.nivel} />
            </div>
            <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-secondary">
              {p.codigo}
            </div>
            <h3 className="mt-0.5 text-[17px] font-bold text-ink">{p.titulo}</h3>
            <div className="mt-auto flex items-center justify-between border-t border-border-soft pt-3 text-[12px] text-muted">
              <span>{p.duracaoMin} min · {p.etapas.length} etapas</span>
              <span className="font-bold text-ink">{p.pontuacaoMax} pontos</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
