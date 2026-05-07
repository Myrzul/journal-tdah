"use client";

import { useEffect, useRef, useState } from "react";
import type { LevelN } from "@/lib/tools/thermo-data";

// Touch listeners attachés en natif sur le SVG (pas via React) car
// React met touchmove en passive: true par défaut, ce qui interdit
// preventDefault() et laisse le scroll de la page intercepter le drag.
// Avec passive: false on peut bloquer le scroll pendant le drag tactile.

type Props = {
  level: LevelN | null;
  /** Couleur des bras et hands (sur fond coloré, blanc) */
  limbColor?: string;
  /** Couleur du mercure */
  mercuryColor?: string;
  onPick: (n: LevelN) => void;
};

const W = 220;
const H = 460;
const cx = W / 2;
const tubeTop = 120;
const tubeBot = 340;
const tubeH = tubeBot - tubeTop;
const tubeW = 56;
const headR = 60;
const headCy = 388;

export function ThermoVisual({
  level,
  limbColor = "#0E0E10",
  mercuryColor = "#1B4FE5",
  onPick,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const [tick, setTick] = useState(0);
  const [animLvl, setAnimLvl] = useState<number>(level ?? 1);

  // animation loop pour bulles, sway, breath
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setTick((t) => (t + 1) % 100000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ease anim du mercure vers le niveau cible
  useEffect(() => {
    let raf = 0;
    const target = level ?? 1;
    const step = () => {
      setAnimLvl((prev) => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.005) return target;
        const next = prev + diff * 0.12;
        raf = requestAnimationFrame(step);
        return next;
      });
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [level]);

  const lvl = level ?? 1;
  const animFillRatio = animLvl / 5;
  const fillTop = tubeBot - animFillRatio * tubeH;

  // Ref vers le dernier onPick fourni : le useEffect qui attache les listeners
  // ne se re-bind pas à chaque render même si le parent recrée pickLevel.
  const onPickRef = useRef(onPick);
  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  // Native touch + mouse listeners sur le SVG.
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const compute = (clientY: number): LevelN => {
      const rect = svg.getBoundingClientRect();
      const yLocal = (clientY - rect.top) * (H / rect.height);
      const ratio = Math.max(0, Math.min(1, (tubeBot - yLocal) / tubeH));
      const n = Math.max(1, Math.min(5, Math.round(ratio * 5 + 0.0001)));
      return n as LevelN;
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      dragging.current = true;
      onPickRef.current(compute(touch.clientY));
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      // Bloque le scroll de la page pendant le drag — passive: false requis.
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) onPickRef.current(compute(touch.clientY));
    };
    const handleTouchEnd = () => {
      dragging.current = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      onPickRef.current(compute(e.clientY));
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      onPickRef.current(compute(e.clientY));
    };
    const handleMouseUp = () => {
      dragging.current = false;
    };

    svg.addEventListener("touchstart", handleTouchStart, { passive: false });
    svg.addEventListener("touchmove", handleTouchMove, { passive: false });
    svg.addEventListener("touchend", handleTouchEnd);
    svg.addEventListener("touchcancel", handleTouchEnd);
    svg.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      svg.removeEventListener("touchstart", handleTouchStart);
      svg.removeEventListener("touchmove", handleTouchMove);
      svg.removeEventListener("touchend", handleTouchEnd);
      svg.removeEventListener("touchcancel", handleTouchEnd);
      svg.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // breathing scale on head
  const breathSpeed = 0.04 + (lvl - 1) * 0.025;
  const breath = 1 + Math.sin(tick * breathSpeed) * 0.018;

  // arm sway
  const swaySpeed = 0.03 + (lvl - 1) * 0.04;
  const sway = Math.sin(tick * swaySpeed) * (lvl >= 4 ? 8 : 3);
  const swayR = -sway;

  // antenna shake
  const antennaShake = lvl >= 4 ? Math.sin(tick * 0.5) * 4 : Math.sin(tick * 0.04) * 1.5;

  // wavy mercury top
  const waveAmp = 4;
  const waveFreq = 0.15;
  const segs = 16;
  const wavePts: [number, number][] = [];
  for (let i = 0; i <= segs; i++) {
    const x = cx - tubeW / 2 + (i / segs) * tubeW;
    const y = fillTop + Math.sin(tick * 0.08 + i * waveFreq * 2) * waveAmp;
    wavePts.push([x, y]);
  }
  const meniscus =
    `M ${cx - tubeW / 2} ${tubeBot} ` +
    `L ${cx - tubeW / 2} ${fillTop} ` +
    wavePts.map((p) => `L ${p[0]} ${p[1]}`).join(" ") +
    ` L ${cx + tubeW / 2} ${fillTop} L ${cx + tubeW / 2} ${tubeBot} Z`;

  // bubbles
  const bubbleCount = Math.max(2, lvl + 1);
  const bubbles: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < bubbleCount; i++) {
    const speed = 0.5 + lvl * 0.25;
    const t = (tick * speed + i * 47) % 100;
    const yProgress = t / 100;
    const by = tubeBot - yProgress * (tubeBot - fillTop - 8);
    if (by > fillTop + 8 && by < tubeBot - 4) {
      bubbles.push({
        x: cx + Math.sin(tick * 0.05 + i * 1.7) * (tubeW / 2 - 10),
        y: by,
        r: 3 + (i % 3),
      });
    }
  }

  // expressions per level
  const eyesByLevel = (n: LevelN) => {
    const x1 = cx - 18;
    const x2 = cx + 18;
    const y = headCy - 4;
    if (n === 1) {
      return (
        <>
          <path
            d={`M ${x1 - 8} ${y + 2} Q ${x1} ${y - 4} ${x1 + 8} ${y + 2}`}
            stroke="#0E0E10"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${x2 - 8} ${y + 2} Q ${x2} ${y - 4} ${x2 + 8} ${y + 2}`}
            stroke="#0E0E10"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    }
    if (n === 2) {
      return (
        <>
          <circle cx={x1} cy={y} r="7" fill="white" />
          <circle cx={x1 + 2} cy={y + 1} r="3.2" fill="#0E0E10" />
          <circle cx={x2} cy={y} r="7" fill="white" />
          <circle cx={x2 + 2} cy={y + 1} r="3.2" fill="#0E0E10" />
        </>
      );
    }
    if (n === 3) {
      return (
        <>
          <circle cx={x1} cy={y + 2} r="2.5" fill="#0E0E10" />
          <circle cx={x2} cy={y + 2} r="2.5" fill="#0E0E10" />
        </>
      );
    }
    if (n === 4) {
      return (
        <>
          <circle cx={x1} cy={y + 2} r="3.2" fill="#0E0E10" />
          <circle cx={x2} cy={y + 2} r="3.2" fill="#0E0E10" />
        </>
      );
    }
    // n === 5
    return (
      <>
        <path d={`M ${x1 - 9} ${y - 8} L ${x1 + 8} ${y - 3}`} stroke="#0E0E10" strokeWidth="3" strokeLinecap="round" />
        <path d={`M ${x1 - 9} ${y} Q ${x1} ${y - 4} ${x1 + 9} ${y}`} stroke="#0E0E10" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d={`M ${x1 - 6} ${y + 6} q 0 6 -3 9 q -3 -3 -3 -9`} fill="#1B4FE5" opacity="0.8" />
        <path d={`M ${x2 - 9} ${y - 8} L ${x2 + 8} ${y - 3}`} stroke="#0E0E10" strokeWidth="3" strokeLinecap="round" />
        <path d={`M ${x2 - 9} ${y} Q ${x2} ${y - 4} ${x2 + 9} ${y}`} stroke="#0E0E10" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d={`M ${x2 + 6} ${y + 6} q 0 6 -3 9 q -3 -3 -3 -9`} fill="#1B4FE5" opacity="0.8" />
      </>
    );
  };

  const mouthByLevel = (n: LevelN) => {
    if (n === 1) {
      return (
        <path
          d={`M ${cx - 14} ${headCy + 18} Q ${cx} ${headCy + 28} ${cx + 14} ${headCy + 18}`}
          stroke="#0E0E10"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    if (n === 2) {
      return (
        <line
          x1={cx - 10}
          y1={headCy + 20}
          x2={cx + 10}
          y2={headCy + 20}
          stroke="#0E0E10"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    }
    if (n === 3) {
      return (
        <path
          d={`M ${cx - 14} ${headCy + 22} q 4 -6 8 0 q 4 6 8 0 q 4 -6 8 0`}
          transform={`translate(-15 0)`}
          stroke="#0E0E10"
          strokeWidth="2.8"
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    if (n === 4) {
      return (
        <>
          <ellipse cx={cx} cy={headCy + 22} rx="9" ry="6" fill="#0E0E10" />
          <path
            d={`M ${cx - 9} ${headCy + 22} Q ${cx} ${headCy + 28} ${cx + 9} ${headCy + 22}`}
            fill="#FF8AB8"
          />
        </>
      );
    }
    return (
      <path
        d={`M ${cx - 8} ${headCy + 24} q 2 -2 4 0 q 2 2 4 0 q 2 -2 4 0`}
        stroke="#0E0E10"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  // arm pendulum
  const armLen = 60;
  const armBaseY = headCy - 8;
  const Larm = {
    x1: cx - headR + 8,
    y1: armBaseY,
    x2: cx - headR + 8 - 18 + sway,
    y2: armBaseY + armLen + sway / 2,
  };
  const Rarm = {
    x1: cx + headR - 8,
    y1: armBaseY,
    x2: cx + headR - 8 + 18 + swayR,
    y2: armBaseY + armLen + swayR / 2,
  };

  return (
    <svg
      ref={ref}
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        display: "block",
        cursor: "ns-resize",
        userSelect: "none",
        touchAction: "none",
        maxWidth: 240,
      }}
      role="slider"
      aria-label="Niveau d'activation"
      aria-valuemin={1}
      aria-valuemax={5}
      aria-valuenow={lvl}
    >
      <defs>
        <clipPath id="thermo-tube-clip">
          <rect
            x={cx - tubeW / 2 + 2}
            y={tubeTop + 2}
            width={tubeW - 4}
            height={tubeH - 4}
            rx={(tubeW - 4) / 2}
          />
        </clipPath>
      </defs>

      {/* antenna */}
      <line
        x1={cx}
        y1={tubeTop}
        x2={cx + antennaShake}
        y2={tubeTop - 28}
        stroke="#0E0E10"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle
        cx={cx + antennaShake}
        cy={tubeTop - 32}
        r="7"
        fill={mercuryColor}
        stroke="#0E0E10"
        strokeWidth="2.5"
      />
      <circle cx={cx + antennaShake + 1} cy={tubeTop - 32} r="2.5" fill="#0E0E10" />

      {/* tube */}
      <rect
        x={cx - tubeW / 2}
        y={tubeTop}
        width={tubeW}
        height={tubeH}
        rx={tubeW / 2}
        fill="white"
        stroke="#0E0E10"
        strokeWidth="3.5"
      />

      {/* ticks 1..5 */}
      {([1, 2, 3, 4, 5] as const).map((t) => {
        const y = tubeBot - (t / 5) * tubeH;
        const on = lvl === t;
        return (
          <g
            key={t}
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onPick(t);
            }}
          >
            <rect
              x={cx - tubeW / 2 - 40}
              y={y - 14}
              width="28"
              height="28"
              rx="14"
              fill={on ? "#0E0E10" : "white"}
              stroke="#0E0E10"
              strokeWidth="2.5"
            />
            <text
              x={cx - tubeW / 2 - 26}
              y={y + 6}
              textAnchor="middle"
              fontFamily="Archivo Black, sans-serif"
              fontSize="16"
              fill={on ? "white" : "#0E0E10"}
            >
              {t}
            </text>
            <line
              x1={cx + tubeW / 2 + 4}
              y1={y}
              x2={cx + tubeW / 2 + 16}
              y2={y}
              stroke="#0E0E10"
              strokeWidth={on ? 5 : 3}
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* mercury */}
      <g clipPath="url(#thermo-tube-clip)">
        <path d={meniscus} fill={mercuryColor} style={{ transition: "fill .4s ease" }} />
        <rect
          x={cx - tubeW / 2 + 6}
          y={fillTop + 4}
          width="6"
          height={tubeBot - fillTop - 8}
          rx="3"
          fill="white"
          opacity="0.28"
        />
        {bubbles.map((b, i) => (
          <circle key={`bub-${i}`} cx={b.x} cy={b.y} r={b.r} fill="white" opacity="0.65" />
        ))}
      </g>

      {/* arms */}
      <line
        x1={Larm.x1}
        y1={Larm.y1}
        x2={Larm.x2}
        y2={Larm.y2}
        stroke={limbColor}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line
        x1={Rarm.x1}
        y1={Rarm.y1}
        x2={Rarm.x2}
        y2={Rarm.y2}
        stroke={limbColor}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx={Larm.x2} cy={Larm.y2} r="10" fill="white" stroke="#0E0E10" strokeWidth="3" />
      <circle cx={Rarm.x2} cy={Rarm.y2} r="10" fill="white" stroke="#0E0E10" strokeWidth="3" />

      {/* head */}
      <g transform={`translate(${cx} ${headCy}) scale(${breath}) translate(${-cx} ${-headCy})`}>
        <circle cx={cx} cy={headCy} r={headR} fill="#FAF7F2" stroke="#0E0E10" strokeWidth="3.5" />
        <ellipse
          cx={cx - 26}
          cy={headCy + 14}
          rx="9"
          ry="6"
          fill={mercuryColor}
          opacity="0.35"
          style={{ transition: "fill .4s ease" }}
        />
        <ellipse
          cx={cx + 26}
          cy={headCy + 14}
          rx="9"
          ry="6"
          fill={mercuryColor}
          opacity="0.35"
          style={{ transition: "fill .4s ease" }}
        />
        {eyesByLevel(lvl)}
        {mouthByLevel(lvl)}
        <ellipse cx={cx - 22} cy={headCy + headR - 2} rx="14" ry="6" fill="#0E0E10" />
        <ellipse cx={cx + 22} cy={headCy + headR - 2} rx="14" ry="6" fill="#0E0E10" />
      </g>
    </svg>
  );
}
