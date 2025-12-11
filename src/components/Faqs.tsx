import { useState, type ReactNode } from 'react'

interface FaqItem {
  question: string
  answer: ReactNode
}

const FAQS: FaqItem[] = [
  {
    question: 'What is EcoHealth Naturals?',
    answer: (
      <p className="text-sm text-gray-700">
        <span className="font-semibold">EcoHealth Naturals</span> is an online fresh market that offers everything you need for everyday
        wellness—from organic herbs and veg to pantry staples and natural body care. We focus on quality, freshness and
        convenience so you can feel your best.
      </p>
    ),
  },
  {
    question: 'How do I order?',
    answer: (
      <p className="text-sm text-gray-700">
        Browse our categories, add items to your cart, then head to checkout to confirm your delivery details and payment.
        You’ll receive a confirmation email and SMS once your order is placed.
      </p>
    ),
  },
  {
    question: 'How fast is delivery?',
    answer: (
      <p className="text-sm text-gray-700">
        In most areas we deliver within <span className="font-semibold">59 minutes</span> of confirming your order. Delivery windows may
        vary slightly depending on time of day and location, but we’ll always show you the expected delivery time at
        checkout.
      </p>
    ),
  },
  {
    question: 'What is your promise?',
    answer: (
      <div className="text-sm text-gray-700 space-y-2 text-left">
        <p>
          <span className="font-semibold">Our promise</span> is to make your life easier, healthier, and more convenient. EcoHealth Naturals
          is your one-stop shop for fresh, honest food delivered straight to your door.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="font-semibold">Everything you need:</span> From herbs and fruit to pantry staples and wellness products.
          </li>
          <li>
            <span className="font-semibold">Great prices:</span> Everyday fair pricing on high-quality, carefully sourced items.
          </li>
          <li>
            <span className="font-semibold">Quick delivery:</span> Fast, reliable delivery so your fresh food arrives in great condition.
          </li>
          <li>
            <span className="font-semibold">Amazing service:</span> Friendly support and riders who genuinely care about your experience.
          </li>
          <li>
            <span className="font-semibold">Sustainability:</span> We’re committed to ethical sourcing and more eco-friendly choices.
          </li>
        </ul>
        <p>With EcoHealth Naturals, it’s more than just shopping — it’s about simplifying your healthy life.</p>
      </div>
    ),
  },
]

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (idx: number) => {
    setOpenIndex((current) => (current === idx ? -1 : idx))
  }

  return (
    <div className="bg-white text-gray-900">
      {/* Hero banner */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden">
          <img
            src="https://res.cloudinary.com/djksfayfu/image/upload/v1753303607/aloe-vera-leaves-with-beauty-cream-bottle_jahbg4.jpg"
            alt="EcoHealth Naturals FAQ hero"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">FAQS</h1>
            <p
              className="mt-2 text-sm sm:text-base"
              style={{ fontFamily: '"Dancing Script", cursive', color: '#E5FFDF' }}
            >
              How can we help you today?
            </p>
          </div>
        </div>
      </section>

      {/* FAQ content */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="space-y-4">
          {FAQS.map((item, idx) => {
            const isOpen = idx === openIndex
            return (
              <div key={item.question} className="border-b border-gray-200 pb-4">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between py-2 text-left text-sm sm:text-base font-semibold text-gray-900 hover:text-emerald-700"
                >
                  <span>{item.question}</span>
                  <span className="text-lg text-emerald-700">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="mt-2 pl-1 sm:pl-4">
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
