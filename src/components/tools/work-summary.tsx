"use client";

import { useState } from "react";
import {
  ARRANGEMENTS_COGNITIVE,
  ARRANGEMENTS_SPATIAL,
  ARRANGEMENTS_TEMPORAL,
  DIFFICULTIES,
  FORMAL_ARRANGEMENTS,
  labelOf,
  neutralOrLabel,
  STRATEGIES_BY_DIFFICULTY,
  STRENGTHS,
  WORK_MAGENTA,
  type WorkOption,
  type WorkPlan,
} from "@/lib/tools/work-data";

type Props = {
  plan: WorkPlan;
  onBack: () => void;
};

function isolateNeutral(plan: WorkPlan): string[] {
  const neutralLines: string[] = [];
  const arrangementGroups: { list: WorkOption[]; ids: string[] }[] = [
    { list: ARRANGEMENTS_TEMPORAL, ids: plan.arrTemporal },
    { list: ARRANGEMENTS_COGNITIVE, ids: plan.arrCognitive },
    { list: ARRANGEMENTS_SPATIAL, ids: plan.arrSpatial },
    { list: FORMAL_ARRANGEMENTS, ids: plan.formalArrangements },
  ];
  for (const g of arrangementGroups) {
    for (const id of g.ids) {
      neutralLines.push(`• ${neutralOrLabel(g.list, id)}`);
    }
  }
  return neutralLines;
}

function buildPlainText(plan: WorkPlan): string {
  const lines: string[] = [];
  lines.push(`PLAN D'AMÉNAGEMENT — ${plan.title || "Sans titre"}`);
  lines.push("");

  if (plan.difficulties.length > 0 || plan.customDifficulty.trim()) {
    lines.push("Besoins observés au travail :");
    for (const id of plan.difficulties) {
      lines.push(`- ${labelOf(DIFFICULTIES, id)}`);
    }
    if (plan.customDifficulty.trim()) {
      lines.push(`- ${plan.customDifficulty.trim()}`);
    }
    lines.push("");
  }

  if (plan.distractionSources.trim()) {
    lines.push("Principales sources de distraction :");
    lines.push(plan.distractionSources.trim());
    lines.push("");
  }

  const allStrategies: WorkOption[] = [];
  for (const d of plan.difficulties) {
    for (const s of STRATEGIES_BY_DIFFICULTY[d] ?? []) {
      if (plan.strategies.includes(s.id)) allStrategies.push(s);
    }
  }
  if (allStrategies.length > 0 || plan.customStrategy.trim()) {
    lines.push("Stratégies que je veux mettre en place :");
    for (const s of allStrategies) {
      lines.push(`- ${s.label}`);
    }
    if (plan.customStrategy.trim()) {
      lines.push(`- ${plan.customStrategy.trim()}`);
    }
    lines.push("");
  }

  const allArrangements: string[] = [];
  for (const id of plan.arrTemporal) {
    allArrangements.push(`- ${labelOf(ARRANGEMENTS_TEMPORAL, id)}`);
  }
  for (const id of plan.arrCognitive) {
    allArrangements.push(`- ${labelOf(ARRANGEMENTS_COGNITIVE, id)}`);
  }
  for (const id of plan.arrSpatial) {
    allArrangements.push(`- ${labelOf(ARRANGEMENTS_SPATIAL, id)}`);
  }
  if (plan.customArrangement.trim()) {
    allArrangements.push(`- ${plan.customArrangement.trim()}`);
  }
  if (allArrangements.length > 0) {
    lines.push("Aménagements souhaités :");
    lines.push(...allArrangements);
    lines.push("");
  }

  if (plan.formalArrangements.length > 0) {
    lines.push("Aménagements raisonnables (formels) :");
    for (const id of plan.formalArrangements) {
      lines.push(`- ${labelOf(FORMAL_ARRANGEMENTS, id)}`);
    }
    lines.push("");
  }

  if (plan.strengths.length > 0 || plan.customStrength.trim()) {
    lines.push("Forces que je peux mobiliser :");
    for (const id of plan.strengths) {
      lines.push(`- ${labelOf(STRENGTHS, id)}`);
    }
    if (plan.customStrength.trim()) {
      lines.push(`- ${plan.customStrength.trim()}`);
    }
    lines.push("");
  }

  if (plan.notes.trim()) {
    lines.push("Notes :");
    lines.push(plan.notes.trim());
  }

  return lines.join("\n").trim();
}

function buildNeutralText(plan: WorkPlan): string {
  const lines: string[] = [];
  lines.push("DEMANDE D'AJUSTEMENTS — formulation neutre");
  lines.push("");
  lines.push("Pour être plus efficace dans mes missions, j'ai identifié quelques");
  lines.push("ajustements qui m'aideraient :");
  lines.push("");
  const neutralLines = isolateNeutral(plan);
  if (neutralLines.length === 0) {
    lines.push("(Aucun aménagement coché — sélectionne au moins un dans l'éditeur)");
  } else {
    lines.push(...neutralLines);
  }
  lines.push("");
  lines.push("Cela libérerait des ressources pour que je puisse mobiliser pleinement");
  lines.push("mes forces, notamment :");
  for (const id of plan.strengths) {
    lines.push(`• ${labelOf(STRENGTHS, id)}`);
  }
  if (plan.customStrength.trim()) {
    lines.push(`• ${plan.customStrength.trim()}`);
  }
  return lines.join("\n").trim();
}

export function WorkSummary({ plan, onBack }: Props) {
  const [tab, setTab] = useState<"plain" | "neutral">("plain");
  const [copied, setCopied] = useState(false);
  const text = tab === "plain" ? buildPlainText(plan) : buildNeutralText(plan);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <div className="work-summary-card" style={{ background: WORK_MAGENTA }}>
        <div className="work-summary-eyebrow">Synthèse · {plan.title || "Sans titre"}</div>
        <h3 className="work-summary-title">Mon plan d'aménagement</h3>
        <p className="work-summary-text">
          Tu peux copier ce texte pour le partager avec ta hiérarchie, le service RH,
          un médecin du travail, ou simplement le garder pour toi comme repère.
        </p>
      </div>

      <div className="work-summary-tabs">
        <button
          type="button"
          onClick={() => setTab("plain")}
          className={`work-summary-tab ${tab === "plain" ? "is-on" : ""}`}
        >
          Vue complète
        </button>
        <button
          type="button"
          onClick={() => setTab("neutral")}
          className={`work-summary-tab ${tab === "neutral" ? "is-on" : ""}`}
        >
          Demande neutre (sans TDAH)
        </button>
      </div>

      <pre className="work-summary-pre">{text}</pre>

      <div className="work-nav-row">
        <button type="button" onClick={onBack} className="work-nav-btn">
          ← Retour à l'éditeur
        </button>
        <button
          type="button"
          onClick={copyToClipboard}
          className="work-primary-btn"
          style={{ background: WORK_MAGENTA }}
        >
          {copied ? "✓ Copié" : "Copier dans le presse-papier"}
        </button>
      </div>
    </>
  );
}
