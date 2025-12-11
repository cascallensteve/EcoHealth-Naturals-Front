import AdminBanner from './AdminBanner'

export default function AdminSettings() {
  return (
    <div className="space-y-6 text-sm">
      <AdminBanner
        title="Settings"
        subtitle="Configure how the EcoHealth admin dashboard behaves for you."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Appearance</h2>
        <p className="text-xs text-slate-500">Theme controls are visual only for now, ready for wiring later.</p>
        <div className="flex items-center gap-4">
          <button className="rounded-full border border-emerald-600 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800">
            Light (default)
          </button>
          <button className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-600">
            Dark (coming soon)
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
        <p className="text-xs text-slate-500">Decide which admin events should notify you. These switches are placeholders for now.</p>
        <div className="space-y-2">
          <label className="flex items-center justify-between gap-4">
            <span>New consultation submitted</span>
            <span className="inline-flex h-5 w-9 items-center rounded-full bg-emerald-600 px-0.5 text-[10px] text-white">
              <span className="ml-auto h-4 w-4 rounded-full bg-white" />
            </span>
          </label>
          <label className="flex items-center justify-between gap-4">
            <span>New contact message received</span>
            <span className="inline-flex h-5 w-9 items-center rounded-full bg-emerald-600 px-0.5 text-[10px] text-white">
              <span className="ml-auto h-4 w-4 rounded-full bg-white" />
            </span>
          </label>
          <label className="flex items-center justify-between gap-4">
            <span>Product goes out of stock</span>
            <span className="inline-flex h-5 w-9 items-center rounded-full bg-slate-200 px-0.5 text-[10px] text-slate-500">
              <span className="h-4 w-4 rounded-full bg-white" />
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
