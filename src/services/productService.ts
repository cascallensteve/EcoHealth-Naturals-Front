import { API_BASE_URL } from './authService'

export interface Product {
  id: number
  name: string
  description: string
  price: string
  amount: number
  category: number
  is_available: boolean
  demand: 'low' | 'medium' | 'high'
  image_url?: string
  created_at: string
  updated_at: string
}

export interface ProductPayload {
  name: string
  description: string
  price: string
  amount: number
  category: number
  category_name?: string
  is_available?: boolean
  demand?: 'low' | 'medium' | 'high'
  image_url?: string
}

async function handleProductResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = 'Product request failed'
    try {
      const data = await res.json()
      detail = (data && (data.detail || JSON.stringify(data))) || detail
    } catch {
      // ignore
    }
    throw new Error(detail)
  }
  return res.json() as Promise<T>
}

function adminHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_auth_token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Token ${token}` } : {}),
  }
}

const BASE = `${API_BASE_URL}/api/products/products/`

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(BASE, { headers: adminHeaders() })
  return handleProductResponse<Product[]>(res)
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${BASE}${id}/`, { headers: adminHeaders() })
  return handleProductResponse<Product>(res)
}

// Upsert by (name, category)
export async function upsertProduct(payload: ProductPayload): Promise<Product> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  })
  return handleProductResponse<Product>(res)
}

export async function updateProduct(id: number, payload: Partial<ProductPayload>): Promise<Product> {
  const res = await fetch(`${BASE}${id}/`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  })
  return handleProductResponse<Product>(res)
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${BASE}${id}/`, {
    method: 'DELETE',
    headers: adminHeaders(),
  })
  if (!res.ok && res.status !== 204) {
    throw new Error('Failed to delete product')
  }
}
