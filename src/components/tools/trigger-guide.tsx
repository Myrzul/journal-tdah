"use client";

import { FreeArea } from "@/components/journal/inputs";
import { TRIGGER_PROMPTS } from "@/lib/tools/thermo-data";

type Props = {
  value: string | undefined;
  onChange: (v: string) => void;
};

/** Bouton "Avant ça je…" : prompts manuscrits qui s'ajoutent à la zone de texte. */
export function TriggerGuide({ value, onChange }: Props) {
  const append = (prompt: string) => {
    const sep = value ? "\n" : "";
    onChange(`${value ?? ""}${sep}${prompt} `);
  };

  return (
    <div className="trigger-guide">
      <div className="trigger-prompts">
        {TRIGGER_PROMPTS.map((p) => (
          <button key={p} type="button" onClick={() => append(p)} className="trigger-prompt">
            « {p} »
          </button>
        ))}
      </div>
      <FreeArea
        value={value}
        onChange={onChange}
        placeholder="Ce qui a précédé. Pas une cause unique, un contexte."
      />
    </div>
  );
}
