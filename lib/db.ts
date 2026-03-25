import fs from 'fs'
import path from 'path'
import type { Property } from '@/types'

const DATA_FILE = path.join(process.cwd(), 'data', 'properties.json')

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]))
}

export function readProperties(): Property[] {
  ensureDataFile()
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw) as Property[]
}

export function writeProperties(properties: Property[]): void {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(properties, null, 2))
}

export function getProperty(id: string): Property | undefined {
  return readProperties().find((p) => p.id === id)
}

export function saveProperty(property: Property): void {
  const properties = readProperties()
  const index = properties.findIndex((p) => p.id === property.id)
  if (index >= 0) {
    properties[index] = property
  } else {
    properties.push(property)
  }
  writeProperties(properties)
}

export function deleteProperty(id: string): void {
  const properties = readProperties().filter((p) => p.id !== id)
  writeProperties(properties)
}
