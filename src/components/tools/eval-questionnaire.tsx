"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  answerKey,
  COMMON_INTRO,
  ETAPE1_PERIOD,
  ETAPE2_PERIOD,
  type EvalAnswers,
  type Question,
  SCALE_LABELS,
  type ScaleValue,
  SECTIONS,
  type SectionId,
  TOTAL_QUESTIONS,
} from "@/lib/tools/eval-data";
import {
  clearCurrent,
  finalizeEvaluation,
  loadCurrent,
  saveCurrent,
} from "@/lib/tools/eval-storage";
import { cn } from "@/lib/utils/cn";

type Phase = "loading" | "ready" | "intro" | "questions" | "transition" | "done";

export function EvalQuestionnaire() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<EvalAnswers>({});
  const [resumeAvailable, setResumeAvailable] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const section = SECTIONS[sectionIndex];
  const isLastSection = sectionIndex === SECTIONS.length - 1;
  const isFirstOfEtape2 = section?.etape === 2 && SECTIONS[sectionIndex - 1]?.etape === 1;

  // Hydration : charge la session en cours s'il y en a une
  useEffect(() => {
    const current = loadCurrent();
    if (current && Object.keys(current.answers).length > 0) {
      setSectionIndex(current.sectionIndex);
      setAnswers(current.answers);
      setStartedAt(current.startedAt);
      setResumeAvailable(true);
      setPhase("ready");
    } else {
      setPhase("intro");
    }
  }, []);

  // Auto-save à chaque changement d'answers ou sectionIndex (sauf phase loading/intro)
  useEffect(() => {
    if (phase === "questions" || phase === "transition") {
      saveCurrent({
        sectionIndex,
        answers,
        startedAt: startedAt ?? Date.now(),
      });
    }
  }, [answers, sectionIndex, phase, startedAt]);

  const answeredCount = useMemo(() => Object.values(answers).filter((v) => v !== undefined).length, [answers]);
  const progressPct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const setAnswer = (sectionId: SectionId, qIndex: number, value: ScaleValue) => {
    setAnswers((prev) => ({ ...prev, [answerKey(sectionId, qIndex)]: value }));
  };

  const sectionAnsweredCount = section
    ? section.questions.filter((_q, i) => answers[answerKey(section.id, i)] !== undefined).length
    : 0;
  const sectionTotal = section ? section.questions.length : 0;
  const sectionFullyAnswered = section ? sectionAnsweredCount === sectionTotal : false;

  const goNext = () => {
    if (isLastSection) {
      finalizeEvaluation(answers);
      setPhase("done");
      return;
    }
    // Insert transition entre étape 1 et étape 2
    if (section?.etape === 1 && SECTIONS[sectionIndex + 1]?.etape === 2 && phase !== "transition") {
      setPhase("transition");
      return;
    }
    setSectionIndex((i) => i + 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    if (sectionIndex === 0) return;
    setSectionIndex((i) => i - 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startFresh = () => {
    clearCurrent();
    setAnswers({});
    setSectionIndex(0);
    setStartedAt(Date.now());
    setResumeAvailable(false);
    setPhase("questions");
  };

  const continueExisting = () => {
    setPhase("questions");
  };

  /* ================== RENDER ================== */
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

  if (phase === "ready" && resumeAvailable) {
    return (
      <ResumePrompt
        progressPct={progressPct}
        answeredCount={answeredCount}
        onResume={continueExisting}
        onRestart={startFresh}
      />
    );
  }

  if (phase === "intro") {
    return <IntroScreen onStart={startFresh} />;
  }

  if (phase === "transition") {
    return (
      <TransitionScreen
        onContinue={() => {
          setSectionIndex((i) => i + 1);
          setPhase("questions");
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  if (phase === "done") {
    return <DoneScreen />;
  }

  if (!section) return null;

  return (
    <>
      <EvalProgressBar pct={progressPct} answered={answeredCount} total={TOTAL_QUESTIONS} />

      <div className="eval-section-head" style={{ ["--accent" as string]: section.color }}>
        <span className="eval-section-badge">{section.badge}</span>
        <h2 className="eval-section-title">{section.title}</h2>
        {isFirstOfEtape2 && (
          <p className="eval-section-period">{ETAPE2_PERIOD}</p>
        )}
        {sectionIndex === 0 && <p className="eval-section-period">{ETAPE1_PERIOD}</p>}
        <p className="eval-section-intro">{COMMON_INTRO}</p>
      </div>

      <div className="eval-questions">
        {section.questions.map((q, qIndex) => (
          <QuestionCard
            key={`${section.id}-${qIndex}`}
            n={qIndex + 1}
            question={q}
            value={answers[answerKey(section.id, qIndex)]}
            onChange={(v) => setAnswer(section.id, qIndex, v)}
            color={section.color}
          />
        ))}
      </div>

      <div className="eval-nav">
        <button
          type="button"
          onClick={goPrev}
          className="eval-btn-secondary"
          disabled={sectionIndex === 0}
        >
          ← Précédent
        </button>
        <span className="eval-nav-counter">
          {sectionIndex + 1} / {SECTIONS.length}
        </span>
        <button
          type="button"
          onClick={goNext}
          className="eval-btn-primary"
          style={{ background: section.color }}
          disabled={!sectionFullyAnswered}
        >
          {isLastSection ? "Voir mes résultats" : "Suivant →"}
        </button>
      </div>

      {!sectionFullyAnswered && (
        <p className="eval-hint">
          Réponds aux {sectionTotal} questions pour passer à la suite.
          <br />
          ({sectionTotal - sectionAnsweredCount} restante{sectionTotal - sectionAnsweredCount > 1 ? "s" : ""})
        </p>
      )}
    </>
  );
}

/* =========================================================
   Sub-components
   ========================================================= */

function EvalProgressBar({ pct, answered, total }: { pct: number; answered: number; total: number }) {
  return (
    <div className="eval-progress">
      <div className="eval-progress-bar">
        <div className="eval-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="eval-progress-text">
        {answered} / {total} questions · {pct}%
      </span>
    </div>
  );
}

function QuestionCard({
  n,
  question,
  value,
  onChange,
  color,
}: {
  n: number;
  question: Question;
  value: ScaleValue | undefined;
  onChange: (v: ScaleValue) => void;
  color: string;
}) {
  return (
    <div className={cn("eval-q-card", value !== undefined && "answered")}>
      <div className="eval-q-head">
        <span className="eval-q-num">{n}</span>
        <p
          className="eval-q-text"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: contenu maîtrisé (data statique du proto, juste <b> pour emphase)
          dangerouslySetInnerHTML={{ __html: question.text }}
        />
      </div>
      {question.detail && <p className="eval-q-detail">{question.detail}</p>}
      <div className="eval-scale" role="radiogroup" aria-label="Fréquence">
        {SCALE_LABELS.map((label, i) => {
          const v = i as ScaleValue;
          const on = value === v;
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={on}
              className={cn("eval-scale-btn", on && "on")}
              style={on ? { background: color, borderColor: color, color: "white" } : undefined}
              onClick={() => onChange(v)}
            >
              <span className="eval-scale-num">{i}</span>
              <span className="eval-scale-label">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResumePrompt({
  progressPct,
  answeredCount,
  onResume,
  onRestart,
}: {
  progressPct: number;
  answeredCount: number;
  onResume: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="eval-card">
      <h2 className="eval-resume-title">On reprend où tu t'étais arrêté ?</h2>
      <p className="eval-resume-sub">
        Tu avais répondu à <strong>{answeredCount} questions sur {TOTAL_QUESTIONS}</strong> ({progressPct}%).
      </p>
      <div className="eval-resume-actions">
        <button type="button" onClick={onResume} className="eval-btn-primary">
          Reprendre →
        </button>
        <button type="button" onClick={onRestart} className="eval-btn-ghost">
          Recommencer à zéro
        </button>
      </div>
    </div>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="eval-card">
      <h2 className="eval-intro-title">Auto-évaluation TDAH</h2>
      <p className="eval-intro-lead">
        Un questionnaire en deux étapes pour observer la fréquence de tes symptômes et leurs
        répercussions au quotidien.
      </p>
      <div className="eval-intro-steps">
        <div className="eval-intro-step">
          <div className="eval-intro-step-num">1</div>
          <div className="eval-intro-step-text">
            <strong>Sévérité</strong>
            <br />
            18 questions sur les 6 derniers mois (Inattention + Hyperactivité)
          </div>
        </div>
        <div className="eval-intro-step">
          <div className="eval-intro-step-num">2</div>
          <div className="eval-intro-step-text">
            <strong>Répercussions</strong>
            <br />
            50 questions sur le dernier mois, réparties en 10 domaines
          </div>
        </div>
      </div>
      <p className="eval-intro-time">Comptez 8 à 12 minutes. Tu peux quitter et reprendre.</p>
      <p className="eval-disclaimer">
        Outil psychoéducatif. Ne remplace pas un diagnostic clinique. Les données restent sur ton
        appareil.
      </p>
      <button type="button" onClick={onStart} className="eval-btn-primary eval-btn-large">
        Commencer l'évaluation
      </button>
    </div>
  );
}

function TransitionScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="eval-card">
      <h2 className="eval-trans-title">Étape 1 terminée.</h2>
      <p className="eval-trans-sub">
        Bien joué. On enchaîne avec l'<strong>étape 2</strong> : 50 questions sur les répercussions
        de tes symptômes au quotidien (10 domaines de 5 questions).
      </p>
      <p className="eval-trans-period">
        Réfléchis à <strong>ton dernier mois</strong> en répondant à cette section.
      </p>
      <div className="eval-resume-actions">
        <button type="button" onClick={onContinue} className="eval-btn-primary eval-btn-large">
          Continuer →
        </button>
      </div>
    </div>
  );
}

function DoneScreen() {
  return (
    <div className="eval-card">
      <h2 className="eval-done-title">Évaluation enregistrée.</h2>
      <p className="eval-done-sub">
        Merci d'avoir pris le temps. Tes réponses sont sauvegardées localement.
      </p>
      <p className="eval-done-meta">
        La page de résultats détaillée arrive en session 2 (graphiques, niveaux par rubrique,
        export PDF).
      </p>
      <Link href="/outils" className="eval-btn-primary eval-btn-large">
        Retour aux outils
      </Link>
    </div>
  );
}
