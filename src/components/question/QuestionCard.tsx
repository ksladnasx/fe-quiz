import { useEffect, useMemo, useState } from 'react'
import {
  BookMarked,
  CircleCheck,
  CircleQuestionMark,
  CircleX,
  FileText,
  Lightbulb,
  RotateCcw,
  Star,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import type { GradingStatus, Question } from '../../types'
import { categoryMap } from '../../data'
import { CategoryIcon } from '../common/icons'
import { gradeAnswer, normalizeAnswer } from '../../utils'
import { Markdown } from './Markdown'
import { DifficultyBadge, TypeBadge } from '../common/ui'
import { useStudyStore } from '../../store/useStudyStore'

interface QuestionCardProps {
  question: Question
  /** practice: 提交即显示解析并记录；interview: 同样记录，由外层控制导航 */
  mode?: 'practice' | 'interview'
  /** 恢复已提交状态（返回上一题时） */
  initialGrading?: GradingStatus | null
  initialUserAnswer?: string | string[] | null
  onSubmitted: (userAnswer: string | string[] | null, grading: GradingStatus) => void
  onSelfAssessed: (userAnswer: string | string[] | null, correct: boolean) => void
}

export function QuestionCard({
  question,
  mode = 'practice',
  initialGrading = null,
  initialUserAnswer = null,
  onSubmitted,
  onSelfAssessed,
}: QuestionCardProps) {
  const isObjective = question.type === 'single' || question.type === 'multiple' || question.type === 'judge'
  const favorites = useStudyStore((s) => s.favorites)
  const toggleFavorite = useStudyStore((s) => s.toggleFavorite)
  const isFav = Boolean(favorites[question.id])

  const [selected, setSelected] = useState<string[]>([])
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [grading, setGrading] = useState<GradingStatus | null>(initialGrading)

  // 切题时恢复初始状态
  useEffect(() => {
    setSelected([])
    setText(typeof initialUserAnswer === 'string' ? initialUserAnswer : '')
    setGrading(initialGrading)
    setSubmitted(Boolean(initialGrading))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  const cat = categoryMap[question.category]
  const multi = question.type === 'multiple'

  const correctAnswerText = useMemo(() => {
    if (!question.options) return null
    const labels = Array.isArray(question.answer)
      ? question.answer
      : [String(question.answer)]
    return labels
      .map((l) => question.options!.find((o) => o.label === l))
      .filter(Boolean)
      .map((o) => `${o!.label}. ${o!.text}`)
      .join('；')
  }, [question])

  function toggleOption(label: string) {
    if (submitted) return
    if (multi) {
      setSelected((prev) =>
        prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
      )
    } else {
      setSelected([label])
    }
  }

  function handleSubmit() {
    let userAnswer: string | string[] | null
    if (question.type === 'single' || question.type === 'multiple') {
      userAnswer = multi ? [...selected].sort() : (selected[0] ?? null)
      if (!userAnswer || (multi && selected.length === 0)) return
    } else if (question.type === 'judge') {
      userAnswer = selected[0] ?? null
      if (!userAnswer) return
    } else {
      userAnswer = text
    }
    const g = gradeAnswer(question, userAnswer)
    setGrading(g)
    setSubmitted(true)
    onSubmitted(userAnswer, g)
  }

  function handleSelfAssess(correct: boolean) {
    const userAnswer = question.type === 'code' || question.type === 'essay' ? text : null
    setGrading(correct ? 'correct' : 'wrong')
    onSelfAssessed(userAnswer, correct)
  }

  function handleReset() {
    setSelected([])
    setText('')
    setGrading(null)
    setSubmitted(false)
  }

  const userAnswerStr =
    initialUserAnswer == null ? '' : normalizeAnswer(initialUserAnswer).replace(/,/g, '、')

  return (
    <div className="card question-body">
      <div className="question-meta">
        <TypeBadge type={question.type} />
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="tag tag-cat">
          <CategoryIcon category={question.category} size={12} />
          {cat?.name}
          {question.subCategory ? ` · ${question.subCategory}` : ''}
        </span>
        <button
          type="button"
          className={`fav-btn ${isFav ? 'active' : ''}`}
          title={isFav ? '取消收藏' : '收藏本题'}
          onClick={() => toggleFavorite(question.id)}
        >
          <Star size={17} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="question-title">
        <Markdown content={question.question} />
      </div>

      {/* 选择题选项 */}
      {question.options && (
        <div className="options">
          {question.options.map((opt) => {
            const isSelected = selected.includes(opt.label)
            const isAnswer = Array.isArray(question.answer)
              ? question.answer.includes(opt.label)
              : question.answer === opt.label
            let cls = 'option'
            if (submitted) {
              cls += ' disabled'
              if (isAnswer) cls += ' correct-reveal'
              else if (isSelected) cls += ' wrong-reveal'
            } else if (isSelected) {
              cls += ' selected'
            }
            return (
              <div key={opt.label} className={cls} onClick={() => toggleOption(opt.label)}>
                <span className="option-label">{opt.label}</span>
                <span>{opt.text}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* 判断题 */}
      {question.type === 'judge' && (
        <div className="judge-row">
          {(['true', 'false'] as const).map((val) => {
            const isSelected = selected[0] === val
            const isAnswer = String(question.answer) === val
            let cls = 'judge-btn'
            if (submitted) {
              if (isAnswer) cls += ' reveal-correct'
              else if (isSelected) cls += ' reveal-wrong'
            } else if (isSelected) cls += ' selected'
            return (
              <button
                key={val}
                type="button"
                className={cls}
                disabled={submitted}
                onClick={() => setSelected([val])}
              >
                {val === 'true' ? '✓ 正确' : '✗ 错误'}
              </button>
            )
          })}
        </div>
      )}

      {/* 解答题 / 代码题 */}
      {(question.type === 'essay' || question.type === 'code') && (
        <div style={{ marginTop: 20 }}>
          <textarea
            className={`textarea ${question.type === 'code' ? 'code-editor' : ''}`}
            placeholder={
              question.type === 'essay'
                ? '按面试口述的方式写下你的回答：结论 → 展开要点 → 举例/结合项目……'
                : '在这里写下你的代码实现……'
            }
            value={text}
            disabled={submitted}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="answer-actions">
            {!submitted && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  提交并对照参考答案
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setGrading('pending')
                    setSubmitted(true)
                    onSubmitted(text, 'pending')
                  }}
                >
                  直接查看参考答案
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 客观题提交按钮 */}
      {isObjective && !submitted && (
        <div className="answer-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={selected.length === 0}
            onClick={handleSubmit}
          >
            提交答案
          </button>
          {multi && <span style={{ fontSize: 12, color: 'var(--text-3)' }}>可多选，需全部选对方算正确</span>}
        </div>
      )}

      {/* 提交后的判定与解析 */}
      {submitted && grading && (
        <div className="analysis-panel">
          <div className="answer-actions" style={{ marginTop: 0, marginBottom: 14 }}>
            {grading === 'correct' && (
              <span className="verdict verdict-correct">
                <CircleCheck size={15} />
                回答正确
              </span>
            )}
            {grading === 'wrong' && (
              <span className="verdict verdict-wrong">
                <CircleX size={15} />
                回答错误
              </span>
            )}
            {grading === 'pending' && (
              <span className="verdict verdict-pending">
                <CircleQuestionMark size={15} />
                已提交 · 请对照参考答案自评
              </span>
            )}
            {mode === 'practice' && (
              <button type="button" className="btn btn-sm btn-ghost" onClick={handleReset}>
                <RotateCcw size={13} />
                重新答题
              </button>
            )}
          </div>

          {/* 解答题自评 */}
          {grading === 'pending' && (
            <div className="answer-actions" style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>自评结果：</span>
              <button type="button" className="btn btn-sm" onClick={() => handleSelfAssess(true)}>
                <ThumbsUp size={13} />
                我答出来了
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => handleSelfAssess(false)}
              >
                <ThumbsDown size={13} />
                没答好，需要复习
              </button>
            </div>
          )}

          {question.type === 'judge' && (
            <div style={{ fontSize: 13, marginBottom: 10 }}>
              <strong>正确答案：</strong>
              {question.answer ? '正确 ✓' : '错误 ✗'}
              {userAnswerStr && (
                <span style={{ color: 'var(--text-3)' }}>（你的选择：{userAnswerStr === 'true' ? '正确' : '错误'}）</span>
              )}
            </div>
          )}
          {correctAnswerText && (
            <div style={{ fontSize: 13, marginBottom: 10 }}>
              <strong>正确答案：</strong>
              <span style={{ color: 'var(--success)' }}>{correctAnswerText}</span>
              {userAnswerStr && !multi && (
                <span style={{ color: 'var(--text-3)' }}>（你的选择：{userAnswerStr}）</span>
              )}
            </div>
          )}

          {question.answer && (question.type === 'essay' || question.type === 'code') && (
            <>
              <p className="analysis-title">
                <BookMarked size={14} />
                参考答案
              </p>
              <Markdown content={String(question.answer)} />
            </>
          )}

          {question.analysis && (
            <>
              <p className="analysis-title" style={{ marginTop: 16 }}>
                <Lightbulb size={14} />
                解析
              </p>
              <Markdown content={question.analysis} />
            </>
          )}

          {question.keyPoints && question.keyPoints.length > 0 && (
            <div className="keywords">
              {question.keyPoints.map((k) => (
                <span key={k} className="keyword-chip">
                  {k}
                </span>
              ))}
            </div>
          )}

          {question.source && (
            <div className="source-line">
              <FileText size={12} />
              来源：docs/{question.source}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
