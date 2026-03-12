import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { Routes, Route, Navigate } from 'react-router-dom'
import { auth, ADMIN_EMAIL } from './firebase'
import Login from './components/Login'
import ReviewFlow from './components/ReviewFlow'
import AdminPanel from './components/AdminPanel'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  const isAdmin = user.email === ADMIN_EMAIL

  return (
    <Routes>
      <Route path="/admin" element={isAdmin ? <AdminPanel user={user} /> : <Navigate to="/" />} />
      <Route path="*" element={isAdmin ? <Navigate to="/admin" /> : <ReviewFlow user={user} />} />
    </Routes>
  )
}
