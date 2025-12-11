import { useEffect, useMemo, useState } from 'react'
import AdminBanner from './AdminBanner'
import { API_BASE_URL } from '../services/authService'

interface AdminUserItem {
  id: number
  username: string
  email: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_auth_token') : null
        if (!token) {
          setError('Admin token missing. Please sign in again to view users.')
          setLoading(false)
          return
        }

        const res = await fetch(`${API_BASE_URL}/api/adminauths/users/`, {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          let detail = 'Failed to load users.'
          try {
            const data = await res.json()
            detail = (data && (data.detail || JSON.stringify(data))) || detail
          } catch {
            // ignore
          }
          throw new Error(detail)
        }

        const data = (await res.json()) as AdminUserItem[]
        setUsers(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load users.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())

      const isAdmin = !!u.is_staff
      const matchesRole =
        roleFilter === 'all' || (roleFilter === 'admin' && isAdmin) || (roleFilter === 'user' && !isAdmin)

      return matchesSearch && matchesRole
    })
  }, [users, search, roleFilter])

  useEffect(() => {
    setPage(1)
  }, [search, roleFilter])

  const total = filteredUsers.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, total)
  const pagedUsers = filteredUsers.slice(startIndex, endIndex)

  return (
    <div className="space-y-4">
      <AdminBanner
        title="Users"
        subtitle="View all admin and staff accounts that can access EcoHealth Naturals systems."
      />

      {!selectedUser && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="w-full sm:w-64 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All</option>
                <option value="admin">Admins</option>
                <option value="user">Users</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm text-sm">
            {loading ? (
              <div className="px-4 py-10 text-center text-xs text-slate-500">Loading users…</div>
            ) : error ? (
              <div className="px-4 py-6 text-center text-xs text-red-600">{error}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="px-4 py-10 text-center text-xs text-slate-500">No users found yet.</div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Username</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Date joined</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 text-xs text-slate-500">{u.id}</td>
                      <td className="px-4 py-2 text-slate-900">{u.username}</td>
                      <td className="px-4 py-2 text-slate-700">{u.email}</td>
                      <td className="px-4 py-2 text-xs text-slate-700">{u.is_staff ? 'Admin' : 'User'}</td>
                      <td className="px-4 py-2 text-xs">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            u.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {u.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-slate-500">{formatDate(u.date_joined)}</td>
                      <td className="px-4 py-2 text-right text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-[11px]">
              <div className="text-slate-600">
                Showing <span className="font-semibold text-slate-900">{total === 0 ? 0 : startIndex + 1}</span>
                {' '}to{' '}
                <span className="font-semibold text-slate-900">{endIndex}</span> of{' '}
                <span className="font-semibold text-slate-900">{total}</span> users
              </div>
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 font-semibold ${currentPage === 1 ? 'border-slate-200 text-slate-300 bg-white' : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'}`}
                >
                  <span className="material-symbols-rounded text-[16px]">chevron_left</span>
                  Prev
                </button>
                {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                  const pageNum = i + 1
                  // show first 7 pages max for simplicity; can enhance later
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      className={`h-8 min-w-8 px-2 rounded-md border text-[11px] font-semibold ${pageNum === currentPage ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                {totalPages > 7 && (
                  <span className="px-1 text-slate-400">…</span>
                )}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 font-semibold ${currentPage === totalPages ? 'border-slate-200 text-slate-300 bg-white' : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'}`}
                >
                  Next
                  <span className="material-symbols-rounded text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedUser && (
        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm text-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-emerald-800">User details</h2>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="text-[11px] text-emerald-700 hover:text-emerald-900"
            >
              Close
            </button>
          </div>
          <div className="space-y-1 text-slate-800 text-[13px]">
            <p><span className="font-medium">Username:</span> {selectedUser.username}</p>
            <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
            <p><span className="font-medium">Role:</span> {selectedUser.is_staff ? 'Admin' : 'User'}</p>
            <p><span className="font-medium">Status:</span> {selectedUser.is_active ? 'Active' : 'Inactive'}</p>
            <p><span className="font-medium">Joined:</span> {formatDate(selectedUser.date_joined)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
