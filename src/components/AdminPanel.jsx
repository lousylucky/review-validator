import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel({ user }) {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const navigate = useNavigate()

  const fetchCoupons = async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'coupons'))
    const list = []
    snap.forEach((d) => {
      const data = d.data()
      if (data.couponCode) {
        list.push({ id: d.id, ...data })
      }
    })
    list.sort((a, b) => {
      const ta = a.couponGeneratedAt?.seconds || 0
      const tb = b.couponGeneratedAt?.seconds || 0
      return tb - ta
    })
    setCoupons(list)
    setLoading(false)
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const toggleUsed = async (coupon) => {
    if (coupon.couponUsed) return
    if (confirmId !== coupon.id) {
      setConfirmId(coupon.id)
      return
    }
    const ref = doc(db, 'coupons', coupon.id)
    await updateDoc(ref, { couponUsed: true, couponUsedAt: serverTimestamp() })
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === coupon.id ? { ...c, couponUsed: true, couponUsedAt: { seconds: Math.floor(Date.now() / 1000) } } : c
      )
    )
    setConfirmId(null)
  }

  const handleLogout = () => signOut(auth)

  const filtered = coupons.filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (c.userName || '').toLowerCase().includes(q) ||
      (c.userEmail || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="container">
      <div className="card admin-card">
        <div className="user-bar">
          <span>Admin : {user.email}</span>
          <div>
            <button className="btn-link" onClick={() => navigate('/')}>Accueil</button>
            <button className="btn-link" onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>

        <h1>Panneau d'administration</h1>
        <p className="subtitle">Liste des coupons et avis</p>

        <input
          type="text"
          className="search-input"
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn btn-secondary" onClick={fetchCoupons} style={{ marginBottom: '1rem' }}>
          Rafraîchir la liste
        </button>

        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <p>{search ? 'Aucun résultat.' : 'Aucun coupon.'}</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Coupon</th>
                  <th>Date</th>
                  <th>Utilisé</th>
                  <th>Date d'utilisation</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className={c.couponUsed ? 'used' : ''}>
                    <td>
                      <div className="user-cell">
                        {c.userPhoto && (
                          <img
                            src={c.userPhoto}
                            alt=""
                            className="avatar-sm"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        {c.userName || '—'}
                      </div>
                    </td>
                    <td>{c.userEmail}</td>
                    <td className="mono">{c.couponCode}</td>
                    <td>{c.couponGeneratedAt ? new Date(c.couponGeneratedAt.seconds * 1000).toLocaleDateString('fr-FR') : '—'}</td>
                    <td>
                      {c.couponUsed ? (
                        <span className="badge-used">Utilisé</span>
                      ) : confirmId === c.id ? (
                        <div className="confirm-actions">
                          <button className="btn-confirm" onClick={() => toggleUsed(c)}>Confirmer</button>
                          <button className="btn-cancel" onClick={() => setConfirmId(null)}>Annuler</button>
                        </div>
                      ) : (
                        <button className="btn-mark" onClick={() => toggleUsed(c)}>Marquer utilisé</button>
                      )}
                    </td>
                    <td>{c.couponUsedAt ? new Date(c.couponUsedAt.seconds * 1000).toLocaleDateString('fr-FR') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="stats">
          <span>Total : {coupons.length}</span>
          <span>Utilisés : {coupons.filter((c) => c.couponUsed).length}</span>
          <span>Actifs : {coupons.filter((c) => !c.couponUsed).length}</span>
        </div>
      </div>
    </div>
  )
}
