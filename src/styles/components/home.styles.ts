import { theme } from "@/theme/colors";
import { spacing, sizes, grid } from "@/theme/constants";

export const styles = {
  wrapper: `min-h-screen bg-gradient-to-br from-[${theme.colors.primary.darkest}] via-[${theme.colors.primary.dark}] to-[${theme.colors.primary.main}]`,

  container: `container mx-auto ${spacing.container.padding} relative`,

  headerSection: `text-center mb-16 relative`,

  headerBackground: `absolute inset-0 bg-[${theme.colors.primary.darkest}] opacity-20 blur-xl rounded-3xl`,

  header: `${sizes.text.h1} ${spacing.padding.container} font-bold text-white relative`,

  grid: `grid ${grid.cols.mobile} ${grid.cols.tablet} ${spacing.gap.medium} ${spacing.container.maxWidth} mx-auto relative`,

  decorativeCircle: (color: string) =>
    `absolute w-64 h-64 rounded-full bg-[${color}] opacity-10 blur-3xl`,

  icon: `${sizes.icon.default} text-[${theme.colors.primary.darkest}]`,
} as const;
