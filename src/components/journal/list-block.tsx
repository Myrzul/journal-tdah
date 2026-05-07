"use client";

import type { IconProps } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

export type ListItem = {
  id: string;
  text: string;
  done: boolean;
};

type ListBlockProps = {
  icon?: React.ComponentType<IconProps>;
  title: string;
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  placeholder?: string;
};

export function ListBlock({
  icon: Icon,
  title,
  items,
  onChange,
  placeholder = "Ajouter…",
}: ListBlockProps) {
  const update = (idx: number, patch: Partial<ListItem>) => {
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const add = () => {
    onChange([...items, { id: crypto.randomUUID(), text: "", done: false }]);
  };

  return (
    <div className="list-block">
      <div className="head">
        {Icon && (
          <span className="head-ic">
            <Icon size={22} color="var(--dominant)" />
          </span>
        )}
        <h3 className="title">{title}</h3>
      </div>
      {items.map((it, idx) => (
        <div key={it.id} className="list-row">
          <button
            type="button"
            className={cn("lbox", it.done && "on")}
            onClick={() => update(idx, { done: !it.done })}
            aria-label={it.done ? "Marquer non fait" : "Marquer fait"}
          >
            {it.done ? "✓" : ""}
          </button>
          <input
            type="text"
            value={it.text}
            className={it.done ? "done" : ""}
            placeholder={placeholder}
            onChange={(e) => update(idx, { text: e.target.value })}
          />
        </div>
      ))}
      <button type="button" className="list-add" onClick={add}>
        ＋ Ajouter une ligne
      </button>
    </div>
  );
}
