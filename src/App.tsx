import type React from 'react'
import { useEffect, useState } from 'react'
import {
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from 'react-router-dom'
// Simple inline icons to avoid adding new dependencies
function IconHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function AdminProtectedLayout() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_auth_token') : null
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }
  return <AdminLayout />
}

// How we work section with vehicles
export function HowWeWork() {
  const vehicles = [
    { title: 'Pick-up', img: 'https://images.unsplash.com/photo-1584342174763-6f8f83a2fb5e?q=80&w=1600&auto=format&fit=crop' },
    { title: 'Lorry (3T)', img: 'https://images.unsplash.com/photo-1600359754315-96068bbf3e6c?q=80&w=1600&auto=format&fit=crop' },
    { title: 'Lorry (7T)', img: 'https://images.unsplash.com/photo-1602321402258-a2286d82c59f?q=80&w=1600&auto=format&fit=crop' },
    { title: 'TukTuk', img: 'https://images.unsplash.com/photo-1542641728-6ca359b085f4?q=80&w=1600&auto=format&fit=crop' },
    { title: 'Van', img: 'https://images.unsplash.com/photo-1593941707874-ef25b8b04a65?q=80&w=1600&auto=format&fit=crop' },
  ]
  return (
    <section id="how-we-work" className="mx-auto max-w-7xl px-6 py-14">
      <h2 className="text-2xl font-semibold text-gray-900">How we work</h2>
      <p className="mt-1 text-gray-600">Choose the right vehicle for your move. We’ll handle packing, loading, and safe delivery.</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {vehicles.map((v, i) => (
          <div key={i} className="overflow-hidden rounded-xl border bg-white shadow-sm ring-1 ring-black/5">
            <div className="h-32 w-full overflow-hidden">
              <img src={v.img} alt={v.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="p-3 text-center text-sm font-medium text-gray-900">{v.title}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 text-sm shadow-sm ring-1 ring-black/5">
          <div className="font-semibold text-gray-900">1. Tell us about your move</div>
          <p className="mt-1 text-gray-600">Pickup and drop-off, date, floors, packing needs, and any notes.</p>
        </div>
        <div className="rounded-xl border bg-white p-5 text-sm shadow-sm ring-1 ring-black/5">
          <div className="font-semibold text-gray-900">2. We match the right vehicle</div>
          <p className="mt-1 text-gray-600">Pick-up, tuk tuk, van, or lorry based on distance and load.</p>
        </div>
        <div className="rounded-xl border bg-white p-5 text-sm shadow-sm ring-1 ring-black/5">
          <div className="font-semibold text-gray-900">3. Book and move</div>
          <p className="mt-1 text-gray-600">Transparent pricing in KSh and professional movers on time.</p>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/start-moving" className="inline-flex items-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black">Book your move</Link>
      </div>
    </section>
  )
}

export function PromoBanner() {
  const phoneImg = 'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?q=80&w=1600&auto=format&fit=crop'
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="rounded-3xl border bg-white shadow-sm ring-1 ring-black/5 p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
              You’ve watched.
              <br />
              You’ve waited.
              <br />
              <span className="text-emerald-600">Now it’s time to move.</span>
            </h3>
            <div className="mt-6">
              <a href="#" className="inline-flex items-center rounded-full bg-gray-900 px-5 py-3 text-white hover:bg-black">See the report</a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border ring-1 ring-black/10">
              <img src={phoneImg} alt="Phone with moving insights" className="h-64 w-full object-cover md:h-72" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Full-bleed feature article section
export function FeatureArticle() {
  const bg = 'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=1800&auto=format&fit=crop'
  return (
    <section
      className="relative isolate overflow-hidden mt-10"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative mx-auto max-w-5xl px-6 py-24 text-center text-white">
        <p className="text-sm tracking-wide uppercase text-white/80">Unique Homes</p>
        <h3 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
          EcoHealth Naturals Spotlight: Everyday wellness made fresh and organic
        </h3>
        <button className="mt-6 inline-flex items-center rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-white">
          Explore EcoHealth Naturals
        </button>
      </div>
    </section>
  )
}

// Split CTA section for mortgage pre-approval
export function PreApprovalCTA() {
  const img = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop'
  return (
    <section className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-0 px-6 py-14 lg:py-16 items-stretch">
      <div className="h-72 lg:h-auto overflow-hidden rounded-2xl lg:rounded-2xl">
        <img src={img} alt="Young professional at desk" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex items-center">
        <div className="px-0 lg:px-10">
          <h3 className="text-3xl font-extrabold tracking-tight text-gray-900">Want to relocate? Book us now</h3>
          <p className="mt-3 text-gray-600 max-w-prose">We’ll help you move smoothly from A to B—trucks, packing, and storage included. Just book and we’ll handle the rest.</p>
          <div className="mt-6">
            <a href="#" className="inline-flex items-center rounded-full bg-gray-900 px-5 py-3 text-white hover:bg-black">Book us now</a>
          </div>
          <div className="mt-4">
            <a href="#" className="text-sm text-gray-600 underline">How booking works</a>
          </div>
        </div>
      </div>
    </section>
  )
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop'

// Currency formatter for Kenyan Shillings
const kes = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
});
import MainNavbar from './components/MainNavbar'
import MainFooter from './components/MainFooter'
import Login from './components/Login'
import Signup from './components/Signup'
import Hero from './components/Hero'
import EssentialOffers from './components/EssentialOffers'
import WhyChooseUs from './components/WhyChooseUs'
import TopSellers from './components/TopSellers'
import OrganicSection from './components/OrganicSection'
import FaqPreview from './components/FaqPreview'
import TestimonialsAndApp from './components/TestimonialsAndApp'
import Contact from './components/Contact'
import Faqs from './components/Faqs'
import Consultation from './components/Consultation'
import ProductDetail from './components/ProductDetail'
import QuickShop from './components/QuickShop'
import Shop from './components/Shop'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboardHome from './admin/AdminDashboardHome'
import AdminContacts from './admin/AdminContacts'
import AdminConsultations from './admin/AdminConsultations'
import AdminProducts from './admin/AdminProducts'
import AdminProfile from './admin/AdminProfile'
import AdminSettings from './admin/AdminSettings'
import AdminSignup from './admin/AdminSignup'
import AdminUsers from './admin/AdminUsers'
import AdminPatients from './admin/AdminPatients'
import AdminPrograms from './admin/AdminPrograms'
import AdminPrescriptions from './admin/AdminPrescriptions'
import { getStoredUsername, getStoredEmail, clearAuth } from './services/authService'

function Home() {
  return (
    <>
      <Hero />
      <EssentialOffers />
      <WhyChooseUs />
      <TopSellers />
      <OrganicSection />
      <FaqPreview />
      <TestimonialsAndApp />
    </>
  )
}

function ProfilePage() {
  const [username] = useState(() => getStoredUsername())
  const [email] = useState(() => getStoredEmail())

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Top row: profile info + hero image side by side */}
      <div className="grid gap-6 md:grid-cols-[280px,1fr] items-stretch">
        {/* Left: user summary */}
        <aside className="rounded-2xl border bg-white p-6 shadow-sm flex flex-col items-stretch">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400 text-3xl font-semibold">
              {username ? username.charAt(0).toUpperCase() : 'E'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold" style={{ color: '#008000', fontFamily: '"Dancing Script", cursive' }}>
                Welcome!
              </div>
              <div className="text-sm font-semibold text-gray-900 truncate">
                {username || 'Guest user'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {email || 'No email on file'}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-[#008000] px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-emerald-800"
              onClick={() => {
                clearAuth()
                window.location.href = '/'
              }}
            >
              LOGOUT
            </button>
          </div>

          <nav className="mt-6 space-y-2 text-sm">
            <button className="flex w-full items-center justify-between rounded-full border border-gray-200 bg-white px-4 py-2 text-left text-gray-800 hover:border-emerald-400">
              <span>Manage My Account</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-full border border-emerald-500 bg-emerald-50 px-4 py-2 text-left text-gray-900">
              <span>Order History</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-full border border-gray-200 bg-white px-4 py-2 text-left text-gray-800 hover:border-emerald-400">
              <span>Quick Shop</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-full border border-gray-200 bg-white px-4 py-2 text-left text-gray-800 hover:border-emerald-400">
              <span>Account Funds</span>
            </button>
          </nav>

          {/* Delete account section */}
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700">
            <div className="font-semibold text-[13px] mb-1">Delete my account</div>
            <p className="mb-2">This will permanently remove your EcoHealth Naturals account data.</p>
            <button
              type="button"
              className="rounded-full border border-red-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-600 hover:bg-red-100"
            >
              DELETE ACCOUNT
            </button>
          </div>
        </aside>

        {/* Right: hero image */}
        <section className="rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="h-52 w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?q=80&w=1600&auto=format&fit=crop"
              alt="Fresh toast with toppings"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </section>
      </div>

      {/* Orders strip below */}
      <section className="mt-4 flex items-center justify-between rounded-2xl border bg-white px-6 py-4 text-sm text-gray-700 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">●</span>
          <span>No order has been made yet.</span>
        </div>
        <button
          type="button"
          className="rounded-md border border-[#008000] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#008000] hover:bg-emerald-50"
        >
          BROWSE PRODUCTS
        </button>
      </section>
    </main>
  )
}

function IconHouse(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  )
}

export function NewestListings() {
  const items = [
    {
      newLabel: 'New • 4 hours ago',
      type: 'Single-Family Home',
      price: 39000000,
      beds: 3,
      baths: 1,
      sqft: 1275,
      address1: '2212 Brandon Rd',
      address2: 'Nairobi, KE 00100',
      img: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=1600&auto=format&fit=crop',
    },
    {
      newLabel: 'New • 4 hours ago',
      type: 'Condo',
      price: 52500000,
      beds: 4,
      baths: 3,
      sqft: 2419,
      address1: '130 La Salle St',
      address2: 'Nairobi, KE 00100',
      img: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1600&auto=format&fit=crop',
    },
    {
      newLabel: 'New • 8 hours ago',
      type: 'Condo',
      price: 30000000,
      beds: 2,
      baths: 2,
      sqft: 1209,
      address1: '805 March Ct Apt B',
      address2: 'Nairobi, KE 00100',
      img:
        'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1600&auto=format&fit=crop',
    },
    {
      newLabel: 'New • 8 hours ago',
      type: 'Single-Family Home',
      price: 66500000,
      beds: 3,
      baths: 3,
      sqft: 2349,
      address1: '6105 Motts Village Rd Lot 181',
      address2: 'Nairobi, KE 00100',
      img:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
    },
  ]

  const [seen, setSeen] = useState<{[k: number]: boolean}>({})
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal-new')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const i = Number((entry.target as HTMLElement).dataset.index)
        if (entry.isIntersecting) {
          setSeen((prev) => ({ ...prev, [i]: true }))
        } else {
          // reset when it leaves so it will animate again next time
          setSeen((prev) => ({ ...prev, [i]: false }))
        }
      })
    }, { threshold: 0.2 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-6 pt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Newest Listings</h2>
        <a href="#" className="text-sm text-blue-600 hover:underline">View all in Nairobi, KE</a>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, idx) => {
          const entered = !!seen[idx]
          const from = idx % 2 === 0 ? '-translate-x-8' : 'translate-x-8'
          return (
            <div
              key={idx}
              className={`reveal-new transform transition-all duration-700 ease-out ${entered ? 'translate-x-0 opacity-100' : `${from} opacity-0`}`}
              data-index={idx}
            >
              <article className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/5">
                {/* Media */}
                <div className="relative h-40 w-full">
                  <Link to={`/property/${idx + 1}`}>
                    {it.img ? (
                      <img src={it.img} alt={it.type} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                        <IconHouse className="h-10 w-10" />
                      </div>
                    )}
                  </Link>
                  <span className="absolute left-4 top-3 inline-flex rounded-full bg-blue-600 px-2.5 py-1 text-xs font-medium text-white">
                    {it.newLabel}
                  </span>
                  <button className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 ring-1 ring-black/10 backdrop-blur hover:bg-white">
                    <IconHeart className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-4 pb-4 pt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{it.type}</span>
                  </div>

                  <div className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">
                    {kes.format(it.price)}
                  </div>

                  <div className="mt-1 text-sm text-gray-800">
                    <span className="font-semibold">{it.beds}</span> bed
                    <span className="mx-2">•</span>
                    <span className="font-semibold">{it.baths}</span> bath
                    <span className="mx-2">•</span>
                    <span className="font-semibold">{it.sqft.toLocaleString()}</span> sqft
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    <div>{it.address1}</div>
                    <div>{it.address2}</div>
                  </div>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function UpcomingOpenHouses() {
  const items = [
    {
      type: 'Single-Family Home',
      price: 210000000,
      beds: 3,
      baths: 3.5,
      sqft: 5476,
      address1: '806 Paoli Ct Lot 32R',
      address2: 'Nairobi, KE 00100',
      img: 'https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?q=80&w=1600&auto=format&fit=crop',
    },
    {
      type: 'Single-Family Home',
      price: 44900000,
      beds: 4,
      baths: 3,
      sqft: 1740,
      address1: '518 Albemarle Ct',
      address2: 'Nairobi, KE 00100',
      img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
    },
    {
      type: 'Single-Family Home',
      price: 54900000,
      beds: 4,
      baths: 3,
      sqft: 2955,
      address1: '4422 Grey Oaks Ct Lot 41',
      address2: 'Nairobi, KE 00100',
      img: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=1600&auto=format&fit=crop',
    },
    {
      type: 'Single-Family Home',
      price: 77490000,
      beds: 4,
      baths: 3,
      sqft: 2555,
      address1: '515 Edgerton Dr',
      address2: 'Nairobi, KE 00100',
      img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop',
      newBadge: true,
    },
  ]

  const [seen, setSeen] = useState<{[k: number]: boolean}>({})
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal-card')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const i = Number((entry.target as HTMLElement).dataset.index)
        if (entry.isIntersecting) {
          setSeen((prev) => ({ ...prev, [i]: true }))
        } else {
          setSeen((prev) => ({ ...prev, [i]: false }))
        }
      })
    }, { threshold: 0.2 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-6 pt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Upcoming Open Houses</h2>
        <a href="#" className="text-sm text-blue-600 hover:underline">View all in Nairobi, KE</a>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, idx) => {
          const entered = !!seen[idx]
          const from = idx % 2 === 0 ? '-translate-x-8' : 'translate-x-8'
          return (
            <div
              key={idx}
              className={`reveal-card transform transition-all duration-700 ease-out ${entered ? 'translate-x-0 opacity-100' : `${from} opacity-0`}`}
              data-index={idx}
            >
              <article className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/5">
                <div className="relative h-40 w-full">
                  <Link to={`/property/${idx + 1}`}>
                    <img src={it.img} alt={it.type} className="h-full w-full object-cover" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }} />
                  </Link>
                  {it.newBadge && (
                    <span className="absolute left-4 top-3 inline-flex rounded-full bg-blue-600 px-2.5 py-1 text-xs font-medium text-white">New</span>
                  )}
                  <button className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 ring-1 ring-black/10 backdrop-blur hover:bg-white">
                    <IconHeart className="h-5 w-5" />
                  </button>
                </div>

                <div className="px-4 pb-4 pt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{it.type}</span>
                  </div>
                  <div className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">
                    {kes.format(it.price)}
                  </div>
                  <div className="mt-1 text-sm text-gray-800">
                    <span className="font-semibold">{it.beds}</span> bed
                    <span className="mx-2">•</span>
                    <span className="font-semibold">{it.baths}</span> bath
                    <span className="mx-2">•</span>
                    <span className="font-semibold">{it.sqft.toLocaleString()}</span> sqft
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <div>{it.address1}</div>
                    <div>{it.address2}</div>
                  </div>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function Listings() {
  const cards = [
    {
      title: 'Modern Loft in Downtown',
      price: 240000,
      rent: true,
      meta: '2 Bed • 2 Bath • 1,100 sqft',
      location: 'Downtown, Seattle',
      tag: 'For Rent',
      img:
        'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop',
    },
    {
      title: 'Cozy Suburban House',
      price: 42000000,
      rent: false,
      meta: '3 Bed • 2 Bath • 1,600 sqft',
      location: 'Maple Grove, Austin',
      tag: 'For Sale',
      img:
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1600&auto=format&fit=crop',
    },
    {
      title: 'Luxury High-Rise Condo',
      price: 310000,
      rent: true,
      meta: '1 Bed • 1 Bath • 900 sqft',
      location: 'Midtown, Atlanta',
      tag: 'For Rent',
      img:
        'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop',
    },
  ]
  return (
    <section id="listings" className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Featured Moves & Homes</h2>
        <a href="#" className="text-sm text-gray-700 hover:text-gray-900">View all</a>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <article
            key={i}
            className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={c.img}
                alt={c.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
              />
              <span className="absolute left-3 top-3 inline-flex rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-900 ring-1 ring-black/10">
                {c.tag}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{c.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{c.meta}</p>
              <p className="mt-1 text-sm text-gray-500">{c.location}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">
                  {kes.format(c.price)}{c.rent ? '/mo' : ''}
                </span>
                <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">Details</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// Social icons removed because they are not currently used; re-add when wiring social links.

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50/70 text-gray-900">
      {!isAdminRoute && <MainNavbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/quick-shop" element={<QuickShop />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        {/* Admin area (separate layout) */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminProtectedLayout />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="prescriptions" element={<AdminPrescriptions />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="consultations" element={<AdminConsultations />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route
          path="/orders"
          element={(
            <main className="mx-auto max-w-4xl px-6 py-12">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">My Orders</h1>
              <p className="text-sm text-gray-600">Your recent orders will appear here once implemented.</p>
            </main>
          )}
        />
      </Routes>
      {!isAdminRoute && <MainFooter />}
    </div>
  )
}
