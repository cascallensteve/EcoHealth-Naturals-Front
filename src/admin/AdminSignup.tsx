import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminSignup, type AdminSignupPayload, saveAdminToken, saveAdminIdentity } from '../services/adminAuthService'

export default function AdminSignup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const payload: AdminSignupPayload = {
      username,
      email,
      password,
    }

    try {
      setLoading(true)
      const res = await adminSignup(payload)
      if (res.token) {
        saveAdminToken(res.token)
      }
      saveAdminIdentity(email, username)
      setSuccess(res.message || 'Admin created successfully. Verification code sent to email.')
      // After a short delay, send user to admin login
      setTimeout(() => {
        navigate('/admin/login', { replace: true })
      }, 1800)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create admin account.'
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
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Admin sign up</h1>
          <p className="mt-1 text-xs text-slate-500">Create a secure admin account to manage EcoHealth data.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Username</label>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="adminuser"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
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
                placeholder="StrongPassword123"
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
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="w-full rounded-md border border-slate-200 px-3 py-2 pr-9 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[11px] text-slate-500 hover:text-slate-700"
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
          {success && <p className="text-xs text-emerald-700">{success}</p>}

          <button
            type="submit"
            className="mt-1 w-full rounded-md bg-emerald-700 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating admin…' : 'Create admin account'}
          </button>

          <p className="mt-3 text-[11px] text-slate-500 text-center">
            Already have an admin account?{' '}
            <button
              type="button"
              className="font-semibold text-emerald-700 hover:text-emerald-900"
              onClick={() => navigate('/admin/login')}
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
