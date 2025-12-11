import AdminBanner from './AdminBanner'

interface PrescriptionItem {
  id: number
  patient_name: string
  program?: string
  drug_name: string
  dosage: string
  created_at: string
}

const MOCK_PRESCRIPTIONS: PrescriptionItem[] = [
  {
    id: 1,
    patient_name: 'Alice Smith',
    program: 'Detox & Liver Support',
    drug_name: 'Turmeric & Ginger Complex',
    dosage: '1 capsule, twice daily',
    created_at: '2025-11-16T09:30:00Z',
  },
]

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

export default function AdminPrescriptions() {
  return (
    <div className="space-y-4 text-sm">
      <AdminBanner
        title="Prescribed drugs"
        subtitle="See an overview of herbal prescriptions issued to patients."
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Patient</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Program</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Drug</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Dosage</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_PRESCRIPTIONS.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-900">{p.patient_name}</td>
                <td className="px-4 py-2 text-slate-700">{p.program || '—'}</td>
                <td className="px-4 py-2 text-slate-700">{p.drug_name}</td>
                <td className="px-4 py-2 text-xs text-slate-700">{p.dosage}</td>
                <td className="px-4 py-2 text-xs text-slate-500">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
