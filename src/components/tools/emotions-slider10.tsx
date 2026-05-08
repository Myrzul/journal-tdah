"use client";

import { EMO_PINK } from "@/lib/tools/emotions-data";

type Props = {
  value: number | null | undefined;
  onChange: (v: number) => void;
};

export function EmotionsSlider10({ value, onChange }: Props) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-cond)",
          fontSize: 11,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--ink-2)",
          marginBottom: 6,
        }}
      >
        <span>0 · à peine</span>
        <span>10 · écrasante</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value ?? 0}
        onChange={(e) => onChange(Number.parseInt(e.target.value, 10))}
        aria-label="Intensité de l'émotion, de 0 à 10"
        style={{
          width: "100%",
          height: 14,
          accentColor: EMO_PINK,
        }}
      />
      <div
        style={{
          textAlign: "center",
          marginTop: 8,
          fontFamily: "var(--font-display)",
          fontSize: 36,
          color: EMO_PINK,
          lineHeight: 1,
        }}
      >
        {value ?? 0}
        <span style={{ fontSize: 16, color: "var(--ink-2)" }}> /10</span>
      </div>
    </div>
  );
}
