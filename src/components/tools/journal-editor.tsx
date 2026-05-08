"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/journal/cards";
import { Field, Opt } from "@/components/journal/inputs";
import { Headline, Label, SectionLabel } from "@/components/journal/typography";
import {
  currentSlotIndex,
  type DayJournal,
  type DayType,
  filledSlotCount,
  formatDateLabel,
  JOURNAL_BLUE,
  type TimeSlot,
} from "@/lib/tools/journal-data";
import { JournalChart } from "./journal-chart";
import { JournalSnapshotModal } from "./journal-snapshot-modal";
import { JournalTable } from "./journal-table";

type Props = {
  initial: DayJournal;
  isNew: boolean;
  onSave: (day: DayJournal) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

export function JournalEditor({
  initial,
  isNew,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState<DayJournal>(initial);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  // Refresh "now" toutes les minutes pour le surlignage de la tranche courante
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const curIdx = currentSlotIndex(new Date(now));

  const updateSlot = (next: TimeSlot) => {
    setDraft((d) => ({
      ...d,
      slots: d.slots.map((s) => (s.idx === next.idx ? next : s)),
      updatedAt: Date.now(),
    }));
    setEditingIdx(null);
  };

  const set = <K extends keyof DayJournal>(k: K, v: DayJournal[K]) =>
    setDraft((d) => ({ ...d, [k]: v, updatedAt: Date.now() }));

  const filled = filledSlotCount(draft);
  const total = draft.slots.length;
  const editingSlot =
    editingIdx != null ? draft.slots.find((s) => s.idx === editingIdx) ?? null : null;

  const openSnapshotNow = () => {
    if (curIdx == null) return;
    setEditingIdx(curIdx);
  };

  return (
    <>
      <SectionLabel num="•">Journée</SectionLabel>
      <Headline accent="& contexte">Date et type</Headline>
      <Card title="La journée que tu observes">
        <Label>Type de journée</Label>
        <Opt
          items={[
            { id: "work", label: "Travail / études" },
            { id: "free", label: "Journée libre" },
          ]}
          value={draft.type}
          onChange={(v) => v && set("type", v as DayType)}
        />
        <Label>Date</Label>
        <Field
          value={draft.date}
          onChange={(v) => set("date", v)}
          placeholder="YYYY-MM-DD"
        />
        <Label>Titre court (facultatif)</Label>
        <Field
          value={draft.title}
          onChange={(v) => set("title", v)}
          placeholder="Ex : Mardi calme, journée chaotique, télétravail…"
        />
      </Card>

      <SectionLabel num="•">Snapshot rapide</SectionLabel>
      <Headline accent="à l'instant">Ici et maintenant</Headline>
      <div className="journal-now-card" style={{ background: JOURNAL_BLUE }}>
        <div className="journal-now-eyebrow">Saisie au fil de l'eau</div>
        <h3 className="journal-now-title">
          {curIdx != null
            ? "Capture cet instant en 30 secondes"
            : "Hors plage horaire (7h–23h30)"}
        </h3>
        <p className="journal-now-text">
          {curIdx != null
            ? "Le bouton ci-dessous ouvre la tranche horaire actuelle. Plus régulier que d'essayer de tout remplir d'un coup."
            : "Tu peux tout de même éditer n'importe quelle tranche depuis le tableau ci-dessous."}
        </p>
        <button
          type="button"
          onClick={openSnapshotNow}
          disabled={curIdx == null}
          className="journal-now-btn"
        >
          {curIdx != null ? "📸 Snapshot maintenant" : "Snapshot indisponible"}
        </button>
      </div>

      <SectionLabel num="•">Vue d'ensemble</SectionLabel>
      <Headline accent="énergie & humeur">Courbes</Headline>
      <Card
        title="Pattern de la journée"
        sub="Les points apparaissent quand tu remplis énergie / humeur dans une tranche. Le but n'est pas un score — c'est de voir la forme."
      >
        <JournalChart slots={draft.slots} />
      </Card>

      <SectionLabel num="•">Toutes les tranches</SectionLabel>
      <Headline accent="clique pour éditer">Détail</Headline>
      <Card
        title={`${filled} / ${total} tranches remplies`}
        sub="Tu peux éditer n'importe quelle tranche — pas obligatoire de tout remplir."
      >
        <JournalTable
          slots={draft.slots}
          currentIdx={curIdx}
          onClickSlot={(i) => setEditingIdx(i)}
        />
      </Card>

      <div className="journal-editor-bottom">
        <div className="journal-nav-row">
          <button type="button" onClick={onCancel} className="journal-nav-btn">
            ← Retour
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="journal-primary-btn"
            style={{ background: JOURNAL_BLUE, color: "white" }}
          >
            ✓ Enregistrer
          </button>
        </div>
        {!isNew && onDelete && (
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  `Supprimer la journée du ${formatDateLabel(draft.date)} ?`,
                )
              ) {
                onDelete();
              }
            }}
            className="journal-delete-btn"
          >
            Supprimer cette journée
          </button>
        )}
      </div>

      {editingSlot && (
        <JournalSnapshotModal
          slot={editingSlot}
          onSave={updateSlot}
          onClose={() => setEditingIdx(null)}
        />
      )}
    </>
  );
}
