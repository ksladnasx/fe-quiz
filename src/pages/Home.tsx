import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categories, questionMap, questions, questionsByCategory, shuffle } from '../data'
import { useStudyStore } from '../store/useStudyStore'
import { percent, formatTime } from '../utils'
import { ProgressBar, StatusText } from '../components/common/ui'

export function Home() {
  const navigate = useNavigate()
  const records = useStudyStore((s) => s.records)
  const history = useStudyStore((s) => s.history)

  const overall = useMemo(() => {
    const graded = Object.values(records).filter((r) => r.grading !== 'pending')
    const correct = graded.filter((r) => r.grading === 'correct').length
    return {
      total: questions.length,
      done: Object.keys(records).length,
      correct,
      accuracy: percent(correct, graded.length),
    }
  }, [records])

  const catStats = useMemo(
    () =>
      categories.map((c) => {
        const list = questionsByCategory[c.id] ?? []
        let done = 0
        let correct = 0
        let graded = 0
        for (const q of list) {
          const rec = records[q.id]
          if (!rec) continue
          done++
          if (rec.grading !== 'pending') {
            graded++
            if (rec.grading === 'correct') correct++
          }
        }
        return { cat: c, total: list.length, done, accuracy: percent(correct, graded) }
      }),
    [records],
  )

  const recent = useMemo(
    () =>
      history.slice(0, 8).map((h) => ({
        ...h,
        question: questionMap[h.questionId],
      })),
    [history],
  )

  function startQuick(mode: 'random20' | 'undone' | 'wrong') {
    if (mode === 'random20') {
      const ids = shuffle(questions).slice(0, 20).map((q) => q.id)
      navigate('/practice', { state: { ids, title: '随机练习 20 题' } })
    } else if (mode === 'undone') {
      navigate('/practice?status=undone&order=random')
    } else {
      navigate('/practice?status=wrong&order=random')
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <h1 className="hero-title">前端面试刷题系统</h1>
        <p className="hero-desc">
          基于「面试知识 docs」知识体系构建的纯前端刷题与复习系统：覆盖 HTML/CSS、JavaScript、浏览器原理、计算机网络、
          Vue、React、性能优化、工程化、算法、业务场景与项目经验 11 大板块，支持客观题自动判分、解答题对照面试参考答案、
          错题本、收藏、学习统计与模拟面试。
        </p>
        <div className="hero-actions">
          <button className="btn btn-lg btn-primary" onClick={() => startQuick('random20')}>
            ⚡ 快速开始 · 随机 20 题
          </button>
          <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }} onClick={() => startQuick('undone')}>
            📖 刷未做的题
          </button>
          <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }} onClick={() => startQuick('wrong')}>
            📕 错题重做
          </button>
          <Link to="/interview" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }}>
            🎤 模拟面试
          </Link>
        </div>
        <div className="hero-stats">
          <div>
            <div className="hero-stat-value">{overall.total}</div>
            <div className="hero-stat-label">题库总题数</div>
          </div>
          <div>
            <div className="hero-stat-value">{overall.done}</div>
            <div className="hero-stat-label">已完成</div>
          </div>
          <div>
            <div className="hero-stat-value">{overall.accuracy}%</div>
            <div className="hero-stat-label">总正确率</div>
          </div>
          <div>
            <div className="hero-stat-value">{categories.length}</div>
            <div className="hero-stat-label">知识分类</div>
          </div>
        </div>
      </section>

      <h2 className="section-title">📚 知识分类</h2>
      <div className="grid-cats">
        {catStats.map(({ cat, total, done, accuracy }) => (
          <Link key={cat.id} to={`/bank?cat=${cat.id}`} className="card cat-card">
            <div className="cat-card-head">
              <div className="cat-icon" style={{ background: `${cat.color}1a`, color: cat.color }}>
                {cat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div className="cat-name">{cat.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                  {done}/{total} 已完成 · 正确率 {accuracy}%
                </div>
              </div>
            </div>
            <div className="cat-desc">{cat.description}</div>
            <ProgressBar value={done} max={total} />
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <section className="card" style={{ padding: '18px 20px' }}>
          <h2 className="section-title" style={{ marginBottom: 8 }}>
            🕘 最近做题记录
          </h2>
          {recent.length === 0 ? (
            <p style={{ color: 'var(--text-3)', fontSize: 13, padding: '16px 0' }}>
              还没有做题记录，点击上方「快速开始」开启刷题之旅吧。
            </p>
          ) : (
            recent.map((r, i) => (
              <div className="recent-item" key={`${r.questionId}-${r.time}-${i}`}>
                <span className={`dot dot-${r.grading === 'correct' ? 'correct' : r.grading === 'wrong' ? 'wrong' : 'pending'}`} />
                <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {r.question ? r.question.question.replace(/[#*`>|]/g, '').replace(/[[\]]/g, '').slice(0, 48) : r.questionId}
                </span>
                <StatusText grading={r.grading} />
                <span style={{ color: 'var(--text-3)', fontSize: 11.5, flexShrink: 0 }}>
                  {formatTime(r.time).slice(5, 16)}
                </span>
              </div>
            ))
          )}
        </section>

        <section className="card" style={{ padding: '18px 20px' }}>
          <h2 className="section-title" style={{ marginBottom: 8 }}>
            🎯 复习路线（来自 docs 目录索引）
          </h2>
          <ol style={{ margin: '10px 0 0', paddingLeft: 20, fontSize: 13, color: 'var(--text-2)', lineHeight: 2 }}>
            <li>
              <strong>基础层</strong>：HTML / CSS / JavaScript 基础、基础算法
            </li>
            <li>
              <strong>进阶层</strong>：原型闭包与异步、浏览器与网络原理、Vue / React 框架
            </li>
            <li>
              <strong>项目与场景层</strong>：性能优化、工程化、大文件上传与并发、项目经验、FastAPI
            </li>
            <li>
              <strong>冲刺</strong>：错题重做 + 面试模式模拟 + 高频反问准备
            </li>
          </ol>
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/bank" className="btn btn-sm">
              进入题库 →
            </Link>
            <Link to="/stats" className="btn btn-sm">
              查看统计 →
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
