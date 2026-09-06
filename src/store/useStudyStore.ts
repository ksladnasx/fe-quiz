import { create } from 'zustand'
import type {
  AnswerRecord,
  GradingStatus,
  HistoryEntry,
  InterviewReport,
} from '../types'
import { LS_KEYS, gradeAnswer, readLS, writeLS } from '../utils'

const HISTORY_LIMIT = 400
const INTERVIEW_LIMIT = 20

interface StudyState {
  /** 题目 id -> 作答记录（localStorage 持久化） */
  records: Record<string, AnswerRecord>
  /** 题目 id -> 收藏时间戳 */
  favorites: Record<string, number>
  /** 从错题本移除的题目 id */
  dismissedWrong: string[]
  /** 最近作答日志 */
  history: HistoryEntry[]
  /** 面试模式报告 */
  interviewReports: InterviewReport[]

  /** 提交一次作答；grading 由调用方算好传入 */
  submitAnswer: (
    questionId: string,
    userAnswer: string | string[] | null,
    grading: GradingStatus,
  ) => void
  /** 解答题/代码题自评（查看参考答案后） */
  selfAssess: (questionId: string, userAnswer: string | string[] | null, correct: boolean) => void
  toggleFavorite: (questionId: string) => void
  isFavorite: (questionId: string) => boolean
  dismissWrong: (questionId: string) => void
  restoreWrong: (questionId: string) => void
  saveInterviewReport: (report: InterviewReport) => void
  resetAll: () => void
}

function persist(state: StudyState): void {
  writeLS(LS_KEYS.records, state.records)
  writeLS(LS_KEYS.favorites, state.favorites)
  writeLS(LS_KEYS.dismissed, state.dismissedWrong)
  writeLS(LS_KEYS.history, state.history)
  writeLS(LS_KEYS.interview, state.interviewReports)
}

export const useStudyStore = create<StudyState>((set, get) => ({
  records: readLS<Record<string, AnswerRecord>>(LS_KEYS.records, {}),
  favorites: readLS<Record<string, number>>(LS_KEYS.favorites, {}),
  dismissedWrong: readLS<string[]>(LS_KEYS.dismissed, []),
  history: readLS<HistoryEntry[]>(LS_KEYS.history, []),
  interviewReports: readLS<InterviewReport[]>(LS_KEYS.interview, []),

  submitAnswer: (questionId, userAnswer, grading) => {
    set((state) => {
      const prev = state.records[questionId]
      const record: AnswerRecord = {
        questionId,
        grading,
        userAnswer,
        answeredAt: Date.now(),
        attempts: (prev?.attempts ?? 0) + 1,
      }
      const history: HistoryEntry[] = [
        { questionId, time: Date.now(), grading },
        ...state.history,
      ].slice(0, HISTORY_LIMIT)
      const next = {
        ...state,
        records: { ...state.records, [questionId]: record },
        // 重新答对后自动从错题本恢复
        dismissedWrong: grading === 'wrong' ? state.dismissedWrong : state.dismissedWrong.filter((id) => id !== questionId),
        history,
      }
      persist(next)
      return next
    })
  },

  selfAssess: (questionId, userAnswer, correct) => {
    set((state) => {
      const prev = state.records[questionId]
      if (!prev) return state
      const record: AnswerRecord = {
        ...prev,
        grading: correct ? 'correct' : 'wrong',
        userAnswer: userAnswer ?? prev.userAnswer,
        answeredAt: Date.now(),
      }
      const next = {
        ...state,
        records: { ...state.records, [questionId]: record },
        dismissedWrong: correct ? state.dismissedWrong.filter((id) => id !== questionId) : state.dismissedWrong,
      }
      persist(next)
      return next
    })
  },

  toggleFavorite: (questionId) => {
    set((state) => {
      const favorites = { ...state.favorites }
      if (favorites[questionId]) {
        delete favorites[questionId]
      } else {
        favorites[questionId] = Date.now()
      }
      const next = { ...state, favorites }
      persist(next)
      return next
    })
  },

  isFavorite: (questionId) => Boolean(get().favorites[questionId]),

  dismissWrong: (questionId) => {
    set((state) => {
      if (state.dismissedWrong.includes(questionId)) return state
      const next = { ...state, dismissedWrong: [...state.dismissedWrong, questionId] }
      persist(next)
      return next
    })
  },

  restoreWrong: (questionId) => {
    set((state) => {
      const next = {
        ...state,
        dismissedWrong: state.dismissedWrong.filter((id) => id !== questionId),
      }
      persist(next)
      return next
    })
  },

  saveInterviewReport: (report) => {
    set((state) => {
      const next = {
        ...state,
        interviewReports: [report, ...state.interviewReports].slice(0, INTERVIEW_LIMIT),
      }
      persist(next)
      return next
    })
  },

  resetAll: () => {
    const empty = {
      records: {},
      favorites: {},
      dismissedWrong: [],
      history: [],
      interviewReports: [],
    } as Pick<
      StudyState,
      'records' | 'favorites' | 'dismissedWrong' | 'history' | 'interviewReports'
    >
    persist({ ...get(), ...empty } as StudyState)
    set(empty)
  },
}))

export { gradeAnswer }
