import { useState } from 'react'
import { createConsultation, type ConsultationPayload } from '../services/consultationService'

export default function Consultation() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState<'M' | 'F' | 'O'>('F')
  const [age, setAge] = useState('')
  const [mainConcern, setMainConcern] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name || !email || !phone || !gender || !age || !mainConcern || !symptoms || !duration || !appointmentTime) {
      setError('Please fill in all required fields before submitting your consultation.')
      return
    }

    const payload: ConsultationPayload = {
      name,
      email,
      phone_number: phone,
      gender,
      age: Number(age),
      main_concern: mainConcern,
      symptoms,
      duration,
      additional_notes: notes,
      appointment_time: new Date(appointmentTime).toISOString(),
    }

    try {
      setLoading(true)
      const res = await createConsultation(payload)
      setSuccess(res.message || 'Consultation submitted successfully.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit consultation. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white text-gray-900">
      {/* Hero banner - reuse FAQ style */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden">
          <img
            src="https://res.cloudinary.com/djksfayfu/image/upload/v1753303607/aloe-vera-leaves-with-beauty-cream-bottle_jahbg4.jpg"
            alt="EcoHealth Naturals consultation hero"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Consultation</h1>
            <p
              className="mt-2 text-sm sm:text-base"
              style={{ fontFamily: '"Dancing Script", cursive', color: '#E5FFDF' }}
            >
              Book a wellness consultation with EcoHealth Naturals
            </p>
          </div>
        </div>
      </section>

      {/* Consultation process section */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-4">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-center">
          {/* Left: illustrative image */}
          <div className="relative">
            {/* Main consultation image */}
            <div className="overflow-hidden rounded-3xl border border-emerald-50 bg-emerald-50/40 shadow-sm">
              <img
                src="https://res.cloudinary.com/djksfayfu/image/upload/v1765447075/freepik__35mm-film-photography-african-woman-centerframe-be__80751-removebg-preview_rshy2o.webp"
                alt="Herbal consultation at EcoHealth Naturals"
                className="h-64 w-full object-cover sm:h-72 md:h-80"
                loading="lazy"
              />
            </div>

            {/* Overlapping secondary image card */}
            <div className="absolute -bottom-6 -left-4 hidden sm:block w-40 overflow-hidden rounded-2xl border border-white bg-white shadow-lg">
              <img
                src="https://res.cloudinary.com/djksfayfu/image/upload/v1765447844/ChatGPT_Image_Dec_11__2025__01_06_09_PM-removebg-preview_lqijav.png"
                alt="EcoHealth Naturals specialist"
                className="h-28 w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="absolute -bottom-4 right-0 hidden sm:block rounded-2xl bg-white/90 px-4 py-3 text-xs shadow-md">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                ABOUT OUR CONSULTATION
              </div>
              <div className="mt-1 text-[11px] text-gray-700">
                1:1 guidance from licensed herbal & nutrition experts.
              </div>
            </div>
          </div>

          {/* Right: copy + steps */}
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700">
              HOW YOUR SESSION WORKS
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              A simple, calm process for your wellness consultation.
            </h2>
            <p className="text-sm sm:text-base text-gray-700 max-w-xl">
              We combine modern assessment with time-tested natural remedies. Share your story, get a personalised plan,
              and leave with clear next steps for your everyday wellness routine.
            </p>

            <ol className="mt-3 space-y-3 text-sm text-gray-800">
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                  1
                </span>
                <div>
                  <div className="font-semibold">Share your main concern</div>
                  <p className="text-xs sm:text-[13px] text-gray-600">
                    Tell us about your current symptoms, lifestyle, and goals so we understand the full picture.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                  2
                </span>
                <div>
                  <div className="font-semibold">Meet your EcoHealth specialist</div>
                  <p className="text-xs sm:text-[13px] text-gray-600">
                    In your booked time slot, you&apos;ll speak with a specialist who reviews your form and asks focused questions.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                  3
                </span>
                <div>
                  <div className="font-semibold">Receive a personalised plan</div>
                  <p className="text-xs sm:text-[13px] text-gray-600">
                    Get clear recommendations on herbal blends, nutrition tweaks, and lifestyle habits tailored to you.
                  </p>
                </div>
              </li>
            </ol>

            <p className="pt-1 text-xs text-gray-500">
              Your details are kept private and only used to support your consultation experience.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        {success ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-8 text-sm text-emerald-900 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Consultation submitted</h2>
            <p>{success}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name*</label>
                <input
                  className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone number*</label>
                <input
                  className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Gender*</label>
                <select
                  className="w-full border-b border-gray-300 px-1 py-1 bg-white outline-none focus:border-emerald-600"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F' | 'O')}
                  required
                >
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Age*</label>
                <input
                  type="number"
                  min={0}
                  className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Main concern*</label>
              <input
                className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                placeholder="Digestive issues, sleep, skin, energy..."
                value={mainConcern}
                onChange={(e) => setMainConcern(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Symptoms*</label>
              <textarea
                rows={3}
                className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                placeholder="Bloating after meals, fatigue, headaches..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Duration*</label>
              <input
                className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                placeholder="e.g. 3 months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Additional notes</label>
              <textarea
                rows={3}
                className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                placeholder="Anything else we should know before your consultation?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Preferred appointment time*</label>
              <input
                type="datetime-local"
                className="w-full border-b border-gray-300 px-1 py-1 outline-none focus:border-emerald-600"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="pt-2">
              <button
                type="submit"
                className="w-40 rounded-sm bg-[#008000] py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit consultation'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
