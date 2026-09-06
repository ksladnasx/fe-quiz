import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Home } from './pages/Home'
import { QuestionBank } from './pages/QuestionBank'
import { Practice } from './pages/Practice'
import { WrongBook } from './pages/WrongBook'
import { Favorites } from './pages/Favorites'
import { Stats } from './pages/Stats'
import { Interview } from './pages/Interview'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/bank" element={<QuestionBank />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/wrong" element={<WrongBook />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
