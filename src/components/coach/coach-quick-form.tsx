"use client";

import { useState } from "react";
import {
  ANSWER_LABELS,
  type QuickAnswer,
  QUICK_QUESTIONS,
} from "@/lib/coach/quick-questionnaire";

type Props = {
  onComplete: (answers: Record<string, QuickAnswer>) => void;
  onCancel: () => void;
};

export function CoachQuickForm({ onComplete, onCancel }: Props) {
  const [answers, setAnswers] = useState<Record<string, QuickAnswer>>({});
  const [stepIdx, setStepIdx] = useState(0);

  const total = QUICK_QUESTIONS.length;
  const cur = QUICK_QUESTIONS[stepIdx];
  if (!cur) return null;

  const select = (a: QuickAnswer) => {
    const next = { ...answers, [cur.id]: a };
    setAnswers(next);
    if (stepIdx < total - 1) {
      setTimeout(() => setStepIdx(stepIdx + 1), 200);
    } else {
      setTimeout(() => onComplete(next), 200);
    }
  };

  const back = () => {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  };

  const progressPct = Math.round(((stepIdx + 1) / total) * 100);

  return (
    <div className="coach-quick-form">
      <div className="coach-quick-progress">
        <div className="coach-quick-progress-track">
          <div
            className="coach-quick-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="coach-quick-progress-label">
          Question {stepIdx + 1} / {total}
        </div>
      </div>

      <div className="coach-quick-question">
        <p className="coach-quick-prompt">{cur.text}</p>
        {cur.hint && <p className="coach-quick-hint">{cur.hint}</p>}
      </div>

      <div className="coach-quick-answers">
        {([0, 1, 2, 3] as QuickAnswer[]).map((a) => {
          const selected = answers[cur.id] === a;
          return (
            <button
              key={a}
              type="button"
              onClick={() => select(a)}
              className={`coach-quick-answer ${selected ? "is-on" : ""}`}
            >
              <span className="coach-quick-answer-num">{a}</span>
              <span className="coach-quick-answer-label">{ANSWER_LABELS[a]}</span>
            </button>
          );
        })}
      </div>

      <div className="coach-quick-nav">
        {stepIdx > 0 ? (
          <button type="button" onClick={back} className="coach-quick-back">
            ← Précédent
          </button>
        ) : (
          <button type="button" onClick={onCancel} className="coach-quick-back">
            ← Retour
          </button>
        )}
      </div>
    </div>
  );
}
