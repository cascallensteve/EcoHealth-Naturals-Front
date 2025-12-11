import { useEffect, useMemo, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { fetchProducts, type Product as ApiProduct } from '../services/productService'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop'

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

export default function ProductDetail() {
  const { slug } = useParams()
  const cart = useContext(CartContext)!
  const [qty, setQty] = useState(1)
  const [relatedStart, setRelatedStart] = useState(0)
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchProducts()
        if (!cancelled) setProducts(data)
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Failed to load product')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const product = useMemo(() => {
    if (!slug || !products.length) return undefined
    return products.find((p) => slugify(p.name) === slug)
  }, [slug, products])

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-gray-600">Loading product…</p>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-gray-600">{error || 'Product not found.'}</p>
        <Link to="/" className="mt-3 inline-block text-emerald-700 hover:text-emerald-900">← Back to home</Link>
      </main>
    )
  }

  const parsePrice = (s: string): number => {
    const num = parseInt(String(s).replace(/[^0-9]/g, ''), 10)
    return isNaN(num) ? 0 : num
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-3 shadow-sm ring-1 ring-black/5">
          <div className="relative w-full overflow-hidden rounded-md">
            <img
              src={product.image_url || FALLBACK_IMG}
              alt={product.name}
              className="h-auto w-full object-cover"
              loading="lazy"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-medium tracking-wide text-gray-500">NATURAL WELLNESS PRODUCT</div>
          <div className="text-xs font-semibold text-emerald-600">go<sup className="ml-0.5 text-[8px] align-top">+</sup></div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
          <div className="mt-2 text-sm">
            <span className="line-through text-gray-400 mr-2">KShs {parsePrice(product.price) + 50}</span>
            <span className="font-semibold text-gray-900">KShs {product.price}</span>
          </div>
          <div className="mt-1 text-xs text-emerald-700">Availability: <span className="font-semibold">In stock</span></div>

          <div className="mt-4 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[11px]">
              <button type="button" className="px-1 text-gray-500" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="mx-2 text-gray-800">{qty}</span>
              <button type="button" className="px-1 text-gray-700" onClick={() => setQty((q) => Math.min(99, q + 1))}>+</button>
            </div>
            <button
              type="button"
              className="rounded-md border border-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 hover:bg-emerald-50"
              onClick={() =>
                cart.addItem(
                  {
                    id: product.id,
                    title: product.name,
                    price: parsePrice(product.price),
                    img: product.image_url || FALLBACK_IMG,
                  },
                  qty,
                )
              }
            >
              Add to cart
            </button>
          </div>

          <div className="mt-6 rounded-md border bg-emerald-50/40 p-4 text-sm">
            <div className="mb-2 font-semibold text-emerald-800">Product Details</div>
            <p className="text-gray-700">
              {product.description || 'Natural wellness favourite from EcoHealth Naturals.'}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-6 text-xl sm:text-2xl font-semibold text-gray-900">We think you might also like these goodies…</h2>
        <div className="relative">
          <button
            type="button"
            aria-label="Prev"
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow ring-1 ring-black/5 hover:bg-white"
            onClick={() => setRelStart((s) => (s - 1 + OFFERS.length) % OFFERS.length)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow ring-1 ring-black/5 hover:bg-white"
            onClick={() => setRelStart((s) => (s + 1) % OFFERS.length)}
          >
            ›
          </button>

          <div className="overflow-hidden px-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products
                .filter((p) => p.id !== product.id && p.is_available)
                .slice(0, 3)
                .map((item) => {
                  const best = parsePrice(item.price) >= parsePrice(product.price)
                  return (
                    <div key={item.id} className="group rounded-lg border bg-white shadow-sm ring-1 ring-black/5">
                      <Link to={`/product/${slugify(item.name)}`} className="block">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
                          {best && (
                            <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">BEST PRICE!</div>
                          )}
                          <img
                            src={item.image_url || FALLBACK_IMG}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG
                            }}
                          />
                        </div>
                      </Link>
                      <div className="px-3 pb-3 pt-2">
                        <div className="text-[11px] tracking-wide text-gray-500">OTHER WELLNESS PICK</div>
                        <button
                          type="button"
                          className="mt-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                          onClick={() =>
                            cart.addItem(
                              {
                                id: item.id,
                                title: item.name,
                                price: parsePrice(item.price),
                                img: item.image_url || FALLBACK_IMG,
                              },
                              1,
                            )
                          }
                        >
                          ⚡ Add to Quick Shop
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
