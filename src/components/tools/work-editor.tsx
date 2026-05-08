"use client";

import { useMemo, useState } from "react";
import {
  IconBolt,
  IconBulb,
  IconClock,
  IconEyeOpen,
  IconList,
  IconShield,
  IconTarget,
  IconTrophy,
} from "@/components/icons";
import { Card } from "@/components/journal/cards";
import { Field, FreeArea } from "@/components/journal/inputs";
import { Headline, Label, SectionLabel } from "@/components/journal/typography";
import {
  ARRANGEMENTS_COGNITIVE,
  ARRANGEMENTS_SPATIAL,
  ARRANGEMENTS_TEMPORAL,
  DIFFICULTIES,
  FORMAL_ARRANGEMENTS,
  STRENGTHS,
  suggestedStrategiesFor,
  WORK_MAGENTA,
  type WorkOption,
  type WorkPlan,
} from "@/lib/tools/work-data";

type Props = {
  initial: WorkPlan;
  isNew: boolean;
  onSave: (plan: WorkPlan) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onSummary?: (plan: WorkPlan) => void;
};

function ChipGrid({
  options,
  value,
  onChange,
}: {
  options: WorkOption[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="work-chips">
      {options.map((o) => {
        const on = value.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            onClick={() =>
              onChange(on ? value.filter((x) => x !== o.id) : [...value, o.id])
            }
            className={`work-chip ${on ? "is-on" : ""}`}
          >
            <span className="work-chip-box" aria-hidden="true">
              {on ? "✓" : ""}
            </span>
            <span className="work-chip-label">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function WorkEditor({
  initial,
  isNew,
  onSave,
  onCancel,
  onDelete,
  onSummary,
}: Props) {
  const [draft, setDraft] = useState<WorkPlan>(initial);

  const set = <K extends keyof WorkPlan>(k: K, v: WorkPlan[K]) =>
    setDraft((d) => ({ ...d, [k]: v, updatedAt: Date.now() }));

  const suggestions = useMemo(
    () => suggestedStrategiesFor(draft.difficulties),
    [draft.difficulties],
  );

  const trimmedTitle = draft.title.trim();
  const canSave = trimmedTitle.length > 0;

  const cleaned = (): WorkPlan => ({
    ...draft,
    title: trimmedTitle,
    customDifficulty: draft.customDifficulty.trim(),
    customStrategy: draft.customStrategy.trim(),
    customArrangement: draft.customArrangement.trim(),
    customStrength: draft.customStrength.trim(),
    distractionSources: draft.distractionSources.trim(),
    notes: draft.notes.trim(),
  });

  return (
    <>
      <SectionLabel num="1">Mon plan</SectionLabel>
      <Headline accent="& contexte">Titre</Headline>
      <Card
        icon={IconBolt}
        title="Pour quel contexte ?"
        sub="Ex : Mon poste actuel, Nouveau job en septembre, Mission freelance X."
      >
        <Field
          value={draft.title}
          onChange={(v) => set("title", v)}
          placeholder="Ex : Mon poste actuel"
        />
      </Card>

      <SectionLabel num="2">Mes besoins observables</SectionLabel>
      <Headline accent="ce que je remarque">Difficultés</Headline>
      <Card
        icon={IconEyeOpen}
        title="Coche ce qui te parle"
        sub="Pas de jugement — c'est juste ce que tu observes au travail. Tu peux ajouter ce qui n'est pas dans la liste."
      >
        <ChipGrid
          options={DIFFICULTIES}
          value={draft.difficulties}
          onChange={(v) => set("difficulties", v)}
        />
        <Label>Autre difficulté à ajouter (facultatif)</Label>
        <Field
          value={draft.customDifficulty}
          onChange={(v) => set("customDifficulty", v)}
          placeholder="Ex : Difficulté à passer d'une tâche à l'autre"
        />
        <Label>Mes principales sources de distraction</Label>
        <FreeArea
          value={draft.distractionSources}
          onChange={(v) => set("distractionSources", v)}
          placeholder="Ex : open space bruyant, notifications Slack, passage des collègues, mes propres pensées qui sautent…"
        />
      </Card>

      <SectionLabel num="3">Stratégies à essayer</SectionLabel>
      <Headline accent="suggérées par tes besoins">Pistes</Headline>
      <Card
        icon={IconTarget}
        title="Stratégies suggérées"
        sub={
          suggestions.length === 0
            ? "Coche au moins une difficulté ci-dessus pour voir des pistes."
            : "Suggestions adaptées aux difficultés que tu as cochées. Tu choisis celles qui te parlent."
        }
      >
        {suggestions.length > 0 ? (
          <ChipGrid
            options={suggestions}
            value={draft.strategies}
            onChange={(v) => set("strategies", v)}
          />
        ) : (
          <p
            style={{
              fontFamily: "var(--font-cond)",
              fontSize: 12,
              color: "var(--ink-2)",
              fontStyle: "italic",
            }}
          >
            Coche d'abord tes besoins en section 2.
          </p>
        )}
        <Label>Une stratégie à toi (facultatif)</Label>
        <Field
          value={draft.customStrategy}
          onChange={(v) => set("customStrategy", v)}
          placeholder="Ex : Régler une alarme à 17h pour faire mon point de fin de journée"
        />
      </Card>

      <SectionLabel num="4">Aménagements organisationnels</SectionLabel>
      <Headline accent="3 axes">Concrets</Headline>

      <Card
        icon={IconClock}
        title="Temporel"
        sub="Ce qui structure le temps : suivis, deadlines, routines, pauses."
      >
        <ChipGrid
          options={ARRANGEMENTS_TEMPORAL}
          value={draft.arrTemporal}
          onChange={(v) => set("arrTemporal", v)}
        />
      </Card>

      <Card
        icon={IconBulb}
        title="Cognitif"
        sub="Ce qui rend les consignes et les attentes plus claires."
      >
        <ChipGrid
          options={ARRANGEMENTS_COGNITIVE}
          value={draft.arrCognitive}
          onChange={(v) => set("arrCognitive", v)}
        />
      </Card>

      <Card
        icon={IconList}
        title="Espace"
        sub="Ce qui rend l'environnement physique soutenant."
      >
        <ChipGrid
          options={ARRANGEMENTS_SPATIAL}
          value={draft.arrSpatial}
          onChange={(v) => set("arrSpatial", v)}
        />
        <Label>Un autre aménagement à toi (facultatif)</Label>
        <Field
          value={draft.customArrangement}
          onChange={(v) => set("customArrangement", v)}
          placeholder="Ex : Pouvoir laisser mon casque visible sur le bureau"
        />
      </Card>

      <SectionLabel num="5">Aménagements raisonnables (formels)</SectionLabel>
      <Headline accent="si diagnostic">Droits</Headline>
      <Card
        icon={IconShield}
        title="Demandes formelles possibles"
        sub="Avec un diagnostic, tu peux demander des aménagements formels. Coche ceux que tu envisages — ça aide à préparer un échange RH ou médecin du travail."
      >
        <ChipGrid
          options={FORMAL_ARRANGEMENTS}
          value={draft.formalArrangements}
          onChange={(v) => set("formalArrangements", v)}
        />
      </Card>

      <SectionLabel num="6">Mes forces</SectionLabel>
      <Headline accent="à mobiliser">Atouts</Headline>
      <Card
        icon={IconTrophy}
        title="Ce que tu apportes aussi"
        sub="Coche ce qui te ressemble — c'est important de garder ça en tête, surtout dans une demande d'aménagement."
      >
        <ChipGrid
          options={STRENGTHS}
          value={draft.strengths}
          onChange={(v) => set("strengths", v)}
        />
        <Label>Une force à toi (facultatif)</Label>
        <Field
          value={draft.customStrength}
          onChange={(v) => set("customStrength", v)}
          placeholder="Ex : Capacité à déceler ce qui ne va pas dans un process"
        />
      </Card>

      <SectionLabel num="7">Notes libres</SectionLabel>
      <Headline accent="ce que tu veux retenir">Mémo</Headline>
      <Card
        icon={IconBulb}
        title="Pour toi, ou pour préparer une discussion"
        sub="Notes, idées, choses à demander, à explorer."
      >
        <FreeArea
          value={draft.notes}
          onChange={(v) => set("notes", v)}
          placeholder="Ex : Demander un point trimestriel avec X. Tester 2 mois en télétravail le mardi."
        />
      </Card>

      <div className="work-editor-bottom">
        <div className="work-nav-row">
          <button type="button" onClick={onCancel} className="work-nav-btn">
            ← Retour
          </button>
          <button
            type="button"
            onClick={() => canSave && onSave(cleaned())}
            disabled={!canSave}
            className={`work-primary-btn ${canSave ? "" : "is-disabled"}`}
            style={canSave ? { background: WORK_MAGENTA } : undefined}
          >
            ✓ Enregistrer
          </button>
        </div>
        {onSummary && (
          <button
            type="button"
            onClick={() => canSave && onSummary(cleaned())}
            disabled={!canSave}
            className={`work-summary-btn ${canSave ? "" : "is-disabled"}`}
          >
            Voir ma synthèse exportable →
          </button>
        )}
        {!isNew && onDelete && (
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  `Supprimer le plan « ${trimmedTitle || "sans titre"} » ?`,
                )
              ) {
                onDelete();
              }
            }}
            className="work-delete-btn"
          >
            Supprimer ce plan
          </button>
        )}
      </div>
    </>
  );
}
