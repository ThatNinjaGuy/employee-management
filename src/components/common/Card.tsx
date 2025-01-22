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
        <div className={styles.header}>
          <div className={styles.iconContainer(accentColor)}>{icon}</div>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <p className={styles.description}>{description}</p>
      </div>
    </Link>
  );
}
