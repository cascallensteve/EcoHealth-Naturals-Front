import { API_BASE_URL } from './authService'

export interface Patient {
  id: number
  first_name: string
  last_name: string
  date_of_birth?: string | null
  phone: string
  email?: string | null
  address?: string | null
  created_at: string
  updated_at: string
}

export interface PatientPayload {
  first_name: string
  last_name: string
  date_of_birth?: string | null
  phone: string
  email?: string | null
  address?: string | null
}

export interface Treatment {
  id: number
  patient: number
  visit_date: string
  complaint: string
  diagnosis?: string | null
  treatment_plan: string
  notes?: string | null
}

export interface TreatmentPayload {
  patient?: number
  complaint: string
  diagnosis?: string | null
  treatment_plan: string
  notes?: string | null
}

export interface NestedTreatmentPayload {
  patient: PatientPayload
  complaint: string
  diagnosis?: string | null
  treatment_plan: string
  notes?: string | null
}

async function handlePatientResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = 'Patient request failed'
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

const PATIENT_BASE = `${API_BASE_URL}/api/patient/patients/`
const TREATMENT_BASE = `${API_BASE_URL}/api/patient/treatments/`

export async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch(PATIENT_BASE, { headers: adminHeaders() })
  return handlePatientResponse<Patient[]>(res)
}

export async function upsertPatient(payload: PatientPayload): Promise<Patient> {
  const res = await fetch(PATIENT_BASE, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  })
  return handlePatientResponse<Patient>(res)
}

export async function deletePatient(id: number): Promise<void> {
  const res = await fetch(`${PATIENT_BASE}${id}/`, {
    method: 'DELETE',
    headers: adminHeaders(),
  })
  if (!res.ok && res.status !== 204) {
    throw new Error('Failed to delete patient')
  }
}

export async function fetchTreatments(): Promise<Treatment[]> {
  const res = await fetch(TREATMENT_BASE, { headers: adminHeaders() })
  return handlePatientResponse<Treatment[]>(res)
}

export async function createTreatment(payload: NestedTreatmentPayload | TreatmentPayload): Promise<Treatment> {
  const res = await fetch(TREATMENT_BASE, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  })
  return handlePatientResponse<Treatment>(res)
}
