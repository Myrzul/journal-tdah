"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  type EvalScores,
  getRubriqueLevel,
  getSymptomLevel,
  getWellbeingLevel,
  type SectionId,
  SECTIONS_BY_ID,
} from "@/lib/tools/eval-data";

/**
 * PDF d'export d'une évaluation TDAH.
 * Une page A4, à la charte du journal (sobre, lisible, sans dépendance à des fonts custom
 * — react-pdf ne sait pas charger les fonts Next.js automatiquement, on garde Helvetica
 * par défaut pour éviter les bugs en prod).
 */

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    color: "#0E0E10",
    fontFamily: "Helvetica",
    backgroundColor: "#F4F1EA",
  },
  header: {
    borderBottom: "2 solid #0E0E10",
    paddingBottom: 14,
    marginBottom: 18,
  },
  brandTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  brandSub: {
    fontSize: 9,
    color: "#4A4A55",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  meta: {
    marginTop: 8,
    fontSize: 9,
    color: "#4A4A55",
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginTop: 14,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  twoCol: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  scoreBox: {
    flex: 1,
    border: "1.5 solid #0E0E10",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  scoreLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  scoreMax: {
    fontSize: 9,
    color: "#4A4A55",
  },
  scoreLevel: {
    marginTop: 8,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
    fontSize: 9,
  },
  rubName: {
    flex: 1,
    fontFamily: "Helvetica-Bold",
  },
  rubBar: {
    width: 100,
    height: 8,
    backgroundColor: "#E6E5E1",
    borderRadius: 4,
    overflow: "hidden",
  },
  rubBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  rubScore: {
    width: 40,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },
  rubLevel: {
    width: 90,
    fontSize: 8,
    color: "#4A4A55",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  total: {
    marginTop: 6,
    paddingTop: 8,
    borderTop: "1 solid #B5B5BD",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  wellbeing: {
    marginTop: 14,
    border: "1.5 solid #0E0E10",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  wellbeingHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 6,
  },
  disclaimer: {
    marginTop: 18,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    border: "1 dashed #4A4A55",
    fontSize: 8,
    color: "#4A4A55",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#4A4A55",
    borderTop: "1 solid #E6E5E1",
    paddingTop: 8,
  },
});

const RUBRIQUES: SectionId[] = [
  "rub1",
  "rub2",
  "rub3",
  "rub4",
  "rub5",
  "rub6",
  "rub7",
  "rub8",
  "rub9",
];

type Props = {
  date: string;
  scores: EvalScores;
};

export function EvalPdfDocument({ date, scores }: Props) {
  const inattLevel = getSymptomLevel(scores.inattention);
  const hyperLevel = getSymptomLevel(scores.hyperactivite);
  const wbLevel = getWellbeingLevel(scores.rub10);

  const dateLong = format(parseISO(date), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr });
  const dateLongCap = dateLong.charAt(0).toUpperCase() + dateLong.slice(1);

  return (
    <Document title={`Auto-évaluation TDAH · ${dateLongCap}`} author="Journal TDAH">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>JOURNAL TDAH</Text>
          <Text style={styles.brandSub}>Auto-évaluation · Pratique d'introspection</Text>
          <Text style={styles.meta}>Évaluation du {dateLongCap}</Text>
        </View>

        {/* Étape 1 */}
        <Text style={styles.sectionTitle}>Étape 1 · Sévérité des symptômes (6 derniers mois)</Text>
        <View style={styles.twoCol}>
          <View style={styles.scoreBox}>
            <Text style={[styles.scoreLabel, { color: inattLevel.color }]}>Inattention</Text>
            <Text style={[styles.scoreValue, { color: inattLevel.color }]}>
              {scores.inattention}
            </Text>
            <Text style={styles.scoreMax}>/ 36</Text>
            <Text style={[styles.scoreLevel, { backgroundColor: inattLevel.color }]}>
              {inattLevel.label}
            </Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={[styles.scoreLabel, { color: hyperLevel.color }]}>
              Hyperactivité / Impulsivité
            </Text>
            <Text style={[styles.scoreValue, { color: hyperLevel.color }]}>
              {scores.hyperactivite}
            </Text>
            <Text style={styles.scoreMax}>/ 36</Text>
            <Text style={[styles.scoreLevel, { backgroundColor: hyperLevel.color }]}>
              {hyperLevel.label}
            </Text>
          </View>
        </View>

        {/* Étape 2 */}
        <Text style={styles.sectionTitle}>Étape 2 · Répercussions par domaine (dernier mois)</Text>
        {RUBRIQUES.map((id) => {
          const score = scores[id];
          const lvl = getRubriqueLevel(score);
          const pct = (score / 20) * 100;
          const sec = SECTIONS_BY_ID[id];
          return (
            <View key={id} style={styles.rubRow}>
              <Text style={styles.rubName}>{sec.title}</Text>
              <View style={styles.rubBar}>
                <View
                  style={[styles.rubBarFill, { width: `${pct}%`, backgroundColor: lvl.color }]}
                />
              </View>
              <Text style={[styles.rubScore, { color: lvl.color }]}>{score}/20</Text>
              <Text style={styles.rubLevel}>{lvl.label}</Text>
            </View>
          );
        })}
        <Text style={styles.total}>Total répercussions : {scores.totalRepercussions} / 180</Text>

        {/* Bien-être */}
        <View style={styles.wellbeing}>
          <View style={styles.wellbeingHead}>
            <Text style={[styles.scoreLabel, { color: wbLevel.color }]}>
              Bien-être mental global
            </Text>
            <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: wbLevel.color }}>
              {scores.rub10} / 20
            </Text>
          </View>
          <Text style={[styles.scoreLevel, { backgroundColor: wbLevel.color, marginBottom: 6 }]}>
            {wbLevel.label}
          </Text>
          {wbLevel.desc && (
            <Text style={{ fontSize: 9, color: "#4A4A55", lineHeight: 1.5 }}>{wbLevel.desc}</Text>
          )}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text>
            Outil psychoéducatif. Ne remplace pas un diagnostic clinique. Si les scores
            t'inquiètent, parle-en à un professionnel de santé.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>journal.symbiose-psychologie.com</Text>
      </Page>
    </Document>
  );
}
