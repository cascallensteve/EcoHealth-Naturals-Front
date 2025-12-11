import { useState } from 'react'
import { Link } from 'react-router-dom'

const PRE_FAQS = [
  {
    q: 'What is EcoHealth Naturals?',
    a:
      'EcoHealth Naturals is an online fresh market with organic herbs, veg, pantry staples and natural care, delivered fast at great value.'
  },
  { q: 'How do I order?', a: 'Browse, add to cart, and checkout. We’ll confirm and deliver quickly.' },
  { q: 'How fast is delivery?', a: 'In most areas within 59 minutes after confirmation.' },
  { q: 'What is our promise?', a: 'Honest quality, fair prices, quick delivery, and great service.' },
  { q: 'What are the delivery options?', a: 'Standard and express delivery windows depending on location and time.' },
]

export default function FaqPreview() {
  const [open, setOpen] = useState(0)
  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="text-center text-xl sm:text-2xl font-semibold tracking-wide text-gray-900">FREQUENTLY ASKED QUESTIONS</h2>
      <div className="mt-6 space-y-4">
        {PRE_FAQS.map((item, idx) => (
          <div key={item.q} className="border-b border-gray-200 pb-3">
            <button
              type="button"
              onClick={() => setOpen((v) => (v === idx ? -1 : idx))}
              className="flex w-full items-center justify-between py-2 text-left text-sm sm:text-base font-semibold text-gray-900 hover:text-emerald-700"
            >
              <span className={open === idx ? 'text-emerald-700' : ''}>{item.q}</span>
              <span className={`text-lg ${open === idx ? 'text-emerald-700' : 'text-gray-700'}`}>{open === idx ? '−' : '+'}</span>
            </button>
            {open === idx && (
              <p className="mt-1 pl-1 sm:pl-4 text-sm text-gray-700">{item.a}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link to="/faqs" className="inline-flex items-center rounded-md bg-emerald-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-800">READ MORE FAQS</Link>
      </div>
    </section>
  )
}
