export default function MainFooter() {
  return (
    <footer className="mt-10 border-t border-emerald-100 bg-emerald-50/60 text-sm text-emerald-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        {/* Top area */}
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-lg font-semibold text-emerald-800">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-base font-bold">E</span>
              <span>
                <span className="block leading-tight">EcoHealth</span>
                <span className="block -mt-1 text-emerald-700">Naturals</span>
              </span>
            </div>
            <p className="mt-3 text-xs text-emerald-800/90 max-w-sm">
              Fresh, organic and thoughtfully sourced. Delivered with care across the city.
            </p>
            <div className="mt-4 flex items-center gap-3 text-emerald-700">
              <a aria-label="Facebook" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-emerald-200 hover:bg-emerald-50" href="#">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M13 22v-9h3l1-4h-4V6a1 1 0 0 1 1-1h3V1h-3a5 5 0 0 0-5 5v3H6v4h3v9h4z"/></svg>
              </a>
              <a aria-label="Instagram" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-emerald-200 hover:bg-emerald-50" href="#">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>
              </a>
              <a aria-label="X" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-emerald-200 hover:bg-emerald-50" href="#">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18 2h3l-7 9 8 11h-6l-5-7-6 7H2l8-9L3 2h6l5 7 4-7z"/></svg>
              </a>
            </div>
          </div>

          {/* Columns */}
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">Shop</h3>
            <ul className="mt-3 space-y-2 text-xs text-emerald-900/90">
              <li><button className="hover:text-emerald-700">Herbal Remedies</button></li>
              <li><button className="hover:text-emerald-700">Essential Oils</button></li>
              <li><button className="hover:text-emerald-700">Organic</button></li>
              <li><button className="hover:text-emerald-700">Quick Shop</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">Explore</h3>
            <ul className="mt-3 space-y-2 text-xs text-emerald-900/90">
              <li><button className="hover:text-emerald-700">Why Choose Us</button></li>
              <li><button className="hover:text-emerald-700">Top Sellers</button></li>
              <li><button className="hover:text-emerald-700">100% Organic</button></li>
              <li><button className="hover:text-emerald-700">Testimonials</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">Help</h3>
            <ul className="mt-3 space-y-2 text-xs text-emerald-900/90">
              <li><button className="hover:text-emerald-700">FAQs</button></li>
              <li><button className="hover:text-emerald-700">Delivery</button></li>
              <li><button className="hover:text-emerald-700">Returns</button></li>
              <li><button className="hover:text-emerald-700">Support</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">Company</h3>
            <ul className="mt-3 space-y-2 text-xs text-emerald-900/90">
              <li><button className="hover:text-emerald-700">About Us</button></li>
              <li><button className="hover:text-emerald-700">Sustainability</button></li>
              <li><button className="hover:text-emerald-700">Careers</button></li>
              <li><button className="hover:text-emerald-700">Contact</button></li>
            </ul>
          </div>
        </div>

        {/* Newsletter + Contact strip */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3 items-start rounded-2xl border border-emerald-100 bg-white/60 p-4">
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">Stay fresh</h3>
            <p className="mt-1 text-xs text-emerald-900/90">Get weekly recipes, new arrivals and exclusive offers.</p>
          </div>
          <form className="flex gap-2">
            <input
              type="email"
              className="flex-1 rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs outline-none placeholder:text-emerald-300"
              placeholder="Email address"
            />
            <button className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
              Join
            </button>
          </form>
          <div className="text-xs text-emerald-900/90">
            <div className="font-semibold text-emerald-800">Contact</div>
            <div className="mt-1">+254 700 000 000</div>
            <div className="">hello@ecohealthnaturals.co.ke</div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-3 border-t border-emerald-100 pt-4 text-[11px] text-emerald-700 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EcoHealth Naturals. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="hover:text-emerald-900">Privacy</button>
            <span className="hidden sm:inline text-emerald-300">|</span>
            <button className="hover:text-emerald-900">Terms</button>
            <span className="hidden sm:inline text-emerald-300">|</span>
            <button className="hover:text-emerald-900">Cookies</button>
            <div className="ml-2 flex items-center gap-2">
              <span className="rounded-md bg-white px-2 py-1 ring-1 ring-emerald-200">Mpesa</span>
              <span className="rounded-md bg-white px-2 py-1 ring-1 ring-emerald-200">Visa</span>
              <span className="rounded-md bg-white px-2 py-1 ring-1 ring-emerald-200">Mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
