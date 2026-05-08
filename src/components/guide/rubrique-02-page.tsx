"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconBook,
  IconClock,
  IconHand,
  IconList,
  IconShield,
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

const RUBRIQUE_ID: RubriqueId = "02";

type Props = {
  rubrique: RubriqueMeta;
};

export function Rubrique02Page({ rubrique }: Props) {
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
      <IntroHand>Prendre soin de soi, c'est prendre soin de son esprit, et de son corps !</IntroHand>

      <p className="guide-paragraph">
        Alors qu'être dans un bouillonnement mental incessant fait constamment
        voyager dans le temps (
        <i>ruminer le passé, s'inquiéter de l'avenir</i>), nous t'invitons à
        rester présent·e pour redescendre dans ton corps, le scanner, l'écouter,
        le bichonner et… mieux "couper" avec tes pensées. L'activité physique
        et un sommeil de qualité soutiennent attention, régulation émotionnelle
        et bien-être ; une alimentation riche en fruits, légumes et poisson
        serait aussi protectrice (contrairement au sucre et graisses saturées).
        Les particularités sensorielles et l'usage excessif d'écrans
        impacteraient l'attention et l'impulsivité, soulignant l'importance de
        réguler leur usage.
      </p>

      <SectionLabel num="•">Repérer et comprendre</SectionLabel>
      <Headline accent="à observer chez moi">Signes</Headline>

      <div className="guide-block guide-block-signes" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-block-eyebrow">Signes observés</div>
        <ul className="guide-bullets">
          <li>
            <b>Mon niveau d'énergie</b> est variable,
          </li>
          <li>
            Je ne réussis pas à me <b>discipliner</b> (
            <i>à mettre en place des "routines"</i>) ; je ne parviens pas à
            m'<b>organiser</b> dans mes <b>tâches quotidiennes</b>,
          </li>
          <li>
            <b>Planifier</b> des <b>événements</b> me demande beaucoup d'efforts ;
            j'ai du mal à me <b>souvenir</b> des <b>dates importantes</b>,
            j'<b>oublie</b> des <b>rendez-vous</b>,
          </li>
          <li>
            J'ai des <b>comportements impulsifs</b> (
            <i>j'ai du mal à freiner, à m'empêcher, à m'arrêter de faire quelque chose</i>
            ),
          </li>
          <li>
            Je recherche plutôt des <b>récompenses immédiates</b> ou à court
            terme (
            <i>
              je préfère me faire plaisir tout de suite plutôt qu'attendre
              pour obtenir des bénéfices plus importants ; j'ai du mal à
              résister aux tentations
            </i>
            ).
          </li>
        </ul>
      </div>

      <SectionLabel num="•">Répercussions possibles</SectionLabel>
      <Headline accent="dans ma vie">Impacts</Headline>

      <div className="guide-block guide-block-repercussions">
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sur le <b>corps</b></h4>
          <ul className="guide-bullets">
            <li>
              Je peine à <b>identifier</b> / <b>ressentir</b> mes besoins
              corporels.
            </li>
            <li>
              Je néglige mon <b>hygiène personnelle</b>, j'oublie de réaliser
              certains soins quotidiens.
            </li>
            <li>
              Je néglige mon <b>alimentation</b> (
              <i>déséquilibrée, irrégulière, hyperphagie, binge eating</i>),
              j'ai des <b>troubles du comportement alimentaire</b>.
            </li>
            <li>
              Je n'ai pas d'<b>activité physique</b> ou je pratique de façon
              excessive.
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sur l'<b>énergie</b> et la <b>santé</b></h4>
          <ul className="guide-bullets">
            <li>
              J'ai des <b>troubles du sommeil</b> (
              <i>insomnie, trouble du rythme circadien, hypersomnolence, jambes sans repos</i>
              ) ; je me sens <b>fatigué·e</b> en permanence.
            </li>
            <li>
              J'ai d'autres troubles physiques et/ou psychiques ; je me sens{" "}
              <b>épuisé·e</b>.
            </li>
            <li>
              Je néglige mon <b>suivi médical</b> et/ou celui de mes proches.
            </li>
            <li>
              J'ai des <b>conduites addictives</b> (
              <i>substances, écrans, jeux, achats…</i>).
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
        <p className="guide-block-lead">En prenant soin de mon corps, je peux mieux…</p>
        <ul className="guide-bullets">
          <li>
            connaître mes <b>besoins</b> et mon fonctionnement{" "}
            <b>global (corps + esprit)</b>,
          </li>
          <li>
            réguler mon <b>énergie</b> (physique, cognitive, émotionnelle),
          </li>
          <li>
            entretenir mes <b>ressources</b> attentionnelles et motivationnelles,
          </li>
          <li>
            <b>prévenir</b> l'épuisement et les rechutes,
          </li>
          <li>
            Favoriser mon <b>bien-être</b> général et ma qualité de vie.
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Exemple d'objectif SMART</span>
          <p className="guide-callout-text">
            <i>
              " Ces 3 prochaines semaines, je me couche 10 minutes plus tôt
              chaque soir, sans écran dans la dernière demi-heure."
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
            mon inséparable ! (rub. #01) — rubriques/pages concernant mon
            hygiène de vie et ma santé.
          </p>
          <p className="guide-tool-static-arrow">
            ▶ noter mes observations, questions, objectifs, avancées…
          </p>
        </div>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/journal"
          icon={IconClock}
          title="Journal du temps"
          sub="Observer l'allocation de mon temps."
        />

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
            ▶ Consolider, renforcer, entretenir ma motivation.
          </p>
        </div>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Check-lists"
          sub="Check-lists de routines, créneaux dédiés dans l'agenda, rappels."
          status="▶ Installation de « routines » / habitudes."
        />

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Hygiène de vie / soins
          </div>
          <p className="guide-tool-static-desc">
            Support du centre ressource réhabilitation.
          </p>
          <p className="guide-tool-static-arrow">▶ améliorer mon mode de vie.</p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Focus sommeil
          </div>
          <p className="guide-tool-static-desc">
            Support du CReHPsy Pays de la Loire.
          </p>
          <p className="guide-tool-static-arrow">▶ prendre soin de mon sommeil.</p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Focus alimentation
          </div>
          <p className="guide-tool-static-desc">site manger-bouger.</p>
          <p className="guide-tool-static-arrow">
            ▶ équilibrer et planifier les repas et les courses.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Focus activité physique
          </div>
          <p className="guide-tool-static-desc">site manger-bouger.</p>
          <p className="guide-tool-static-arrow">
            ▶ trouver une activité plaisante.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Ressources en cas de conduites addictives
          </div>
          <p className="guide-tool-static-desc">Sites web.</p>
          <p className="guide-tool-static-arrow">
            ▶ s'informer, demander de l'aide
          </p>
        </div>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* ===================================================================
   SECTION C — L'HISTOIRE DE JEAN (texte verbatim PDF p.3)
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
      <Headline accent="66 ans, ancien chauffeur routier">Jean</Headline>

      <div className="guide-story" style={{ ["--rub-color" as string]: rubColor }}>
        <p>
          « Peu de temps après mon départ en retraite, j'ai commencé à
          m'inquiéter : je perdais mes objets, j'oubliais ce que je venais
          faire ou dire, je n'arrivais plus du tout à suivre les conversations.
          Je ne me sentais pas bien, j'étais persuadé que quelque chose de
          grave commençait, peut-être un début de démence ? Le diagnostic m'a
          surpris : un TDAH, jamais repéré, passé inaperçu toute ma vie ! C'est
          vrai que j'ai toujours eu besoin de bouger, que j'étais plutôt sportif
          et actif, plus jeune, que ça m'aidait à me défouler et à mieux me
          concentrer.
        </p>
        <p>
          Le médecin m'a expliqué que le TDAH peut évoluer avec l'âge, et
          devenir plus visible si on change ses habitudes, si on perd un certain
          cadre. La retraite, c'est pas les vacances non plus, il faut garder
          une certaine discipline ! Alors, avec mon épouse, on a essayé de se
          réorganiser au quotidien, pas à pas : se coucher un peu plus tôt,
          manger à horaires réguliers, limiter les apéros, sans oublier :
          s'aérer et bouger, avec une marche le matin ou l'après-midi. Ça me
          vide la tête, et ça m'évite de rester trop longtemps devant la télé.
        </p>
        <p>
          Finalement j'ai bien vu que c'était plus mon attention qui me jouait
          des tours, que ma mémoire qui s'effaçait. Et que la fatigue et le
          moral avaient un impact. J'essaie de prendre plus soin de mon
          organisme, c'est un véritable outil de travail ! »
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
  const PHASE1_STEPS = [
    {
      key: "p1_section",
      label:
        "Je crée une section « Hygiène de vie » dans mon journal de bord",
    },
    {
      key: "p1_questionnement",
      label:
        "Je m'interroge : est-ce que je prête attention et prends soin de mon corps ?",
    },
    {
      key: "p1_reussites",
      label:
        "Qu'est-ce qui est en place et fonctionne ? — je note mes réussites",
    },
    {
      key: "p1_difficultes",
      label:
        "Qu'est-ce qui est plus compliqué ? — je prévois des pages / fiches dédiées aux domaines à améliorer",
    },
  ];

  return (
    <>
      <SectionLabel num="•">Les étapes du changement</SectionLabel>
      <Headline accent="à ton rythme">4 phases</Headline>

      <GuidePhaseCard num={1} title="Se préparer" rubColor={rubColor}>
        <ul className="guide-checklist">
          {PHASE1_STEPS.map((it) => (
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

        <GuidePersonalNote
          rubColor={rubColor}
          question="Qu'est-ce qui est en place et fonctionne ?"
          hint="Mes réussites — même petites."
          initial={notes.p1_reussites_text ?? ""}
          onSave={(v) => onNoteSave("p1_reussites_text", v)}
          placeholder="Note ce qui marche déjà chez toi : un rituel, un horaire, une activité, un soin…"
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Qu'est-ce qui est plus compliqué ?"
          hint="Les domaines que tu souhaites améliorer."
          initial={notes.p1_difficultes_text ?? ""}
          onSave={(v) => onNoteSave("p1_difficultes_text", v)}
          placeholder="Sommeil, alimentation, mouvement, écrans, sensoriel, addictions…"
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={2} title="Observer et questionner" rubColor={rubColor}>
        {/* Sommeil */}
        <h4 className="guide-phase-h">Sommeil</h4>
        <ul className="guide-bullets">
          <li>
            <b>Durée</b> et <b>qualité</b> pendant 1 semaine.
          </li>
          <li>
            <b>Quels éléments perturbateurs ?</b> (
            <i>
              écrans, caféine, stress, ruminations, irrégularité horaire,
              rythme de vie / de travail, centres d'intérêt…
            </i>
            )
          </li>
        </ul>
        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ Je me fixe un <b>micro-objectif</b> (
          <i>ex : mettre une alarme pour éteindre l'écran 15 mn plus tôt</i>).
        </p>
        <GuidePersonalNote
          rubColor={rubColor}
          question="Mon micro-objectif sommeil"
          initial={notes.p2_sommeil ?? ""}
          onSave={(v) => onNoteSave("p2_sommeil", v)}
          placeholder="Une chose, simple, à tenir."
        />

        {/* Alimentation */}
        <h4 className="guide-phase-h">Alimentation</h4>
        <ul className="guide-bullets">
          <li>
            <b>Horaires</b> de mes repas, <b>écarts</b> (
            <i>sauts, grignotage…</i>).
          </li>
          <li>
            <b>Contenu</b> de mes repas (
            <i>
              équilibre des nutriments, part de plats transformés, d'aliments
              riches en sucres….
            </i>
            ).
          </li>
        </ul>
        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ Je me fixe un <b>micro-objectif</b> (
          <i>
            ex : mettre une alarme pour dîner à 20h ; introduire un légume ou
            fruit frais dans mon déjeuner…
          </i>
          ).
        </p>
        <GuidePersonalNote
          rubColor={rubColor}
          question="Mon micro-objectif alimentation"
          initial={notes.p2_alim ?? ""}
          onSave={(v) => onNoteSave("p2_alim", v)}
          placeholder="Petit pas, à ta portée."
        />

        {/* Activité physique */}
        <h4 className="guide-phase-h">Activité physique</h4>
        <ul className="guide-bullets">
          <li>
            <b>Fréquence</b>, <b>durée</b> et <b>types</b> d'activités.
          </li>
          <li>
            Qu'est-ce qui me <b>motive</b> ? (
            <i>
              nature de l'activité, contexte social, musique, extérieur…
            </i>
            )
          </li>
        </ul>
        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ Je me fixe un <b>micro-objectif</b> (
          <i>
            ex : bouger 5 min par jour pendant une semaine ; faire à pied les
            trajets de moins d'1 km ; me garer le plus loin possible de mon
            lieu d'arrivée…
          </i>
          ).
        </p>
        <GuidePersonalNote
          rubColor={rubColor}
          question="Mon micro-objectif activité physique"
          initial={notes.p2_act ?? ""}
          onSave={(v) => onNoteSave("p2_act", v)}
          placeholder="Bouger un peu, au quotidien."
        />

        {/* Écrans */}
        <h4 className="guide-phase-h">Consommation d'écrans</h4>
        <ul className="guide-bullets">
          <li>
            Temps d'écran <b>quotidien</b>, <b>supports</b> et <b>types</b>{" "}
            d'activités ?
          </li>
          <li>
            Usages <b>utiles</b>, productifs <b>VS envahissants</b> au point de
            m'empêcher de faire des choses importantes pour moi.
          </li>
        </ul>
        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ Je me fixe un <b>micro-objectif</b> : Instaurer un{" "}
          <b>moment sans écran</b> (
          <i>ex : la première demi-heure au lever</i>).
        </p>
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/journal"
          icon={IconClock}
          title="Journal du temps"
          sub="Observer concrètement combien de temps je passe sur les écrans."
        />
        <GuidePersonalNote
          rubColor={rubColor}
          question="Mon micro-objectif écrans"
          initial={notes.p2_ecrans ?? ""}
          onSave={(v) => onNoteSave("p2_ecrans", v)}
          placeholder="Quel moment, quelle limite ?"
        />

        {/* Traitement sensoriel */}
        <h4 className="guide-phase-h">Traitement sensoriel</h4>
        <ul className="guide-bullets">
          <li>
            Pour <b>chaque sens</b> (
            <i>
              visuel, auditif, tactile, température, douleur, olfactif,
              gustatif, proprioceptif, vestibulaire
            </i>
            ) : quelles sont les <b>sensations / stimulations</b> que{" "}
            <b>j'apprécie</b> & recherche <b>VS</b> que j'ai en{" "}
            <b>aversion</b> & évite ?
          </li>
          <li>
            Quelles <b>stratégies</b> déjà en place / à tester ? (
            <i>
              bouchons d'oreilles / casque réducteur de bruit, lumière tamisée
              / lunettes solaires, fidgets / couverture lestée, chaises
              tournantes, balancelles, mange debout…
            </i>
            )
          </li>
        </ul>
        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes particularités sensorielles à moi"
          initial={notes.p2_sensoriel ?? ""}
          onSave={(v) => onNoteSave("p2_sensoriel", v)}
          placeholder="Ce qui m'apaise, ce qui m'agresse, mes stratégies…"
        />

        {/* Conduites addictives */}
        <h4 className="guide-phase-h">Conduites addictives</h4>
        <ul className="guide-bullets">
          <li>
            Quelles <b>consommations</b> / <b>conduites</b> ai-je du mal à{" "}
            <b>contrôler</b> ? (
            <i>caféine, tabac, alcool, cannabis, sucre, écrans, jeux, …</i>)
          </li>
          <li>
            Quels <b>éléments déclencheurs</b> ? (
            <i>
              contexte, relations, fatigue, humeur, état émotionnel - stress,
              ennui, tristesse, frustration…
            </i>
            )
          </li>
        </ul>
        <GuidePersonalNote
          rubColor={rubColor}
          question="Ce que j'observe sur mes conduites"
          initial={notes.p2_addict ?? ""}
          onSave={(v) => onNoteSave("p2_addict", v)}
          placeholder="Sans jugement. Juste l'observation."
        />
      </GuidePhaseCard>

      <GuidePhaseCard
        num={3}
        title={"Mettre en place des habitudes (« routines »)"}
        rubColor={rubColor}
      >
        <ul className="guide-bullets">
          <li>
            <b>Un seul</b> domaine <b>à la fois</b> (<i>ex : sommeil</i>).
          </li>
          <li>
            J'instaure une <b>nouvelle habitude</b> :
            <ul className="guide-sub-bullets">
              <li><b>Quoi ?</b> Quel nouveau comportement ?</li>
              <li><b>Quand ?</b> À quel moment ?</li>
              <li>Je le note dans mon <b>agenda</b> (<i>je me donne rdv !</i>)</li>
              <li>
                Je me prévois une petite <b>récompense</b>, bien méritée après
                l'effort !
              </li>
              <li>
                Je note mes <b>réussites</b> ➜ journal de gratitude.
              </li>
            </ul>
          </li>
          <li>
            J'ai besoin de <b>régularité</b> ! ➜ Je <b>planifie</b> des horaires
            pour les repas, le coucher et le réveil, l'activité physique.
          </li>
          <li>
            Mon <b>suivi médical</b> :
            <ul className="guide-sub-bullets">
              <li>
                Je prévois un <b>RDV</b> chez un médecin <b>généraliste</b>{" "}
                pour faire le point.
              </li>
              <li>
                Je programme des <b>rappels</b> (<i>ex annuels</i>) en
                anticipant les délais dans la prise de rdv.
              </li>
              <li>
                Je crée des <b>comptes</b> Ameli, Passeport santé… (
                <i>dossier médical, rappels, prévention</i>).
              </li>
            </ul>
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="Créer des routines structurées avec des étapes courtes et une récompense à la fin."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Le domaine sur lequel je me concentre cette fois-ci"
          hint="Un seul. Le plus simple à tester en premier."
          initial={notes.p3_domaine ?? ""}
          onSave={(v) => onNoteSave("p3_domaine", v)}
          placeholder="Sommeil ? Alimentation ? Activité physique ? Écrans ?…"
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Quoi ? Quand ? Quelle récompense ?"
          initial={notes.p3_habitude ?? ""}
          onSave={(v) => onNoteSave("p3_habitude", v)}
          placeholder="Ex : Couché à 23h ; pas d'écran après 22h30 ; une tisane chaude au coucher."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={4} title="Consolider et valoriser" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je <b>consulte</b> régulièrement <b>mes notes</b> (
            <i>ex chaque dimanche</i>) :
            <ul className="guide-sub-bullets">
              <li>Quels progrès ? Régularité ? Obstacles ?</li>
            </ul>
          </li>
          <li>
            J'<b>ajuste</b> mes <b>routines</b> si c'est "trop" : je{" "}
            <b>simplifie</b>, redécoupe en étapes plus rapidement / facilement
            atteignables ; <b>je m'engage</b> auprès d'un proche ; je travaille
            ma <b>motivation</b> (➜ rubrique #05)
          </li>
          <li>
            <b>Je me félicite</b> de mes réussites, même modestes. Si je
            stagne, je peux revoir mes objectifs avec un{" "}
            <b>professionnel formé au TDAH</b> (
            <i>psychiatre, psychologue, diététicien, ergothérapeute, jobcoach…</i>
            ).
          </li>
        </ul>

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

      <div className="guide-help-row">
        <div className="guide-help-card guide-help-card-orange">
          <div className="guide-help-eyebrow">
            <IconHand size={16} color="white" stroke={2.4} /> Si je rencontre
            des difficultés, je demande de l'aide
          </div>
          <p className="guide-help-text">
            <i>
              à un <b>proche</b>, et/ou à un·e <b>professionnel·le</b> :
              médecin généraliste, psychiatre, psychologue, consultation
              sommeil, réseau Morphée ; nutritionniste, diététicien·ne ;
              ergothérapeute pour un bilan sensoriel ; coach sportif ; service
              d'addictologie…
            </i>
          </p>
        </div>

        <div className="guide-help-card guide-help-card-red">
          <div className="guide-help-eyebrow">
            <IconShield size={16} color="white" stroke={2.4} /> Si je sens une
            perte de contrôle ou un danger pour moi ou pour autrui
          </div>
          <p className="guide-help-text">
            <i>
              Je consulte un·e <b>médecin</b>, un·e <b>psychologue</b>{" "}
              (addictologie, TCCE), je contacte les <b>urgences (15)</b>, une
              ligne d'écoute (ou chat).
            </i>
          </p>
        </div>
      </div>

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
      <Headline accent="rubrique #02">Synthèse</Headline>

      <div className="guide-retenir" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-retenir-eyebrow">
          <IconBook size={18} color={rubColor} stroke={2.4} />
          Prendre soin de soi
        </div>

        <h4 className="guide-retenir-h">L'objectif :</h4>
        <p className="guide-paragraph">
          Prendre soin de son corps pour soutenir son esprit. L'hygiène de vie
          est le socle sur lequel reposeront toutes les autres stratégies.
        </p>

        <h4 className="guide-retenir-h">Les points clés :</h4>
        <ul className="guide-bullets guide-bullets-arrow">
          <li>
            Le <b>sommeil</b>, l'<b>alimentation</b> et l'<b>activité physique</b>{" "}
            ont un <b>impact</b> sur le <b>fonctionnement cognitif</b>.
          </li>
          <li>
            <b>Percevoir</b> ses <b>besoins</b> corporels vitaux (
            <i>faim, fatigue, soif</i>) peut parfois faire défaut. Apprends à te
            "scanner" régulièrement.
          </li>
          <li>
            Crée des <b>routines protectrices</b> : <b>horaires réguliers</b>{" "}
            de repas, de coucher, de réveil.
          </li>
          <li>
            <b>Limite</b> les <b>écrans</b> avant le sommeil et <b>surveille</b>{" "}
            tes <b>consommations</b> (<i>caféine, sucre, alcool, tabac…</i>).
          </li>
          <li>
            Repère tes <b>particularités sensorielles</b> et <b>adapte</b> ton{" "}
            <b>environnement</b> en conséquence.
          </li>
          <li>
            N'hésite pas à solliciter des <b>professionnels</b> si tu rencontres
            des <b>difficultés persistantes</b> (
            <i>
              sommeil, alimentation, fonctionnement sensoriel, dépendance à
              des substances ou comportements
            </i>
            ).
          </li>
        </ul>

        <h4 className="guide-retenir-h">Le message :</h4>
        <p className="guide-paragraph">
          Le cerveau a besoin de <b>carburants</b> de <b>qualité</b> et de{" "}
          <b>temps</b> de <b>récupération</b>. Canaliser ton TDAH commence par
          être attentif·ve à ton corps et à prendre soin.
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}
