'use client'

import { useState } from 'react'
import type { Dot } from '@/types'
import MediaModal from './MediaModal'

interface Props {
  floorPlan: string
  dots: Dot[]
}

export default function FloorPlanViewer({ floorPlan, dots }: Props) {
  const [activeDot, setActiveDot] = useState<Dot | null>(null)

  return (
    <div className="relative inline-block w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={floorPlan}
        alt="Floor plan"
        className="w-full h-auto block rounded-lg"
        draggable={false}
      />

      {dots.map((dot) => (
        <button
          key={dot.id}
          title={dot.label}
          onClick={() => setActiveDot(dot)}
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-lg hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      ))}

      {activeDot && (
        <MediaModal
          label={activeDot.label}
          images={activeDot.images}
          video={activeDot.video}
          onClose={() => setActiveDot(null)}
        />
      )}
    </div>
  )
}
