import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  getFoodAreaDisplayName,
  getRestaurantDisplayName,
} from '../src/i18n/foodNames.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const restaurants = JSON.parse(
  await fs.readFile(path.join(root, 'src/data/restaurants.json'), 'utf8'),
)
const { siteUpdates } = await import(
  pathToFileURL(path.join(root, 'src/data/siteUpdates.js')).href
)
const { projectProgress } = await import(
  pathToFileURL(path.join(root, 'src/data/projectProgress.js')).href
)

const datedRestaurants = restaurants
  .filter((place) => /^\d{4}-\d{2}-\d{2}$/.test(place.addedAt || ''))
  .sort(
    (a, b) =>
      b.addedAt.localeCompare(a.addedAt) ||
      Number(b.sourceRow || 0) - Number(a.sourceRow || 0),
  )
  .slice(0, 6)
  .map((place) => ({
    id: `restaurant-${place.id}`,
    type: 'restaurant',
    date: place.addedAt,
    section: { en: 'Food Atlas', zh: '美食地图' },
    title: { en: getRestaurantDisplayName(place, 'en'), zh: place.name },
    detail: {
      en: [place.region, getFoodAreaDisplayName(place.area, 'en')].filter(Boolean).join(' · '),
      zh: [place.region, place.area].filter(Boolean).join(' · '),
    },
    href: `#/food/place/${place.id}`,
    meta: { en: 'New restaurant', zh: '新增餐厅' },
  }))

const projectItems = projectProgress.map((item, index) => ({
  ...item,
  id: `project-${index}-${item.date}`,
  type: 'project',
  section: { en: item.project, zh: item.project },
  meta: {
    en: item.stage === 'shipped' ? 'Shipped' : 'In progress',
    zh: item.stage === 'shipped' ? '已上线' : '进行中',
  },
}))

const siteItems = siteUpdates.map((item, index) => ({
  ...item,
  id: `site-${index}-${item.date}`,
  type: 'site',
  section: { en: item.section, zh: item.section },
  meta: { en: 'Site update', zh: '站点更新' },
}))

const items = [...datedRestaurants, ...projectItems, ...siteItems].sort(
  (a, b) =>
    b.date.localeCompare(a.date) ||
    ({ project: 0, restaurant: 1, site: 2 }[a.type] ?? 3) -
      ({ project: 0, restaurant: 1, site: 2 }[b.type] ?? 3),
)

const feed = {
  updatedAt: items[0]?.date || null,
  counts: {
    restaurants: datedRestaurants.length,
    projects: projectItems.length,
    site: siteItems.length,
  },
  highlights: {
    restaurant: items.find((item) => item.type === 'restaurant') || null,
    project: items.find((item) => item.type === 'project') || null,
    site: items.find((item) => item.type === 'site') || null,
  },
  items: items.slice(0, 12),
}

const outputPath = path.join(root, 'src/data/activityFeed.json')
await fs.writeFile(outputPath, `${JSON.stringify(feed, null, 2)}\n`)
console.log(`Wrote ${path.relative(root, outputPath)} (${feed.items.length} updates).`)
