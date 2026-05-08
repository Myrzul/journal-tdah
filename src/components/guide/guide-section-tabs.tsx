"use client";

import {
  type RubriqueMeta,
  SECTION_ORDER,
  SECTION_SHORT_LABELS,
  type SectionId,
} from "@/lib/guide/guide-types";

type Props = {
  rubrique: RubriqueMeta;
  active: SectionId;
  readSections: SectionId[];
  onChange: (next: SectionId) => void;
};

export function GuideSectionTabs({
  rubrique,
  active,
  readSections,
  onChange,
}: Props) {
  return (
    <div className="guide-section-tabs" style={{ ["--rub-color" as string]: rubrique.cssColor }}>
      {SECTION_ORDER.map((id) => {
        const isOn = id === active;
        const isRead = readSections.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`guide-section-tab ${isOn ? "is-on" : ""} ${isRead ? "is-read" : ""}`}
            aria-current={isOn ? "page" : undefined}
          >
            <span className="guide-section-tab-dot" aria-hidden="true">
              {isRead ? "●" : "○"}
            </span>
            <span className="guide-section-tab-label">{SECTION_SHORT_LABELS[id]}</span>
          </button>
        );
      })}
    </div>
  );
}
