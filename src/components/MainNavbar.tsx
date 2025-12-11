import type React from 'react'
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getStoredUsername, clearAuth } from '../services/authService'
import { CartContext } from '../context/CartContext'

function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  )
}

function IconBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 8h12l-1 11H7L6 8z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </svg>
  )
}

export default function MainNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const navigate = useNavigate()
  const cart = useContext(CartContext)!
  const totalQty = cart?.items?.reduce((sum, it) => sum + it.quantity, 0) || 0
  const totalPrice = cart?.items?.reduce((sum, it) => sum + it.price * it.quantity, 0) || 0

  useEffect(() => {
    setUsername(getStoredUsername())

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'auth_username') {
        setUsername(e.newValue)
      }
    }

    const handleAuthChanged = () => {
      setUsername(getStoredUsername())
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('auth-changed', handleAuthChanged as EventListener)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('auth-changed', handleAuthChanged as EventListener)
    }
  }, [])

  const handleLogout = () => {
    clearAuth()
    setUsername(null)
    setAccountOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 text-white shadow-sm">
      {/* Thin top bar with search */}
      <div className="bg-emerald-900/95">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="flex items-center rounded-full border border-emerald-500/50 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-50 shadow-[0_0_0_1px_rgba(16,185,129,0.45)]">
                <IconSearch className="h-4 w-4 text-emerald-200" />
                <input
                  type="text"
                  className="ml-2 w-full bg-transparent outline-none"
                  style={{ color: '#f0fff4' }}
                  placeholder="Search all of our fresh herbal goodies..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar bar */}
      <div className="bg-emerald-800 border-b border-emerald-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Main row */}
          <div className="flex h-24 items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 text-2xl font-semibold tracking-tight">
              <img
                src="https://res.cloudinary.com/djksfayfu/image/upload/v1765446132/ChatGPT_Image_Dec_11__2025__12_40_12_PM-removebg-preview_w3jy4r.png"
                alt="EcoHealth Naturals logo"
                className="h-32 w-auto object-contain"
              />
            </Link>

            {/* Main nav links */}
            <nav
              className="hidden md:flex ml-8 items-center gap-6 text-sm text-emerald-50"
              style={{ fontFamily: '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
            >
              <Link
                to="/quick-shop"
                className="group inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-emerald-700/60"
              >
                <span className="text-orange-400">⚡</span>
                <span className="relative">
                  Quick Shop
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-emerald-200 transition-transform group-hover:scale-x-100" />
                </span>
              </Link>
              <Link
                to="/shop"
                className="group rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-emerald-700/60"
              >
                <span className="relative">
                  Shop
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-emerald-200 transition-transform group-hover:scale-x-100" />
                </span>
              </Link>
              <button
                className="group rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-emerald-700/60"
              >
                <span className="relative">
                  Sustainability
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-emerald-200 transition-transform group-hover:scale-x-100" />
                </span>
              </button>
              <Link
                to="/consultation"
                className="group rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-emerald-700/60"
              >
                <span className="relative">
                  Consultation
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-emerald-200 transition-transform group-hover:scale-x-100" />
                </span>
              </Link>
              <Link
                to="/faqs"
                className="group rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-emerald-700/60"
              >
                <span className="relative">
                  FAQs
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-emerald-200 transition-transform group-hover:scale-x-100" />
                </span>
              </Link>
              <Link
                to="/contact"
                className="group rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-emerald-700/60"
              >
                <span className="relative">
                  Contact
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-emerald-200 transition-transform group-hover:scale-x-100" />
                </span>
              </Link>
            </nav>

            {/* Right side account + cart */}
            <div className="ml-auto hidden lg:flex items-center gap-4 text-sm text-emerald-50">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-medium text-emerald-900 shadow-sm hover:border-emerald-300"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
                    <IconUser className="h-4 w-4" />
                  </span>
                  <span className="flex flex-col items-start leading-tight">
                    <span
                      className="text-[13px]"
                      style={{ fontFamily: '"Dancing Script", cursive', color: '#008000' }}
                    >
                      {username ? `Hello, ${username}!` : 'Hello, Guest!'}
                    </span>
                    <span className="text-[11px] text-emerald-800">
                      {username ? 'View my account ▾' : 'Sign in / Join ▾'}
                    </span>
                  </span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-md border border-emerald-100 bg-white py-1 text-sm shadow-lg">
                    {username ? (
                      <>
                        <Link
                          to="/profile"
                          className="block px-3 py-2 text-[13px] text-emerald-900 hover:bg-emerald-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-3 py-2 text-[13px] text-emerald-900 hover:bg-emerald-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          Orders
                        </Link>
                        <button
                          type="button"
                          onClick={() => setLogoutConfirmOpen(true)}
                          className="block w-full px-3 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-3 py-2 text-[13px] text-emerald-900 hover:bg-emerald-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          Sign in
                        </Link>
                        <Link
                          to="/signup"
                          className="block px-3 py-2 text-[13px] text-emerald-900 hover:bg-emerald-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          Create account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart button in main navbar */}
              <button
                className="flex items-center gap-2 rounded-full bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-emerald-600"
                onClick={() => setCartOpen(true)}
              >
                <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-700">
                  <IconBag className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-400 px-1 text-[10px] font-semibold text-white">
                    {totalQty}
                  </span>
                </span>
                <span className="hidden md:inline">Cart</span>
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="ml-auto flex items-center gap-3 md:hidden">
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className="inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white px-2.5 py-2 text-emerald-800 shadow-sm"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
              </button>
            </div>
          </div>

          {/* (no search bar here; moved to top strip) */}
        </div>
      </div>

      {/* Simple mobile dropdown menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t bg-white">
          <div className="space-y-1 px-4 py-3 text-sm text-emerald-900">
            <Link
              to="/quick-shop"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-emerald-50"
            >
              <span className="flex items-center gap-1">
                <span className="text-orange-500">⚡</span>
                Quick Shop
              </span>
            </Link>
            <Link
              to="/shop"
              className="block w-full rounded-md px-3 py-2 text-left hover:bg-emerald-50"
            >
              Shop
            </Link>
            <button className="block w-full rounded-md px-3 py-2 text-left hover:bg-emerald-50">Sustainability</button>
            <Link to="/faqs" className="block w-full rounded-md px-3 py-2 text-left hover:bg-emerald-50">FAQs</Link>
            <Link to="/contact" className="block w-full rounded-md px-3 py-2 text-left hover:bg-emerald-50">Contact</Link>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-base font-semibold text-gray-900">Your Cart</h3>
              <button className="rounded-md border px-2 py-1 text-sm" onClick={() => setCartOpen(false)}>Close</button>
            </div>
            <div className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-3">
              {cart.items.length === 0 ? (
                <div className="text-sm text-gray-600">Your cart is empty.</div>
              ) : (
                cart.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 rounded-md border p-3">
                    <div className="h-14 w-14 overflow-hidden rounded bg-gray-50">
                      {it.img ? (
                        <img src={it.img} alt={it.title} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="h-full w-full bg-gray-100" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-medium text-gray-900">{it.title}</div>
                      <div className="mt-0.5 text-xs text-gray-600">KShs {it.price} × {it.quantity}</div>
                      <div className="mt-2 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[11px]">
                        <button className="px-1 text-gray-500" onClick={() => cart.updateQuantity(it.id, Math.max(1, it.quantity - 1))}>−</button>
                        <span className="mx-2 text-gray-800">{it.quantity}</span>
                        <button className="px-1 text-gray-700" onClick={() => cart.updateQuantity(it.id, Math.min(99, it.quantity + 1))}>+</button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm font-semibold text-gray-900">KShs {it.price * it.quantity}</div>
                      <button className="text-xs text-red-600 hover:underline" onClick={() => cart.removeItem(it.id)}>Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">KShs {totalPrice}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <button className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50" onClick={() => cart.clear()}>Clear</button>
                <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Checkout</button>
              </div>
            </div>
          </aside>
        </div>
      )}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/10">
            <h2 className="text-base font-semibold text-gray-900">Logout</h2>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to logout?</p>
            <div className="mt-4 flex justify-end gap-3 text-sm">
              <button
                type="button"
                className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                onClick={() => setLogoutConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                onClick={() => {
                  setLogoutConfirmOpen(false)
                  handleLogout()
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
