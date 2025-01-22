export const spacing = {
  container: {
    padding: "p-8",
    maxWidth: "max-w-4xl",
  },
  margin: {
    small: "mb-4",
    medium: "mb-6",
    large: "mb-8",
    left: {
      small: "ml-4",
      large: "ml-16",
    },
  },
  gap: {
    small: "gap-4",
    medium: "gap-6",
  },
  padding: {
    card: "p-8",
    container: "p-4",
  },
} as const;

export const sizes = {
  icon: {
    container: "w-12 h-12",
    default: "w-6 h-6",
  },
  text: {
    h1: "text-4xl",
    h2: "text-2xl",
    body: "text-base",
  },
  borderRadius: {
    full: "rounded-full",
    large: "rounded-xl",
    medium: "rounded-lg",
  },
} as const;

export const grid = {
  cols: {
    mobile: "grid-cols-1",
    tablet: "md:grid-cols-2",
  },
} as const;

export const animation = {
  transition: {
    transform: "transform transition-all duration-300",
    scale: "hover:scale-105",
  },
} as const;
