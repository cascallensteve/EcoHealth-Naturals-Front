import { useEffect, useState } from 'react'
import AdminBanner from './AdminBanner'
import type { Patient, PatientPayload, Treatment } from '../services/patientService'
import { fetchPatients, upsertPatient, fetchTreatments, createTreatment } from '../services/patientService'

function formatDate(value?: string | null) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value || ''
  }
}

export default function AdminPatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(false)
  const [savingPatient, setSavingPatient] = useState(false)
  const [savingTreatment, setSavingTreatment] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)

  const [patientForm, setPatientForm] = useState<PatientPayload>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone: '',
    email: '',
    address: '',
  })

  const [treatmentForm, setTreatmentForm] = useState({
    complaint: '',
    diagnosis: '',
    treatment_plan: '',
    notes: '',
  })

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([fetchPatients(), fetchTreatments()])
      .then(([patientsData, treatmentsData]) => {
        setPatients(patientsData)
        setTreatments(treatmentsData)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  function resetPatientForm() {
    setPatientForm({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      phone: '',
      email: '',
      address: '',
    })
  }

  function resetTreatmentForm() {
    setTreatmentForm({
      complaint: '',
      diagnosis: '',
      treatment_plan: '',
      notes: '',
    })
  }

  async function handleSavePatient(e: React.FormEvent) {
    e.preventDefault()
    setSavingPatient(true)
    setError(null)
    try {
      const payload: PatientPayload = {
        ...patientForm,
        date_of_birth: patientForm.date_of_birth || null,
        email: patientForm.email || null,
        address: patientForm.address || null,
      }
      const saved = await upsertPatient(payload)
      setPatients((prev) => {
        const idx = prev.findIndex((p) => p.id === saved.id)
        if (idx === -1) return [saved, ...prev]
        const copy = [...prev]
        copy[idx] = saved
        return copy
      })
      setSelectedPatientId(saved.id)
      resetPatientForm()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save patient')
    } finally {
      setSavingPatient(false)
    }
  }

  async function handleSaveTreatment(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPatientId && !patientForm.phone) {
      setError('Select an existing patient or enter patient details with a phone number.')
      return
    }
    setSavingTreatment(true)
    setError(null)
    try {
      let payload: any
      if (selectedPatientId) {
        payload = {
          patient: selectedPatientId,
          ...treatmentForm,
        }
      } else {
        payload = {
          patient: {
            ...patientForm,
            date_of_birth: patientForm.date_of_birth || null,
            email: patientForm.email || null,
            address: patientForm.address || null,
          },
          ...treatmentForm,
        }
      }
      const saved = await createTreatment(payload)
      setTreatments((prev) => [saved, ...prev])
      resetTreatmentForm()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save treatment')
    } finally {
      setSavingTreatment(false)
    }
  }

  const recentTreatments = treatments.slice(0, 5)

  return (
    <div className="space-y-4 text-sm">
      <AdminBanner
        title="Patients & visits"
        subtitle="Admin-only view of patients and recorded treatments/visits from the clinic API."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Patients</h2>
              <p className="text-[11px] text-slate-500">Recognised by unique phone number.</p>
            </div>
            {loading && <span className="text-[11px] text-emerald-700">Loading...</span>}
          </div>

          {error && (
            <div className="px-4 py-2 text-[11px] text-red-700 bg-red-50 border-b border-red-100">
              {error}
            </div>
          )}

          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-slate-600">ID</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-slate-600">Name</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-slate-600">Phone</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-slate-600">Email</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-slate-600">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {patients.length === 0 && !loading ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-slate-400" colSpan={5}>
                      No patients yet. New patients are created automatically when you record a visit.
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <tr
                      key={p.id}
                      className={
                        'hover:bg-emerald-50/60 cursor-pointer ' +
                        (selectedPatientId === p.id ? 'bg-emerald-50/80' : '')
                      }
                      onClick={() => {
                        setSelectedPatientId(p.id)
                      }}
                    >
                      <td className="px-4 py-2 text-[11px] text-slate-500">{p.id}</td>
                      <td className="px-4 py-2 text-slate-900">
                        {p.first_name} {p.last_name}
                      </td>
                      <td className="px-4 py-2 text-slate-700">{p.phone}</td>
                      <td className="px-4 py-2 text-slate-700">{p.email || '—'}</td>
                      <td className="px-4 py-2 text-[11px] text-slate-500">{formatDate(p.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {recentTreatments.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/60 px-4 py-3 text-[11px]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">Recent treatments</span>
                <span className="text-slate-400">Last {recentTreatments.length}</span>
              </div>
              <ul className="space-y-1 max-h-32 overflow-y-auto">
                {recentTreatments.map((t) => {
                  const patient = patients.find((p) => p.id === t.patient)
                  return (
                    <li key={t.id} className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-slate-800">
                          {patient ? `${patient.first_name} ${patient.last_name}` : `Patient #${t.patient}`}
                        </div>
                        <div className="text-slate-600 line-clamp-1">{t.complaint}</div>
                      </div>
                      <span className="text-slate-400 whitespace-nowrap ml-2">{formatDate(t.visit_date)}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-4 space-y-4 text-xs">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Patient details</h2>
            <p className="text-[11px] text-slate-500">
              Use phone as the unique key. If the phone already exists, the patient will be updated.
            </p>
          </div>

          <form onSubmit={handleSavePatient} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-slate-700">First name *</span>
                <input
                  required
                  type="text"
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={patientForm.first_name}
                  onChange={(e) => setPatientForm((f) => ({ ...f, first_name: e.target.value }))}
                />
              </label>
              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-slate-700">Last name *</span>
                <input
                  required
                  type="text"
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={patientForm.last_name}
                  onChange={(e) => setPatientForm((f) => ({ ...f, last_name: e.target.value }))}
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-slate-700">Phone *</span>
                <input
                  required
                  type="tel"
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </label>
              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-slate-700">Date of birth</span>
                <input
                  type="date"
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={patientForm.date_of_birth || ''}
                  onChange={(e) => setPatientForm((f) => ({ ...f, date_of_birth: e.target.value }))}
                />
              </label>
            </div>

            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">Email</span>
              <input
                type="email"
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={patientForm.email || ''}
                onChange={(e) => setPatientForm((f) => ({ ...f, email: e.target.value }))}
              />
            </label>

            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">Address</span>
              <textarea
                rows={2}
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={patientForm.address || ''}
                onChange={(e) => setPatientForm((f) => ({ ...f, address: e.target.value }))}
              />
            </label>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  resetPatientForm()
                  setSelectedPatientId(null)
                }}
                className="text-[11px] text-slate-500 hover:text-slate-700"
              >
                Clear selection
              </button>
              <button
                type="submit"
                disabled={savingPatient}
                className="inline-flex items-center rounded-full bg-emerald-700 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-60"
              >
                {savingPatient ? 'Saving...' : 'Save patient'}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div>
              <h3 className="text-xs font-semibold text-slate-900">Record visit / treatment</h3>
              <p className="text-[11px] text-slate-500">
                Select an existing patient above or enter new patient details, then add the visit notes here.
              </p>
            </div>
            <form onSubmit={handleSaveTreatment} className="space-y-3">
              <label className="space-y-1 block">
                <span className="block text-[11px] font-medium text-slate-700">Complaint *</span>
                <textarea
                  required
                  rows={2}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={treatmentForm.complaint}
                  onChange={(e) => setTreatmentForm((f) => ({ ...f, complaint: e.target.value }))}
                />
              </label>
              <label className="space-y-1 block">
                <span className="block text-[11px] font-medium text-slate-700">Diagnosis</span>
                <textarea
                  rows={2}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={treatmentForm.diagnosis}
                  onChange={(e) => setTreatmentForm((f) => ({ ...f, diagnosis: e.target.value }))}
                />
              </label>
              <label className="space-y-1 block">
                <span className="block text-[11px] font-medium text-slate-700">Treatment plan *</span>
                <textarea
                  required
                  rows={2}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={treatmentForm.treatment_plan}
                  onChange={(e) => setTreatmentForm((f) => ({ ...f, treatment_plan: e.target.value }))}
                />
              </label>
              <label className="space-y-1 block">
                <span className="block text-[11px] font-medium text-slate-700">Notes</span>
                <textarea
                  rows={2}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={treatmentForm.notes}
                  onChange={(e) => setTreatmentForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </label>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={resetTreatmentForm}
                  className="text-[11px] text-slate-500 hover:text-slate-700"
                >
                  Clear form
                </button>
                <button
                  type="submit"
                  disabled={savingTreatment}
                  className="inline-flex items-center rounded-full bg-sky-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60"
                >
                  {savingTreatment ? 'Saving...' : 'Save treatment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
