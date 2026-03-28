import { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase'

const EMAILS = [
  'lukaszpiotr.matyasik@gmail.com',
  'aleksandradlugosz112@gmail.com',
]

export default function Reinit() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return unsub
  }, [])

  const handleReinit = async () => {
    setLoading(true)
    setStatus('Recherche en cours...')
    let deleted = 0

    try {
      // Pobierz salony gdzie jesteś adminem
      const salonsSnap = await getDocs(collection(db, 'salons'))
      const salons = salonsSnap.docs.filter((d) => {
        const emails = d.data().adminEmail
        return Array.isArray(emails)
          ? emails.includes(user.email)
          : emails === user.email
      })

      const allAdmins = salonsSnap.docs.map((d) => `${d.id}: ${JSON.stringify(d.data().adminEmail)}`)
      const info = [`${salonsSnap.docs.length} salon(s)`, `${salons.length} admin`, `user: "${user.email}"`, ...allAdmins]

      for (const salonDoc of salons) {
        const couponsSnap = await getDocs(collection(db, 'salons', salonDoc.id, 'coupons'))
        info.push(`${salonDoc.id}: ${couponsSnap.docs.length} coupon(s)`)
        for (const couponDoc of couponsSnap.docs) {
          const data = couponDoc.data()
          info.push(`  → ${data.userEmail}`)
          if (EMAILS.includes(data.userEmail)) {
            await deleteDoc(doc(db, 'salons', salonDoc.id, 'coupons', couponDoc.id))
            deleted++
          }
        }
      }
      setStatus(`${deleted} supprimé(s). Debug: ${info.join(' | ')}`)
    } catch (err) {
      console.error(err)
      setStatus(`Erreur: ${err.message}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" data-theme="salon">
      <div className="text-center space-y-4">
        <h1 className="text-xl font-bold text-primary">Reinit coupons</h1>
        <p className="text-sm text-base-content/50">
          Connecté : <strong className="text-base-content">{user ? user.email : 'non connecté'}</strong>
        </p>
        <p className="text-xs text-base-content/40">{EMAILS.join(', ')}</p>
        <button
          className="px-6 py-3 rounded-xl bg-red-500/15 text-red-400 font-semibold hover:bg-red-500/25 transition-colors disabled:opacity-50"
          onClick={handleReinit}
          disabled={loading || !user}
        >
          {loading ? 'Suppression...' : 'Supprimer les coupons'}
        </button>
        {status && <p className="text-sm text-base-content/70">{status}</p>}
      </div>
    </div>
  )
}
