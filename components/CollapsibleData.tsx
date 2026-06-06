"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function CollapsibleData({ titulo, corpo }: { titulo: string; corpo: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-3 overflow-hidden rounded-xl border border-border-soft bg-surface-container-lowest">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-primary"
      >
        <span>{titulo}</span>
        <Icon name={open ? "remove" : "add"} className="text-muted" size={18} />
      </button>
      {open && (
        <div
          className="rich border-t border-border-soft px-4 py-3 text-[13.5px] leading-relaxed text-muted"
          dangerouslySetInnerHTML={{ __html: corpo }}
        />
      )}
    </div>
  );
}
