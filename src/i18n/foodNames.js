const restaurantEnglishNames = {
  '0001-uluh': 'uluh',
  '0042-restaurant': 'Chongqing Lao Zao Hotpot',
  '0298-union-oyster-house': 'Union Oyster House',
  '0372-eleven': 'Eleven',
  '0510-huantai-canteen': 'Huantai Building Canteen',
  '0511-pho-the-one': 'Pho the One',
  '0512-ant-chongqing-noodles': 'Ant Chongqing Pea Noodles',
  '0513-er-ge-chao-ji': 'Erge Fried Chicken',
  '0514-lao-xiang-ji': 'Lao Xiang Ji',
  '0515-low-fat-hainanese-chicken-rice': 'Low-Fat Hainanese Chicken Rice',
  '0516-mulan-ningxia-lamb': 'Mulan Ningxia Lamb',
  '0517-shu-xia': 'Shuxia',
  '0518-shan-xi-handmade': 'Shanxi Handmade',
  '0519-supermodel-kitchen': 'Supermodel Kitchen',
  '0520-tianqiao-luzhu': 'Tianqiao Luzhu',
  '0521-mi-chongshan-hotpot': 'Mi Chongshan Chongqing Hotpot',
  '0522-siye': 'Siye',
  '0523-zhuye': 'Zhuye Tea',
  '0524-guangzhou-shunde-restaurant': 'Guangzhou Shunde Restaurant',
  '0525-grid-coffee': 'grid coffee',
  '0526-richang-restaurant': 'Richa Restaurant',
}

const areaEnglishNames = {
  '丰台区': 'Fengtai District',
  '海淀区': 'Haidian District',
  '成都': 'Chengdu',
  '厦门': 'Xiamen',
}

export function getRestaurantDisplayName(place, language) {
  if (!place || language === 'zh') return place?.name || ''
  return restaurantEnglishNames[place.id] || place.name
}

export function getFoodAreaDisplayName(area, language) {
  if (!area || language === 'zh') return area || ''
  return areaEnglishNames[area] || area
}
