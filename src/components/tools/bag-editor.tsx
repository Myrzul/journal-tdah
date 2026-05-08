"use client";

import { useState } from "react";
import {
  IconBolt,
  IconBulb,
  IconCheck,
  IconList,
} from "@/components/icons";
import { Card } from "@/components/journal/cards";
import { Field, FreeArea } from "@/components/journal/inputs";
import { Headline, Label, SectionLabel } from "@/components/journal/typography";
import {
  type Bag,
  BAG_YELLOW,
  type BagCategory,
  type BagCategoryKind,
  CATEGORY_KINDS,
  CATEGORY_LABELS,
  genBagId,
} from "@/lib/tools/bag-data";

type Props = {
  initial: Bag;
  isNew: boolean;
  onSave: (bag: Bag) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onPrep?: (bag: Bag) => void;
};

export function BagEditor({
  initial,
  isNew,
  onSave,
  onCancel,
  onDelete,
  onPrep,
}: Props) {
  const [draft, setDraft] = useState<Bag>(initial);

  const set = <K extends keyof Bag>(k: K, v: Bag[K]) =>
    setDraft((d) => ({ ...d, [k]: v, updatedAt: Date.now() }));

  const updateCategoryItem = (catId: string, itemId: string, label: string) => {
    setDraft((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((it) =>
                it.id === itemId ? { ...it, label } : it,
              ),
            }
          : c,
      ),
      updatedAt: Date.now(),
    }));
  };

  const addItem = (catId: string) => {
    setDraft((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId
          ? { ...c, items: [...c.items, { id: genBagId("it"), label: "" }] }
          : c,
      ),
      updatedAt: Date.now(),
    }));
  };

  const removeItem = (catId: string, itemId: string) => {
    setDraft((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.filter((it) => it.id !== itemId) }
          : c,
      ),
      updatedAt: Date.now(),
    }));
  };

  const renameCategory = (catId: string, label: string) => {
    setDraft((d) => ({
      ...d,
      categories: d.categories.map((c) => (c.id === catId ? { ...c, label } : c)),
      updatedAt: Date.now(),
    }));
  };

  const removeCategory = (catId: string) => {
    setDraft((d) => ({
      ...d,
      categories: d.categories.filter((c) => c.id !== catId),
      updatedAt: Date.now(),
    }));
  };

  const addCategory = (kind: BagCategoryKind) => {
    const newCat: BagCategory = {
      id: genBagId("cat"),
      kind,
      label: CATEGORY_LABELS[kind],
      items: [{ id: genBagId("it"), label: "" }],
    };
    setDraft((d) => ({
      ...d,
      categories: [...d.categories, newCat],
      updatedAt: Date.now(),
    }));
  };

  const updateFinalCheck = (id: string, label: string) => {
    setDraft((d) => ({
      ...d,
      finalChecks: d.finalChecks.map((f) =>
        f.id === id ? { ...f, label } : f,
      ),
      updatedAt: Date.now(),
    }));
  };

  const addFinalCheck = () => {
    setDraft((d) => ({
      ...d,
      finalChecks: [...d.finalChecks, { id: genBagId("fc"), label: "" }],
      updatedAt: Date.now(),
    }));
  };

  const removeFinalCheck = (id: string) => {
    setDraft((d) => ({
      ...d,
      finalChecks: d.finalChecks.filter((f) => f.id !== id),
      updatedAt: Date.now(),
    }));
  };

  const trimmedTitle = draft.title.trim();
  const totalItems = draft.categories.reduce(
    (acc, c) => acc + c.items.filter((it) => it.label.trim()).length,
    0,
  );
  const canSave = trimmedTitle.length > 0 && totalItems > 0;

  const cleaned = (): Bag => ({
    ...draft,
    title: trimmedTitle,
    categories: draft.categories
      .map((c) => ({
        ...c,
        items: c.items.filter((it) => it.label.trim()),
      }))
      .filter((c) => c.items.length > 0),
    finalChecks: draft.finalChecks.filter((f) => f.label.trim()),
  });

  const usedKinds = new Set(draft.categories.map((c) => c.kind));
  const availableKinds = CATEGORY_KINDS.filter((k) => !usedKinds.has(k));

  return (
    <>
      <SectionLabel num="1">Le sac</SectionLabel>
      <Headline accent="& description">Titre</Headline>
      <Card
        icon={IconBolt}
        title="Quel sac ?"
        sub="Ex : Sac de sport, Sac week-end, Sac école, Sac trousse à pharmacie."
      >
        <Field
          value={draft.title}
          onChange={(v) => set("title", v)}
          placeholder="Ex : Sac de sport"
        />
        <Label>Description (optionnelle)</Label>
        <Field
          value={draft.description}
          onChange={(v) => set("description", v)}
          placeholder="Ex : Pour la salle ou les séances en extérieur"
        />
      </Card>

      <SectionLabel num="2">Les catégories</SectionLabel>
      <Headline accent="& items">Contenu du sac</Headline>

      {draft.categories.map((cat, catIdx) => (
        <Card
          key={cat.id}
          icon={IconList}
          title={`${catIdx + 1}. ${cat.label}`}
          sub={`${cat.items.filter((it) => it.label.trim()).length} item${cat.items.filter((it) => it.label.trim()).length > 1 ? "s" : ""}`}
        >
          <Label>Renommer la catégorie</Label>
          <Field
            value={cat.label}
            onChange={(v) => renameCategory(cat.id, v)}
            placeholder="Nom de la catégorie"
          />
          <Label>Items</Label>
          <ul className="bag-edit-items">
            {cat.items.map((item) => (
              <li key={item.id} className="bag-edit-item">
                <input
                  type="text"
                  className="field bag-edit-item-input"
                  value={item.label}
                  onChange={(e) => updateCategoryItem(cat.id, item.id, e.target.value)}
                  placeholder="Item à emporter"
                />
                <button
                  type="button"
                  onClick={() => removeItem(cat.id, item.id)}
                  aria-label="Supprimer l'item"
                  className="bag-edit-item-btn is-danger"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => addItem(cat.id)}
            className="bag-edit-add-item"
          >
            + Ajouter un item
          </button>
          {draft.categories.length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    `Supprimer la catégorie « ${cat.label} » et tous ses items ?`,
                  )
                ) {
                  removeCategory(cat.id);
                }
              }}
              className="bag-edit-remove-cat"
            >
              Supprimer cette catégorie
            </button>
          )}
        </Card>
      ))}

      {availableKinds.length > 0 && (
        <div className="bag-edit-add-cat-row">
          <span className="bag-edit-add-cat-label">Ajouter une catégorie :</span>
          {availableKinds.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => addCategory(k)}
              className="bag-edit-add-cat-btn"
            >
              + {CATEGORY_LABELS[k]}
            </button>
          ))}
        </div>
      )}

      <SectionLabel num="3">Vérification finale</SectionLabel>
      <Headline accent="avant de partir">Le second tour</Headline>
      <Card
        icon={IconCheck}
        title="Liste de validation rapide"
        sub="Une mini-checklist qui s'affichera après tous les items, pour le dernier coup d'œil."
      >
        <ul className="bag-edit-items">
          {draft.finalChecks.map((fc) => (
            <li key={fc.id} className="bag-edit-item">
              <input
                type="text"
                className="field bag-edit-item-input"
                value={fc.label}
                onChange={(e) => updateFinalCheck(fc.id, e.target.value)}
                placeholder="Vérification finale"
              />
              <button
                type="button"
                onClick={() => removeFinalCheck(fc.id)}
                aria-label="Supprimer"
                className="bag-edit-item-btn is-danger"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={addFinalCheck} className="bag-edit-add-item">
          + Ajouter une vérification
        </button>
      </Card>

      <SectionLabel num="4">Astuces</SectionLabel>
      <Headline accent="rappels & notes">Mémo</Headline>
      <Card
        icon={IconBulb}
        title="Astuces personnelles"
        sub="Tes propres rappels (ex : préparer la veille, photographier le sac, recharger après chaque séance)."
      >
        <FreeArea
          value={draft.tips}
          onChange={(v) => set("tips", v)}
          placeholder={"Ex :\n• Préparer le sac la veille au soir\n• Prendre une photo de référence\n• Garder un kit hygiène permanent"}
        />
      </Card>

      <div className="bag-editor-bottom">
        <div className="bag-nav-row">
          <button type="button" onClick={onCancel} className="bag-nav-btn">
            ← Retour
          </button>
          <button
            type="button"
            onClick={() => canSave && onSave(cleaned())}
            disabled={!canSave}
            className={`bag-primary-btn ${canSave ? "" : "is-disabled"}`}
            style={canSave ? { background: BAG_YELLOW } : undefined}
          >
            ✓ Enregistrer
          </button>
        </div>
        {onPrep && (
          <button
            type="button"
            onClick={() => canSave && onPrep(cleaned())}
            disabled={!canSave}
            className={`bag-prep-now ${canSave ? "" : "is-disabled"}`}
          >
            Enregistrer & préparer maintenant →
          </button>
        )}
        {!isNew && onDelete && (
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  `Supprimer le sac « ${trimmedTitle || "sans titre"} » ? L'historique de préparation sera aussi effacé.`,
                )
              ) {
                onDelete();
              }
            }}
            className="bag-delete-btn"
          >
            Supprimer ce sac
          </button>
        )}
      </div>
    </>
  );
}
