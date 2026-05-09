"use client";

import { useEffect, useMemo, useState } from "react";
import { IconBook, IconHand, IconHeart, IconWind } from "@/components/icons";
import { Headline, IntroHand, SectionLabel } from "@/components/journal/typography";
import {
  addSmartObjective,
  deleteSmartObjective,
  loadGuideStore,
  markSectionRead,
  saveGuideStore,
  setNote,
  unmarkSectionRead,
} from "@/lib/guide/guide-storage";
import {
  EMPTY_GUIDE_STORE,
  emptyRubriqueProgress,
  type GuideStore,
  type RubriqueId,
  type RubriqueMeta,
  type SectionId,
  type SmartObjective,
} from "@/lib/guide/guide-types";
import { GuideMarkRead } from "./guide-mark-read";
import { GuidePersonalNote } from "./guide-personal-note";
import { GuidePhaseCard } from "./guide-phase-card";
import { GuideRubriqueHeader } from "./guide-rubrique-header";
import { GuideSectionTabs } from "./guide-section-tabs";
import { GuideSmartEditor } from "./guide-smart-editor";
import { GuideToolLink } from "./guide-tool-link";

const RUBRIQUE_ID: RubriqueId = "08";

type Props = { rubrique: RubriqueMeta };

export function Rubrique08Page({ rubrique }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [store, setStore] = useState<GuideStore>(EMPTY_GUIDE_STORE);
  const [active, setActive] = useState<SectionId>("intro");

  useEffect(() => {
    setStore(loadGuideStore());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => saveGuideStore(store), 500);
    return () => clearTimeout(id);
  }, [store, hydrated]);

  const progress = useMemo(
    () => store.progress[RUBRIQUE_ID] ?? emptyRubriqueProgress(RUBRIQUE_ID),
    [store],
  );

  const isRead = (s: SectionId) => progress.readSections.includes(s);
  const toggleRead = (s: SectionId) => {
    setStore((st) =>
      isRead(s) ? unmarkSectionRead(st, RUBRIQUE_ID, s) : markSectionRead(st, RUBRIQUE_ID, s),
    );
  };

  const onNoteSave = (key: string, val: string) => {
    setStore((st) => setNote(st, RUBRIQUE_ID, key, val));
  };

  const rubColor = rubrique.cssColor;

  return (
    <>
      <GuideRubriqueHeader rubrique={rubrique} />
      <GuideSectionTabs
        rubrique={rubrique}
        active={active}
        readSections={progress.readSections}
        onChange={setActive}
      />
      {active === "intro" && <SectionIntro rubColor={rubColor} read={isRead("intro")} onToggleRead={() => toggleRead("intro")} />}
      {active === "pratique" && <SectionPratique rubColor={rubColor} read={isRead("pratique")} onToggleRead={() => toggleRead("pratique")} />}
      {active === "histoire" && <SectionHistoire read={isRead("histoire")} onToggleRead={() => toggleRead("histoire")} rubColor={rubColor} />}
      {active === "phases" && (
        <SectionPhases
          rubColor={rubColor}
          notes={progress.notes}
          onNoteSave={onNoteSave}
          objectives={progress.smartObjectives}
          onAddObjective={(obj) => setStore((st) => addSmartObjective(st, RUBRIQUE_ID, obj))}
          onDeleteObjective={(id) => setStore((st) => deleteSmartObjective(st, RUBRIQUE_ID, id))}
          read={isRead("phases")}
          onToggleRead={() => toggleRead("phases")}
        />
      )}
      {active === "retenir" && <SectionRetenir read={isRead("retenir")} onToggleRead={() => toggleRead("retenir")} rubColor={rubColor} />}
    </>
  );
}

function SectionIntro({ rubColor, read, onToggleRead }: { rubColor: string; read: boolean; onToggleRead: () => void }) {
  return (
    <>
      <IntroHand>
        Couper la parole, parler "sans filtre", réagir vite et avec intensité.
      </IntroHand>
      <p className="guide-paragraph">
        Le TDAH se manifeste par des comportements qui peuvent être sources
        de tensions et de frustrations : couper la parole, parler "sans
        filtre", réagir vite et avec intensité, avoir tendance à arriver en
        retard, mal interpréter certains signes… L'<b>apprentissage</b> de
        nouvelles stratégies aide à <b>fluidifier</b> les échanges. Chaque
        conversation peut ensuite s'appréhender comme l'occasion d'entraîner
        son <b>attention</b>, sa <b>patience</b> (<i>inhibition</i>) et sa{" "}
        <b>curiosité</b> pour l'autre, son <b>ouverture</b> à d'autres points
        de vue (<i>flexibilité</i>). <b>Changer de perspective</b>, en
        s'observant de l'extérieur, et en pensant l'autre de l'intérieur,
        permettra d'aller progressivement vers des relations apaisées et
        constructives.
      </p>

      <SectionLabel num="•">Repérer et comprendre</SectionLabel>
      <Headline accent="à observer chez moi">Signes</Headline>
      <div className="guide-block guide-block-signes" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-block-eyebrow">Signes observés</div>
        <h4 className="guide-sphere-title" style={{ marginTop: 0 }}>Impulsivité</h4>
        <ul className="guide-bullets">
          <li>Je <b>coupe la parole</b>, je réponds avant que l'autre ait fini,</li>
          <li>J'ai du mal à <b>attendre mon tour</b> dans une conversation,</li>
          <li>Je fais parfois des <b>commentaires maladroits</b> ou <b>inappropriés</b>,</li>
        </ul>
        <h4 className="guide-sphere-title">Inattention</h4>
        <ul className="guide-bullets">
          <li>Je <b>décroche</b> pendant les échanges ; <i>je perds le fil</i>,</li>
          <li>J'ai du mal à <b>décoder</b> le <b>non-verbal</b> (<i>expressions faciales, ton, posture, gestes</i>).</li>
          <li>Je peine à <b>exprimer mes besoins</b> ou à <b>poser des limites</b> clairement.</li>
        </ul>
      </div>

      <SectionLabel num="•">Répercussions possibles</SectionLabel>
      <Headline accent="dans ma vie">Impacts</Headline>
      <div className="guide-block guide-block-repercussions">
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>privée &amp; professionnelle</b></h4>
          <ul className="guide-bullets">
            <li>J'ai du mal à <b>coopérer</b> ; je rencontre souvent des <b>tensions</b> dans le milieu professionnel</li>
            <li>J'ai été victime de <b>rejet</b>, de <b>harcèlement</b> scolaire.</li>
            <li>J'ai des problèmes de <b>couple</b> ou dois souvent faire face à des <b>conflits familiaux</b>.</li>
          </ul>
        </div>
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphère <b>sociale</b></h4>
          <ul className="guide-bullets">
            <li>Je suis régulièrement confronté·e à des situations de <b>conflits</b> avec mes amis ; mes comportements sont souvent <b>critiqués</b> par les autres.</li>
            <li>Je suis <b>isolé·e</b> socialement.</li>
            <li>Je peine à <b>comprendre</b>, <b>initier</b> et entretenir des <b>relations amicales</b>.</li>
          </ul>
        </div>
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>cognitive</b> et <b>psychoaffective</b></h4>
          <ul className="guide-bullets">
            <li>Je ne parviens pas à <b>exprimer</b> mes <b>besoins</b>, à <b>m'affirmer</b> (<i>poser des limites</i>), ou à <b>demander</b> de l'<b>aide</b>.</li>
          </ul>
        </div>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

function SectionPratique({ rubColor, read, onToggleRead }: { rubColor: string; read: boolean; onToggleRead: () => void }) {
  return (
    <>
      <SectionLabel num="•">En pratique, concrètement</SectionLabel>
      <Headline accent="& bénéfices">Quels objectifs</Headline>
      <div className="guide-block guide-block-objectifs" style={{ ["--rub-color" as string]: rubColor }}>
        <p className="guide-block-lead">Travailler sur mon mode de <b>communication</b>, pour :</p>
        <ul className="guide-bullets">
          <li><b>Améliorer</b> la <b>qualité</b> de mes <b>échanges</b> interpersonnels (<i>en comprenant mes comportements, déclencheurs, décrochages</i>),</li>
          <li>Développer des <b>habiletés sociales</b> adaptées (<i>en préparant les interactions, en observant les signaux non verbaux et en m'ajustant</i>),</li>
          <li>Renforcer l'<b>écoute</b> et la <b>clarté</b> dans la communication,</li>
          <li>Prévenir les <b>malentendus</b> et <b>tensions</b> relationnelles.</li>
        </ul>
        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Exemple d'objectif SMART</span>
          <p className="guide-callout-text">
            <i>"Pendant 2 semaines, lors de chaque conversation importante, je reformule ce que l'autre a dit avant de répondre."</i>
          </p>
        </div>
      </div>

      <SectionLabel num="•">Les outils pour m'aider</SectionLabel>
      <Headline accent="à mobiliser">Mes appuis</Headline>
      <div className="guide-tools-list">
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Journal de bord
          </div>
          <p className="guide-tool-static-desc">mon inséparable ! (rub. #01)</p>
          <p className="guide-tool-static-arrow">▶ noter mes observations, questions, objectifs, avancées…</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Feedbacks
          </div>
          <p className="guide-tool-static-desc">de proches / de groupe de pairs</p>
          <p className="guide-tool-static-arrow">▶ identifier, clarifier, comprendre.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Agenda + rappels
          </div>
          <p className="guide-tool-static-desc">combo.</p>
          <p className="guide-tool-static-arrow">▶ préparer et planifier mes interactions.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Techniques de contrôle de l'impulsivité, de relaxation
          </div>
          <p className="guide-tool-static-desc">➜ rub. #03 : banque personnelle, applis.</p>
          <p className="guide-tool-static-arrow">▶ s'ajuster.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Journal de gratitude / de réussites
          </div>
          <p className="guide-tool-static-desc">
            identifier et se souvenir des éléments positifs. Je peux créer
            une rubrique dans mon application de notes, écrire dans mon
            agenda, utiliser un support dédié (<i>tableau, bocal, boîte…</i>).
          </p>
          <p className="guide-tool-static-arrow">▶ Consolider, renforcer, valoriser.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Liste de compétences psychosociales
          </div>
          <p className="guide-tool-static-arrow">▶ identifier les règles / conventions et compétences associées.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Grille d'autoévaluation de ses propres Compétences Psychosociales (CPS)
          </div>
          <p className="guide-tool-static-desc">à télécharger.</p>
          <p className="guide-tool-static-arrow">▶ se situer, évaluer ses compétences, prendre conscience de ses difficultés et des pistes d'amélioration.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Accompagnement ciblant les habiletés sociales
          </div>
          <p className="guide-tool-static-desc">individuel ou en groupe.</p>
          <p className="guide-tool-static-arrow">▶ être soutenu·e dans l'entraînement et le développement de ses compétences.</p>
        </div>
      </div>

      <SectionLabel num="•">Outils de l'app dédiés à la régulation (rub. #03)</SectionLabel>
      <Headline accent="pour s'ajuster en interaction">3 outils intégrés</Headline>
      <div className="guide-tools-list">
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/coherence"
          icon={IconWind}
          title="Cohérence cardiaque"
          sub="Avant ou après un échange tendu — 3 ou 5 min pour calmer le système."
        />
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/scan"
          icon={IconHand}
          title="Scan corporel"
          sub="Repérer les signaux corporels qui annoncent un débordement en interaction."
        />
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/emotions"
          icon={IconHeart}
          title="Nommer mes émotions"
          sub="Mettre des mots après une conversation difficile — granularité émotionnelle."
        />
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

function SectionHistoire({ read, onToggleRead, rubColor }: { read: boolean; onToggleRead: () => void; rubColor: string }) {
  return (
    <>
      <SectionLabel num="•">L'histoire de…</SectionLabel>
      <Headline accent="53 ans, chargée de médiation culturelle">Sabrina</Headline>

      <div className="guide-story" style={{ ["--rub-color" as string]: rubColor }}>
        <p>
          « Je me suis souvent sentie "à côté". Je parlais trop, trop vite,
          je coupais la parole sans m'en rendre compte, j'oubliais des
          informations essentielles. En réunion, je voyais les regards qui se
          levaient au ciel. Je me disais que j'étais maladroite, "mal réglée".
        </p>
        <p>
          Le diagnostic de TDAH a été éclairant : le manque de filtre, la
          difficulté à attendre mon tour pour parler, à décrocher quand les
          conversations s'étiraient. Puis on a identifié un TSA (
          <i>trouble du spectre de l'autisme</i>) associé, ce qui expliquait
          ma tendance à passer à côté des conventions sociales ou mes
          difficultés à décoder les émotions.
        </p>
        <p>
          Avec l'aide de ma psychologue, j'ai mis en place des stratégies.
          Par exemple, avant de parler, je reformule ce que l'autre vient de
          dire. Ça m'oblige à écouter vraiment. Et ça m'aide à "freiner" mon
          impulsivité.
        </p>
        <p>
          Un jour, une collègue m'a dit : "Tu ne m'as pas interrompue une
          seule fois aujourd'hui." J'ai compris que mes efforts portaient. Je
          ne force plus mon cerveau à "faire semblant d'être comme tout le
          monde". Je crée simplement plus d'espace pour les autres — et pour
          moi. Communiquer n'est plus un combat : c'est devenu une compétence
          que j'apprivoise, à mon rythme, et j'essaie aussi d'accepter de ne
          pas toujours tout contrôler, et de tenir compte de mes besoins, et
          de mes limites.
        </p>
        <p>
          Aujourd'hui, mes collègues me disent que j'ai changé. Que je suis
          plus agréable en réunion. En fait, j'ai appris à faire de la place
          aux autres. »
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

function SectionPhases({
  rubColor,
  notes,
  onNoteSave,
  objectives,
  onAddObjective,
  onDeleteObjective,
  read,
  onToggleRead,
}: {
  rubColor: string;
  notes: Record<string, string>;
  onNoteSave: (key: string, val: string) => void;
  objectives: SmartObjective[];
  onAddObjective: (o: SmartObjective) => void;
  onDeleteObjective: (id: string) => void;
  read: boolean;
  onToggleRead: () => void;
}) {
  return (
    <>
      <SectionLabel num="•">Les étapes du changement</SectionLabel>
      <Headline accent="à ton rythme">4 phases</Headline>

      <GuidePhaseCard num={1} title="Comprendre et clarifier" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je prends <b>conscience</b> de mes <b>comportements</b> sociaux. Je
            repère les situations où :
            <ul className="guide-sub-bullets">
              <li>je <b>coupe</b> la parole,</li>
              <li>je <b>réagis impulsivement</b>,</li>
              <li>je <b>perds le fil</b>,</li>
              <li>je <b>parle</b> sans m'arrêter ni écouter l'autre.</li>
            </ul>
          </li>
          <li>Je peux <b>évaluer</b> mes propres <b>compétences psychosociales</b></li>
          <li>
            J'identifie les <b>déclencheurs émotionnels</b> :{" "}
            <i>fatigue/irritabilité, stress, frustration…</i>
          </li>
          <li>
            Je repère les moments de <b>décrochage</b> attentionnel et leurs{" "}
            <b>facteurs de "risque"</b> : <i>lieu, moment, sujet, interlocuteur·s, distracteurs…</i>
          </li>
          <li>
            Je clarifie mes <b>intentions</b> quand je cherche à communiquer :
            <ul className="guide-sub-bullets">
              <li>Je <b>précise</b> ce que je veux dire.</li>
              <li>Quel est mon <b>but</b> ?</li>
              <li>Quelles sont mes <b>attentes</b> ?</li>
            </ul>
          </li>
          <li>
            J'observe les <b>signaux non verbaux</b> chez les autres / chez
            mon interlocuteur (<i>ton, expressions faciales, gestes, posture</i>)
            pour mieux décoder <b>leur état interne</b> (<i>émotion, point de vue, intention…</i>),
            anticiper <b>leurs réactions</b>, et ajuster <b>mon comportement</b>{" "}
            si besoin.
          </li>
        </ul>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes comportements sociaux à observer cette semaine"
          hint="Couper la parole ? Perdre le fil ? Monopoliser ?"
          initial={notes.p1_comportements ?? ""}
          onSave={(v) => onNoteSave("p1_comportements", v)}
          placeholder="Ex : Je remarque que je coupe la parole en réunion d'équipe le mardi…"
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={2} title="Préparer et planifier les échanges" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            J'<b>identifie</b> les situations sociales stressantes / Je{" "}
            <b>prépare</b> les interactions importantes :
            <ul className="guide-sub-bullets">
              <li><b>Points</b> à aborder,</li>
              <li><b>Cadre</b> / limites à poser,</li>
              <li>
                Possibles variations de mon <b>état émotionnel</b> et{" "}
                <b>stratégies</b> de régulation (<i>respiration, pause…</i>) ➜ rub. #03
              </li>
              <li>
                <b>Stratégies de contrôle</b> de mes <b>comportements</b> (
                <i>frein/stop</i>).
              </li>
              <li>
                <b>Demande d'aide</b> ou d'<b>avis extérieur</b> en cas
                d'anxiété importante.
              </li>
            </ul>
          </li>
          <li>
            Je <b>choisis</b> et <b>planifie</b> des temps sociaux (
            <i>pause café, appel, rencontre</i>) plutôt que les subir à des
            moments non opportuns, avec peu de disponibilité ;
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ Je <b>régule</b> ainsi mieux mon <b>énergie</b>, mes{" "}
              <b>ressources cognitives</b>, mes <b>émotions</b>, et mes{" "}
              <b>comportements</b>.
            </p>
          </li>
          <li>
            J'intègre et m'entraîne à respecter <b>règles conversationnelles</b> :
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ <b>phase 3</b>
            </p>
          </li>
          <li>
            Je m'entraîne à <b>m'affirmer</b> : comment dire non, exprimer
            mon désaccord, mes besoins, calmement, en n'étant{" "}
            <b>ni passif·ve</b>, <b>ni agressif·ve</b> (
            <i>ex : "Je comprends, mais quand.. je me sens… Je préfèrerais…"</i>
            ).
          </li>
          <li>Je m'entraîne à utiliser l'<b>humour</b> et le <b>recul</b> pour réduire la tension.</li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/coherence"
          icon={IconWind}
          title="Cohérence cardiaque"
          sub="Avant un échange important : 3-5 min pour préparer le système."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Une interaction importante à préparer"
          hint="Points / Cadre / Régulation / Stratégies / Aide possible."
          initial={notes.p2_interaction ?? ""}
          onSave={(v) => onNoteSave("p2_interaction", v)}
          placeholder="Quoi ? Avec qui ? Que veux-tu obtenir ? Comment éviter le débordement ?"
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={3} title="Agir et s'ajuster pendant et après une interaction" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je mets en pratique une <b>écoute consciente / active</b> et
            respecte les <b>règles de la conversation</b> :
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ J'adopte une attitude <b>attentive</b>, <b>ouverte</b> à
              l'expression de l'autre et à l'échange ; je cherche à{" "}
              <b>comprendre</b> et marque une <b>pause</b> avant de répondre ;
              je coupe les <b>distractions</b> (<i>tél</i>), <b>reformule</b>{" "}
              et fais <b>clarifier</b> (
              <i>"Si je comprends bien, tu veux dire que…"</i>), je pose des{" "}
              <b>questions</b>, je reste dans le <b>thème</b>.
            </p>
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ Je montre mon <b>intérêt</b> (
              <i>orientation du regard, hochements de tête, expressions émotionnelles et mots d'appui</i>{" "}
              - ex : "ok", "je comprends", "j'imagine"…).
            </p>
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ <b>J'attends</b> que mon interlocuteur ait <b>fini</b> de
              parler pour prendre la parole / j'évite de l'<b>interrompre</b>.
            </p>
          </li>
          <li>
            Je mets en pratique des <b>stratégies de régulation émotionnelle</b>{" "}
            pendant la conversation (<i>respiration, ancrage, redéploiement attentionnel…</i>).
          </li>
          <li>
            Si je pense avoir commis un impair, je peux toujours{" "}
            <b>réparer</b> mon <b>erreur</b> en présentant mes excuses. (
            <i>J'apprends de mes erreurs !</i>)
          </li>
          <li>
            Je me <b>récompense</b> après l'effort / je prends <b>soin de moi</b>{" "}
            (<i>activité plaisante, décharge motrice, stimulation sensorielle…</i>)
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/scan"
          icon={IconHand}
          title="Scan corporel"
          sub="Pendant ou après une discussion : faire de la place à ce qui monte."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/emotions"
          icon={IconHeart}
          title="Nommer mes émotions"
          sub="Après l'échange : mettre un mot juste sur ce qui s'est joué."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={4} title="Consolider et renforcer" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            J'<b>analyse à froid</b> mes interactions :
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ je note dans mon <b>journal de bord</b>,
            </p>
            <ul className="guide-sub-bullets">
              <li>ce qui a bien <b>fonctionné</b>, et que je peux <b>reproduire</b>,</li>
              <li>ce qui pourrait être <b>amélioré</b>.</li>
            </ul>
          </li>
          <li>
            <b>Je me félicite</b> des efforts que j'ai fournis, et de chaque{" "}
            <b>avancée</b> :
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ Je complète mon <b>journal de réussites</b>.
            </p>
          </li>
          <li>
            Je continue à <b>m'entraîner</b> régulièrement avec des proches
            ou des personnes de confiance.
          </li>
          <li>
            Je peux aussi opter pour un <b>accompagnement guidé</b> :{" "}
            <i>
              accompagnement psychologique, groupe d'habiletés sociales,
              réhabilitation psychosociale, groupes de soutien entre pairs,
              pair-aidance…
            </i>
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ Je contacte les <b>associations</b> de soutien aux personnes et
              proches concernés par le TDAH (<i>ex Hypersupers, ou dans ma région</i>).
            </p>
          </li>
        </ul>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mon analyse à froid d'une interaction récente"
          hint="Sans jugement. Ce qui a marché / ce qui pourrait s'améliorer."
          initial={notes.p4_analyse ?? ""}
          onSave={(v) => onNoteSave("p4_analyse", v)}
          placeholder="Quoi : ... / Bien fonctionné : ... / À améliorer : ..."
        />

        <h4 className="guide-phase-h">Mon objectif SMART pour cette rubrique</h4>
        <p className="guide-phase-sub">
          5 champs à remplir progressivement, ou la phrase finale directement.
        </p>
        <GuideSmartEditor
          rubColor={rubColor}
          objectives={objectives}
          onAdd={onAddObjective}
          onDelete={onDeleteObjective}
        />
      </GuidePhaseCard>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

function SectionRetenir({ read, onToggleRead, rubColor }: { read: boolean; onToggleRead: () => void; rubColor: string }) {
  return (
    <>
      <SectionLabel num="•">À retenir</SectionLabel>
      <Headline accent="rubrique #08">Synthèse</Headline>

      <div className="guide-retenir" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-retenir-eyebrow">
          <IconBook size={18} color={rubColor} stroke={2.4} />
          Interactions &amp; communication
        </div>

        <h4 className="guide-retenir-h">L'objectif :</h4>
        <p className="guide-paragraph">
          Améliorer la <b>qualité</b> des <b>échanges</b> en développant
          l'<b>écoute</b>, le <b>contrôle</b> de l'<b>impulsivité</b> verbale
          et l'<b>affirmation</b> de soi.
        </p>

        <h4 className="guide-retenir-h">Les points clés :</h4>
        <ul className="guide-bullets guide-bullets-arrow">
          <li>
            Prends <b>conscience</b> de tes <b>comportements</b> sociaux :
            coupes-tu la parole ? Perds-tu le fil ? Monopolises-tu l'échange ?
          </li>
          <li>
            Identifie tes <b>déclencheurs</b> (
            <i>fatigue, excitation, stress, environnement…</i>) et{" "}
            <b>prépare</b> les interactions importantes.
          </li>
          <li>
            Pratique l'<b>écoute active</b> : regarde, hoche la tête,
            reformule avant de répondre, pose des questions.
          </li>
          <li>
            <b>Attends</b> que l'autre ait fini <b>avant de parler</b>.{" "}
            <b>Entraîne-toi</b> à freiner (
            <i>compter, respirer, visualiser…</i>).
          </li>
          <li>
            Apprends à <b>t'affirmer</b> de manière constructive : exprime
            tes <b>besoins</b>, pose des <b>limites</b>, <b>sans agressivité</b>.
          </li>
          <li>
            <b>Après</b> un <b>impair</b>, <b>répare</b> (<i>excuses</i>).{" "}
            <b>Analyse</b> à froid ce qui a fonctionné ou non.
          </li>
        </ul>

        <h4 className="guide-retenir-h">Le message :</h4>
        <p className="guide-paragraph">
          Communiquer, c'est aussi <b>écouter</b> et <b>faire de la place à l'autre</b>.
          En ralentissant et en modulant ton impulsivité verbale, tu
          amélioreras la qualité de tes relations.
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}
