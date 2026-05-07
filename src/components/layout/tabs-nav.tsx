"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { TABS, type TabId } from "./tabs-config";

type TabsNavProps = {
  current: TabId | null;
};

export function TabsNav({ current }: TabsNavProps) {
  return (
    <nav className="tabs-nav" aria-label="Sections du journal">
      {TABS.map((t) => {
        const Ic = t.icon;
        const on = t.id === current;
        return (
          <Link
            key={t.id}
            href={`/${t.id}`}
            className={cn("tab-btn", on && "on")}
            style={{ ["--tab-color" as string]: t.cssColor }}
            aria-current={on ? "page" : undefined}
          >
            <span className="tab-dot" style={{ background: t.hex }} />
            <Ic size={14} color={on ? "var(--ink)" : "var(--ink-2)"} />
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
