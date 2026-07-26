import { readFile, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import readXlsxFile from 'read-excel-file/node'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src', 'data', 'restaurants.json')
const args = process.argv.slice(2)
const inputArg = args.find((arg) => !arg.startsWith('--'))
const shouldWrite = args.includes('--write')
const memoryOnly = args.includes('--memories')

if (!inputArg) {
  console.error('Usage: npm run food:import -- <file.csv|file.xlsx> [--write] [--memories]')
  process.exit(1)
}

const inputPath = path.resolve(process.cwd(), inputArg)
const extension = path.extname(inputPath).toLowerCase()

function parseCsv(text) {
  const rows = []
  let row = []
  let value = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        value += '"'
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (character === ',' && !quoted) {
      row.push(value)
      value = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(value)
      if (row.some((cell) => String(cell).trim())) rows.push(row)
      row = []
      value = ''
    } else {
      value += character
    }
  }
  row.push(value)
  if (row.some((cell) => String(cell).trim())) rows.push(row)
  return rows
}

async function readRows() {
  if (extension === '.csv') return parseCsv(await readFile(inputPath, 'utf8'))
  if (extension === '.xlsx') return readXlsxFile(inputPath)
  throw new Error('Only .csv and .xlsx files are supported.')
}

const aliases = {
  id: ['id', '餐厅id'],
  name: ['name', 'restaurant', '餐厅名称'],
  region: ['region', '所属大区/国家', '城市', '国家/城市'],
  area: ['area', '具体地点/区域', '区域', '街区'],
  cuisine: ['cuisine', '推测菜系', '菜系'],
  cuisineGroup: ['cuisinegroup', '菜系分组', '大类'],
  choice: ['choice', 'ryanbibi choice', '精选'],
  status: ['status', '状态'],
  visitedAt: ['visitedat', '探店日期', '访问日期'],
  addedAt: ['addedat', '新增日期', '录入日期'],
  rating: ['rating', '评分'],
  price: ['price', '价位'],
  lat: ['lat', 'latitude', '纬度'],
  lng: ['lng', 'longitude', '经度'],
  address: ['address', '详细地址', '地址'],
  coordinateSource: ['coordinatesource', '坐标来源'],
  coordinateSourceUrl: ['coordinatesourceurl', '坐标来源链接'],
  tags: ['tags', '标签'],
  signatureDishes: ['signaturedishes', '招牌菜', '推荐菜'],
  images: ['images', '照片', '图片'],
  curatorNote: ['curatornote', '主理人点评', '记忆正文'],
  memoryTitle: ['memorytitle', '记忆标题'],
  memoryWhyChoice: ['memorywhychoice', 'choice原因', '为什么是choice'],
  memoryPeople: ['memorypeople', '同行人', '人物'],
  memoryOccasion: ['memoryoccasion', '场景', '时刻'],
}

function normalizeHeader(value) {
  return String(value || '').trim().toLowerCase().replace(/[\s_-]+/g, '')
}

const aliasLookup = new Map()
for (const [field, values] of Object.entries(aliases)) {
  for (const value of values) aliasLookup.set(normalizeHeader(value), field)
}

function rowObjects(rows) {
  if (rows.length < 2) return []
  const headers = rows[0].map((header) => aliasLookup.get(normalizeHeader(header)) || null)
  return rows.slice(1).map((row, index) => {
    const result = { __row: index + 2 }
    headers.forEach((header, column) => {
      if (header) result[header] = row[column]
    })
    return result
  })
}

function text(value) {
  if (value == null) return undefined
  const result = String(value).trim()
  return result || undefined
}

function boolean(value) {
  if (value == null || value === '') return undefined
  return /^(true|yes|y|1|是|精选)$/i.test(String(value).trim())
}

function list(value) {
  const source = text(value)
  return source ? source.split(/[|；;]/).map((item) => item.trim()).filter(Boolean) : undefined
}

function date(value) {
  if (!value) return undefined
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value.toISOString().slice(0, 10)
  const source = String(value).trim().replaceAll('/', '-')
  return /^\d{4}-\d{1,2}-\d{1,2}$/.test(source)
    ? source.split('-').map((part, index) => (index ? part.padStart(2, '0') : part)).join('-')
    : source
}

function status(value) {
  const source = String(value || '').trim().toLowerCase()
  if (!source) return undefined
  if (['visited', '去过', '已探店', '探店'].includes(source)) return 'visited'
  if (['wishlist', '想去', '收藏', '想吃'].includes(source)) return 'wishlist'
  if (['saved', '记录', '已记录', '待确认'].includes(source)) return 'saved'
  return source
}

function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'restaurant'
}

function keyFor(place) {
  return [place.name, place.region, place.area].map((value) => String(value || '').trim().toLowerCase()).join('|')
}

function compact(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined))
}

function recordFromRow(row) {
  const lat = row.lat === '' || row.lat == null ? undefined : Number(row.lat)
  const lng = row.lng === '' || row.lng == null ? undefined : Number(row.lng)
  const memoryFields = compact({
    title: text(row.memoryTitle),
    whyChoice: text(row.memoryWhyChoice),
    people: list(row.memoryPeople),
    occasion: text(row.memoryOccasion),
    story: text(row.curatorNote),
  })
  const result = compact({
    id: text(row.id),
    name: text(row.name),
    region: text(row.region),
    area: text(row.area),
    cuisine: text(row.cuisine),
    cuisineGroup: text(row.cuisineGroup),
    choice: boolean(row.choice),
    status: status(row.status),
    visitedAt: date(row.visitedAt),
    addedAt: date(row.addedAt),
    rating: row.rating === '' || row.rating == null ? undefined : Number(row.rating),
    price: text(row.price),
    address: text(row.address),
    coordinateSource: text(row.coordinateSource),
    coordinateSourceUrl: text(row.coordinateSourceUrl),
    tags: list(row.tags),
    signatureDishes: list(row.signatureDishes),
    images: list(row.images),
    curatorNote: text(row.curatorNote),
    memory: Object.keys(memoryFields).length ? memoryFields : undefined,
  })
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    result.coordinates = { lat, lng }
    result.coordinateAccuracy = 'exact'
    result.coordinateSource ||= 'manual-import'
    result.coordinateVerifiedAt = new Date().toISOString().slice(0, 10)
  }
  return result
}

const rows = rowObjects(await readRows())
const places = JSON.parse(await readFile(dataPath, 'utf8'))
const byId = new Map(places.map((place) => [place.id, place]))
const byKey = new Map(places.map((place) => [keyFor(place), place]))
let nextNumber = Math.max(...places.map((place) => Number.parseInt(place.id, 10) || 0)) + 1
let nextSourceRow = Math.max(...places.map((place) => place.sourceRow || 0)) + 1
let inserted = 0
let updated = 0
let skipped = 0
const warnings = []

for (const row of rows) {
  const incoming = recordFromRow(row)
  const existing = (incoming.id && byId.get(incoming.id)) || byKey.get(keyFor(incoming))

  if (memoryOnly && !existing) {
    warnings.push(`row ${row.__row}: memory record did not match an existing restaurant`)
    skipped += 1
    continue
  }
  if (!existing && (!incoming.name || !incoming.region)) {
    warnings.push(`row ${row.__row}: new restaurant requires name and region`)
    skipped += 1
    continue
  }

  if (existing) {
    const existingMemory = existing.memory
    Object.assign(existing, incoming)
    if (incoming.memory) existing.memory = { ...(existingMemory || {}), ...incoming.memory }
    if (incoming.curatorNote) existing.curatorNote = incoming.curatorNote
    if (incoming.choice === true && !incoming.status) existing.status = 'visited'
    updated += 1
    continue
  }

  const id = incoming.id || `${String(nextNumber).padStart(4, '0')}-${slugify(incoming.name)}`
  nextNumber += 1
  const created = {
    id,
    name: incoming.name,
    region: incoming.region,
    area: incoming.area || incoming.region,
    location: `${incoming.region} / ${incoming.area || incoming.region}`,
    cuisine: incoming.cuisine || '待补充',
    cuisineGroup: incoming.cuisineGroup || '其他',
    choice: incoming.choice || false,
    choiceLabel: incoming.choice ? 'Ryanbibi Choice' : '',
    curatorNote: incoming.curatorNote || '',
    status: incoming.status || (incoming.choice ? 'visited' : 'saved'),
    addedAt: incoming.addedAt || new Date().toISOString().slice(0, 10),
    sourceRow: nextSourceRow,
    ...incoming,
  }
  nextSourceRow += 1
  places.push(created)
  byId.set(created.id, created)
  byKey.set(keyFor(created), created)
  inserted += 1
}

const invalid = places.filter(
  (place) =>
    !place.id ||
    !place.name ||
    !place.region ||
    !['visited', 'wishlist', 'saved'].includes(place.status) ||
    (place.rating != null && (place.rating < 0 || place.rating > 5)),
)

console.log(JSON.stringify({ inputRows: rows.length, inserted, updated, skipped, invalid: invalid.length }, null, 2))
warnings.forEach((warning) => console.warn(`- ${warning}`))

if (invalid.length) {
  console.error('Import contains invalid records. Nothing was written.')
  process.exit(1)
}

if (!shouldWrite) {
  console.log('Dry run only. Add --write to update restaurants.json.')
} else {
  await writeFile(dataPath, `${JSON.stringify(places, null, 2)}\n`)
  console.log(`Updated ${dataPath}`)

  for (const script of [
    'scripts/validate-food-data.mjs',
    'scripts/generate-food-summary.mjs',
    'scripts/generate-activity-feed.mjs',
  ]) {
    const result = spawnSync(process.execPath, [path.join(root, script)], {
      cwd: root,
      stdio: 'inherit',
    })
    if (result.status !== 0) process.exit(result.status || 1)
  }
}
