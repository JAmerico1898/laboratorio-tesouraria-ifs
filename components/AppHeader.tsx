"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULES } from "@/lib/modules";
import { Icon } from "./Icon";

export function AppHeader() {
  const pathname = usePathname();

  const links: { href: string; label: string; highlight?: boolean }[] = [
    ...MODULES.map((m) => ({ href: `/${m.slug}`, label: m.nav })),
    { href: "/estudos-de-caso", label: "Estudos de Caso", highlight: true },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border-soft bg-surface/80 backdrop-blur-md shadow-[0_12px_32px_0_rgba(25,28,29,0.06)]">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-3 px-5">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary text-on-primary">
            <Icon name="account_balance" size={18} />
          </span>
          <span className="hidden sm:inline">Laboratório de Tesouraria</span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 overflow-x-auto text-[13px] font-semibold">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            if (l.highlight) {
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="ml-1 whitespace-nowrap rounded-lg bg-tertiary-container px-3 py-1.5 text-tertiary-fixed transition-opacity hover:opacity-90"
                >
                  {l.label}
                </Link>
              );
            }
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 transition-colors ${
                  active ? "bg-surface-container-high text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
