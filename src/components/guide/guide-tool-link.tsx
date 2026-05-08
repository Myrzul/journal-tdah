"use client";

import Link from "next/link";
import type { IconComponent } from "@/components/icons";

type Props = {
  href: string;
  icon: IconComponent;
  iconColor?: string;
  title: string;
  sub: string;
  /** Phrase de statut additionnelle (ex « Tu en as déjà saisi 5 »). */
  status?: string;
  rubColor: string;
};

export function GuideToolLink({
  href,
  icon: Icon,
  iconColor,
  title,
  sub,
  status,
  rubColor,
}: Props) {
  return (
    <Link
      href={href}
      className="guide-tool-link"
      style={{ ["--rub-color" as string]: rubColor }}
    >
      <span className="guide-tool-link-icon">
        <Icon size={28} color={iconColor ?? rubColor} stroke={2.4} />
      </span>
      <span className="guide-tool-link-body">
        <span className="guide-tool-link-eyebrow">Outil intégré</span>
        <span className="guide-tool-link-title">{title}</span>
        <span className="guide-tool-link-sub">{sub}</span>
        {status && <span className="guide-tool-link-status">{status}</span>}
      </span>
      <span className="guide-tool-link-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
