import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src', 'data', 'restaurants.json')
const places = JSON.parse(await readFile(dataPath, 'utf8'))

const verifiedLocations = {
  '0001-uluh': {
    address: '152A 2nd Avenue, New York, NY 10003',
    coordinates: { lat: 40.7294457, lng: -73.9868292 },
    coordinateSource: 'openstreetmap-verified',
    coordinateSourceUrl: 'https://www.openstreetmap.org/node/9993249851',
  },
  '0042-restaurant': {
    address: '37-04 Prince St, Flushing, NY 11354',
    coordinates: { lat: 40.7606459, lng: -73.8330454 },
    coordinateSource: 'openstreetmap-verified',
    coordinateSourceUrl: 'https://www.openstreetmap.org/node/10815574642',
  },
  '0298-union-oyster-house': {
    address: '41 Union St, Boston, MA 02108',
    coordinates: { lat: 42.3612749, lng: -71.0569532 },
    coordinateSource: 'openstreetmap-verified',
    coordinateSourceUrl: 'https://www.openstreetmap.org/node/1532195818',
  },
  '0372-eleven': {
    address: '1150 Smallman St, Pittsburgh, PA 15222',
    coordinates: { lat: 40.4460929, lng: -79.9931289 },
    coordinateSource: 'openstreetmap-verified',
    coordinateSourceUrl: 'https://www.openstreetmap.org/way/363387910',
  },
}

function inferStatus(place) {
  if (['visited', 'wishlist', 'saved'].includes(place.status)) return place.status
  if (place.visitedAt) return 'visited'
  const locationText = `${place.region || ''} ${place.area || ''} ${place.location || ''}`
  if (/想吃|wishlist|want to/i.test(locationText)) return 'wishlist'
  return 'saved'
}

const migrated = places.map((place) => {
  const verified = verifiedLocations[place.id]
  const next = {
    ...place,
    status: inferStatus(place),
  }

  if (place.sourceRow >= 511 && !next.addedAt) next.addedAt = '2026-07-10'

  if (place.choice && place.curatorNote) {
    next.memory = {
      ...(place.memory || {}),
      story: place.memory?.story || place.curatorNote,
    }
  }

  if (verified) {
    Object.assign(next, verified, {
      coordinateAccuracy: 'exact',
      coordinateVerifiedAt: '2026-07-12',
    })
  } else {
    next.coordinateAccuracy = place.coordinates ? 'estimated' : 'missing'
  }

  return next
})

await writeFile(dataPath, `${JSON.stringify(migrated, null, 2)}\n`)

const counts = migrated.reduce(
  (result, place) => {
    result[place.status] += 1
    result[place.coordinateAccuracy] += 1
    if (place.addedAt) result.added += 1
    return result
  },
  { added: 0, estimated: 0, exact: 0, missing: 0, saved: 0, visited: 0, wishlist: 0 },
)

console.log(`Migrated ${migrated.length} restaurants.`)
console.log(JSON.stringify(counts, null, 2))
