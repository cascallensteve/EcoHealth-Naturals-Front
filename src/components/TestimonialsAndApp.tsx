import { useState } from 'react'

const TESTIMONIALS = [
  {
    name: 'Michelle Nkatha',
    date: 'November 10, 2025',
    text:
      'Thank you for the good service EcoHealth! Your delivery person was wonderful, professional and on time! Items were also received in good order. Will definitely be ordering again soon. 🙂',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop'
  },
  {
    name: 'Brian Kim',
    date: 'November 3, 2025',
    text:
      'Fresh produce and quick delivery. The quick shop page makes it so easy to reorder my staples!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=300&auto=format&fit=crop'
  },
  {
    name: 'Joy Wanjiku',
    date: 'October 28, 2025',
    text:
      'Top-notch products and the herbs are super fresh. Highly recommend the organic section! ',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=300&auto=format&fit=crop'
  },
]

export default function TestimonialsAndApp() {
  const [idx, setIdx] = useState(0)
  const t = TESTIMONIALS[idx]
  const next = () => setIdx((i) => (i + 1) % TESTIMONIALS.length)
  const prev = () => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Testimonials card */}
        <div className="relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-emerald-200">
          <h3 className="mb-3 text-xl font-semibold" style={{ fontFamily: '"Dancing Script", cursive', color: '#008000' }}>What our customers have to say</h3>
          <div className="relative rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-1 text-yellow-500 text-lg" aria-label={`${t.rating} stars`}>
              {'★★★★★'.slice(0, t.rating)}
            </div>
            <p className="mt-2 text-sm text-gray-800">{t.text}</p>
            <div className="mt-4 flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="h-8 w-8 rounded-full object-cover" loading="lazy" />
              <div className="text-xs">
                <div className="font-semibold text-gray-900">{t.name}</div>
                <div className="text-gray-500">{t.date}</div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]" style={{backgroundImage: 'url(https://res.cloudinary.com/djksfayfu/image/upload/v1753303607/aloe-vera-leaves-with-beauty-cream-bottle_jahbg4.jpg)', backgroundSize: 'cover'}} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button aria-label="Previous" onClick={prev} className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white text-gray-700 hover:bg-gray-50">‹</button>
              <button aria-label="Next" onClick={next} className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white text-gray-700 hover:bg-gray-50">›</button>
            </div>
            <div className="flex items-center gap-1">
              {TESTIMONIALS.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === idx ? 'bg-emerald-600' : 'bg-emerald-200'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* App download card */}
        <div className="relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-emerald-200">
          <h3 className="mb-1 text-xl font-semibold" style={{ fontFamily: '"Dancing Script", cursive', color: '#008000' }}>Download our app!</h3>
          <p className="text-sm text-gray-700">Our app is up to 4X faster to use! Simplify your life even more. Have you also tried our Quick Shop with products you’ve bought before?</p>
          <div className="mt-4 flex items-center gap-3">
            <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">DOWNLOAD APP</button>
          </div>
          <div className="mt-6">
            <img
              src="https://images.unsplash.com/photo-1557180295-76eee20ae8aa?q=80&w=1200&auto=format&fit=crop"
              alt="Mobile app preview"
              className="h-48 w-full rounded-xl object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
