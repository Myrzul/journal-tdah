"use client";

import { useState } from "react";
import {
  genObjectiveId,
  type SmartObjective,
} from "@/lib/guide/guide-types";

type Props = {
  rubColor: string;
  objectives: SmartObjective[];
  onAdd: (obj: SmartObjective) => void;
  onDelete: (id: string) => void;
};

const FIELDS: {
  key: Exclude<keyof SmartObjective, "id" | "t" | "formulated" | "achieved">;
  label: string;
  hint: string;
  placeholder: string;
}[] = [
  {
    key: "specifique",
    label: "Spécifique",
    hint: "Concret et précis. Que veux-tu vraiment faire ?",
    placeholder: "Ex : Relire et analyser mes notes de la journée",
  },
  {
    key: "mesurable",
    label: "Mesurable",
    hint: "Comment tu sauras que c'est fait ?",
    placeholder: "Ex : 5 à 10 minutes par jour, dans mon journal de bord",
  },
  {
    key: "atteignable",
    label: "Atteignable",
    hint: "Un petit pas. Pas une montagne.",
    placeholder: "Ex : Juste relire, pas tout réécrire",
  },
  {
    key: "realisable",
    label: "Réalisable",
    hint: "Simple à mettre en œuvre dans ton contexte actuel.",
    placeholder: "Ex : Le soir avant de me coucher, après brossage de dents",
  },
  {
    key: "temporel",
    label: "Temporel",
    hint: "Une deadline ou une fréquence.",
    placeholder: "Ex : Pendant 1 semaine",
  },
];

function formulate(parts: Pick<
  SmartObjective,
  "specifique" | "mesurable" | "atteignable" | "realisable" | "temporel"
>): string {
  const t = parts.temporel.trim();
  const s = parts.specifique.trim();
  const m = parts.mesurable.trim();
  const r = parts.realisable.trim();
  if (!s && !m && !t) return "";
  const intro = t ? `${t.charAt(0).toUpperCase() + t.slice(1)}, je ` : "Je ";
  const action = s ? s.charAt(0).toLowerCase() + s.slice(1) : "…";
  const more = [m, r].filter(Boolean).join(", ");
  return `${intro}${action}${more ? ` (${more})` : ""}.`;
}

export function GuideSmartEditor({
  rubColor,
  objectives,
  onAdd,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState({
    specifique: "",
    mesurable: "",
    atteignable: "",
    realisable: "",
    temporel: "",
  });
  const [formulated, setFormulated] = useState("");
  const [autoFormulate, setAutoFormulate] = useState(true);

  const setField = (key: keyof typeof draft, val: string) => {
    setDraft((d) => {
      const next = { ...d, [key]: val };
      if (autoFormulate) setFormulated(formulate(next));
      return next;
    });
  };

  const canAdd =
    draft.specifique.trim().length > 0 || formulated.trim().length > 0;

  const submit = () => {
    if (!canAdd) return;
    const obj: SmartObjective = {
      id: genObjectiveId(),
      t: Date.now(),
      ...draft,
      formulated: formulated.trim() || formulate(draft),
    };
    onAdd(obj);
    setDraft({
      specifique: "",
      mesurable: "",
      atteignable: "",
      realisable: "",
      temporel: "",
    });
    setFormulated("");
    setAutoFormulate(true);
  };

  return (
    <div className="guide-smart" style={{ ["--rub-color" as string]: rubColor }}>
      <div className="guide-smart-grid">
        {FIELDS.map((f) => (
          <label key={f.key} className="guide-smart-field">
            <span className="guide-smart-label">
              <b>{f.label.charAt(0)}</b>
              {f.label.slice(1)}
            </span>
            <span className="guide-smart-hint">{f.hint}</span>
            <input
              type="text"
              className="field"
              value={draft[f.key]}
              onChange={(e) => setField(f.key, e.target.value)}
              placeholder={f.placeholder}
            />
          </label>
        ))}
      </div>

      <div className="guide-smart-formulated">
        <div className="guide-smart-formulated-head">
          <span className="guide-smart-formulated-label">Phrase finale</span>
          <button
            type="button"
            onClick={() => {
              if (autoFormulate) {
                setAutoFormulate(false);
              } else {
                setAutoFormulate(true);
                setFormulated(formulate(draft));
              }
            }}
            className="guide-smart-toggle"
          >
            {autoFormulate ? "Éditer manuellement" : "Auto-formuler"}
          </button>
        </div>
        <textarea
          className="field"
          rows={2}
          value={formulated}
          onChange={(e) => {
            setAutoFormulate(false);
            setFormulated(e.target.value);
          }}
          placeholder="Ta phrase d'objectif…"
        />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!canAdd}
        className={`guide-smart-add ${canAdd ? "" : "is-disabled"}`}
      >
        ✓ Ajouter cet objectif
      </button>

      {objectives.length > 0 && (
        <div className="guide-smart-list">
          <div className="guide-smart-list-label">
            Mes objectifs SMART pour cette rubrique
          </div>
          {objectives
            .slice()
            .reverse()
            .map((o) => (
              <div key={o.id} className="guide-smart-item">
                <div className="guide-smart-item-text">{o.formulated}</div>
                <div className="guide-smart-item-meta">
                  {new Date(o.t).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Supprimer cet objectif ?")) onDelete(o.id);
                    }}
                    className="guide-smart-item-del"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
