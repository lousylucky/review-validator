import { useState } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

const EMAILS = [
  'lukaszpiotr.matyasik@gmail.com',
  'aleksandradlugosz112@gmail.com',
]

export default function Reinit() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReinit = async () => {
    setLoading(true)
    setStatus('Recherche en cours...')
    let deleted = 0

    try {
      const salonsSnap = await getDocs(collection(db, 'salons'))
      for (const salonDoc of salonsSnap.docs) {
        const couponsSnap = await getDocs(collection(db, 'salons', salonDoc.id, 'coupons'))
        for (const couponDoc of couponsSnap.docs) {
          const data = couponDoc.data()
          if (EMAILS.includes(data.userEmail)) {
            await deleteDoc(doc(db, 'salons', salonDoc.id, 'coupons', couponDoc.id))
            deleted++
          }
        }
      }
      setStatus(`Terminé. ${deleted} coupon(s) supprimé(s).`)
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
        <p className="text-sm text-base-content/50">{EMAILS.join(', ')}</p>
        <button
          className="px-6 py-3 rounded-xl bg-red-500/15 text-red-400 font-semibold hover:bg-red-500/25 transition-colors disabled:opacity-50"
          onClick={handleReinit}
          disabled={loading}
        >
          {loading ? 'Suppression...' : 'Supprimer les coupons'}
        </button>
        {status && <p className="text-sm text-base-content/70">{status}</p>}
      </div>
    </div>
  )
}
