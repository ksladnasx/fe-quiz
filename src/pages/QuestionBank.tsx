import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  categories,
  subCategoriesByCategory,
} from '../data'
import { filterQuestions, parseFilters, filtersToQuery } from '../utils/filters'
import { QUESTION_TYPE_LABEL, DIFFICULTY_LABEL, type QuestionType, type Difficulty } from '../types'
import { useStudyStore } from '../store/useStudyStore'
import { EmptyState, StatusText, CategoryTag, TypeBadge, DifficultyBadge } from '../components/common/ui'

export function QuestionBank() {
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const records = useStudyStore((s) => s.records)
  const favorites = useStudyStore((s) => s.favorites)
  const filters = useMemo(() => parseFilters(sp), [sp])
  const [order, setOrder] = useState<'seq' | 'random'>('seq')
  const [limit, setLimit] = useState(50)

  const results = useMemo(() => filterQuestions(filters), [filters])

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(sp)
    if (value) next.set(key, value)
    else next.delete(key)
    navigate(`/bank?${next.toString()}`)
  }

  function startPractice(startId?: string) {
    const f = { ...filters, start: startId, order }
    navigate(`/practice?${filtersToQuery(f)}`)
  }

  const hasFilter =
    filters.category || filters.sub || filters.type || filters.diff ||
    (filters.status && filters.status !== 'all') || filters.search

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">📚 题库</h1>
        <p className="page-desc">
          共 {results.length} 道题符合当前条件 · 支持按分类、题型、难度、完成状态筛选与全文搜索
        </p>
      </div>

      <div className="card filter-bar">
        <select
          className="select"
          value={filters.category ?? ''}
          onChange={(e) => {
            updateParam('cat', e.target.value)
            updateParam('sub', '')
          }}
        >
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={filters.sub ?? ''}
          onChange={(e) => updateParam('sub', e.target.value)}
          disabled={!filters.category}
        >
          <option value="">全部子分类</option>
          {(subCategoriesByCategory[filters.category ?? ''] ?? []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={filters.type ?? ''}
          onChange={(e) => updateParam('type', e.target.value as QuestionType | '')}
        >
          <option value="">全部题型</option>
          {Object.entries(QUESTION_TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={filters.diff ?? ''}
          onChange={(e) => updateParam('diff', e.target.value as Difficulty | '')}
        >
          <option value="">全部难度</option>
          {Object.entries(DIFFICULTY_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={filters.status ?? 'all'}
          onChange={(e) => updateParam('status', e.target.value)}
        >
          <option value="all">全部状态</option>
          <option value="undone">未做过</option>
          <option value="correct">已答对</option>
          <option value="wrong">已答错</option>
          <option value="pending">待自评</option>
        </select>

        <input
          className="input"
          style={{ flex: 1, minWidth: 160 }}
          placeholder="搜索题干、解析、关键词…"
          value={filters.search ?? ''}
          onChange={(e) => updateParam('q', e.target.value)}
        />

        <select
          className="select"
          value={order}
          onChange={(e) => setOrder(e.target.value as 'seq' | 'random')}
        >
          <option value="seq">顺序刷题</option>
          <option value="random">随机刷题</option>
        </select>

        <button
          className="btn btn-primary"
          disabled={results.length === 0}
          onClick={() => startPractice()}
        >
          开始刷题（{results.length}）
        </button>
        {hasFilter && (
          <button className="btn btn-sm" onClick={() => navigate('/bank')}>
            清空筛选
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="🔍"
            title="没有符合条件的题目"
            desc="调整筛选条件或清空筛选试试"
          />
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {results.slice(0, limit).map((q) => {
            const rec = records[q.id]
            return (
              <div
                key={q.id}
                className="q-row"
                onClick={() => startPractice(q.id)}
                title="点击开始刷题（从该题起）"
              >
                <div className="q-row-meta">
                  <TypeBadge type={q.type} />
                  <DifficultyBadge difficulty={q.difficulty} />
                  <CategoryTag category={q.category} sub={q.subCategory} />
                  {favorites[q.id] && <span className="tag" style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}>★ 已收藏</span>}
                  <div className="q-row-status">
                    <StatusText grading={rec?.grading ?? 'none'} />
                    {rec && rec.attempts > 1 && <span>· 做过 {rec.attempts} 次</span>}
                  </div>
                </div>
                <div className="q-row-title">{q.question.replace(/[#*`>]/g, '')}</div>
              </div>
            )
          })}
          {results.length > limit && (
            <div style={{ padding: 16, textAlign: 'center' }}>
              <button className="btn btn-sm" onClick={() => setLimit((l) => l + 50)}>
                加载更多（还有 {results.length - limit} 道）
              </button>
            </div>
          )}
        </div>
      )}

      <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 14, textAlign: 'center' }}>
        点击任意题目即可从该题开始刷题 · 数据保存在浏览器本地，刷新不丢失 ·{' '}
        <Link to="/">返回首页</Link>
      </p>
    </main>
  )
}
