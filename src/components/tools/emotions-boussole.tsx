"use client";

import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { EMO_PINK } from "@/lib/tools/emotions-data";

type Point = { x: number; y: number };

type Props = {
  point?: Point;
  onPlace: (p: Point) => void;
  onClear: () => void;
};

const QUADRANTS = [
  { x: "25%", y: "25%", t: "éveillé · agréable", tone: "#E89A5C" },
  { x: "75%", y: "25%", t: "éveillé · pénible", tone: "#E8294E" },
  { x: "25%", y: "75%", t: "calme · agréable", tone: "#4DD0B0" },
  { x: "75%", y: "75%", t: "calme · pénible", tone: "#5B7FB8" },
] as const;

const KEYBOARD_STEP = 0.05;

export function EmotionsBoussole({ point, onPlace, onClear }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState(false);

  const update = useCallback(
    (clientX: number, clientY: number) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      const y = Math.max(0, Math.min(1, (clientY - r.top) / r.height));
      onPlace({ x, y });
    },
    [onPlace],
  );

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    setDrag(true);
    if ("touches" in e) {
      const t = e.touches[0];
      if (t) update(t.clientX, t.clientY);
    } else {
      update(e.clientX, e.clientY);
    }
  };

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if ("touches" in e) {
        const t = e.touches[0];
        if (t) update(t.clientX, t.clientY);
      } else {
        update(e.clientX, e.clientY);
      }
    };
    const onUp = () => setDrag(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [drag, update]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const cur = point ?? { x: 0.5, y: 0.5 };
    let { x, y } = cur;
    let consumed = true;
    switch (e.key) {
      case "ArrowLeft":
        x = Math.max(0, x - KEYBOARD_STEP);
        break;
      case "ArrowRight":
        x = Math.min(1, x + KEYBOARD_STEP);
        break;
      case "ArrowUp":
        y = Math.max(0, y - KEYBOARD_STEP);
        break;
      case "ArrowDown":
        y = Math.min(1, y + KEYBOARD_STEP);
        break;
      case "Enter":
      case " ":
        if (!point) onPlace({ x: 0.5, y: 0.5 });
        break;
      default:
        consumed = false;
    }
    if (consumed) {
      e.preventDefault();
      if (e.key.startsWith("Arrow")) onPlace({ x, y });
    }
  };

  const ariaLabel = point
    ? `Boussole des émotions, point posé en zone ${point.y < 0.5 ? "éveillée" : "calme"} et ${point.x < 0.5 ? "pénible" : "agréable"}. Glisse ou utilise les flèches pour déplacer.`
    : "Boussole des émotions à 2 axes. Active avec Entrée puis utilise les flèches pour déplacer le point, ou glisse.";

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={ref}
        role="application"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: role="application" required for custom 2D pad with arrow-key navigation; Biome's heuristic doesn't recognize this pattern
        tabIndex={0}
        aria-label={ariaLabel}
        onMouseDown={onDown}
        onTouchStart={onDown}
        onKeyDown={onKeyDown}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1",
          maxWidth: 340,
          margin: "0 auto",
          background: "#FAF7F2",
          border: "2.4px solid #0E0E10",
          borderRadius: 18,
          boxShadow: "4px 4px 0 #0E0E10",
          cursor: drag ? "grabbing" : "crosshair",
          touchAction: "none",
          userSelect: "none",
          overflow: "hidden",
          outline: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 1,
            background: "#0E0E10",
            opacity: 0.18,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            background: "#0E0E10",
            opacity: 0.18,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-cond)",
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: ".18em",
            color: "#0E0E10",
            textTransform: "uppercase",
          }}
        >
          ↑ ÉNERGIE HAUTE
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-cond)",
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: ".18em",
            color: "#0E0E10",
            textTransform: "uppercase",
          }}
        >
          ↓ ÉNERGIE BASSE
        </div>
        <div
          style={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "left center",
            fontFamily: "var(--font-cond)",
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: ".18em",
            color: "#0E0E10",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          ← DÉPLAISANT
        </div>
        <div
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            transformOrigin: "right center",
            fontFamily: "var(--font-cond)",
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: ".18em",
            color: "#0E0E10",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          PLAISANT →
        </div>

        {QUADRANTS.map((q) => (
          <div
            key={q.t}
            style={{
              position: "absolute",
              left: q.x,
              top: q.y,
              transform: "translate(-50%, -50%)",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: q.tone,
              opacity: 0.08,
              pointerEvents: "none",
            }}
          />
        ))}

        {point && (
          <div
            style={{
              position: "absolute",
              left: `${point.x * 100}%`,
              top: `${point.y * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: EMO_PINK,
              border: "2.4px solid #0E0E10",
              boxShadow: "2px 2px 0 #0E0E10",
              pointerEvents: "none",
              transition: drag ? "none" : "left .2s, top .2s",
            }}
          />
        )}
      </div>

      {point && (
        <div
          style={{
            textAlign: "center",
            marginTop: 14,
            fontFamily: "var(--font-cond)",
            fontSize: 13,
            color: "var(--ink-2)",
          }}
        >
          Tu as posé ton ressenti dans la zone{" "}
          <b style={{ color: "#0E0E10" }}>
            {(point.y < 0.5 ? "éveillée · " : "calme · ") +
              (point.x < 0.5 ? "pénible" : "agréable")}
          </b>
          .
          <button
            type="button"
            onClick={onClear}
            style={{
              display: "block",
              margin: "10px auto 0",
              background: "transparent",
              border: "none",
              fontFamily: "var(--font-cond)",
              fontSize: 11,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Replacer le point
          </button>
        </div>
      )}
    </div>
  );
}
