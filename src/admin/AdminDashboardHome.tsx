import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../services/authService'
import AdminBanner from './AdminBanner'

export default function AdminDashboardHome() {
  const navigate = useNavigate()
  const [consultationsCount, setConsultationsCount] = useState<number | null>(null)
  const [messagesCount, setMessagesCount] = useState<number | null>(null)
  const [usersCount, setUsersCount] = useState<number | null>(null)
  const [latestConsultations, setLatestConsultations] = useState<any[]>([])
  const [latestMessages, setLatestMessages] = useState<any[]>([])
  const [allConsultations, setAllConsultations] = useState<any[]>([])
  const [allMessages, setAllMessages] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_auth_token') : null
    if (!token) return

    const headers = {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    }

    const fetchConsultations = fetch(`${API_BASE_URL}/api/consultation/all/`, { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data)) {
          setConsultationsCount(data.length)
          setAllConsultations(data)
          const sorted = [...data].sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
          setLatestConsultations(sorted.slice(0, 2))
        }
      })
      .catch(() => {})

    const fetchContacts = fetch(`${API_BASE_URL}/api/contact/all/`, { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data)) {
          setMessagesCount(data.length)
          setAllMessages(data)
          const sorted = [...data].sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
          setLatestMessages(sorted.slice(0, 2))
        }
      })
      .catch(() => {})

    const fetchUsers = fetch(`${API_BASE_URL}/api/adminauths/users/`, { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data)) {
          setUsersCount(data.length)
          setAllUsers(data)
        }
      })
      .catch(() => {})

    void Promise.all([fetchConsultations, fetchContacts, fetchUsers])
  }, [])

  const consultationsLabel = consultationsCount === null ? '—' : consultationsCount
  const messagesLabel = messagesCount === null ? '—' : messagesCount

  const recentActivity = useMemo(() => {
    const items: { type: 'consultation' | 'message'; title: string; meta?: string }[] = []

    latestMessages.forEach((m: any) => {
      items.push({
        type: 'message',
        title: `New message from ${m.name || m.email || 'customer'}`,
        meta: m.created_at,
      })
    })

    latestConsultations.forEach((c: any) => {
      items.push({
        type: 'consultation',
        title: `New consultation from ${c.name || c.email || 'customer'}`,
        meta: c.created_at,
      })
    })

    return items.slice(0, 4)
  }, [latestMessages, latestConsultations])

  function lastNDays(n: number) {
    const days: string[] = []
    const today = new Date()
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      days.push(d.toISOString().slice(0, 10))
    }
    return days
  }

  function daysRange(startOffsetDays: number, length: number) {
    const days: string[] = []
    const today = new Date()
    for (let i = length - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - startOffsetDays - i)
      days.push(d.toISOString().slice(0, 10))
    }
    return days
  }

  function dailyCounts(items: any[], dateKey: 'created_at' | 'date_joined' = 'created_at') {
    const days = lastNDays(14)
    const map: Record<string, number> = {}
    days.forEach((d) => (map[d] = 0))
    items.forEach((it: any) => {
      const raw = it[dateKey]
      const d = new Date(raw)
      const key = isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
      if (key && key in map) map[key] += 1
    })
    return days.map((d) => map[d])
  }

  function dailyCountsRange(items: any[], startOffsetDays: number, length: number, dateKey: 'created_at' | 'date_joined' = 'created_at') {
    const days = daysRange(startOffsetDays, length)
    const map: Record<string, number> = {}
    days.forEach((d) => (map[d] = 0))
    items.forEach((it: any) => {
      const raw = it[dateKey]
      const d = new Date(raw)
      const key = isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
      if (key && key in map) map[key] += 1
    })
    return days.map((d) => map[d])
  }

  const seriesConsultations = useMemo(() => dailyCounts(allConsultations, 'created_at'), [allConsultations])
  const seriesMessages = useMemo(() => dailyCounts(allMessages, 'created_at'), [allMessages])
  const seriesUsers = useMemo(() => dailyCounts(allUsers, 'date_joined'), [allUsers])

  const prevConsultations = useMemo(() => dailyCountsRange(allConsultations, 14, 14, 'created_at'), [allConsultations])
  const prevMessages = useMemo(() => dailyCountsRange(allMessages, 14, 14, 'created_at'), [allMessages])
  const prevUsers = useMemo(() => dailyCountsRange(allUsers, 14, 14, 'date_joined'), [allUsers])

  function sum(arr: number[]) { return arr.reduce((a, b) => a + b, 0) }
  function growthBadge(cur: number[], prev: number[]) {
    const c = sum(cur)
    const p = Math.max(0, sum(prev))
    const diff = c - p
    const pct = p === 0 ? (c > 0 ? 100 : 0) : Math.round((diff / p) * 100)
    const up = diff >= 0
    const color = up ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-red-700 bg-red-50 border-red-100'
    const icon = up ? 'trending_up' : 'trending_down'
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${color}`}>
        <span className="material-symbols-rounded text-[14px]">{icon}</span>
        {up ? '+' : ''}{diff} ({pct}%) vs prev 14d
      </span>
    )
  }

  function Sparkline({ data, color }: { data: number[]; color: string }) {
    const w = 160
    const h = 48
    const max = Math.max(1, ...data)
    const step = w / Math.max(1, data.length - 1)
    const points = data.map((v, i) => {
      const x = i * step
      const y = h - (v / max) * (h - 6) - 3
      return `${x},${y}`
    })
    const path = points.length ? `M ${points[0]} L ${points.slice(1).join(' ')}` : ''
    const area = points.length
      ? `M 0,${h} L ${points.join(' ')} L ${w},${h} Z`
      : ''
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12">
        <path d={area} fill={color.replace('text-', 'fill-').replace('500', '200')} className="fill-current opacity-30" />
        <path d={path} className={`${color} stroke-current`} fill="none" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <div className="space-y-5">
      <AdminBanner
        subtitle="Track new orders, consultations and contact messages at a glance. Use the cards below to jump straight into the areas that need your attention today."
      />

      <div className="grid gap-4 md:grid-cols-3 text-sm">
        <button
          type="button"
          onClick={() => navigate('/admin/orders')}
          className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-emerald-100 text-left transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Orders today</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">—</p>
              </div>

              <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
                <span className="material-symbols-rounded text-[20px]">receipt_long</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">New store orders received in the last 24 hours.</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/admin/consultations')}
          className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-sky-100 text-left transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Open consultations</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{consultationsLabel}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center text-lg">
                <span className="material-symbols-rounded text-[20px]">chat</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Consultations awaiting review or follow-up.</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/admin/contacts')}
          className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-emerald-100 text-left transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-sky-400" />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">New messages</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{messagesLabel}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
                <span className="material-symbols-rounded text-[20px]">mail</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Recent contact form messages from customers.</p>
          </div>
        </button>
      </div>

      

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)] text-sm">
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-900">Quick actions</h2>
            <span className="text-[11px] text-slate-400">Today</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 text-[11px]">
            <button className="flex flex-col items-start rounded-lg border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-left hover:border-emerald-200 hover:bg-emerald-50">
              <span className="text-xs font-semibold text-emerald-800">Review consultations</span>
              <span className="mt-0.5 text-[11px] text-emerald-700/80">Check new wellness requests</span>
            </button>
            <button className="flex flex-col items-start rounded-lg border border-sky-100 bg-sky-50/70 px-3 py-2 text-left hover:border-sky-200 hover:bg-sky-50">
              <span className="text-xs font-semibold text-sky-800">Respond to messages</span>
              <span className="mt-0.5 text-[11px] text-sky-700/80">Follow up on customer enquiries</span>
            </button>
            <button className="flex flex-col items-start rounded-lg border border-emerald-100 bg-white px-3 py-2 text-left hover:border-emerald-200 hover:bg-emerald-50/70">
              <span className="text-xs font-semibold text-slate-800">Update products</span>
              <span className="mt-0.5 text-[11px] text-slate-600">Keep your offers fresh</span>
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Live
            </span>
          </div>
          <ul className="space-y-2 text-[11px] text-slate-600">
            {recentActivity.length === 0 ? (
              <li className="text-[11px] text-slate-400">New consultations and messages will appear here.</li>
            ) : (
              recentActivity.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className={`material-symbols-rounded text-[18px] mt-[1px] ${item.type === 'consultation' ? 'text-sky-500' : 'text-emerald-500'}`}>
                    {item.type === 'consultation' ? 'chat' : 'mail'}
                  </span>
                  <span>
                    {item.title}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3 text-sm">
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Consultations (14 days)</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{consultationsCount ?? '—'}</p>
              <div className="mt-1">{growthBadge(seriesConsultations, prevConsultations)}</div>
            </div>
            <span className="material-symbols-rounded text-sky-600">medical_information</span>
          </div>
          <div className="mt-2 text-slate-600">
            <Sparkline data={seriesConsultations} color="text-sky-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Messages (14 days)</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{messagesCount ?? '—'}</p>
              <div className="mt-1">{growthBadge(seriesMessages, prevMessages)}</div>
            </div>
            <span className="material-symbols-rounded text-emerald-600">mail</span>
          </div>
          <div className="mt-2 text-slate-600">
            <Sparkline data={seriesMessages} color="text-emerald-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-700">Users (14 days)</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{usersCount ?? '—'}</p>
              <div className="mt-1">{growthBadge(seriesUsers, prevUsers)}</div>
            </div>
            <span className="material-symbols-rounded text-slate-700">group</span>
          </div>
          <div className="mt-2 text-slate-600">
            <Sparkline data={seriesUsers} color="text-slate-700" />
          </div>
        </div>
      </div>
    </div>
  )
}
