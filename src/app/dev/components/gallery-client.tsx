"use client";

import { useState } from "react";
import {
  IconBattery,
  IconBolt,
  IconBook,
  IconBrush,
  IconBulb,
  IconCalendar,
  IconCheck,
  IconCloud,
  IconCompass,
  IconDrop,
  IconEye,
  IconEyeOpen,
  IconFlower,
  IconHand,
  IconHeart,
  IconLeaf,
  IconList,
  IconMail,
  IconMix,
  IconMoon,
  IconMore,
  IconPause,
  IconRun,
  IconSparkle,
  IconStarBig,
  IconSun,
  Icons,
  IconTarget,
  IconUsers,
  IconWind,
  IconWriting,
} from "@/components/icons";
import { Card, CardColor } from "@/components/journal/cards";
import {
  Checklist,
  Chips,
  EmoGrid,
  Field,
  FreeArea,
  Opt,
  PillarGrid,
  PrioRow,
  Prog3,
  Scale,
} from "@/components/journal/inputs";
import { ListBlock, type ListItem } from "@/components/journal/list-block";
import {
  Compare,
  HandNote,
  Headline,
  HintLink,
  HLQuote,
  IntroHand,
  Label,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import {
  MonsterCalme,
  MonsterCurieux,
  MonsterEndormi,
  MonsterEnergique,
  MonsterFier,
  MonsterInquiet,
  MonsterReflexif,
  MonsterSurprise,
  Umbrella,
} from "@/components/monsters";

const MONSTERS = [
  ["Curieux", MonsterCurieux, "#1B4FE5"],
  ["Calme", MonsterCalme, "#4DD0B0"],
  ["Reflexif", MonsterReflexif, "#B05BC9"],
  ["Fier", MonsterFier, "#E8294E"],
  ["Surprise", MonsterSurprise, "#F0B340"],
  ["Energique", MonsterEnergique, "#F26B2C"],
  ["Inquiet", MonsterInquiet, "#FF8AB8"],
  ["Endormi", MonsterEndormi, "#7C8A99"],
] as const;

export function GalleryClient() {
  const [scale, setScale] = useState<number>(3);
  const [emo, setEmo] = useState<string | null>(null);
  const [chips, setChips] = useState<string[]>([]);
  const [opt, setOpt] = useState<string | null>(null);
  const [check, setCheck] = useState<string[]>([]);
  const [field, setField] = useState<string>("");
  const [free, setFree] = useState<string>("");
  const [prio0, setPrio0] = useState("");
  const [prog, setProg] = useState<0 | 1 | 2 | null>(1);
  const [pillars, setPillars] = useState<string[]>(["liberte"]);
  const [list, setList] = useState<ListItem[]>([
    { id: "a", text: "Acheter du pain", done: false },
    { id: "b", text: "Appeler la pharmacie", done: true },
  ]);

  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <header
        className="app-header"
        style={{ background: "var(--ch-observer)", paddingBottom: 40 }}
      >
        <div className="brand-row">
          <Umbrella color="white" size={42} />
          <div className="brand-text">
            <span className="brand-eyebrow">Galerie · dev only</span>
            <span className="brand-title">DESIGN SYSTEM</span>
          </div>
        </div>
        <h1 className="tab-title">COMPONENTS</h1>
        <p className="tab-subtitle">
          Tous les primitives, mascottes, icônes et états, pour QA visuelle.
        </p>
      </header>

      <div className="page" style={{ paddingTop: 56 }}>
        {/* TYPOGRAPHIE */}
        <SectionLabel num="A">Typographie</SectionLabel>
        <Headline accent="(la charte est sacrée)">Headlines</Headline>

        <Card title="Hiérarchie">
          <div style={{ fontFamily: "var(--font-display)", fontSize: 48, lineHeight: 1 }}>
            DISPLAY 48px
          </div>
          <div
            style={{
              fontFamily: "var(--font-cond)",
              fontSize: 18,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginTop: 12,
            }}
          >
            CONDENSED 18px BOLD
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              lineHeight: 1.55,
              marginTop: 12,
            }}
          >
            Body Inter 15px, la respiration tranquille du journal. Doucement, à ton rythme.
          </div>
          <div
            style={{
              fontFamily: "var(--font-hand)",
              fontSize: 32,
              marginTop: 12,
              color: "var(--ink)",
            }}
          >
            Caveat 32px, la voix manuscrite, complice
          </div>
        </Card>

        {/* MASCOTTES */}
        <SectionLabel num="B">Mascottes</SectionLabel>
        <Headline>Les 8 monstres</Headline>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 14,
            marginBottom: 24,
          }}
        >
          {MONSTERS.map(([name, M, color]) => (
            <div
              key={name}
              style={{
                background: "white",
                border: "2px solid var(--ink)",
                borderRadius: "var(--r-lg)",
                padding: 12,
                textAlign: "center",
              }}
            >
              <div style={{ width: 80, height: 80, margin: "0 auto" }}>
                <M color={color} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-cond)",
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginTop: 6,
                }}
              >
                {name}
              </div>
            </div>
          ))}
        </div>

        <SectionLabel>Parapluies</SectionLabel>
        <div style={{ display: "flex", gap: 18, marginBottom: 24 }}>
          {[
            ["Sans numéro", undefined, "#1B4FE5"],
            ["N°1 cobalt", 1, "#1B4FE5"],
            ["N°4 orange", 4, "#F26B2C"],
            ["N°6 vert", 6, "#1FBF7A"],
          ].map(([label, num, color]) => (
            <div key={String(label)} style={{ textAlign: "center" }}>
              <Umbrella color={String(color)} number={num as number | undefined} size={80} />
              <div
                style={{
                  fontFamily: "var(--font-cond)",
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: 4,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ICÔNES */}
        <SectionLabel num="C">Icônes</SectionLabel>
        <Headline accent={`(${Object.keys(Icons).length} pictos)`}>Système</Headline>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {Object.entries(Icons).map(([name, Ic]) => (
            <div
              key={name}
              style={{
                background: "white",
                border: "2px solid var(--ink)",
                borderRadius: 12,
                padding: 12,
                textAlign: "center",
                fontSize: 9,
                fontFamily: "var(--font-cond)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <div style={{ height: 24, marginBottom: 6 }}>
                <Ic size={24} />
              </div>
              {name}
            </div>
          ))}
        </div>

        {/* PRIMITIVES TYPOGRAPHIQUES */}
        <SectionLabel num="D">Primitives ·typographie</SectionLabel>
        <Headline>Hand & quotes</Headline>

        <IntroHand>
          C'est l'intro manuscrite, douce et chaleureuse.
          <br />
          <span style={{ color: "var(--ink-2)" }}>Avec une seconde ligne d'apaisement.</span>
        </IntroHand>

        <HandNote>« Une note de marge, légèrement inclinée. »</HandNote>
        <HandNote right>« Et une qui penche dans l'autre sens. »</HandNote>

        <HLQuote>
          Le silence aussi
          <br />
          est une réponse.
        </HLQuote>

        <Compare>Compare ton intention de ce matin avec ton ressenti du soir.</Compare>

        <HintLink>Voir un exemple</HintLink>

        <Retain title="LA RÈGLE D'OR" monster={MonsterCurieux}>
          Tu peux tout poser. Le journal ne juge jamais. Il t'attend, c'est tout.
        </Retain>

        {/* CARDS */}
        <SectionLabel num="E">Primitives ·cards</SectionLabel>
        <Headline>Cartes</Headline>

        <Card icon={IconBattery} title="Card simple" sub="Avec une icône et un sous-titre.">
          <div style={{ paddingTop: 8, color: "var(--ink-2)" }}>Contenu libre dans la carte.</div>
        </Card>

        <Card icon={IconHeart} title="Card sans sous-titre">
          <div style={{ paddingTop: 8 }}>Plus dépouillée.</div>
        </Card>

        <CardColor
          ribbon="EXEMPLE"
          title="Card colorée"
          sub="Avec un ribbon et la couleur dominante."
        >
          <p style={{ marginTop: 8, opacity: 0.92 }}>
            Utile pour les blocs « à retenir » ou les call-to-action mis en valeur.
          </p>
        </CardColor>

        {/* FORM PRIMITIVES */}
        <SectionLabel num="F">Primitives ·saisie</SectionLabel>
        <Headline>Formulaires</Headline>

        <Card icon={IconBattery} title="Échelle 1-5">
          <Scale value={scale} onChange={setScale} labelLow="VIDE" labelHigh="PLEINE" />
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--ink-2)" }}>
            Valeur : {scale ?? "—"}
          </div>
        </Card>

        <Card title="EmoGrid (illu + label)">
          <EmoGrid
            value={emo}
            onChange={setEmo}
            items={[
              { id: "calme", label: "Calme", illu: MonsterCalme, color: "#4DD0B0" },
              { id: "curieux", label: "Curieux", illu: MonsterCurieux, color: "#1B4FE5" },
              { id: "reflexif", label: "Réflexif", illu: MonsterReflexif, color: "#B05BC9" },
              { id: "energique", label: "Énergique", illu: MonsterEnergique, color: "#F26B2C" },
              { id: "inquiet", label: "Inquiet", illu: MonsterInquiet, color: "#F0B340" },
              { id: "endormi", label: "Endormi", illu: MonsterEndormi, color: "#7C8A99" },
            ]}
          />
        </Card>

        <Card title="Chips multi-sélect">
          <Chips
            value={chips}
            onChange={setChips}
            items={[
              { id: "pause", label: "Pause", icon: IconPause },
              { id: "ecrire", label: "Écrire", icon: IconWriting },
              { id: "sortir", label: "Sortir", icon: IconWind },
              { id: "lire", label: "Lire", icon: IconBook },
            ]}
          />
        </Card>

        <Card title="Opt single-sélect">
          <Opt
            value={opt}
            onChange={setOpt}
            items={[
              { id: "oui", label: "Oui" },
              { id: "non", label: "Non" },
              { id: "peut", label: "Peut-être" },
            ]}
          />
        </Card>

        <Card title="Checklist">
          <Checklist
            value={check}
            onChange={setCheck}
            items={[
              { id: "eau", label: "Boire de l'eau", icon: IconDrop },
              { id: "air", label: "Prendre l'air", icon: IconWind },
              { id: "manger", label: "Manger", icon: IconLeaf },
            ]}
          />
        </Card>

        <Card title="Field & FreeArea">
          <Label>Champ court</Label>
          <Field value={field} onChange={setField} placeholder="Tape quelque chose…" />
          <Label>Zone libre</Label>
          <FreeArea
            value={free}
            onChange={setFree}
            placeholder="L'espace pour écrire, sans contrainte de taille."
          />
        </Card>

        <Card icon={IconTarget} title="Priorités (3)">
          <PrioRow
            tag="P1 · INCONTOURNABLE"
            klass="t1"
            value={prio0}
            onChange={setPrio0}
            placeholder="Ce qui doit être fait"
          />
          <PrioRow
            tag="P2 · IMPORTANT"
            klass="t2"
            value={undefined}
            onChange={() => undefined}
            placeholder="Ce qui ferait du bien"
          />
          <PrioRow
            tag="P3 · BONUS"
            klass="t3"
            value={undefined}
            onChange={() => undefined}
            placeholder="Si l'énergie le permet"
          />
        </Card>

        <Card title="Prog3 · pas / mi / fait">
          <Prog3 value={prog} onChange={setProg} label="Avancement" />
        </Card>

        <Card icon={IconHeart} title="PillarGrid (3 valeurs max)">
          <PillarGrid
            value={pillars}
            onChange={(v) => setPillars(v.slice(-3))}
            items={[
              { id: "liberte", label: "Liberté", icon: IconWind },
              { id: "creation", label: "Création", icon: IconBrush },
              { id: "lien", label: "Lien", icon: IconUsers },
              { id: "verite", label: "Vérité", icon: IconEyeOpen },
              { id: "douceur", label: "Douceur", icon: IconFlower },
              { id: "force", label: "Force", icon: IconBolt },
              { id: "paix", label: "Paix", icon: IconLeaf },
              { id: "aventure", label: "Aventure", icon: IconStarBig },
              { id: "apprentis", label: "Apprendre", icon: IconBook },
            ]}
          />
        </Card>

        {/* LIST BLOCK */}
        <SectionLabel num="G">Primitives ·listes</SectionLabel>
        <Headline>List block</Headline>
        <ListBlock
          icon={IconCheck}
          title="À faire (sans pression)"
          items={list}
          onChange={setList}
        />
      </div>
    </main>
  );
}
