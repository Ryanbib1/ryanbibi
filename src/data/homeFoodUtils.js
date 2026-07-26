export function slugifyRegion(region) {
  return String(region)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const choiceMemoryEnglish = {
  '0001-uluh':
    'A table full of memories with Ruby, Alice, and friends. Order the crab roe tofu and braised pork trotters.',
  '0042-restaurant':
    'My New York hotpot GOAT: generous portions, fair prices, and a ya-cai fried rice worth ordering every time.',
  '0372-eleven':
    'My closing dinner in Pittsburgh, and a quiet summary of the previous two years. The seafood tasting and braised short rib both delivered.',
  '0298-union-oyster-house':
    'Part of a Boston drinking-and-dining trip with Frank. Fresh oysters, excellent lobster, and a seafood platter made for sharing.',
}

const tagTranslations = {
  'meaning first': '意义优先',
  'people memory': '人物记忆',
  'order note': '必点笔记',
  'time capsule': '时光胶囊',
}

const cuisineEnglish = {
  '中餐': 'Chinese',
  '美式/西餐': 'American & Western',
}

export function getChoiceMemoryTags(place, language = 'en') {
  const note = place.curatorNote || ''
  const tags = []
  if (/goat/i.test(note)) tags.push('GOAT')
  if (/意义远超/.test(note)) tags.push('meaning first')
  if (/friend|friends|Ruby|Alice|Frank|兄弟|同尘|乐洋|朋友/i.test(note)) tags.push('people memory')
  if (/主推|必须点|推荐/.test(note)) tags.push('order note')
  if (/高中|第一次|收尾|离开|生日|梦开始/.test(note)) tags.push('time capsule')
  if (!tags.length) tags.push(language === 'en' ? cuisineEnglish[place.cuisineGroup] || place.cuisineGroup : place.cuisineGroup)
  return tags.slice(0, 3).map((tag) => (language === 'zh' ? tagTranslations[tag] || tag : tag))
}

export function getChoiceMemoryLead(place, language = 'en') {
  if (language === 'en' && choiceMemoryEnglish[place.id]) return choiceMemoryEnglish[place.id]
  const note = place.curatorNote || 'A Ryanbibi Choice memory waiting for a fuller story.'
  return note.length > 132 ? `${note.slice(0, 128).trim()}...` : note
}
