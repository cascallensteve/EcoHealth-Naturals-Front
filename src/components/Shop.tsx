import type React from 'react'
import { useContext, useEffect, useState } from 'react'
import { CartContext } from '../context/CartContext'
import { CATEGORIES } from './categoriesData'
import { fetchProducts, type Product as ApiProduct } from '../services/productService'

const CATEGORY_OPTIONS = [
  { id: 1, name: 'Herbal Remedies' },
  { id: 2, name: 'Essential Oils' },
  { id: 3, name: 'Natural Food-Based Remedies' },
  { id: 4, name: 'Herbal Teas & Infusions' },
  { id: 5, name: 'Supplements & Natural Extracts' },
  { id: 6, name: 'Minerals & Earth-Based Remedies' },
  { id: 7, name: 'Natural Mushrooms' },
  { id: 8, name: 'Skin & Topical Natural Products' },
  { id: 9, name: 'Detox & Wellness Remedies' },
]

function getCategoryName(id: number | undefined | null): string {
  if (!id) return 'Uncategorised'
  const found = CATEGORY_OPTIONS.find((c) => c.id === id)
  return found?.name ?? 'Uncategorised'
}

// Simple curated Shop page that showcases key EcoHealth products
export default function Shop(): React.ReactElement {
  const cart = useContext(CartContext)!

  type Product = {
    id: number
    title: string
    description: string
    price: number
    img: string
    tag?: string
    category: string
  }

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchProducts()
        if (cancelled) return
        const mapped: Product[] = data
          .filter((p: ApiProduct) => p.is_available)
          .map((p: ApiProduct) => ({
            id: p.id,
            title: p.name,
            description: p.description || 'EcoHealth Naturals wellness product.',
            price: Number(p.price) || 0,
            img:
              p.image_url ||
              'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop',
            tag: undefined,
            category: getCategoryName(p.category),
          }))
        setProducts(mapped)
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Failed to load products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleAddToCart = (p: Product) => {
    cart.addItem(
      {
        id: p.id,
        title: p.title,
        price: p.price,
        img: p.img,
      },
      1,
    )
  }

  const filteredProducts: Product[] =
    selectedCategory === 'All'
      ? products.slice()
      : products.filter((p) => p.category === selectedCategory)

  const totalItems = products.length

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-900">
          Shop EcoHealth Naturals
        </h1>
        <p className="max-w-xl text-sm text-emerald-800/80">
          Carefully selected herbal remedies, teas, and natural wellness essentials, organised by wellness
          focus so you can quickly find what supports your current goals.
        </p>
      </section>

      <section className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        {/* Sidebar categories */}
        <aside className="sm:w-64 flex-shrink-0 rounded-3xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-900">Category</h2>
          <p className="mt-1 text-[11px] text-emerald-700/90">
            Filter our catalogue by wellness focus.
          </p>

          <div className="mt-3 space-y-1.5 text-sm">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-[13px] transition ${
                selectedCategory === 'All'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-transparent bg-emerald-50/60 text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-emerald-500 bg-emerald-500 text-[10px] text-white">
                  {selectedCategory === 'All' ? '✓' : ''}
                </span>
                All Categories
              </span>
              <span className="text-[11px] text-emerald-700">{totalItems}</span>
            </button>

            {CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.category === cat.label).length
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-[13px] transition ${
                    selectedCategory === cat.label
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-transparent bg-white text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`inline-flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                      selectedCategory === cat.label
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-emerald-300 bg-white text-transparent'
                    }`}
                    >
                      ✓
                    </span>
                    <span className="truncate">
                      {cat.label}
                    </span>
                  </span>
                  <span className="text-[11px] text-emerald-700">{count}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Products area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-emerald-900">Featured Products</h2>
              <p className="mt-1 text-xs text-emerald-700/90">
                Showing {filteredProducts.length} of {totalItems} items
                {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-emerald-800/80">Sort by</span>
              <button
                type="button"
                className="inline-flex items-center justify-between gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-[12px] text-emerald-900 shadow-sm"
              >
                Default
                <span className="text-emerald-700">▾</span>
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {loading ? (
            <p className="text-sm text-emerald-800/80">Loading products…</p>
          ) : !filteredProducts.length ? (
            <p className="text-sm text-emerald-800/80">
              No products available yet. Once you add products in the admin, they will appear here.
            </p>
          ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredProducts.map((p: Product) => (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-44 w-full overflow-hidden bg-emerald-50">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  {p.tag && (
                    <span className="absolute left-3 top-3 inline-flex rounded-full bg-emerald-700/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-50">
                      {p.tag}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-semibold text-emerald-900 sm:text-base">{p.title}</h3>
                  <p className="mt-1 text-xs text-emerald-700/90 sm:text-sm line-clamp-3">
                    {p.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-lg font-bold text-emerald-900">
                      KShs {p.price}
                    </span>
                    <span className="text-[11px] text-emerald-700/80">{p.category}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(p)}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-emerald-800"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      </section>
    </main>
  )
}
