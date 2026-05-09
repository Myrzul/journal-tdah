"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconBook,
  IconHand,
  IconHeart,
  IconWind,
} from "@/components/icons";
import { Headline, IntroHand, SectionLabel } from "@/components/journal/typography";
import {
  addSmartObjective,
  deleteSmartObjective,
  loadGuideStore,
  markSectionRead,
  saveGuideStore,
  setNote,
  unmarkSectionRead,
  updateProgress,
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

const RUBRIQUE_ID: RubriqueId = "03";

type Props = {
  rubrique: RubriqueMeta;
};

export function Rubrique03Page({ rubrique }: Props) {
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
  const onCheck = (key: string, val: boolean) => {
    setStore((st) =>
      updateProgress(st, RUBRIQUE_ID, (p) => ({
        ...p,
        checks: { ...p.checks, [key]: val },
      })),
    );
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

      {active === "intro" && (
        <SectionIntro
          rubColor={rubColor}
          read={isRead("intro")}
          onToggleRead={() => toggleRead("intro")}
        />
      )}

      {active === "pratique" && (
        <SectionPratique
          rubColor={rubColor}
          read={isRead("pratique")}
          onToggleRead={() => toggleRead("pratique")}
        />
      )}

      {active === "histoire" && (
        <SectionHistoire
          read={isRead("histoire")}
          onToggleRead={() => toggleRead("histoire")}
          rubColor={rubColor}
        />
      )}

      {active === "phases" && (
        <SectionPhases
          rubColor={rubColor}
          notes={progress.notes}
          onNoteSave={onNoteSave}
          checks={progress.checks}
          onCheck={onCheck}
          objectives={progress.smartObjectives}
          onAddObjective={(obj) =>
            setStore((st) => addSmartObjective(st, RUBRIQUE_ID, obj))
          }
          onDeleteObjective={(id) =>
            setStore((st) => deleteSmartObjective(st, RUBRIQUE_ID, id))
          }
          read={isRead("phases")}
          onToggleRead={() => toggleRead("phases")}
        />
      )}

      {active === "retenir" && (
        <SectionRetenir
          read={isRead("retenir")}
          onToggleRead={() => toggleRead("retenir")}
          rubColor={rubColor}
        />
      )}
    </>
  );
}

/* ===================================================================
   SECTION A — REPÉRER ET COMPRENDRE (texte verbatim PDF p.1)
   =================================================================== */
function SectionIntro({
  rubColor,
  read,
  onToggleRead,
}: {
  rubColor: string;
  read: boolean;
  onToggleRead: () => void;
}) {
  return (
    <>
      <IntroHand>
        Agir d'abord et réfléchir ensuite, faire vite, monter en pression, être submergé·e par des émotions intenses.
      </IntroHand>

      <p className="guide-paragraph">
        Avoir un TDAH peut être associé à un défaut du contrôle inhibiteur,
        c'est-à-dire à une difficulté à s'empêcher de, à freiner, à s'arrêter.
        Réguler ses émotions, c'est d'abord apprendre à se dire "stop", à
        ralentir, c'est-à-dire à contrôler son impulsivité, "son urgence à
        agir". C'est ensuite observer ce qui se passe à l'intérieur de soi (
        <i>dans sa tête, dans son cœur, dans son corps</i>), en analyser les
        interactions avec le monde extérieur, et accepter l'inconfort qui peut
        en découler. C'est enfin mieux en contrôler les effets (
        <i>sur soi et sur l'extérieur</i>), et aspirer à une meilleure qualité
        de sa vie et de ses relations.
      </p>

      <SectionLabel num="•">Repérer et comprendre</SectionLabel>
      <Headline accent="à observer chez moi">Signes</Headline>

      <div className="guide-block guide-block-signes" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-block-eyebrow">Signes observés</div>
        <ul className="guide-bullets">
          <li>
            J'<b>agis</b> ou je <b>parle avant</b> de <b>réfléchir</b> ;{" "}
            <i>je coupe la parole, je fais des commentaires que je regrette ensuite</i>,
          </li>
          <li>
            J'ai du mal à <b>attendre</b>, à <b>patienter</b>, à laisser les
            autres finir,
          </li>
          <li>
            Mes <b>émotions</b> sont <b>intenses</b>, <i>elles montent vite et me submergent</i>,
          </li>
          <li>
            Je passe rapidement d'un état émotionnel à un autre ;{" "}
            <i>mes humeurs fluctuent</i>,
          </li>
          <li>
            J'ai du mal à <b>tolérer</b> la <b>frustration</b>, la{" "}
            <b>critique</b>, le <b>rejet</b>,
          </li>
          <li>
            Je prends des <b>décisions impulsives</b> sans en{" "}
            <b>mesurer</b> les <b>conséquences</b> (
            <i>achats, démissions, ruptures…</i>).
          </li>
        </ul>
      </div>

      <SectionLabel num="•">Répercussions possibles</SectionLabel>
      <Headline accent="dans ma vie">Impacts</Headline>

      <div className="guide-block guide-block-repercussions">
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>privée &amp; professionnelle</b></h4>
          <ul className="guide-bullets">
            <li>
              Je suis souvent confronté·e à des <b>conflits familiaux</b> ou{" "}
              <b>professionnels</b>.
            </li>
            <li>
              J'<b>agis</b> ou prends des <b>décisions</b> sans en anticiper
              les <b>conséquences</b>, ce qui peut me mettre ensuite en grande
              difficulté (<i>ex : achats impulsifs</i>).
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphère <b>sociale</b></h4>
          <ul className="guide-bullets">
            <li>
              Je peine à entretenir des <b>relations sociales</b> stables ; mes
              relations se terminent souvent de façon subite.
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>cognitive</b> et <b>psychoaffective</b></h4>
          <ul className="guide-bullets">
            <li>
              J'ai de fortes <b>réactions émotionnelles</b> ; mes émotions{" "}
              <b>fluctuent</b> rapidement.
            </li>
            <li>
              Je suis sensible à la <b>critique</b>, j'ai du mal à supporter
              la <b>frustration</b>.
            </li>
            <li>
              J'ai des <b>comportements à risque</b> (
              <i>conduite automobile, consommation excessive de toxiques, agressivité</i>
              ).
            </li>
            <li>
              Je peux faire preuve d'<b>auto-agressivité</b> ; je ressens
              beaucoup de <b>culpabilité</b>.
            </li>
            <li>
              J'ai une <b>mauvaise image de moi</b>, j'ai tendance à{" "}
              <b>me sous-estimer</b> et à <b>me dévaloriser</b>.
            </li>
          </ul>
        </div>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* ===================================================================
   SECTION B — EN PRATIQUE, CONCRÈTEMENT (texte verbatim PDF p.2)
   =================================================================== */
function SectionPratique({
  rubColor,
  read,
  onToggleRead,
}: {
  rubColor: string;
  read: boolean;
  onToggleRead: () => void;
}) {
  return (
    <>
      <SectionLabel num="•">En pratique, concrètement</SectionLabel>
      <Headline accent="& bénéfices">Quels objectifs</Headline>

      <div className="guide-block guide-block-objectifs" style={{ ["--rub-color" as string]: rubColor }}>
        <p className="guide-block-lead">
          En <b>développant</b> mes capacités d'<b>inhibition</b>, je peux espérer :
        </p>
        <ul className="guide-bullets">
          <li>
            <b>Reconnaître mes émotions</b>, comprendre leur <b>rôle</b> et
            leur <b>lien</b> avec mes <b>comportements impulsifs</b>,
          </li>
          <li>
            <b>Anticiper</b> les situations de <b>débordement</b> émotionnel en
            agissant sur mon <b>environnement</b>, mes <b>besoins</b> et{" "}
            <b>routines</b>,
          </li>
          <li>
            <b>Ralentir</b>, empêcher la réponse automatique, apprendre à
            m'ajuster, améliorer mes relations,
          </li>
          <li>
            <b>Restaurer l'équilibre</b> après un débordement.
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Exemple d'objectif SMART</span>
          <p className="guide-callout-text">
            <i>
              "Pendant 3 semaines, avant de répondre à toute remarque
              irritante, je vais attendre 10 secondes en visualisant un
              panneau STOP."
            </i>
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
          <p className="guide-tool-static-desc">
            mon inséparable ! (rub. #01) — rubriques/pages concernant mes
            comportements impulsifs et mes émotions.
          </p>
          <p className="guide-tool-static-arrow">
            ▶ noter mes observations, questions, objectifs, avancées…
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Journal de gratitude / de réussites
          </div>
          <p className="guide-tool-static-desc">
            identifier et se souvenir des éléments positifs. Je peux créer une
            rubrique dans mon application de notes, écrire dans mon agenda,
            utiliser un support dédié (<i>tableau, bocal, boîte…</i>).
          </p>
          <p className="guide-tool-static-arrow">
            ▶ développer une autre façon d'observer mon vécu, assouplir ma
            pensée
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Outils sensoriels
          </div>
          <p className="guide-tool-static-desc">
            casque anti-bruit, bouchons d'oreilles, fidgets, diffuseurs,
            bougies, ballon d'assise, bureau debout, éclairage…
          </p>
          <p className="guide-tool-static-arrow">
            ▶ me protéger, me stimuler, optimiser mon confort.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Liste d'activités ressourçantes
          </div>
          <p className="guide-tool-static-desc">
            des idées à piocher. Cultiver ses centres d'intérêt, sa santé
            physique et mentale.
          </p>
          <p className="guide-tool-static-arrow">
            ▶ limiter les tensions et déclencheurs internes de comportements
            explosifs.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Liste de stratégies de régulation émotionnelle
          </div>
          <p className="guide-tool-static-desc">
            des idées à piocher. Tester, en évaluer les effets, se créer une
            banque de stratégies sur mesure.
          </p>
          <p className="guide-tool-static-arrow">
            ▶ mieux maîtriser mon comportement en cas de tension et émotions
            négatives.
          </p>
        </div>
      </div>

      <SectionLabel num="•">Outils de l'app dédiés à cette rubrique</SectionLabel>
      <Headline accent="à mobiliser au quotidien">4 outils intégrés</Headline>

      <div className="guide-tools-list">
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/thermometre"
          icon={IconWind}
          title="Thermomètre des émotions"
          sub="Nommer mon niveau d'activation et choisir une réponse à ma taille."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/scan"
          icon={IconHand}
          title="Scan corporel"
          sub="Repérer les sensations associées dans le corps, en pleine conscience."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/emotions"
          icon={IconHeart}
          title="Nommer mes émotions"
          sub="Boussole, familles, nuances — du flou à un mot juste."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/coherence"
          icon={IconWind}
          title="Cohérence cardiaque"
          sub="5/5 pendant 3, 5 ou 10 min — une banque-stratégie « calmer le corps »."
        />
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* ===================================================================
   SECTION C — L'HISTOIRE DE DELPHINE (texte verbatim PDF p.3)
   =================================================================== */
function SectionHistoire({
  read,
  onToggleRead,
  rubColor,
}: {
  read: boolean;
  onToggleRead: () => void;
  rubColor: string;
}) {
  return (
    <>
      <SectionLabel num="•">L'histoire de…</SectionLabel>
      <Headline accent="40 ans, serveuse">Delphine</Headline>

      <div className="guide-story" style={{ ["--rub-color" as string]: rubColor }}>
        <p>
          « Toute ma vie, j'ai vécu mes émotions comme des explosions, très
          violemment. Je me mettais en colère ou je partais en panique à la
          moindre contrariété, j'avais peur qu'on me rejette, qu'on me laisse
          tomber. Je pensais que c'était mon "sale caractère", on me disait
          que j'en faisais toujours trop, que j'exagérais… Jusqu'au jour où
          j'ai perdu le contrôle avec un client ; j'ai tout de suite regretté
          mon comportement, mais c'était trop tard. C'était la fois de trop,
          et j'ai perdu mon emploi.
        </p>
        <p>
          A ce moment-là, je me suis dit que je touchais le fond, et qu'il y
          avait quelque chose à creuser. Je me suis décidée à consulter un
          psychiatre. C'est comme ça que j'ai découvert que j'avais à la fois
          un TDAH et un trouble de la personnalité borderline. J'ai enfin
          compris pourquoi mes réactions étaient si rapides et extrêmes.
        </p>
        <p>
          J'ai ensuite commencé, en complément du traitement, un suivi en
          centre de réhabilitation psychosociale. Par exemple, j'ai pu
          apprendre à repérer les signaux émotionnels dans mon corps : la
          chaleur dans la poitrine, la mâchoire qui se crispe, le cœur qui
          s'accélère. Maintenant, je suis capable de me dire STOP ; je respire
          et je me demande si je veux vraiment agir ainsi. Je ne suis pas
          devenue une personne calme, mais je me mets moins en danger. Ça m'a
          rendue moins prisonnière de mes comportements. »
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* ===================================================================
   SECTION D — LES 4 PHASES (texte verbatim PDF p.4-5)
   =================================================================== */
function SectionPhases({
  rubColor,
  notes,
  onNoteSave,
  checks,
  onCheck,
  objectives,
  onAddObjective,
  onDeleteObjective,
  read,
  onToggleRead,
}: {
  rubColor: string;
  notes: Record<string, string>;
  onNoteSave: (key: string, val: string) => void;
  checks: Record<string, boolean>;
  onCheck: (key: string, val: boolean) => void;
  objectives: SmartObjective[];
  onAddObjective: (o: SmartObjective) => void;
  onDeleteObjective: (id: string) => void;
  read: boolean;
  onToggleRead: () => void;
}) {
  const PHASE2_ENV = [
    { key: "p2_coin_calme", label: "Je me réserve un « coin calme » (apaisant)" },
    {
      key: "p2_protection_sensorielle",
      label:
        "J'utilise des outils de protection sensorielle (bouchons, casque, lumières tamisées, playlist relaxante…)",
    },
    {
      key: "p2_routine_hygiene",
      label:
        "Hygiène de vie (sommeil, alimentation, activité physique régulière… rubrique #02)",
    },
    {
      key: "p2_pauses",
      label:
        "Pauses cognitives / sensorielles / sociales planifiées (rappels/alarmes pour y penser)",
    },
  ];

  const PHASE2_PILIERS = [
    { key: "p2_apprendre", label: "Apprendre / découvrir (stimulation cognitive positive)" },
    { key: "p2_bouger", label: "Bouger / décharger (activité physique)" },
    {
      key: "p2_creer",
      label: "Créer / exprimer (expression verbale, artistique, manuelle, partage)",
    },
  ];

  return (
    <>
      <SectionLabel num="•">Les étapes du changement</SectionLabel>
      <Headline accent="à ton rythme">4 phases</Headline>

      <GuidePhaseCard
        num={1}
        title="Comprendre ses émotions et son impulsivité"
        rubColor={rubColor}
      >
        <ul className="guide-bullets">
          <li>
            Une <b>émotion</b> : un signal <b>adaptatif</b> (
            <i>sa fonction : communiquer et motiver à l'action</i>).
            <ul className="guide-sub-bullets">
              <li>
                <b>5 Composantes</b> : ressenti subjectif, pensées, changements
                physiologiques, expression corporelle (
                <i>gestuelle, faciale, posturale</i>), tendance à l'action.
              </li>
              <li>
                <b>Identifier</b> mes émotions et leur <b>intensité</b> :
                <ul className="guide-sub-bullets">
                  <li>
                    J'utilise des <b>supports visuels</b> (
                    <i>lexiques / thermomètre des émotions</i>).
                  </li>
                  <li>
                    Je repère les <b>sensations</b> associées dans mon{" "}
                    <b>corps</b> (<i>scan corporel</i>).
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            L'<b>impulsivité</b> : Difficulté à <b>filtrer</b> ou <b>freiner</b>{" "}
            (<i>à s'empêcher de faire, de dire, de réagir…</i>)
            <ul className="guide-sub-bullets">
              <li>
                L'impulsivité <b>émotionnelle</b> : difficulté à réfréner la
                réponse <b>automatique</b> (
                <i>comportementale, verbale</i>) et à <b>anticiper</b> les{" "}
                <b>conséquences</b> de ses actes, alors que le <b>ressenti</b>{" "}
                est <b>intense</b> (<i>et irrépressible, lui !</i>).
              </li>
              <li>
                Impulsivité + <b>aversion au délai</b> (
                <i>préférence pour le plaisir immédiat</i>) = prise de{" "}
                <b>risque</b>, incapacité à résister aux <b>tentations</b> et à{" "}
                <b>modérer</b> certaines consommations.
              </li>
            </ul>
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/thermometre"
          icon={IconWind}
          title="Thermomètre des émotions"
          sub="Pour identifier mon niveau d'activation et nommer ce qui se passe."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/emotions"
          icon={IconHeart}
          title="Nommer mes émotions"
          sub="Le lexique en boussole : familles, émotions, nuances."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/scan"
          icon={IconHand}
          title="Scan corporel"
          sub="Repérer les signaux émotionnels dans le corps."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes signaux corporels d'alerte à moi"
          hint="Ce que ton corps fait quand l'émotion monte (chaleur, mâchoire serrée, cœur qui s'accélère…)."
          initial={notes.p1_signaux ?? ""}
          onSave={(v) => onNoteSave("p1_signaux", v)}
          placeholder="Ex : chaleur dans la poitrine, mâchoire qui se crispe…"
        />
      </GuidePhaseCard>

      <GuidePhaseCard
        num={2}
        title="Prévenir la surcharge émotionnelle + favoriser l'équilibre"
        rubColor={rubColor}
      >
        <h4 className="guide-phase-h">J'observe mes pensées, émotions et comportements</h4>
        <ul className="guide-bullets">
          <li>
            Je prends conscience des <b>"déclencheurs"</b> (
            <i>contexte social, fatigue, humeur, stimulations sensorielles…</i>
            )
          </li>
          <li>
            Je complète mon <b>journal de bord</b>.
          </li>
        </ul>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes déclencheurs récurrents"
          initial={notes.p2_declencheurs ?? ""}
          onSave={(v) => onNoteSave("p2_declencheurs", v)}
          placeholder="Contextes, personnes, états dans lesquels les débordements arrivent le plus souvent…"
        />

        <h4 className="guide-phase-h">
          J'adapte mon environnement pour limiter les sources de stress et
          sur-stimulation
        </h4>
        <ul className="guide-checklist">
          {PHASE2_ENV.map((it) => (
            <li key={it.key}>
              <button
                type="button"
                onClick={() => onCheck(it.key, !checks[it.key])}
                className={`guide-check ${checks[it.key] ? "is-on" : ""}`}
                style={{ ["--rub-color" as string]: rubColor }}
              >
                <span className="guide-check-box" aria-hidden="true">
                  {checks[it.key] ? "✓" : ""}
                </span>
                <span className="guide-check-label">{it.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <h4 className="guide-phase-h">Activités ressourçantes — Je cultive 3 « piliers »</h4>
        <ul className="guide-checklist">
          {PHASE2_PILIERS.map((it) => (
            <li key={it.key}>
              <button
                type="button"
                onClick={() => onCheck(it.key, !checks[it.key])}
                className={`guide-check ${checks[it.key] ? "is-on" : ""}`}
                style={{ ["--rub-color" as string]: rubColor }}
              >
                <span className="guide-check-box" aria-hidden="true">
                  {checks[it.key] ? "✓" : ""}
                </span>
                <span className="guide-check-label">{it.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ je les liste dans mon <b>journal de bord</b>
        </p>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes activités ressourçantes (les 3 piliers)"
          hint="Apprendre / Bouger / Créer — au moins une de chaque, à toi de remplir."
          initial={notes.p2_piliers ?? ""}
          onSave={(v) => onNoteSave("p2_piliers", v)}
          placeholder="Ex : lire 30 min, marche, dessin libre…"
        />

        <ul className="guide-bullets">
          <li>
            Je tiens un <b>journal de gratitude</b> / d'<b>autocompassion</b> /{" "}
            <b>autovalorisation</b>. (
            <i>
              petites victoires, réussites, forces, qualités, ressources,
              souvenirs ou projets riches de sens, plaisirs esthétiques
            </i>
            )
          </li>
          <li>
            Je m'<b>entoure</b> de personnes <b>bienveillantes</b>, soutenantes.
          </li>
        </ul>

        <p className="guide-callout-text" style={{ fontSize: 11.5, fontStyle: "italic", marginTop: 12, color: "var(--ink-2)" }}>
          *Selon une <b>étude récente</b> (Yang et al., 2025), l'activité
          physique a un effet bénéfique sur le contrôle inhibiteur chez les
          adultes avec un TDAH.
        </p>
      </GuidePhaseCard>

      <GuidePhaseCard
        num={3}
        title="S'entraîner à l'auto-contrôle et à la flexibilité"
        rubColor={rubColor}
      >
        <h4 className="guide-phase-h">Je m'exerce à l'inhibition</h4>
        <p className="guide-paragraph">
          J'apprends à <b>ralentir</b>, à <b>freiner</b>, j'introduis
          consciemment un <b>délai avant d'agir</b> ou de répondre (
          <i>ex : compter, respirer, imaginer un panneau STOP, un frein, un escargot</i>
          ).
        </p>
        <ul className="guide-bullets">
          <li>
            J'identifie mes "<b>zones de risque</b>" (
            <i>magasins, lieux, personnes, état émotionnel…</i>)
          </li>
          <li>
            Je définis un <b>cadre</b>, des <b>limites</b> (
            <i>liste d'achat, temps d'activité…</i>)
          </li>
          <li>
            <b>Avant</b> d'agir : Pause = je me projette ➜ <b>conséquences</b>{" "}
            possibles au non respect du cadre ? <b>Avantages</b> à le respecter ?
          </li>
        </ul>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes « zones de risque » identifiées"
          initial={notes.p3_zones_risque ?? ""}
          onSave={(v) => onNoteSave("p3_zones_risque", v)}
          placeholder="Lieux, contextes, états où je sais que ça part vite…"
        />

        <h4 className="guide-phase-h">Je travaille la flexibilité mentale</h4>
        <p className="guide-paragraph">J'introduis de la <b>souplesse</b>.</p>
        <ul className="guide-bullets">
          <li>
            Je m'ouvre à d'<b>autres manières de faire</b>, j'explore
            différentes stratégies, de nouvelles solutions.
          </li>
          <li>
            Je m'entraîne à <b>changer de perspective</b>, à{" "}
            <b>reformuler mes pensées</b> (
            <i>
              ex : Comment une autre personne verrait-elle la situation ? Que
              conseillerais-je à un·e ami·e ?
            </i>
            ).
          </li>
        </ul>

        <p className="guide-paragraph guide-paragraph-arrow">
          • <b>Je note</b> mes observations ➜ <b>journal de bord</b>.
        </p>
      </GuidePhaseCard>

      <GuidePhaseCard
        num={4}
        title="Faire face aux débordements et réparer"
        rubColor={rubColor}
      >
        <p className="guide-paragraph">
          À <b>froid</b>, je m'entraîne, je teste différentes{" "}
          <b>techniques de régulation</b>, je me crée <b>ma banque de stratégies</b>{" "}
          à moi.
        </p>

        <h4 className="guide-phase-h">À chaud, face à un débordement</h4>
        <ul className="guide-bullets">
          <li>
            J'<b>observe</b> mes <b>émotions</b> de la façon la plus neutre
            possible, avec curiosité, intérêt, sans juger. Je les <b>nomme</b>.
          </li>
          <li>
            <b>Je me parle</b> intérieurement (
            <i>
              ex : "Je ne choisis pas ce que je ressens, mais je suis libre de
              choisir ma réponse" ; "Je peux ralentir avant d'agir, et choisir
              la bonne direction" ; "Est-ce que je peux faire de la place à
              cette émotion et à l'inconfort qu'elle me procure ?"
            </i>
            ).
          </li>
          <li>
            Je <b>pioche dans ma banque</b> une stratégie de retour au calme
            adaptée au·x besoin·s du moment :
            <ul className="guide-sub-bullets">
              <li>
                <b>Calmer mon corps</b> (
                <i>
                  respiration, relaxation musculaire, cohérence cardiaque,
                  mouvement, stimulation sensorielle…
                </i>
                )
              </li>
              <li>
                <b>Réorienter ma pensée</b> (
                <i>
                  souvenirs ou projets plaisants, changer de perspective, se
                  divertir…
                </i>
                ).
              </li>
              <li>
                <b>Ajuster ma réponse</b> (
                <i>
                  faire une pause, changer d'activité, reporter une discussion,
                  me confier, demander de l'aide…
                </i>
                ).
              </li>
            </ul>
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/coherence"
          icon={IconWind}
          title="Cohérence cardiaque"
          sub="5 sec inspire / 5 sec expire — calmer le corps en quelques minutes."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/scan"
          icon={IconHand}
          title="Scan corporel"
          sub="Faire de la place à l'émotion via le corps, en pleine conscience."
        />

        <h4 className="guide-phase-h">Après un débordement</h4>
        <ul className="guide-bullets">
          <li>
            Je <b>répare</b> (<i>excuses, réajustement</i>).
          </li>
          <li>
            Je me traite avec <b>indulgence</b>, <i>j'ai droit à l'erreur !</i>
          </li>
          <li>
            J'<b>apprends</b> de mes erreurs : comment faire autrement la{" "}
            <b>prochaine fois</b> ?
          </li>
        </ul>
        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ <b>Je le note</b> dans mon <b>journal de bord</b>.
        </p>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Ma banque de stratégies à moi"
          hint="Ce qui marche pour TOI quand l'émotion monte (à compléter au fil des essais)."
          initial={notes.p4_banque ?? ""}
          onSave={(v) => onNoteSave("p4_banque", v)}
          placeholder="Calmer le corps : … / Réorienter la pensée : … / Ajuster la réponse : …"
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

/* ===================================================================
   SECTION E — À RETENIR (texte verbatim PDF p.6)
   =================================================================== */
function SectionRetenir({
  read,
  onToggleRead,
  rubColor,
}: {
  read: boolean;
  onToggleRead: () => void;
  rubColor: string;
}) {
  return (
    <>
      <SectionLabel num="•">À retenir</SectionLabel>
      <Headline accent="rubrique #03">Synthèse</Headline>

      <div className="guide-retenir" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-retenir-eyebrow">
          <IconBook size={18} color={rubColor} stroke={2.4} />
          Impulsivité &amp; émotions
        </div>

        <h4 className="guide-retenir-h">L'objectif :</h4>
        <p className="guide-paragraph">
          Apprendre à <b>freiner</b> la <b>réponse automatique</b> pour{" "}
          <b>choisir</b> sa <b>réaction</b>. Réguler ses émotions, c'est
          d'abord réguler son impulsivité.
        </p>

        <h4 className="guide-retenir-h">Les points clés :</h4>
        <ul className="guide-bullets guide-bullets-arrow">
          <li>
            Les <b>émotions</b> sont des signaux <b>utiles</b>, mais elles
            peuvent déclencher des <b>comportements</b> impulsifs{" "}
            <b>regrettables</b>.
          </li>
          <li>
            Identifie tes <b>déclencheurs</b> (
            <i>fatigue, stress, frustration, surstimulation…</i>) et tes{" "}
            <b>signaux corporels</b> d'alerte.
          </li>
          <li>
            Préviens la surcharge émotionnelle en soignant ton{" "}
            <b>hygiène de vie</b>, en planifiant des <b>pauses</b>, en
            pratiquant des <b>activités ressourçantes</b>.
          </li>
          <li>
            <b>Entraîne-toi</b> à freiner :{" "}
            <i>compte, respire, visualise un STOP avant de réagir</i>.
          </li>
          <li>
            Crée-toi une <b>banque de stratégies</b> de régulation (
            <i>respiration, ancrage sensoriel, reformulation des pensées</i>).
          </li>
          <li>
            <b>Après</b> un <b>débordement</b> : <b>répare</b> (
            <i>excuses</i>), <b>apprends</b> de l'erreur, traite-toi avec{" "}
            <b>indulgence</b>.
          </li>
        </ul>

        <h4 className="guide-retenir-h">Le message :</h4>
        <p className="guide-paragraph">
          Tu ne choisis pas ce que tu ressens, mais tu peux <b>choisir</b> ta{" "}
          <b>réponse</b>. La <b>régulation</b> émotionnelle <b>s'apprend</b>{" "}
          et se renforce avec la pratique.
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}
