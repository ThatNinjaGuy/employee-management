import { ReactNode } from "react";
import Link from "next/link";
import { styles } from "@/styles/components/card.styles";

interface CardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  accentColor: string;
}

export function Card({
  href,
  icon,
  title,
  description,
  accentColor,
}: CardProps) {
  return (
    <Link href={href} className={styles.link}>
      <div className={styles.container}>
        <div className={styles.iconContainer(accentColor)}>
          {icon}
          <div className={styles.iconGlow(accentColor).style.backgroundColor} />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
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
      </div>
    </Link>
  );
}
