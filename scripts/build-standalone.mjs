import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distIndexPath = path.join(root, 'dist', 'index.html')
const distIndex = await readFile(distIndexPath, 'utf8')

const scriptMatch = distIndex.match(/<script type="module" crossorigin src="\.\/assets\/([^"]+)"><\/script>/)
const styleMatch = distIndex.match(/<link rel="stylesheet" crossorigin href="\.\/assets\/([^"]+)">/)

if (!scriptMatch || !styleMatch) {
  throw new Error('Could not find the built JavaScript or stylesheet in dist/index.html.')
}

let javascript = await readFile(path.join(root, 'dist', 'assets', scriptMatch[1]), 'utf8')
let stylesheet = await readFile(path.join(root, 'dist', 'assets', styleMatch[1]), 'utf8')

javascript = javascript
  .replace(/import\(`\.\/([^`]+\.js)`\)/g, (_match, file) => `import(\`./dist/assets/${file}\`)`)
  .replaceAll('./rb', './dist/rb')
  .replaceAll('./ink', './dist/ink')
  .replaceAll('./panda', './dist/panda')
  .replaceAll('./mascots', './dist/mascots')
  .replaceAll('./food/', './dist/food/')
  .replaceAll('./works', './dist/works')
  .replaceAll('`/works/', '`./dist/works/')
  .replaceAll('"/works/', '"./dist/works/')
  .replaceAll("'/works/", "'./dist/works/")
  .replace(/<\/script/gi, '<\\/script')

stylesheet = stylesheet.replaceAll('url(../', 'url(./dist/')

const redirectScript = /\s*<script>\s*if \(\s*window\.location\.protocol === 'file:'[\s\S]*?<\/script>/
const standalone = distIndex
  .replace(redirectScript, '')
  .replace('./favicon.svg', './dist/favicon.svg')
  .replace(scriptMatch[0], () => `<script type="module">\n${javascript}\n</script>`)
  .replace(styleMatch[0], () => `<style>\n${stylesheet}\n</style>`)

await writeFile(path.join(root, 'standalone.html'), standalone)
console.log(`Wrote standalone.html from ${scriptMatch[1]} and ${styleMatch[1]}.`)
