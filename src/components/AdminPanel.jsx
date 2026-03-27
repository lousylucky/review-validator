import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth } from '../firebase'
import { useLang } from '../context/LangContext'

export default function AdminPanel({ user, salon }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [filter, setFilter] = useState('all')
  const { t } = useLang()

  const couponsRef = collection(db, 'salons', salon.id, 'coupons')

  const fetchEntries = async () => {
    setLoading(true)
    const snap = await getDocs(couponsRef)
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
    const prefix = salon.couponPrefix || 'RV'
    const code = prefix + '-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const ref = doc(db, 'salons', salon.id, 'coupons', entry.id)
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
    const ref = doc(db, 'salons', salon.id, 'coupons', entry.id)
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
    const ref = doc(db, 'salons', salon.id, 'coupons', entry.id)
    await updateDoc(ref, { couponUsed: true, couponUsedAt: serverTimestamp() })
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entry.id ? { ...e, couponUsed: true, couponUsedAt: { seconds: Math.floor(Date.now() / 1000) } } : e
      )
    )
    setConfirmId(null)
  }

  const handleLogout = () => signOut(auth)

  const statusBadge = (status) => {
    if (status === 'pending') return 'bg-yellow-500/20 text-yellow-300'
    if (status === 'approved') return 'bg-green-500/20 text-green-300'
    if (status === 'rejected') return 'bg-red-500/20 text-red-300'
    return ''
  }

  const statusLabel = (status) => {
    if (status === 'pending') return t.tabPending
    if (status === 'approved') return t.tabApproved
    if (status === 'rejected') return t.tabRejected
    return status
  }

  const filtered = entries.filter((e) => {
    if (filter !== 'all' && e.status !== filter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (e.userName || '').toLowerCase().includes(q) ||
      (e.userEmail || '').toLowerCase().includes(q) ||
      (e.couponCode || '').toLowerCase().includes(q)
    )
  })

  const handleSearch = (value) => {
    setSearch(value)
    if (value.trim()) setFilter('all')
  }

  const pendingCount = entries.filter((e) => e.status === 'pending').length
  const approvedCount = entries.filter((e) => e.status === 'approved').length
  const rejectedCount = entries.filter((e) => e.status === 'rejected').length

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">{salon.name}</h1>
            <p className="text-sm text-base-content/50">Admin : {user.email}</p>
          </div>
          <button className="text-sm text-base-content/60 hover:text-primary transition-colors" onClick={handleLogout}>{t.logout}</button>
        </div>

        {/* Search */}
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-base-content placeholder:text-base-content/40 outline-none focus:border-primary transition-colors"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Filter tabs */}
        <div role="tablist" className="tabs tabs-boxed">
          <button role="tab" className={`tab ${filter === 'all' ? 'tab-active' : ''}`} onClick={() => setFilter('all')}>
            {t.all} ({entries.length})
          </button>
          <button role="tab" className={`tab ${filter === 'pending' ? 'tab-active' : ''}`} onClick={() => setFilter('pending')}>
            {t.tabPending} ({pendingCount})
          </button>
          <button role="tab" className={`tab ${filter === 'approved' ? 'tab-active' : ''}`} onClick={() => setFilter('approved')}>
            {t.tabApproved} ({approvedCount})
          </button>
          <button role="tab" className={`tab ${filter === 'rejected' ? 'tab-active' : ''}`} onClick={() => setFilter('rejected')}>
            {t.tabRejected} ({rejectedCount})
          </button>
        </div>

        {/* Refresh */}
        <button className="px-4 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-base-content/70 hover:bg-white/10 hover:text-base-content transition-all" onClick={fetchEntries}>{t.refresh}</button>

        {/* Entries */}
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-base-content/50 py-8">{search ? t.noResults : t.noEntries}</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((e) => (
              <div key={e.id} className={`flex items-center gap-4 p-4 rounded-2xl bg-base-200/60 hover:bg-base-200 transition-colors ${e.couponUsed ? 'opacity-40' : ''}`}>
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 min-w-[160px]">
                  {e.userPhoto ? (
                    <div className="avatar"><div className="w-10 rounded-full ring ring-base-300"><img src={e.userPhoto} alt="" referrerPolicy="no-referrer" /></div></div>
                  ) : (
                    <div className="avatar placeholder"><div className="bg-base-300 text-base-content rounded-full w-10"><span>{(e.userName || '?')[0]}</span></div></div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{e.userName || '—'}</p>
                    <p className="text-xs text-base-content/50 truncate">{e.userEmail}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(e.status)}`}>{statusLabel(e.status)}</span>
                  {e.couponUsed && <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-base-300/50 text-base-content/50 ml-1">{t.badgeUsed}</span>}
                </div>

                {/* Coupon code */}
                <div className="hidden md:block">
                  {e.couponCode ? (
                    <code className="text-primary font-bold text-sm tracking-wider">{e.couponCode}</code>
                  ) : (
                    <span className="text-base-content/30 text-sm">—</span>
                  )}
                </div>

                {/* Date */}
                <div className="hidden md:block text-sm text-base-content/50">
                  {e.createdAt ? new Date(e.createdAt.seconds * 1000).toLocaleDateString() : '—'}
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-auto">
                  {e.status === 'pending' && (
                    <>
                      <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors" onClick={() => handleApprove(e)}>{t.approve}</button>
                      <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors" onClick={() => handleReject(e)}>{t.reject}</button>
                    </>
                  )}
                  {e.status === 'approved' && !e.couponUsed && (
                    confirmId === e.id ? (
                      <>
                        <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/25 transition-colors" onClick={() => toggleUsed(e)}>{t.confirm}</button>
                        <button className="px-3 py-1.5 text-xs font-semibold rounded-lg text-base-content/50 hover:text-base-content transition-colors" onClick={() => setConfirmId(null)}>{t.cancel}</button>
                      </>
                    ) : (
                      <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 text-base-content/70 hover:bg-white/10 transition-colors" onClick={() => toggleUsed(e)}>{t.markUsed}</button>
                    )
                  )}
                  {e.status === 'rejected' && (
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors" onClick={() => handleApprove(e)}>{t.approve}</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 text-xs text-base-content/50 pt-2">
          <span>{t.tabPending}: <strong className="text-yellow-400">{pendingCount}</strong></span>
          <span>{t.tabApproved}: <strong className="text-green-400">{approvedCount}</strong></span>
          <span>{t.statsUsed}: <strong className="text-primary">{entries.filter((e) => e.couponUsed).length}</strong></span>
          <span>{t.tabRejected}: <strong className="text-red-400">{rejectedCount}</strong></span>
        </div>
      </div>
    </div>
  )
}
