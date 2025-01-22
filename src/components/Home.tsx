import { theme } from "@/theme/colors";
import { Card } from "./common/Card";
import { styles } from "@/styles/components/home.styles";

const DASHBOARD_CARDS = [
  {
    href: "/employees",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    title: "Employee Management",
    description:
      "View and manage employee information, profiles, and details. Keep track of all employee records in one place.",
    accentColor: theme.colors.accent.main,
  },
  {
    href: "/attendance",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Attendance Management",
    description:
      "Track and manage employee attendance and time records. Monitor attendance patterns and generate reports.",
    accentColor: theme.colors.accent.light,
  },
];

export function Home() {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.decorativeCircle(theme.colors.accent.main)}
        style={{ top: "10%", left: "-5%" }}
      />
      <div
        className={styles.decorativeCircle(theme.colors.accent.light)}
        style={{ bottom: "10%", right: "-5%" }}
      />

      <div className={styles.container}>
        <div className={styles.headerSection}>
          <div className={styles.headerBackground} />
          <h1 className={styles.header}>Employee Management System</h1>
        </div>

        <div className={styles.grid}>
          {DASHBOARD_CARDS.map((card, index) => (
            <Card
              key={index}
              href={card.href}
              icon={card.icon}
              title={card.title}
              description={card.description}
              accentColor={card.accentColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
