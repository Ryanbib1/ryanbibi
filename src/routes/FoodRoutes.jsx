import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight, BadgeCheck, Bookmark, CalendarCheck, ChevronLeft, ChevronRight,
  Clock3, Image as ImageIcon, MapPin, Percent, RotateCcw, Search, Sparkles, Star,
  Utensils, ZoomIn, ZoomOut,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import restaurantData from '../data/restaurants.json'
import worldMapCountries from '../data/worldMapPaths.json'
import { localizeFoodTerm } from '../i18n/foodTerms'
import {
  BentoCard, PageTransition, PrimaryLink, Progress, SecondaryLink, SectionKicker,
  cardMotion, cn,
} from '../App'
import 'leaflet/dist/leaflet.css'

// —— Food category normalization ————————————————————————————————————
// The raw data has 50+ freeform `cuisineGroup` values. We fold them into a
// small controlled vocabulary via keyword rules so (a) the filter is usable
// and (b) any future restaurant auto-categorizes from its cuisine text —
// no manual tagging needed when adding a new place.
const FOOD_CATEGORIES = [
  '中餐', '日料', '韩餐', '东南亚', '西餐', '意餐', '美式', '中东',
  '甜品饮品', '海鲜', '烧烤', '自助', '快餐简餐', '主题餐厅', '其他',
]

const CATEGORY_RULES = [
  [/(自助|buffet)/i, '自助'],
  [/主题餐厅/, '主题餐厅'],
  [/(烤肉|泥炉|bbq|烧烤)/i, '烧烤'],
  [/(中东|土耳其|叙利亚|清真)/, '中东'],
  [/(甜品|饮品|咖啡|coffee|甜甜圈|刨冰|松饼|舒芙蕾|brunch|早午餐|matcha|bakery|面包)/i, '甜品饮品'],
  [/海鲜/, '海鲜'],
  [/(越南|泰餐|印尼|东南亚)/, '东南亚'],
  [/(意餐|意大利|比萨|披萨|pizza)/i, '意餐'],
  [/(日料|日本|ramen|寿司|拉面)/i, '日料'],
  [/韩/, '韩餐'],
  [/(美式|美国)/, '美式'],
  [/(简餐|快餐|轻食|沙拉|食堂|美食广场|虾饭)/, '快餐简餐'],
  [/(欧洲|地中海|德国|法餐|俄餐|西式|西餐|精酿|tapas|小酒馆)/i, '西餐'],
  [/(中餐|中国|私房菜|火锅|川菜|粤菜|本帮)/, '中餐'],
]

function categoryFor(place) {
  const text = `${place.cuisineGroup || ''} ${place.cuisine || ''}`
  for (const [re, cat] of CATEGORY_RULES) {
    if (re.test(text)) return cat
  }
  return '其他'
}

// Deterministic warm tint per category, used only for image placeholders so
// the grid stays appetizing even before real photos exist.
const CATEGORY_HUE = {
  中餐: 8, 日料: 200, 韩餐: 350, 东南亚: 150, 西餐: 28, 意餐: 12, 美式: 18,
  中东: 38, 甜品饮品: 330, 海鲜: 195, 烧烤: 16, 自助: 45, 快餐简餐: 95,
  主题餐厅: 270, 其他: 24,
}

function categoryHue(category) {
  return CATEGORY_HUE[category] ?? 24
}

// Augment every record with derived, optional-safe fields. Old data with only
// `curatorNote` keeps working; new fields (rating/price/tags/images…) are read
// where present and silently skipped where absent.
const foodPlaces = restaurantData.map((place) => ({
  ...place,
  category: categoryFor(place),
  note: place.note || place.curatorNote || '',
  cover: place.cover || (Array.isArray(place.images) ? place.images[0] : null) || null,
  status:
    place.status ||
    (place.visitedAt
      ? 'visited'
      : /想吃|wishlist/i.test(`${place.region || ''} ${place.area || ''}`)
        ? 'wishlist'
        : 'saved'),
  memory: place.memory || {},
}))

const foodArchiveStats = {
  choiceMemories: foodPlaces.filter(
    (place) => place.choice && (place.memory?.story || place.curatorNote),
  ).length,
  choices: foodPlaces.filter((place) => place.choice).length,
  datedVisits: foodPlaces.filter((place) => /^\d{4}-\d{2}-\d{2}$/.test(place.visitedAt || '')).length,
  exactCoordinates: foodPlaces.filter((place) => place.coordinateAccuracy === 'exact').length,
  estimatedCoordinates: foodPlaces.filter((place) => place.coordinateAccuracy === 'estimated').length,
  missingCoordinates: foodPlaces.filter((place) => !place.coordinates).length,
  photos: foodPlaces.filter((place) => Array.isArray(place.images) && place.images.length > 0).length,
  rated: foodPlaces.filter((place) => Number(place.rating) > 0).length,
  total: foodPlaces.length,
}

const RECENT_TASTING_DAYS = 30

function getRecentTastingLog(now = new Date()) {
  const datedPlaces = foodPlaces
    .filter((place) => /^\d{4}-\d{2}-\d{2}$/.test(place.visitedAt || ''))
    .sort((a, b) => b.visitedAt.localeCompare(a.visitedAt))
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - RECENT_TASTING_DAYS)
  cutoff.setHours(0, 0, 0, 0)
  const currentPlaces = datedPlaces.filter(
    (place) => new Date(`${place.visitedAt}T12:00:00`) >= cutoff,
  )

  return {
    current: currentPlaces.length > 0,
    latestDate: datedPlaces[0]?.visitedAt || null,
    places: currentPlaces.length > 0 ? currentPlaces : datedPlaces,
  }
}

const recentTastingLog = getRecentTastingLog()
const recentAddedPlaces = foodPlaces
  .filter((place) => /^\d{4}-\d{2}-\d{2}$/.test(place.addedAt || ''))
  .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || b.sourceRow - a.sourceRow)
const wishlistPlaces = foodPlaces
  .filter((place) => place.status === 'wishlist')
  .sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || '') || a.name.localeCompare(b.name))
const FOOD_PAGE_SIZE = 24
const FOOD_MOBILE_PAGE_SIZE = 8
const MAP_MIN_ZOOM = 1
const MAP_MAX_ZOOM = 4

function useFoodPageSize() {
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches
      ? FOOD_MOBILE_PAGE_SIZE
      : FOOD_PAGE_SIZE,
  )

  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)')
    const update = () => setPageSize(query.matches ? FOOD_MOBILE_PAGE_SIZE : FOOD_PAGE_SIZE)
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  return pageSize
}

const CITY_MAP_CONFIG = {
  Beijing: {
    label: 'Beijing District Map',
    center: [39.9042, 116.4074],
    maxZoom: 11,
    areas: {
      海淀区: [39.9593, 116.2981],
      朝阳区: [39.9219, 116.4436],
      门头沟: [39.9405, 116.1017],
      通州: [39.9099, 116.6564],
      丰台区: [39.8584, 116.2871],
      大兴: [39.7289, 116.3414],
    },
  },
  'New York': {
    label: 'New York Neighborhood Map',
    center: [40.7357, -73.9918],
    maxZoom: 13,
    areas: {
      'Mid Town': [40.7549, -73.984],
      Flushing: [40.7675, -73.8331],
      'East Village': [40.7265, -73.9815],
      'K-Town': [40.7479, -73.9877],
      'Lower Town': [40.7134, -74.0076],
      'Union Square': [40.7359, -73.9911],
      'Upper East Side': [40.7736, -73.9566],
      'West Village': [40.734, -74.0027],
      'China Town': [40.7158, -73.997],
      'Midtown East': [40.754, -73.9723],
      NoHo: [40.7287, -73.9926],
      'Upper West Side': [40.787, -73.9754],
    },
  },
  MA: {
    label: 'Boston + Massachusetts Map',
    center: [42.3601, -71.0589],
    maxZoom: 12,
    areas: {
      'BOS Chinatown': [42.3501, -71.0624],
      Springfield: [42.1015, -72.5898],
      'BOS Newbury Street': [42.3503, -71.0808],
      Allston: [42.3554, -71.1321],
      'BOS South End': [42.3413, -71.0772],
      'UMass Amherst': [42.3868, -72.5301],
      Downtown: [42.3602, -71.0578],
      'BOS Back Bay / South End': [42.3455, -71.0782],
      'BOS Downtown Crossing': [42.3555, -71.0605],
      'BOS Fenway': [42.3458, -71.0987],
      Cambridge: [42.3736, -71.1097],
    },
  },
}

function getCityAreaMapPoints(places, region) {
  const config = CITY_MAP_CONFIG[region]
  if (!config) return []

  const groups = new Map()
  places.forEach((place) => {
    const area = place.area || region
    if (!config.areas[area]) return
    const current = groups.get(area) || { area, choiceCount: 0, count: 0 }
    current.count += 1
    current.choiceCount += Number(Boolean(place.choice))
    groups.set(area, current)
  })

  return [...groups.values()]
    .map((group) => ({
      ...group,
      coordinates: config.areas[group.area],
    }))
    .sort((a, b) => b.count - a.count || a.area.localeCompare(b.area))
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function constrainMapView(view, element) {
  const zoom = clamp(Number(view.zoom) || 1, MAP_MIN_ZOOM, MAP_MAX_ZOOM)
  if (!element || zoom <= 1) return { zoom, x: 0, y: 0 }
  const rect = element.getBoundingClientRect()
  const edgeGuardX = Math.min(rect.width * 0.06, 72)
  const edgeGuardY = Math.min(rect.height * 0.16, 84)
  const maxX = Math.max(0, (rect.width * (zoom - 1)) / 2 - edgeGuardX)
  const maxY = Math.max(0, (rect.height * (zoom - 1)) / 2 - edgeGuardY)
  return {
    zoom,
    x: clamp(Number(view.x) || 0, -maxX, maxX),
    y: clamp(Number(view.y) || 0, -maxY, maxY),
  }
}

const regionContinentMap = {
  Beijing: 'asia',
  Chengdu: 'asia',
  Hebei: 'asia',
  Henan: 'asia',
  HK: 'asia',
  Shanghai: 'asia',
  Suzhou: 'asia',
  Tianjin: 'asia',
  Xiamen: 'asia',
  Chicago: 'north-america',
  CT: 'north-america',
  DC: 'north-america',
  FL: 'north-america',
  Hawaii: 'north-america',
  LA: 'north-america',
  MA: 'north-america',
  NH: 'north-america',
  'New York': 'north-america',
  Ohio: 'north-america',
  PA: 'north-america',
  'PI Brown': 'north-america',
  'San Juan': 'north-america',
  SF: 'north-america',
  VA: 'north-america',
  VT: 'north-america',
  France: 'europe',
  Italy: 'europe',
  Switzerland: 'europe',
}

const continentDefinitions = [
  { id: 'all', label: 'All Continents', shortLabel: 'All', center: { lat: 18, lng: 18 } },
  { id: 'north-america', label: 'North America', shortLabel: 'N. America', center: { lat: 39, lng: -98 } },
  { id: 'asia', label: 'Asia', shortLabel: 'Asia', center: { lat: 35, lng: 105 } },
  { id: 'europe', label: 'Europe', shortLabel: 'Europe', center: { lat: 46, lng: 12 } },
  { id: 'other', label: 'Other', shortLabel: 'Other', center: { lat: 0, lng: 0 } },
]

const continentHotspots = [
  {
    id: 'north-america',
    label: 'North America',
    hotspot: { height: 28, left: 8, top: 12, width: 32 },
  },
  {
    id: 'south-america',
    label: 'South America',
    hotspot: { height: 42, left: 27, top: 49, width: 15 },
  },
  {
    id: 'europe',
    label: 'Europe',
    hotspot: { height: 18, left: 45, top: 20, width: 16 },
  },
  {
    id: 'africa',
    label: 'Africa',
    hotspot: { height: 44, left: 47, top: 38, width: 17 },
  },
  {
    id: 'asia',
    label: 'Asia',
    hotspot: { height: 36, left: 56, top: 18, width: 36 },
  },
  {
    id: 'oceania',
    label: 'Oceania',
    hotspot: { height: 20, left: 70, top: 64, width: 22 },
  },
]

function projectMapPoint(coordinates) {
  return {
    x: ((coordinates.lng + 180) / 360) * 100,
    y: ((90 - coordinates.lat) / 180) * 100,
  }
}

function getMapPinLayouts(places, zoom = 1) {
  const items = places
    .filter((place) => place.coordinates)
    .map((place, order) => ({
      order,
      place,
      point: projectMapPoint(place.coordinates),
    }))
  const clusters = []
  items.forEach((item) => {
    let targetCluster = null
    let bestDistance = Number.POSITIVE_INFINITY
    clusters.forEach((cluster) => {
      const dx = item.point.x - cluster.center.x
      const dy = item.point.y - cluster.center.y
      const distance = Math.hypot(dx * 0.86, dy)
      if (distance < 2.8 && distance < bestDistance) {
        targetCluster = cluster
        bestDistance = distance
      }
    })
    if (!targetCluster) {
      clusters.push({
        center: { ...item.point },
        items: [item],
      })
      return
    }
    targetCluster.items.push(item)
    targetCluster.center = {
      x:
        targetCluster.items.reduce((sum, entry) => sum + entry.point.x, 0) /
        targetCluster.items.length,
      y:
        targetCluster.items.reduce((sum, entry) => sum + entry.point.y, 0) /
        targetCluster.items.length,
    }
  })

  return clusters.flatMap((cluster) => {
    if (cluster.items.length === 1) {
      const item = cluster.items[0]
      return [{ ...item, displayPoint: item.point, spread: false }]
    }
    const spacing = cluster.items.length > 24 ? 0.72 : cluster.items.length > 10 ? 0.94 : 1.18
    const zoomAdjustedSpacing = spacing / Math.sqrt(Math.max(1, zoom))
    return cluster.items
      .slice()
      .sort((a, b) => Number(b.place.choice) - Number(a.place.choice) || a.order - b.order)
      .map((item, index) => {
        const angle = index * 2.399963229728653 - Math.PI / 2
        const radius = zoomAdjustedSpacing * Math.sqrt(index + 1)
        return {
          ...item,
          displayPoint: {
            x: clamp(cluster.center.x + Math.cos(angle) * radius * 1.16, 2.5, 97.5),
            y: clamp(cluster.center.y + Math.sin(angle) * radius, 4, 96),
          },
          spread: true,
        }
      })
      .sort((a, b) => a.order - b.order)
  })
}

function getContinentId(region) {
  return regionContinentMap[region] || 'other'
}

function getContinentMeta(continentId) {
  return (
    continentDefinitions.find((continent) => continent.id === continentId) ||
    continentDefinitions[continentDefinitions.length - 1]
  )
}

function getTopCuisine(places) {
  const counts = places.reduce((map, place) => {
    map.set(place.cuisineGroup, (map.get(place.cuisineGroup) || 0) + 1)
    return map
  }, new Map())
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0]
}

function getMapCityPins(places) {
  const grouped = places
    .filter((place) => place.coordinates)
    .reduce((map, place) => {
      const regionPlaces = map.get(place.region) || []
      regionPlaces.push(place)
      map.set(place.region, regionPlaces)
      return map
    }, new Map())

  return [...grouped.entries()]
    .map(([region, regionPlaces]) => {
      const count = regionPlaces.length
      const choiceCount = regionPlaces.filter((place) => place.choice).length
      return {
        choice: choiceCount > 0,
        choiceCount,
        coordinates: {
          lat: regionPlaces.reduce((sum, place) => sum + place.coordinates.lat, 0) / count,
          lng: regionPlaces.reduce((sum, place) => sum + place.coordinates.lng, 0) / count,
        },
        count,
        id: `region-${region}`,
        name: region,
        region,
        topCuisine: getTopCuisine(regionPlaces) || 'Cuisine',
      }
    })
    .sort(
      (a, b) => b.choiceCount - a.choiceCount || b.count - a.count || a.region.localeCompare(b.region),
    )
}

function slugifyRegion(region) {
  return String(region)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const regionSlugMap = new Map(
  [...new Set(foodPlaces.map((place) => place.region))].map((region) => [
    slugifyRegion(region),
    region,
  ]),
)

function getRegionFromSlug(slug) {
  return regionSlugMap.get(slug)
}

function getRegionPlaces(region) {
  return foodPlaces.filter((place) => place.region === region)
}

function getCountEntries(places, key) {
  const counts = places.reduce((map, place) => {
    const value = place[key] || 'Unknown'
    map.set(value, (map.get(value) || 0) + 1)
    return map
  }, new Map())
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

function getRegionSummary(region) {
  const places = getRegionPlaces(region)
  const choices = places.filter((place) => place.choice)
  const cuisines = getCountEntries(places, 'cuisineGroup')
  const areas = getCountEntries(places, 'area')

  return {
    areas,
    choices,
    continent: getContinentMeta(getContinentId(region)),
    cuisines,
    places,
    topArea: areas[0]?.[0] || 'Area',
    topCuisine: cuisines[0]?.[0] || 'Cuisine',
  }
}

function getChoiceMemoryTags(place) {
  const note = place.curatorNote || ''
  const tags = []

  if (/goat/i.test(note)) tags.push('GOAT')
  if (/意义远超/.test(note)) tags.push('meaning first')
  if (/friend|friends|Ruby|Alice|Frank|兄弟|同尘|乐洋|朋友/i.test(note)) {
    tags.push('people memory')
  }
  if (/主推|必须点|推荐/.test(note)) tags.push('order note')
  if (/高中|第一次|收尾|离开|生日|梦开始/.test(note)) tags.push('time capsule')
  if (!tags.length) tags.push(place.cuisineGroup)

  return tags.slice(0, 3)
}

function getChoiceMemoryLead(place) {
  const note = place.curatorNote || 'A Ryanbibi Choice memory waiting for a fuller story.'
  return note.length > 132 ? `${note.slice(0, 128).trim()}...` : note
}

function getFoodStatusMeta(status, language) {
  const isZh = language === 'zh'
  const states = {
    visited: {
      label: isZh ? '已探店' : 'Visited',
      className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    },
    wishlist: {
      label: isZh ? '想去' : 'Wishlist',
      className: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    },
    saved: {
      label: isZh ? '已收录' : 'Saved',
      className: 'bg-stone-500/10 text-ink-faint',
    },
  }
  return states[status] || states.saved
}

function FoodStatusBadge({ language, status }) {
  const meta = getFoodStatusMeta(status, language)
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase', meta.className)} data-no-translate>
      {status === 'wishlist' ? <Bookmark className="size-3" /> : <BadgeCheck className="size-3" />}
      {meta.label}
    </span>
  )
}

function FoodActivityHub({ language }) {
  const isZh = language === 'zh'
  const [activeView, setActiveView] = useState(recentAddedPlaces.length ? 'added' : 'visited')
  const views = {
    added: {
      icon: Clock3,
      label: isZh ? '最近新增' : 'Recently added',
      places: recentAddedPlaces,
      dateKey: 'addedAt',
      empty: isZh ? '还没有带新增日期的记录。' : 'No dated additions yet.',
    },
    visited: {
      icon: CalendarCheck,
      label: isZh ? '最近去过' : 'Recently visited',
      places: recentTastingLog.places.filter((place) => place.status === 'visited'),
      dateKey: 'visitedAt',
      empty: isZh ? '还没有带探店日期的记录。' : 'No dated visits yet.',
    },
    wishlist: {
      icon: Bookmark,
      label: isZh ? '收藏清单' : 'Wishlist',
      places: wishlistPlaces,
      dateKey: 'addedAt',
      empty: isZh ? '收藏清单目前为空。' : 'The wishlist is empty.',
    },
  }
  const active = views[activeView]
  const displayPlaces = active.places.slice(0, 6)

  return (
    <section className="rounded-lg border border-line bg-surface/92 p-5 shadow-[0_18px_45px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20 sm:p-6" data-no-translate>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionKicker icon={active.icon} text={isZh ? '餐厅动态' : 'Atlas activity'} />
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink">
            {active.label}
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-lg border border-line bg-surface-sunk p-1 dark:border-white/10 dark:bg-white/[0.04]">
          {Object.entries(views).map(([key, view]) => (
            <button
              className={cn(
                'min-h-10 rounded-md px-3 text-xs font-semibold transition',
                activeView === key
                  ? 'bg-ink text-white shadow-sm dark:bg-white dark:text-ink'
                  : 'text-ink-faint hover:text-cinnabar',
              )}
              key={key}
              onClick={() => setActiveView(key)}
              type="button"
            >
              {view.label}
              <span className="ml-1 font-mono opacity-60">{view.places.length}</span>
            </button>
          ))}
        </div>
      </div>

      {displayPlaces.length ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {displayPlaces.map((place) => (
            <a
              className="ui-card-interactive group grid min-h-32 grid-cols-[96px_minmax(0,1fr)] overflow-hidden rounded-lg border border-line bg-surface dark:border-white/10 dark:bg-white/[0.035]"
              href={`#/food/place/${place.id}`}
              key={place.id}
            >
              <FoodCover className="h-full min-h-32 aspect-auto" language={language} place={place} />
              <div className="flex min-w-0 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <FoodStatusBadge language={language} status={place.status} />
                  <ArrowUpRight className="size-4 shrink-0 text-ink-faint transition group-hover:text-cinnabar" />
                </div>
                <h3 className="mt-3 truncate font-serif text-lg font-semibold text-ink">{place.name}</h3>
                <p className="mt-1 truncate text-xs text-ink-faint">{place.region}{place.area ? ` · ${place.area}` : ''}</p>
                <p className="mt-auto pt-2 font-mono text-[11px] text-cinnabar">
                  {place[active.dateKey] || (isZh ? '日期待补充' : 'Date pending')}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-line p-6 text-center text-ink-faint dark:border-white/10">{active.empty}</p>
      )}
    </section>
  )
}

function FoodArchiveHealth({ language }) {
  const isZh = language === 'zh'
  const memoryCompletion = foodArchiveStats.choices
    ? Math.round((foodArchiveStats.choiceMemories / foodArchiveStats.choices) * 100)
    : 0
  const visitRows = [
    {
      icon: CalendarCheck,
      label: isZh ? '带日期的真实探店' : 'Dated visits',
      value: foodArchiveStats.datedVisits,
      note: isZh ? '与收藏清单分开记录' : 'Separated from saved and wishlist entries',
    },
    {
      icon: Star,
      label: isZh ? '已评分餐厅' : 'Rated visits',
      value: foodArchiveStats.rated,
      note: isZh ? '评分跟随真实探店记录' : 'Ratings attached to visited records',
    },
    {
      icon: MapPin,
      label: isZh ? '精确坐标' : 'Exact coordinates',
      value: foodArchiveStats.exactCoordinates,
      note: isZh
        ? `${foodArchiveStats.estimatedCoordinates} 条区域估算 · ${foodArchiveStats.missingCoordinates} 条待补`
        : `${foodArchiveStats.estimatedCoordinates} area estimates · ${foodArchiveStats.missingCoordinates} pending`,
    },
    {
      icon: ImageIcon,
      label: isZh ? '带实拍照片的档案' : 'Entries with original photos',
      value: foodArchiveStats.photos,
      note: isZh ? '不使用假餐厅照片，等待你的真实素材' : 'No stock photos; waiting for original visit media',
    },
  ]

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface/92 shadow-[0_18px_45px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20" data-no-translate>
      <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border-b border-line p-6 dark:border-white/10 lg:border-b-0 lg:border-r sm:p-8">
          <SectionKicker icon={BadgeCheck} text={isZh ? '档案质量' : 'Archive quality'} />
          <p className="mt-6 font-mono text-xs uppercase text-cinnabar">
            {foodArchiveStats.total} {isZh ? '条餐厅档案' : 'restaurant records'}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            {isZh ? '记忆先完整，素材再慢慢变丰富。' : 'Complete memories first. Enrich the media over time.'}
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-ink-soft">
            {isZh
              ? 'Choice 记忆卡已经完整接入；日期、评分、照片和精确坐标会随着每次探店与导入继续更新。'
              : 'Choice memory cards are fully connected. Dates, ratings, photos, and precise coordinates will grow with each visit and import.'}
          </p>

          <div className="mt-7 rounded-lg border border-cinnabar/25 bg-cinnabar/8 p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase text-cinnabar">Ryanbibi Choice</p>
                <p className="mt-2 font-serif text-3xl font-semibold text-ink">
                  {foodArchiveStats.choiceMemories}/{foodArchiveStats.choices}
                </p>
              </div>
              <span className="font-mono text-sm font-bold text-cinnabar">{memoryCompletion}%</span>
            </div>
            <Progress className="mt-4" color="bg-cinnabar" value={memoryCompletion} />
            <p className="mt-3 text-xs leading-5 text-ink-faint">
              {isZh ? '每个 Choice 都已连接主理人记忆文本。' : 'Every Choice entry is connected to a curator memory.'}
            </p>
          </div>
        </div>

        <div className="divide-y divide-line dark:divide-white/10">
          {visitRows.map((row) => {
            const Icon = row.icon
            return (
              <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-4 px-6 py-5 sm:px-8" key={row.label}>
                <span className="grid size-10 place-items-center rounded-lg bg-surface-sunk text-cinnabar dark:bg-white/[0.05]">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{row.label}</p>
                  <p className="mt-1 text-xs leading-5 text-ink-faint">{row.note}</p>
                </div>
                <span className="font-serif text-3xl font-semibold text-ink">{row.value}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FoodGallery({ language, place }) {
  const images = Array.isArray(place.images) ? place.images.filter(Boolean) : []
  const [active, setActive] = useState(0)

  if (!images.length) {
    return (
      <div className="relative">
        <FoodCover className="aspect-[16/10] rounded-lg" language={language} place={place} />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md border border-white/55 bg-surface/88 px-2.5 py-1.5 text-[11px] font-semibold text-ink-soft shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/80" data-no-translate>
          <ImageIcon className="size-3.5 text-cinnabar" />
          {language === 'zh' ? '实拍照片待补' : 'Original photos pending'}
        </span>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-surface-sunk">
        <img
          alt={place.name}
          className="size-full object-cover"
          decoding="async"
          loading="lazy"
          src={images[Math.min(active, images.length - 1)]}
        />
        {place.choice && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-ink/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            <BadgeCheck className="size-3.5 text-cinnabar-soft" />
            Ryanbibi Choice
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, index) => (
            <button
              className={cn(
                'size-16 overflow-hidden rounded-md border transition',
                index === active
                  ? 'border-cinnabar ring-2 ring-cinnabar/25'
                  : 'border-line hover:border-cinnabar/40 dark:border-white/10',
              )}
              key={src}
              onClick={() => setActive(index)}
              type="button"
            >
              <img alt="" className="size-full object-cover" loading="lazy" src={src} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PlaceFact({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex items-center gap-3 border-b border-line py-2.5 last:border-b-0 dark:border-white/10">
      <Icon className="size-4 shrink-0 text-cinnabar" />
      <span className="text-sm text-ink-faint">{label}</span>
      <span className="ml-auto text-sm font-semibold text-ink">{value}</span>
    </div>
  )
}

function getCoordinateQualityLabel(place, language) {
  const isZh = language === 'zh'
  if (place.coordinateAccuracy === 'exact') return isZh ? '精确坐标' : 'Exact location'
  if (place.coordinateAccuracy === 'estimated') return isZh ? '区域估算' : 'Area estimate'
  return isZh ? '坐标待补充' : 'Coordinates pending'
}

function ChoiceMemoryCard({ language, place }) {
  const isZh = language === 'zh'
  const memory = place.memory || {}
  const story = memory.story || place.note
  const people = Array.isArray(memory.people) ? memory.people : []
  const tags = [...new Set([...getChoiceMemoryTags(place), ...people])].slice(0, 6)
  const dishes = Array.isArray(place.signatureDishes) ? place.signatureDishes : []

  return (
    <article className="relative overflow-hidden rounded-lg border border-line bg-surface/92 p-6 shadow-[0_16px_42px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20 sm:p-7 lg:col-span-8" data-no-translate>
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-cinnabar" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-cinnabar">Ryanbibi Choice · Memory Card</p>
          <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {memory.title || (isZh ? `${place.region} 的一段餐桌记忆` : `A table memory from ${place.region}`)}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span className="rounded-md bg-cinnabar/8 px-2.5 py-1 text-xs font-semibold text-cinnabar" key={tag}>{localizeFoodTerm(tag, language)}</span>
          ))}
        </div>
      </div>

      <blockquote className="mt-7 border-l-2 border-cinnabar/45 pl-5 font-serif text-lg leading-9 text-ink-soft sm:text-xl">
        {story || (isZh ? '这张记忆卡正在等待完整故事。' : 'This memory card is waiting for its full story.')}
      </blockquote>

      {(memory.whyChoice || memory.occasion) && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {memory.whyChoice && (
            <div className="rounded-lg border border-line bg-surface-sunk/65 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="font-mono text-[11px] uppercase text-cinnabar">{isZh ? '为什么是 Choice' : 'Why it is a Choice'}</p>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{memory.whyChoice}</p>
            </div>
          )}
          {memory.occasion && (
            <div className="rounded-lg border border-line bg-surface-sunk/65 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="font-mono text-[11px] uppercase text-cinnabar">{isZh ? '时刻' : 'Moment'}</p>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{memory.occasion}</p>
            </div>
          )}
        </div>
      )}

      {dishes.length > 0 && (
        <div className="mt-6">
          <p className="font-mono text-xs uppercase text-ink-faint">{isZh ? '招牌 · 推荐点什么' : 'Signature order'}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {dishes.map((dish) => (
              <span className="rounded-lg border border-line bg-surface-sunk px-3 py-1.5 text-sm text-ink dark:border-white/10 dark:bg-white/[0.05]" key={dish}>{dish}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-line pt-4 text-xs text-ink-faint dark:border-white/10">
        {place.visitedAt && <span>{isZh ? '探店' : 'Visited'} · {place.visitedAt}</span>}
        {place.addedAt && <span>{isZh ? '收录' : 'Added'} · {place.addedAt}</span>}
        <span>{getCoordinateQualityLabel(place, language)}</span>
      </div>
    </article>
  )
}

function FoodAtlasEntryPage({ citySlug, language, mapHref, mapIsExact, place }) {
  const isZh = language === 'zh'

  return (
    <PageTransition>
      <nav className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
        <a className="transition hover:text-cinnabar" href="#/food">Food Atlas</a>
        <ChevronRight className="size-3.5" />
        <a className="transition hover:text-cinnabar" href={`#/food/${citySlug}`}>
          <span data-no-translate>{place.region}</span>
        </a>
        <ChevronRight className="size-3.5" />
        <span className="text-ink-soft" data-no-translate>{place.name}</span>
      </nav>

      <section className="relative overflow-hidden rounded-lg border border-line bg-surface/95 p-6 shadow-[0_22px_60px_rgba(91,64,35,0.1)] dark:border-white/10 dark:bg-white/[0.045] sm:p-9">
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-stone-400/60" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div>
            <p className="font-mono text-xs uppercase text-cinnabar" data-no-translate>
              {isZh ? '餐厅档案 · Atlas Entry' : 'Restaurant archive · Atlas entry'}
            </p>
            <h1 className="mt-4 text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl" data-no-translate>
              {place.name}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-soft" data-no-translate>
              <MapPin className="size-4 text-cinnabar" />
              {place.region}{place.area ? ` · ${place.area}` : ''}
            </p>
            {place.address && (
              <p className="mt-2 text-sm text-ink-faint" data-no-translate>{place.address}</p>
            )}
            <p className="mt-6 max-w-2xl text-base leading-8 text-ink-soft" data-no-translate>
              {place.note || (isZh
                ? '这是一条轻量餐厅记录。等再次到访或留下值得讲述的故事后，它可以升级为更完整的记忆卡。'
                : 'This is a lightweight restaurant record. A future visit or story can promote it into a fuller memory card.')}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {mapHref && (
                <a className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cinnabar dark:bg-white dark:text-ink dark:hover:bg-cinnabar dark:hover:text-white" href={mapHref} rel="noreferrer" target="_blank">
                  <span data-no-translate>
                    {mapIsExact
                      ? isZh ? '在地图中打开' : 'Open in Maps'
                      : isZh ? '搜索餐厅位置' : 'Search in Maps'}
                  </span>
                  <ArrowUpRight className="size-4" />
                </a>
              )}
              <SecondaryLink href={`#/food/${citySlug}`}>
                <span data-no-translate>{isZh ? `返回 ${place.region} 城市篇` : `Back to ${place.region}`}</span>
              </SecondaryLink>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-surface-sunk/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="font-mono text-xs uppercase text-ink-faint" data-no-translate>
              {isZh ? '快速信息' : 'Quick facts'}
            </p>
            <div className="mt-3 grid">
              <PlaceFact icon={Utensils} label={isZh ? '品类' : 'Cuisine'} value={localizeFoodTerm(place.category, language)} />
              <PlaceFact icon={MapPin} label={isZh ? '城市' : 'City'} value={place.region} />
              <PlaceFact icon={MapPin} label={isZh ? '地址' : 'Address'} value={place.address} />
              <PlaceFact icon={Percent} label={isZh ? '价位' : 'Price'} value={place.price} />
              <PlaceFact icon={Star} label={isZh ? '评分' : 'Rating'} value={place.rating ? `${place.rating.toFixed(1)} / 5` : null} />
              <PlaceFact icon={CalendarCheck} label={isZh ? '探店' : 'Visited'} value={place.visitedAt} />
              <PlaceFact icon={Clock3} label={isZh ? '收录' : 'Added'} value={place.addedAt} />
              <PlaceFact icon={Bookmark} label={isZh ? '状态' : 'Status'} value={getFoodStatusMeta(place.status, language).label} />
              <PlaceFact icon={MapPin} label={isZh ? '坐标' : 'Location'} value={getCoordinateQualityLabel(place, language)} />
              <PlaceFact icon={ImageIcon} label={isZh ? '照片' : 'Photos'} value={place.images?.length ? String(place.images.length) : isZh ? '待补充' : 'Pending'} />
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

function FoodPlacePage({ language, route }) {
  const id = route.split('/')[2]
  const place = foodPlaces.find((item) => item.id === id)

  if (!place) return <FoodAtlasPage />

  const tags = Array.isArray(place.tags) ? place.tags : []
  const citySlug = slugifyRegion(place.region)
  const mapIsExact = place.coordinateAccuracy === 'exact' && place.coordinates
  const mapQuery = mapIsExact
    ? `${place.coordinates.lat},${place.coordinates.lng}`
    : [place.name, place.area, place.region].filter(Boolean).join(', ')
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`

  if (!place.choice) {
    return (
      <FoodAtlasEntryPage
        citySlug={citySlug}
        language={language}
        mapHref={mapHref}
        mapIsExact={mapIsExact}
        place={place}
      />
    )
  }

  return (
    <PageTransition>
      <nav className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
        <a className="transition hover:text-cinnabar" href="#/food">
          Food Atlas
        </a>
        <ChevronRight className="size-3.5" />
        <a className="transition hover:text-cinnabar" href={`#/food/${citySlug}`}>
          <span data-no-translate>{place.region}</span>
        </a>
        <ChevronRight className="size-3.5" />
        <span className="text-ink-soft" data-no-translate>
          {place.name}
        </span>
      </nav>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <FoodGallery language={language} place={place} />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-cinnabar px-2.5 py-1 font-mono text-[11px] font-semibold uppercase text-white">
              Ryanbibi Choice
            </span>
            <span className="text-cinnabar">{localizeFoodTerm(place.category, language)}</span>
            {place.cuisine && place.cuisine !== place.category && (
              <span className="text-sm text-ink-faint">· {localizeFoodTerm(place.cuisine, language)}</span>
            )}
          </div>
          <h1
            className="mt-2 text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl"
            data-no-translate
          >
            {place.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {place.rating ? <StarRating value={place.rating} /> : null}
            {place.price && <PriceTag value={place.price} />}
            <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
              <MapPin className="size-3.5 text-ink-faint" />
              {place.region}
              {place.area ? ` · ${place.area}` : ''}
            </span>
          </div>
          {place.address && (
            <p className="mt-3 text-sm leading-6 text-ink-faint" data-no-translate>{place.address}</p>
          )}

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  className="rounded-md bg-cinnabar/8 px-2.5 py-1 text-xs font-medium text-cinnabar"
                  key={tag}
                >
                  {localizeFoodTerm(tag, language)}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {mapHref && (
              <a
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cinnabar dark:bg-white dark:text-ink dark:hover:bg-cinnabar dark:hover:text-white"
                href={mapHref}
                rel="noreferrer"
                target="_blank"
              >
                {mapIsExact
                  ? language === 'zh' ? '在地图中打开' : 'Open in Maps'
                  : language === 'zh' ? '搜索餐厅位置' : 'Search in Maps'}{' '}
                <ArrowUpRight className="size-4" />
              </a>
            )}
            <SecondaryLink href={`#/food/${citySlug}`}>
              {language === 'zh' ? `查看 ${place.region} 城市篇` : `View ${place.region} city chapter`}
            </SecondaryLink>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <ChoiceMemoryCard language={language} place={place} />

        <BentoCard className="lg:col-span-4" icon={MapPin} title="Quick Facts">
          <div className="grid">
            <PlaceFact icon={Utensils} label={language === 'zh' ? '品类' : 'Cuisine'} value={localizeFoodTerm(place.category, language)} />
            <PlaceFact icon={MapPin} label={language === 'zh' ? '城市' : 'City'} value={place.region} />
            <PlaceFact icon={MapPin} label={language === 'zh' ? '地址' : 'Address'} value={place.address} />
            <PlaceFact icon={Percent} label={language === 'zh' ? '价位' : 'Price'} value={place.price} />
            <PlaceFact
              icon={Star}
              label={language === 'zh' ? '评分' : 'Rating'}
              value={place.rating ? `${place.rating.toFixed(1)} / 5` : null}
            />
            <PlaceFact icon={CalendarCheck} label={language === 'zh' ? '探店' : 'Visited'} value={place.visitedAt} />
            <PlaceFact icon={Clock3} label={language === 'zh' ? '收录' : 'Added'} value={place.addedAt} />
            <PlaceFact icon={Bookmark} label={language === 'zh' ? '状态' : 'Status'} value={getFoodStatusMeta(place.status, language).label} />
            <PlaceFact icon={MapPin} label={language === 'zh' ? '坐标' : 'Location'} value={getCoordinateQualityLabel(place, language)} />
            <PlaceFact icon={ImageIcon} label={language === 'zh' ? '照片' : 'Photos'} value={place.images?.length ? String(place.images.length) : language === 'zh' ? '待补充' : 'Pending'} />
          </div>
        </BentoCard>
      </section>
    </PageTransition>
  )
}

function CityRestaurantMap({ language, onAreaSelect, places, region, selectedArea }) {
  const mapElementRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const mapBoundsRef = useRef(null)
  const markerRefs = useRef(new Map())
  const [mapStatus, setMapStatus] = useState('loading')
  const config = CITY_MAP_CONFIG[region]
  const points = useMemo(() => getCityAreaMapPoints(places, region), [places, region])
  const isZh = language === 'zh'

  useEffect(() => {
    if (!config || !mapElementRef.current || points.length === 0) return undefined

    let disposed = false
    let map

    import('leaflet')
      .then((module) => {
        if (disposed || !mapElementRef.current) return
        const L = module.default || module
        map = L.map(mapElementRef.current, {
          attributionControl: true,
          doubleClickZoom: true,
          scrollWheelZoom: true,
          touchZoom: true,
          zoomControl: false,
        }).setView(config.center, 10)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map)

        markerRefs.current = new Map()
        const markerGroup = []
        points.forEach((point) => {
          const size = clamp(38 + Math.sqrt(point.count) * 2.2, 42, 66)
          const marker = L.marker(point.coordinates, {
            icon: L.divIcon({
              className: 'city-map-marker-shell',
              html: `<span class="city-map-bubble"><strong>${point.count}</strong><small>${
                point.choiceCount
                  ? `${point.choiceCount} ${isZh ? '精选' : 'Choice'}`
                  : isZh ? '餐厅' : 'places'
              }</small></span>`,
              iconAnchor: [size / 2, size / 2],
              iconSize: [size, size],
            }),
            keyboard: true,
            riseOnHover: true,
            title: `${point.area}: ${point.count} ${isZh ? '家餐厅' : 'restaurants'}`,
          })
            .addTo(map)
            .on('click', () => onAreaSelect(point.area))

          markerRefs.current.set(point.area, marker)
          markerGroup.push(marker)
        })

        const bounds = L.featureGroup(markerGroup).getBounds()
        mapBoundsRef.current = bounds
        if (bounds.isValid()) {
          map.fitBounds(bounds, { maxZoom: config.maxZoom, padding: [38, 38] })
        }
        mapInstanceRef.current = map
        window.requestAnimationFrame(() => map?.invalidateSize())
        setMapStatus('ready')
      })
      .catch(() => {
        if (!disposed) setMapStatus('error')
      })

    return () => {
      disposed = true
      markerRefs.current.clear()
      mapInstanceRef.current = null
      mapBoundsRef.current = null
      map?.remove()
    }
  }, [config, isZh, onAreaSelect, points])

  useEffect(() => {
    markerRefs.current.forEach((marker, area) => {
      const bubble = marker.getElement()?.querySelector('.city-map-bubble')
      bubble?.classList.toggle('is-active', selectedArea === area)
      marker.setZIndexOffset(selectedArea === area ? 1000 : 0)
    })
  }, [selectedArea])

  if (!config || points.length === 0) return null

  const resetMap = () => {
    if (mapInstanceRef.current && mapBoundsRef.current?.isValid()) {
      mapInstanceRef.current.fitBounds(mapBoundsRef.current, {
        maxZoom: config.maxZoom,
        padding: [38, 38],
      })
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface/94 shadow-[0_20px_55px_rgba(91,64,35,0.1)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/25">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 border-b border-line p-4 dark:border-white/10 sm:p-5 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionKicker icon={MapPin} text={config.label} />
            <span className="font-mono text-xs uppercase text-ink-faint">
              {points.length} {isZh ? '个区域' : 'areas'}
            </span>
          </div>
          <div className="city-map-frame mt-4">
            <div
              aria-label={`${config.label}, ${points.length} restaurant areas`}
              className="city-map-leaflet"
              ref={mapElementRef}
              role="application"
            />
            {mapStatus === 'loading' && (
              <div className="city-map-state">
                <span className="size-2 animate-pulse rounded-full bg-cinnabar" />
                {isZh ? '地图载入中' : 'Loading map'}
              </div>
            )}
            {mapStatus === 'error' && (
              <div className="city-map-state">
                {isZh ? '底图暂时不可用，区域筛选仍可使用。' : 'Map tiles unavailable. Area filters still work.'}
              </div>
            )}
          </div>
          <div aria-label="Map zoom controls" className="mt-3 flex items-center justify-between gap-3">
            <span className="truncate font-mono text-xs uppercase text-ink-faint">
              {selectedArea === 'all' ? (isZh ? '全部区域' : 'All areas') : selectedArea}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <button aria-label="Zoom out" className="city-map-control" onClick={() => mapInstanceRef.current?.zoomOut()} type="button">
                <ZoomOut className="size-4" />
              </button>
              <button aria-label="Reset map" className="city-map-control" onClick={resetMap} type="button">
                <RotateCcw className="size-4" />
              </button>
              <button aria-label="Zoom in" className="city-map-control" onClick={() => mapInstanceRef.current?.zoomIn()} type="button">
                <ZoomIn className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <aside className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase text-cinnabar">
              {isZh ? '区域索引' : 'Area index'}
            </p>
            {selectedArea !== 'all' && (
              <button className="text-xs font-semibold text-ink-faint transition hover:text-cinnabar" onClick={() => onAreaSelect('all')} type="button">
                {isZh ? '清除' : 'Clear'}
              </button>
            )}
          </div>
          <div className="mt-4 grid max-h-[380px] gap-2 overflow-y-auto pr-1">
            <button
              className={cn('city-area-filter', selectedArea === 'all' && 'is-active')}
              onClick={() => onAreaSelect('all')}
              type="button"
            >
              <span>{isZh ? '全部区域' : 'All areas'}</span>
              <strong>{places.length}</strong>
            </button>
            {points.map((point) => (
              <button
                className={cn('city-area-filter', selectedArea === point.area && 'is-active')}
                key={point.area}
                onClick={() => onAreaSelect(point.area)}
                type="button"
              >
                <span data-no-translate>{point.area}</span>
                <strong>{point.count}</strong>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

function FoodCityPage({ language, route }) {
  const slug = route.split('/')[1]
  const region = getRegionFromSlug(slug)
  const foodPageSize = useFoodPageSize()
  const [selectedArea, setSelectedArea] = useState('all')
  const [visibleRestaurantCount, setVisibleRestaurantCount] = useState(foodPageSize)
  const summary = useMemo(() => (region ? getRegionSummary(region) : null), [region])
  const handleAreaSelect = useCallback((area) => {
    setSelectedArea(area)
    setVisibleRestaurantCount(foodPageSize)
  }, [foodPageSize])

  if (!region || !summary) return <FoodAtlasPage />

  const visiblePlaces =
    selectedArea === 'all'
      ? summary.places
      : summary.places.filter((place) => place.area === selectedArea)
  const sortedPlaces = visiblePlaces
    .slice()
    .sort((a, b) => Number(b.choice) - Number(a.choice) || a.name.localeCompare(b.name))
  const cuisineHighlights = summary.cuisines.slice(0, 4)
  const areaHighlights = summary.areas.slice(0, 6)
  const choicePreview = summary.choices.slice(0, 6)
  const recentPlaces = summary.places
    .filter((place) => /^\d{4}-\d{2}-\d{2}$/.test(place.visitedAt || ''))
    .sort((a, b) => b.visitedAt.localeCompare(a.visitedAt))
    .slice(0, 4)

  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden rounded-lg border border-line bg-surface/95 p-5 shadow-[0_24px_70px_rgba(91,64,35,0.12)] dark:border-white/10 dark:bg-slate-950 dark:shadow-black/30 sm:p-7 lg:p-8">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(91,64,35,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(91,64,35,0.05)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.06)_1px,transparent_1px)]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-px bg-cinnabar/50" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
          <div>
            <SectionKicker icon={Utensils} text="/Food / City" />
            <h1 className="mt-5 text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              <span data-no-translate>{region}</span> Food Chapter
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-soft sm:text-lg">
              A city-level tasting chapter from the Ryanbibi atlas: all logged restaurants,
              choice picks, neighborhoods, and the stories that can grow around them.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryLink href="#/food">Back to Food Atlas</PrimaryLink>
              <SecondaryLink href="#/home">Back Home</SecondaryLink>
            </div>
          </div>

          <div className="grid grid-cols-2 content-start gap-3 rounded-lg border border-line bg-surface-sunk/75 p-4 shadow-inner shadow-stone-300/30 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20 lg:grid-cols-1">
            <CityMetric label="restaurants logged" value={summary.places.length} />
            <CityMetric label="ryanbibi choices" value={summary.choices.length} />
            <CityMetric label="top cuisine" value={localizeFoodTerm(summary.topCuisine, language)} />
            <CityMetric label="atlas scope" value={summary.continent.shortLabel} />
          </div>
        </div>
      </section>

      {CITY_MAP_CONFIG[region] && (
        <CityRestaurantMap
          language={language}
          onAreaSelect={handleAreaSelect}
          places={summary.places}
          region={region}
          selectedArea={selectedArea}
        />
      )}

      <section className="grid gap-4 lg:grid-cols-12">
        <motion.article
          {...cardMotion}
          className="rounded-lg border border-line bg-surface/92 p-5 shadow-[0_16px_42px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20 lg:col-span-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionKicker icon={Sparkles} text="Choice Memory Cards" />
            <span className="rounded-lg bg-cinnabar/10 px-3 py-1.5 text-sm font-bold text-cinnabar">
              {summary.choices.length} Choice
            </span>
          </div>

          {choicePreview.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {choicePreview.map((place) => (
                <CityChoiceCard key={place.id} language={language} place={place} />
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-lg border border-dashed border-line-strong bg-surface-sunk/70 p-5 leading-7 text-ink-faint dark:border-white/15 dark:bg-white/[0.04]">
              这座城市还没有 Ryanbibi Choice，等一段未来的记忆。
            </p>
          )}
        </motion.article>

        <BentoCard className="lg:col-span-5" title="City Taste Profile" icon={MapPin}>
          <div className="grid gap-5">
            <div>
              <p className="font-mono text-xs uppercase text-ink-faint">
                cuisine mix
              </p>
              <div className="mt-3 grid gap-2">
                {cuisineHighlights.map(([label, count]) => (
                  <CityDistributionRow
                    count={count}
                    key={label}
                    label={localizeFoodTerm(label, language)}
                    total={summary.places.length}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase text-ink-faint">
                areas logged
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {areaHighlights.map(([label, count]) => (
                  <span
                    className="rounded-lg border border-line bg-surface-sunk px-3 py-1.5 text-sm text-ink-soft dark:border-white/10 dark:bg-white/[0.07]"
                    key={label}
                  >
                    {label} · {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </BentoCard>
      </section>

      {recentPlaces.length > 0 && (
        <section className="rounded-lg border border-line bg-surface/92 p-5 shadow-[0_18px_45px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionKicker icon={CalendarCheck} text="Latest in this city" />
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink" data-no-translate>
                {language === 'zh' ? '最近记录' : 'Recent tasting log'}
              </h2>
            </div>
            <p className="text-sm text-ink-faint" data-no-translate>
              {language === 'zh' ? '按探店日期排序' : 'Sorted by visit date'}
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {recentPlaces.map((place) => (
              <a className="group rounded-lg border border-line bg-surface-sunk/65 p-4 transition hover:-translate-y-0.5 hover:border-cinnabar/35 dark:border-white/10 dark:bg-white/[0.04]" href={`#/food/place/${place.id}`} key={place.id}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-cinnabar">{place.visitedAt}</span>
                  {place.choice && <span className="rounded-md bg-cinnabar/10 px-2 py-0.5 text-[10px] font-bold uppercase text-cinnabar">Choice</span>}
                </div>
                <h3 className="mt-3 font-serif text-xl font-semibold leading-tight text-ink transition group-hover:text-cinnabar" data-no-translate>{place.name}</h3>
                <p className="mt-2 text-sm text-ink-faint" data-no-translate>{place.area || localizeFoodTerm(place.category, language)}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-lg border border-line bg-surface/92 p-5 shadow-[0_18px_45px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionKicker icon={Utensils} text="All City Restaurants" />
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink">
              <span data-no-translate>
                {selectedArea === 'all' ? region : selectedArea}
              </span>{' '}
              {language === 'zh' ? '餐厅' : 'Restaurants'}
            </h2>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs uppercase text-cinnabar">
              {sortedPlaces.length} {language === 'zh' ? '家' : 'places'}
            </p>
            <p className="mt-1 text-sm text-ink-faint" data-no-translate>
              {language === 'zh'
                ? '精选餐厅拥有完整记忆卡，其他餐厅保持轻量记录。'
                : 'Choice entries open full memory cards; other restaurants stay lightweight.'}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sortedPlaces.slice(0, visibleRestaurantCount).map((place) => (
            <RestaurantCard
              active={false}
              key={place.id}
              language={language}
              onSelect={() => {}}
              place={place}
            />
          ))}
        </div>

        {visibleRestaurantCount < sortedPlaces.length && (
          <div className="mt-6 flex justify-center">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-surface-sunk px-5 text-sm font-semibold text-ink-soft transition hover:-translate-y-0.5 hover:border-cinnabar/35 hover:text-cinnabar dark:border-white/10 dark:bg-white/[0.05]"
              onClick={() => setVisibleRestaurantCount((count) => count + foodPageSize)}
              type="button"
            >
              <span data-no-translate>
                {language === 'zh'
                  ? `继续加载 · ${Math.min(foodPageSize, sortedPlaces.length - visibleRestaurantCount)} 家`
                  : `Load ${Math.min(foodPageSize, sortedPlaces.length - visibleRestaurantCount)} more`}
              </span>
            </button>
          </div>
        )}
      </section>
    </PageTransition>
  )
}

function CityMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-surface/65 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="font-mono text-xs uppercase text-ink-faint">{label}</p>
      <p className="mt-2 font-serif text-2xl font-semibold tracking-tight text-ink">{value}</p>
    </div>
  )
}

function CityChoiceCard({ language, place }) {
  const tags = getChoiceMemoryTags(place)

  return (
    <a
      className="ui-card-interactive group relative block overflow-hidden rounded-lg border border-line bg-surface p-5 pl-6 shadow-[0_16px_42px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20"
      href={`#/food/place/${place.id}`}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-cinnabar/60" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-wide text-cinnabar">
            Ryanbibi Choice
          </p>
          <h3
            className="mt-1.5 font-serif text-xl font-semibold leading-tight tracking-tight text-ink"
            data-no-translate
          >
            {place.name}
          </h3>
        </div>
        <StarRating className="shrink-0" value={place.rating} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-faint">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3" />
          {place.area}
        </span>
        <span aria-hidden="true">·</span>
        <span className="text-cinnabar">{localizeFoodTerm(place.category, language)}</span>
        {place.price && (
          <>
            <span aria-hidden="true">·</span>
            <PriceTag value={place.price} />
          </>
        )}
      </div>

      <p className="mt-4 line-clamp-3 border-l-2 border-cinnabar/40 pl-4 font-serif text-base leading-7 text-ink-soft">
        {getChoiceMemoryLead(place)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {tags.slice(0, 3).map((tag) => (
          <span
            className="rounded-md bg-cinnabar/8 px-2 py-0.5 text-[11px] font-medium text-cinnabar"
            key={tag}
          >
            {localizeFoodTerm(tag, language)}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-ink-faint transition group-hover:text-cinnabar">
          {language === 'zh' ? '查看详情' : 'View details'} <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </a>
  )
}

function CityDistributionRow({ count, label, total }) {
  const percentage = total ? Math.round((count / total) * 100) : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className="font-mono text-ink">
          {count} / {percentage}%
        </span>
      </div>
      <Progress value={percentage} color="bg-cinnabar" />
    </div>
  )
}

function FoodAtlasPage({ language }) {
  const defaultChoice = foodPlaces.find((place) => place.choice) || foodPlaces[0]
  const foodPageSize = useFoodPageSize()
  const [activeFoodId, setActiveFoodId] = useState(defaultChoice.id)
  const [query, setQuery] = useState('')
  const [continentFilter, setContinentFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [cuisineFilter, setCuisineFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('choice')
  const [choiceOnly, setChoiceOnly] = useState(false)
  const [page, setPage] = useState(1)

  const choicePlaces = useMemo(() => foodPlaces.filter((place) => place.choice), [])
  const scopedPlaces = useMemo(
    () =>
      foodPlaces.filter(
        (place) => continentFilter === 'all' || getContinentId(place.region) === continentFilter,
      ),
    [continentFilter],
  )
  const scopedChoicePlaces = useMemo(
    () => scopedPlaces.filter((place) => place.choice),
    [scopedPlaces],
  )
  const continentStats = useMemo(
    () =>
      continentDefinitions
        .map((continent) => {
          const places =
            continent.id === 'all'
              ? foodPlaces
              : foodPlaces.filter((place) => getContinentId(place.region) === continent.id)
          return {
            ...continent,
            choiceCount: places.filter((place) => place.choice).length,
            count: places.length,
          }
        })
        .filter((continent) => continent.id === 'all' || continent.count > 0),
    [],
  )
  const regions = useMemo(
    () =>
      [...new Set(scopedPlaces.map((place) => place.region))].sort((a, b) => a.localeCompare(b)),
    [scopedPlaces],
  )
  const regionStats = useMemo(
    () =>
      regions
        .map((region) => {
          const places = scopedPlaces.filter((place) => place.region === region)
          return {
            choiceCount: places.filter((place) => place.choice).length,
            continentId: getContinentId(region),
            count: places.length,
            region,
            topCuisine: getTopCuisine(places) || 'Cuisine',
          }
        })
        .sort(
          (a, b) =>
            b.choiceCount - a.choiceCount || b.count - a.count || a.region.localeCompare(b.region),
        ),
    [regions, scopedPlaces],
  )
  const categoryOptions = useMemo(
    () =>
      FOOD_CATEGORIES.filter((cat) => foodPlaces.some((place) => place.category === cat)),
    [],
  )
  const tagOptions = useMemo(() => {
    const counts = new Map()
    for (const place of foodPlaces) {
      for (const tag of place.tags || []) counts.set(tag, (counts.get(tag) || 0) + 1)
    }
    return [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a))
  }, [])
  const filteredPlaces = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()
    const byChoiceThenName = (a, b) =>
      Number(b.choice) - Number(a.choice) || a.name.localeCompare(b.name)
    const sorters = {
      choice: byChoiceThenName,
      rating: (a, b) => (b.rating || 0) - (a.rating || 0) || byChoiceThenName(a, b),
      recent: (a, b) => (b.visitedAt || '').localeCompare(a.visitedAt || '') || byChoiceThenName(a, b),
      added: (a, b) => (b.addedAt || '').localeCompare(a.addedAt || '') || byChoiceThenName(a, b),
      name: (a, b) => a.name.localeCompare(b.name),
    }
    return scopedPlaces
      .filter((place) => {
        const matchesSearch =
          !searchTerm ||
          place.name.toLowerCase().includes(searchTerm) ||
          (place.note || '').toLowerCase().includes(searchTerm)
        const matchesRegion = regionFilter === 'all' || place.region === regionFilter
        const matchesCategory = cuisineFilter === 'all' || place.category === cuisineFilter
        const matchesTag = tagFilter === 'all' || (place.tags || []).includes(tagFilter)
        const matchesChoice = !choiceOnly || place.choice
        const matchesStatus = statusFilter === 'all' || place.status === statusFilter
        return matchesSearch && matchesRegion && matchesCategory && matchesTag && matchesChoice && matchesStatus
      })
      .sort(sorters[sortBy] || byChoiceThenName)
  }, [choiceOnly, cuisineFilter, query, regionFilter, scopedPlaces, sortBy, statusFilter, tagFilter])

  const totalPages = Math.max(1, Math.ceil(filteredPlaces.length / foodPageSize))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * foodPageSize
  const paginatedPlaces = filteredPlaces.slice(pageStart, pageStart + foodPageSize)
  const activePlace =
    filteredPlaces.find((place) => place.id === activeFoodId) ||
    filteredPlaces[0] ||
    scopedChoicePlaces[0] ||
    scopedPlaces[0] ||
    defaultChoice
  const activeDisplayId = activePlace.id
  const cityPins = useMemo(() => getMapCityPins(scopedPlaces), [scopedPlaces])

  const selectFirstPlaceInScope = (continentId, region = 'all') => {
    const candidates = foodPlaces.filter((place) => {
      const matchesContinent = continentId === 'all' || getContinentId(place.region) === continentId
      const matchesRegion = region === 'all' || place.region === region
      return matchesContinent && matchesRegion
    })
    const nextPlace = candidates.find((place) => place.choice) || candidates[0] || defaultChoice
    if (nextPlace) setActiveFoodId(nextPlace.id)
  }

  const updateQuery = (value) => {
    setQuery(value)
    setPage(1)
  }

  const updateContinentFilter = (value) => {
    setContinentFilter(value)
    setRegionFilter('all')
    setPage(1)
    selectFirstPlaceInScope(value)
  }

  const updateRegionFilter = (value) => {
    if (value !== 'all') {
      setContinentFilter(getContinentId(value))
    }
    setRegionFilter(value)
    setPage(1)
    selectFirstPlaceInScope(value === 'all' ? continentFilter : getContinentId(value), value)
  }

  const openRegionPage = (value) => {
    if (value === 'all') {
      updateRegionFilter('all')
      return
    }
    window.location.hash = `#/food/${slugifyRegion(value)}`
  }

  const updateCuisineFilter = (value) => {
    setCuisineFilter(value)
    setPage(1)
  }

  const updateTagFilter = (value) => {
    setTagFilter(value)
    setPage(1)
  }

  const toggleChoiceOnly = () => {
    setChoiceOnly((current) => !current)
    setPage(1)
  }

  return (
    <PageTransition>
      <FoodGlobe
        activeContinent={continentFilter}
        activePlace={activePlace}
        activeRegion={regionFilter}
        cityPins={cityPins}
        choiceCount={choicePlaces.length}
        continentStats={continentStats}
        filteredCount={filteredPlaces.length}
        language={language}
        onContinentChange={updateContinentFilter}
        onRegionChange={updateRegionFilter}
        onRegionOpen={openRegionPage}
        regionStats={regionStats}
        totalCount={foodPlaces.length}
      />

      <FoodActivityHub language={language} />

      <FoodArchiveHealth language={language} />

      <section className="rounded-lg border border-line bg-surface/92 p-4 shadow-[0_18px_45px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,0.9fr)_auto]">
          <label className="relative block sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
            <input
              className="h-12 w-full rounded-lg border border-line bg-surface-sunk pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-cinnabar/50 focus:bg-surface focus:ring-4 focus:ring-cinnabar/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:bg-white/[0.07]"
              onChange={(event) => updateQuery(event.target.value)}
              placeholder={language === 'zh' ? '搜索店名 / 点评…' : 'Search restaurants or notes…'}
              type="search"
              value={query}
            />
          </label>

          <FilterSelect
            allLabel={language === 'zh' ? '全部品类' : 'All cuisines'}
            formatOption={(option) => localizeFoodTerm(option, language)}
            label="Category"
            onChange={updateCuisineFilter}
            options={categoryOptions}
            value={cuisineFilter}
          />
          <FilterSelect
            allLabel={language === 'zh' ? '全部城市' : 'All cities'}
            label="City"
            onChange={updateRegionFilter}
            options={regions}
            value={regionFilter}
          />
          <FilterSelect
            allLabel={language === 'zh' ? '全部标签' : 'All tags'}
            formatOption={(option) => localizeFoodTerm(option, language)}
            label="Tag"
            onChange={updateTagFilter}
            options={tagOptions}
            value={tagFilter}
          />
          <button
            className={cn(
              'h-12 rounded-lg border px-4 text-sm font-semibold transition hover:-translate-y-0.5',
              choiceOnly
                ? 'border-cinnabar/50 bg-cinnabar/10 text-cinnabar'
                : 'border-line bg-surface-sunk text-ink-soft dark:border-white/10 dark:bg-white/[0.04]',
            )}
            data-testid="choice-toggle"
            onClick={toggleChoiceOnly}
            type="button"
          >
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="size-4" />
              Ryanbibi Choice
            </span>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-faint">
          <span className="inline-flex flex-wrap items-center gap-2">
            <span className="font-mono text-ink-soft">
              {filteredPlaces.length} {language === 'zh' ? '家' : 'places'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {language === 'zh'
                ? `${choicePlaces.length} 精选 / ${regions.length} 城市 / ${foodPlaces.length} 总数`
                : `${choicePlaces.length} choices / ${regions.length} cities / ${foodPlaces.length} total`}
            </span>
          </span>
          <label className="inline-flex items-center gap-2">
            <span className="text-ink-faint">{language === 'zh' ? '排序' : 'Sort'}</span>
            <select
              className="h-9 rounded-lg border border-line bg-surface-sunk px-2.5 text-sm text-ink-soft outline-none transition focus:border-cinnabar/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
              onChange={(event) => setSortBy(event.target.value)}
              value={sortBy}
            >
              <option value="choice">{language === 'zh' ? '精选优先' : 'Choice first'}</option>
              <option value="rating">{language === 'zh' ? '评分最高' : 'Highest rated'}</option>
              <option value="recent">{language === 'zh' ? '最近探店' : 'Recently visited'}</option>
              <option value="added">{language === 'zh' ? '最近新增' : 'Recently added'}</option>
              <option value="name">{language === 'zh' ? '名称 A–Z' : 'Name A–Z'}</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 dark:border-white/10" data-no-translate>
          <span className="mr-1 font-mono text-[11px] uppercase text-ink-faint">
            {language === 'zh' ? '记录状态' : 'Record status'}
          </span>
          {[
            ['all', language === 'zh' ? '全部' : 'All'],
            ['visited', language === 'zh' ? '已探店' : 'Visited'],
            ['wishlist', language === 'zh' ? '想去' : 'Wishlist'],
            ['saved', language === 'zh' ? '已收录' : 'Saved'],
          ].map(([value, label]) => (
            <button
              className={cn(
                'rounded-md border px-3 py-1.5 text-xs font-semibold transition',
                statusFilter === value
                  ? 'border-cinnabar/45 bg-cinnabar/10 text-cinnabar'
                  : 'border-line bg-surface-sunk text-ink-faint hover:border-cinnabar/25 hover:text-cinnabar dark:border-white/10 dark:bg-white/[0.04]',
              )}
              key={value}
              onClick={() => {
                setStatusFilter(value)
                setPage(1)
              }}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {paginatedPlaces.map((place) => (
            <RestaurantCard
              active={activeDisplayId === place.id}
              key={place.id}
              language={language}
              onSelect={setActiveFoodId}
              place={place}
            />
          ))}
        </AnimatePresence>
      </section>

      {!filteredPlaces.length && (
        <div className="rounded-lg border border-dashed border-line-strong bg-surface/92 p-8 text-center text-ink-faint dark:border-white/15 dark:bg-white/[0.04]">
          {language === 'zh'
            ? '没有符合当前筛选的餐厅，试着放宽条件。'
            : 'No restaurants match these filters. Try broadening the search.'}
        </div>
      )}

      <Pagination
        currentPage={safePage}
        onPageChange={setPage}
        pageSize={foodPageSize}
        totalItems={filteredPlaces.length}
        totalPages={totalPages}
      />
    </PageTransition>
  )
}

function FilterSelect({ allLabel, formatOption = (option) => option, label, onChange, options, value }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        className="h-12 w-full rounded-lg border border-line bg-surface-sunk px-3 text-sm text-ink-soft outline-none transition focus:border-cinnabar/50 focus:bg-surface focus:ring-4 focus:ring-cinnabar/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:bg-white/[0.07]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption(option)}
          </option>
        ))}
      </select>
    </label>
  )
}

function StarRating({ value, className = '' }) {
  if (!value) return null
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)} title={`${value} / 5`}>
      <span className="relative inline-flex">
        <span className="flex text-ink-faint/35">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star className="size-3.5" key={i} />
          ))}
        </span>
        <span
          className="absolute inset-0 flex overflow-hidden text-cinnabar"
          style={{ width: `${pct}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Star className="size-3.5 shrink-0" fill="currentColor" key={i} />
          ))}
        </span>
      </span>
      <span className="font-mono text-xs font-semibold text-ink">{value.toFixed(1)}</span>
    </span>
  )
}

function PriceTag({ value }) {
  if (!value) return null
  const filled = value.length
  return (
    <span className="font-mono text-xs" title={`价位 ${value}`}>
      <span className="font-semibold text-ink">{value}</span>
      <span className="text-ink-faint/40">{'$'.repeat(Math.max(0, 4 - filled))}</span>
    </span>
  )
}

function FoodCover({ place, className = '', language = 'en' }) {
  const hue = categoryHue(place.category)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const showImg = place.cover && !failed

  return (
    <div className={cn('relative aspect-[4/3] w-full overflow-hidden bg-surface-sunk', className)}>
      <div
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center"
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 55% 55% / 0.16), hsl(${hue} 45% 45% / 0.06))`,
        }}
      >
        <span className="select-none font-serif text-3xl font-semibold tracking-tight text-ink/20">
          {localizeFoodTerm(place.category, language)}
        </span>
      </div>
      {showImg && (
        <img
          alt={place.name}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
          decoding="async"
          loading="lazy"
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          src={place.cover}
        />
      )}
      {place.choice && (
        <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-ink/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          <BadgeCheck className="size-3 text-cinnabar-soft" />
          Choice
        </span>
      )}
    </div>
  )
}

function RestaurantCard({ active, language = 'en', onSelect, place }) {
  const dishes = Array.isArray(place.signatureDishes) ? place.signatureDishes : []
  const tags = Array.isArray(place.tags) ? place.tags : []

  return (
    <motion.article
      layout
      className={cn(
        'ui-card-interactive group flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-surface/94 shadow-[0_16px_42px_rgba(91,64,35,0.08)] dark:bg-white/[0.045] dark:shadow-black/20',
        active ? 'border-cinnabar/60 ring-2 ring-cinnabar/20' : 'border-line dark:border-white/10',
      )}
      onClick={() => {
        window.location.hash = `#/food/place/${place.id}`
      }}
      onMouseEnter={() => onSelect(place.id)}
      {...cardMotion}
    >
      <FoodCover className="rounded-t-[7px]" language={language} place={place} />

      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 truncate font-serif text-lg font-semibold leading-tight tracking-tight text-ink">
            {place.name}
          </h3>
          <StarRating className="shrink-0" value={place.rating} />
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" />
            {place.region}
            {place.area ? ` · ${place.area}` : ''}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-cinnabar">{localizeFoodTerm(place.category, language)}</span>
          {place.price && (
            <>
              <span aria-hidden="true">·</span>
              <PriceTag value={place.price} />
            </>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <FoodStatusBadge language={language} status={place.status} />
          {place.addedAt && (
            <span className="font-mono text-[10px] text-ink-faint" data-no-translate>
              + {place.addedAt}
            </span>
          )}
        </div>

        {dishes.length > 0 && (
          <p className="mt-3 line-clamp-1 text-sm text-ink-soft">
            <span className="text-ink-faint">{language === 'zh' ? '招牌 · ' : 'Signature · '}</span>
            {dishes.join(' / ')}
          </p>
        )}

        {place.note && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-soft">{place.note}</p>
        )}

        {(tags.length > 0 || place.visitedAt) && (
          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                className="rounded-md bg-cinnabar/8 px-2 py-0.5 text-[11px] font-medium text-cinnabar"
                key={tag}
              >
                {localizeFoodTerm(tag, language)}
              </span>
            ))}
            {place.visitedAt && (
              <span className="ml-auto font-mono text-[11px] text-ink-faint/80">
                {place.visitedAt}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}

function Pagination({ currentPage, onPageChange, pageSize, totalItems, totalPages }) {
  const canGoBack = currentPage > 1
  const canGoForward = currentPage < totalPages
  const start = totalItems ? (currentPage - 1) * pageSize + 1 : 0
  const end = Math.min(currentPage * pageSize, totalItems)

  return (
    <nav className="flex flex-col items-center justify-between gap-3 rounded-lg border border-line bg-surface/92 p-4 shadow-[0_16px_42px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20 sm:flex-row">
      <p className="text-sm text-ink-faint">
        {start}-{end} / {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button
          className="ui-icon-action grid size-10 place-items-center border border-line bg-surface-sunk text-ink-soft hover:border-cinnabar/40 hover:text-cinnabar disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink-soft dark:border-white/10 dark:bg-white/[0.04]"
          disabled={!canGoBack}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="min-w-24 text-center font-mono text-sm text-ink-soft">
          {currentPage} / {totalPages}
        </span>
        <button
          className="ui-icon-action grid size-10 place-items-center border border-line bg-surface-sunk text-ink-soft hover:border-cinnabar/40 hover:text-cinnabar disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink-soft dark:border-white/10 dark:bg-white/[0.04]"
          disabled={!canGoForward}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  )
}

function FoodGlobe({
  activeContinent,
  activePlace,
  activeRegion,
  cityPins,
  choiceCount,
  continentStats,
  filteredCount,
  language,
  onContinentChange,
  onRegionChange,
  onRegionOpen,
  regionStats,
  totalCount,
}) {
  const enabledContinentIds = useMemo(
    () =>
      new Set(
        continentStats
          .filter((continent) => continent.id !== 'all' && continent.count > 0)
          .map((continent) => continent.id),
      ),
    [continentStats],
  )
  const activeContinentMeta = getContinentMeta(activeContinent)
  const mapRef = useRef(null)
  const dragRef = useRef(null)
  const [mapView, setMapView] = useState({ zoom: 1, x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const pinLayouts = useMemo(() => getMapPinLayouts(cityPins, mapView.zoom), [cityPins, mapView.zoom])
  const mobilePrimaryCityIds = useMemo(() => {
    const groupedPins = cityPins.reduce((groups, pin) => {
      const continentId = getContinentId(pin.region)
      const group = groups.get(continentId) || []
      group.push(pin)
      groups.set(continentId, group)
      return groups
    }, new Map())
    return new Set(
      [...groupedPins.values()].flatMap((pins) =>
        pins
          .slice()
          .sort((a, b) => b.count - a.count || b.choiceCount - a.choiceCount)
          .slice(0, 2)
          .map((pin) => pin.id),
      ),
    )
  }, [cityPins])
  const pinScale = 1 / mapView.zoom
  const activeCity =
    cityPins.find((pin) => pin.region === activeRegion) ||
    cityPins.find((pin) => pin.region === activePlace?.region) ||
    cityPins[0]
  const activeCityPlaces = useMemo(
    () => (activeCity ? foodPlaces.filter((place) => place.region === activeCity.region) : []),
    [activeCity],
  )
  const activeCityChoices = useMemo(
    () => activeCityPlaces.filter((place) => place.choice),
    [activeCityPlaces],
  )
  const activeCityAreas = useMemo(() => {
    const counts = activeCityPlaces.reduce((map, place) => {
      const area = place.area || 'Area'
      map.set(area, (map.get(area) || 0) + 1)
      return map
    }, new Map())
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 3)
  }, [activeCityPlaces])
  const focusTargets = [
    { id: 'world', label: 'World', zoom: 1 },
    { id: 'east-coast', label: 'East Coast', center: { lat: 40.8, lng: -74.2 }, zoom: 3.1 },
    { id: 'china', label: 'China', center: { lat: 36.8, lng: 112.5 }, zoom: 2.8 },
    { id: 'europe', label: 'Europe', center: { lat: 46, lng: 12 }, zoom: 2.35 },
  ]

  const updateMapView = (nextView) => {
    setMapView((current) => constrainMapView({ ...current, ...nextView }, mapRef.current))
  }

  const zoomMapBy = useCallback((delta, anchor) => {
    const element = mapRef.current
    setMapView((current) => {
      const zoom = clamp(current.zoom + delta, MAP_MIN_ZOOM, MAP_MAX_ZOOM)
      if (!element || !anchor || current.zoom <= 0) {
        return constrainMapView({ ...current, zoom }, element)
      }

      const rect = element.getBoundingClientRect()
      const anchorX = anchor.clientX - rect.left - rect.width / 2
      const anchorY = anchor.clientY - rect.top - rect.height / 2
      const zoomRatio = zoom / current.zoom
      return constrainMapView(
        {
          zoom,
          x: anchorX - (anchorX - current.x) * zoomRatio,
          y: anchorY - (anchorY - current.y) * zoomRatio,
        },
        element,
      )
    })
  }, [])

  const resetMapView = () => {
    setMapView({ zoom: 1, x: 0, y: 0 })
  }

  const focusMapOnPoint = (point, zoom = 2.2) => {
    const element = mapRef.current
    if (!element || zoom <= 1) {
      resetMapView()
      return
    }
    const rect = element.getBoundingClientRect()
    const x = ((50 - point.x) / 100) * rect.width * zoom
    const y = ((50 - point.y) / 100) * rect.height * zoom
    setMapView(constrainMapView({ zoom, x, y }, element))
  }

  const focusMapTarget = (target) => {
    if (!target.center) {
      resetMapView()
      return
    }
    focusMapOnPoint(projectMapPoint(target.center), target.zoom)
  }

  const handleContinentSelect = (continentId) => {
    onContinentChange(continentId)
    if (continentId === 'all') {
      resetMapView()
      return
    }
    const zoomByContinent = {
      asia: 1.9,
      europe: 2.35,
      'north-america': 2.35,
    }
    focusMapOnPoint(projectMapPoint(getContinentMeta(continentId).center), zoomByContinent[continentId] || 1.8)
  }

  const handleMapWheel = useCallback((event) => {
    if (event.target.closest?.('button, input')) return
    event.preventDefault()
    const direction = event.deltaY > 0 ? -0.16 : 0.16
    zoomMapBy(direction, { clientX: event.clientX, clientY: event.clientY })
  }, [zoomMapBy])

  const handlePointerDown = (event) => {
    if (event.target.closest?.('button, input')) return
    if (mapView.zoom <= 1) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: mapView.x,
      originY: mapView.y,
    }
    setIsDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const dragState = dragRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) return
    updateMapView({
      x: dragState.originX + event.clientX - dragState.startX,
      y: dragState.originY + event.clientY - dragState.startY,
    })
  }

  const handlePointerEnd = (event) => {
    const dragState = dragRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) return
    dragRef.current = null
    setIsDragging(false)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  useEffect(() => {
    const handleResize = () => {
      setMapView((current) => constrainMapView(current, mapRef.current))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const element = mapRef.current
    if (!element) return undefined
    element.addEventListener('wheel', handleMapWheel, { passive: false })
    return () => element.removeEventListener('wheel', handleMapWheel)
  }, [handleMapWheel])

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-line bg-surface text-ink dark:border-white/10 dark:bg-slate-950 dark:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_10%,rgba(193,67,46,0.1),transparent_30%),radial-gradient(circle_at_16%_0%,rgba(120,76,35,0.06),transparent_32%),linear-gradient(90deg,rgba(120,76,35,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(120,76,35,0.06)_1px,transparent_1px)] bg-[size:auto,auto,56px_56px,56px_56px] dark:bg-[radial-gradient(circle_at_86%_10%,rgba(217,99,78,0.1),transparent_30%),radial-gradient(circle_at_16%_0%,rgba(255,255,255,0.05),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.06)_1px,transparent_1px)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/35 to-transparent dark:from-[#f7efe2]/10" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
          <div className="lg:col-span-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/55 px-3 py-1.5 font-mono text-xs uppercase text-cinnabar shadow-lg shadow-stone-300/20 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-cinnabar-soft">
              <Utensils className="size-3.5 text-cinnabar dark:text-cinnabar-soft" />
              food memory layer
            </span>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
              Global Food Atlas
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink-soft sm:text-lg dark:text-slate-300">
              A tasting notebook for Ryan's meals, memories, and choice-worthy plates
              around the map. Browse it like a food journal: continent, city, then the
              memory behind the meal.
            </p>
            <div className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                { label: 'tasting map', value: 'city pins first' },
                {
                  label: 'choice memories',
                  value: (
                    <>
                      <span data-no-translate>{choiceCount}</span> editor picks
                    </>
                  ),
                },
                {
                  label: 'restaurant archive',
                  value: (
                    <>
                      <span data-no-translate>{totalCount}</span> logged places
                    </>
                  ),
                },
              ].map((item) => (
                <div
                  className="rounded-lg border border-line bg-surface/68 p-3 shadow-lg shadow-stone-300/20 backdrop-blur dark:border-white/10 dark:bg-white/[0.05]"
                  key={item.label}
                >
                  <p className="font-mono text-[11px] uppercase text-cinnabar dark:text-cinnabar-soft">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink dark:text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-surface/78 p-4 shadow-2xl shadow-stone-300/30 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/64 dark:shadow-black/25 sm:p-5 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase text-cinnabar dark:text-cinnabar-soft">
                Atlas Scope
              </p>
              <span className="rounded-lg bg-cinnabar/8 px-2 py-1 font-mono text-xs text-ink-faint dark:bg-white/10 dark:text-slate-300">
                {activeContinentMeta.shortLabel}
              </span>
            </div>

            <div
              ref={mapRef}
              className={cn(
                'relative mt-4 h-[260px] w-full overscroll-contain overflow-hidden rounded-lg border border-line bg-[#e9edf0] shadow-inner shadow-stone-400/30 dark:border-white/10 dark:shadow-black/40 sm:h-auto sm:aspect-[2.15/1] sm:min-h-[360px] lg:min-h-[430px]',
                mapView.zoom <= 1.15 && 'food-map-world-view',
                mapView.zoom > 1 ? 'touch-none' : 'touch-pan-y',
                mapView.zoom > 1 && 'cursor-grab',
                isDragging && 'cursor-grabbing',
              )}
              data-testid="food-flat-map"
              onPointerCancel={handlePointerEnd}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              style={{
                '--pin-hover-scale': (pinScale * 1.13).toFixed(2),
                '--pin-scale': pinScale.toFixed(2),
              }}
            >
              <div
                className="absolute inset-0 origin-center will-change-transform"
                style={{
                  transform: `translate3d(${mapView.x}px, ${mapView.y}px, 0) scale(${mapView.zoom})`,
                  transition: isDragging ? 'none' : 'transform 180ms ease',
                }}
              >
                <svg
                  aria-label="Flat world map"
                  className="absolute inset-0 size-full"
                  preserveAspectRatio="xMidYMid meet"
                  role="img"
                  viewBox="0 0 1000 500"
                >
                  <rect fill="#e8edf0" height="500" width="1000" />
                  <path d="M0 250 H1000" stroke="rgba(15,23,42,0.12)" strokeWidth="1" />
                  {[100, 200, 300, 400].map((y) => (
                    <path
                      d={`M0 ${y} H1000`}
                      key={`lat-${y}`}
                      stroke="rgba(15,23,42,0.08)"
                      strokeWidth="1"
                    />
                  ))}
                  {[125, 250, 375, 500, 625, 750, 875].map((x) => (
                    <path
                      d={`M${x} 0 V500`}
                      key={`lng-${x}`}
                      stroke="rgba(15,23,42,0.08)"
                      strokeWidth="1"
                    />
                  ))}
                  {worldMapCountries.map((country) => {
                    const hasData = enabledContinentIds.has(country.continentId)
                    const isActive = activeContinent === country.continentId
                    return (
                      <path
                        className={cn(
                          'pointer-events-none transition duration-200',
                          hasData
                            ? 'fill-stone-300/70 stroke-stone-400/40'
                            : 'pointer-events-none fill-stone-200/70 stroke-stone-300/30 opacity-60',
                          isActive && 'fill-cinnabar/20 stroke-cinnabar/60',
                        )}
                        d={country.d}
                        data-continent-id={country.continentId}
                        key={country.id}
                        strokeWidth={isActive ? 1.3 : 0.65}
                      />
                    )
                  })}
                </svg>

                {continentHotspots.map((shape) => {
                  const hasData = enabledContinentIds.has(shape.id)
                  if (!hasData) return null
                  return (
                    <button
                      aria-label={shape.label}
                      aria-pressed={activeContinent === shape.id}
                      className="food-continent-hotspot absolute z-[2] cursor-pointer border-0 bg-transparent focus-visible:outline-none"
                      data-continent-id={shape.id}
                      key={`${shape.id}-hotspot`}
                      onClick={() => handleContinentSelect(shape.id)}
                      style={{
                        height: `${shape.hotspot.height}%`,
                        left: `${shape.hotspot.left}%`,
                        top: `${shape.hotspot.top}%`,
                        width: `${shape.hotspot.width}%`,
                      }}
                      title={shape.label}
                      type="button"
                    >
                      <span aria-hidden="true" className="food-continent-focus-label">
                        {shape.label}
                      </span>
                      <span className="sr-only">{shape.label}</span>
                    </button>
                  )
                })}

                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 size-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  {pinLayouts
                    .filter((layout) => layout.spread)
                    .map(({ displayPoint, place, point }) => (
                      <line
                        className={cn(
                          'stroke-stone-500/35 [stroke-dasharray:2_2] [stroke-linecap:round] [stroke-width:0.12]',
                          place.choice && 'stroke-cinnabar/45',
                        )}
                        key={`${place.id}-guide`}
                        x1={point.x}
                        x2={displayPoint.x}
                        y1={point.y}
                        y2={displayPoint.y}
                      />
                    ))}
                </svg>

                {pinLayouts.map(({ displayPoint, place, spread }) => {
                  const placeLabel = place.count === 1 ? 'place' : 'places'
                  const label = `${place.name} · ${place.count} ${placeLabel}${
                    place.choiceCount ? ` / ${place.choiceCount} Choice` : ''
                  }`
                  const isActive =
                    activeRegion === place.region ||
                    (activeRegion === 'all' && activePlace?.region === place.region)
                  const pinSize = clamp(19 + Math.sqrt(place.count) * 1.65, 22, 42)
                  return (
                    <button
                      aria-label={label}
                      aria-pressed={isActive}
                      className={cn(
                        'food-map-pin-react food-city-pin group absolute z-10 transition duration-200 hover:z-20',
                        place.choice && 'has-choice',
                        spread && 'is-spread',
                        !mobilePrimaryCityIds.has(place.id) &&
                          place.region !== activePlace?.region &&
                          'is-mobile-secondary',
                        isActive && 'is-active z-30',
                      )}
                      data-region-value={place.region}
                      key={place.id}
                      onClick={() => onRegionChange(place.region)}
                      style={{
                        '--pin-size': `${pinSize}px`,
                        left: `${displayPoint.x}%`,
                        top: `${displayPoint.y}%`,
                        zIndex: isActive ? 30 : place.count > 40 ? 14 : 16,
                      }}
                      type="button"
                    >
                      <span className="food-city-pin-core">
                        <span className="food-city-pin-count">{place.count}</span>
                      </span>
                      {place.choiceCount > 0 && (
                        <span className="food-city-pin-choice">{place.choiceCount}</span>
                      )}
                      <span
                        className={cn(
                          'food-city-pin-label pointer-events-none absolute left-1/2 top-[calc(100%+0.35rem)] hidden max-w-[220px] -translate-x-1/2 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-white/15 bg-slate-950/90 px-2 py-1 text-[11px] font-semibold text-white shadow-xl shadow-black/30 group-hover:block',
                          isActive && 'block',
                        )}
                      >
                        {label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-line bg-surface/86 px-2.5 py-1.5 text-[11px] font-semibold text-ink-faint shadow-lg shadow-stone-300/30 backdrop-blur dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-stone-700" /> City total
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-cinnabar" /> Has Choice
                </span>
                <span className="hidden text-ink-faint/80 lg:inline">Drag · scroll to zoom</span>
              </div>
              <div
                aria-label="Map zoom controls"
                className="flex w-full items-center gap-2 rounded-lg border border-line bg-surface/90 p-2 text-ink shadow-xl shadow-stone-300/30 backdrop-blur dark:border-white/10 dark:bg-slate-950/80 dark:text-white sm:w-[min(100%,620px)]"
              >
                <button
                  aria-label="Zoom out"
                  className="grid size-11 shrink-0 place-items-center rounded-lg border border-line bg-surface/80 text-ink-soft transition hover:border-cinnabar/30 dark:border-white/10 dark:bg-white/10 dark:text-white"
                  onClick={() => zoomMapBy(-0.35)}
                  type="button"
                >
                  <ZoomOut className="size-4" />
                </button>
                <label className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="sr-only">Map zoom</span>
                  <input
                    aria-label="Map zoom"
                    className="h-11 w-full accent-cinnabar"
                    max={MAP_MAX_ZOOM}
                    min={MAP_MIN_ZOOM}
                    onChange={(event) => updateMapView({ zoom: Number(event.target.value) })}
                    step="0.1"
                    type="range"
                    value={mapView.zoom}
                  />
                  <span className="min-w-8 font-mono text-[11px] font-bold text-ink-faint dark:text-slate-300">
                    {mapView.zoom.toFixed(1)}x
                  </span>
                </label>
                <button
                  aria-label="Zoom in"
                  className="grid size-11 shrink-0 place-items-center rounded-lg border border-line bg-surface/80 text-ink-soft transition hover:border-cinnabar/30 dark:border-white/10 dark:bg-white/10 dark:text-white"
                  onClick={() => zoomMapBy(0.35)}
                  type="button"
                >
                  <ZoomIn className="size-4" />
                </button>
                <button
                  aria-label="Reset map"
                  className="grid size-11 shrink-0 place-items-center rounded-lg border border-line bg-surface/80 text-ink-soft transition hover:border-cinnabar/30 dark:border-white/10 dark:bg-white/10 dark:text-white"
                  onClick={resetMapView}
                  type="button"
                >
                  <RotateCcw className="size-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {focusTargets.map((target) => (
                <button
                  className="rounded-lg border border-line bg-surface/70 px-3 py-2 text-left text-xs font-semibold text-ink-soft shadow-sm shadow-stone-300/20 transition hover:-translate-y-0.5 hover:border-cinnabar/35 hover:text-cinnabar dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:text-cinnabar-soft"
                  key={target.id}
                  onClick={() => focusMapTarget(target)}
                  type="button"
                >
                  {target.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {continentStats.map((continent) => (
                <button
                  className={cn(
                    'rounded-lg border px-3 py-2 text-left transition hover:-translate-y-0.5',
                    activeContinent === continent.id
                      ? 'border-cinnabar/45 bg-cinnabar/10 text-ink dark:border-cinnabar/60 dark:bg-cinnabar/15 dark:text-white'
                      : 'border-line bg-surface/50 text-ink-soft hover:border-cinnabar/30 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/10',
                  )}
                  data-continent-id={continent.id}
                  key={continent.id}
                  onClick={() => handleContinentSelect(continent.id)}
                  type="button"
                >
                  <span className="block text-sm font-bold">{continent.shortLabel}</span>
                  <span className="mt-1 block font-mono text-[11px] uppercase text-ink-faint dark:text-slate-400">
                    {continent.count} places / {continent.choiceCount} choices
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-surface/82 p-4 shadow-2xl shadow-stone-300/30 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/78 dark:shadow-black/30 sm:p-5">
            <p className="font-mono text-xs uppercase text-cinnabar dark:text-cinnabar-soft">
              Selected City
            </p>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate font-serif text-2xl font-semibold tracking-tight" data-no-translate>
                  {activeCity?.name || activePlace.region}
                </h3>
                <p className="mt-1 text-sm text-ink-faint dark:text-slate-300">
                  {activeCity
                    ? `${getContinentMeta(getContinentId(activeCity.region)).shortLabel} / ${activeCity.count} restaurants`
                    : activePlace.location}
                </p>
              </div>
              {activeCity?.choiceCount ? (
                <span className="shrink-0 rounded-lg bg-cinnabar/10 px-2.5 py-1.5 text-xs font-bold text-cinnabar dark:bg-cinnabar/15 dark:text-cinnabar-soft">
                  {activeCity.choiceCount} Choice
                </span>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-cinnabar/8 px-2 py-1 text-xs font-medium text-cinnabar">
                {localizeFoodTerm(activeCity?.topCuisine || activePlace.category, language)}
              </span>
              {activeCityAreas.map(([area, count]) => (
                <span
                  className="rounded-lg bg-surface-sunk px-2 py-1 text-xs text-ink-soft dark:bg-white/10 dark:text-slate-200"
                  key={area}
                >
                  {area} · {count}
                </span>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-line bg-surface-sunk/60 p-3 text-sm dark:border-white/10 dark:bg-white/[0.04]">
              {activeCityChoices.length ? (
                <div className="grid gap-2">
                  {activeCityChoices.slice(0, 3).map((place) => (
                    <a
                      className="group flex items-center justify-between gap-3 rounded-md px-2 py-1.5 transition hover:bg-cinnabar/8"
                      href={`#/food/place/${place.id}`}
                      key={place.id}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink" data-no-translate>
                          {place.name}
                        </span>
                        <span className="line-clamp-1 text-xs text-ink-faint">
                          {place.area || localizeFoodTerm(place.category, language)}
                        </span>
                      </span>
                      <ArrowUpRight className="size-3.5 shrink-0 text-ink-faint transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cinnabar" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="leading-6 text-ink-soft dark:text-slate-300">
                  {activeCity?.name || activePlace.region} is logged in the atlas. Choice memories can be added here later.
                </p>
              )}
              {activeCity && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3 dark:border-white/10">
                  <button
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cinnabar dark:bg-white dark:text-ink dark:hover:bg-cinnabar dark:hover:text-white"
                    onClick={() => onRegionChange(activeCity.region)}
                    type="button"
                  >
                    筛选这座城市
                  </button>
                  <a
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink-soft transition hover:-translate-y-0.5 hover:border-cinnabar/40 hover:text-cinnabar dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                    href={`#/food/${slugifyRegion(activeCity.region)}`}
                    onClick={(event) => {
                      event.preventDefault()
                      onRegionOpen(activeCity.region)
                    }}
                  >
                    进入城市篇 <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <FoodStageMetric label="mapped places" value={String(totalCount)} />
              <FoodStageMetric label="choice picks" value={String(choiceCount)} />
              <FoodStageMetric label="current results" value={String(filteredCount)} />
            </div>
          </div>

          <div className="rounded-lg border border-line bg-surface/82 p-4 shadow-2xl shadow-stone-300/30 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/25 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase text-cinnabar dark:text-cinnabar-soft">
                  Regions in Scope
                </p>
                <p className="mt-1 text-sm text-ink-faint dark:text-slate-400">
                  {activeContinentMeta.shortLabel} / {regionStats.length} regions
                </p>
              </div>
              <button
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm font-semibold transition hover:-translate-y-0.5',
                  activeRegion === 'all'
                    ? 'border-cinnabar/45 bg-cinnabar/10 text-ink dark:border-cinnabar/60 dark:bg-cinnabar/15 dark:text-white'
                    : 'border-line bg-surface/50 text-ink-soft hover:border-cinnabar/30 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/10',
                )}
                data-region-value="all"
                onClick={() => onRegionChange('all')}
                type="button"
              >
                All regions
              </button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {regionStats.map((region) => (
                <button
                  className={cn(
                    'rounded-lg border px-3 py-3 text-left transition hover:-translate-y-0.5',
                    activeRegion === region.region
                      ? 'border-cinnabar/45 bg-cinnabar/10 text-ink dark:border-cinnabar/60 dark:bg-cinnabar/15 dark:text-white'
                      : 'border-line bg-surface/50 text-ink-soft hover:border-cinnabar/30 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/10',
                  )}
                  data-region-value={region.region}
                  key={region.region}
                  onClick={() => onRegionChange(region.region)}
                  type="button"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold">{region.region}</span>
                    {region.choiceCount > 0 && (
                      <span className="shrink-0 rounded bg-cinnabar/12 px-1.5 py-0.5 text-[10px] font-bold uppercase text-cinnabar dark:text-cinnabar-soft">
                        {region.choiceCount} Choice
                      </span>
                    )}
                  </span>
                  <span className="mt-2 block font-mono text-[11px] uppercase text-ink-faint dark:text-slate-400">
                    {region.count} places / {localizeFoodTerm(region.topCuisine, language)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FoodStageMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-surface/62 p-4 text-ink shadow-xl shadow-stone-300/30 backdrop-blur dark:border-white/10 dark:bg-slate-950/58 dark:text-white dark:shadow-black/20">
      <p className="font-mono text-2xl font-black">{value}</p>
      <p className="mt-2 text-xs uppercase text-ink-faint dark:text-slate-300">{label}</p>
    </div>
  )
}

export default function FoodRoutes({ language, route }) {
  if (route === 'food') return <FoodAtlasPage language={language} />
  if (route.startsWith('food/place/')) return <FoodPlacePage language={language} route={route} />
  return <FoodCityPage language={language} route={route} />
}
