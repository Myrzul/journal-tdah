type MonsterProps = {
  color: string;
};

type Variant = "blob" | "pear" | "round" | "egg";

const bodyPaths: Record<Variant, string> = {
  blob: "M60 10 C32 10 16 30 18 56 C20 84 36 112 60 112 C84 112 100 84 102 56 C104 30 88 10 60 10 Z",
  pear: "M60 10 C40 10 28 26 28 44 C28 56 22 64 22 76 C22 96 38 112 60 112 C82 112 98 96 98 76 C98 64 92 56 92 44 C92 26 80 10 60 10 Z",
  round: "M60 8 C30 8 14 32 14 60 C14 88 30 112 60 112 C90 112 106 88 106 60 C106 32 90 8 60 8 Z",
  egg: "M60 8 C36 8 22 30 22 56 C22 86 38 112 60 112 C82 112 98 86 98 56 C98 30 84 8 60 8 Z",
};

const Body = ({ color, variant }: { color: string; variant: Variant }) => (
  <path d={bodyPaths[variant]} fill={color} />
);

const Antenna = ({ color, x = 60, y = 12 }: { color: string; x?: number; y?: number }) => (
  <g>
    <line x1={x} y1={y} x2={x} y2={y - 12} stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    <circle cx={x} cy={y - 14} r="4" fill={color} />
  </g>
);

const Cheeks = ({ y = 70 }: { y?: number }) => (
  <>
    <ellipse cx="28" cy={y} rx="9" ry="5" fill="#FFB3C7" opacity="0.7" />
    <ellipse cx="92" cy={y} rx="9" ry="5" fill="#FFB3C7" opacity="0.7" />
  </>
);

const SvgFrame = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", width: "100%", height: "100%" }}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const MonsterCurieux = ({ color }: MonsterProps) => (
  <SvgFrame>
    <Antenna color={color} />
    <Body color={color} variant="blob" />
    <path
      d="M16 56 Q8 46 12 36"
      stroke={color}
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M104 56 Q112 46 108 36"
      stroke={color}
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="46" cy="56" r="8" fill="white" />
    <circle cx="74" cy="56" r="8" fill="white" />
    <circle cx="48" cy="58" r="3.5" fill="#0E0E10" />
    <circle cx="76" cy="58" r="3.5" fill="#0E0E10" />
    <ellipse cx="60" cy="80" rx="6" ry="7" fill="#0E0E10" />
    <ellipse cx="60" cy="78" rx="3" ry="3" fill="#FF8AB8" />
    <Cheeks />
  </SvgFrame>
);

export const MonsterCalme = ({ color }: MonsterProps) => (
  <SvgFrame>
    <Body color={color} variant="round" />
    <path
      d="M40 56 Q46 50 52 56"
      stroke="#0E0E10"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M68 56 Q74 50 80 56"
      stroke="#0E0E10"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M44 78 Q60 90 76 78"
      stroke="#0E0E10"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <Cheeks y={74} />
  </SvgFrame>
);

export const MonsterReflexif = ({ color }: MonsterProps) => (
  <SvgFrame>
    <Body color={color} variant="pear" />
    <circle cx="22" cy="32" r="6" fill="white" stroke="#0E0E10" strokeWidth="2" />
    <circle cx="14" cy="42" r="3.5" fill="white" stroke="#0E0E10" strokeWidth="2" />
    <circle cx="46" cy="56" r="6" fill="white" />
    <circle cx="74" cy="56" r="6" fill="white" />
    <circle cx="48" cy="54" r="2.8" fill="#0E0E10" />
    <circle cx="76" cy="54" r="2.8" fill="#0E0E10" />
    <line x1="50" y1="78" x2="70" y2="78" stroke="#0E0E10" strokeWidth="3" strokeLinecap="round" />
    <Cheeks y={72} />
  </SvgFrame>
);

export const MonsterFier = ({ color }: MonsterProps) => (
  <SvgFrame>
    <Antenna color={color} />
    <circle cx="60" cy="-2" r="6" fill="#F0B340" />
    <Body color={color} variant="round" />
    <path
      d="M14 50 Q4 38 10 24"
      stroke={color}
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M106 50 Q116 38 110 24"
      stroke={color}
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M40 58 L48 50 L52 58"
      stroke="#0E0E10"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M68 58 L76 50 L80 58"
      stroke="#0E0E10"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M40 76 Q60 96 80 76"
      stroke="#0E0E10"
      strokeWidth="4"
      fill="#0E0E10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M44 80 Q60 86 76 80" stroke="white" strokeWidth="2.5" fill="none" />
    <Cheeks y={78} />
  </SvgFrame>
);

export const MonsterSurprise = ({ color }: MonsterProps) => (
  <SvgFrame>
    <Antenna color={color} />
    <Body color={color} variant="egg" />
    <circle cx="44" cy="54" r="11" fill="white" />
    <circle cx="76" cy="54" r="11" fill="white" />
    <circle cx="44" cy="55" r="4.5" fill="#0E0E10" />
    <circle cx="76" cy="55" r="4.5" fill="#0E0E10" />
    <circle cx="46" cy="52" r="1.5" fill="white" />
    <circle cx="78" cy="52" r="1.5" fill="white" />
    <ellipse cx="60" cy="84" rx="7" ry="9" fill="#0E0E10" />
  </SvgFrame>
);

export const MonsterEnergique = ({ color }: MonsterProps) => (
  <SvgFrame>
    <Body color={color} variant="blob" />
    <path
      d="M60 12 L54 22 L62 22 L56 32 L66 18 L58 18 L62 8 Z"
      fill="#F0B340"
      stroke="#0E0E10"
      strokeWidth="1"
    />
    <path
      d="M14 46 Q4 56 10 70"
      stroke={color}
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M106 46 Q116 56 110 70"
      stroke={color}
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M46 50 L48 56 L54 56 L49 60 L51 66 L46 62 L41 66 L43 60 L38 56 L44 56 Z"
      fill="#0E0E10"
    />
    <path
      d="M74 50 L76 56 L82 56 L77 60 L79 66 L74 62 L69 66 L71 60 L66 56 L72 56 Z"
      fill="#0E0E10"
    />
    <path
      d="M42 78 Q60 96 78 78"
      stroke="#0E0E10"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <Cheeks y={76} />
  </SvgFrame>
);

export const MonsterInquiet = ({ color }: MonsterProps) => (
  <SvgFrame>
    <Body color={color} variant="pear" />
    <line x1="36" y1="46" x2="52" y2="50" stroke="#0E0E10" strokeWidth="3" strokeLinecap="round" />
    <line x1="84" y1="46" x2="68" y2="50" stroke="#0E0E10" strokeWidth="3" strokeLinecap="round" />
    <circle cx="46" cy="58" r="6" fill="white" />
    <circle cx="74" cy="58" r="6" fill="white" />
    <circle cx="46" cy="60" r="2.8" fill="#0E0E10" />
    <circle cx="74" cy="60" r="2.8" fill="#0E0E10" />
    <path
      d="M44 80 Q50 76 56 80 Q62 84 68 80 Q74 76 78 80"
      stroke="#0E0E10"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  </SvgFrame>
);

export const MonsterEndormi = ({ color }: MonsterProps) => (
  <SvgFrame>
    <Body color={color} variant="round" />
    <path
      d="M40 58 Q46 64 52 58"
      stroke="#0E0E10"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M68 58 Q74 64 80 58"
      stroke="#0E0E10"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="60" cy="82" rx="5" ry="3" fill="#0E0E10" />
    <text x="84" y="34" fontFamily="Archivo Black, sans-serif" fontSize="18" fill={color}>
      z
    </text>
    <text x="92" y="22" fontFamily="Archivo Black, sans-serif" fontSize="22" fill={color}>
      z
    </text>
  </SvgFrame>
);

export const Monsters = {
  Curieux: MonsterCurieux,
  Calme: MonsterCalme,
  Reflexif: MonsterReflexif,
  Fier: MonsterFier,
  Surprise: MonsterSurprise,
  Energique: MonsterEnergique,
  Inquiet: MonsterInquiet,
  Endormi: MonsterEndormi,
} as const;

export type MonsterName = keyof typeof Monsters;
export type MonsterComponent = (typeof Monsters)[MonsterName];

/* =================================================================
   PARAPLUIE — signature graphique de l'app
   ================================================================= */
type UmbrellaProps = {
  color?: string;
  number?: string | number;
  size?: number;
};

export const Umbrella = ({ color = "#1B4FE5", number, size = 80 }: UmbrellaProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block" }}
    aria-hidden="true"
  >
    <path
      d="M60 18 C32 18 14 42 12 62 L108 62 C106 42 88 18 60 18 Z"
      fill="#0E0E10"
    />
    <path
      d="M12 62 Q24 56 36 62 Q48 68 60 62 Q72 56 84 62 Q96 68 108 62"
      fill="#0E0E10"
    />
    <path
      d="M12 62 Q24 56 36 62 Q48 68 60 62 Q72 56 84 62 Q96 68 108 62"
      stroke="#0E0E10"
      strokeWidth="3"
      fill="none"
    />
    <path
      d="M60 18 L36 62 M60 18 L84 62 M60 18 L60 62"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="1.5"
    />
    <path
      d="M60 18 L60 92 C60 100 54 106 46 106"
      stroke={color}
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
    {number !== undefined && (
      <>
        <circle cx="60" cy="42" r="14" fill="white" />
        <text
          x="60"
          y="48"
          textAnchor="middle"
          fontFamily="Archivo Black, sans-serif"
          fontSize="16"
          fill="#0E0E10"
        >
          {number}
        </text>
      </>
    )}
  </svg>
);
