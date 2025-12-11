import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { fetchProducts, type Product as ApiProduct } from '../services/productService'

interface OfferItem {
  id: number
  title: string
  subtitle: string
  img: string
  originalPrice: string
  price: string
}

export const OFFERS: OfferItem[] = []

const VISIBLE = 4

export default function EssentialOffers() {
  // Group slider: slide 4 cards as a block from right to left
  const [start, setStart] = useState(0)
  const [isSliding, setIsSliding] = useState(false)
  const directionRef = useRef<1 | -1>(1)
  const nextStartRef = useRef(0)
  const intervalRef = useRef<number | null>(null)
  const hoveredRef = useRef(false)
  const cart = useContext(CartContext)!
  const [qty, setQty] = useState<Record<number, number>>({})
  const [offers, setOffers] = useState<OfferItem[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const parsePrice = (s: string): number => {
    const num = parseInt(s.replace(/[^0-9]/g, ''), 10)
    return isNaN(num) ? 0 : num
  }

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

  const inc = (id: number) => setQty((q) => ({ ...q, [id]: Math.min(99, (q[id] || 1) + 1) }))
  const dec = (id: number) => setQty((q) => ({ ...q, [id]: Math.max(1, (q[id] || 1) - 1) }))

  const mod = (n: number, m: number) => ((n % m) + m) % m
  const groupAt = (s: number): OfferItem[] => {
    if (!offers.length) return []
    const size = offers.length
    const count = Math.min(VISIBLE, size)
    return Array.from({ length: count }).map((_, i) => offers[mod(s + i, size)])
  }

  const beginSlide = (dir: 1 | -1) => {
    if (isSliding) return
    if (hoveredRef.current) return
    if (!offers.length) return
    directionRef.current = dir
    nextStartRef.current = mod(start + dir * VISIBLE, offers.length)
    setIsSliding(true)
  }

  // Load real products for this week's offers
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoadingProducts(true)
      setLoadError(null)
      try {
        const data = await fetchProducts()
        if (cancelled) return
        const mapped: OfferItem[] = data
          .filter((p: ApiProduct) => p.is_available)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 8)
          .map((p: ApiProduct) => {
            const numericPrice = parsePrice(p.price)
            const original = numericPrice ? numericPrice + 50 : numericPrice
            return {
              id: p.id,
              title: p.name,
              subtitle: p.description || 'Natural wellness favourite from EcoHealth Naturals.',
              img: p.image_url || 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop',
              originalPrice: original ? `KShs ${original}` : `KShs ${p.price}`,
              price: `KShs ${p.price}`,
            }
          })
        setOffers(mapped)
      } catch (err) {
        if (!cancelled) {
          setLoadError('Failed to load this week\'s offers. Please try again later.')
        }
      } finally {
        if (!cancelled) setLoadingProducts(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  // Preload next group's images to reduce perceived load time
  useEffect(() => {
    if (!offers.length) return
    const urls = groupAt(mod(start + VISIBLE, offers.length)).map((o) => optimizeCdn(o.img, 640))
    urls.forEach((u) => {
      const img = new Image()
      img.src = u
    })
  }, [start, offers.length])

  const onTransitionEnd = () => {
    if (!isSliding) return
    setIsSliding(false)
    setStart(nextStartRef.current)
  }

  useEffect(() => {
    intervalRef.current = window.setInterval(() => beginSlide(1), 3500)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [start])

  const goNext = () => beginSlide(1)
  const goPrev = () => beginSlide(-1)

  const currentGroup = groupAt(start)
  const nextGroup = groupAt(nextStartRef.current || mod(start + VISIBLE, offers.length || 1))

  // Cloudinary optimization helper
  const optimizeCdn = (url: string, width = 600) => {
    try {
      const marker = '/upload/'
      const idx = url.indexOf(marker)
      if (idx === -1) return url
      // f_auto: best format, q_auto: smart compression, c_fill, w_ for responsive width
      return url.slice(0, idx + marker.length) + `f_auto,q_auto,c_fill,w_${width}/` + url.slice(idx + marker.length)
    } catch {
      return url
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pt-6 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous offers"
            onClick={goPrev}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <span className="text-sm">‹</span>
          </button>
          <div className="text-left">
            <h2
              className="text-lg sm:text-xl font-extrabold tracking-[0.18em] text-gray-900 uppercase"
              style={{ fontFamily: 'Nunito, ui-sans-serif, system-ui' }}
            >
              This week’s essential offers
            </h2>
            <p className="text-xs text-gray-500">Hand-picked EcoHealth Naturals favourites, updated weekly.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            More offers →
          </button>
          <button
            type="button"
            aria-label="Next offers"
            onClick={goNext}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <span className="text-sm">›</span>
          </button>
        </div>
      </div>

      <div className="mt-2 px-2 sm:px-6">
        {loadError && (
          <p className="mb-3 text-xs text-red-600">{loadError}</p>
        )}
        {!loadingProducts && !offers.length ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 px-4 py-6 text-sm text-gray-600">
            No weekly offers are available yet. Once you add products in the admin, they will appear here.
          </div>
        ) : (
          <div className="overflow-hidden">
            <div
              className="flex w-[200%] transition-transform duration-600 ease-in-out"
              style={{ transform: isSliding ? (directionRef.current === 1 ? 'translateX(-50%)' : 'translateX(0%)') : 'translateX(0%)', willChange: 'transform' }}
              onTransitionEnd={onTransitionEnd}
              onMouseEnter={() => {
                hoveredRef.current = true
                if (intervalRef.current) {
                  window.clearInterval(intervalRef.current)
                  intervalRef.current = null
                }
              }}
              onMouseLeave={() => {
                hoveredRef.current = false
                if (!intervalRef.current) {
                  intervalRef.current = window.setInterval(() => beginSlide(1), 3500)
                }
              }}
            >
              {/* Current group */}
              <div className="grid w-1/2 grid-cols-1 gap-4 pr-2 sm:grid-cols-2 lg:grid-cols-4">
                {currentGroup.map((offer, idx) => (
                <article
                  key={`cur-${offer.id}-${idx}`}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow"
                  style={{ contentVisibility: 'auto' }}
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Link to={`/product/${slugify(offer.title)}`}>
                      <img
                        src={optimizeCdn(offer.img, 640)}
                        alt={offer.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        fetchPriority={idx === 0 ? 'high' : 'low'}
                      />
                    </Link>
                    {offer.id === 2 && (
                      <span className="absolute left-3 top-3 inline-flex rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">New: order as a go!</span>
                    )}
                  </div>
                  <div className="p-4 text-xs">
                    <div className="mb-1 flex items-center justify-between text-emerald-700">
                      <span className="text-sm font-extrabold" style={{ fontFamily: '"Dancing Script", cursive' }}>go=</span>
                      <button type="button" className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900">
                        <span className="text-emerald-500">⚡</span>
                        <span>Add to Quick Shop</span>
                      </button>
                    </div>
                    <h3 className="mb-1 text-sm font-semibold leading-snug text-gray-900">
                      <Link to={`/product/${slugify(offer.title)}`}>{offer.title}</Link>
                    </h3>
                    <p className="mb-2 text-xs text-gray-600">{offer.subtitle}</p>
                    <div className="text-sm"><span className="mr-1 line-through text-gray-400">{offer.originalPrice}</span><span className="font-semibold text-gray-900">{offer.price}</span></div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[11px]">
                        <button type="button" className="px-1 text-gray-500" onClick={() => dec(offer.id)}>−</button>
                        <span className="mx-2 text-gray-800">{qty[offer.id] || 1}</span>
                        <button type="button" className="px-1 text-gray-700" onClick={() => inc(offer.id)}>+</button>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          cart.addItem(
                            { id: offer.id, title: offer.title, price: parsePrice(offer.price), img: offer.img },
                            qty[offer.id] || 1,
                          )
                        }
                        className="rounded-md bg-emerald-700 px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-800"
                      >
                        Add to cart
                      </button>
                    </div>
                    <a href={`https://wa.me/254727444777?text=${encodeURIComponent(`Hi EcoHealth Naturals, I would like to ask about this product: ${offer.title}.`)}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp us about ${offer.title}`} className="mt-3 inline-flex items-center gap-2 text-[11px] font-medium text-emerald-700 hover:text-emerald-900">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#25D366]" aria-hidden="true">
                        <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.44 0 .06 5.38.06 12c0 2.03.5 3.96 1.45 5.7L0 24l6.46-1.49A12 12 0 0 0 12.06 24c6.62 0 12-5.38 12-12 0-3.19-1.24-6.19-3.54-8.52ZM12.06 21.8c-1.86 0-3.67-.49-5.27-1.42l-.4-.24-3.57.82.77-3.48-.26-.41A9.72 9.72 0 1 1 21.78 12c0 5.37-4.36 9.8-9.72 9.8Zm5.23-6.96c-.3-.15-1.85-.92-2.14-1.03-.28-.1-.49-.15-.7.15-.2.27-.8.95-1.02 1.15-.19.18-.36.2-.66.07-.3-.15-1.22-.45-2.32-1.36-.86-.75-1.44-1.67-1.62-1.94-.17-.28-.02-.43.13-.58.13-.13.29-.34.43-.51.15-.17.2-.29.29-.49.1-.2.05-.36-.02-.51-.07-.15-.66-1.49-.9-2.04-.24-.53-.47-.46-.65-.47h-.55c-.2 0-.52.08-.8.37-.27.28-1.02.99-1.02 2.42 0 1.42 1.02 2.8 1.18 3.01.15.21 1.99 3 4.82 4.2.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.68-.69 1.92-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34Z"/>
                      </svg>
                      <span>WhatsApp us about this product</span>
                    </a>
                  </div>
                </article>
                ))}
              </div>
              {/* Next group */}
              <div className="grid w-1/2 grid-cols-1 gap-4 pl-2 sm:grid-cols-2 lg:grid-cols-4">
                {nextGroup.map((offer, idx) => (
                <article
                  key={`next-${offer.id}-${idx}`}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow"
                  style={{ contentVisibility: 'auto' }}
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Link to={`/product/${slugify(offer.title)}`}>
                      <img
                        src={optimizeCdn(offer.img, 640)}
                        alt={offer.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        fetchPriority="low"
                      />
                    </Link>
                    {offer.id === 2 && (
                      <span className="absolute left-3 top-3 inline-flex rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">New: order as a go!</span>
                    )}
                  </div>
                  <div className="p-4 text-xs">
                    <div className="mb-1 flex items-center justify-between text-emerald-700">
                      <span className="text-sm font-extrabold" style={{ fontFamily: '"Dancing Script", cursive' }}>go=</span>
                      <button type="button" className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900">
                        <span className="text-emerald-500">⚡</span>
                        <span>Add to Quick Shop</span>
                      </button>
                    </div>
                    <h3 className="mb-1 text-sm font-semibold leading-snug text-gray-900">{offer.title}</h3>
                    <p className="mb-2 text-xs text-gray-600">{offer.subtitle}</p>
                    <div className="text-sm"><span className="mr-1 line-through text-gray-400">{offer.originalPrice}</span><span className="font-semibold text-gray-900">{offer.price}</span></div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[11px]">
                        <button type="button" className="px-1 text-gray-500" onClick={() => dec(offer.id)}>−</button>
                        <span className="mx-2 text-gray-800">{qty[offer.id] || 1}</span>
                        <button type="button" className="px-1 text-gray-700" onClick={() => inc(offer.id)}>+</button>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          cart.addItem(
                            { id: offer.id, title: offer.title, price: parsePrice(offer.price), img: offer.img },
                            qty[offer.id] || 1,
                          )
                        }
                        className="rounded-md bg-emerald-700 px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-800"
                      >
                        Add to cart
                      </button>
                    </div>
                    <a href={`https://wa.me/254727444777?text=${encodeURIComponent(`Hi EcoHealth Naturals, I would like to ask about this product: ${offer.title}.`)}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp us about ${offer.title}`} className="mt-3 inline-flex items-center gap-2 text-[11px] font-medium text-emerald-700 hover:text-emerald-900">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#25D366]" aria-hidden="true">
                        <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.44 0 .06 5.38.06 12c0 2.03.5 3.96 1.45 5.7L0 24l6.46-1.49A12 12 0 0 0 12.06 24c6.62 0 12-5.38 12-12 0-3.19-1.24-6.19-3.54-8.52ZM12.06 21.8c-1.86 0-3.67-.49-5.27-1.42l-.4-.24-3.57.82.77-3.48-.26-.41A9.72 9.72 0 1 1 21.78 12c0 5.37-4.36 9.8-9.72 9.8Zm5.23-6.96c-.3-.15-1.85-.92-2.14-1.03-.28-.1-.49-.15-.7.15-.2.27-.8.95-1.02 1.15-.19.18-.36.2-.66.07-.3-.15-1.22-.45-2.32-1.36-.86-.75-1.44-1.67-1.62-1.94-.17-.28-.02-.43.13-.58.13-.13.29-.34.43-.51.15-.17.2-.29.29-.49.1-.2.05-.36-.02-.51-.07-.15-.66-1.49-.9-2.04-.24-.53-.47-.46-.65-.47h-.55c-.2 0-.52.08-.8.37-.27.28-1.02.99-1.02 2.42 0 1.42 1.02 2.8 1.18 3.01.15.21 1.99 3 4.82 4.2.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.68-.69 1.92-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34Z"/>
                      </svg>
                      <span>WhatsApp us about this product</span>
                    </a>
                  </div>
                </article>
              ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
