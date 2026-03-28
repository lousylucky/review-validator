import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 8080
const distPath = join(__dirname, 'dist')

// Pliki z hashem w nazwie — cache na długo
app.use('/assets', express.static(join(distPath, 'assets'), {
  maxAge: '1y',
  immutable: true,
}))

// Reszta statycznych plików — bez cache
app.use(express.static(distPath, {
  maxAge: 0,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-cache')
  },
}))

// SPA fallback
app.use((req, res) => {
  res.set('Cache-Control', 'no-cache')
  res.sendFile(join(distPath, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
