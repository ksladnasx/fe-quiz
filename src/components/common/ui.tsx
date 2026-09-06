import { DIFFICULTY_LABEL, QUESTION_TYPE_LABEL, type Question } from '../../types'
import { categoryMap } from '../../data'

export function TypeBadge({ type }: { type: Question['type'] }) {
  return <span className="tag tag-type">{QUESTION_TYPE_LABEL[type]}</span>
}

export function DifficultyBadge({ difficulty }: { difficulty: Question['difficulty'] }) {
  return <span className={`tag tag-${difficulty}`}>{DIFFICULTY_LABEL[difficulty]}</span>
}

export function CategoryTag({ category, sub }: { category: string; sub?: string }) {
  const cat = categoryMap[category]
  return (
    <span className="tag tag-cat">
      {cat ? `${cat.icon} ${cat.name}` : category}
      {sub ? ` · ${sub}` : ''}
    </span>
  )
}

export function EmptyState({
  icon = '📭',
  title,
  desc,
  action,
}: {
  icon?: string
  title: string
  desc?: string
  action?: React.ReactNode
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {desc && <div style={{ fontSize: 13 }}>{desc}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  )
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

/** 答案状态的文案 + 颜色 */
export function StatusText({ grading }: { grading: 'correct' | 'wrong' | 'pending' | 'none' }) {
  if (grading === 'correct') return <span className="status-correct">✓ 已答对</span>
  if (grading === 'wrong') return <span className="status-wrong">✗ 已答错</span>
  if (grading === 'pending') return <span className="status-pending">● 待自评</span>
  return <span>未做过</span>
}
