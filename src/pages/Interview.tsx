import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlarmClock,
  ChartPie,
  CircleCheck,
  CircleX,
  CircleQuestionMark,
  ClipboardCheck,
  Clock,
  Flag,
  ListChecks,
  Mic,
  PartyPopper,
  Play,
  RotateCcw,
  Target,
  Timer,
} from 'lucide-react'
import { categoryMap, questions, shuffle, questionMap } from '../data'
import type { GradingStatus, InterviewReport, QuestionType } from '../types'
import { useStudyStore } from '../store/useStudyStore'
import { CategoryIcon } from '../components/common/icons'
import { percent, formatDuration, readLS, writeLS } from '../utils'
import { QuestionCard } from '../components/question/QuestionCard'
import { ProgressBar, CategoryTag } from '../components/common/ui'

type Phase = 'config' | 'running' | 'report'
type Composition = 'mixed' | 'objective' | 'essay' | 'choice'

const INTERVIEW_SESSION_KEY = 'fequiz.interview-session.v1'
const PER_QUESTION_SECONDS = 120

interface RunSession {
  ids: string[]
  index: number
  session: Record<string, { grading: GradingStatus }>
  startedAt: number
}

function pickPaper(count: number, composition: Composition, categoryId: string): string[] {
  const pool = categoryId ? questions.filter((q) => q.category === categoryId) : questions
  const byType = (types: QuestionType[]) => pool.filter((q) => types.includes(q.type))
  const essayPool = byType(['essay', 'code'])
  const singlePool = byType(['single'])
  const judgePool = byType(['judge'])
  const multiPool = byType(['multiple'])
  const objectivePool = [...singlePool, ...multiPool, ...judgePool]

  const picked: typeof questions = []
  const push = (arr: typeof questions, n: number) => {
    picked.push(...shuffle(arr).slice(0, n))
  }

  if (composition === 'objective') {
    push(objectivePool, Math.min(count, objectivePool.length))
  } else if (composition === 'choice') {
    const half = Math.ceil(count / 2)
    push(singlePool, Math.min(half, singlePool.length))
    push(multiPool, Math.min(count - Math.min(half, singlePool.length), multiPool.length))
  } else if (composition === 'essay') {
    push(essayPool, Math.min(count, essayPool.length))
  } else {
    // 混合：约一半解答/代码，客观题按单选>判断>多选的比例分配
    const essayCount = Math.min(Math.ceil(count / 2), essayPool.length)
    push(essayPool, essayCount)
    const objCount = count - picked.length
    const singles = Math.min(Math.ceil(objCount * 0.6), singlePool.length)
    push(singlePool, singles)
    const judges = Math.min(Math.ceil(objCount * 0.25), judgePool.length)
    push(judgePool, judges)
    push(multiPool, Math.max(0, objCount - singles - judges))
  }
  // 不足时从全池补齐
  if (picked.length < count) {
    const used = new Set(picked.map((q) => q.id))
    push(pool.filter((q) => !used.has(q.id)), count - picked.length)
  }
  return shuffle(picked).slice(0, count).map((q) => q.id)
}

export function Interview() {
  const navigate = useNavigate()
  const saveInterviewReport = useStudyStore((s) => s.saveInterviewReport)
  const interviewReports = useStudyStore((s) => s.interviewReports)

  const [phase, setPhase] = useState<Phase>('config')
  const [count, setCount] = useState(10)
  const [composition, setComposition] = useState<Composition>('mixed')
  const [categoryId, setCategoryId] = useState('')

  const [ids, setIds] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const [session, setSession] = useState<Record<string, { grading: GradingStatus }>>({})
  const [startedAt, setStartedAt] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [report, setReport] = useState<InterviewReport | null>(null)

  const paper = useMemo(() => ids.map((id) => questionMap[id]).filter(Boolean), [ids])
  const current = paper[index]
  const timeLimitSec = ids.length * PER_QUESTION_SECONDS
  const remain = Math.max(0, timeLimitSec - elapsed)

  // 计时
  const timerRef = useRef<number | null>(null)
  useEffect(() => {
    if (phase !== 'running') return
    timerRef.current = window.setInterval(() => {
      setElapsed((e) => e + 1)
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [phase])

  // 运行中会话持久化（刷新恢复）
  useEffect(() => {
    if (phase === 'running') {
      writeLS(INTERVIEW_SESSION_KEY, { ids, index, session, startedAt } satisfies RunSession)
    } else if (phase === 'config') {
      writeLS(INTERVIEW_SESSION_KEY, null)
    }
  }, [phase, ids, index, session, startedAt])

  // 启动时检查是否有未完成的面试
  const [resumable, setResumable] = useState<RunSession | null>(null)
  useEffect(() => {
    const saved = readLS<RunSession | null>(INTERVIEW_SESSION_KEY, null)
    if (saved && saved.ids?.length) setResumable(saved)
  }, [])

  const start = useCallback(() => {
    const picked = pickPaper(count, composition, categoryId)
    if (picked.length === 0) return
    setIds(picked)
    setIndex(0)
    setSession({})
    setStartedAt(Date.now())
    setElapsed(0)
    setReport(null)
    setPhase('running')
  }, [count, composition, categoryId])

  const resume = useCallback(() => {
    if (!resumable) return
    setIds(resumable.ids)
    setIndex(resumable.index)
    setSession(resumable.session)
    setStartedAt(resumable.startedAt)
    setElapsed(Math.floor((Date.now() - resumable.startedAt) / 1000))
    setReport(null)
    setResumable(null)
    setPhase('running')
  }, [resumable])

  const finish = useCallback(() => {
    const graded = ids.map((id) => session[id]?.grading ?? null)
    const correct = graded.filter((g) => g === 'correct').length
    const wrong = graded.filter((g) => g === 'wrong').length
    const pending = graded.filter((g) => g === null || g === 'pending').length
    const score = Math.round((correct / Math.max(1, correct + wrong)) * 100)
    const rep: InterviewReport = {
      id: `iv-${Date.now()}`,
      time: Date.now(),
      questionIds: ids,
      gradings: graded,
      score,
      correctCount: correct,
      wrongCount: wrong,
      pendingCount: pending,
      durationSec: Math.floor((Date.now() - startedAt) / 1000),
    }
    saveInterviewReport(rep)
    setReport(rep)
    setPhase('report')
  }, [ids, session, startedAt, saveInterviewReport])

  const handleSelfAssess = useCallback(
    (questionId: string, _answer: string | string[] | null, correct: boolean) => {
      setSession((prev) => ({
        ...prev,
        [questionId]: { grading: correct ? 'correct' : 'wrong' },
      }))
    },
    [],
  )

  // ============ 配置页 ============
  if (phase === 'config') {
    return (
      <main className="page page-narrow">
        <div className="page-header">
          <h1 className="page-title">
            <Mic size={20} />
            面试模式
          </h1>
          <p className="page-desc">
            模拟真实前端面试：随机抽题组卷，客观题自动判分，解答题对照参考答案自评，结束后生成得分与薄弱点报告
          </p>
        </div>

        {resumable && (
          <div className="card" style={{ padding: '14px 18px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13 }}>
              检测到一场未完成的面试（已答{' '}
              {Object.keys(resumable.session).length}/{resumable.ids.length} 题）
            </span>
            <button className="btn btn-sm btn-primary" onClick={resume}>
              <Play size={13} />
              继续这场面试
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => {
                writeLS(INTERVIEW_SESSION_KEY, null)
                setResumable(null)
              }}
            >
              放弃
            </button>
          </div>
        )}

        <div className="card" style={{ padding: 24 }}>
          <h2 className="section-title">
            <ListChecks size={16} />
            试卷设置
          </h2>
          <div style={{ display: 'grid', gap: 14 }}>
            <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
              <strong>题目数量</strong>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    className={`btn btn-sm ${count === n ? 'btn-primary' : ''}`}
                    onClick={() => setCount(n)}
                  >
                    {n} 题
                  </button>
                ))}
              </div>
            </label>

            <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
              <strong>题型构成</strong>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {([
                  ['mixed', '混合（推荐）'],
                  ['objective', '客观题为主'],
                  ['essay', '解答 + 代码'],
                  ['choice', '单选 + 多选'],
                ] as [Composition, string][]).map(([v, label]) => (
                  <button
                    key={v}
                    className={`btn btn-sm ${composition === v ? 'btn-primary' : ''}`}
                    onClick={() => setComposition(v)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </label>

            <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
              <strong>知识范围</strong>
              <select className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">全部知识分类</option>
                {Object.entries(categoryMap).map(([id, c]) => (
                  <option key={id} value={id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <div style={{ fontSize: 12.5, color: 'var(--text-3)', background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 10 }}>
              <Timer size={14} />
              参考用时：每题 {PER_QUESTION_SECONDS / 60} 分钟，共 {ids.length || count} 题 ≈{' '}
              {formatDuration((ids.length || count) * PER_QUESTION_SECONDS)}。超时不会强制交卷，但请尽量模拟真实节奏。
            </div>

            <button className="btn btn-lg btn-primary" onClick={start}>
              <Play size={16} />
              开始面试
            </button>
          </div>
        </div>

        {interviewReports.length > 0 && (
          <section className="card" style={{ padding: '18px 20px', marginTop: 16 }}>
            <h2 className="section-title">
              <Clock size={16} />
              历史面试成绩
            </h2>
            {interviewReports.slice(0, 8).map((r) => (
              <div className="recent-item" key={r.id}>
                <span
                  className={`dot ${r.score >= 80 ? 'dot-correct' : r.score >= 60 ? 'dot-pending' : 'dot-wrong'}`}
                />
                <span style={{ flex: 1 }}>
                  {new Date(r.time).toLocaleString()} · {r.questionIds.length} 题 · 用时{' '}
                  {formatDuration(r.durationSec)}
                </span>
                <strong>{r.score} 分</strong>
              </div>
            ))}
          </section>
        )}
      </main>
    )
  }

  // ============ 报告页 ============
  if (phase === 'report' && report) {
    const catBreak = (() => {
      const map: Record<string, { done: number; correct: number }> = {}
      report.questionIds.forEach((id, i) => {
        const q = questionMap[id]
        if (!q) return
        const g = report.gradings[i]
        if (g !== 'correct' && g !== 'wrong') return
        map[q.category] ??= { done: 0, correct: 0 }
        map[q.category].done++
        if (g === 'correct') map[q.category].correct++
      })
      return Object.entries(map)
        .map(([cid, s]) => ({
          cat: categoryMap[cid],
          accuracy: percent(s.correct, s.done),
          done: s.done,
        }))
        .sort((a, b) => a.accuracy - b.accuracy)
    })()

    const wrongIds = report.questionIds.filter(
      (_, i) => report.gradings[i] === 'wrong' || report.gradings[i] === 'pending',
    )
    const weak = catBreak.filter((c) => c.accuracy < 60)

    return (
      <main className="page page-narrow">
        <div className="card" style={{ padding: 30, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              className="score-ring"
              style={{
                background: `conic-gradient(${
                  report.score >= 80 ? '#22c55e' : report.score >= 60 ? '#4f6ef7' : '#e5484d'
                } ${report.score * 3.6}deg, var(--bg-soft) 0deg)`,
              }}
            >
              <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
                <div className="report-score" style={{ fontSize: 34 }}>
                  {report.score}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>综合得分</div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h2 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flag size={17} />
            面试报告
          </h2>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-2)' }}>
                {new Date(report.time).toLocaleString()} · 共 {report.questionIds.length} 题 · 用时{' '}
                {formatDuration(report.durationSec)}
              </p>
              <div style={{ display: 'flex', gap: 22, marginTop: 14, flexWrap: 'wrap' }}>
                <div>
                  <CircleCheck size={16} className="stat-mini-icon" style={{ color: 'var(--success)' }} />
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>
                    {report.correctCount}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>答对</div>
                </div>
                <div>
                  <CircleX size={16} className="stat-mini-icon" style={{ color: 'var(--danger)' }} />
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--danger)' }}>
                    {report.wrongCount}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>答错</div>
                </div>
                <div>
                  <CircleQuestionMark size={16} className="stat-mini-icon" style={{ color: 'var(--purple)' }} />
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--purple)' }}>
                    {report.pendingCount}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>未自评</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>
                    {percent(report.correctCount, report.correctCount + report.wrongCount)}%
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>正确率</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {weak.length > 0 && (
          <div className="card" style={{ padding: '16px 20px', marginBottom: 16, background: 'var(--warning-soft)', border: '1px solid rgba(217,119,6,.25)' }}>
            <strong style={{ fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Target size={15} />
              薄弱知识点：
            </strong>
            <span style={{ fontSize: 13 }}>
              {weak.map((w) => `${w.cat?.name ?? ''}（${w.accuracy}%）`).join('、')}
              {' '}- 建议优先复习这些分类。
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
          <section className="card" style={{ padding: '18px 20px' }}>
            <h2 className="section-title">
              <ChartPie size={16} />
              分类正确率
            </h2>
            {catBreak.map((c) => (
              <div className="bar-row" key={c.cat?.id}>
                <div className="bar-name">
                  {c.cat && <CategoryIcon category={c.cat.id} size={13} />}
                  <span>{c.cat?.name}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.max(2, c.accuracy)}%` }} />
                </div>
                <div className="bar-value">{c.accuracy}%</div>
              </div>
            ))}
          </section>

          <section className="card" style={{ padding: '18px 20px' }}>
            <h2 className="section-title">
              <Target size={16} />
              建议复习内容（答错 / 待巩固）
            </h2>
            {wrongIds.length === 0 ? (
              <p style={{ color: 'var(--text-3)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <PartyPopper size={15} />
                本次面试全部答对，太棒了！
              </p>
            ) : (
              wrongIds.map((id) => {
                const q = questionMap[id]
                if (!q) return null
                return (
                  <div key={id} className="recent-item">
                    <CircleX size={14} className="dot-icon dot-wrong" />
                    <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {q.question.replace(/[#*`>|]/g, '').replace(/[[\]]/g, '').slice(0, 40)}
                    </span>
                    <CategoryTag category={q.category} />
                  </div>
                )
              })
            )}
          </section>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={start}>
            <RotateCcw size={14} />
            再来一场
          </button>
          {wrongIds.length > 0 && (
            <button
              className="btn"
              onClick={() =>
                navigate('/practice', { state: { ids: wrongIds, title: '面试错题重做' } })
              }
            >
              重做本次错题（{wrongIds.length}）
            </button>
          )}
          <Link to="/wrong" className="btn">
            <CircleX size={14} />
            查看错题本
          </Link>
          <Link to="/stats" className="btn">
            <ChartPie size={14} />
            查看统计
          </Link>
        </div>
      </main>
    )
  }

  // ============ 进行中 ============
  if (!current) return null
  return (
    <main className="page page-narrow">
      <div className="card practice-head" style={{ marginBottom: 14 }}>
        <div>
          <div className="practice-head-title">模拟面试进行中</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
            解答题请按真实口述作答，提交后自评 · 客观题自动判分
          </div>
        </div>
        <div className={`timer-badge ${remain === 0 ? 'urgent' : ''}`}>
          {remain === 0 ? <AlarmClock size={14} /> : <Timer size={14} />}
          {remain === 0
            ? '已超时'
            : `${String(Math.floor(remain / 60)).padStart(2, '0')}:${String(remain % 60).padStart(2, '0')}`}
        </div>
        <div className="practice-progress">
          <ProgressBar value={index + 1} max={paper.length} />
        </div>
        <div className="practice-count">
          {index + 1} / {paper.length}
        </div>
        <button className="btn btn-sm btn-primary" onClick={finish}>
          <Flag size={13} />
          交卷
        </button>
      </div>

      <QuestionCard
        key={`${current.id}-${index}`}
        question={current}
        mode="interview"
        initialGrading={session[current.id]?.grading ?? null}
        onSubmitted={(_answer, grading) => {
          // 面试模式下提交解答题先记 pending，自评后再定级
          if (grading === 'pending') {
            setSession((prev) => ({ ...prev, [current.id]: { grading: 'pending' } }))
          } else {
            setSession((prev) => ({ ...prev, [current.id]: { grading } }))
          }
        }}
        onSelfAssessed={(answer, correct) => handleSelfAssess(current.id, answer, correct)}
      />

      <div className="card practice-footer">
        <button className="btn" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          ← 上一题
        </button>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
          第 {index + 1} 题 · 共 {paper.length} 题
        </span>
        {index < paper.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setIndex((i) => i + 1)}>
            下一题
          </button>
        ) : (
          <button className="btn btn-primary" onClick={finish}>
            <ClipboardCheck size={14} />
            交卷，生成报告
          </button>
        )}
      </div>
    </main>
  )
}
