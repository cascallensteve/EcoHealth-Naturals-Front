import { useEffect, useMemo, useState } from 'react'
import {
  fetchProducts,
  upsertProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type ProductPayload,
} from '../services/productService'

const CATEGORY_OPTIONS = [
  { id: 1, name: 'Herbal Remedies' },
  { id: 2, name: 'Essential Oils' },
  { id: 3, name: 'Natural Food-Based Remedies' },
  { id: 4, name: 'Herbal Teas & Infusions' },
  { id: 5, name: 'Supplements & Natural Extracts' },
  { id: 6, name: 'Minerals & Earth-Based Remedies' },
  { id: 7, name: 'Natural Mushrooms' },
  { id: 8, name: 'Skin & Topical Natural Products' },
  { id: 9, name: 'Detox & Wellness Remedies' },
]

function getCategoryName(id: number | undefined | null) {
  if (!id) return '—'
  const found = CATEGORY_OPTIONS.find((c) => c.id === id)
  return found?.name ?? `Category ${id}`
}
type FormState = {
  id?: number
  name: string
  description: string
  price: string
  amount: number
  category: number
  is_available: boolean
  demand: 'low' | 'medium' | 'high'
  image_url: string
}
const emptyForm: FormState = {
  name: '',
  description: '',
  price: '',
  amount: 0,
  category: CATEGORY_OPTIONS[0]?.id ?? 1,
  is_available: true,
  demand: 'medium',
  image_url: '',
}
function formatPriceKES(value: string | number) {
  const n = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(n)) return value || '—'
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(n)
}
export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all')
  const [panelOpen, setPanelOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  // Toast-like inline message
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  useEffect(() => {
    void loadProducts()
  }, [])
  async function loadProducts() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }
  function openCreate() {
    setForm(emptyForm)
    setPanelOpen(true)
  }
  function openEdit(product: Product) {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      amount: product.amount,
      category: product.category,
      is_available: product.is_available,
      demand: product.demand,
      image_url: product.image_url || '',
    })
    setPanelOpen(true)
  }
  function closePanel() {
    if (saving) return
    setPanelOpen(false)
    setForm(emptyForm)
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setBanner(null)
    const payload: ProductPayload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: String(form.price).trim(),
      amount: Number(form.amount) || 0,
      category: Number(form.category) || 1,
      category_name: getCategoryName(form.category),
      is_available: form.is_available,
      demand: form.demand,
      image_url: form.image_url.trim() || undefined,
    }
    try {
      if (form.id) {
        const updated = await updateProduct(form.id, payload)
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        setBanner({ type: 'success', message: 'Product updated successfully' })
      } else {
        const created = await upsertProduct(payload)
        setProducts((prev) => {
          const exists = prev.find((p) => p.id === created.id)
          if (exists) {
            return prev.map((p) => (p.id === created.id ? created : p))
          }
          return [created, ...prev]
        })
        setBanner({ type: 'success', message: 'Product created successfully' })
      }
      setPanelOpen(false)
      setForm(emptyForm)
    } catch (err: any) {
      setBanner({ type: 'error', message: err?.message || 'Failed to save product' })
    } finally {
      setSaving(false)
    }
  }
  async function handleDelete(id: number) {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    setDeletingId(id)
    setBanner(null)
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      setBanner({ type: 'success', message: 'Product deleted' })
    } catch (err: any) {
      setBanner({ type: 'error', message: err?.message || 'Failed to delete product' })
    } finally {
      setDeletingId(null)
    }
  }
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const q = search.toLowerCase().trim()
        if (!q) return true
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          getCategoryName(p.category).toLowerCase().includes(q)
        )
      })
      .filter((p) => {
        if (availabilityFilter === 'all') return true
        if (availabilityFilter === 'available') return p.is_available
        if (availabilityFilter === 'unavailable') return !p.is_available
        return true
      })
  }, [products, search, availabilityFilter])
  return (
    <div className="min-h-full py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-emerald-50">Products</h1>
          <p className="text-xs sm:text-sm text-emerald-200/80">
            Manage your wellness catalog, pricing, stock and visibility in the store.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadProducts}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-transparent px-3 py-1.5 text-xs font-medium text-emerald-100 hover:bg-emerald-500/10"
            disabled={loading}
          >
            <span className="material-symbols-rounded text-base">
              {loading ? 'progress_activity' : 'refresh'}
            </span>
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow hover:bg-emerald-400"
          >
            <span className="material-symbols-rounded text-base">add</span>
            Add product
          </button>
        </div>
      </div>
      {/* Banner */}
      {banner && (
        <div
          className={`mb-4 rounded-lg border px-3 py-2 text-xs sm:text-sm ${
            banner.type === 'success'
              ? 'border-emerald-500/60 bg-emerald-900/40 text-emerald-50'
              : 'border-red-400/70 bg-red-900/40 text-red-50'
          }`}
        >
          {banner.message}
        </div>
      )}
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-rounded pointer-events-none absolute inset-y-0 left-2 flex items-center text-emerald-200/80 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, description or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-emerald-800/60 bg-slate-950/40 pl-8 pr-3 py-2 text-xs sm:text-sm text-emerald-50 placeholder:text-emerald-200/50 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/80"
            />
          </div>
        </div>
        <div className="flex gap-2 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setAvailabilityFilter('all')}
            className={`rounded-full px-3 py-1 border text-xs ${
              availabilityFilter === 'all'
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-50'
                : 'border-emerald-700/70 bg-transparent text-emerald-200/80'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setAvailabilityFilter('available')}
            className={`rounded-full px-3 py-1 border text-xs ${
              availabilityFilter === 'available'
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-50'
                : 'border-emerald-700/70 bg-transparent text-emerald-200/80'
            }`}
          >
            In stock
          </button>
          <button
            type="button"
            onClick={() => setAvailabilityFilter('unavailable')}
            className={`rounded-full px-3 py-1 border text-xs ${
              availabilityFilter === 'unavailable'
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-50'
                : 'border-emerald-700/70 bg-transparent text-emerald-200/80'
            }`}
          >
            Hidden / out
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="rounded-xl border border-emerald-900/60 bg-slate-950/60 backdrop-blur-xl shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-emerald-100/80 flex items-center gap-2">
            <span className="material-symbols-rounded animate-spin text-base">progress_activity</span>
            Loading products…
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-100 flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadProducts}
              className="inline-flex items-center gap-1 rounded-lg border border-red-400/50 px-3 py-1 text-xs hover:bg-red-900/40"
            >
              <span className="material-symbols-rounded text-sm">refresh</span>
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-6 text-sm text-emerald-100/80">
            <p className="mb-2">No products found.</p>
            <p className="text-xs text-emerald-200/70">
              Try adjusting your search or create a new product using the “Add product” button.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs sm:text-sm text-emerald-50/90">
              <thead className="bg-emerald-900/60 text-[11px] sm:text-xs uppercase tracking-wide text-emerald-200/80">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Demand</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/70">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-emerald-900/40">
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-start gap-3">
                        {product.image_url ? (
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-emerald-900/70 bg-slate-900">
                            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                            <img
                              src={product.image_url}
                              alt={product.name || 'Product image'}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 flex-shrink-0 rounded-lg border border-dashed border-emerald-900/60 bg-slate-950/60 flex items-center justify-center text-[11px] text-emerald-400/70">
                            No image
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-emerald-50 truncate" title={product.name}>
                            {product.name}
                          </span>
                          <span className="text-[11px] text-emerald-200/70 line-clamp-2">
                            {product.description || 'No description'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-emerald-200/80">
                      {getCategoryName(product.category)}
                    </td>
                    <td className="px-4 py-3 align-top text-xs">
                      {formatPriceKES(product.price)}
                    </td>
                    <td className="px-4 py-3 align-top text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-2 py-0.5 text-[11px]">
                        <span className="material-symbols-rounded text-[14px] text-emerald-300">inventory_2</span>
                        {product.amount} units
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-xs">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
                          product.demand === 'high'
                            ? 'bg-red-500/20 text-red-200'
                            : product.demand === 'medium'
                            ? 'bg-amber-500/20 text-amber-100'
                            : 'bg-emerald-500/20 text-emerald-100'
                        }`}
                      >
                        {product.demand}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-xs">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${
                          product.is_available
                            ? 'bg-emerald-500/20 text-emerald-100'
                            : 'bg-slate-700/60 text-slate-100'
                        }`}
                      >
                        <span className="material-symbols-rounded text-[14px]">
                          {product.is_available ? 'visibility' : 'visibility_off'}
                        </span>
                        {product.is_available ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          className="inline-flex items-center rounded-lg border border-emerald-700/70 px-2 py-1 text-[11px] text-emerald-100 hover:bg-emerald-900/60"
                        >
                          <span className="material-symbols-rounded text-[14px] mr-0.5">edit</span>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="inline-flex items-center rounded-lg border border-red-500/60 px-2 py-1 text-[11px] text-red-100 hover:bg-red-900/60"
                          disabled={deletingId === product.id}
                        >
                          <span className="material-symbols-rounded text-[14px] mr-0.5">
                            {deletingId === product.id ? 'progress_activity' : 'delete'}
                          </span>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Slide-over panel */}
      <div
        className={`fixed inset-0 z-40 flex justify-end bg-black/40 transition-opacity ${
          panelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`w-full max-w-md bg-slate-950 border-l border-emerald-900/70 shadow-xl transform transition-transform ${
            panelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-900/70">
            <div>
              <h2 className="text-sm font-semibold text-emerald-50">
                {form.id ? 'Edit product' : 'Add product'}
              </h2>
              <p className="text-[11px] text-emerald-200/80">
                {form.id ? 'Update product details and visibility.' : 'Create a new product in your catalog.'}
              </p>
            </div>
            <button
              type="button"
              onClick={closePanel}
              className="rounded-full p-1 text-emerald-100 hover:bg-emerald-900/60"
              disabled={saving}
            >
              <span className="material-symbols-rounded text-[18px]">close</span>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3 text-xs sm:text-sm">
            <div>
              <label className="block text-[11px] font-medium text-emerald-200 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-emerald-800/70 bg-slate-900/60 px-3 py-2 text-emerald-50 placeholder:text-emerald-200/50 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/80"
                placeholder="Product name"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-emerald-200 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-lg border border-emerald-800/70 bg-slate-900/60 px-3 py-2 text-emerald-50 placeholder:text-emerald-200/50 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/80"
                placeholder="Short description for customers"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-emerald-200 mb-1">
                  Price (KES)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  required
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full rounded-lg border border-emerald-800/70 bg-slate-900/60 px-3 py-2 text-emerald-50 placeholder:text-emerald-200/50 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/80"
                  placeholder="e.g. 1500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-emerald-200 mb-1">
                  Stock (units)
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) || 0 }))}
                  className="w-full rounded-lg border border-emerald-800/70 bg-slate-900/60 px-3 py-2 text-emerald-50 placeholder:text-emerald-200/50 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/80"
                  placeholder="e.g. 20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-emerald-200 mb-1">
                  Category
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: Number(e.target.value) || CATEGORY_OPTIONS[0]?.id || 1 }))
                  }
                  className="w-full rounded-lg border border-emerald-800/70 bg-slate-900/60 px-3 py-2 text-emerald-50 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/80"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-emerald-200 mb-1">
                  Demand
                </label>
                <select
                  value={form.demand}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, demand: e.target.value as 'low' | 'medium' | 'high' }))
                  }
                  className="w-full rounded-lg border border-emerald-800/70 bg-slate-900/60 px-3 py-2 text-emerald-50 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/80"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-emerald-200 mb-1">
                Image URL (optional)
              </label>
              <div className="flex items-start gap-3">
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  className="w-full rounded-lg border border-emerald-800/70 bg-slate-900/60 px-3 py-2 text-emerald-50 placeholder:text-emerald-200/50 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/80"
                  placeholder="https://…"
                />
                {form.image_url && (
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-emerald-900/70 bg-slate-900">
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img
                      src={form.image_url}
                      alt={form.name || 'Product image preview'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="inline-flex items-center gap-2 text-[11px] text-emerald-100">
                <input
                  type="checkbox"
                  checked={form.is_available}
                  onChange={(e) => setForm((f) => ({ ...f, is_available: e.target.checked }))}
                  className="h-3.5 w-3.5 rounded border-emerald-700/80 bg-slate-900 text-emerald-500 focus:ring-emerald-500/80"
                />
                Visible in store
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-lg border border-emerald-700/70 px-3 py-1.5 text-xs text-emerald-100 hover:bg-emerald-900/70"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow hover:bg-emerald-400 disabled:opacity-70"
                >
                  <span className="material-symbols-rounded text-[16px]">
                    {saving ? 'progress_activity' : 'check'}
                  </span>
                  {form.id ? 'Save changes' : 'Create product'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}