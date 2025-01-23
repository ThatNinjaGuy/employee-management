import { ReactNode } from "react";
import Link from "next/link";
import { styles } from "@/styles/components/card.styles";
import { Employee } from "@/types";

interface CardState {
  employees: Employee[];
  onUpdateEmployee: (employee: Employee) => void;
}

interface CardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
  state?: CardState;
  className?: string;
  children?: ReactNode;
}

export function Card({
  href,
  icon,
  title,
  description,
  accentColor = "",
  state,
  className,
  children,
}: CardProps) {
  const encodedState = state ? encodeURIComponent(JSON.stringify(state)) : "";
  const finalHref = state ? `${href}?state=${encodedState}` : href;

  const content = (
    <div className={`${styles.container} ${className || ""}`}>
      {children || (
        <>
          {icon && (
            <div className={styles.iconContainer(accentColor)}>
              {icon}
              <div
                className={styles.iconGlow(accentColor).style.backgroundColor}
              />
            </div>
          )}
          <div className={styles.content}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <div className={styles.arrow}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );

  return <Link href={finalHref}>{content}</Link>;
}
