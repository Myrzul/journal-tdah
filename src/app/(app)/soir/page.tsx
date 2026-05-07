import { parseDateParam } from "@/lib/utils/date";
import { SoirPlaceholder } from "./soir-placeholder";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function SoirPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeDate = parseDateParam(params.date) ?? new Date();
  return <SoirPlaceholder activeDate={activeDate} />;
}
