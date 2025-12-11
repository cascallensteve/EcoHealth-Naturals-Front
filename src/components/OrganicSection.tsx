import { useContext, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { OFFERS } from './EssentialOffers'
import { CartContext } from '../context/CartContext'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop'

const parsePrice = (s: string): number => {
  const num = parseInt(s.replace(/[^0-9]/g, ''), 10)
  return isNaN(num) ? 0 : num
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

export default function OrganicSection() {
  const cart = useContext(CartContext)!
  const [start, setStart] = useState(0)
  const [qty, setQty] = useState<Record<number, number>>({})

  const items = useMemo(() => OFFERS, [])
  const visible = 4
  const order = Array.from({ length: Math.min(visible, items.length) }, (_, i) => items[(start + i) % items.length])

  const next = () => setStart((s) => (s + 1) % items.length)
  const prev = () => setStart((s) => (s - 1 + items.length) % items.length)

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-wide text-gray-900">100% ORGANIC</h2>
        <div className="flex items-center gap-2">
          <button aria-label="Previous" onClick={prev} className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white text-gray-700 hover:bg-gray-50">‹</button>
          <button aria-label="Next" onClick={next} className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white text-gray-700 hover:bg-gray-50">›</button>
        </div>
      </div>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {order.map((p, idx) => {
          const q = qty[p.id] || 1
          const organic = ((start + idx) % 3) === 0 // simple badge demo
          const op = parsePrice(p.originalPrice)
          const pp = parsePrice(p.price)
          return (
            <article key={p.id} className="overflow-hidden rounded-xl border bg-white shadow-sm ring-1 ring-black/5">
              <Link to={`/product/${slugify(p.title)}`} className="block">
                <div className="relative h-44 w-full overflow-hidden">
                  {organic && (
                    <span className="absolute left-2 top-2 inline-flex rounded-full bg-emerald-700 px-2.5 py-1 text-[10px] font-semibold uppercase text-white">Certified Organic</span>
                  )}
                  <img
                    src={p.img}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
                  />
                </div>
              </Link>
              <div className="px-3 pb-3 pt-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-700">go<sup className="ml-0.5 align-top text-[8px]">+</sup></span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    onClick={() => cart.addItem({ id: p.id, title: p.title, price: pp, img: p.img }, 1)}
                  >
                    ⚡ Add to Quick Shop
                  </button>
                </div>
                <h3 className="mt-2 line-clamp-2 text-[13px] font-medium text-gray-900">{p.title}</h3>
                <div className="mt-1 text-xs">
                  {op > pp ? (
                    <>
                      <span className="mr-2 text-gray-400 line-through">KShs {op}</span>
                      <span className="font-semibold text-gray-900">KShs {pp}</span>
                    </>
                  ) : (
                    <span className="font-semibold text-gray-900">KShs {pp}</span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[11px]">
                    <button type="button" className="px-1 text-gray-500" onClick={() => setQty((prev) => ({ ...prev, [p.id]: Math.max(1, (prev[p.id] || 1) - 1) }))}>−</button>
                    <span className="mx-2 text-gray-800">{q}</span>
                    <button type="button" className="px-1 text-gray-700" onClick={() => setQty((prev) => ({ ...prev, [p.id]: Math.min(99, (prev[p.id] || 1) + 1) }))}>+</button>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-800"
                    onClick={() => cart.addItem({ id: p.id, title: p.title, price: pp, img: p.img }, q)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
