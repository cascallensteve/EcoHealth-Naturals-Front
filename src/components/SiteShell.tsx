import type { PropsWithChildren } from 'react'
import MainNavbar from './MainNavbar'

export default function SiteShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50/70 text-gray-900">
      <MainNavbar />
      {children}
    </div>
  )
}
