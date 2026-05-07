"use client";

type DataPoint = {
  date: string; // YYYY-MM-DD
  value: number | null; // 1..5 or null = pas de donnée
};

type ScaleTrendProps = {
  label: string;
  data: DataPoint[];
  color?: string;
  /** Affiche la moyenne et la tendance dans le head */
  showMeta?: boolean;
};

export function ScaleTrend({
  label,
  data,
  color = "var(--ink)",
  showMeta = true,
}: ScaleTrendProps) {
  const W = 320;
  const H = 80;
  const PAD_X = 6;
  const PAD_Y = 8;

  const filled = data.filter((d): d is { date: string; value: number } => d.value !== null);
  const avg = filled.length > 0 ? filled.reduce((s, d) => s + d.value, 0) / filled.length : null;

  // tendance : compare moyenne 1ere moitié vs 2eme moitié
  let trend: "up" | "down" | "flat" = "flat";
  if (filled.length >= 6) {
    const mid = Math.floor(filled.length / 2);
    const first = filled.slice(0, mid);
    const second = filled.slice(mid);
    const a1 = first.reduce((s, d) => s + d.value, 0) / first.length;
    const a2 = second.reduce((s, d) => s + d.value, 0) / second.length;
    if (a2 - a1 > 0.3) trend = "up";
    else if (a1 - a2 > 0.3) trend = "down";
  }

  const stepX = (W - 2 * PAD_X) / Math.max(data.length - 1, 1);
  const yFor = (v: number) => H - PAD_Y - ((v - 1) / 4) * (H - 2 * PAD_Y);

  // path : segments entre points consécutifs non-null
  const segments: string[] = [];
  let currentSeg: string[] = [];
  data.forEach((d, i) => {
    if (d.value === null) {
      if (currentSeg.length > 0) segments.push(currentSeg.join(" "));
      currentSeg = [];
      return;
    }
    const x = PAD_X + i * stepX;
    const y = yFor(d.value);
    currentSeg.push(`${currentSeg.length === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  });
  if (currentSeg.length > 0) segments.push(currentSeg.join(" "));

  return (
    <div className="trend" aria-label={`Évolution ${label} sur ${data.length} jours`}>
      <div className="trend-head">
        <span>{label}</span>
        {showMeta && avg !== null && (
          <span className="trend-meta">
            moyenne {avg.toFixed(1)}/5{" "}
            <span
              className={
                trend === "up" ? "arrow-up" : trend === "down" ? "arrow-down" : "arrow-flat"
              }
            >
              {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
            </span>
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img">
        {/* lignes guides 1, 3, 5 */}
        {[1, 3, 5].map((v) => {
          const y = yFor(v);
          return (
            <line
              key={v}
              x1={PAD_X}
              x2={W - PAD_X}
              y1={y}
              y2={y}
              stroke="var(--divider)"
              strokeWidth={1}
              strokeDasharray={v === 3 ? "" : "2 3"}
            />
          );
        })}
        {/* moyenne */}
        {avg !== null && (
          <line
            x1={PAD_X}
            x2={W - PAD_X}
            y1={yFor(avg)}
            y2={yFor(avg)}
            stroke={color}
            strokeWidth={1}
            strokeDasharray="3 4"
            opacity={0.4}
          />
        )}
        {/* segments de la courbe */}
        {segments.map((seg, i) => (
          <path
            key={i}
            d={seg}
            fill="none"
            stroke={color}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {/* points */}
        {data.map((d, i) =>
          d.value === null ? null : (
            <circle key={d.date} cx={PAD_X + i * stepX} cy={yFor(d.value)} r={2.2} fill={color} />
          ),
        )}
      </svg>
    </div>
  );
}
