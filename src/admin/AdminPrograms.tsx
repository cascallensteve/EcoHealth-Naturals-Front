import AdminBanner from './AdminBanner'

interface ProgramItem {
  id: number
  name: string
  description: string
  patients_enrolled: number
}

const MOCK_PROGRAMS: ProgramItem[] = [
  {
    id: 1,
    name: 'Detox & Liver Support',
    description: 'A guided 4-week herbal program focusing on detoxification and liver health.',
    patients_enrolled: 8,
  },
]

export default function AdminPrograms() {
  return (
    <div className="space-y-4 text-sm">
      <AdminBanner
        title="Programs"
        subtitle="View wellness programs and how many patients are currently enrolled."
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Description</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Patients enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_PROGRAMS.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-900">{p.name}</td>
                <td className="px-4 py-2 text-slate-700 max-w-xl">{p.description}</td>
                <td className="px-4 py-2 text-xs text-slate-500">{p.patients_enrolled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
