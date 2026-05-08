"use client";

import { useState } from "react";
import {
  IconBolt,
  IconBulb,
  IconClock,
  IconGift,
  IconList,
} from "@/components/icons";
import { Card } from "@/components/journal/cards";
import { Field, FreeArea } from "@/components/journal/inputs";
import { Headline, Label, SectionLabel } from "@/components/journal/typography";
import {
  type Checklist,
  CHECKLIST_GREEN,
  type ChecklistStep,
  genId,
} from "@/lib/tools/checklist-data";

type Props = {
  initial: Checklist;
  isNew: boolean;
  onSave: (cl: Checklist) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onRun?: (cl: Checklist) => void;
};

export function ChecklistEditor({
  initial,
  isNew,
  onSave,
  onCancel,
  onDelete,
  onRun,
}: Props) {
  const [draft, setDraft] = useState<Checklist>(initial);

  const set = <K extends keyof Checklist>(k: K, v: Checklist[K]) =>
    setDraft((d) => ({ ...d, [k]: v, updatedAt: Date.now() }));

  const updateStep = (id: string, label: string) => {
    setDraft((d) => ({
      ...d,
      steps: d.steps.map((s) => (s.id === id ? { ...s, label } : s)),
      updatedAt: Date.now(),
    }));
  };

  const addStep = () => {
    if (draft.steps.length >= 20) return;
    const newStep: ChecklistStep = { id: genId("s"), label: "" };
    setDraft((d) => ({
      ...d,
      steps: [...d.steps, newStep],
      updatedAt: Date.now(),
    }));
  };

  const moveStep = (idx: number, dir: -1 | 1) => {
    setDraft((d) => {
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= d.steps.length) return d;
      const next = [...d.steps];
      const a = next[idx];
      const b = next[newIdx];
      if (!a || !b) return d;
      next[idx] = b;
      next[newIdx] = a;
      return { ...d, steps: next, updatedAt: Date.now() };
    });
  };

  const removeStep = (id: string) => {
    setDraft((d) => {
      if (d.steps.length <= 1) return d;
      return {
        ...d,
        steps: d.steps.filter((s) => s.id !== id),
        updatedAt: Date.now(),
      };
    });
  };

  const trimmedTitle = draft.title.trim();
  const stepCount = draft.steps.filter((s) => s.label.trim()).length;
  const canSave = trimmedTitle.length > 0 && stepCount > 0;

  const cleanedDraft = (): Checklist => ({
    ...draft,
    title: trimmedTitle,
    steps: draft.steps.filter((s) => s.label.trim()),
  });

  const handleSave = () => {
    if (!canSave) return;
    onSave(cleanedDraft());
  };

  const handleRun = () => {
    if (!onRun || !canSave) return;
    onRun(cleanedDraft());
  };

  return (
    <>
      <SectionLabel num="1">Le titre</SectionLabel>
      <Headline accent="court et concret">Une routine</Headline>
      <Card
        icon={IconBolt}
        title="Quel est le titre ?"
        sub="Une tâche récurrente (« Faire le ménage ») ou une routine (« Me préparer le matin »)."
      >
        <Field
          value={draft.title}
          onChange={(v) => set("title", v)}
          placeholder="Ex : Routine du matin"
        />
      </Card>

      <SectionLabel num="2">Le contexte</SectionLabel>
      <Headline accent="& durée estimée">Quand</Headline>
      <Card
        icon={IconClock}
        title="Quand et combien de temps ?"
        sub="Le moment où tu fais cette routine et une estimation large de la durée."
      >
        <Label>Quand</Label>
        <Field
          value={draft.whenText}
          onChange={(v) => set("whenText", v)}
          placeholder="Ex : Au réveil, avant de partir"
        />
        <Label>Durée totale estimée</Label>
        <Field
          value={draft.durationText}
          onChange={(v) => set("durationText", v)}
          placeholder="Ex : 45 à 60 min"
        />
      </Card>

      <SectionLabel num="3">Les étapes</SectionLabel>
      <Headline accent="courtes et concrètes">Étapes à suivre</Headline>
      <Card
        icon={IconList}
        title="Découpe en étapes courtes"
        sub="Chaque étape = une action que tu peux faire en une fois. Maximum 20."
      >
        <ol className="checklist-edit-steps">
          {draft.steps.map((step, idx) => (
            <li key={step.id} className="checklist-edit-step">
              <span className="checklist-edit-step-num">{idx + 1}</span>
              <input
                type="text"
                className="field checklist-edit-step-input"
                value={step.label}
                onChange={(e) => updateStep(step.id, e.target.value)}
                placeholder={`Étape ${idx + 1}`}
              />
              <div className="checklist-edit-step-actions">
                <button
                  type="button"
                  onClick={() => moveStep(idx, -1)}
                  disabled={idx === 0}
                  aria-label={`Monter l'étape ${idx + 1}`}
                  className="checklist-edit-step-btn"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveStep(idx, 1)}
                  disabled={idx === draft.steps.length - 1}
                  aria-label={`Descendre l'étape ${idx + 1}`}
                  className="checklist-edit-step-btn"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                  disabled={draft.steps.length <= 1}
                  aria-label={`Supprimer l'étape ${idx + 1}`}
                  className="checklist-edit-step-btn is-danger"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={addStep}
          disabled={draft.steps.length >= 20}
          className="checklist-edit-add-step"
        >
          + Ajouter une étape
        </button>
      </Card>

      <SectionLabel num="4">Points d'attention</SectionLabel>
      <Headline accent="& matériel à prévoir">Anticiper</Headline>
      <Card
        icon={IconBulb}
        title="Notes utiles, matériel, astuces"
        sub="Ce qu'il faut préparer la veille, les rappels qui aident, le matériel à avoir sous la main."
      >
        <FreeArea
          value={draft.attention}
          onChange={(v) => set("attention", v)}
          placeholder={"Ex :\n• Préparer mes vêtements la veille\n• Mettre mon sac près de la porte\n• Régler 2 alarmes"}
        />
      </Card>

      <SectionLabel num="5">Récompense</SectionLabel>
      <Headline accent="ce qui m'attend après">Célébrer</Headline>
      <Card
        icon={IconGift}
        title="Une récompense pour la fin"
        sub="Pas un truc à mériter — juste un plaisir simple qui marque la fin et nourrit la dopamine."
      >
        <Field
          value={draft.reward}
          onChange={(v) => set("reward", v)}
          placeholder="Ex : Un café que je prends le temps d'apprécier."
        />
      </Card>

      <div className="checklist-editor-bottom">
        <div className="checklist-nav-row">
          <button type="button" onClick={onCancel} className="checklist-nav-btn">
            ← Retour
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={`checklist-primary-btn ${canSave ? "" : "is-disabled"}`}
            style={canSave ? { background: CHECKLIST_GREEN } : undefined}
          >
            ✓ Enregistrer
          </button>
        </div>
        {onRun && (
          <button
            type="button"
            onClick={handleRun}
            disabled={!canSave}
            className={`checklist-run-now ${canSave ? "" : "is-disabled"}`}
            style={canSave ? { background: "var(--ink)", color: "white" } : undefined}
          >
            Enregistrer & lancer maintenant →
          </button>
        )}
        {!isNew && onDelete && (
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  `Supprimer la checklist « ${trimmedTitle || "sans titre"} » ? L'historique de complétion sera aussi effacé.`,
                )
              ) {
                onDelete();
              }
            }}
            className="checklist-delete-btn"
          >
            Supprimer cette checklist
          </button>
        )}
      </div>
    </>
  );
}
