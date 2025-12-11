import { API_BASE_URL, getStoredToken } from './authService'
import { publishNewNotification } from './notificationService'

export interface ConsultationPayload {
  name: string
  email: string
  phone_number: string
  gender: 'M' | 'F' | 'O'
  age: number
  main_concern: string
  symptoms: string
  duration: string
  additional_notes: string
  appointment_time: string
}

export interface ConsultationResponseData extends ConsultationPayload {
  id: number
  user: number
  is_resolved: boolean
  created_at: string
  updated_at: string
}

export interface ConsultationResponse {
  message: string
  data: ConsultationResponseData
}

async function handleConsultationResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = 'Failed to submit consultation'
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

export async function createConsultation(payload: ConsultationPayload): Promise<ConsultationResponse> {
  const token = getStoredToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Token ${token}`
  }

  const res = await fetch(`${API_BASE_URL}/api/consultation/create/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  const data = await handleConsultationResponse<ConsultationResponse>(res)
  // Notify admin clients
  try { publishNewNotification('consultation') } catch {}
  return data
}
