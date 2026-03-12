export default function Coupon({ code }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    alert('Code copié !')
  }

  return (
    <div className="coupon">
      <div className="coupon-badge">-10%</div>
      <h2>Votre coupon de réduction</h2>
      <p className="subtitle">Merci pour votre avis ! Présentez ce coupon en caisse.</p>
      <div className="coupon-code" onClick={handleCopy}>
        {code}
        <span className="copy-hint">cliquez pour copier</span>
      </div>
      <p className="coupon-note">Coupon à usage unique. Valable jusqu'à révocation.</p>
    </div>
  )
}
