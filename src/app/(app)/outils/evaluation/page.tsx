import { EvalQuestionnaire } from "@/components/tools/eval-questionnaire";
import { Headline, IntroHand, SectionLabel } from "@/components/journal/typography";

export default function EvaluationPage() {
  return (
    <>
      <IntroHand>
        Mon évaluation, aujourd'hui.
        <br />
        <span style={{ color: "var(--ink-2)" }}>
          Pas un diagnostic. Une photo de l'instant pour voir où j'en suis.
        </span>
      </IntroHand>

      <SectionLabel>Auto-évaluation</SectionLabel>
      <Headline accent="68 questions">Mes symptômes & leurs répercussions</Headline>

      <EvalQuestionnaire />
    </>
  );
}
