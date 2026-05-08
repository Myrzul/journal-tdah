"use client";

import { useEffect, useState } from "react";
import { Field, FreeArea } from "@/components/journal/inputs";
import { Label } from "@/components/journal/typography";
import {
  formatSlotRange,
  JOURNAL_BLUE,
  type TimeSlot,
} from "@/lib/tools/journal-data";

type Props = {
  slot: TimeSlot;
  onSave: (next: TimeSlot) => void;
  onClose: () => void;
};

export function JournalSnapshotModal({ slot, onSave, onClose }: Props) {
  const [activity, setActivity] = useState(slot.activity ?? "");
  const [context, setContext] = useState(slot.context ?? "");
  const [energy, setEnergy] = useState<number | null>(slot.energy ?? null);
  const [mood, setMood] = useState<number | null>(slot.mood ?? null);
  const [comment, setComment] = useState(slot.comment ?? "");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = () => {
    onSave({
      ...slot,
      activity: activity.trim() || undefined,
      context: context.trim() || undefined,
      energy: energy ?? undefined,
      mood: mood ?? undefined,
      comment: comment.trim() || undefined,
    });
  };

  const clear = () => {
    onSave({
      idx: slot.idx,
      startMin: slot.startMin,
      endMin: slot.endMin,
    });
  };

  return (
    <div className="journal-modal-backdrop">
      <div className="journal-modal" role="dialog" aria-label="Saisie d'une tranche horaire">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="journal-modal-close"
        >
          ✕
        </button>
        <div className="journal-modal-eyebrow">Snapshot · {formatSlotRange(slot)}</div>
        <h3 className="journal-modal-title">Comment ça se passe ?</h3>

        <Label>Activité principale</Label>
        <Field
          value={activity}
          onChange={setActivity}
          placeholder="Ex : mails, dossier client, repas, trajet, repos…"
        />

        <Label>Contexte (où, avec qui)</Label>
        <Field
          value={context}
          onChange={setContext}
          placeholder="Ex : bureau seul·e, salon avec enfants, café avec X…"
        />

        <div className="journal-modal-2col">
          <div>
            <Label>Énergie {energy != null ? `· ${energy}/10` : ""}</Label>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={energy ?? 5}
              onChange={(e) => setEnergy(Number.parseInt(e.target.value, 10))}
              aria-label="Niveau d'énergie de 1 à 10"
              className="journal-range"
              style={{ accentColor: JOURNAL_BLUE }}
            />
            <div className="journal-range-labels">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
          <div>
            <Label>Humeur {mood != null ? `· ${mood}/10` : ""}</Label>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={mood ?? 5}
              onChange={(e) => setMood(Number.parseInt(e.target.value, 10))}
              aria-label="Niveau d'humeur de 1 à 10"
              className="journal-range"
              style={{ accentColor: JOURNAL_BLUE }}
            />
            <div className="journal-range-labels">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        </div>

        <Label>Commentaire (facultatif)</Label>
        <FreeArea
          value={comment}
          onChange={setComment}
          placeholder="Difficultés, distractions, observations particulières…"
        />

        <div className="journal-modal-actions">
          <button type="button" onClick={clear} className="journal-modal-clear">
            Effacer
          </button>
          <button
            type="button"
            onClick={save}
            className="journal-modal-save"
            style={{ background: JOURNAL_BLUE }}
          >
            ✓ Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
