import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function SectionLabel({ num, children }: { num?: ReactNode; children: ReactNode }) {
  return (
    <div className="section-label">
      {num != null && <span className="snum">{num}</span>}
      <span>{children}</span>
    </div>
  );
}

export function Headline({ children, accent }: { children: ReactNode; accent?: ReactNode }) {
  return (
    <h2 className="section-headline">
      {children}
      {accent && (
        <>
          {" "}
          <span className="accent">{accent}</span>
        </>
      )}
    </h2>
  );
}

export function HandNote({ children, right }: { children: ReactNode; right?: boolean }) {
  return <div className={cn("handnote", right && "right")}>{children}</div>;
}

export function IntroHand({ children }: { children: ReactNode }) {
  // Wrapper interne : sans ça, les text nodes / <br/> / <span> deviennent
  // chacun un flex item séparé et s'affichent en colonnes côte à côte.
  return (
    <div className="intro-hand">
      <div className="intro-hand-text">{children}</div>
    </div>
  );
}

export function HLQuote({ children }: { children: ReactNode }) {
  return (
    <div className="hl-quote">
      <div className="hl-quote-text">{children}</div>
    </div>
  );
}

export function Compare({ children }: { children: ReactNode }) {
  return <div className="compare-box">{children}</div>;
}

type RetainProps = {
  title: string;
  children: ReactNode;
  monster?: React.ComponentType<{ color: string }>;
};

export function Retain({ title, children, monster: Mascot }: RetainProps) {
  return (
    <div className="retain-block">
      <span className="retain-tab">À RETENIR</span>
      <h3>{title}</h3>
      <p>{children}</p>
      {Mascot && (
        <div className="retain-mascot">
          <Mascot color="#0E0E10" />
        </div>
      )}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="flabel">{children}</label>;
}

export function HintLink({ children }: { children: ReactNode }) {
  return (
    <a className="hint-link" href="#" onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
}
