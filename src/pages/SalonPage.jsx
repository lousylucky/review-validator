import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { useLang } from '../context/LangContext'
import useSalon from '../hooks/useSalon'
import Login from '../components/Login'
import ReviewFlow from '../components/ReviewFlow'
import AdminPanel from '../components/AdminPanel'

export default function SalonPage() {
  const { slug } = useParams()
  const { salon, loading: salonLoading, error } = useSalon(slug)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const { t } = useLang()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  const wrap = (children) => (
    <div data-theme="salon" className="min-h-screen bg-base-100">
      {children}
    </div>
  )

  if (salonLoading || authLoading) {
    return wrap(
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (error === 'not_found') {
    return wrap(
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card bg-base-200 shadow-xl w-full max-w-sm">
          <div className="card-body items-center text-center">
            <h1 className="card-title text-primary">{t.salonNotFound}</h1>
            <p className="text-base-content/60">{t.notFound}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return wrap(
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card bg-base-200 shadow-xl w-full max-w-sm">
          <div className="card-body items-center text-center">
            <h1 className="card-title text-error">{t.error}</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return wrap(<Login salon={salon} />)
  }

  const adminEmails = Array.isArray(salon.adminEmail) ? salon.adminEmail : [salon.adminEmail]
  const isAdmin = adminEmails.includes(user.email)

  if (isAdmin) {
    return wrap(<AdminPanel user={user} salon={salon} />)
  }

  return wrap(<ReviewFlow user={user} salon={salon} />)
}
