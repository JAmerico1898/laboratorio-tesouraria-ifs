"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MODULES } from "@/lib/modules";
import { Icon } from "./Icon";

// Módulos que aparecem agrupados no menu "Recursos" em vez de links próprios.
const RECURSOS = ["animacoes", "simulacoes"];

type NavItem =
  | { kind: "link"; href: string; label: string; highlight?: boolean }
  | { kind: "recursos" };

export function AppHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const items: NavItem[] = [];
  for (const m of MODULES) {
    if (!RECURSOS.includes(m.slug)) {
      items.push({ kind: "link", href: `/${m.slug}`, label: m.nav });
    } else if (!items.some((i) => i.kind === "recursos")) {
      items.push({ kind: "recursos" });
    }
  }
  items.push({ kind: "link", href: "/sintese", label: "Síntese", highlight: true });

  const recursos = MODULES.filter((m) => RECURSOS.includes(m.slug));
  const recursosActive = recursos.some((m) => isActive(`/${m.slug}`));

  // O <nav> rola na horizontal e cortaria um painel absoluto; por isso o painel é fixed,
  // posicionado pelo retângulo do botão.
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => setPos(null), [pathname]);

  useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !btnRef.current?.contains(t)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [pos]);

  const toggle = () => {
    if (pos) return setPos(null);
    const r = btnRef.current!.getBoundingClientRect();
    setPos({ left: r.left, top: r.bottom + 6 });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border-soft bg-surface/80 backdrop-blur-md shadow-[0_12px_32px_0_rgba(25,28,29,0.06)]">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-3 px-5">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/finlab-logo-white.jpg"
            alt="FinLab"
            className="h-8 w-auto rounded"
          />
          <span className="hidden sm:inline">Laboratório de Tesouraria</span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 overflow-x-auto text-[13px] font-semibold">
          {items.map((l) => {
            if (l.kind === "recursos") {
              return (
                <button
                  key="recursos"
                  ref={btnRef}
                  type="button"
                  onClick={toggle}
                  aria-haspopup="menu"
                  aria-expanded={!!pos}
                  className={`inline-flex items-center gap-0.5 whitespace-nowrap rounded-lg px-3 py-1.5 transition-colors ${
                    recursosActive || pos
                      ? "bg-surface-container-high text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Recursos
                  <Icon name={pos ? "expand_less" : "expand_more"} size={18} />
                </button>
              );
            }
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
                  isActive(l.href) ? "bg-surface-container-high text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {pos && (
        <div
          ref={panelRef}
          role="menu"
          style={{ left: pos.left, top: pos.top }}
          className="fixed z-50 min-w-[220px] rounded-xl border border-border-soft bg-surface-container-lowest p-1.5 shadow-lg"
        >
          {recursos.map((m) => (
            <Link
              key={m.slug}
              href={`/${m.slug}`}
              role="menuitem"
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
                isActive(`/${m.slug}`)
                  ? "bg-surface-container-high text-ink"
                  : "text-muted hover:bg-surface-container-high hover:text-ink"
              }`}
            >
              <Icon name={m.icon} size={18} className="text-secondary" />
              {m.titulo}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
