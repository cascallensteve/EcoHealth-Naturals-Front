import { getAdminIdentity } from '../services/adminAuthService'

interface AdminBannerProps {
  title?: string
  subtitle?: string
}

const BANNER_BG = 'https://res.cloudinary.com/djksfayfu/image/upload/v1753302980/turmeric-powder_joex5s.jpg'

export default function AdminBanner({ title, subtitle }: AdminBannerProps) {
  const { email, username } = getAdminIdentity()
  const displayName = username || email || 'EcoHealth Admin'

  const heading = title || `Good to see you, ${displayName}`
  const description =
    subtitle ||
    'Track new orders, consultations and contact messages at a glance. Use the cards below to jump straight into the areas that need your attention today.'

  return (
    <div
      className="relative overflow-hidden rounded-2xl px-5 py-4 text-white shadow-md mb-4"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(6, 78, 59, 0.96), rgba(22, 163, 74, 0.94), rgba(30, 64, 175, 0.96)), url(${BANNER_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-wide text-emerald-100/90">Admin overview</p>
        <h1 className="mt-1 text-xl font-semibold">{heading}</h1>
        <p className="mt-1 text-xs sm:text-sm text-emerald-50/90 max-w-2xl">{description}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
    </div>
  )
}
