import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Umbrella } from "@/components/monsters";

type HubHeaderProps = {
  today?: Date;
  greeting?: string;
};

export function HubHeader({ today = new Date(), greeting }: HubHeaderProps) {
  const dateStr = format(today, "EEEE d MMMM yyyy", { locale: fr });
  const capitalized = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <header className="hub-header">
      <div className="brand-row">
        <Umbrella color="var(--ink)" size={42} />
        <div className="brand-text">
          <span className="brand-eyebrow">Pratique d'introspection · TDAH</span>
          <span className="brand-title">JOURNAL TDAH</span>
        </div>
      </div>
      <h1 className="hub-date">{capitalized}</h1>
      <p className="hub-greeting">{greeting ?? "Doucement, à ton rythme."}</p>
    </header>
  );
}
