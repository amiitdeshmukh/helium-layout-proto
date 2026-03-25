import { getProperty, saveProperty, deleteProperty } from '@/lib/db'
import type { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const property = getProperty(id)
  if (!property) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(property)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = getProperty(id)
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  const updated = { ...existing, ...body, id }
  saveProperty(updated)
  return Response.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = getProperty(id)
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
  deleteProperty(id)
  return Response.json({ success: true })
}
