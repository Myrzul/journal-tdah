"use client";

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/journal/cards";
import { ScaleTrend } from "@/components/charts/scale-trend";
import { Headline, SectionLabel } from "@/components/journal/typography";
import { type EvalRecord, loadHistory } from "@/lib/tools/eval-storage";

/**
 * Section "Mes symptômes dans le temps" dans /recap.
 * Affiche l'évolution des scores principaux sur les N dernières évaluations.
 *
 * Composant Client : lit localStorage à l'hydration.
 */
export function EvalEvolution() {
  const [history, setHistory] = useState<EvalRecord[] | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  if (history === null) return null; // SSR / loading

  return (
    <>
      <SectionLabel num="3">Mes symptômes dans le temps</SectionLabel>
      <Headline accent="évolution">L'auto-évaluation</Headline>

      {history.length === 0 ? (
        <Card title="Pas encore d'évaluation" sub="Le premier passage te donnera un point de départ.">
          <Link href="/outils/evaluation" className="eval-btn-primary">
            Faire une première évaluation
          </Link>
        </Card>
      ) : history.length === 1 ? (
        <Card
          title="Premier relevé enregistré"
          sub="Les courbes apparaîtront à partir du deuxième passage. Refais l'évaluation dans 1 à 3 mois pour voir l'évolution."
        >
          <Link href="/outils/evaluation/resultats" className="eval-btn-secondary">
            Voir mes résultats
          </Link>
        </Card>
      ) : (
        <EvalCharts history={history} />
      )}
    </>
  );
}

function EvalCharts({ history }: { history: EvalRecord[] }) {
  // Garde les 12 derniers relevés (3 ans à raison de 1 par trimestre)
  const last = history.slice(-12);

  // Pour chaque relevé, on affiche son label sur l'axe X (date courte)
  const inattentionData = last.map((r) => ({
    date: r.date,
    value: (r.scores.inattention / 36) * 5, // ramène sur 0-5 pour ScaleTrend
  }));
  const hyperData = last.map((r) => ({
    date: r.date,
    value: (r.scores.hyperactivite / 36) * 5,
  }));
  const repercussionsData = last.map((r) => ({
    date: r.date,
    value: (r.scores.totalRepercussions / 180) * 5,
  }));
  const wellbeingData = last.map((r) => ({
    date: r.date,
    value: (r.scores.rub10 / 20) * 5,
  }));

  return (
    <>
      <Card
        title={`Évolution sur les ${last.length} dernières évaluations`}
        sub="Les valeurs sont normalisées sur 5 pour comparer les axes."
      >
        <ScaleTrend label="Inattention" data={inattentionData} color="#1B4FE5" showMeta={false} />
        <ScaleTrend label="Hyperactivité" data={hyperData} color="#FF1F8F" showMeta={false} />
        <ScaleTrend
          label="Répercussions globales"
          data={repercussionsData}
          color="#E8294E"
          showMeta={false}
        />
        <ScaleTrend
          label="Bien-être (haut = bon)"
          data={wellbeingData}
          color="#1FBF7A"
          showMeta={false}
        />
      </Card>

      <Card title="Mes relevés passés" sub="Les 5 derniers, du plus récent au plus ancien.">
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {history
            .slice(-5)
            .reverse()
            .map((r) => {
              const dateFmt = format(parseISO(r.date), "d MMM yyyy", { locale: fr });
              return (
                <li
                  key={r.date}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 14px",
                    background: "white",
                    border: "2px solid var(--ink)",
                    borderRadius: "var(--r-lg)",
                    fontFamily: "var(--font-cond)",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "var(--ink)",
                  }}
                >
                  <span style={{ flex: 1 }}>{dateFmt}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15 }}>
                    {r.scores.inattention} · {r.scores.hyperactivite} ·{" "}
                    {r.scores.totalRepercussions}
                  </span>
                </li>
              );
            })}
        </ul>
        <p
          style={{
            fontFamily: "var(--font-cond)",
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "var(--ink-2)",
            marginTop: 12,
            textAlign: "center",
          }}
        >
          Inatt. · Hyper. · Total répercussions
        </p>
      </Card>

      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <Link href="/outils/evaluation/resultats" className="eval-btn-primary">
          Voir mon dernier rapport →
        </Link>
        <Link href="/outils/evaluation" className="eval-btn-secondary">
          Refaire l'évaluation
        </Link>
      </div>
    </>
  );
}
