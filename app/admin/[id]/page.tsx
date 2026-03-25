'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Dot, Property } from '@/types'
import FloorPlanEditor from '@/components/FloorPlanEditor'

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [dots, setDots] = useState<Dot[]>([])
  const [saving, setSaving] = useState(false)
  const [uploadingFloorPlan, setUploadingFloorPlan] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/properties/${id}`)
        .then((r) => r.json())
        .then((p: Property) => {
          setProperty(p)
          setName(p.name)
          setAddress(p.address)
          setDots(p.dots)
        })
    })
  }, [params])

  async function uploadFloorPlan(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0] || !property) return
    setUploadingFloorPlan(true)
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setProperty({ ...property, floorPlan: data.url })
    setUploadingFloorPlan(false)
    e.target.value = ''
  }

  async function handleSave() {
    if (!property) return
    setSaving(true)
    await fetch(`/api/properties/${property.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, floorPlan: property.floorPlan, dots }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleDelete() {
    if (!property) return
    if (!confirm(`Delete "${property.name}"? This cannot be undone.`)) return
    setDeleting(true)
    await fetch(`/api/properties/${property.id}`, { method: 'DELETE' })
    router.push('/admin')
  }

  if (!property) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <a href="/admin" className="text-sm text-zinc-400 hover:text-zinc-700">← Admin</a>
          <div className="flex items-center gap-3">
            <a
              href={`/property/${property.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Preview →
            </a>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Property details */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Property name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        {/* Floor plan upload */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-zinc-800">Floor Plan</h2>
            <label className="text-sm text-emerald-600 hover:text-emerald-800 cursor-pointer transition-colors">
              {uploadingFloorPlan ? 'Uploading...' : property.floorPlan ? 'Replace image' : 'Upload image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadFloorPlan}
                disabled={uploadingFloorPlan}
              />
            </label>
          </div>
          {property.floorPlan ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={property.floorPlan} alt="Floor plan preview" className="max-h-48 rounded-lg object-contain" />
          ) : (
            <p className="text-sm text-zinc-400">No floor plan uploaded yet.</p>
          )}
        </div>

        {/* Dots editor */}
        {property.floorPlan ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-5">
            <h2 className="font-semibold text-zinc-800 mb-4">Interactive Dots</h2>
            <FloorPlanEditor
              floorPlan={property.floorPlan}
              dots={dots}
              onChange={setDots}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 p-5 text-center text-zinc-400 text-sm">
            Upload a floor plan above to start placing dots.
          </div>
        )}
      </div>
    </main>
  )
}
