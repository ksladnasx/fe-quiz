import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Star } from 'lucide-react'
import { questionMap } from '../data'
import { useStudyStore } from '../store/useStudyStore'
import { EmptyState, StatusText, TypeBadge, DifficultyBadge, CategoryTag } from '../components/common/ui'

export function Favorites() {
  const navigate = useNavigate()
  const favorites = useStudyStore((s) => s.favorites)
  const records = useStudyStore((s) => s.records)
  const toggleFavorite = useStudyStore((s) => s.toggleFavorite)

  const list = useMemo(
    () =>
      Object.entries(favorites)
        .sort(([, a], [, b]) => b - a)
        .map(([id, time]) => ({ question: questionMap[id], time, record: records[id] }))
        .filter((x) => x.question),
    [favorites, records],
  )

  return (
    <main className="page page-narrow">
      <div className="page-header">
        <h1 className="page-title">
          <Star size={20} />
          我的收藏
        </h1>
        <p className="page-desc">共 {list.length} 道收藏题 · 点击星标可取消收藏</p>
      </div>

      {list.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<Star size={40} strokeWidth={1.5} />}
            title="还没有收藏题目"
            desc="刷题时点击题目右上角的星标图标即可收藏重点题"
            action={
              <button className="btn btn-primary" onClick={() => navigate('/bank')}>
                去题库刷题
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="card filter-bar">
            <button
              className="btn btn-primary"
              onClick={() =>
                navigate('/practice', {
                  state: { ids: list.map((x) => x.question.id), title: '我的收藏练习' },
                })
              }
            >
              <BookOpen size={14} />
              开始刷收藏题（{list.length}）
            </button>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {list.map(({ question, time, record }) => (
              <div
                key={question.id}
                className="q-row"
                onClick={() =>
                  navigate('/practice', {
                    state: { ids: [question.id], title: '收藏题练习' },
                  })
                }
              >
                <div className="q-row-meta">
                  <TypeBadge type={question.type} />
                  <DifficultyBadge difficulty={question.difficulty} />
                  <CategoryTag category={question.category} sub={question.subCategory} />
                  <div className="q-row-status">
                    <StatusText grading={record?.grading ?? 'none'} />
                  </div>
                </div>
                <div className="q-row-title" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <button
                    className="fav-btn active"
                    style={{ margin: 0 }}
                    title="取消收藏"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(question.id)
                    }}
                  >
                    <Star size={15} fill="currentColor" />
                  </button>
                  <span>{question.question.replace(/[#*`>]/g, '')}</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                  收藏于 {new Date(time).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
