import { format, startOfDay, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { CalendarHeatmap, type DayState } from "@/components/charts/calendar-heatmap";
import { EmotionDistribution } from "@/components/charts/emotion-distribution";
import { ScaleTrend } from "@/components/charts/scale-trend";
import { AppFooter } from "@/components/layout/app-footer";
import { HubHeader } from "@/components/layout/hub-header";
import { TabsNav } from "@/components/layout/tabs-nav";
import { emotionCountsLastDays, generateMockData, getMorningsInRange } from "@/lib/mock/seed";

const VALUE_LABELS: Record<string, string> = {
  liberte: "Liberté",
  creation: "Création",
  lien: "Lien",
  verite: "Vérité",
  douceur: "Douceur",
  force: "Force",
  paix: "Paix",
  aventure: "Aventure",
  apprentis: "Apprendre",
};

export default function HubPage() {
  // Aujourd'hui : on simule la date "réelle" du test (on est le 7 mai 2026 selon CLAUDE)
  const today = new Date();
  const todayISO = format(today, "yyyy-MM-dd");
  const yesterdayISO = format(subDays(today, 1), "yyyy-MM-dd");

  const data = generateMockData(today);
  const morningToday = data.morningByDate.get(todayISO);
  const eveningToday = data.eveningByDate.get(todayISO);
  const eveningYesterday = data.eveningByDate.get(yesterdayISO);
  const lastWeek = data.weeks[data.weeks.length - 1];

  // Construire le map d'états du calendrier (90 derniers jours)
  const states = new Map<string, DayState>();
  for (let i = 0; i < 90; i++) {
    const d = format(subDays(startOfDay(today), i), "yyyy-MM-dd");
    const m = data.morningByDate.get(d);
    const e = data.eveningByDate.get(d);
    if (m || e) {
      const energieAvg = m ? m.energie : 3;
      states.set(d, {
        hasMorning: !!m,
        hasEvening: !!e,
        intensity: energieAvg,
      });
    }
  }

  // Données 30 jours pour les courbes
  const last30 = getMorningsInRange(data, subDays(startOfDay(today), 29), startOfDay(today));
  const energieData = last30.map((p) => ({
    date: p.date,
    value: p.entry?.energie ?? null,
  }));
  const sommeilData = last30.map((p) => ({
    date: p.date,
    value: p.entry?.sommeil ?? null,
  }));
  const mentalData = last30.map((p) => ({
    date: p.date,
    value: p.entry?.mental ?? null,
  }));

  // Émotions sur 30 jours
  const morningEmotions = emotionCountsLastDays(data, 30, "morning", today);
  const totalMornings = Array.from(morningEmotions.values()).reduce((s, v) => s + v, 0);

  return (
    <>
      <HubHeader today={today} greeting={greetingFor(today)} />

      <main className="page-shell">
        <div className="page" style={{ paddingTop: 32 }}>
          {/* AUJOURD'HUI */}
          <h2 className="hub-section-title">Aujourd'hui</h2>
          <div className="hub-card">
            <div className="hub-today-row">
              <Link
                href={`/matin?date=${todayISO}`}
                className={`hub-today-tile${morningToday ? " done" : ""}`}
              >
                <span className="state-dot" />
                <span>Matin</span>
                <span className="arrow">{morningToday ? "✓" : "→"}</span>
              </Link>
              <Link
                href={`/soir?date=${todayISO}`}
                className={`hub-today-tile${eveningToday ? " done" : ""}`}
              >
                <span className="state-dot" />
                <span>Soir</span>
                <span className="arrow">{eveningToday ? "✓" : "→"}</span>
              </Link>
            </div>
            {morningToday?.intention && (
              <div className="hub-intent">« {morningToday.intention} »</div>
            )}
          </div>

          {/* CALENDRIER */}
          <h2 className="hub-section-title">Calendrier</h2>
          <div className="hub-card">
            <CalendarHeatmap states={states} today={today} hrefBase="/matin?date=" />
          </div>

          {/* MES INTENTIONS (boussole) */}
          <h2 className="hub-section-title">Mes intentions</h2>
          <div className="hub-card">
            <div
              style={{
                fontFamily: "var(--font-cond)",
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
                marginBottom: 8,
              }}
            >
              3 valeurs
            </div>
            <div className="hub-values">
              {data.compass.values.map((v) => (
                <span key={v} className="hub-value-chip">
                  {VALUE_LABELS[v] ?? v}
                </span>
              ))}
            </div>
            <div
              style={{
                fontFamily: "var(--font-cond)",
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
                marginTop: 18,
                marginBottom: 4,
              }}
            >
              Cette saison
            </div>
            <ul className="hub-envies">
              <li>{data.compass.e1}</li>
              <li>{data.compass.e2}</li>
              <li>{data.compass.e3}</li>
            </ul>
            <div style={{ marginTop: 14 }}>
              <Link
                href="/boussole"
                style={{
                  fontFamily: "var(--font-cond)",
                  fontWeight: 800,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  borderBottom: "2px solid var(--ch-temps)",
                  paddingBottom: 2,
                  textDecoration: "none",
                }}
              >
                Modifier ma boussole →
              </Link>
            </div>
          </div>

          {/* ÉVOLUTION */}
          <h2 className="hub-section-title">Évolution · 30 derniers jours</h2>
          <div className="hub-card">
            <ScaleTrend label="Énergie corporelle" data={energieData} color="#1B4FE5" />
            <ScaleTrend label="Sommeil" data={sommeilData} color="#B05BC9" />
            <ScaleTrend label="État mental" data={mentalData} color="#14B8A6" />
          </div>

          <div className="hub-card">
            <div
              style={{
                fontFamily: "var(--font-cond)",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--ink)",
                marginBottom: 14,
              }}
            >
              Émotions du matin (30 jours)
            </div>
            <EmotionDistribution counts={morningEmotions} total={totalMornings} />
          </div>

          {/* APPRENTISSAGE DE LA SEMAINE */}
          {lastWeek?.learn && (
            <>
              <h2 className="hub-section-title">Ce que la semaine m'a appris</h2>
              <div className="hub-quote-card">
                <div className="quote-eyebrow">
                  Semaine du {format(new Date(lastWeek.weekStart), "d MMM", { locale: fr })}
                </div>
                <div className="quote-text">« {lastWeek.learn} »</div>
              </div>
            </>
          )}

          {/* LÂCHER-PRISE D'HIER */}
          {eveningYesterday?.lacher && (
            <>
              <h2 className="hub-section-title">Tu as déposé hier</h2>
              <div className="hub-quote-card">
                <div className="quote-eyebrow">
                  Soir du {format(subDays(today, 1), "d MMMM", { locale: fr })}
                </div>
                <div className="quote-text">« {eveningYesterday.lacher} »</div>
              </div>
            </>
          )}
        </div>
      </main>

      <TabsNav current={null} />
      <AppFooter />
    </>
  );
}

function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 5) return "Encore éveillé·e ?";
  if (h < 12) return "Bonjour. Doucement, à ton rythme.";
  if (h < 18) return "Bel après-midi.";
  if (h < 22) return "Belle soirée.";
  return "La nuit aussi est une réponse.";
}
