import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { categories, questionMap, questions, questionsByCategory } from '../data'
import { useStudyStore } from '../store/useStudyStore'
import { percent, formatDate } from '../utils'
import { EmptyState } from '../components/common/ui'

export function Stats() {
  const records = useStudyStore((s) => s.records)
  const favorites = useStudyStore((s) => s.favorites)
  const history = useStudyStore((s) => s.history)

  const stats = useMemo(() => {
    const all = Object.values(records)
    const graded = all.filter((r) => r.grading !== 'pending')
    const correct = graded.filter((r) => r.grading === 'correct').length
    const wrong = graded.filter((r) => r.grading === 'wrong').length
    const pending = all.filter((r) => r.grading === 'pending').length
    return {
      total: questions.length,
      done: all.length,
      correct,
      wrong,
      pending,
      accuracy: percent(correct, graded.length),
    }
  }, [records])

  const catStats = useMemo(
    () =>
      categories
        .map((c) => {
          const list = questionsByCategory[c.id] ?? []
          let done = 0
          let correct = 0
          let graded = 0
          let wrong = 0
          for (const q of list) {
            const rec = records[q.id]
            if (!rec) continue
            done++
            if (rec.grading !== 'pending') {
              graded++
              if (rec.grading === 'correct') correct++
              else wrong++
            }
          }
          return {
            cat: c,
            total: list.length,
            done,
            accuracy: percent(correct, graded),
            wrong,
          }
        })
        .filter((x) => x.done > 0)
        .sort((a, b) => b.done - a.done),
    [records],
  )

  // 最近 7 天做题柱状图
  const weekly = useMemo(() => {
    const days: { label: string; total: number; correct: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - i)
      const start = d.getTime()
      const end = start + 24 * 3600 * 1000
      const entries = history.filter((h) => h.time >= start && h.time < end)
      days.push({
        label: formatDate(start),
        total: entries.length,
        correct: entries.filter((h) => h.grading === 'correct').length,
      })
    }
    return days
  }, [history])

  const maxDaily = Math.max(1, ...weekly.map((d) => d.total))

  const typeStats = useMemo(() => {
    const counts: Record<string, { done: number; correct: number; graded: number }> = {}
    for (const rec of Object.values(records)) {
      const q = questionMap[rec.questionId]
      if (!q) continue
      counts[q.type] ??= { done: 0, correct: 0, graded: 0 }
      counts[q.type].done++
      if (rec.grading !== 'pending') {
        counts[q.type].graded++
        if (rec.grading === 'correct') counts[q.type].correct++
      }
    }
    return counts
  }, [records])

  const weakCats = useMemo(
    () => catStats.filter((c) => c.accuracy < 60 && c.done >= 2).slice(0, 4),
    [catStats],
  )

  if (Object.keys(records).length === 0) {
    return (
      <main className="page page-narrow">
        <div className="card">
          <EmptyState
            icon="📊"
            title="还没有学习数据"
            desc="做完几道题后，这里会展示正确率、分类掌握度与最近趋势"
            action={
              <Link to="/bank" className="btn btn-primary">
                去题库刷题
              </Link>
            }
          />
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">📊 学习统计</h1>
        <p className="page-desc">数据基于本地作答记录实时计算 · 刷新不丢失</p>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">题库总题数</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{stats.done}</div>
          <div className="stat-label">已做题数（{percent(stats.done, stats.total)}%）</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {stats.correct}
          </div>
          <div className="stat-label">答对</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--danger)' }}>
            {stats.wrong}
          </div>
          <div className="stat-label">答错</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{stats.accuracy}%</div>
          <div className="stat-label">总正确率</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--purple)' }}>
            {stats.pending}
          </div>
          <div className="stat-label">待自评解答题</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{Object.keys(favorites).length}</div>
          <div className="stat-label">收藏题数</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{stats.wrong}</div>
          <div className="stat-label">
            <Link to="/wrong" style={{ color: 'inherit' }}>
              错题数量 →
            </Link>
          </div>
        </div>
      </div>

      {weakCats.length > 0 && (
        <div className="card" style={{ padding: '16px 20px', marginBottom: 18, background: 'var(--warning-soft)', border: '1px solid rgba(217,119,6,.25)' }}>
          <strong style={{ fontSize: 13.5 }}>🎯 建议复习：</strong>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
            {weakCats.map((c) => `${c.cat.name}（正确率 ${c.accuracy}%）`).join('、')}
            {' '}—— 建议重做这些分类的错题并回看解析。
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: 18 }}>
        <section className="card" style={{ padding: '18px 20px' }}>
          <h2 className="section-title">📈 各分类掌握度（正确率）</h2>
          {catStats.length === 0 && <p style={{ color: 'var(--text-3)' }}>暂无数据</p>}
          {catStats.map((c) => (
            <div className="bar-row" key={c.cat.id}>
              <div className="bar-name">
                <span>{c.cat.icon}</span>
                <span>{c.cat.name}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.max(2, c.accuracy)}%`,
                    background:
                      c.accuracy >= 80
                        ? 'linear-gradient(90deg,#22c55e,#4ade80)'
                        : c.accuracy >= 60
                          ? 'linear-gradient(90deg,var(--primary),var(--purple))'
                          : 'linear-gradient(90deg,#f97316,#facc15)',
                  }}
                />
              </div>
              <div className="bar-value">
                {c.accuracy}% · {c.done}/{c.total}
              </div>
            </div>
          ))}
        </section>

        <section className="card" style={{ padding: '18px 20px' }}>
          <h2 className="section-title">🔥 最近 7 天做题量</h2>
          <div className="week-chart">
            {weekly.map((d) => (
              <div className="week-col" key={d.label} title={`${d.label}：${d.total} 题，答对 ${d.correct}`}>
                <div
                  className="week-bar"
                  style={{ height: `${Math.max(4, (d.total / maxDaily) * 100)}%` }}
                >
                  {d.correct > 0 && (
                    <div
                      className="correct-part"
                      style={{ height: `${(d.correct / Math.max(1, d.total)) * 100}%`, marginTop: `${100 - (d.correct / Math.max(1, d.total)) * 100}%` }}
                    />
                  )}
                </div>
                <div className="week-label">{d.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11.5, color: 'var(--text-3)', marginTop: 10 }}>
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: '#34d399' }} /> 答对
            </span>
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: 'var(--primary)' }} /> 答错/待自评
            </span>
          </div>

          <h2 className="section-title" style={{ marginTop: 20 }}>🧩 各题型完成情况</h2>
          {Object.entries(typeStats).map(([type, s]) => (
            <div className="bar-row" key={type} style={{ gridTemplateColumns: '64px minmax(0,1fr) 90px' }}>
              <div className="bar-name">{type}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${Math.max(2, percent(s.correct, s.graded))}%` }} />
              </div>
              <div className="bar-value">{percent(s.correct, s.graded)}% · {s.done} 题</div>
            </div>
          ))}
        </section>
      </div>

      <section className="card" style={{ padding: '18px 20px' }}>
        <h2 className="section-title">🕘 最近做题记录</h2>
        {history.slice(0, 12).map((h, i) => {
          const q = questionMap[h.questionId]
          return (
            <div className="recent-item" key={`${h.questionId}-${h.time}-${i}`}>
              <span
                className={`dot dot-${h.grading === 'correct' ? 'correct' : h.grading === 'wrong' ? 'wrong' : 'pending'}`}
              />
              <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {q ? q.question.replace(/[#*`>|]/g, '').replace(/[[\]]/g, '').slice(0, 60) : h.questionId}
              </span>
              <span style={{ color: 'var(--text-3)', fontSize: 11.5, flexShrink: 0 }}>
                {new Date(h.time).toLocaleString()}
              </span>
            </div>
          )
        })}
      </section>
    </main>
  )
}
