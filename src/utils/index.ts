import type { Question, GradingStatus } from '../types'

const STORAGE_PREFIX = 'fequiz'

export const LS_KEYS = {
  records: `${STORAGE_PREFIX}.records.v1`,
  favorites: `${STORAGE_PREFIX}.favorites.v1`,
  dismissed: `${STORAGE_PREFIX}.wrong-dismissed.v1`,
  history: `${STORAGE_PREFIX}.history.v1`,
  interview: `${STORAGE_PREFIX}.interview-reports.v1`,
  paper: `${STORAGE_PREFIX}.practice-session.v1`,
} as const

export function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeLS(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 存储满或隐私模式下静默失败，不影响答题
  }
}

/** 将用户答案规范化为可比较的字符串 */
export function normalizeAnswer(value: unknown): string {
  if (Array.isArray(value)) return [...value].sort().join(',')
  return String(value)
}

/** 比较用户答案与正确答案（仅客观题） */
export function checkAnswer(q: Question, userAnswer: string | string[] | null): boolean {
  if (userAnswer == null) return false
  if (q.type === 'judge') {
    return normalizeAnswer(userAnswer) === String(q.answer)
  }
  if (q.type === 'single') {
    return normalizeAnswer(userAnswer) === String(q.answer)
  }
  if (q.type === 'multiple') {
    const expected = normalizeAnswer(q.answer)
    return normalizeAnswer(userAnswer) === expected
  }
  return false
}

/**
 * 生成作答判定：
 * 客观题自动判分；essay/code 提交后为 pending，等用户自评。
 */
export function gradeAnswer(
  q: Question,
  userAnswer: string | string[] | null,
): GradingStatus {
  if (q.type === 'essay' || q.type === 'code') return 'pending'
  return checkAnswer(q, userAnswer) ? 'correct' : 'wrong'
}

export function formatTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m === 0) return `${s} 秒`
  return `${m} 分 ${s} 秒`
}

export function percent(part: number, total: number): number {
  if (!total) return 0
  return Math.round((part / total) * 100)
}
