"use client";

import Link from "next/link";

type CommonProps = {
  label: string;
  sub?: string;
  color: string;
  selected?: boolean;
  large?: boolean;
};

type ButtonProps = CommonProps & {
  onClick: () => void;
  href?: undefined;
};

type LinkProps = CommonProps & {
  href: string;
  onClick?: undefined;
};

type Props = ButtonProps | LinkProps;

const baseStyle = (
  selected: boolean,
  large: boolean,
  color: string,
): React.CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 4,
  padding: large ? "18px 16px" : "14px 14px",
  background: selected ? color : "#FAF7F2",
  color: "#0E0E10",
  border: "2.4px solid #0E0E10",
  borderRadius: 14,
  boxShadow: selected ? "2px 2px 0 #0E0E10" : "4px 4px 0 #0E0E10",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "var(--font-cond)",
  fontWeight: 800,
  transform: selected ? "translate(2px, 2px)" : "none",
  transition: "transform .12s, box-shadow .12s",
  width: "100%",
  textDecoration: "none",
});

export function EmotionsPickCard(props: Props) {
  const { label, sub, color, selected = false, large = false } = props;
  const style = baseStyle(selected, large, color);

  const inner = (
    <>
      <span
        style={{
          fontSize: large ? 17 : 15,
          letterSpacing: ".04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      {sub && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--ink-2)",
            textTransform: "none",
            letterSpacing: 0,
          }}
        >
          {sub}
        </span>
      )}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={props.onClick} style={style}>
      {inner}
    </button>
  );
}
