"use client";

import { useEffect, useMemo, useState } from "react";
import { IconBolt, IconClock, IconHourglass } from "@/components/icons";
import { Card } from "@/components/journal/cards";
import { Field, FreeArea } from "@/components/journal/inputs";
import {
  Headline,
  HLQuote,
  IntroHand,
  Label,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import { MonsterReflexif } from "@/components/monsters";
import {
  averageGapMinutes,
  EMPTY_TIMING_DRAFT,
  FORGOTTEN_THRESHOLD_MS,
  formatDuration,
  formatMinutes,
  TASK_PLACEHOLDERS,
  TIMING_ORANGE,
  TIMING_PRESETS_MIN,
  TIMING_STORAGE,
  type TimingDraft,
  type TimingEntry,
} from "@/lib/tools/timing-data";
import { TimingHistory } from "./timing-history";
import { TimingRecap } from "./timing-recap";

type Phase = 0 | 1 | 2 | 3;

export function TimingTool() {
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<Phase>(0);
  const [draft, setDraft] = useState<TimingDraft>(EMPTY_TIMING_DRAFT);
  const [hist, setHist] = useState<TimingEntry[]>([]);
  const [resumeOffer, setResumeOffer] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualMin, setManualMin] = useState<string>("");
  const [pendingRecap, setPendingRecap] = useState<{
    task: string;
    estimateMin: number;
    realSec: number;
  } | null>(null);
  const [recapNote, setRecapNote] = useState("");
  const [placeholder] = useState(
    () =>
      TASK_PLACEHOLDERS[Math.floor(Math.random() * TASK_PLACEHOLDERS.length)] ??
      "Répondre à 3 mails",
  );
  const [now, setNow] = useState(() => Date.now());

  // Hydratation
  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(TIMING_STORAGE.draft);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft) as TimingDraft;
        if (parsed?.startedAt) {
          setDraft(parsed);
          setPhase(2);
          setResumeOffer(true);
        } else if (parsed) {
          setDraft(parsed);
        }
      }
      const rawHist = localStorage.getItem(TIMING_STORAGE.hist);
      if (rawHist) setHist(JSON.parse(rawHist) as TimingEntry[]);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persistance draft (debounce 800ms)
  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      try {
        if (phase === 2 || draft.task || draft.estimateMin != null) {
          localStorage.setItem(TIMING_STORAGE.draft, JSON.stringify(draft));
        } else {
          localStorage.removeItem(TIMING_STORAGE.draft);
        }
      } catch {
        // ignore
      }
    }, 800);
    return () => clearTimeout(id);
  }, [draft, phase, hydrated]);

  // Persistance historique
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(TIMING_STORAGE.hist, JSON.stringify(hist));
    } catch {
      // ignore
    }
  }, [hist, hydrated]);

  // Refresh "now" toutes les 30s en phase 2 (pour bandeau "depuis X")
  useEffect(() => {
    if (phase !== 2) return;
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [phase]);

  const set = (patch: Partial<TimingDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));

  const startTask = () => {
    if (!draft.estimateMin) return;
    setNow(Date.now());
    set({ startedAt: Date.now() });
    setPhase(2);
  };

  const finishAuto = () => {
    if (!draft.startedAt || !draft.estimateMin) return;
    const realSec = Math.round((Date.now() - draft.startedAt) / 1000);
    setPendingRecap({
      task: draft.task,
      estimateMin: draft.estimateMin,
      realSec,
    });
    setPhase(3);
  };

  const finishManual = () => {
    if (!draft.estimateMin) return;
    const min = Number.parseInt(manualMin, 10);
    if (Number.isNaN(min) || min < 1) return;
    setPendingRecap({
      task: draft.task,
      estimateMin: draft.estimateMin,
      realSec: min * 60,
    });
    setManualMode(false);
    setManualMin("");
    setPhase(3);
  };

  const cancelTask = () => {
    setDraft(EMPTY_TIMING_DRAFT);
    setManualMode(false);
    setManualMin("");
    setResumeOffer(false);
    setPhase(0);
  };

  const saveRecap = () => {
    if (!pendingRecap) return;
    const entry: TimingEntry = {
      t: Date.now(),
      task: pendingRecap.task,
      estimateMin: pendingRecap.estimateMin,
      realSec: pendingRecap.realSec,
      ...(recapNote ? { note: recapNote } : {}),
    };
    setHist((h) => [...h, entry].slice(-60));
    setDraft(EMPTY_TIMING_DRAFT);
    setPendingRecap(null);
    setRecapNote("");
    setResumeOffer(false);
    setPhase(0);
  };

  const newOne = () => {
    if (!pendingRecap) return;
    const entry: TimingEntry = {
      t: Date.now(),
      task: pendingRecap.task,
      estimateMin: pendingRecap.estimateMin,
      realSec: pendingRecap.realSec,
      ...(recapNote ? { note: recapNote } : {}),
    };
    setHist((h) => [...h, entry].slice(-60));
    setDraft(EMPTY_TIMING_DRAFT);
    setPendingRecap(null);
    setRecapNote("");
    setResumeOffer(false);
    setPhase(1);
  };

  const avgGap = useMemo(() => averageGapMinutes(hist), [hist]);
  const elapsedMs = draft.startedAt ? now - draft.startedAt : 0;
  const elapsedMin = Math.floor(elapsedMs / 60_000);
  const isForgotten = elapsedMs > FORGOTTEN_THRESHOLD_MS;

  // ============== PHASE 0 — HUB ==============
  if (phase === 0) {
    return (
      <>
        <IntroHand>
          Mesurer pour mieux connaître.
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Pas pour faire vite. Pour calibrer ton senti du temps.
          </span>
        </IntroHand>

        <SectionLabel num="06">Outil de la rubrique</SectionLabel>
        <Headline accent="& cécité au temps">Temps</Headline>

        <div className="timing-hero" style={{ background: TIMING_ORANGE }}>
          <div className="timing-hero-eyebrow">Estimation de durée · cycle court</div>
          <h3 className="timing-hero-title">Estimer une tâche</h3>
          <p className="timing-hero-text">
            Tu choisis une action concrète, tu donnes ton estimation, tu fais la tâche,
            tu reviens. L'app calcule ton écart sans jugement.
          </p>
          <button type="button" onClick={() => setPhase(1)} className="timing-hero-cta">
            Commencer une estimation →
          </button>

          {avgGap !== null && (
            <div className="timing-hero-stat">
              <span className="timing-hero-stat-label">
                Sur tes {hist.length} mesures
              </span>
              <span className="timing-hero-stat-value">
                {avgGap >= 0 ? "+" : "−"}
                {formatMinutes(Math.round(Math.abs(avgGap)))}
              </span>
              <span className="timing-hero-stat-sub">
                d'écart moyen — {avgGap >= 0 ? "tu sous-estimes" : "tu sur-estimes"}
              </span>
            </div>
          )}
        </div>

        <SectionLabel num="•">Mes dernières estimations</SectionLabel>
        <Headline accent="dans la durée">Ce qui se dessine</Headline>
        <Card
          icon={IconClock}
          title="12 dernières mesures"
          sub="Pas un jugement — un motif que tu peux remarquer en revenant ici."
        >
          <TimingHistory hist={hist} onClear={() => setHist([])} />
        </Card>

        <HLQuote>
          Le temps que tu sens
          <br />
          n'est pas le temps qui <span style={{ color: TIMING_ORANGE }}>passe</span>.
        </HLQuote>

        <Retain title="MESURER, C'EST APPRIVOISER LA CÉCITÉ AU TEMPS." monster={MonsterReflexif}>
          La cécité au temps n'est pas un défaut moral — c'est un fonctionnement neuro.
          Tu n'as pas à devenir « bon en estimation ». Tu as juste à observer ton biais,
          tâche après tâche. Le cerveau apprend en mesurant, pas en se jugeant.
        </Retain>
      </>
    );
  }

  // ============== PHASE 1 — SAISIE ==============
  if (phase === 1) {
    const canStart = draft.task.trim().length > 0 && draft.estimateMin != null;
    return (
      <>
        <IntroHand>Avant de te lancer.</IntroHand>

        <SectionLabel num="1">La tâche concrète</SectionLabel>
        <Headline accent="précise et réelle">Une action</Headline>
        <Card
          icon={IconBolt}
          title="Quelle tâche concrète ?"
          sub="Une action que tu peux commencer maintenant. Évite les catégories vagues type « administratif »."
        >
          <Field
            value={draft.task}
            onChange={(v) => set({ task: v })}
            placeholder={`Ex : ${placeholder}`}
          />
        </Card>

        <SectionLabel num="2">Combien de temps, à ton avis ?</SectionLabel>
        <Headline accent="ne réfléchis pas trop">Estimation</Headline>
        <Card
          icon={IconHourglass}
          title="Sans calcul, à l'instinct"
          sub="C'est exactement le but : noter ton premier ressenti, même approximatif."
        >
          <div className="timing-presets">
            {TIMING_PRESETS_MIN.map((m) => {
              const on = draft.estimateMin === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => set({ estimateMin: m })}
                  className={`timing-preset ${on ? "is-on" : ""}`}
                >
                  {formatMinutes(m)}
                </button>
              );
            })}
          </div>
          <Label>Ou un autre nombre (en minutes)</Label>
          <Field
            value={
              draft.estimateMin != null && !TIMING_PRESETS_MIN.includes(draft.estimateMin)
                ? String(draft.estimateMin)
                : ""
            }
            onChange={(v) => {
              const n = Number.parseInt(v, 10);
              if (Number.isNaN(n) || n < 1) {
                set({ estimateMin: null });
              } else {
                set({ estimateMin: n });
              }
            }}
            placeholder="Ex : 12"
          />
        </Card>

        <div className="timing-nav-row">
          <button
            type="button"
            onClick={() => {
              setDraft(EMPTY_TIMING_DRAFT);
              setPhase(0);
            }}
            className="timing-nav-btn"
          >
            ← Annuler
          </button>
          <button
            type="button"
            onClick={startTask}
            disabled={!canStart}
            className={`timing-primary-btn ${canStart ? "" : "is-disabled"}`}
          >
            C'est parti →
          </button>
        </div>
      </>
    );
  }

  // ============== PHASE 2 — PENDANT ==============
  if (phase === 2) {
    return (
      <>
        <IntroHand>
          Tâche en cours.
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Reviens ici quand tu as fini — pas avant.
          </span>
        </IntroHand>

        {resumeOffer && isForgotten && (
          <div className="timing-forgotten-banner">
            <div className="timing-forgotten-eyebrow">Tâche en cours depuis longtemps</div>
            <div className="timing-forgotten-title">
              Cette tâche tourne depuis{" "}
              <b>{formatDuration(elapsedMs / 1000)}</b>.
            </div>
            <div className="timing-forgotten-sub">
              Si tu as fini il y a un moment, saisis manuellement le temps que ça t'a
              vraiment pris. Sinon, continue tranquille.
            </div>
          </div>
        )}

        <div className="timing-active-card">
          <div className="timing-active-eyebrow">Estimation initiale</div>
          <div className="timing-active-estim">
            {draft.estimateMin != null ? formatMinutes(draft.estimateMin) : "—"}
          </div>
          <div className="timing-active-task">
            {draft.task || "Tâche sans nom"}
          </div>
          <div className="timing-active-since">
            En cours depuis ~{elapsedMin < 1 ? "à l'instant" : `${formatMinutes(elapsedMin)}`}
          </div>
        </div>

        {!manualMode ? (
          <>
            <button
              type="button"
              onClick={finishAuto}
              className="timing-finish-btn"
              style={{ background: TIMING_ORANGE }}
            >
              ✓ Terminé
            </button>

            <div className="timing-secondary-row">
              <button
                type="button"
                onClick={() => setManualMode(true)}
                className="timing-ghost-btn"
              >
                J'ai oublié — saisir manuellement
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm("Annuler cette mesure ? Elle ne sera pas enregistrée.")
                  ) {
                    cancelTask();
                  }
                }}
                className="timing-ghost-btn"
              >
                Annuler
              </button>
            </div>
          </>
        ) : (
          <div className="timing-manual-card">
            <Label>Combien de temps ça t'a pris (en minutes) ?</Label>
            <Field
              value={manualMin}
              onChange={setManualMin}
              placeholder="Ex : 35"
            />
            <div className="timing-secondary-row" style={{ marginTop: 12 }}>
              <button
                type="button"
                onClick={() => {
                  setManualMode(false);
                  setManualMin("");
                }}
                className="timing-ghost-btn"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={finishManual}
                disabled={
                  manualMin === "" || Number.isNaN(Number.parseInt(manualMin, 10))
                }
                className={`timing-primary-btn ${manualMin === "" ? "is-disabled" : ""}`}
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // ============== PHASE 3 — RECAP ==============
  if (phase === 3 && pendingRecap) {
    return (
      <>
        <IntroHand>
          Voilà.
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Pas un score. Une mesure de plus pour calibrer ton intuition.
          </span>
        </IntroHand>

        <TimingRecap
          task={pendingRecap.task}
          estimateMin={pendingRecap.estimateMin}
          realSec={pendingRecap.realSec}
        />

        <SectionLabel num="•">Une note ? (optionnelle)</SectionLabel>
        <Headline accent="ce qui a changé">Contexte</Headline>
        <Card
          icon={IconHourglass}
          title="Un mot, si quelque chose t'a frappé"
          sub="Ex : « interrompu », « plus complexe que prévu », « j'étais en forme »."
        >
          <FreeArea
            value={recapNote}
            onChange={setRecapNote}
            placeholder="Optionnel — laisse vide si rien à dire."
          />
        </Card>

        <div className="timing-nav-row">
          <button type="button" onClick={newOne} className="timing-nav-btn">
            Estimer une autre tâche
          </button>
          <button
            type="button"
            onClick={saveRecap}
            className="timing-primary-btn"
            style={{ background: TIMING_ORANGE }}
          >
            ✓ Enregistrer · revenir au hub
          </button>
        </div>
      </>
    );
  }

  return null;
}
