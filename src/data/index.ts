import type { Question, QuestionOption, RawQuestion } from '../types'
import { categories, categoryMap } from './categories'
import { htmlCssQuestions } from './questions/html-css'
import { javascriptQuestions } from './questions/javascript'
import { browserQuestions } from './questions/browser'
import { networkQuestions } from './questions/network'
import { vueQuestions } from './questions/vue'
import { reactQuestions } from './questions/react'
import { performanceQuestions } from './questions/performance'
import { engineeringQuestions } from './questions/engineering'
import { algorithmQuestions } from './questions/algorithm'
import { scenarioQuestions } from './questions/scenario'
import { projectQuestions } from './questions/project'

const rawBanks: Record<string, RawQuestion[]> = {
  'html-css': htmlCssQuestions,
  javascript: javascriptQuestions,
  browser: browserQuestions,
  network: networkQuestions,
  vue: vueQuestions,
  react: reactQuestions,
  performance: performanceQuestions,
  engineering: engineeringQuestions,
  algorithm: algorithmQuestions,
  scenario: scenarioQuestions,
  project: projectQuestions,
}

const OPTION_LABELS = 'ABCDEFGH'

function normalize(raw: RawQuestion, category: string): Question {
  const options: QuestionOption[] | undefined = raw.opts?.map((text, i) => ({
    label: OPTION_LABELS[i],
    text,
  }))

  let answer: string | string[] | boolean
  if (raw.type === 'single') {
    answer = raw.ans as string
  } else if (raw.type === 'multiple') {
    answer = (raw.ans as string[]).slice().sort()
  } else if (raw.type === 'judge') {
    answer = raw.ans as boolean
  } else {
    answer = raw.ans as string
  }

  return {
    id: raw.id,
    category,
    subCategory: raw.sub,
    type: raw.type,
    difficulty: raw.diff,
    question: raw.q,
    options,
    answer,
    analysis: raw.ana,
    keyPoints: raw.keys,
    source: raw.src,
  }
}

/** 全量题库（按数据文件顺序稳定排列） */
export const questions: Question[] = Object.entries(rawBanks).flatMap(
  ([category, raws]) => raws.map((raw) => normalize(raw, category)),
)

export const questionMap: Record<string, Question> = Object.fromEntries(
  questions.map((q) => [q.id, q]),
)

/** 分类 id -> 该分类题目列表 */
export const questionsByCategory: Record<string, Question[]> = (() => {
  const map: Record<string, Question[]> = {}
  for (const c of categories) map[c.id] = []
  for (const q of questions) {
    if (!map[q.category]) map[q.category] = []
    map[q.category].push(q)
  }
  return map
})()

/** 分类 id -> 二级分类名列表（按首次出现顺序） */
export const subCategoriesByCategory: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {}
  for (const q of questions) {
    if (!q.subCategory) continue
    const list = (map[q.category] ??= [])
    if (!list.includes(q.subCategory)) list.push(q.subCategory)
  }
  return map
})()

/** 题目 id -> 二级分类名 */
export const subCategoryOf: Record<string, string> = Object.fromEntries(
  questions.map((q) => [q.id, q.subCategory ?? '']),
)

export function getQuestionsByIds(ids: string[]): Question[] {
  return ids.map((id) => questionMap[id]).filter(Boolean)
}

/** 洗牌（Fisher-Yates） */
export function shuffle<T>(arr: T[]): T[] {
  const result = arr.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export { categories, categoryMap }
