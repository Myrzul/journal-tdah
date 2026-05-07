"use client";

import Link from "next/link";
import { IconHome, type IconComponent } from "@/components/icons";
import { cn } from "@/lib/utils/cn";
import { TABS, type TabId } from "./tabs-config";

type TabsNavProps = {
  /** L'ID de l'onglet courant. `null` = on est sur le hub (`/`). */
  current: TabId | null;
};

type NavItem = {
  href: string;
  id: TabId | "hub";
  label: string;
  icon: IconComponent;
  cssColor: string;
  hex: string;
};

const HUB_ITEM: NavItem = {
  href: "/",
  id: "hub",
  label: "Accueil",
  icon: IconHome,
  cssColor: "var(--ch-evolution)",
  hex: "#14B8A6",
};

export function TabsNav({ current }: TabsNavProps) {
  const items: NavItem[] = [
    HUB_ITEM,
    ...TABS.map((t) => ({
      href: `/${t.id}`,
      id: t.id,
      label: t.label,
      icon: t.icon,
      cssColor: t.cssColor,
      hex: t.hex,
    })),
  ];

  return (
    <nav className="tabs-nav" aria-label="Navigation principale">
      {items.map((it) => {
        const Ic = it.icon;
        const isOn = it.id === "hub" ? current === null : it.id === current;
        return (
          <Link
            key={it.id}
            href={it.href}
            className={cn("tab-btn", isOn && "on")}
            style={{ ["--tab-color" as string]: it.cssColor }}
            aria-current={isOn ? "page" : undefined}
            aria-label={it.label}
            title={it.label}
          >
            <Ic
              size={24}
              color={isOn ? it.hex : "var(--ink-2)"}
              stroke={isOn ? 2.4 : 2}
            />
          </Link>
        );
      })}
    </nav>
  );
}
