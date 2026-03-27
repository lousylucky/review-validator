import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card bg-base-200 shadow-xl w-full max-w-sm">
        <div className="card-body items-center text-center">
          <h1 className="text-5xl font-bold text-primary">404</h1>
          <p className="text-base-content/60">Page introuvable.</p>
          <Link to="/" className="btn btn-primary btn-sm mt-2">Retour</Link>
        </div>
      </div>
    </div>
  )
}
