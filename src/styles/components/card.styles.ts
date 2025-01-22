import { animation, sizes, spacing } from "@/theme/constants";

export const styles = {
  link: `${animation.transition.transform} ${animation.transition.scale}`,

  container: `${spacing.padding.card} ${sizes.borderRadius.large} bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20`,

  header: `flex items-center ${spacing.margin.small}`,

  iconContainer: (color: string) =>
    `${sizes.icon.container} ${sizes.borderRadius.full} bg-[${color}] flex items-center justify-center`,

  title: `${sizes.text.h2} font-semibold text-white ${spacing.margin.left.small}`,

  description: `text-gray-200 ${spacing.margin.left.large}`,
} as const;
