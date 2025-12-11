import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../services/authService'
import AdminBanner from './AdminBanner'

interface AdminConsultationItem {
  id: number
  name: string
  email: string
  phone_number: string
  gender: string
  age: number
  main_concern: string
  symptoms: string
  duration: string
  appointment_time: string
  created_at: string
}

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

function openPrintWindow(html: string, title: string) {
  const win = window.open('', '_blank', 'noopener,noreferrer')
  if (!win) return
  win.document.open()
  win.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #0f172a; }
    h1 { font-size: 20px; margin-bottom: 4px; }
    h2 { font-size: 16px; margin: 16px 0 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left; }
    th { background: #f1f5f9; }
    .meta { font-size: 11px; color: #64748b; margin-bottom: 12px; }
  </style></head><body>${html}</body></html>`)
  win.document.close()
  win.focus()
  // Give the browser a moment to render before printing
  win.onload = () => {
    win.print()
  }
}

export default function AdminConsultations() {
  const [items, setItems] = useState<AdminConsultationItem[]>([])
  const [selected, setSelected] = useState<AdminConsultationItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_auth_token') : null
        if (!token) {
          setError('Admin token missing. Please sign in again to view consultations.')
          setLoading(false)
          return
        }

        const res = await fetch(`${API_BASE_URL}/api/consultation/all/`, {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          let detail = 'Failed to load consultations.'
          try {
            const data = await res.json()
            detail = (data && (data.detail || JSON.stringify(data))) || detail
          } catch {
            // ignore JSON parsing error
          }
          throw new Error(detail)
        }

        const data = (await res.json()) as AdminConsultationItem[]
        const sorted = [...data].sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        setItems(sorted)
        setSelected(sorted[0] ?? null)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load consultations.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this consultation?')) return

    const token = localStorage.getItem('admin_auth_token')
    if (!token) {
      setError('Admin token missing. Please sign in again to delete consultations.')
      return
    }

    try {
      setDeletingId(id)
      setError(null)
      const res = await fetch(`${API_BASE_URL}/api/consultation/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        let detail = 'Failed to delete consultation.'
        try {
          const data = await res.json()
          detail = (data && (data.detail || JSON.stringify(data))) || detail
        } catch {
          // ignore JSON parsing error
        }
        throw new Error(detail)
      }

      setItems((prev) => prev.filter((c) => c.id !== id))
      setSelected((prev) => (prev && prev.id === id ? null : prev))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete consultation.'
      setError(message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownloadAll = () => {
    if (items.length === 0) return
    const rows = items
      .map(
        (c, index) =>
          `<tr><td>${index + 1}</td><td>${c.name}</td><td>${c.email}</td><td>${c.phone_number}</td><td>${c.main_concern}</td><td>${formatDateTime(
            c.appointment_time,
          )}</td></tr>`,
      )
      .join('')
    const html = `
      <h1>Consultations</h1>
      <div class="meta">Exported on ${new Date().toLocaleString()}</div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Main concern</th>
            <th>Appointment</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `
    openPrintWindow(html, 'Consultations')
  }

  const handleDownloadSingle = (c: AdminConsultationItem) => {
    const html = `
      <h1>Consultation</h1>
      <div class="meta">Exported on ${new Date().toLocaleString()}</div>
      <h2>Client</h2>
      <p><strong>Name:</strong> ${c.name}</p>
      <p><strong>Email:</strong> ${c.email}</p>
      <p><strong>Phone:</strong> ${c.phone_number}</p>
      <p><strong>Gender:</strong> ${c.gender}</p>
      <p><strong>Age:</strong> ${c.age}</p>
      <h2>Consultation details</h2>
      <p><strong>Main concern:</strong> ${c.main_concern}</p>
      <p><strong>Symptoms:</strong> ${c.symptoms}</p>
      <p><strong>Duration:</strong> ${c.duration}</p>
      <p><strong>Preferred appointment time:</strong> ${formatDateTime(c.appointment_time)}</p>
      <p class="meta"><strong>Submitted:</strong> ${formatDateTime(c.created_at)}</p>
    `
    openPrintWindow(html, `Consultation – ${c.name}`)
  }

  return (
    <div className="space-y-4">
      <AdminBanner
        title="Consultations"
        subtitle="See all wellness consultation requests and follow up with customers who need support."
      />

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {items.length > 0 ? `${items.length} consultation${items.length === 1 ? '' : 's'}` : 'No consultations yet'}
        </span>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleDownloadAll}
            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Download all as PDF
          </button>
        )}
      </div>

      {!selected && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="px-4 py-10 text-center text-xs text-slate-500">Loading consultations…</div>
          ) : error ? (
            <div className="px-4 py-6 text-center text-xs text-red-600">{error}</div>
          ) : items.length === 0 ? (
            <div className="px-4 py-10 text-center text-xs text-slate-500">No consultations found yet.</div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 w-10">#</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Main concern</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Appointment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => setSelected(item)}
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-500">{index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-slate-900">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.email}</div>
                    </td>
                    <td className="px-4 py-2 text-slate-700 max-w-xs truncate">{item.main_concern}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-slate-500">{formatDateTime(item.appointment_time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selected && (
        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm text-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-emerald-800">Consultation details</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
              >
                Back to list
              </button>
              <button
                type="button"
                onClick={() => selected && handleDownloadSingle(selected)}
                className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                Download as PDF
              </button>
            </div>
          </div>
          <div className="space-y-2 text-slate-800">
            <p><span className="font-medium">Name:</span> {selected.name}</p>
            <p><span className="font-medium">Email:</span> {selected.email}</p>
            <p><span className="font-medium">Phone:</span> {selected.phone_number}</p>
            <p><span className="font-medium">Gender:</span> {selected.gender}</p>
            <p><span className="font-medium">Age:</span> {selected.age}</p>
            <p><span className="font-medium">Main concern:</span> {selected.main_concern}</p>
            <p><span className="font-medium">Symptoms:</span> {selected.symptoms}</p>
            <p><span className="font-medium">Duration:</span> {selected.duration}</p>
            <p><span className="font-medium">Preferred appointment time:</span> {formatDateTime(selected.appointment_time)}</p>
            <p className="text-xs text-slate-500">Submitted: {formatDateTime(selected.created_at)}</p>
            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => handleDelete(selected.id)}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                disabled={deletingId === selected.id}
              >
                {deletingId === selected.id ? 'Deleting…' : 'Delete consultation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
