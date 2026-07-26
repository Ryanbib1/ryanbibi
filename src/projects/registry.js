// ── Works / sub-project registry ───────────────────────────────────────────
// Add a new work = append one entry here. Nothing else is required for it to
// show up in the /lab index.
//
// HOW EACH WORK IS RENDERED (the `type` field):
//   'component' → a React component in src/projects/<Slug>.jsx, registered in
//                 src/projects/components.js. Best for works that ARE React.
//   'embed'     → a standalone built web app (any stack: vanilla / p5 / three /
//                 its own bundler). Drop its build output into
//                 public/works/<slug>/ (with an index.html). The detail page
//                 loads it in a full-bleed <iframe> — fully isolated, so its
//                 JS / CSS / globals never touch the ink-wash site.
//   'external'  → hosted elsewhere; `url` opens in a new tab.
//
// status:
//   'live'    → ready; the card links straight into the experience
//   'wip'     → in progress; opens a "building" detail page
//   'concept' → placeholder; shown on the index, not clickable-through

export const works = [
  {
    slug: 'liuguang',
    title: '流光',
    en: 'Liúguāng',
    tagline: {
      en: 'Eleven generative scenes shaped by cursor, touch, and type.',
      zh: '由光、风与指尖共同生成的十一幕互动场景。',
    },
    blurb: {
      en: 'A browser-native series where motion becomes flowing light, ripples, particles, and ink.',
      zh: '浏览器原生生成艺术：让动作化为流光、涟漪、粒子与墨迹。',
    },
    interaction: {
      en: 'Move the cursor or swipe to disturb the field.',
      zh: '移动鼠标或滑动屏幕，让画面产生变化。',
    },
    kind: { en: 'Generative canvas', zh: '生成式画布' },
    group: 'signature',
    year: '2025',
    status: 'live',
    type: 'embed',
    embed: '/works/liuguang/index.html',
    poster: '/works/liuguang/cover.jpg',
    accent: '#6aa0ff',
    tags: ['Canvas', 'Motion', 'Generative'],
  },
  {
    slug: 'xuan',
    title: '玄',
    en: 'Xuán',
    tagline: {
      en: 'Traditional divination systems inside a living ink interface.',
      zh: '把传统术数放进一层会呼吸的数字水墨里。',
    },
    blurb: {
      en: 'Daily lots, almanac, tarot, I Ching, and BaZi share one generative smoke-and-light interface.',
      zh: '每日一签、黄历、塔罗、周易与八字共存于一套生成式烟墨界面。',
    },
    interaction: {
      en: 'Choose a method, enter a name or question, then draw.',
      zh: '选择一种方式，留下名字或问题，再凝神抽取结果。',
    },
    kind: { en: 'Generative ritual', zh: '生成式仪式' },
    group: 'signature',
    year: '2025',
    status: 'live',
    type: 'embed',
    embed: '/works/xuan/index.html',
    poster: '/works/xuan/cover.jpg',
    accent: '#b5302b',
    tags: ['Generative', 'WebGL', 'Ink'],
  },
  {
    slug: 'sheng',
    title: '声',
    en: 'Shēng',
    tagline: {
      en: 'A code-synthesized soundscape mixer for focus, rest, and sleep.',
      zh: '为专注、休息与睡眠而生的代码合成声景。',
    },
    blurb: {
      en: 'Seventeen ambient layers, visual scenes, breathing guidance, and focus tools form a calm browser instrument.',
      zh: '十七层实时声景、动态画面、呼吸引导与专注工具组成一件浏览器乐器。',
    },
    interaction: {
      en: 'Wear headphones, then combine layers or start a focus timer.',
      zh: '戴上耳机，自由叠加声景或开启一段专注计时。',
    },
    kind: { en: 'Generative audio', zh: '生成式声音' },
    group: 'signature',
    year: '2025',
    status: 'live',
    type: 'embed',
    embed: '/works/sheng/index.html',
    poster: '/works/sheng/cover.jpg',
    accent: '#36c9b8',
    tags: ['Web Audio', 'Soundscape', 'Focus'],
  },
  {
    slug: 'arcade',
    title: '赛博街机',
    en: 'Cyber Arcade',
    tagline: {
      en: 'Four playable loops inside one neon cabinet.',
      zh: '一台霓虹机柜，装下四种完整玩法。',
    },
    blurb: {
      en: 'Four game systems with local records, keyboard input, and dedicated touch controls.',
      zh: '四种游戏机制，配有本地纪录、键盘输入与独立触控操作。',
    },
    interaction: {
      en: 'Use arrow keys on desktop or the touch controls on mobile.',
      zh: '电脑端使用方向键，移动端使用屏幕控制器。',
    },
    kind: { en: 'Browser games', zh: '浏览器游戏' },
    group: 'play',
    year: '2025',
    status: 'live',
    type: 'embed',
    embed: '/works/arcade/index.html',
    poster: '/works/arcade/cover.jpg',
    accent: '#ff3b6b',
    tags: ['Canvas', 'Game Systems', 'Touch'],
  },
  {
    slug: 'game-night-invite',
    title: '今晚开黑吗？',
    en: 'Game Night Invite',
    tagline: {
      en: 'A product case study about turning plans into one clear answer.',
      zh: '把模糊约局收束成一个明确回答的产品案例。',
    },
    blurb: {
      en: 'A bilingual invitation flow built around one human question: are we playing tonight?',
      zh: '一套围绕“今晚开黑吗”设计的双语邀请流程。',
    },
    interaction: {
      en: 'Read the flow, interface decisions, and system architecture.',
      zh: '查看交互流程、界面决策与系统结构。',
    },
    kind: { en: 'Product case study', zh: '产品案例' },
    group: 'play',
    year: '2026',
    status: 'live',
    type: 'component',
    poster: '/works/game-night-invite/cozy-gaming-room.png',
    accent: '#ef8fb6',
    tags: ['React', 'Express API', 'Product Flow'],
  },
]

export function findWork(slug) {
  return works.find((work) => work.slug === slug)
}

export const STATUS_LABEL = {
  live: 'Live',
  wip: 'In progress',
  concept: 'Concept',
}
