export const styles = {
  link: "block w-full transition-transform duration-300 hover:-translate-y-1",

  container: `
    relative
    flex items-center gap-6
    p-6 sm:p-8
    bg-white/10 hover:bg-white/[0.15]
    backdrop-blur-md
    rounded-2xl
    border border-white/10
    transition-colors duration-300
  `,

  iconContainer: (color: string) => `
    relative
    flex items-center justify-center
    w-14 h-14
    rounded-xl
    bg-${color}
    border border-white/10
    overflow-hidden
  `,

  iconGlow: (color: string) => ({
    className: "absolute inset-0 blur-md opacity-40",
    style: { backgroundColor: color },
  }),

  content: "flex-1 min-w-0",

  title: "text-xl font-semibold text-white mb-1 truncate",

  description: "text-white/70 text-sm line-clamp-2",

  arrow: `
    text-white/30 
    group-hover:text-white 
    group-hover:translate-x-1
    transition-all duration-300
  `,
} as const;
