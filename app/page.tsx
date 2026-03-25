import Link from 'next/link'
import { readProperties } from '@/lib/db'

export default function Home() {
  const properties = readProperties()

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Properties</h1>
          <Link
            href="/admin"
            className="text-sm bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Admin →
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-24 text-zinc-400">
            <p className="text-lg mb-2">No properties yet.</p>
            <Link href="/admin" className="text-emerald-600 hover:underline text-sm">
              Add one from the admin panel →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {properties.map((p) => (
              <Link
                key={p.id}
                href={`/property/${p.id}`}
                className="block bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {p.floorPlan && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.floorPlan}
                    alt={p.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-zinc-900 text-lg">{p.name}</h2>
                  {p.address && (
                    <p className="text-sm text-zinc-500 mt-1">{p.address}</p>
                  )}
                  <p className="text-xs text-zinc-400 mt-2">
                    {p.dots.length} interactive spot{p.dots.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
