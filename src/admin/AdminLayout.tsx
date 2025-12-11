import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { clearAdminAuth, getAdminIdentity } from '../services/adminAuthService'
import { subscribeToNotifications, playBeep } from '../services/notificationService'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifCount, setNotifCount] = useState(0)
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const { email, username } = getAdminIdentity()
  const displayName = username || email || 'Admin user'
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: 'space_dashboard' },
    { to: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
    { to: '/admin/patients', label: 'All patients', icon: 'diversity_3' },
    { to: '/admin/programs', label: 'Programs', icon: 'menu_book' },
    { to: '/admin/prescriptions', label: 'Prescribed drugs', icon: 'medication' },
    { to: '/admin/users', label: 'Users', icon: 'group' },
    { to: '/admin/contacts', label: 'Contact messages', icon: 'mail' },
    { to: '/admin/consultations', label: 'Consultations', icon: 'chat' },
    { to: '/admin/products', label: 'Products', icon: 'shopping_cart' },
    { to: '/admin/profile', label: 'My profile', icon: 'account_circle' },
    { to: '/admin/settings', label: 'Settings', icon: 'settings' },
  ]

  // Subscribe for new notification events (contacts/consultations)
  useEffect(() => {
    const unsubscribe = subscribeToNotifications(async () => {
      setNotifCount((n) => n + 1)
      try {
        await playBeep(220)
      } catch {
        // ignore audio failures (e.g., autoplay restrictions)
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-950 to-sky-900 text-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-emerald-900/40 bg-slate-950/70 backdrop-blur-xl shadow-lg">
        <div className="px-5 py-4 border-b border-emerald-800/60 flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/90 flex items-center justify-center text-slate-950 text-lg font-bold">
            EH
          </div>
          <div>
            <Link to="/admin" className="text-sm font-semibold text-emerald-50 block">
              EcoHealth Admin
            </Link>
            <p className="text-[11px] text-emerald-200/80">Wellness operations console</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 text-sm space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={classNames(
                  'flex items-center gap-2 rounded-lg px-3 py-2 transition-colors',
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-emerald-100/80 hover:bg-emerald-900/50 hover:text-white',
                )}
              >
                <span className="material-symbols-rounded text-[20px]">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {item.to === '/admin/contacts' && (
                  <span className="ml-auto inline-flex h-5 min-w-[1.3rem] items-center justify-center rounded-full bg-emerald-500/20 px-1 text-[10px] font-semibold text-emerald-100">
                    New
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <div className={classNames(
        'md:hidden fixed inset-0 z-40 transition',
        sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}>
        <div
          className={classNames(
            'absolute inset-0 bg-black/40 transition-opacity',
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setSidebarOpen(false)}
        />
        <aside
          className={classNames(
            'absolute left-0 top-0 h-full w-72 bg-slate-950/95 backdrop-blur-xl shadow-xl border-r border-emerald-900/40 transform transition-transform',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="px-5 py-4 border-b border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/90 flex items-center justify-center text-slate-950 text-lg font-bold">
                EH
              </div>
              <div>
                <Link to="/admin" className="text-sm font-semibold text-emerald-50 block" onClick={() => setSidebarOpen(false)}>
                  EcoHealth Admin
                </Link>
                <p className="text-[11px] text-emerald-200/80">Wellness operations console</p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-emerald-200 hover:bg-emerald-900/40"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="material-symbols-rounded">close</span>
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 text-sm space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={classNames(
                    'flex items-center gap-2 rounded-lg px-3 py-2 transition-colors',
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-emerald-100/80 hover:bg-emerald-900/50 hover:text-white',
                  )}
                >
                  <span className="material-symbols-rounded text-[20px]">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                  {item.to === '/admin/contacts' && (
                    <span className="ml-auto inline-flex h-5 min-w-[1.3rem] items-center justify-center rounded-full bg-emerald-500/20 px-1 text-[10px] font-semibold text-emerald-100">
                      New
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </aside>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 text-sm shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-emerald-700 hover:bg-emerald-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <span className="material-symbols-rounded">menu</span>
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-500 to-sky-500 text-white flex items-center justify-center text-sm font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500">Welcome back,</span>
              <span className="font-medium text-slate-800">{displayName}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <button
              type="button"
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              onClick={() => {
                setNotifCount(0)
                try { playBeep(60) } catch {}
              }}
            >
              <span className="material-symbols-rounded text-[18px]">notifications</span>
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold text-white">
                  {Math.min(notifCount, 99)}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                clearAdminAuth()
                navigate('/admin/login', { replace: true })
              }}
              className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-500/20"
            >
              <span className="material-symbols-rounded text-[16px]">power_settings_new</span>
              <span>Logout</span>
            </button>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[11px] text-slate-500">EcoHealth Naturals • Admin</span>
              <span className="font-medium text-slate-700">{today}</span>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
