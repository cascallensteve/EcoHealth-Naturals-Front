import { getAdminIdentity } from '../services/adminAuthService'
import AdminBanner from './AdminBanner'

export default function AdminProfile() {
  const { email, username } = getAdminIdentity()
  const name = username || email || 'EcoHealth Admin'
  const admin = {
    name,
    email: email || 'admin@ecohealthnaturals.ke',
    role: 'Administrator',
    since: '2024-01-10',
  }

  return (
    <div className="space-y-6">
      <AdminBanner
        title="My profile"
        subtitle="View your EcoHealth Naturals admin details and security information."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-start">
        <div className="flex-shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700 text-white text-2xl font-semibold">
            {admin.name.charAt(0)}
          </div>
        </div>
        <div className="flex-1 text-sm space-y-1">
          <p className="text-base font-semibold text-slate-900">{admin.name}</p>
          <p className="text-slate-700">{admin.email}</p>
          <p className="text-xs text-slate-500">Role: {admin.role}</p>
          <p className="text-xs text-slate-500">Admin since: {new Date(admin.since).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-sm space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">Security</h2>
        <p className="text-xs text-slate-500">For now this is a visual placeholder. Later we can add password change and two-factor settings.</p>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
        >
          Manage security (coming soon)
        </button>
      </div>
    </div>
  )
}
