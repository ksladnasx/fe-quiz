import type { Question, QuestionType, Difficulty } from '../types'
import { questions } from '../data'
import { useStudyStore } from '../store/useStudyStore'

export type StatusFilter = 'all' | 'undone' | 'correct' | 'wrong' | 'pending'

export interface PracticeFilters {
  category?: string
  sub?: string
  type?: QuestionType | ''
  diff?: Difficulty | ''
  status?: StatusFilter
  search?: string
  /** 起始题目 id */
  start?: string
  /** 顺序：seq 顺序 / random 随机 */
  order?: 'seq' | 'random'
}

export function filterQuestions(f: PracticeFilters): Question[] {
  const records = useStudyStore.getState().records
  const search = f.search?.trim().toLowerCase() ?? ''
  return questions.filter((q) => {
    if (f.category && q.category !== f.category) return false
    if (f.sub && q.subCategory !== f.sub) return false
    if (f.type && q.type !== f.type) return false
    if (f.diff && q.difficulty !== f.diff) return false
    if (f.status && f.status !== 'all') {
      const rec = records[q.id]
      const grading = rec?.grading
      if (f.status === 'undone' && grading) return false
      if (f.status === 'correct' && grading !== 'correct') return false
      if (f.status === 'wrong' && grading !== 'wrong') return false
      if (f.status === 'pending' && grading !== 'pending') return false
    }
    if (search) {
      const hay = `${q.question} ${q.analysis ?? ''} ${q.keyPoints?.join(' ') ?? ''}`.toLowerCase()
      if (!hay.includes(search)) return false
    }
    return true
  })
}

/** 从 URL search params 解析筛选条件 */
export function parseFilters(sp: URLSearchParams): PracticeFilters {
  return {
    category: sp.get('cat') || undefined,
    sub: sp.get('sub') || undefined,
    type: (sp.get('type') as QuestionType | null) || '',
    diff: (sp.get('diff') as Difficulty | null) || '',
    status: (sp.get('status') as StatusFilter | null) || 'all',
    search: sp.get('q') || '',
    start: sp.get('start') || undefined,
    order: sp.get('order') === 'random' ? 'random' : 'seq',
  }
}

/** 筛选条件序列化为 query（用于跳转刷题页） */
export function filtersToQuery(f: PracticeFilters): string {
  const sp = new URLSearchParams()
  if (f.category) sp.set('cat', f.category)
  if (f.sub) sp.set('sub', f.sub)
  if (f.type) sp.set('type', f.type)
  if (f.diff) sp.set('diff', f.diff)
  if (f.status && f.status !== 'all') sp.set('status', f.status)
  if (f.search) sp.set('q', f.search)
  if (f.order === 'random') sp.set('order', 'random')
  if (f.start) sp.set('start', f.start)
  return sp.toString()
}
