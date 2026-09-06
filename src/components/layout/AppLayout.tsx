import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  BookOpen,
  BookX,
  ChartColumn,
  House,
  Mic,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { useStudyStore } from '../../store/useStudyStore'
import { questions } from '../../data'
import { percent } from '../../utils'

const NAV_ITEMS: { to: string; icon: LucideIcon; label: string; wrongBadge?: boolean }[] = [
  { to: '/', icon: House, label: '首页' },
  { to: '/bank', icon: BookOpen, label: '题库' },
  { to: '/wrong', icon: BookX, label: '错题本', wrongBadge: true },
  { to: '/favorites', icon: Star, label: '收藏' },
  { to: '/stats', icon: ChartColumn, label: '统计' },
  { to: '/interview', icon: Mic, label: '面试模式' },
]

export function AppLayout() {
  const location = useLocation()
  const records = useStudyStore((s) => s.records)
  const favorites = useStudyStore((s) => s.favorites)

  const summary = useMemo(() => {
    const graded = Object.values(records).filter((r) => r.grading !== 'pending')
    const correct = graded.filter((r) => r.grading === 'correct').length
    return {
      done: Object.keys(records).length,
      total: questions.length,
      accuracy: percent(correct, graded.length),
    }
  }, [records])

  const wrongCount = useMemo(
    () => Object.values(records).filter((r) => r.grading === 'wrong').length,
    [records],
  )

  // 切换页面时回到顶部
  const [lastPath, setLastPath] = useState(location.pathname)
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname)
    window.scrollTo(0, 0)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img className="brand-logo brand-logo-img" src="./myblog.png" alt="logo" />
          <div>
            <div className="brand-title">前端面试刷题</div>
            <div className="brand-sub">FE Interview Quiz</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">
                <item.icon size={16} strokeWidth={2} />
              </span>
              {item.label}
              {item.wrongBadge && wrongCount > 0 && (
                <span className="nav-badge">{wrongCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-footer-row">
            <span>学习进度</span>
            <strong>
              {summary.done}/{summary.total}
            </strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${percent(summary.done, summary.total)}%` }}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            总正确率 <strong style={{ color: 'var(--text)' }}>{summary.accuracy}%</strong>
            {' · '}收藏 <strong style={{ color: 'var(--text)' }}>{Object.keys(favorites).length}</strong>
          </div>
        </div>
      </aside>

      <div className="main-area">
        {/* 移动端顶栏 */}
        <div className="mobile-topbar">
          <img className="brand-logo brand-logo-img" src="./myblog.png" alt="logo" />
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  )
}
