"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Question manuscrite affichée en hand-font */
  question: string;
  /** Hint sous la question (facultatif) */
  hint?: string;
  /** Valeur initiale (depuis localStorage) */
  initial: string;
  /** Sauvegarde debounce */
  onSave: (value: string) => void;
  /** Placeholder textarea */
  placeholder?: string;
  rubColor: string;
};

const DEBOUNCE_MS = 700;

export function GuidePersonalNote({
  question,
  hint,
  initial,
  onSave,
  placeholder,
  rubColor,
}: Props) {
  const [value, setValue] = useState(initial);
  const [savedFlash, setSavedFlash] = useState(false);
  // Ref vers la dernière version d'onSave : permet de ne pas relancer l'effet
  // chaque fois que le parent re-render avec une nouvelle closure.
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const initialRef = useRef(initial);

  useEffect(() => {
    if (value === initialRef.current) return;
    const id = setTimeout(() => {
      onSaveRef.current(value);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <div
      className="guide-note"
      style={{ ["--rub-color" as string]: rubColor }}
    >
      <p className="guide-note-question">{question}</p>
      {hint && <p className="guide-note-hint">{hint}</p>}
      <textarea
        className="guide-note-area"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? "Écris ce qui te vient — sans filtre."}
        rows={4}
      />
      <div className="guide-note-saved" aria-live="polite">
        {savedFlash ? "✓ Enregistré" : "Auto-enregistré"}
      </div>
    </div>
  );
}
