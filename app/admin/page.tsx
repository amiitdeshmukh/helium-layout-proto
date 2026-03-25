import Link from 'next/link'
import { readProperties } from '@/lib/db'

export default function AdminPage() {
  const properties = readProperties()

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-700 mb-1 block">← Public view</Link>
            <h1 className="text-3xl font-bold text-zinc-900">Admin Panel</h1>
          </div>
          <Link
            href="/admin/new"
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            + New Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-24 text-zinc-400">
            <p className="text-lg mb-2">No properties yet.</p>
            <Link href="/admin/new" className="text-emerald-600 hover:underline text-sm">
              Create your first property →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-white rounded-xl border border-zinc-200 px-5 py-4"
              >
                <div>
                  <h2 className="font-semibold text-zinc-900">{p.name}</h2>
                  {p.address && <p className="text-sm text-zinc-500 mt-0.5">{p.address}</p>}
                  <p className="text-xs text-zinc-400 mt-1">
                    {p.dots.length} dot{p.dots.length !== 1 ? 's' : ''} · {p.floorPlan ? 'Floor plan uploaded' : 'No floor plan'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/property/${p.id}`}
                    className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/${p.id}`}
                    className="text-sm bg-zinc-900 text-white px-4 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
