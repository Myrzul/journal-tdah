"use client";

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/journal/cards";
import {
  HandNote,
  Headline,
  IntroHand,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import { MonsterReflexif } from "@/components/monsters";
import { EvalPdfDownload } from "@/components/tools/eval-pdf-download";
import {
  RadarChart,
  RubriqueBar,
  ScoreBlock,
  WellbeingBlock,
  getSymptomLevel,
} from "@/components/tools/eval-results-charts";
import {
  GUIDE_FULL_LINK,
  RUBRIQUE_GUIDE_LINKS,
  type SectionId,
} from "@/lib/tools/eval-data";
import { type EvalRecord, loadHistory } from "@/lib/tools/eval-storage";

const RUBRIQUES_ORDER: SectionId[] = [
  "rub1",
  "rub2",
  "rub3",
  "rub4",
  "rub5",
  "rub6",
  "rub7",
  "rub8",
  "rub9",
];

type Phase = "loading" | "empty" | "ready";

export function ResultatsView() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [record, setRecord] = useState<EvalRecord | null>(null);

  useEffect(() => {
    const history = loadHistory();
    const last = history[history.length - 1];
    if (!last) {
      setPhase("empty");
      return;
    }
    setRecord(last);
    setPhase("ready");
  }, []);

  if (phase === "loading") {
    return (
      <p
        style={{
          fontFamily: "var(--font-cond)",
          fontSize: 14,
          color: "var(--ink-2)",
          textAlign: "center",
          padding: "40px 0",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Chargement…
      </p>
    );
  }

  if (phase === "empty" || !record) {
    return (
      <>
        <IntroHand>
          Pas encore d'évaluation enregistrée.
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Commence par remplir le questionnaire pour voir ton profil.
          </span>
        </IntroHand>
        <div className="eval-card" style={{ textAlign: "center" }}>
          <Link href="/outils/evaluation" className="eval-btn-primary eval-btn-large">
            Faire l'évaluation
          </Link>
        </div>
      </>
    );
  }

  const { scores, date } = record;
  const dateFmt = format(parseISO(date), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr });
  const dateFmtCap = dateFmt.charAt(0).toUpperCase() + dateFmt.slice(1);

  // Top 3 rubriques (priorité élevée+)
  const sortedRubs = RUBRIQUES_ORDER.map((id) => ({ id, score: scores[id] })).sort(
    (a, b) => b.score - a.score,
  );
  const topConcerns = sortedRubs.filter((r) => r.score > 12).slice(0, 3);

  return (
    <>
      <IntroHand>
        Mon évaluation, {dateFmtCap}.
        <br />
        <span style={{ color: "var(--ink-2)" }}>
          Pas un score de réussite. Une photo de l'instant.
        </span>
      </IntroHand>

      {/* ==== ÉTAPE 1 — Sévérité des symptômes ==== */}
      <SectionLabel num="1">Sévérité des symptômes</SectionLabel>
      <Headline accent="6 derniers mois">Étape 1</Headline>

      <div className="results-step1-grid">
        <ScoreBlock
          label="Inattention"
          value={scores.inattention}
          max={36}
          level={getSymptomLevel(scores.inattention)}
        />
        <ScoreBlock
          label="Hyperactivité / Impulsivité"
          value={scores.hyperactivite}
          max={36}
          level={getSymptomLevel(scores.hyperactivite)}
        />
      </div>

      <HandNote>
        « Ces chiffres ne définissent pas qui tu es. Ils observent ce qui se passe en ce moment. »
      </HandNote>

      {/* ==== ÉTAPE 2 — Vue d'ensemble + détails ==== */}
      <SectionLabel num="2">Répercussions au quotidien</SectionLabel>
      <Headline accent="dernier mois">Vue d'ensemble</Headline>

      <Card title="Mon paysage" sub="Plus la zone est étirée vers l'extérieur, plus la rubrique a un impact.">
        <RadarChart scores={scores} />
        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            fontFamily: "var(--font-cond)",
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-2)",
          }}
        >
          Total répercussions : {scores.totalRepercussions} / 180
        </div>
      </Card>

      {topConcerns.length > 0 && (
        <Card title="Tes priorités identifiées" sub="Les rubriques où l'impact est le plus élevé.">
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {topConcerns.map((r) => (
              <li
                key={r.id}
                style={{
                  fontFamily: "var(--font-cond)",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "var(--ink)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: "var(--ch-motivation)",
                    borderRadius: "50%",
                    border: "2px solid var(--ink)",
                    flexShrink: 0,
                  }}
                />
                <span>
                  Rubrique {r.id.replace("rub", "")} · score {r.score} / 20
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <SectionLabel>Détail par domaine</SectionLabel>
      <Headline>9 rubriques</Headline>

      <div className="results-rubriques">
        {RUBRIQUES_ORDER.map((id) => (
          <RubriqueBar
            key={id}
            id={id}
            score={scores[id]}
            guideHref={RUBRIQUE_GUIDE_LINKS[id]}
          />
        ))}
      </div>

      {/* ==== Bien-être (rub10) ==== */}
      <SectionLabel num="•">Bien-être global</SectionLabel>
      <Headline accent="haut = bon">Mes ressources</Headline>
      <WellbeingBlock score={scores.rub10} />

      {/* ==== Accroche guide ==== */}
      <Card
        title="Aller plus loin"
        sub="Le guide Apprivoiser son TDAH propose des stratégies concrètes par chapitre, alignées sur les rubriques de cette évaluation."
      >
        <a
          href={GUIDE_FULL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="eval-btn-primary"
        >
          Découvrir le guide complet →
        </a>
      </Card>

      {/* ==== Disclaimer + Retain ==== */}
      <div
        style={{
          fontFamily: "var(--font-cond)",
          fontSize: 11,
          letterSpacing: 0.04,
          textTransform: "uppercase",
          fontWeight: 700,
          color: "var(--ink-2)",
          background: "var(--surface-alt)",
          padding: "12px 16px",
          borderRadius: "var(--r-md)",
          margin: "24px 0",
          lineHeight: 1.55,
        }}
      >
        Outil psychoéducatif. Ne remplace pas un diagnostic clinique. Si les scores t'inquiètent,
        parle-en à un professionnel de santé.
      </div>

      <Retain title="UNE ÉVALUATION N'EST PAS UN VERDICT." monster={MonsterReflexif}>
        C'est une photographie. Refais-la dans 3 mois pour voir comment les choses bougent. Le but
        n'est pas de descendre les scores, c'est de mieux te comprendre.
      </Retain>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 16,
          flexWrap: "wrap",
        }}
      >
        <EvalPdfDownload record={record} />
        <Link href="/outils/evaluation" className="eval-btn-secondary">
          Refaire l'évaluation
        </Link>
        <Link href="/recap" className="eval-btn-ghost">
          Voir l'évolution dans le temps →
        </Link>
      </div>
    </>
  );
}
