import { useLang } from '../context/LangContext'

const langs = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'pl', label: 'PL', flag: '🇵🇱' },
]

export default function LangSwitcher() {
  const { lang, changeLang } = useLang()

  return (
    <div className="flex gap-1 rounded-full p-1" style={{ background: 'rgba(255,255,255,0.1)' }}>
      {langs.map((l) => (
        <button
          key={l.code}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all"
          style={{
            background: lang === l.code ? '#e2b04a' : 'transparent',
            color: lang === l.code ? '#1a1a2e' : '#ffffff',
          }}
          onClick={() => changeLang(l.code)}
        >
          <span>{l.flag}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  )
}
