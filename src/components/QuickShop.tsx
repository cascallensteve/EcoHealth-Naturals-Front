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

export default function QuickShop() {
  const cart = useContext(CartContext)!
  const [query, setQuery] = useState('')
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [sort, setSort] = useState<'popular' | 'price-asc' | 'price-desc'>('popular')

  const filtered = useMemo(() => {
    let list = OFFERS.filter((o) =>
      o.title.toLowerCase().includes(query.toLowerCase()) ||
      o.subtitle.toLowerCase().includes(query.toLowerCase())
    )
    if (sort === 'price-asc') list = [...list].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
    if (sort === 'price-desc') list = [...list].sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
    return list
  }, [query, sort])

  const setQty = (id: number, updater: (n: number) => number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, Math.min(99, updater(prev[id] || 1))) }))
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Quick Shop</h1>
          <p className="mt-1 text-sm text-gray-600">Speedy add-to-cart for your weekly essentials.</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search goodies..."
              className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200"
              >
                clear
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none"
            title="Sort"
          >
            <option value="popular">Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </header>

      <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => {
          const q = quantities[item.id] || 1
          const discount = Math.max(0, parsePrice(item.originalPrice) - parsePrice(item.price))
          const best = discount >= 50
          return (
            <article key={item.id} className="group overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/5">
              <Link to={`/product/${slugify(item.title)}`} className="block">
                <div className="relative h-44 w-full overflow-hidden">
                  {best && (
                    <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">BEST PRICE!</div>
                  )}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
                  />
                </div>
              </Link>
              <div className="px-4 pb-4 pt-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{item.subtitle}</p>
                <div className="mt-2 flex items-baseline gap-2 text-sm">
                  <span className="font-semibold text-gray-900">{item.price}</span>
                  <span className="text-gray-400 line-through">{item.originalPrice}</span>
                  {discount > 0 && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Save KShs {discount}</span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[11px]">
                    <button type="button" className="px-1 text-gray-500" onClick={() => setQty(item.id, (n) => n - 1)}>−</button>
                    <span className="mx-2 text-gray-800">{q}</span>
                    <button type="button" className="px-1 text-gray-700" onClick={() => setQty(item.id, (n) => n + 1)}>+</button>
                  </div>
                  <button
                    type="button"
                    className="rounded-md border border-emerald-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700 hover:bg-emerald-50"
                    onClick={() => cart.addItem({ id: item.id, title: item.title, price: parsePrice(item.price), img: item.img }, q)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      {filtered.length === 0 && (
        <div className="mt-16 text-center text-sm text-gray-600">
          No items match your search. Try a different term or <button className="text-emerald-700 underline" onClick={() => setQuery('')}>reset filters</button>.
        </div>
      )}
    </main>
  )
}
