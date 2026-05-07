import type { ReactNode } from "react";
import type { IconProps } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

type CardProps = {
  icon?: React.ComponentType<IconProps>;
  iconColor?: string;
  title: string;
  sub?: string;
  children?: ReactNode;
  shadowed?: boolean;
};

export function Card({
  icon: Icon,
  iconColor = "var(--ink)",
  title,
  sub,
  children,
  shadowed = true,
}: CardProps) {
  return (
    <div className={cn("card", shadowed && "shadowed")}>
      <div className="card-head">
        {Icon && (
          <span className="ic">
            <Icon size={22} color={iconColor} />
          </span>
        )}
        <h3 className="card-title">{title}</h3>
      </div>
      {sub && <p className="card-sub">{sub}</p>}
      {children}
    </div>
  );
}

type CardColorProps = {
  ribbon?: string;
  title?: string;
  sub?: string;
  children?: ReactNode;
};

export function CardColor({ ribbon, title, sub, children }: CardColorProps) {
  return (
    <div className="card-color">
      {ribbon && <div className="ribbon">{ribbon}</div>}
      {title && <h3 className="card-title">{title}</h3>}
      {sub && <p className="card-sub">{sub}</p>}
      {children}
    </div>
  );
}
