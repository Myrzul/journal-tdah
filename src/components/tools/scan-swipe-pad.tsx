"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { STATES, type ZoneState } from "@/lib/tools/scan-data";

type Props = {
  onChoose: (s: ZoneState) => void;
};

const VALUE_MAP: Record<ZoneState, number> = {
  detendu: 1,
  neutre: 2,
  tendu: 3,
};

export function ScanSwipePad({ onChoose }: Props) {
  const [drag, setDrag] = useState<{ active: boolean; dy: number }>({
    active: false,
    dy: 0,
  });
  const startY = useRef<number>(0);

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    let y: number | undefined;
    if ("clientY" in e) y = e.clientY;
    else if (e.touches?.[0]) y = e.touches[0].clientY;
    if (y == null) return;
    startY.current = y;
    setDrag({ active: true, dy: 0 });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      onChoose("detendu");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onChoose("tendu");
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChoose("neutre");
    }
  };

  useEffect(() => {
    if (!drag.active) return;

    const move = (e: MouseEvent | TouchEvent) => {
      let y: number | undefined;
      if ("clientY" in e) y = e.clientY;
      else if ("touches" in e && e.touches[0]) y = e.touches[0].clientY;
      if (y == null) return;
      setDrag({ active: true, dy: y - startY.current });
    };

    const up = () => {
      setDrag((d) => {
        const dy = d.dy;
        const TH = 24;
        let s: ZoneState;
        if (dy < -TH) s = "detendu";
        else if (dy > TH) s = "tendu";
        else s = "neutre";
        onChoose(s);
        return { active: false, dy: 0 };
      });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [drag.active, onChoose]);

  const dy = Math.max(-90, Math.min(90, drag.dy));
  const previewState: ZoneState = dy < -24 ? "detendu" : dy > 24 ? "tendu" : "neutre";

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Glisse haut pour détendu, bas pour tendu, ou utilise les flèches"
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuenow={VALUE_MAP[previewState]}
      aria-valuetext={STATES[previewState].label}
      aria-orientation="vertical"
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
      onKeyDown={onKeyDown}
      style={{
        position: "relative",
        background: "white",
        border: "2px solid #0E0E10",
        borderRadius: 24,
        padding: "24px 20px",
        userSelect: "none",
        touchAction: "none",
        cursor: drag.active ? "grabbing" : "grab",
        overflow: "hidden",
        minHeight: 240,
        outline: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 4,
          borderRadius: 20,
          background: `linear-gradient(180deg,
            ${STATES.detendu.color}22 0%,
            transparent 30%, transparent 70%,
            ${STATES.tendu.color}22 100%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "var(--font-cond)",
          fontWeight: 800,
          fontSize: 11,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: STATES.detendu.color,
        }}
      >
        ↑ DÉTENDU
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "var(--font-cond)",
          fontWeight: 800,
          fontSize: 11,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: STATES.tendu.color,
        }}
      >
        ↓ TENDU
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, calc(-50% + ${dy}px))`,
          transition: drag.active
            ? "none"
            : "transform .25s cubic-bezier(.2,.8,.2,1)",
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: STATES[previewState].color,
          border: "2px solid #0E0E10",
          boxShadow: "4px 4px 0 #0E0E10",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 4,
          color: "#0E0E10",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: ".04em",
          }}
        >
          {STATES[previewState].label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-cond)",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            opacity: 0.7,
            maxWidth: 110,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {drag.active ? "— relâche pour valider" : "glisse haut ou bas"}
        </span>
      </div>
    </div>
  );
}
