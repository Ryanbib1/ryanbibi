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
    tagline: 'Flowing light, traced by the cursor.',
    blurb:
      'An interactive canvas where ribbons of light follow your motion and fade like long-exposure trails.',
    year: '2025',
    status: 'live',
    type: 'embed',
    embed: '/works/liuguang/index.html',
    accent: '#6aa0ff',
    tags: ['Canvas', 'Motion', 'Generative'],
  },
  {
    slug: 'arcade',
    title: '赛博街机',
    en: 'Cyber Arcade',
    tagline: 'Four game loops, one neon cabinet.',
    blurb:
      'A self-contained browser arcade with four playable game loops, local records, keyboard input, and dedicated mobile controls.',
    year: '2025',
    status: 'live',
    type: 'embed',
    embed: '/works/arcade/index.html',
    accent: '#ff3b6b',
    tags: ['Canvas', 'Game Systems', 'Touch'],
  },
  {
    slug: 'game-night-invite',
    title: '今晚开黑吗？',
    en: 'Game Night Invite',
    tagline: 'One question, one link, one clear answer.',
    blurb:
      'A cute bilingual invite flow that turns a multi-step gaming plan into one shareable question and a lightweight response dashboard.',
    year: '2026',
    status: 'live',
    type: 'component',
    poster: '/works/game-night-invite/cozy-gaming-room.png',
    accent: '#ef8fb6',
    tags: ['React', 'Express API', 'Product Flow'],
  },
  {
    slug: 'xuan',
    title: '玄',
    en: 'Xuán',
    tagline: 'Generative ink in motion.',
    blurb: 'A meditation on black — generative flow fields rendered as living calligraphy.',
    year: '2025',
    status: 'live',
    type: 'embed',
    embed: '/works/xuan/index.html',
    accent: '#2b2b2b',
    tags: ['Generative', 'Ink'],
  },
  {
    slug: 'sheng',
    title: '声',
    en: 'Shēng',
    tagline: 'See sound, hear color.',
    blurb: 'An audio-reactive visualizer that turns microphone or track input into living shapes.',
    year: '2025',
    status: 'live',
    type: 'embed',
    embed: '/works/sheng/index.html',
    accent: '#36c9b8',
    tags: ['Audio', 'Visualizer'],
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
