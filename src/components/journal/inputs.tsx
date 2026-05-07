"use client";

import type { IconProps } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

/* =================================================================
   FIELDS — text + textarea
   ================================================================= */
type FieldProps = {
  value: string | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
};

export function Field({ value, onChange, placeholder, multiline, rows = 1, className }: FieldProps) {
  if (multiline) {
    return (
      <textarea
        className={cn("field", className)}
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      className={cn("field", className)}
      type="text"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function FreeArea({ value, onChange, placeholder }: Omit<FieldProps, "multiline" | "rows">) {
  return (
    <textarea
      className="free-area"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/* =================================================================
   SCALE — 1 à 5 dots
   ================================================================= */
type ScaleProps = {
  value: number | undefined;
  onChange: (v: number) => void;
  labelLow?: string;
  labelHigh?: string;
  max?: number;
};

export function Scale({
  value,
  onChange,
  labelLow = "BAS",
  labelHigh = "HAUT",
  max = 5,
}: ScaleProps) {
  return (
    <div className="scale">
      <div className="scale-labels">
        <span>{labelLow}</span>
        <span>{labelHigh}</span>
      </div>
      <div className="scale-dots">
        {Array.from({ length: max }, (_, i) => (
          <button
            key={i}
            type="button"
            className={cn("s-dot", (value ?? 0) > i && "on")}
            onClick={() => onChange(i + 1)}
            aria-label={`${i + 1}/${max}`}
          />
        ))}
      </div>
    </div>
  );
}

/* =================================================================
   EMOTION GRID
   ================================================================= */
type EmoItem = {
  id: string;
  label: string;
  illu: React.ComponentType<{ color: string }>;
  color?: string;
};

type EmoGridProps = {
  items: EmoItem[];
  value: string | null | undefined;
  onChange: (v: string | null) => void;
};

export function EmoGrid({ items, value, onChange }: EmoGridProps) {
  return (
    <div className="emo-grid">
      {items.map((it) => {
        const Illu = it.illu;
        const on = value === it.id;
        const monsterColor = it.color ?? "#FF8AB8";
        return (
          <button
            key={it.id}
            type="button"
            className={cn("emo-cell", on && "on")}
            onClick={() => onChange(on ? null : it.id)}
          >
            <span className="emo-illu">
              <Illu color={on ? "white" : monsterColor} />
            </span>
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* =================================================================
   CHIPS (multi-select) + OPT (single-select)
   ================================================================= */
export type ChoiceItem =
  | string
  | {
      id: string;
      label: string;
      icon?: React.ComponentType<IconProps>;
    };

const idOf = (it: ChoiceItem) => (typeof it === "string" ? it : it.id);
const labelOf = (it: ChoiceItem) => (typeof it === "string" ? it : it.label);
const iconOf = (it: ChoiceItem) => (typeof it === "string" ? null : it.icon);

type ChipsProps = {
  items: ChoiceItem[];
  value?: string[];
  onChange: (v: string[]) => void;
};

export function Chips({ items, value = [], onChange }: ChipsProps) {
  return (
    <div className="chips">
      {items.map((it) => {
        const id = idOf(it);
        const label = labelOf(it);
        const Icon = iconOf(it);
        const on = value.includes(id);
        return (
          <button
            key={id}
            type="button"
            className={cn("chip", on && "on")}
            onClick={() => onChange(on ? value.filter((v) => v !== id) : [...value, id])}
          >
            {Icon && (
              <span className="chip-ic">
                <Icon size={14} color={on ? "white" : "var(--ink)"} />
              </span>
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

type OptProps = {
  items: ChoiceItem[];
  value: string | null | undefined;
  onChange: (v: string | null) => void;
};

export function Opt({ items, value, onChange }: OptProps) {
  return (
    <div className="opt-row">
      {items.map((it) => {
        const id = idOf(it);
        const label = labelOf(it);
        const Icon = iconOf(it);
        const on = value === id;
        return (
          <button
            key={id}
            type="button"
            className={cn("opt-btn", on && "on")}
            onClick={() => onChange(on ? null : id)}
          >
            {Icon && (
              <span className="ic">
                <Icon size={14} color={on ? "white" : "var(--ink)"} />
              </span>
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* =================================================================
   CHECKLIST
   ================================================================= */
type ChecklistProps = {
  items: ChoiceItem[];
  value?: string[];
  onChange: (v: string[]) => void;
};

export function Checklist({ items, value = [], onChange }: ChecklistProps) {
  return (
    <div className="checklist">
      {items.map((it) => {
        const id = idOf(it);
        const label = labelOf(it);
        const Icon = iconOf(it);
        const on = value.includes(id);
        return (
          <button
            type="button"
            key={id}
            className={cn("check-row", on && "on")}
            onClick={() => onChange(on ? value.filter((v) => v !== id) : [...value, id])}
          >
            {Icon && (
              <span className="ic">
                <Icon size={20} color={on ? "white" : "var(--ink)"} stroke={2.4} />
              </span>
            )}
            <span>{label}</span>
            <span className="check-box">{on ? "✓" : ""}</span>
          </button>
        );
      })}
    </div>
  );
}

/* =================================================================
   PRIORITÉ ROW + PROG3 + PILLAR GRID
   ================================================================= */
type PrioRowProps = {
  tag: string;
  klass: "t1" | "t2" | "t3";
  value: string | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function PrioRow({ tag, klass, value, onChange, placeholder }: PrioRowProps) {
  return (
    <div className="prio-row">
      <span className={cn("prio-tag", klass)}>{tag}</span>
      <input
        className="field"
        style={{ marginTop: 0, flex: 1 }}
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

type Prog3Props = {
  value: 0 | 1 | 2 | null | undefined;
  onChange: (v: 0 | 1 | 2 | null) => void;
  label?: string;
};

export function Prog3({ value, onChange, label }: Prog3Props) {
  const symbols = ["○", "◐", "●"] as const;
  return (
    <div className="prog3">
      {([0, 1, 2] as const).map((i) => (
        <button
          key={i}
          type="button"
          className={cn("p-dot", `p${i}`, value === i && "on")}
          onClick={() => onChange(value === i ? null : i)}
        >
          {symbols[i]}
        </button>
      ))}
      {label && <span className="p-lbl">{label}</span>}
    </div>
  );
}

type PillarItem = {
  id: string;
  label: string;
  icon: React.ComponentType<IconProps>;
};

type PillarGridProps = {
  items: PillarItem[];
  value?: string[];
  onChange: (v: string[]) => void;
};

export function PillarGrid({ items, value = [], onChange }: PillarGridProps) {
  return (
    <div className="pillar-grid">
      {items.map((it) => {
        const Icon = it.icon;
        const on = value.includes(it.id);
        return (
          <button
            key={it.id}
            type="button"
            className={cn("pillar-cell", on && "on")}
            onClick={() => onChange(on ? value.filter((v) => v !== it.id) : [...value, it.id])}
          >
            <span className="pico">
              <Icon size={32} color={on ? "white" : "var(--ink)"} stroke={2.2} />
            </span>
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
