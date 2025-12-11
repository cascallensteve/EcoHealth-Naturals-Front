import type React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signin, saveAuth } from '../services/authService'

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

function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7.5 12 12l7-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function IconLock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 10V8a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" />
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    try {
      setLoading(true)
      setError(null)
      const auth = await signin({ email, password })
      saveAuth(auth)
      setSuccess(`Login successful, welcome back ${auth.user.username}!`)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
        {/* Tabs */}
        <div className="flex text-sm font-semibold tracking-wide">
          <button
            type="button"
            className="flex-1 bg-[#008000] px-4 py-3 text-center text-white"
          >
            Login
          </button>
          <Link
            to="/signup"
            className="flex-1 bg-gray-100 px-4 py-3 text-center text-gray-700 hover:bg-gray-50"
          >
            Sign Up
          </Link>
        </div>

        <div className="px-6 py-7">
          <h1 className="text-xl font-bold text-gray-900">Welcome back to EcoHealth Naturals</h1>
          <p className="mt-1 text-sm text-gray-600">Sign in to access your herbal goodies and wellness orders.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center rounded-md border border-emerald-100 bg-slate-50 px-3 py-2">
                <IconMail className="h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  required
                  className="ml-2 w-full border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <div className="flex items-center rounded-md border border-emerald-100 bg-slate-50 px-3 py-2">
                <IconLock className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  className="ml-2 w-full border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Remember / forgot */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-emerald-700 hover:underline">Forgot Password?</button>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {success && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {success}
              </div>
            )}

            {/* Primary button */}
            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-[#008000] px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="relative py-2 text-center text-xs text-gray-400">
              <span className="relative bg-white px-2">or continue with</span>
              <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-px bg-gray-200" />
            </div>

            {/* Google button */}
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <GoogleIcon className="h-4 w-4" /> Continue with Google
            </button>
          </form>

          <p className="mt-6 text-center text-xs sm:text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="font-semibold text-emerald-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
