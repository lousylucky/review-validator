import { useState, useEffect } from 'react'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export default function useSalon(slug) {
  const [salon, setSalon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    const fetchSalon = async () => {
      setLoading(true)
      setError(null)
      try {
        const hostname = window.location.hostname

        // Custom domena — szukaj po polu domain
        if (hostname !== 'localhost' && hostname !== 'review-validator.com' && !hostname.includes('review-validator')) {
          const q = query(collection(db, 'salons'), where('domain', '==', hostname))
          const snap = await getDocs(q)
          if (!snap.empty) {
            const docSnap = snap.docs[0]
            setSalon({ id: docSnap.id, ...docSnap.data() })
            setLoading(false)
            return
          }
        }

        // Szukaj po slug (docId = slug)
        const docSnap = await getDoc(doc(db, 'salons', slug))
        if (docSnap.exists()) {
          setSalon({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError('not_found')
        }
      } catch (err) {
        console.error('Erreur chargement salon:', err)
        setError('error')
      }
      setLoading(false)
    }

    fetchSalon()
  }, [slug])

  return { salon, loading, error }
}
