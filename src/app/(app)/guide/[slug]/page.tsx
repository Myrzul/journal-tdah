import { notFound } from "next/navigation";
import { Rubrique01Page } from "@/components/guide/rubrique-01-page";
import { Rubrique02Page } from "@/components/guide/rubrique-02-page";
import { RUBRIQUE_BY_SLUG } from "@/lib/guide/rubriques-meta";

type Params = { slug: string };

export default async function GuideRubriquePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const rubrique = RUBRIQUE_BY_SLUG[slug];
  if (!rubrique) notFound();

  if (rubrique.id === "01") {
    return <Rubrique01Page rubrique={rubrique} />;
  }
  if (rubrique.id === "02") {
    return <Rubrique02Page rubrique={rubrique} />;
  }

  if (!rubrique.available) {
    return (
      <div
        style={{
          padding: "32px 24px",
          textAlign: "center",
          color: "var(--ink-2)",
          fontFamily: "var(--font-cond)",
          fontSize: 14,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        Cette rubrique est en cours de préparation.
      </div>
    );
  }

  // Cas où la rubrique est available mais sans page implémentée encore (shouldn't happen)
  notFound();
}

export function generateStaticParams() {
  return Object.keys(RUBRIQUE_BY_SLUG).map((slug) => ({ slug }));
}
