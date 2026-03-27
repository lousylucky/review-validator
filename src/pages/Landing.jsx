import { useLang } from '../context/LangContext'

export default function Landing() {
  const { t } = useLang()

  return (
    <div className="min-h-screen" data-theme="night">
      {/* Navbar */}
      <nav className="navbar max-w-6xl mx-auto px-6 py-4">
        <div className="flex-1">
          <span className="text-xl font-extrabold text-primary tracking-tight">ReviewValidator</span>
        </div>
        <a href="mailto:contact@review-validator.com" className="btn btn-ghost btn-sm">{t.contact}</a>
      </nav>

      {/* Hero */}
      <header className="text-center px-6 pt-16 pb-12 max-w-3xl mx-auto">
        <div className="badge badge-outline badge-primary mb-6">{t.heroBadge}</div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-6">
          {t.heroTitle1}<br />
          {t.heroTitle2}<span className="text-primary">{t.heroTitle3}</span>
        </h1>
        <p className="text-lg text-base-content/60 leading-relaxed max-w-xl mx-auto mb-8">
          {t.heroSubtitle}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="#how" className="btn btn-primary">
            {t.heroCta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7 17l9.2-9.2M17 17V7.8H7.8"/></svg>
          </a>
          <a href="mailto:contact@review-validator.com" className="btn btn-outline">{t.heroDemo}</a>
        </div>

        {/* Stats */}
        <div className="stats stats-horizontal shadow bg-base-200 mt-12">
          <div className="stat px-6">
            <div className="stat-value text-primary text-2xl">+300%</div>
            <div className="stat-desc">{t.statReviews}</div>
          </div>
          <div className="stat px-6">
            <div className="stat-value text-primary text-2xl">4.8</div>
            <div className="stat-desc">{t.statRating}</div>
          </div>
          <div className="stat px-6">
            <div className="stat-value text-primary text-2xl">2 min</div>
            <div className="stat-desc">{t.statSetup}</div>
          </div>
        </div>
      </header>

      {/* Phone mockups */}
      <section className="flex justify-center items-start gap-8 px-6 py-16" style={{ perspective: '1200px' }}>
        {/* Phone 1 — Review */}
        <div className="w-[260px] shrink-0 rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-3 shadow-2xl" style={{ transform: 'rotateY(-6deg) rotateX(2deg)' }}>
          <div className="rounded-[2rem] bg-base-100 overflow-hidden">
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <span className="text-[10px] text-base-content/40">9:41</span>
              <div className="w-20 h-5 rounded-full bg-black/80 mx-auto" />
              <div className="flex gap-0.5">
                <div className="w-3.5 h-2 rounded-sm bg-base-content/30" />
              </div>
            </div>
            {/* Content */}
            <div className="px-5 py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M5.338 18.326C6.06 15.788 8.799 14 12 14s5.94 1.788 6.662 4.326"/></svg>
              </div>
              <div>
                <p className="font-bold text-lg text-primary">{t.mockupSalon}</p>
                <div className="text-yellow-400 text-base mt-1 tracking-wide">★★★★★</div>
              </div>
              <p className="text-sm text-base-content/60 leading-relaxed">{t.mockupText}</p>
              <div className="pt-1">
                <div className="w-full py-3 rounded-xl bg-primary text-primary-content font-bold text-sm">{t.mockupBtn}</div>
              </div>
            </div>
            {/* Home indicator */}
            <div className="flex justify-center pb-2 pt-4">
              <div className="w-28 h-1 rounded-full bg-base-content/20" />
            </div>
          </div>
        </div>

        {/* Phone 2 — Coupon */}
        <div className="w-[260px] shrink-0 rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-3 shadow-2xl mt-12 hidden md:block" style={{ transform: 'rotateY(6deg) rotateX(2deg)' }}>
          <div className="rounded-[2rem] bg-base-100 overflow-hidden">
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <span className="text-[10px] text-base-content/40">9:42</span>
              <div className="w-20 h-5 rounded-full bg-black/80 mx-auto" />
              <div className="flex gap-0.5">
                <div className="w-3.5 h-2 rounded-sm bg-base-content/30" />
              </div>
            </div>
            {/* Content */}
            <div className="px-5 py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 mx-auto flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-400" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div>
                <p className="font-bold text-lg text-primary">{t.mockupReward}</p>
                <p className="text-xs text-base-content/50 mt-1">{t.mockupCouponHint}</p>
              </div>
              <div className="bg-primary/10 border-2 border-dashed border-primary rounded-2xl py-4 px-3">
                <code className="text-primary font-extrabold text-xl tracking-[0.2em]">LGS-X7K9M2</code>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-green-400 text-xs font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                -10% discount
              </div>
            </div>
            {/* Home indicator */}
            <div className="flex justify-center pb-2 pt-4">
              <div className="w-28 h-1 rounded-full bg-base-content/20" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="badge badge-primary badge-outline mb-3">{t.howLabel}</div>
          <h2 className="text-3xl font-bold text-primary">{t.howTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7z"/></svg>, title: t.step1Title, text: t.step1Text },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, title: t.step2Title, text: t.step2Text },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>, title: t.step3Title, text: t.step3Text },
          ].map((step, i) => (
            <div key={i} className="card bg-base-200 shadow-md hover:shadow-xl transition-shadow">
              <div className="card-body items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content mb-2">
                  {step.icon}
                </div>
                <h3 className="card-title text-base">{step.title}</h3>
                <p className="text-sm text-base-content/60">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="badge badge-primary badge-outline mb-3">{t.benefitsLabel}</div>
          <h2 className="text-3xl font-bold text-primary">{t.benefitsTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, title: t.b1Title, text: t.b1Text },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, title: t.b2Title, text: t.b2Text },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4M4 7v10l8 4m0-10v10"/></svg>, title: t.b3Title, text: t.b3Text },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></svg>, title: t.b4Title, text: t.b4Text },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, title: t.b5Title, text: t.b5Text },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, title: t.b6Title, text: t.b6Text },
          ].map((b, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {b.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{b.title}</h3>
                <p className="text-sm text-base-content/60">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="badge badge-primary badge-outline mb-3">{t.testimonialsLabel}</div>
          <h2 className="text-3xl font-bold text-primary">{t.testimonialsTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { text: t.t1Text, name: t.t1Name, role: t.t1Role, letter: 'S' },
            { text: t.t2Text, name: t.t2Name, role: t.t2Role, letter: 'M' },
            { text: t.t3Text, name: t.t3Name, role: t.t3Role, letter: 'L' },
          ].map((review, i) => (
            <div key={i} className="card bg-base-200 shadow-md">
              <div className="card-body">
                <div className="text-warning text-sm mb-2">★★★★★</div>
                <p className="text-sm text-base-content/70 italic mb-4">{review.text}</p>
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-9">
                      <span className="text-sm">{review.letter}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-base-content/50">{review.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="card bg-primary text-primary-content shadow-2xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl font-bold">{t.ctaTitle}</h2>
            <p className="opacity-80 max-w-md">{t.ctaSubtitle}</p>
            <a href="mailto:contact@review-validator.com" className="btn btn-neutral mt-4">{t.ctaButton}</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-6 text-base-content/40 text-sm">
        <div>
          <span className="font-bold text-primary">ReviewValidator</span>
          <p>&copy; {new Date().getFullYear()} ReviewValidator. {t.rights}</p>
        </div>
      </footer>
    </div>
  )
}
