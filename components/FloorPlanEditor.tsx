'use client'

import { useRef, useState } from 'react'
import { randomId } from '@/lib/utils'
import type { Dot } from '@/types'

interface Props {
  floorPlan: string
  dots: Dot[]
  onChange: (dots: Dot[]) => void
}

export default function FloorPlanEditor({ floorPlan, dots, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedDotId, setSelectedDotId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const selectedDot = dots.find((d) => d.id === selectedDotId) ?? null

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const newDot: Dot = {
      id: randomId(),
      label: 'New Spot',
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
      images: [],
    }
    const updated = [...dots, newDot]
    onChange(updated)
    setSelectedDotId(newDot.id)
  }

  function updateDot(id: string, patch: Partial<Dot>) {
    onChange(dots.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }

  function removeDot(id: string) {
    onChange(dots.filter((d) => d.id !== id))
    if (selectedDotId === id) setSelectedDotId(null)
  }

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) return null
    const data = await res.json()
    return data.url as string
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedDot || !e.target.files) return
    setUploading(true)
    const urls: string[] = []
    for (const file of Array.from(e.target.files)) {
      const url = await uploadFile(file)
      if (url) urls.push(url)
    }
    updateDot(selectedDot.id, { images: [...selectedDot.images, ...urls] })
    setUploading(false)
    e.target.value = ''
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedDot || !e.target.files?.[0]) return
    setUploading(true)
    const url = await uploadFile(e.target.files[0])
    if (url) updateDot(selectedDot.id, { video: url })
    setUploading(false)
    e.target.value = ''
  }

  function removeImage(dotId: string, url: string) {
    const dot = dots.find((d) => d.id === dotId)
    if (!dot) return
    updateDot(dotId, { images: dot.images.filter((i) => i !== url) })
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Floor plan with dots */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-500 mb-2">Click on the floor plan to place a dot.</p>
        <div
          ref={containerRef}
          className="relative inline-block w-full cursor-crosshair"
          onClick={handleImageClick}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={floorPlan}
            alt="Floor plan"
            className="w-full h-auto block rounded-lg border border-zinc-200"
            draggable={false}
          />

          {dots.map((dot) => (
            <button
              key={dot.id}
              title={dot.label}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedDotId(dot.id === selectedDotId ? null : dot.id)
              }}
              style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform focus:outline-none ${
                dot.id === selectedDotId
                  ? 'bg-blue-500 scale-125 ring-2 ring-blue-300'
                  : 'bg-emerald-500 hover:scale-125'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Sidebar for selected dot */}
      <div className="w-72 shrink-0 space-y-4">
        {selectedDot ? (
          <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-zinc-800">Edit Dot</h3>
              <button
                onClick={() => removeDot(selectedDot.id)}
                className="text-xs text-red-500 hover:text-red-700 focus:outline-none"
              >
                Remove
              </button>
            </div>

            {/* Label */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Label</label>
              <input
                type="text"
                value={selectedDot.label}
                onChange={(e) => updateDot(selectedDot.id, { label: e.target.value })}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Photos</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {selectedDot.images.map((url) => (
                  <div key={url} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-20 object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage(selectedDot.id, url)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <label className="block w-full text-center text-sm py-2 px-3 rounded-lg border border-dashed border-zinc-300 hover:border-emerald-400 text-zinc-500 hover:text-emerald-600 cursor-pointer transition-colors">
                {uploading ? 'Uploading...' : '+ Add photos'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Video */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Video</label>
              {selectedDot.video ? (
                <div className="space-y-2">
                  <video src={selectedDot.video} controls className="w-full rounded-lg bg-black" />
                  <button
                    onClick={() => updateDot(selectedDot.id, { video: undefined })}
                    className="text-xs text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Remove video
                  </button>
                </div>
              ) : (
                <label className="block w-full text-center text-sm py-2 px-3 rounded-lg border border-dashed border-zinc-300 hover:border-emerald-400 text-zinc-500 hover:text-emerald-600 cursor-pointer transition-colors">
                  {uploading ? 'Uploading...' : '+ Add video'}
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 text-sm text-zinc-400 text-center">
            {dots.length === 0
              ? 'Click on the floor plan to place your first dot.'
              : 'Click a dot to edit it.'}
          </div>
        )}

        {/* Dots list */}
        {dots.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">All dots</p>
            {dots.map((dot) => (
              <button
                key={dot.id}
                onClick={() => setSelectedDotId(dot.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  dot.id === selectedDotId
                    ? 'bg-emerald-100 text-emerald-800 font-medium'
                    : 'hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 align-middle" />
                {dot.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
