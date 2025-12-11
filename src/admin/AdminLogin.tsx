import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, saveAdminToken, saveAdminIdentity, type AdminLoginPayload } from '../services/adminAuthService'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please enter your admin email and password.')
      return
    }

    try {
      setLoading(true)
      const payload: AdminLoginPayload = { email, password }
      const res = await adminLogin(payload)
      if (res.token) {
        saveAdminToken(res.token)
      }
      saveAdminIdentity(email)
      navigate('/admin', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in as admin.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase">EcoHealth Naturals</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Admin sign in</h1>
          <p className="mt-1 text-xs text-slate-500">Secure access for EcoHealth team members.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Admin email</label>
            <input
              type="email"
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ecohealthnaturals.ke"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-md border border-slate-200 px-3 py-2 pr-9 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[11px] text-slate-500 hover:text-slate-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-emerald-700 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500 text-center space-y-1">
            <p>This area is restricted to EcoHealth Naturals administrators only.</p>
            <p>
              New admin?{' '}
              <button
                type="button"
                className="font-semibold text-emerald-700 hover:text-emerald-900"
                onClick={() => navigate('/admin/signup')}
              >
                Create an admin account
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
