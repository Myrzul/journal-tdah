import { parseDateParam } from "@/lib/utils/date";
import { MatinDemo } from "./matin-demo";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function MatinPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeDate = parseDateParam(params.date) ?? new Date();
  return <MatinDemo activeDate={activeDate} />;
}
