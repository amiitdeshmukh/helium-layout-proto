'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewPropertyPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address }),
    })
    const property = await res.json()
    router.push(`/admin/${property.id}`)
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-lg mx-auto">
        <a href="/admin" className="text-sm text-zinc-400 hover:text-zinc-700 mb-6 block">← Back to admin</a>
        <h1 className="text-2xl font-bold text-zinc-900 mb-8">New Property</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-zinc-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Property name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 3BHK Flat, Whitefield"
              className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 42 MG Road, Bangalore"
              className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Creating...' : 'Create & set up floor plan →'}
          </button>
        </form>
      </div>
    </main>
  )
}
