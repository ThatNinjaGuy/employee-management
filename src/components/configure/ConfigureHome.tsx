"use client";

import { theme } from "@/theme/colors";
import { Card } from "../common/Card";
import { styles } from "@/styles/components/home.styles";

const CONFIGURE_CARDS = [
  //   {
  //     href: "/configure/departments",
  //     icon: (
  //       <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           className={styles.icon}
  //           fill="none"
  //           viewBox="0 0 24 24"
  //           stroke="currentColor"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             strokeWidth={2}
  //             d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
  //           />
  //         </svg>
  //       </div>
  //     ),
  //     title: "Department Configuration",
  //     description:
  //       "Manage department settings, add new departments, or modify existing department structures.",
  //     accentColor: theme.colors.accent.main,
  //   },
  {
    href: "/configure/roles",
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
    ),
    title: "Role Configuration",
    description:
      "Manage role settings, add new roles, or modify existing role structures.",
    accentColor: theme.colors.accent.light,
  },
  {
    href: "/configure/suppliers",
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
    ),
    title: "Supplier Configuration",
    description:
      "Manage supplier list, add new suppliers, or modify existing supplier names.",
    accentColor: theme.colors.accent.light,
  },
  {
    href: "/configure/sites",
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
    ),
    title: "Site Configuration",
    description:
      "Manage construction sites, add new sites, or modify existing site details.",
    accentColor: theme.colors.accent.light,
  },
];

export function ConfigureHome() {
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
              System Configuration
            </h1>
          </div>
        </header>

        {/* Cards Grid */}
        <div className={styles.grid}>
          {CONFIGURE_CARDS.map((card, index) => (
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
