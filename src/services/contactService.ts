import { API_BASE_URL } from './authService'
import { publishNewNotification } from './notificationService'

export interface ContactPayload {
  name: string
  email: string
  phone_number: string
  main_concern: string
}

export interface ContactResponse {
  id: number
  name: string
  email: string
  phone_number: string
  main_concern: string
  created_at: string
}

async function handleContactResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = 'Failed to submit message'
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

export async function submitContact(payload: ContactPayload): Promise<ContactResponse> {
  const res = await fetch(`${API_BASE_URL}/api/contact/submit/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const data = await handleContactResponse<ContactResponse>(res)
  // Notify admin clients
  try { publishNewNotification('contact') } catch {}
  return data
}
