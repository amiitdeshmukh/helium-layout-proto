'use client'

import { useEffect, useRef } from 'react'

interface Props {
  onClose: () => void
  images: string[]
  video?: string
  label: string
}

export default function MediaModal({ onClose, images, video, label }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
          <h2 className="font-semibold text-zinc-900 text-lg">{label}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 text-2xl leading-none focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {video && (
            <video
              src={video}
              controls
              className="w-full rounded-lg bg-black"
            />
          )}

          {images.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`${label} photo ${i + 1}`}
                  className="w-full rounded-lg object-cover"
                />
              ))}
            </div>
          ) : (
            !video && (
              <p className="text-zinc-400 text-center py-8">No media uploaded yet.</p>
            )
          )}
        </div>
      </div>
    </div>
  )
}
