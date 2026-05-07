"use client";

import { useState } from "react";
import { IconMoon, IconSun } from "@/components/icons";
import { cn } from "@/lib/utils/cn";
import { MatinDemo } from "@/components/demos/matin-demo";
import { SoirDemo } from "@/components/demos/soir-demo";

export type Moment = "matin" | "soir" | "auto";

function defaultMoment(date: Date): "matin" | "soir" {
  return date.getHours() < 18 ? "matin" : "soir";
}

type Props = {
  activeDate: Date;
  initialMoment: Moment;
};

export function AujourdhuiView({ activeDate, initialMoment }: Props) {
  const initial = initialMoment === "auto" ? defaultMoment(activeDate) : initialMoment;
  const [moment, setMoment] = useState<"matin" | "soir">(initial);

  return (
    <>
      <div className="moment-toggle" role="tablist" aria-label="Moment de la journée">
        <button
          type="button"
          role="tab"
          aria-selected={moment === "matin"}
          className={cn("moment-btn", moment === "matin" && "on", "matin")}
          onClick={() => setMoment("matin")}
        >
          <IconSun size={18} color={moment === "matin" ? "white" : "var(--ch-observer)"} />
          <span>Matin</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={moment === "soir"}
          className={cn("moment-btn", moment === "soir" && "on", "soir")}
          onClick={() => setMoment("soir")}
        >
          <IconMoon size={18} color={moment === "soir" ? "white" : "var(--ch-soin)"} />
          <span>Soir</span>
        </button>
      </div>

      {moment === "matin" ? (
        <MatinDemo activeDate={activeDate} />
      ) : (
        <SoirDemo activeDate={activeDate} />
      )}
    </>
  );
}
