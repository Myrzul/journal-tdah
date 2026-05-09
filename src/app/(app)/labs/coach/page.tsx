"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CoachPathDisplay } from "@/components/coach/coach-path-display";
import { CoachQuickForm } from "@/components/coach/coach-quick-form";
import { CoachWelcome } from "@/components/coach/coach-welcome";
import { loadCoachStore, setProfile } from "@/lib/coach/coach-storage";
import {
  type CoachProfile,
  defaultProfile,
} from "@/lib/coach/coach-types";
import { buildAdaptivePath } from "@/lib/coach/path-builder";
import {
  type QuickAnswer,
  quickAnswersToScores,
} from "@/lib/coach/quick-questionnaire";

type Step = "loading" | "welcome" | "quick" | "full-redirect" | "path";

export default function CoachLabPage() {
  const [step, setStep] = useState<Step>("loading");
  const [profile, setProfileState] = useState<CoachProfile | null>(null);

  // Hydratation : si profil existant, on va direct au "path" pour test
  useEffect(() => {
    const store = loadCoachStore();
    if (store.profile) {
      setProfileState(store.profile);
      setStep("path");
    } else {
      setStep("welcome");
    }
  }, []);

  const handleQuickComplete = (answers: Record<string, QuickAnswer>) => {
    const scores = quickAnswersToScores(answers);
    const adaptivePath = buildAdaptivePath(scores);
    const now = Date.now();
    const newProfile: CoachProfile = {
      createdAt: now,
      updatedAt: now,
      mode: "quick",
      scores,
      adaptivePath,
      currentRubrique: "01",
    };
    setProfile(newProfile);
    setProfileState(newProfile);
    setStep("path");
  };

  const handleSkip = () => {
    const fallback = defaultProfile();
    setProfile(fallback);
    setProfileState(fallback);
    setStep("path");
  };

  const resetProfile = () => {
    if (confirm("Effacer ton profil et recommencer ?")) {
      setProfileState(null);
      setStep("welcome");
    }
  };

  if (step === "loading") {
    return (
      <div className="coach-loading" aria-busy="true">
        Chargement…
      </div>
    );
  }

  if (step === "welcome") {
    return (
      <CoachWelcome
        onPickQuick={() => setStep("quick")}
        onPickFull={() => setStep("full-redirect")}
        onSkip={handleSkip}
      />
    );
  }

  if (step === "quick") {
    return (
      <CoachQuickForm
        onComplete={handleQuickComplete}
        onCancel={() => setStep("welcome")}
      />
    );
  }

  if (step === "full-redirect") {
    return (
      <div className="coach-full-redirect">
        <div className="coach-welcome-eyebrow">Évaluation complète</div>
        <h2 className="coach-welcome-title">68 questions, plus précis</h2>
        <p className="coach-welcome-lead">
          On va utiliser <b>l'auto-évaluation TDAH</b> existante de l'app.
          Elle prend 15 à 20 minutes. Tu peux faire des pauses et reprendre.
        </p>
        <p className="coach-welcome-lead">
          Une fois terminée, <b>reviens ici</b> et l'app calculera
          automatiquement ton parcours à partir de tes résultats.
        </p>
        <div className="coach-welcome-choice" style={{ flexDirection: "column" }}>
          <Link
            href="/outils/evaluation"
            className="coach-choice-card is-full"
            style={{ textDecoration: "none" }}
          >
            <span className="coach-choice-eyebrow">Outil intégré</span>
            <span className="coach-choice-title">Démarrer l'auto-évaluation</span>
            <span className="coach-choice-text">
              Tu peux quitter et revenir, l'app garde où tu en étais.
            </span>
            <span className="coach-choice-cta">→ Ouvrir /outils/evaluation</span>
          </Link>
          <button
            type="button"
            onClick={() => setStep("welcome")}
            className="coach-skip-btn"
          >
            ← Revenir au choix
          </button>
        </div>

        <div className="coach-foot-note">
          <em>
            Note bêta — la lecture automatique des résultats de l'auto-évaluation
            pour produire ton parcours sera ajoutée dans une prochaine itération.
            Pour l'instant, fais l'évaluation puis reviens utiliser le mode rapide
            pour générer un parcours.
          </em>
        </div>
      </div>
    );
  }

  if (step === "path" && profile) {
    return (
      <>
        <CoachPathDisplay
          profile={profile}
          onContinue={() => {
            // Pour l'instant : redirige vers la rubrique courante du guide
            window.location.href = `/guide/${profile.currentRubrique === "01" ? "01-observer" : "01-observer"}`;
          }}
          onAdjust={() => setStep("welcome")}
        />
        <div className="coach-debug">
          <div className="coach-debug-eyebrow">Mode bêta</div>
          <pre className="coach-debug-pre">
            {JSON.stringify(profile.scores, null, 2)}
          </pre>
          <button type="button" onClick={resetProfile} className="coach-debug-reset">
            Effacer le profil et recommencer
          </button>
        </div>
      </>
    );
  }

  return null;
}
