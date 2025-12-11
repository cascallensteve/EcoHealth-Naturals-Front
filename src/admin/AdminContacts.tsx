import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../services/authService'
import AdminBanner from './AdminBanner'

interface AdminContactItem {
  id: number
  name: string
  email: string
  phone_number: string
  main_concern: string
  created_at: string
}

function formatDate(value: string) {
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
  win.onload = () => {
    win.print()
  }
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<AdminContactItem[]>([])
  const [selected, setSelected] = useState<AdminContactItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_auth_token') : null
        if (!token) {
          setError('Admin token missing. Please sign in again to view contact messages.')
          setLoading(false)
          return
        }

        const res = await fetch(`${API_BASE_URL}/api/contact/all/`, {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          let detail = 'Failed to load contact messages.'
          try {
            const data = await res.json()
            detail = (data && (data.detail || JSON.stringify(data))) || detail
          } catch {
            // ignore JSON parsing error
          }
          throw new Error(detail)
        }

        const data = (await res.json()) as AdminContactItem[]
        setContacts(data)
        setSelected(data[0] ?? null)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load contact messages.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) return

    const token = localStorage.getItem('admin_auth_token')
    if (!token) {
      setError('Admin token missing. Please sign in again to delete contact messages.')
      return
    }

    try {
      setDeletingId(id)
      setError(null)
      const res = await fetch(`${API_BASE_URL}/api/contact/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        let detail = 'Failed to delete contact message.'
        try {
          const data = await res.json()
          detail = (data && (data.detail || JSON.stringify(data))) || detail
        } catch {
          // ignore JSON parsing error
        }
        throw new Error(detail)
      }

      setContacts((prev) => prev.filter((c) => c.id !== id))
      setSelected((prev) => (prev && prev.id === id ? null : prev))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete contact message.'
      setError(message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownloadAll = () => {
    if (contacts.length === 0) return
    const rows = contacts
      .map(
        (c) =>
          `<tr><td>${c.name}</td><td>${c.email}</td><td>${c.phone_number}</td><td>${c.main_concern}</td><td>${formatDate(
            c.created_at,
          )}</td></tr>`,
      )
      .join('')
    const html = `
      <h1>Contact messages</h1>
      <div class="meta">Exported on ${new Date().toLocaleString()}</div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Main concern</th>
            <th>Received</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `
    openPrintWindow(html, 'Contact messages')
  }

  const handleDownloadSingle = (c: AdminContactItem) => {
    const html = `
      <h1>Contact message</h1>
      <div class="meta">Exported on ${new Date().toLocaleString()}</div>
      <h2>Contact</h2>
      <p><strong>Name:</strong> ${c.name}</p>
      <p><strong>Email:</strong> ${c.email}</p>
      <p><strong>Phone:</strong> ${c.phone_number}</p>
      <h2>Message</h2>
      <p><strong>Main concern:</strong> ${c.main_concern}</p>
      <p class="meta"><strong>Received:</strong> ${formatDate(c.created_at)}</p>
    `
    openPrintWindow(html, `Contact – ${c.name}`)
  }

  return (
    <div className="space-y-4">
      <AdminBanner
        title="Contact messages"
        subtitle="Review and manage questions and enquiries submitted from the public contact form."
      />

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {contacts.length > 0
            ? `${contacts.length} contact message${contacts.length === 1 ? '' : 's'}`
            : 'No contact messages yet'}
        </span>
        {contacts.length > 0 && (
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
            <div className="px-4 py-10 text-center text-xs text-slate-500">Loading contact messages…</div>
          ) : error ? (
            <div className="px-4 py-6 text-center text-xs text-red-600">{error}</div>
          ) : contacts.length === 0 ? (
            <div className="px-4 py-10 text-center text-xs text-slate-500">No contact messages found yet.</div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Phone</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Main concern</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelected(item)}
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-slate-900">{item.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-slate-700">{item.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-slate-700">{item.phone_number}</td>
                    <td className="px-4 py-2 text-slate-700 max-w-xs truncate">{item.main_concern}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-slate-500">{formatDate(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selected && (
        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm text-sm text-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-emerald-800">Message from {selected.name}</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                onClick={() => setSelected(null)}
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
          <p className="text-xs text-slate-500 mb-1">Received: {formatDate(selected.created_at)}</p>
          <p className="mb-1"><span className="font-medium">Email:</span> {selected.email}</p>
          <p className="mb-1"><span className="font-medium">Phone:</span> {selected.phone_number}</p>
          <p className="mt-2 whitespace-pre-line"><span className="font-medium">Main concern:</span> {selected.main_concern}</p>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => handleDelete(selected.id)}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
              disabled={deletingId === selected.id}
            >
              {deletingId === selected.id ? 'Deleting…' : 'Delete message'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
