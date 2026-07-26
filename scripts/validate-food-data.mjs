import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src', 'data', 'restaurants.json')
const places = JSON.parse(await readFile(dataPath, 'utf8'))
const errors = []
const warnings = []
const seenIds = new Set()
const validStatuses = new Set(['visited', 'wishlist', 'saved'])
const datePattern = /^\d{4}-\d{2}-\d{2}$/

for (const [index, place] of places.entries()) {
  const label = place.id || `row ${index + 1}`
  if (!place.id || seenIds.has(place.id)) errors.push(`${label}: missing or duplicate id`)
  seenIds.add(place.id)
  if (!place.name) errors.push(`${label}: missing name`)
  if (!place.region) errors.push(`${label}: missing region`)
  if (!validStatuses.has(place.status)) errors.push(`${label}: invalid status ${place.status}`)
  if (place.rating != null && (Number(place.rating) < 0 || Number(place.rating) > 5)) {
    errors.push(`${label}: rating must be between 0 and 5`)
  }
  for (const key of ['visitedAt', 'addedAt', 'coordinateVerifiedAt']) {
    if (place[key] && !datePattern.test(place[key])) errors.push(`${label}: invalid ${key}`)
  }
  if (place.status === 'visited' && !place.visitedAt) {
    warnings.push(`${label}: visited without visitedAt`)
  }
  if (place.status === 'wishlist' && place.visitedAt) {
    errors.push(`${label}: wishlist cannot have visitedAt`)
  }
  if (place.choice && place.status !== 'visited') {
    warnings.push(`${label}: Choice is not marked visited`)
  }
  if (place.coordinates) {
    const { lat, lng } = place.coordinates
    if (!Number.isFinite(Number(lat)) || Number(lat) < -90 || Number(lat) > 90) {
      errors.push(`${label}: invalid latitude`)
    }
    if (!Number.isFinite(Number(lng)) || Number(lng) < -180 || Number(lng) > 180) {
      errors.push(`${label}: invalid longitude`)
    }
  }
  if (place.coordinateAccuracy === 'exact' && !place.coordinateSourceUrl) {
    warnings.push(`${label}: exact coordinate has no source URL`)
  }
  if (place.images && !Array.isArray(place.images)) errors.push(`${label}: images must be an array`)
}

const summary = {
  total: places.length,
  choice: places.filter((place) => place.choice).length,
  visited: places.filter((place) => place.status === 'visited').length,
  wishlist: places.filter((place) => place.status === 'wishlist').length,
  saved: places.filter((place) => place.status === 'saved').length,
  recentlyAdded: places.filter((place) => place.addedAt).length,
  rated: places.filter((place) => place.rating != null).length,
  withPhotos: places.filter((place) => Array.isArray(place.images) && place.images.length).length,
  exactCoordinates: places.filter((place) => place.coordinateAccuracy === 'exact').length,
  estimatedCoordinates: places.filter((place) => place.coordinateAccuracy === 'estimated').length,
  missingCoordinates: places.filter((place) => place.coordinateAccuracy === 'missing').length,
}

console.log(JSON.stringify(summary, null, 2))
if (warnings.length) {
  console.warn(`\nWarnings (${warnings.length}):`)
  warnings.slice(0, 30).forEach((warning) => console.warn(`- ${warning}`))
  if (warnings.length > 30) console.warn(`- ...and ${warnings.length - 30} more`)
}
if (errors.length) {
  console.error(`\nErrors (${errors.length}):`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exitCode = 1
}
