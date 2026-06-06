import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 bg-primary text-on-primary">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-extrabold">Laboratório de Tesouraria</div>
          <div className="text-[13px] text-on-primary-container">
            © 2026 Laboratório de Tesouraria de Instituições Financeiras. Todos os direitos reservados.
          </div>
          <div className="text-[13px] text-on-primary-container">Prof. José Américo · FGV</div>
        </div>
        <Link
          href="/contato"
          className="text-[13px] font-bold text-tertiary-fixed hover:underline"
        >
          Dúvidas, Sugestões: Entre em contato
        </Link>
      </div>
    </footer>
  );
}
