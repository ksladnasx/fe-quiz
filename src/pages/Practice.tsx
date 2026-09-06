import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  FolderOpen,
  Keyboard,
  PartyPopper,
  RotateCcw,
  Shuffle,
} from 'lucide-react'
import { questionMap, shuffle, categoryMap } from '../data'
import type { GradingStatus } from '../types'
import { useStudyStore } from '../store/useStudyStore'
import { LS_KEYS, percent, readLS, writeLS } from '../utils'
import { filterQuestions, parseFilters } from '../utils/filters'
import { QuestionCard } from '../components/question/QuestionCard'
import { ProgressBar, EmptyState } from '../components/common/ui'

interface SessionItem {
  answer: string | string[] | null
  grading: GradingStatus
}

interface PersistedSession {
  ids: string[]
  index: number
  session: Record<string, SessionItem>
}

export function Practice() {
  const location = useLocation()
  const [sp] = useSearchParams()
  const submitAnswer = useStudyStore((s) => s.submitAnswer)
  const selfAssess = useStudyStore((s) => s.selfAssess)

  // 组卷：优先使用外部传入 ids（首页快速开始/错题重做），否则按 URL 筛选
  const stateIds = (location.state as { ids?: string[]; title?: string } | null)?.ids
  const stateTitle = (location.state as { title?: string } | null)?.title
  const filters = useMemo(() => parseFilters(sp), [sp])

  const paper = useMemo(() => {
    if (stateIds) {
      return stateIds.map((id) => questionMap[id]).filter(Boolean)
    }
    let list = filterQuestions(filters)
    if (filters.order === 'random') list = shuffle(list)
    return list
  }, [stateIds, filters])

  const paperTitle =
    stateTitle ??
    (filters.category
      ? `${categoryMap[filters.category]?.name ?? ''}${filters.sub ? ` · ${filters.sub}` : ''}`
      : '全部题目')

  // 恢复上次会话（同一份卷子时）
  const restored = useMemo(() => {
    if (paper.length === 0) return { index: 0, session: {} as Record<string, SessionItem> }
    const saved = readLS<PersistedSession | null>(LS_KEYS.paper, null)
    if (saved && saved.ids.length === paper.length && saved.ids.every((id, i) => id === paper[i].id)) {
      return { index: saved.index, session: saved.session }
    }
    return { index: 0, session: {} as Record<string, SessionItem> }
  }, [paper])

  const [index, setIndex] = useState(restored.index)
  const [session, setSession] = useState<Record<string, SessionItem>>(restored.session)
  const [finished, setFinished] = useState(false)

  const current = paper[index]

  // 会话持久化到 sessionStorage 级别的 localStorage（刷新可恢复）
  useEffect(() => {
    writeLS(LS_KEYS.paper, { ids: paper.map((q) => q.id), index, session } satisfies PersistedSession)
  }, [paper, index, session])

  const handleSubmit = useCallback(
    (questionId: string, answer: string | string[] | null, grading: GradingStatus) => {
      submitAnswer(questionId, answer, grading)
      setSession((prev) => ({ ...prev, [questionId]: { answer, grading } }))
    },
    [submitAnswer],
  )

  const handleSelfAssess = useCallback(
    (questionId: string, answer: string | string[] | null, correct: boolean) => {
      selfAssess(questionId, answer, correct)
      setSession((prev) => ({
        ...prev,
        [questionId]: { answer, grading: correct ? 'correct' : 'wrong' },
      }))
    },
    [selfAssess],
  )

  const answeredCount = paper.filter((q) => session[q.id]).length

  const goPrev = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => {
    if (index < paper.length - 1) setIndex((i) => i + 1)
  }

  usePracticeHotkey(!finished, goPrev, goNext)

  if (paper.length === 0) {
    return (
      <main className="page page-narrow">
        <div className="card">
          <EmptyState
            icon={<FolderOpen size={40} strokeWidth={1.5} />}
            title="没有可刷的题目"
            desc="当前筛选条件下没有题目，或传入的题目 id 无效"
            action={
              <Link to="/bank" className="btn btn-primary">
                去题库选题
              </Link>
            }
          />
        </div>
      </main>
    )
  }

  if (finished) {
    const graded = paper.map((q) => session[q.id]?.grading).filter(Boolean) as GradingStatus[]
    const correct = graded.filter((g) => g === 'correct').length
    const wrong = graded.filter((g) => g === 'wrong').length
    return (
      <main className="page page-narrow">
        <div className="card" style={{ padding: 36, textAlign: 'center' }}>
          <div className="finish-icon">
            <PartyPopper size={44} strokeWidth={1.5} />
          </div>
          <h2 style={{ margin: '0 0 6px' }}>本次练习完成</h2>
          <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginTop: 0 }}>
            {paperTitle} · 共 {paper.length} 题，完成 {graded.length} 题
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, margin: '22px 0 28px' }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--success)' }}>{correct}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-3)' }}>答对</div>
            </div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--danger)' }}>{wrong}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-3)' }}>答错</div>
            </div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800 }}>{percent(correct, graded.length)}%</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-3)' }}>正确率</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setFinished(false)}>
              继续回顾本题
            </button>
            <button
              className="btn"
              onClick={() => {
                setSession({})
                setIndex(0)
                setFinished(false)
              }}
            >
              <RotateCcw size={14} />
              再刷一轮
            </button>
            <Link className="btn" to="/wrong">
              查看错题本
            </Link>
            <Link className="btn" to="/stats">
              查看统计
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page" style={{ maxWidth: 1160 }}>
      <div className="practice-layout">
        <div className="practice-main">
          <div className="card practice-head">
            <div>
              <div className="practice-head-title">{paperTitle}</div>
              <div className="practice-sub">
                {filters.order === 'random' && !stateIds && <Shuffle size={11} />}
                {filters.order === 'random' && !stateIds ? '随机顺序' : '顺序练习'}
                {' · '}
                <Link to="/bank" style={{ color: 'inherit' }}>
                  退出练习
                </Link>
              </div>
            </div>
            <div className="practice-progress">
              <ProgressBar value={answeredCount} max={paper.length} />
            </div>
            <div className="practice-count">
              {index + 1} / {paper.length} · 已答 {answeredCount}
            </div>
            <button className="btn btn-sm" onClick={() => setFinished(true)}>
              <Flag size={13} />
              结束练习
            </button>
          </div>

          {current && (
            <QuestionCard
              key={`${current.id}-${index}`}
              question={current}
              initialGrading={session[current.id]?.grading ?? null}
              initialUserAnswer={session[current.id]?.answer ?? null}
              onSubmitted={(a, g) => handleSubmit(current.id, a, g)}
              onSelfAssessed={(a, correct) => handleSelfAssess(current.id, a, correct)}
            />
          )}

          <div className="card practice-footer">
            <button className="btn" onClick={goPrev} disabled={index === 0}>
              <ChevronLeft size={15} />
              上一题
            </button>
            <span className="hotkey-hint">
              <Keyboard size={12} />
              {current?.id} · ←/→ 切题
            </span>
            <button
              className="btn btn-primary"
              onClick={goNext}
              disabled={index >= paper.length - 1}
            >
              下一题
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* 题号导航侧栏 */}
        <aside className="card side-panel">
          <div className="side-panel-head">题目导航</div>
          <div className="side-panel-body">
            {paper.map((q, i) => {
              const g = session[q.id]?.grading
              let cls = 'cell'
              if (i === index) cls += ' current'
              else if (g === 'correct') cls += ' answered-correct'
              else if (g === 'wrong') cls += ' answered-wrong'
              else if (g === 'pending') cls += ' answered-pending'
              return (
                <button key={q.id} className={cls} onClick={() => setIndex(i)} title={q.id}>
                  {i + 1}
                </button>
              )
            })}
          </div>
          <div className="side-legend">
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: 'var(--success-soft)', border: '1px solid rgba(22,163,74,.4)' }} />
              答对
            </span>
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: 'var(--danger-soft)', border: '1px solid rgba(229,72,77,.4)' }} />
              答错
            </span>
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: 'var(--purple-soft)', border: '1px solid rgba(124,92,240,.4)' }} />
              待自评
            </span>
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: 'var(--primary)' }} />
              当前
            </span>
          </div>
        </aside>
      </div>
    </main>
  )
}

// 键盘快捷键（左右切题）在组件外注册会影响多个实例，改为在 Practice 内部监听
export function usePracticeHotkey(
  enabled: boolean,
  onPrev: () => void,
  onNext: () => void,
) {
  useEffect(() => {
    if (!enabled) return
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [enabled, onPrev, onNext])
}
