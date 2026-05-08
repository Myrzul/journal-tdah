"use client";

import type { KeyboardEvent } from "react";
import {
  SCAN_PINK,
  STATES,
  type ScanStates,
  ZONES,
  type ZoneId,
} from "@/lib/tools/scan-data";

type Props = {
  states: ScanStates;
  activeZone?: ZoneId | null;
  onZoneClick?: ((id: ZoneId) => void) | null;
  scale?: number;
  dimUnvisited?: boolean;
  visited?: ZoneId[] | null;
};

export function ScanSilhouette({
  states,
  activeZone = null,
  onZoneClick = null,
  scale = 1,
  dimUnvisited = false,
  visited = null,
}: Props) {
  const W = 240;
  const H = 480;

  const fill = (id: ZoneId) => {
    const st = states[id];
    if (st) return STATES[st].color;
    return "#FAF7F2";
  };
  const stroke = (id: ZoneId) => (activeZone === id ? SCAN_PINK : "#0E0E10");
  const sw = (id: ZoneId) => (activeZone === id ? 4 : 2.2);
  const opacity = (id: ZoneId) => {
    if (!dimUnvisited) return 1;
    if (!visited) return 1;
    if (visited.includes(id) || activeZone === id) return 1;
    return 0.35;
  };

  const interactive = !!onZoneClick;
  const labelOf = (id: ZoneId) =>
    ZONES.find((z) => z.id === id)?.label ?? id;

  const zoneProps = (id: ZoneId) => {
    if (!interactive) {
      return { opacity: opacity(id) };
    }
    const onActivate = () => onZoneClick?.(id);
    const onKey = (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    };
    return {
      role: "button" as const,
      tabIndex: 0,
      "aria-label": `Zone ${labelOf(id)}${activeZone === id ? " (active)" : ""}`,
      "aria-pressed": activeZone === id,
      style: { cursor: "pointer" as const, outline: "none" },
      opacity: opacity(id),
      onClick: onActivate,
      onKeyDown: onKey,
    };
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 240 * scale, display: "block" }}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Silhouette corporelle"
    >
      <title>Silhouette corporelle, 8 régions</title>

      {/* TÊTE */}
      <g {...zoneProps("tete")}>
        <path
          d="M 120 18 Q 88 18 80 50 Q 78 60 80 68 L 160 68 Q 162 60 160 50 Q 152 18 120 18 Z"
          fill={fill("tete")}
          stroke={stroke("tete")}
          strokeWidth={sw("tete")}
          strokeLinejoin="round"
        />
        {activeZone === "tete" && <circle cx="120" cy="40" r="3" fill={SCAN_PINK} />}
      </g>

      {/* VISAGE */}
      <g {...zoneProps("visage")}>
        <path
          d="M 80 68 L 160 68 Q 158 90 140 96 Q 120 100 100 96 Q 82 90 80 68 Z"
          fill={fill("visage")}
          stroke={stroke("visage")}
          strokeWidth={sw("visage")}
          strokeLinejoin="round"
        />
      </g>

      {/* GORGE / NUQUE */}
      <g {...zoneProps("gorge")}>
        <path
          d="M 104 96 L 136 96 L 138 116 Q 120 120 102 116 Z"
          fill={fill("gorge")}
          stroke={stroke("gorge")}
          strokeWidth={sw("gorge")}
          strokeLinejoin="round"
        />
      </g>

      {/* ÉPAULES */}
      <g {...zoneProps("epaules")}>
        <path
          d="M 102 116 L 138 116 Q 168 120 184 138 Q 188 152 184 168 L 56 168 Q 52 152 56 138 Q 72 120 102 116 Z"
          fill={fill("epaules")}
          stroke={stroke("epaules")}
          strokeWidth={sw("epaules")}
          strokeLinejoin="round"
        />
      </g>

      {/* BRAS */}
      <g {...zoneProps("bras")}>
        <path
          d="M 56 144 Q 38 152 32 200 Q 30 248 38 280 Q 50 290 60 286 Q 64 248 64 200 Q 64 158 56 144 Z"
          fill={fill("bras")}
          stroke={stroke("bras")}
          strokeWidth={sw("bras")}
          strokeLinejoin="round"
        />
        <path
          d="M 184 144 Q 202 152 208 200 Q 210 248 202 280 Q 190 290 180 286 Q 176 248 176 200 Q 176 158 184 144 Z"
          fill={fill("bras")}
          stroke={stroke("bras")}
          strokeWidth={sw("bras")}
          strokeLinejoin="round"
        />
      </g>

      {/* VENTRE */}
      <g {...zoneProps("ventre")}>
        <path
          d="M 70 168 L 170 168 Q 174 220 168 268 Q 168 280 156 282 L 84 282 Q 72 280 72 268 Q 66 220 70 168 Z"
          fill={fill("ventre")}
          stroke={stroke("ventre")}
          strokeWidth={sw("ventre")}
          strokeLinejoin="round"
        />
      </g>

      {/* JAMBES */}
      <g {...zoneProps("jambes")}>
        <path
          d="M 80 282 L 116 282 Q 122 360 118 440 Q 116 458 100 458 Q 84 458 82 440 Q 76 360 80 282 Z"
          fill={fill("jambes")}
          stroke={stroke("jambes")}
          strokeWidth={sw("jambes")}
          strokeLinejoin="round"
        />
        <path
          d="M 124 282 L 160 282 Q 164 360 158 440 Q 156 458 140 458 Q 124 458 122 440 Q 118 360 124 282 Z"
          fill={fill("jambes")}
          stroke={stroke("jambes")}
          strokeWidth={sw("jambes")}
          strokeLinejoin="round"
        />
      </g>

      {/* DOS — badge déporté */}
      <g {...zoneProps("dos")}>
        <path
          d="M 175 220 Q 200 215 220 220 L 222 224"
          stroke="#0E0E10"
          strokeWidth="1.4"
          fill="none"
          strokeDasharray="3 3"
        />
        <rect
          x="200"
          y="226"
          width="36"
          height="64"
          rx="10"
          fill={fill("dos")}
          stroke={stroke("dos")}
          strokeWidth={sw("dos")}
        />
        <text
          x="218"
          y="250"
          textAnchor="middle"
          fontFamily="Archivo Narrow, sans-serif"
          fontWeight="800"
          fontSize="9"
          fill="#0E0E10"
          letterSpacing="0.1em"
        >
          DOS
        </text>
        <path
          d="M 210 258 Q 218 264 226 258 Q 218 272 210 258 Z"
          fill="none"
          stroke="#0E0E10"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <text
          x="218"
          y="282"
          textAnchor="middle"
          fontFamily="Archivo Narrow, sans-serif"
          fontWeight="800"
          fontSize="7"
          fill="#0E0E10"
          letterSpacing="0.08em"
        >
          LOMB.
        </text>
      </g>
    </svg>
  );
}
