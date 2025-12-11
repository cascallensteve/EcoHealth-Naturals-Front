const FALLBACK_IMG = 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop'

export type HerbProduct = {
  id: number
  name: string
  price: number
  img: string
}

const HERB_PRODUCTS: HerbProduct[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name:
    i === 0
      ? 'Limuru Coriander (Dhania) – 50g Bunch'
      : i === 1
        ? 'Mlango Farm Organic Flat Parsley – Bunch'
        : i === 2
          ? 'Limuru Basil – Bunch (Approx. 100g)'
          : `Fresh Herb Mix #${i + 1}`,
  price: i === 0 ? 19 : i === 1 ? 39 : i === 2 ? 79 : 49,
  img:
    'https://images.unsplash.com/photo-1518977956815-dee0064218af?q=80&w=1600&auto=format&fit=crop',
}))

export default function FreshHerbsGrid() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-6 py-4 text-sm text-emerald-800">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Fresh Herbs</span>
          </div>
          <button className="text-emerald-700 font-medium border-b-2 border-emerald-600 pb-1">Fresh Herbs</button>
          <button className="text-gray-500 hover:text-emerald-700 pb-1">Fruit</button>
          <button className="text-gray-500 hover:text-emerald-700 pb-1">Salad</button>
          <button className="text-gray-500 hover:text-emerald-700 pb-1">Veg</button>
        </div>

        {/* Products grid: 4 per row on large screens */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HERB_PRODUCTS.filter((product) => product.name !== 'Fresh Herb Mix #10').map((product) => (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-52 w-full bg-gray-50">
                <img
                  src={product.img}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = FALLBACK_IMG
                  }}
                />
                {product.id === 2 && (
                  <div className="absolute left-0 top-0 w-full bg-emerald-600 px-3 py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-white">
                    New: Order as Go!
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col px-4 pb-4 pt-3 text-sm text-gray-800">
                <div className="text-[11px] font-medium tracking-wide text-gray-500">FRESH HERBS</div>
                <div className="mt-1 text-xs font-semibold text-emerald-600">go<sup className="ml-0.5 text-[8px] align-top">+</sup></div>
                <h3 className="mt-1 text-sm font-semibold text-gray-900 leading-snug min-h-[3rem]">
                  {product.name}
                </h3>

                <div className="mt-4 text-xs font-semibold text-gray-700">KShs {product.price}</div>

                <div className="mt-4">
                  <button className="w-full rounded border border-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 hover:bg-emerald-50">
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
