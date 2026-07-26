import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const buildOnlyExclusions = [
  'mascots',
  'ink-bamboo-art.jpg',
  'data/restaurants.js',
  'data/worldMap.js',
]

await Promise.all(
  buildOnlyExclusions.map((entry) =>
    rm(resolve('dist', entry), { force: true, recursive: true }),
  ),
)

console.log(`Pruned ${buildOnlyExclusions.length} source-only asset groups from dist.`)
