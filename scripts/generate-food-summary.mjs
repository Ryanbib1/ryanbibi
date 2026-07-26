import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inputPath = path.join(root, 'src/data/restaurants.json')
const outputPath = path.join(root, 'src/data/foodSummary.json')
const restaurants = JSON.parse(await fs.readFile(inputPath, 'utf8'))

const categoryRules = [
  [/(自助|buffet)/i, '自助'], [/主题餐厅/, '主题餐厅'], [/(烤肉|泥炉|bbq|烧烤)/i, '烧烤'],
  [/(中东|土耳其|叙利亚|清真)/, '中东'], [/(甜品|饮品|咖啡|coffee|甜甜圈|刨冰|松饼|舒芙蕾|brunch|早午餐|matcha|bakery|面包)/i, '甜品饮品'],
  [/海鲜/, '海鲜'], [/(越南|泰餐|印尼|东南亚)/, '东南亚'], [/(意餐|意大利|比萨|披萨|pizza)/i, '意餐'],
  [/(日料|日本|ramen|寿司|拉面)/i, '日料'], [/韩/, '韩餐'], [/(美式|美国)/, '美式'],
  [/(简餐|快餐|轻食|沙拉|食堂|美食广场|虾饭)/, '快餐简餐'], [/(欧洲|地中海|德国|法餐|俄餐|西式|西餐|精酿|tapas|小酒馆)/i, '西餐'],
  [/(中餐|中国|私房菜|火锅|川菜|粤菜|本帮)/, '中餐'],
]

function categoryFor(place) {
  const text = `${place.cuisineGroup || ''} ${place.cuisine || ''}`
  return categoryRules.find(([pattern]) => pattern.test(text))?.[1] || '其他'
}

function compact(place) {
  return {
    id: place.id,
    name: place.name,
    region: place.region,
    area: place.area,
    cuisine: place.cuisine,
    cuisineGroup: place.cuisineGroup,
    curatorNote: place.curatorNote,
    coordinates: place.coordinates,
    visitedAt: place.visitedAt,
    category: categoryFor(place),
  }
}

const featuredIds = ['0001-uluh', '0042-restaurant', '0372-eleven', '0298-union-oyster-house']
const dated = restaurants
  .filter((place) => /^\d{4}-\d{2}-\d{2}$/.test(place.visitedAt || ''))
  .sort((a, b) => b.visitedAt.localeCompare(a.visitedAt))
const cutoff = new Date()
cutoff.setDate(cutoff.getDate() - 30)
cutoff.setHours(0, 0, 0, 0)
const current = dated.filter((place) => new Date(`${place.visitedAt}T12:00:00`) >= cutoff)

const summary = {
  total: restaurants.length,
  choiceCount: restaurants.filter((place) => place.choice).length,
  featuredChoices: featuredIds.map((id) => restaurants.find((place) => place.id === id)).filter(Boolean).map(compact),
  restaurantPins: restaurants.filter((place) => place.choice).slice(0, 2).map(compact),
  recentTastingLog: {
    current: current.length > 0,
    latestDate: dated[0]?.visitedAt || null,
    places: (current.length ? current : dated).slice(0, 6).map(compact),
  },
}

await fs.writeFile(outputPath, `${JSON.stringify(summary, null, 2)}\n`)
console.log(`Wrote ${path.relative(root, outputPath)} (${summary.total} places summarized).`)
