"use client";

import { useEffect, useRef, useState } from "react";
import { IconBook, IconClock } from "@/components/icons";
import { Card } from "@/components/journal/cards";
import {
  Headline,
  HLQuote,
  IntroHand,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import { MonsterCalme } from "@/components/monsters";
import {
  COHERENCE_PINK,
  COHERENCE_STORAGE,
  type CoherenceSession,
  CYCLE_PERIOD_MS,
  DEFAULT_DURATION_SEC,
  DURATION_PRESETS_SEC,
  formatMmSs,
  formatPresetLabel,
  totalCyclesFor,
} from "@/lib/tools/coherence-data";
import { CoherenceFlower } from "./coherence-flower";
import { CoherenceHistory } from "./coherence-history";

type Phase = "intro" | "running" | "done";

export function CoherenceTool() {
  const [hydrated, setHydrated] = useState(false);
  const [hist, setHist] = useState<CoherenceSession[]>([]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [durationSec, setDurationSec] = useState<number>(DEFAULT_DURATION_SEC);

  // Mécanique du temps avec gestion pause
  const [running, setRunning] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const pauseAccumRef = useRef<number>(0);
  const [, setNow] = useState(0); // force re-render

  // Hydratation
  useEffect(() => {
    try {
      const rawHist = localStorage.getItem(COHERENCE_STORAGE.hist);
      if (rawHist) setHist(JSON.parse(rawHist) as CoherenceSession[]);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persistance hist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(COHERENCE_STORAGE.hist, JSON.stringify(hist));
    } catch {
      // ignore
    }
  }, [hist, hydrated]);

  // Boucle d'animation : refresh seulement si running
  useEffect(() => {
    if (phase !== "running" || !running) return;
    let raf = 0;
    const loop = () => {
      setNow(Date.now());
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, running]);

  const computeElapsedMs = (): number => {
    if (!startedAtRef.current) return 0;
    const refTime = pausedAtRef.current ?? Date.now();
    return Math.max(0, refTime - startedAtRef.current - pauseAccumRef.current);
  };

  const elapsedMs = computeElapsedMs();
  const durationMs = durationSec * 1000;
  const isComplete = elapsedMs >= durationMs && phase === "running";

  // Auto-fin quand durée atteinte
  useEffect(() => {
    if (!isComplete) return;
    const completedSec = Math.min(durationSec, Math.round(elapsedMs / 1000));
    const cycles = Math.floor(elapsedMs / CYCLE_PERIOD_MS);
    const session: CoherenceSession = {
      t: Date.now(),
      durationSec,
      completedSec,
      cycles,
    };
    setHist((h) => [...h, session].slice(-60));
    setRunning(false);
    setPhase("done");
  }, [isComplete, durationSec, elapsedMs]);

  const startSession = () => {
    startedAtRef.current = Date.now();
    pausedAtRef.current = null;
    pauseAccumRef.current = 0;
    setRunning(true);
    setPhase("running");
  };

  const pauseSession = () => {
    if (!running) return;
    pausedAtRef.current = Date.now();
    setRunning(false);
  };

  const resumeSession = () => {
    if (running || !pausedAtRef.current) return;
    pauseAccumRef.current += Date.now() - pausedAtRef.current;
    pausedAtRef.current = null;
    setRunning(true);
  };

  const stopEarly = () => {
    const completedSec = Math.min(durationSec, Math.round(elapsedMs / 1000));
    const cycles = Math.floor(elapsedMs / CYCLE_PERIOD_MS);
    if (completedSec >= 30) {
      const session: CoherenceSession = {
        t: Date.now(),
        durationSec,
        completedSec,
        cycles,
      };
      setHist((h) => [...h, session].slice(-60));
    }
    setRunning(false);
    setPhase("done");
  };

  const reset = () => {
    startedAtRef.current = null;
    pausedAtRef.current = null;
    pauseAccumRef.current = 0;
    setRunning(false);
    setPhase("intro");
  };

  // ============== PHASE: INTRO ==============
  if (phase === "intro") {
    return (
      <>
        <IntroHand>
          Trois minutes pour calmer le système.
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            5 secondes inspire, 5 secondes expire — le rythme qui régule.
          </span>
        </IntroHand>

        <SectionLabel num="03">Outil de la rubrique</SectionLabel>
        <Headline accent="& Émotions">Impulsivité</Headline>

        <div className="coherence-tool-hero" style={{ background: COHERENCE_PINK }}>
          <div className="coherence-tool-hero-eyebrow">Cohérence cardiaque · 5/5</div>
          <h3 className="coherence-tool-hero-title">Respirer ensemble</h3>
          <p className="coherence-tool-hero-text">
            Une fleur qui s'ouvre quand tu inspires, qui se ferme quand tu expires.
            Tu suis le rythme, ton système nerveux suit. Pas besoin de comprendre
            comment ça marche pour que ça marche.
          </p>

          <div className="coherence-tool-presets">
            {DURATION_PRESETS_SEC.map((s) => {
              const on = durationSec === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDurationSec(s)}
                  className={`coherence-tool-preset ${on ? "is-on" : ""}`}
                >
                  {formatPresetLabel(s)}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={startSession}
            className="coherence-tool-start"
          >
            Commencer la session →
          </button>

          <div className="coherence-tool-hint">
            ≈ {totalCyclesFor(durationSec)} respirations · cycle de 10 s
          </div>
        </div>

        <SectionLabel num="•">Mes sessions</SectionLabel>
        <Headline accent="cumul tranquille">Suivi</Headline>
        <Card
          icon={IconClock}
          title="Mes 12 dernières sessions"
          sub="Pas un objectif. Chaque session compte, même courte."
        >
          <CoherenceHistory hist={hist} onClear={() => setHist([])} />
        </Card>

        <HLQuote>
          Le souffle ne ment pas.
          <br />
          Quand il <span style={{ color: COHERENCE_PINK }}>ralentit</span>, tout suit.
        </HLQuote>

        <Retain title="LE CORPS RÉGULE PLUS VITE QUE LA TÊTE." monster={MonsterCalme}>
          La cohérence cardiaque agit sur le système nerveux autonome via le nerf
          vague. Trois sessions par jour de 5 minutes — c'est le protocole 365 le plus
          étudié en cardiologie comportementale. Tu n'as rien à réussir, juste à
          suivre la fleur.
        </Retain>
      </>
    );
  }

  // ============== PHASE: RUNNING ==============
  if (phase === "running") {
    return (
      <>
        <IntroHand>
          {running ? "Suis la fleur." : "Pause — reprends quand tu veux."}
        </IntroHand>

        <CoherenceFlower
          elapsedMs={elapsedMs}
          durationMs={durationMs}
          running={running}
        />

        <div className="coherence-tool-controls">
          {running ? (
            <button
              type="button"
              onClick={pauseSession}
              className="coherence-tool-ctl is-pause"
            >
              ‖ Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={resumeSession}
              className="coherence-tool-ctl is-resume"
              style={{ background: COHERENCE_PINK }}
            >
              ▶ Reprendre
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  "Arrêter la session ? Le temps déjà respiré sera enregistré.",
                )
              ) {
                stopEarly();
              }
            }}
            className="coherence-tool-ctl is-stop"
          >
            ✕ Arrêter
          </button>
        </div>
      </>
    );
  }

  // ============== PHASE: DONE ==============
  if (phase === "done") {
    const lastSession = hist[hist.length - 1];
    const completed = lastSession ? lastSession.completedSec >= lastSession.durationSec : false;
    return (
      <>
        <IntroHand>
          {completed ? "Session terminée." : "Session arrêtée."}
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            {completed
              ? "Le système nerveux te remercie."
              : "Chaque minute respirée compte."}
          </span>
        </IntroHand>

        {lastSession && (
          <div
            className="coherence-tool-done-card"
            style={{ background: COHERENCE_PINK }}
          >
            <div className="coherence-tool-done-eyebrow">Cohérence cardiaque</div>
            <div className="coherence-tool-done-time">
              {formatMmSs(lastSession.completedSec)}
            </div>
            <div className="coherence-tool-done-cycles">
              {lastSession.cycles} respirations
            </div>
            <p className="coherence-tool-done-note">
              {completed
                ? "Tu as fait l'aller-retour complet. Le calme se dépose en quelques minutes encore après l'arrêt."
                : "Tu peux toujours en refaire une autre, même brève — le système y est sensible."}
            </p>
          </div>
        )}

        <Card
          icon={IconBook}
          title="Pour aller plus loin"
          sub="Le protocole 365 = 3 sessions par jour, 6 cycles par minute, 5 minutes — soit une « dose » thérapeutique. Une seule par jour reste utile."
        >
          <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55 }}>
            La cohérence cardiaque a été étudiée en cardiologie depuis David Servan-Schreiber.
            Effets attendus : baisse du cortisol, amélioration de la variabilité cardiaque,
            sensation de calme. Pas une cure miracle — un outil quotidien.
          </p>
        </Card>

        <div className="coherence-tool-done-actions">
          <button
            type="button"
            onClick={() => {
              reset();
              startSession();
            }}
            className="coherence-tool-ctl is-resume"
            style={{ background: COHERENCE_PINK }}
          >
            ↻ Recommencer
          </button>
          <button type="button" onClick={reset} className="coherence-tool-ctl is-stop">
            Revenir au hub
          </button>
        </div>
      </>
    );
  }

  return null;
}
