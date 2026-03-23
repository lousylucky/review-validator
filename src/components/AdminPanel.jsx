import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel({ user }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [tab, setTab] = useState('pending')
  const navigate = useNavigate()

  const fetchEntries = async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'coupons'))
    const list = []
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() })
    })
    list.sort((a, b) => {
      const ta = a.createdAt?.seconds || 0
      const tb = b.createdAt?.seconds || 0
      return tb - ta
    })
    setEntries(list)
    setLoading(false)
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const handleApprove = async (entry) => {
    const code = 'LGS-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const ref = doc(db, 'coupons', entry.id)
    await updateDoc(ref, {
      status: 'approved',
      couponCode: code,
      couponUsed: false,
      couponGeneratedAt: serverTimestamp(),
    })
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entry.id
          ? { ...e, status: 'approved', couponCode: code, couponUsed: false, couponGeneratedAt: { seconds: Math.floor(Date.now() / 1000) } }
          : e
      )
    )
  }

  const handleReject = async (entry) => {
    const ref = doc(db, 'coupons', entry.id)
    await updateDoc(ref, { status: 'rejected' })
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entry.id ? { ...e, status: 'rejected' } : e
      )
    )
  }

  const toggleUsed = async (entry) => {
    if (entry.couponUsed) return
    if (confirmId !== entry.id) {
      setConfirmId(entry.id)
      return
    }
    const ref = doc(db, 'coupons', entry.id)
    await updateDoc(ref, { couponUsed: true, couponUsedAt: serverTimestamp() })
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entry.id ? { ...e, couponUsed: true, couponUsedAt: { seconds: Math.floor(Date.now() / 1000) } } : e
      )
    )
    setConfirmId(null)
  }

  const handleLogout = () => signOut(auth)

  const filtered = entries.filter((e) => {
    // Filtruj po zakładce
    if (tab === 'pending' && e.status !== 'pending') return false
    if (tab === 'approved' && e.status !== 'approved') return false
    if (tab === 'rejected' && e.status !== 'rejected') return false

    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (e.userName || '').toLowerCase().includes(q) ||
      (e.userEmail || '').toLowerCase().includes(q)
    )
  })

  const pendingCount = entries.filter((e) => e.status === 'pending').length
  const approvedCount = entries.filter((e) => e.status === 'approved').length
  const rejectedCount = entries.filter((e) => e.status === 'rejected').length

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

        <div className="tabs">
          <button className={`tab ${tab === 'pending' ? 'tab-active' : ''}`} onClick={() => setTab('pending')}>
            En attente ({pendingCount})
          </button>
          <button className={`tab ${tab === 'approved' ? 'tab-active' : ''}`} onClick={() => setTab('approved')}>
            Approuvés ({approvedCount})
          </button>
          <button className={`tab ${tab === 'rejected' ? 'tab-active' : ''}`} onClick={() => setTab('rejected')}>
            Refusés ({rejectedCount})
          </button>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn btn-secondary" onClick={fetchEntries} style={{ marginBottom: '1rem' }}>
          Rafraîchir la liste
        </button>

        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <p>{search ? 'Aucun résultat.' : 'Aucune entrée.'}</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Date</th>
                  {tab === 'approved' && <th>Coupon</th>}
                  {tab === 'approved' && <th>Utilisé</th>}
                  {tab === 'approved' && <th>Date d'utilisation</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className={e.couponUsed ? 'used' : ''}>
                    <td>
                      <div className="user-cell">
                        {e.userPhoto && (
                          <img src={e.userPhoto} alt="" className="avatar-sm" referrerPolicy="no-referrer" />
                        )}
                        {e.userName || '—'}
                      </div>
                    </td>
                    <td>{e.userEmail}</td>
                    <td>{e.createdAt ? new Date(e.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : '—'}</td>

                    {tab === 'approved' && <td className="mono">{e.couponCode}</td>}
                    {tab === 'approved' && (
                      <td>
                        {e.couponUsed ? (
                          <span className="badge-used">Utilisé</span>
                        ) : confirmId === e.id ? (
                          <div className="confirm-actions">
                            <button className="btn-confirm" onClick={() => toggleUsed(e)}>Confirmer</button>
                            <button className="btn-cancel" onClick={() => setConfirmId(null)}>Annuler</button>
                          </div>
                        ) : (
                          <button className="btn-mark" onClick={() => toggleUsed(e)}>Marquer utilisé</button>
                        )}
                      </td>
                    )}
                    {tab === 'approved' && (
                      <td>{e.couponUsedAt ? new Date(e.couponUsedAt.seconds * 1000).toLocaleDateString('fr-FR') : '—'}</td>
                    )}

                    <td>
                      {tab === 'pending' && (
                        <div className="confirm-actions">
                          <button className="btn-approve" onClick={() => handleApprove(e)}>Approuver</button>
                          <button className="btn-reject" onClick={() => handleReject(e)}>Refuser</button>
                        </div>
                      )}
                      {tab === 'rejected' && (
                        <button className="btn-approve" onClick={() => handleApprove(e)}>Approuver</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="stats">
          <span>En attente : {pendingCount}</span>
          <span>Approuvés : {approvedCount}</span>
          <span>Utilisés : {entries.filter((e) => e.couponUsed).length}</span>
          <span>Refusés : {rejectedCount}</span>
        </div>
      </div>
    </div>
  )
}
