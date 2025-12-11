import { API_BASE_URL } from './authService'

export interface AdminSignupPayload {
  username: string
  email: string
  password: string
}

export interface AdminLoginPayload {
  email: string
  password: string
}

export interface AdminAuthResponse {
  message: string
  token: string
}

async function handleAdminResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = 'Admin request failed'
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

export async function adminSignup(payload: AdminSignupPayload): Promise<AdminAuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/adminauths/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleAdminResponse<AdminAuthResponse>(res)
}

export async function adminLogin(payload: AdminLoginPayload): Promise<AdminAuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/adminauths/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleAdminResponse<AdminAuthResponse>(res)
}

export function saveAdminToken(token: string) {
  localStorage.setItem('admin_auth_token', token)
}

export function saveAdminIdentity(email: string, username?: string) {
  localStorage.setItem('admin_email', email)
  if (username) {
    localStorage.setItem('admin_username', username)
  }
}

export function getAdminIdentity() {
  if (typeof window === 'undefined') {
    return { email: null as string | null, username: null as string | null }
  }
  const email = localStorage.getItem('admin_email')
  const username = localStorage.getItem('admin_username')
  return { email, username }
}

export function clearAdminAuth() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('admin_auth_token')
  localStorage.removeItem('admin_email')
  localStorage.removeItem('admin_username')
}
