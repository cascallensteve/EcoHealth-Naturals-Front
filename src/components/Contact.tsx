import { useState } from 'react'
import { submitContact, type ContactPayload } from '../services/contactService'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [mainConcern, setMainConcern] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name || !email || !phone || !mainConcern) {
      setError('Please fill in your name, email, phone number, and main concern.')
      return
    }

    const payload: ContactPayload = {
      name,
      email,
      phone_number: phone,
      main_concern: mainConcern,
    }

    try {
      setLoading(true)
      await submitContact(payload)
      setSuccess('Thank you! Your message has been received and we will get back to you shortly.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white text-gray-900">
      {/* Hero banner */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop"
            alt="Colorful fresh food bowls"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p
              className="text-sm sm:text-base mb-1"
              style={{ fontFamily: '"Dancing Script", cursive', color: '#E5FFDF' }}
            >
              We would love to hear from you
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 px-6 py-10">
        {/* Left: contact info */}
        <div className="space-y-3 text-sm sm:text-base text-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">We would love to help you</h2>
          <p>if you have any questions or comments!</p>
          <p className="font-semibold text-gray-900">+254 727 444 777</p>
          <p className="font-semibold text-gray-900">support@ecohealthnaturals.ke</p>
          <p className="mt-3 flex items-center gap-2">
            <span className="text-emerald-600 text-lg">🟢</span>
            <span>
              chat on <span className="font-semibold text-emerald-700">WhatsApp</span> between
              <span className="font-medium"> 7am and 7pm</span>
            </span>
          </p>
        </div>

        {/* Right: form or success panel */}
        {success ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-8 text-sm text-emerald-900 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Message sent successfully</h3>
            <p>{success}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name*</label>
                <input
                  className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email address*</label>
                <input
                  type="email"
                  className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone*</label>
                <input
                  className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                  placeholder="Your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                <input
                  className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                  placeholder="How can we help?"
                  value={mainConcern}
                  onChange={(e) => setMainConcern(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Message*</label>
              <textarea
                rows={4}
                className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                placeholder="Tell us what you’d like to know about EcoHealth Naturals products..."
                value={mainConcern}
                onChange={(e) => setMainConcern(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="pt-2">
              <button
                type="submit"
                className="w-32 rounded-sm bg-[#008000] py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
