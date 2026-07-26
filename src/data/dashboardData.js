export const allocationData = [
  {
    name: 'Investments',
    slug: 'stocks',
    value: 65,
    color: '#c1432e',
    role: 'Growth layer',
    updateSource: 'Investment account snapshot',
    description:
      'Investment account allocation tracked as a percentage of the vault, with holdings kept privacy-first.',
  },
  {
    name: 'Savings',
    slug: 'savings',
    value: 25,
    color: '#8a8378',
    role: 'Liquidity layer',
    updateSource: 'Savings account snapshot',
    description:
      'Cash reserve for near-term needs, quick transfers, and optional opportunities.',
  },
  {
    name: 'CD',
    slug: 'term-deposit',
    value: 10,
    color: '#c9bda3',
    role: 'Stability layer',
    updateSource: 'CD account snapshot',
    description:
      'Certificate-of-deposit allocation for lower-volatility stability inside the vault.',
  },
]

export const portfolioWatch = [
  { label: 'DRAM', value: 42.88, color: 'bg-cinnabar', business: 'Roundhill Memory ETF focused on the memory semiconductor theme.' },
  { label: 'NVDA', value: 5.99, color: 'bg-stone-700', business: 'AI GPUs, accelerated computing platforms, data center chips, and software.' },
  { label: 'GOOGL', value: 5.22, color: 'bg-stone-600', business: 'Search, YouTube, advertising, Android, cloud, and AI products.' },
  { label: 'MRVU', value: 5.16, color: 'bg-stone-500', business: 'Direxion daily 2x bullish ETF tied to Marvell Technology.' },
  { label: 'MRVL', value: 5.15, color: 'bg-stone-600', business: 'Data infrastructure semiconductors for networking, storage, cloud, and AI.' },
  { label: 'NOK', value: 2.85, color: 'bg-stone-500', business: 'Telecom network equipment, 5G infrastructure, and network software.' },
  { label: 'VOO', value: 2.68, color: 'bg-stone-400', business: 'Vanguard ETF tracking broad S&P 500 large-cap US equity exposure.' },
  { label: 'AVGO', value: 2.33, color: 'bg-stone-500', business: 'Semiconductors and infrastructure software for networking, broadband, and AI.' },
  { label: 'AMD', value: 2.32, color: 'bg-stone-600', business: 'CPUs, GPUs, adaptive chips, and data center accelerators.' },
  { label: 'MUU', value: 2.32, color: 'bg-stone-400', business: 'Direxion daily 2x bullish ETF tied to Micron Technology.' },
  { label: 'ARM', value: 2.21, color: 'bg-stone-500', business: 'CPU architecture and chip IP licensed across mobile, cloud, and edge devices.' },
  { label: 'SMH', value: 2.13, color: 'bg-stone-600', business: 'VanEck Semiconductor ETF for broad chip-sector exposure.' },
  { label: 'Other', value: 18.75, color: 'bg-stone-300', business: '22 smaller positions, each below 2% of the investment account.' },
]

export const portfolioAnalystLens = [
  { label: 'Portfolio posture', value: 'High-beta offense', note: 'This sleeve reads like an AI infrastructure and semiconductor cycle book, not a balanced core portfolio.' },
  { label: 'Concentration driver', value: 'DRAM 42.88%', note: 'The largest position makes memory semiconductors the main swing factor for the investment account.' },
  { label: 'Volatility engine', value: 'MRVU + MUU', note: 'Daily 2x ETFs can magnify both rallies and drawdowns, especially through choppy sideways markets.' },
  { label: 'Young investor fit', value: 'Growth first', note: 'The aggressive profile can be intentional while the real discipline is knowing the thesis, drawdown range, and exit rules.' },
]

export const portfolioWatchlist = [
  'AI capex momentum and data-center GPU demand',
  'Memory pricing cycle and DRAM/NAND supply discipline',
  'Semiconductor earnings revisions and valuation compression',
  'Leveraged ETF path dependency during volatile sideways markets',
]

export const chaseReport = {
  source: 'Imported investment positions',
  status: 'Major holdings normalized by portfolio weight',
  parser: 'Last reviewed · July 2026',
  note: 'Positions at or above 2% are listed individually. Smaller positions are grouped into Other, and exact account values stay private.',
}

export const macros = [
  { label: 'Protein', value: 32, color: 'bg-cinnabar' },
  { label: 'Carbs', value: 48, color: 'bg-stone-500' },
  { label: 'Fats', value: 20, color: 'bg-stone-400' },
]

export const recoveryData = [
  { day: 'Mon', recovery: 71 },
  { day: 'Tue', recovery: 78 },
  { day: 'Wed', recovery: 64 },
  { day: 'Thu', recovery: 82 },
  { day: 'Fri', recovery: 86 },
  { day: 'Sat', recovery: 74 },
  { day: 'Sun', recovery: 80 },
]

export const gamingRotation = [
  { title: 'Valorant', server: 'NA', handle: 'Ryanbibi#bib1', meta: 'precision reps', value: 86 },
  { title: 'Escape from Tarkov', server: 'TBD', handle: 'ID to add later', meta: 'tactical patience', value: 72 },
  { title: 'Overwatch', server: 'Global', handle: 'BiboRyan#1489', meta: 'team tempo', value: 64 },
]

export const musicQueue = [
  { title: 'Ditto', artist: 'NewJeans', progress: 68 },
  { title: 'Bubble Gum', artist: 'NewJeans', progress: 42 },
]

export const spotifyProfile = {
  username: 'Ryanbib1',
  url: 'https://open.spotify.com/user/31unqz7dwbqpiwmiyorxhp22sk3y',
  modules: [
    { label: 'Public playlists', value: 74 },
    { label: 'Listening chart', value: 68 },
    { label: 'Recent rotation', value: 82 },
  ],
}

export const gearLoadout = ["Arc'teryx Konseal", 'Salomon', 'Black Diamond']
