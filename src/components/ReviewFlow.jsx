import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth, REVIEW_URL, PLACE_ID, ADMIN_EMAIL } from '../firebase'
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
      console.error('Erreur de vérification:', err)
      setStatus('eligible')
    }
  }, [docId])

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  const handleWriteReview = async () => {
    try {
      window.open(REVIEW_URL, '_blank')
      await setDoc(doc(db, 'coupons', docId), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        userPhoto: user.photoURL,
        placeId: PLACE_ID,
        reviewStarted: true,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setStatus('pending')
      // Email do admina — nie blokuje głównego flow
      addDoc(collection(db, 'mail'), {
        to: ADMIN_EMAIL,
        message: {
          subject: `Nouvel avis - ${user.displayName}`,
          html: `<p><strong>${user.displayName}</strong> (${user.email}) a soumis une demande de coupon.</p>
                 <p>Connectez-vous au panneau d'administration pour valider ou refuser cette demande.</p>`,
        },
      }).catch(() => {})
    } catch (err) {
      console.error('Erreur lors de la création:', err)
      alert('Une erreur est survenue. Veuillez réessayer.')
    }
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
            <p className="subtitle" style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
              Pour revenir après avoir ajouté un avis, scannez le QR code à nouveau.
            </p>
          </>
        )}

        {status === 'pending' && (
          <p className="subtitle">
            Votre demande est en cours de vérification. Vous recevrez votre coupon une fois l'avis validé par notre équipe.
          </p>
        )}

        {status === 'has_coupon' && <Coupon code={couponCode} />}

        {status === 'used' && (
          <p className="subtitle warning">
            Votre coupon a déjà été utilisé. Merci pour votre avis !
          </p>
        )}

        {status === 'rejected' && (
          <p className="subtitle warning">
            Votre demande a été refusée. Veuillez vérifier que vous avez bien laissé un avis sur Google Maps.
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
