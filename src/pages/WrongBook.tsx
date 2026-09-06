import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { questionMap, categories } from '../data'
import { useStudyStore } from '../store/useStudyStore'
import { formatTime } from '../utils'
import { Markdown } from '../components/question/Markdown'
import { EmptyState, TypeBadge, DifficultyBadge, CategoryTag } from '../components/common/ui'

export function WrongBook() {
  const navigate = useNavigate()
  const records = useStudyStore((s) => s.records)
  const dismissedWrong = useStudyStore((s) => s.dismissedWrong)
  const dismissWrong = useStudyStore((s) => s.dismissWrong)
  const restoreWrong = useStudyStore((s) => s.restoreWrong)
  const [cat, setCat] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const wrongList = useMemo(() => {
    return Object.values(records)
      .filter((r) => r.grading === 'wrong' && !dismissedWrong.includes(r.questionId))
      .map((r) => ({ record: r, question: questionMap[r.questionId] }))
      .filter((x) => x.question && (cat === '' || x.question.category === cat))
      .sort((a, b) => b.record.answeredAt - a.record.answeredAt)
  }, [records, dismissedWrong, cat])

  const wrongByCat = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of Object.values(records)) {
      if (r.grading !== 'wrong' || dismissedWrong.includes(r.questionId)) continue
      const q = questionMap[r.questionId]
      if (q) counts[q.category] = (counts[q.category] ?? 0) + 1
    }
    return counts
  }, [records, dismissedWrong])

  function redoAll() {
    navigate('/practice', {
      state: { ids: wrongList.map((x) => x.question.id), title: '错题重做' },
    })
  }

  return (
    <main className="page page-narrow">
      <div className="page-header">
        <h1 className="page-title">📕 错题本</h1>
        <p className="page-desc">
          共 {wrongList.length} 道错题 · 答错自动收录，重做答对后自动移出
        </p>
      </div>

      <div className="card filter-bar">
        <select className="select" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">全部分类</option>
          {categories
            .filter((c) => wrongByCat[c.id])
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}（{wrongByCat[c.id]}）
              </option>
            ))}
        </select>
        <button className="btn btn-primary" disabled={wrongList.length === 0} onClick={redoAll}>
          开始重做（{wrongList.length}）
        </button>
      </div>

      {wrongList.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="🎉"
            title="错题本是空的"
            desc="当前没有待复习的错题，继续保持！"
          />
        </div>
      ) : (
        wrongList.map(({ record, question }) => {
          const isOpen = expanded === question.id
          return (
            <div key={question.id} className="card" style={{ marginBottom: 12 }}>
              <div className="q-row" style={{ cursor: 'default' }}>
                <div className="q-row-meta">
                  <TypeBadge type={question.type} />
                  <DifficultyBadge difficulty={question.difficulty} />
                  <CategoryTag category={question.category} sub={question.subCategory} />
                  <div className="q-row-status">
                    最后答错 {formatTime(record.answeredAt)}
                  </div>
                </div>
                <div className="q-row-title" style={{ WebkitLineClamp: isOpen ? undefined : 2 }}>
                  {question.question.replace(/[#*`>]/g, '')}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--danger)', marginBottom: 8 }}>
                  你的答案：
                  {record.userAnswer == null || record.userAnswer === ''
                    ? '（未作答 / 直接查看答案）'
                    : String(
                        Array.isArray(record.userAnswer)
                          ? record.userAnswer.join('、')
                          : question.type === 'judge'
                            ? record.userAnswer === 'true'
                              ? '正确'
                              : '错误'
                            : record.userAnswer.length > 60
                              ? `${record.userAnswer.slice(0, 60)}…`
                              : record.userAnswer,
                      )}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate('/practice', { state: { ids: [question.id], title: '错题重做' } })}
                  >
                    重做本题
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => setExpanded(isOpen ? null : question.id)}
                  >
                    {isOpen ? '收起解析' : '查看解析'}
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => dismissWrong(question.id)}>
                    移出错题本
                  </button>
                </div>

                {isOpen && (
                  <div style={{ marginTop: 14, borderTop: '1px dashed var(--border-strong)', paddingTop: 12 }}>
                    <p className="analysis-title" style={{ color: 'var(--success)' }}>
                      ✓ 正确答案 / 参考答案
                    </p>
                    {question.type === 'judge' ? (
                      <div style={{ fontSize: 13 }}>{question.answer ? '正确 ✓' : '错误 ✗'}</div>
                    ) : question.type === 'single' || question.type === 'multiple' ? (
                      <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
                        {Array.isArray(question.answer) ? question.answer.join('、') : String(question.answer)}
                      </div>
                    ) : (
                      <Markdown content={String(question.answer)} />
                    )}
                    {question.analysis && (
                      <>
                        <p className="analysis-title" style={{ marginTop: 14 }}>💡 解析</p>
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
                  </div>
                )}
              </div>
            </div>
          )
        })
      )}

      {dismissedWrong.length > 0 && (
        <p style={{ fontSize: 12.5, color: 'var(--text-3)', textAlign: 'center', marginTop: 18 }}>
          已移出 {dismissedWrong.length} 道错题
          <button
            className="btn btn-sm btn-ghost"
            style={{ marginLeft: 8 }}
            onClick={() => dismissedWrong.forEach(restoreWrong)}
          >
            全部恢复
          </button>
        </p>
      )}
    </main>
  )
}
