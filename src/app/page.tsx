import { format, startOfDay, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import {
  IconBattery,
  IconCloud,
  IconCompass,
  IconFlower,
  IconHeart,
  IconMoon,
  IconSeedling,
  IconSun,
} from "@/components/icons";
import { CalendarHeatmap, type DayState } from "@/components/charts/calendar-heatmap";
import { EmotionDistribution } from "@/components/charts/emotion-distribution";
import { ScaleTrend } from "@/components/charts/scale-trend";
import { Card } from "@/components/journal/cards";
import {
  HandNote,
  Headline,
  HLQuote,
  IntroHand,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import { AppFooter } from "@/components/layout/app-footer";
import { HubHeader } from "@/components/layout/hub-header";
import { TabsNav } from "@/components/layout/tabs-nav";
import { MonsterReflexif } from "@/components/monsters";
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
  const today = new Date();
  const todayISO = format(today, "yyyy-MM-dd");
  const yesterdayISO = format(subDays(today, 1), "yyyy-MM-dd");
  const dateLong = format(today, "EEEE d MMMM yyyy", { locale: fr });
  const dateLongCap = dateLong.charAt(0).toUpperCase() + dateLong.slice(1);

  const data = generateMockData(today);
  const morningToday = data.morningByDate.get(todayISO);
  const eveningToday = data.eveningByDate.get(todayISO);
  const eveningYesterday = data.eveningByDate.get(yesterdayISO);
  const lastWeek = data.weeks[data.weeks.length - 1];

  // États du calendrier (90 derniers jours)
  const states = new Map<string, DayState>();
  for (let i = 0; i < 90; i++) {
    const d = format(subDays(startOfDay(today), i), "yyyy-MM-dd");
    const m = data.morningByDate.get(d);
    const e = data.eveningByDate.get(d);
    if (m || e) {
      states.set(d, { hasMorning: !!m, hasEvening: !!e });
    }
  }

  // Données 30 jours pour les courbes
  const last30 = getMorningsInRange(data, subDays(startOfDay(today), 29), startOfDay(today));
  const energieData = last30.map((p) => ({ date: p.date, value: p.entry?.energie ?? null }));
  const sommeilData = last30.map((p) => ({ date: p.date, value: p.entry?.sommeil ?? null }));
  const mentalData = last30.map((p) => ({ date: p.date, value: p.entry?.mental ?? null }));

  const morningEmotions = emotionCountsLastDays(data, 30, "morning", today);
  const totalMornings = Array.from(morningEmotions.values()).reduce((s, v) => s + v, 0);

  return (
    <>
      <HubHeader />

      <main className="page-shell">
        <div className="page">
          <IntroHand>
            {dateLongCap}.
            <br />
            <span style={{ color: "var(--ink-2)" }}>Que dit ton journal ?</span>
          </IntroHand>

          {/* ============ AUJOURD'HUI ============ */}
          <SectionLabel num="1">Aujourd'hui</SectionLabel>
          <Headline accent="aujourd'hui">Mon journal</Headline>

          <Card
            icon={IconSun}
            iconColor="var(--ch-observer)"
            title="Mon matin"
            sub={
              morningToday
                ? "Posé. Tu peux le revoir, le compléter, ou simplement passer."
                : "Pas encore posé. Pas de pression, quand tu veux."
            }
          >
            <div className="hub-tile-row">
              <Link
                href={`/aujourdhui?moment=matin&date=${todayISO}`}
                className={`hub-tile ${morningToday ? "done" : "todo"}`}
              >
                <span className="hub-tile-state">
                  {morningToday ? "✓" : "→"}
                </span>
                <span className="hub-tile-label">
                  {morningToday ? "Voir / modifier" : "Remplir maintenant"}
                </span>
              </Link>
            </div>
            {morningToday?.intention && (
              <div className="hub-intent-quote">« {morningToday.intention} »</div>
            )}
          </Card>

          <Card
            icon={IconMoon}
            iconColor="var(--ch-soin)"
            title="Mon soir"
            sub={
              eveningToday
                ? "Bilan posé. Tu peux le rouvrir si une chose veut sortir."
                : "Le soir vient en fin de journée, quand tu seras prêt(e)."
            }
          >
            <div className="hub-tile-row">
              <Link
                href={`/aujourdhui?moment=soir&date=${todayISO}`}
                className={`hub-tile ${eveningToday ? "done" : "todo"}`}
              >
                <span className="hub-tile-state">{eveningToday ? "✓" : "→"}</span>
                <span className="hub-tile-label">
                  {eveningToday ? "Voir / modifier" : "Remplir ce soir"}
                </span>
              </Link>
            </div>
          </Card>

          <HandNote>« Le journal n'attend rien. Il est juste là. »</HandNote>

          {/* ============ CALENDRIER ============ */}
          <SectionLabel num="2">Mes 30 derniers jours</SectionLabel>
          <Headline accent="d'un seul regard">Le calendrier</Headline>

          <Card title="Mois en cours" sub="Clique sur un jour passé pour le rouvrir.">
            <CalendarHeatmap
              states={states}
              today={today}
              hrefBase="/aujourdhui?moment=matin&date="
            />
          </Card>

          {/* ============ MA BOUSSOLE ============ */}
          <SectionLabel num="3">Ma boussole</SectionLabel>
          <Headline accent="qui me tient debout">Ce que je sais</Headline>

          <Card icon={IconHeart} iconColor="var(--ch-temps)" title="Mes 3 valeurs" sub="Ce qui résonne quand tu y penses.">
            <div className="hub-values">
              {data.compass.values.map((v) => (
                <span key={v} className="hub-value-chip">
                  {VALUE_LABELS[v] ?? v}
                </span>
              ))}
            </div>
          </Card>

          <Card
            icon={IconCompass}
            iconColor="var(--ch-temps)"
            title="Cette saison"
            sub="Pas trois objectifs. Trois envies."
          >
            <ul className="hub-envies">
              <li>{data.compass.e1}</li>
              <li>{data.compass.e2}</li>
              <li>{data.compass.e3}</li>
            </ul>
            <Link href="/recap" className="hub-card-link">
              Modifier ma boussole →
            </Link>
          </Card>

          {/* ============ ÉVOLUTION ============ */}
          <SectionLabel num="4">Évolution</SectionLabel>
          <Headline accent="30 derniers jours">Mon paysage</Headline>

          <Card icon={IconBattery} iconColor="var(--ch-observer)" title="Énergie corporelle">
            <ScaleTrend label="Énergie" data={energieData} color="#1B4FE5" />
          </Card>
          <Card icon={IconMoon} iconColor="var(--ch-soin)" title="Sommeil">
            <ScaleTrend label="Sommeil" data={sommeilData} color="#B05BC9" />
          </Card>
          <Card icon={IconCloud} iconColor="var(--ch-attention)" title="État mental">
            <ScaleTrend label="État mental" data={mentalData} color="#14B8A6" />
          </Card>

          <Card
            icon={IconFlower}
            iconColor="var(--ch-emotions)"
            title="Émotions du matin"
            sub="Lesquelles reviennent le plus souvent ?"
          >
            <EmotionDistribution counts={morningEmotions} total={totalMornings} />
          </Card>

          {/* ============ CETTE SEMAINE ============ */}
          {(lastWeek?.learn || eveningYesterday?.lacher) && (
            <>
              <SectionLabel num="5">Cette semaine</SectionLabel>
              <Headline accent="qui restent">Les phrases</Headline>

              {lastWeek?.learn && (
                <Card
                  icon={IconSeedling}
                  iconColor="var(--ch-controle)"
                  title="Ce que j'ai appris"
                  sub={`Semaine du ${format(new Date(lastWeek.weekStart), "d MMMM", { locale: fr })}`}
                >
                  <HLQuote>{lastWeek.learn}</HLQuote>
                </Card>
              )}

              {eveningYesterday?.lacher && (
                <HandNote right>« {eveningYesterday.lacher} »</HandNote>
              )}
            </>
          )}

          {/* ============ RETAIN ============ */}
          <Retain title="TON JOURNAL EST UN MIROIR, PAS UN JUGE." monster={MonsterReflexif}>
            Ce que tu vois ici, c'est ton paysage. Pas de score, pas de classement, pas de série
            à tenir. Juste des données pour mieux te comprendre, et te traiter avec un peu plus
            de douceur.
          </Retain>
        </div>
        <AppFooter />
      </main>

      <TabsNav current={null} />
    </>
  );
}
