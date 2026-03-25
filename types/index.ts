export interface Dot {
  id: string
  label: string
  x: number // percentage from left (0-100)
  y: number // percentage from top (0-100)
  images: string[] // paths like /uploads/...
  video?: string // path like /uploads/...
}

export interface Property {
  id: string
  name: string
  address: string
  floorPlan: string // path like /uploads/...
  dots: Dot[]
  createdAt: string
}
