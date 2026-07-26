import { enToZh } from './translations'

let activeLanguage = 'en'
const languageKey = '__RYANBIBI_LANGUAGE__'

const translatableProps = new Set([
  'alt',
  'aria-label',
  'description',
  'empty',
  'kicker',
  'label',
  'placeholder',
  'subtitle',
  'text',
  'title',
])

export function setI18nLanguage(language) {
  activeLanguage = language === 'zh' ? 'zh' : 'en'
  globalThis[languageKey] = activeLanguage
}

function getActiveLanguage() {
  return globalThis[languageKey] || activeLanguage
}

export function translate(value, language = getActiveLanguage()) {
  if (language !== 'zh' || typeof value !== 'string') return value

  const leading = value.match(/^\s*/)?.[0] || ''
  const trailing = value.match(/\s*$/)?.[0] || ''
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) return value

  const translated = enToZh[normalized]
  return translated ? `${leading}${translated}${trailing}` : value
}

function translateChildren(children) {
  if (typeof children === 'string') return translate(children)
  if (Array.isArray(children)) return children.map(translateChildren)
  return children
}

export function translateJsxProps(props) {
  if (getActiveLanguage() !== 'zh' || !props) return props

  let changed = false
  const next = { ...props }

  if ('children' in next) {
    const children = translateChildren(next.children)
    if (children !== next.children) {
      next.children = children
      changed = true
    }
  }

  for (const key of translatableProps) {
    if (typeof next[key] !== 'string') continue
    const value = translate(next[key])
    if (value !== next[key]) {
      next[key] = value
      changed = true
    }
  }

  return changed ? next : props
}
