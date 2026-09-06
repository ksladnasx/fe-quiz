/** 题型 */
export type QuestionType = 'single' | 'multiple' | 'judge' | 'essay' | 'code'

/** 难度 */
export type Difficulty = 'easy' | 'medium' | 'hard'

/** 答题判定状态：correct / wrong；essay、code 提交后需自评，未自评为 pending */
export type GradingStatus = 'correct' | 'wrong' | 'pending'

export interface Category {
  id: string
  name: string
  color: string
  description: string
  /** docs 来源文档 */
  sources: string[]
}

/**
 * 数据文件中的题目原始形态（紧凑书写），
 * 由 data/index.ts 归一化为 Question。
 */
export interface RawQuestion {
  id: string
  /** 题干（Markdown） */
  q: string
  type: QuestionType
  diff: Difficulty
  /** 二级分类，如「异步编程」 */
  sub?: string
  /** 选择题选项，自动编号 A/B/C/D */
  opts?: string[]
  /**
   * 答案：
   * single -> 'A'；multiple -> ['A','C']；judge -> boolean；
   * essay/code -> 参考答案（Markdown）
   */
  ans: string | string[] | boolean
  /** 解析（Markdown） */
  ana?: string
  /** 核心关键词 / 面试要点 */
  keys?: string[]
  /** 来源文档 */
  src?: string
}

export interface QuestionOption {
  label: string
  text: string
}

export interface Question {
  id: string
  category: string
  subCategory?: string
  type: QuestionType
  difficulty: Difficulty
  question: string
  options?: QuestionOption[]
  answer: string | string[] | boolean
  analysis?: string
  keyPoints?: string[]
  source?: string
}

/** 单题作答记录（localStorage 持久化） */
export interface AnswerRecord {
  questionId: string
  /** essay / code 未自评时为 null */
  grading: GradingStatus
  userAnswer: string | string[] | null
  /** 最后一次答题时间戳 */
  answeredAt: number
  /** 累计作答次数 */
  attempts: number
}

/** 最近做题日志条目 */
export interface HistoryEntry {
  questionId: string
  time: number
  grading: GradingStatus
}

/** 面试模式一场结果 */
export interface InterviewReport {
  id: string
  time: number
  questionIds: string[]
  /** 每题判定：与 questionIds 对齐 */
  gradings: (GradingStatus | null)[]
  score: number
  correctCount: number
  wrongCount: number
  pendingCount: number
  durationSec: number
}

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  single: '单选',
  multiple: '多选',
  judge: '判断',
  essay: '解答',
  code: '代码',
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
}
