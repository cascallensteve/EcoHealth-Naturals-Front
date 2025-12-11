import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signup, saveAuth } from '../services/authService'

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.7-5.4 3.7-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.4 3 14.4 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c6.9 0 9.6-4.8 9.6-7.3 0-.5 0-.8-.1-1.2H12z"/>
      <path fill="#34A853" d="M3.8 7.2l3.2 2.3C8 7.3 9.9 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.4 3 14.4 2 12 2 8 2 4.6 4.3 3.8 7.2z"/>
      <path fill="#4A90E2" d="M12 20.4c2.9 0 5.4-1 7.2-2.7l-3.3-2.7c-1 1-2.4 1.6-3.9 1.6-3 .1-5.6-2-6.1-4.9l-3.1 2.4C4.6 18 7.9 20.4 12 20.4z"/>
      <path fill="#FBBC05" d="M20.4 13.1c.2-.6.4-1.2.4-1.9 0-.6-.1-1.3-.3-1.9H12v3.9h8.4z"/>
    </svg>
  )
}

export default function Signup() {
  const rightImg = 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1600&auto=format&fit=crop' // keys/home imagery
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !email || !password || !confirmPassword) return
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      setLoading(true)
      setError(null)
      const auth = await signup({
        username,
        email,
        password,
        password2: confirmPassword,
      })
      saveAuth(auth)
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign up. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        {/* Left: form */}
        <div className="w-full mx-auto md:max-w-md rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create your EcoHealth Naturals account</h1>
            <p className="mt-1 text-sm text-gray-600">Join EcoHealth Naturals for fresh, organic wellness products.</p>
          </div>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600">User created successfully, welcome in.</p>
            )}
            <button
              type="submit"
              className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-white hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <button type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm hover:bg-gray-50">
              <GoogleIcon className="h-4 w-4" /> Continue with Google
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-medium text-gray-900 underline">Sign in</Link>
          </p>
        </div>

        {/* Right: image + benefits card */}
        <div className="relative">
          <div className="h-80 md:h-full w-full overflow-hidden rounded-2xl">
            <img src={rightImg} alt="New homeowner receiving keys" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="absolute -bottom-6 right-6 left-6 md:left-auto md:right-6 md:bottom-6 md:w-80 rounded-2xl bg-white/95 p-5 shadow-lg ring-1 ring-black/10 backdrop-blur">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">★</div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">Welcome to EcoHealth Naturals</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><span className="text-emerald-600">•</span> Quick signup</li>
              <li className="flex items-start gap-2"><span className="text-emerald-600">•</span> Book moves in minutes</li>
              <li className="flex items-start gap-2"><span className="text-emerald-600">•</span> Homes across Kenya</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
