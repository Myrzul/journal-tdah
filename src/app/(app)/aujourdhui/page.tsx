import { parseDateParam } from "@/lib/utils/date";
import { AujourdhuiView, type Moment } from "./aujourdhui-view";

type Props = {
  searchParams: Promise<{ date?: string; moment?: string }>;
};

export default async function AujourdhuiPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeDate = parseDateParam(params.date) ?? new Date();
  const initialMoment: Moment =
    params.moment === "soir" ? "soir" : params.moment === "matin" ? "matin" : "auto";
  return <AujourdhuiView activeDate={activeDate} initialMoment={initialMoment} />;
}
