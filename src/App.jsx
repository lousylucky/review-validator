import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import SalonPage from './pages/SalonPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/:slug" element={<SalonPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
