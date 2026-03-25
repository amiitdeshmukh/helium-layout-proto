import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProperty } from '@/lib/db'
import FloorPlanViewer from '@/components/FloorPlanViewer'

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = getProperty(id)
  if (!property) notFound()

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
            ← Back
          </Link>
          <span className="text-zinc-300">/</span>
          <h1 className="text-xl font-semibold text-zinc-900">{property.name}</h1>
        </div>

        {property.address && (
          <p className="text-sm text-zinc-500 mb-6">{property.address}</p>
        )}

        {property.floorPlan ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <p className="text-xs text-zinc-400 mb-3">
              Click a <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 align-middle" /> green dot to see photos &amp; video of that area.
            </p>
            <FloorPlanViewer floorPlan={property.floorPlan} dots={property.dots} />
          </div>
        ) : (
          <div className="text-center py-24 text-zinc-400">
            No floor plan uploaded yet.
          </div>
        )}
      </div>
    </main>
  )
}
