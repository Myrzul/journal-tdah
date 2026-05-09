"use client";

import type { ReactNode } from "react";

type Props = {
  num: 1 | 2 | 3 | 4 | 5;
  title: string;
  rubColor: string;
  children: ReactNode;
};

export function GuidePhaseCard({ num, title, rubColor, children }: Props) {
  return (
    <div className="guide-phase-card" style={{ ["--rub-color" as string]: rubColor }}>
      <div className="guide-phase-card-head">
        <span className="guide-phase-card-num">Phase {num}</span>
        <h3 className="guide-phase-card-title">{title}</h3>
      </div>
      <div className="guide-phase-card-body">{children}</div>
    </div>
  );
}
