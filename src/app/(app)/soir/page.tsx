import { parseDateParam } from "@/lib/utils/date";
import { SoirDemo } from "./soir-demo";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function SoirPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeDate = parseDateParam(params.date) ?? new Date();
  return <SoirDemo activeDate={activeDate} />;
}
