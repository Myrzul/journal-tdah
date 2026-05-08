"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";
import type { EvalRecord } from "@/lib/tools/eval-storage";
import { EvalPdfDocument } from "./eval-pdf";

type Props = {
  record: EvalRecord;
};

export function EvalPdfDownload({ record }: Props) {
  const dateForFile = format(parseISO(record.date), "yyyy-MM-dd_HH-mm");
  const fileName = `journal-tdah_evaluation_${dateForFile}.pdf`;

  return (
    <PDFDownloadLink
      document={<EvalPdfDocument date={record.date} scores={record.scores} />}
      fileName={fileName}
      className="eval-btn-secondary"
    >
      {({ loading }) => (loading ? "Préparation du PDF…" : "Télécharger en PDF")}
    </PDFDownloadLink>
  );
}
