import { githubFeaturedRepository } from './githubFeatured'

export const githubShowcase = [
  githubFeaturedRepository,
  {
    slug: 'interactive-lab',
    name: 'ryanbibi-interactive-lab',
    url: 'https://github.com/Ryanbib1/ryanbibi-interactive-lab',
    homepage: 'https://ryanbib1.github.io/ryanbibi-interactive-lab/',
    internalUrl: '#/lab',
    language: 'HTML',
    category: 'creative',
    accent: '#735b91',
    updatedAt: '2026-07-20',
    status: {
      en: 'Live collection',
      zh: '作品集已上线',
    },
    title: {
      en: 'Four browser-native worlds, one curated lab',
      zh: '四个浏览器原生世界，一个完整创作实验室',
    },
    description: {
      en: 'A dependency-free collection of generative light, sound, browser games, and a bilingual product-flow prototype, packaged with responsive demos and GitHub Pages deployment.',
      zh: '一个零运行时依赖的互动作品合集，覆盖生成光影、声景、浏览器游戏和双语产品原型，并配有响应式演示与 GitHub Pages 部署。',
    },
    metrics: [
      {
        value: '4',
        label: { en: 'live works', zh: '个可体验作品' },
      },
      {
        value: '0',
        label: { en: 'runtime dependencies', zh: '运行时依赖' },
      },
      {
        value: '390px',
        label: { en: 'mobile QA', zh: '移动端验证' },
      },
    ],
    highlights: {
      en: [
        'Four self-contained works with no shared runtime dependency.',
        'Real desktop and mobile screenshots with project-level notes.',
        'Automatic static deployment through GitHub Pages.',
      ],
      zh: [
        '四个作品彼此独立，不依赖共享运行时。',
        '包含真实桌面与移动端截图，以及项目级说明。',
        '通过 GitHub Pages 自动完成静态部署。',
      ],
    },
    tags: ['HTML', 'Canvas', 'Web Audio', 'Product Flow'],
  },
  {
    slug: 'kol-screening',
    name: 'kolskill',
    url: 'https://github.com/Ryanbib1/kolskill',
    language: 'Python',
    category: 'automation',
    accent: '#c1432e',
    updatedAt: '2026-07-20',
    status: {
      en: 'Active build',
      zh: '持续迭代',
    },
    title: {
      en: 'Evidence-backed creator operations',
      zh: '证据驱动的 KOL 筛选与投放系统',
    },
    description: {
      en: 'A Codex skill that turns creator discovery, authenticity checks, campaign economics, and post-campaign calibration into one inspectable operating workflow.',
      zh: '一套 Codex Skill，将创作者发现、真实性检查、投放经济模型和投后校准整理为可检查的完整运营流程。',
    },
    metrics: [
      {
        value: '10',
        label: { en: 'workflow scripts', zh: '个工作流脚本' },
      },
      {
        value: '5',
        label: { en: 'scoring dimensions', zh: '项评分维度' },
      },
      {
        value: 'Human',
        label: { en: 'approval gate', zh: '人工审批关口' },
      },
    ],
    highlights: {
      en: [
        'Separates creator fit from authenticity and brand-safety risk.',
        'Builds Google-Sheets-ready shortlists, outreach tracking, and review workspaces.',
        'Connects view quality and conversion assumptions to CPA, ROAS, and break-even scenarios.',
      ],
      zh: [
        '将创作者匹配度与真实性、品牌安全风险分开评估。',
        '生成可直接进入 Google Sheets 的候选表、外联追踪和复盘工作区。',
        '把观看质量与转化假设连接到 CPA、ROAS 和盈亏平衡情景。',
      ],
    },
    tags: ['Python', 'Codex Skill', 'Growth Ops', 'Scoring'],
  },
  {
    slug: 'xuan',
    name: 'xuan',
    url: 'https://github.com/Ryanbib1/xuan',
    homepage: 'https://xuan-psi.vercel.app',
    internalUrl: '#/lab/xuan',
    language: 'HTML',
    category: 'creative',
    accent: '#2b2b2b',
    updatedAt: '2026-06-28',
    status: {
      en: 'Live deployment',
      zh: '线上可体验',
    },
    title: {
      en: 'A serverless interactive experience',
      zh: '前后端一体的交互式「玄」体验',
    },
    description: {
      en: 'A compact frontend and serverless API project with a live Vercel deployment, graceful fallback behavior, and a clear path from local prototype to public product.',
      zh: '一个包含前端、Serverless API 与 Vercel 线上版本的紧凑项目，并为本地体验、异常降级和公开产品化保留清晰路径。',
    },
    metrics: [
      {
        value: 'Live',
        label: { en: 'Vercel experience', zh: 'Vercel 体验' },
      },
      {
        value: 'API',
        label: { en: 'serverless layer', zh: 'Serverless 层' },
      },
      {
        value: 'Fallback',
        label: { en: 'local mode', zh: '本地降级模式' },
      },
    ],
    highlights: {
      en: [
        'Combines a standalone frontend with a serverless API route.',
        'Keeps service credentials on the server in the deployed path.',
        'Retains an explicit fallback for local and offline-friendly experimentation.',
      ],
      zh: [
        '将独立前端与 Serverless API 路由组合在同一项目中。',
        '部署版本将服务密钥保留在服务器端。',
        '为本地和离线友好的实验保留明确降级路径。',
      ],
    },
    tags: ['HTML', 'Serverless', 'Vercel', 'Interactive'],
  },
]
