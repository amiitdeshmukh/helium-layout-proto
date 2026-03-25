import { readProperties, saveProperty } from '@/lib/db'
import type { Property } from '@/types'
import { randomUUID } from 'crypto'

export async function GET() {
  const properties = readProperties()
  return Response.json(properties)
}

export async function POST(request: Request) {
  const body = await request.json()
  const property: Property = {
    id: randomUUID(),
    name: body.name ?? 'Untitled Property',
    address: body.address ?? '',
    floorPlan: body.floorPlan ?? '',
    dots: [],
    createdAt: new Date().toISOString(),
  }
  saveProperty(property)
  return Response.json(property, { status: 201 })
}
