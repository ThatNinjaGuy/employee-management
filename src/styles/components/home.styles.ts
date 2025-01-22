export const styles = {
  wrapper:
    "min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main relative overflow-hidden",

  container: "container mx-auto px-4 sm:px-6 lg:px-8 relative z-10",

  headerSection: "relative mb-8 sm:mb-12",

  headerContent: `
    relative z-10 
    max-w-4xl mx-auto 
    py-12 sm:py-16
    px-4 sm:px-6 lg:px-8 
    text-center
  `,

  headerGlow: `
    absolute inset-0 
    bg-gradient-radial from-accent-main/20 via-transparent to-transparent 
    blur-2xl
  `,

  headerBackground: `
    absolute inset-x-0 -top-20 -bottom-20
    bg-gradient-to-b from-primary-darkest/50 to-transparent 
    backdrop-blur-xl rounded-[3rem]
  `,

  grid: `
    grid grid-cols-1 lg:grid-cols-2 
    gap-6 lg:gap-8
    max-w-6xl mx-auto 
    px-4 sm:px-6 lg:px-8
    relative
  `,

  decorativeCircle: (color: string) => ({
    className:
      "absolute w-[40rem] h-[40rem] rounded-full opacity-10 blur-[120px]",
    style: { backgroundColor: color },
  }),

  icon: `w-7 h-7 text-white`,

  decorativeLines: `
    absolute inset-0 
    bg-grid-white/[0.05] bg-[size:4rem_4rem]
    pointer-events-none
  `,
} as const;
