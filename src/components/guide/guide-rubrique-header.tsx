"use client";

import { Umbrella } from "@/components/monsters";
import type { RubriqueMeta } from "@/lib/guide/guide-types";

type Props = {
  rubrique: RubriqueMeta;
};

export function GuideRubriqueHeader({ rubrique }: Props) {
  return (
    <div
      className="guide-rubrique-header"
      style={{ background: rubrique.cssColor }}
    >
      <div className="guide-rubrique-header-umbrella">
        <Umbrella color="white" size={64} />
      </div>
      <div className="guide-rubrique-header-num">{rubrique.id}</div>
      <h1 className="guide-rubrique-header-title">{rubrique.title}</h1>
      <p className="guide-rubrique-header-hook">{rubrique.hook}</p>
    </div>
  );
}
