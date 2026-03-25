import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || typeof file === 'string') {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }

  const mimeType = file.type
  const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType)
  const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType)

  if (!isImage && !isVideo) {
    return Response.json({ error: 'File type not allowed' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()

  if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
    return Response.json({ error: 'File too large (max 50MB)' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') ?? 'bin'
  const filename = `${randomUUID()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), Buffer.from(arrayBuffer))

  return Response.json({ url: `/uploads/${filename}` }, { status: 201 })
}
