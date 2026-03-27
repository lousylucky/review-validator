import { useLang } from '../context/LangContext'

export default function Coupon({ code, reward }) {
  const { t } = useLang()

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    alert(t.couponCopied)
  }

  return (
    <div className="text-center space-y-3">
      <h2 className="text-xl font-bold text-primary">{t.couponTitle}</h2>
      <p className="text-base-content/70">{t.couponText} <strong className="text-primary">{reward}</strong>.</p>
      <div
        className="bg-primary/10 border-2 border-dashed border-primary rounded-xl p-4 cursor-pointer hover:bg-primary/20 transition-colors"
        onClick={handleCopy}
      >
        <span className="text-2xl font-bold tracking-widest text-primary font-mono">{code}</span>
        <span className="block text-xs text-base-content/40 mt-1">{t.couponCopy}</span>
      </div>
      <p className="text-xs text-base-content/40">{t.couponNote}</p>
    </div>
  )
}
