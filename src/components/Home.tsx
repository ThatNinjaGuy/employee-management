import { theme } from "@/theme/colors";
import { Card } from "./common/Card";
import { styles } from "@/styles/components/home.styles";

const DASHBOARD_CARDS = [
  {
    href: "/employees",
    icon: (
      <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
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
      </div>
    ),
    title: "Employee Management",
    description:
      "View and manage employee information, profiles, and details. Keep track of all employee records in one place.",
    accentColor: theme.colors.accent.main,
  },
  {
    href: "/attendance",
    icon: (
      <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
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
      </div>
    ),
    title: "Attendance Management",
    description:
      "Track and manage employee attendance and time records. Monitor attendance patterns and generate reports.",
    accentColor: theme.colors.accent.light,
  },
  {
    href: "/payroll",
    icon: (
      <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    ),
    title: "Payroll Management",
    description:
      "Manage employee salaries, deductions, and generate monthly payroll reports with customizable components.",
    accentColor: theme.colors.accent.light,
  },
];

export function Home() {
  return (
    <div className={styles.wrapper}>
      {/* Background Elements */}
      <div className={styles.decorativeLines} />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-darkest/50 to-transparent" />

      {/* Decorative Circles */}
      <div
        {...styles.decorativeCircle(theme.colors.accent.main)}
        style={{
          top: "-10%",
          left: "-20%",
          ...styles.decorativeCircle(theme.colors.accent.main).style,
        }}
      />
      <div
        {...styles.decorativeCircle(theme.colors.accent.light)}
        style={{
          bottom: "-20%",
          right: "-10%",
          ...styles.decorativeCircle(theme.colors.accent.light).style,
        }}
      />

      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.headerSection}>
          <div className={styles.headerBackground} />
          <div className={styles.headerGlow} />
          <div className={styles.headerContent}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Employee Management System
            </h1>
          </div>
        </header>

        {/* Cards Grid */}
        <div className={styles.grid}>
          {DASHBOARD_CARDS.map((card, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-accent-main/20 to-accent-light/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card
                href={card.href}
                icon={card.icon}
                title={card.title}
                description={card.description}
                accentColor={card.accentColor}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
