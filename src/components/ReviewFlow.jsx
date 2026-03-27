import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth } from '../firebase'
import { useLang } from '../context/LangContext'
import Coupon from './Coupon'

export default function ReviewFlow({ user, salon }) {
  const [status, setStatus] = useState('loading')
  const [couponCode, setCouponCode] = useState(null)
  const { t } = useLang()

  const docId = user.uid
  const reviewUrl = `https://search.google.com/local/writereview?placeid=${salon.placeId}`

  const checkStatus = useCallback(async () => {
    try {
      const snap = await getDoc(doc(db, 'salons', salon.id, 'coupons', docId))
      if (snap.exists()) {
        const data = snap.data()
        if (data.status === 'rejected') {
          setStatus('rejected')
        } else if (data.couponCode && data.couponUsed) {
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
      console.error('Check status error:', err)
      setStatus('eligible')
    }
  }, [docId, salon.id])

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  const handleWriteReview = async () => {
    try {
      window.open(reviewUrl, '_blank')
      await setDoc(doc(db, 'salons', salon.id, 'coupons', docId), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        userPhoto: user.photoURL,
        placeId: salon.placeId,
        reviewStarted: true,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setStatus('pending')
      addDoc(collection(db, 'mail'), {
        to: salon.adminEmail,
        message: {
          subject: `Nouvel avis - ${user.displayName} (${salon.name})`,
          html: `<p><strong>${user.displayName}</strong> (${user.email}) a soumis une demande de coupon pour <strong>${salon.name}</strong>.</p>
                 <p>Connectez-vous au panneau d'administration pour valider ou refuser cette demande.</p>`,
        },
      }).catch(() => {})
    } catch (err) {
      console.error('Write review error:', err)
      alert(t.error)
    }
  }

  const handleLogout = () => signOut(auth)

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card bg-base-200 shadow-xl w-full max-w-sm">
        <div className="card-body items-center text-center">
          <div className="flex items-center gap-2 w-full mb-2">
            {user.photoURL && <div className="avatar"><div className="w-8 rounded-full"><img src={user.photoURL} alt="" referrerPolicy="no-referrer" /></div></div>}
            <span className="text-sm text-base-content/60">{user.displayName}</span>
            <button className="btn btn-ghost btn-xs ml-auto" onClick={handleLogout}>{t.logout}</button>
          </div>

          <h1 className="text-2xl font-bold text-primary">{salon.name}</h1>

          {status === 'loading' && <span className="loading loading-spinner loading-md text-primary" />}

          {status === 'eligible' && (
            <>
              <p className="text-base-content/60">
                {t.writeReviewHint} <strong className="text-primary">{salon.reward}</strong> !
              </p>
              <button className="btn btn-primary w-full" onClick={handleWriteReview}>
                {t.writeReview}
              </button>
              <p className="text-xs text-base-content/40 mt-1">{t.qrHint}</p>
            </>
          )}

          {status === 'pending' && (
            <div className="alert alert-info">
              <span>{t.pending}</span>
            </div>
          )}

          {status === 'has_coupon' && <Coupon code={couponCode} reward={salon.reward} />}

          {status === 'used' && (
            <div className="alert alert-warning"><span>{t.used}</span></div>
          )}

          {status === 'rejected' && (
            <div className="alert alert-error"><span>{t.rejected}</span></div>
          )}

          {status === 'blocked' && (
            <div className="alert alert-warning"><span>{t.blocked}</span></div>
          )}
        </div>
      </div>
    </div>
  )
}
