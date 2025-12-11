import { useEffect, useState } from 'react'

export default function Hero() {
  const heroImages = [
    'https://res.cloudinary.com/djksfayfu/image/upload/v1763926722/cheerful-woman-posing-with-copy-space-removebg-preview_wnop0x.webp',
    'https://res.cloudinary.com/djksfayfu/image/upload/v1765447075/freepik__35mm-film-photography-african-woman-centerframe-be__80751-removebg-preview_rshy2o.webp',
    'https://res.cloudinary.com/djksfayfu/image/upload/v1765447844/ChatGPT_Image_Dec_11__2025__01_06_09_PM-removebg-preview_lqijav.png',
  ] as const

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [heroImages.length])

  return (
    <section className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 border-b border-emerald-100">
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-8 px-6 py-10 md:flex-row md:items-center md:py-14">
        {/* Left: copy */}
        <div className="flex-1 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 mb-3">
            EcoHealth Naturals
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            <span className="whitespace-nowrap">The fresh market that</span>
            <br />
            cares for your wellness.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-md">
            Skip the crowded aisles. Order vibrant, organic herbs and everyday wellness essentials and we&rsquo;ll
            deliver them to your door
            <span className="font-semibold text-emerald-700"> in under 59 minutes</span>.
          </p>

          <div className="mt-6 flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold text-[#4285F4]">G</span>
              <span className="text-lg font-semibold text-[#EA4335]">o</span>
              <span className="text-lg font-semibold text-[#FBBC05]">o</span>
              <span className="text-lg font-semibold text-[#4285F4]">g</span>
              <span className="text-lg font-semibold text-[#34A853]">l</span>
              <span className="text-lg font-semibold text-[#EA4335]">e</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Reviews</span>
              <span className="font-semibold text-gray-900">4.7</span>
              <span className="text-amber-400 text-base">★★★★★</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-6 text-sm text-gray-700">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-emerald-600 text-white text-xs">✓</span>
              <span className="font-medium text-gray-800">Everything you love &amp; need</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-emerald-600 text-white text-xs">✓</span>
              <span className="font-medium text-gray-800">Quickly delivered</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-emerald-600 text-white text-xs">✓</span>
              <span className="font-medium text-gray-800">Every day low prices</span>
            </div>
          </div>
        </div>

        {/* Right: image */}
        <div className="relative flex-1 max-w-sm md:max-w-md lg:max-w-lg h-64 sm:h-72 md:h-80">
          {heroImages.map((src, idx) => {
            const isActive = idx === currentIndex
            const prevIndex = (currentIndex - 1 + heroImages.length) % heroImages.length
            const baseClasses =
              'absolute inset-0 h-full w-full object-contain drop-shadow-xl transform transition-all duration-700 ease-out origin-center'

            let stateClasses: string
            if (isActive) {
              // Active image: front and center
              stateClasses = 'opacity-100 translate-x-0 rotate-y-0 scale-100'
            } else if (idx === prevIndex) {
              // Previous image: slide out to the left with a slight 3D tilt
              stateClasses = 'opacity-0 -translate-x-10 -rotate-y-6 scale-95'
            } else {
              // Next image(s): slide in from the right with 3D tilt
              stateClasses = 'opacity-0 translate-x-10 rotate-y-6 scale-95'
            }

            return (
              <img
                key={src}
                src={src}
                alt="EcoHealth delivery bringing fresh groceries"
                className={`${baseClasses} ${stateClasses}`}
                loading="lazy"
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
