import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth, REVIEW_URL, PLACE_ID } from '../firebase'
import Coupon from './Coupon'

export default function ReviewFlow({ user }) {
  const [status, setStatus] = useState('loading')
  const [couponCode, setCouponCode] = useState(null)

  const docId = `${user.uid}_${PLACE_ID}`

  const checkStatus = useCallback(async () => {
    try {
      const snap = await getDoc(doc(db, 'coupons', docId))
      if (snap.exists()) {
        const data = snap.data()
        if (data.couponCode && data.couponUsed) {
          setStatus('used')
        } else if (data.couponCode) {
          setStatus('has_coupon')
          setCouponCode(data.couponCode)
        } else if (data.reviewStarted) {
          setStatus('pending')
        } else {
          setStatus('blocked')
        }
      } else {
        setStatus('eligible')
      }
    } catch (err) {
      console.error('Erreur de vérification:', err)
      setStatus('eligible')
    }
  }, [docId])

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  useEffect(() => {
    const handleFocus = () => {
      if (status === 'pending') {
        generateCoupon()
      }
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [status])

  const handleWriteReview = async () => {
    try {
      await setDoc(doc(db, 'coupons', docId), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        userPhoto: user.photoURL,
        placeId: PLACE_ID,
        reviewStarted: true,
        createdAt: serverTimestamp(),
      })
      setStatus('pending')
      window.open(REVIEW_URL, '_blank')
    } catch (err) {
      console.error('Erreur lors de la création:', err)
      alert('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  const generateCoupon = async () => {
    const code = 'LGS-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    await setDoc(doc(db, 'coupons', docId), {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
      userPhoto: user.photoURL,
      placeId: PLACE_ID,
      couponCode: code,
      couponUsed: false,
      reviewStarted: true,
      createdAt: serverTimestamp(),
      couponGeneratedAt: serverTimestamp(),
    })
    setCouponCode(code)
    setStatus('has_coupon')
  }

  const handleLogout = () => signOut(auth)

  return (
    <div className="container">
      <div className="card">
        <div className="user-bar">
          {user.photoURL && <img src={user.photoURL} alt="" className="avatar" referrerPolicy="no-referrer" />}
          <span>{user.displayName}</span>
          <button className="btn-link" onClick={handleLogout}>Déconnexion</button>
        </div>

        <h1>Le Grand Salon</h1>

        {status === 'loading' && <div className="spinner" />}

        {status === 'eligible' && (
          <>
            <p className="subtitle">
              Laissez-nous un avis sur Google et recevez un coupon de réduction de <strong>10%</strong> !
            </p>
            <button className="btn btn-primary" onClick={handleWriteReview}>
              Écrire un avis
            </button>
          </>
        )}

        {status === 'pending' && (
          <>
            <p className="subtitle">
              Laissez votre avis sur Google Maps, puis revenez ici.
              Le coupon sera généré automatiquement à votre retour.
            </p>
            <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer" className="btn-link block">
              Ouvrir Google Maps à nouveau
            </a>
          </>
        )}

        {status === 'has_coupon' && <Coupon code={couponCode} />}

        {status === 'used' && (
          <p className="subtitle warning">
            Votre coupon a déjà été utilisé. Merci pour votre avis !
          </p>
        )}

        {status === 'blocked' && (
          <p className="subtitle warning">
            Un coupon a déjà été généré pour ce compte. Il n'est pas possible d'en générer un autre.
          </p>
        )}
      </div>
    </div>
  )
}
