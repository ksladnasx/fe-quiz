import {
  Atom,
  Binary,
  BookMarked,
  Braces,
  Briefcase,
  Database,
  Globe,
  Leaf,
  Network,
  Palette,
  Puzzle,
  Rocket,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

/** 分类 id -> Lucide 图标 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'html-css': Palette,
  javascript: Braces,
  browser: Globe,
  network: Network,
  vue: Leaf,
  react: Atom,
  performance: Rocket,
  engineering: Wrench,
  algorithm: Binary,
  scenario: Puzzle,
  project: Briefcase,
  database: Database,
}

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICONS[category] ?? BookMarked
}

export function CategoryIcon({
  category,
  size = 14,
  strokeWidth = 2,
}: {
  category: string
  size?: number
  strokeWidth?: number
}) {
  const Icon = getCategoryIcon(category)
  return <Icon size={size} strokeWidth={strokeWidth} />
}
