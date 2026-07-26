export const githubProfile = {
  handle: 'Ryanbib1',
  url: 'https://github.com/Ryanbib1',
  publicRepoCount: 42,
  curatedAt: '2026-07-26',
  focus: {
    en: ['AI products', 'Data systems', 'Automation', 'Creative web'],
    zh: ['AI 产品', '数据系统', '自动化', '创意网页'],
  },
}

export const githubFeaturedRepository = {
  slug: 'signal-feedback-intelligence',
  name: 'AI-Feedback-Intelligence',
  url: 'https://github.com/Ryanbib1/AI-Feedback-Intelligence',
  internalUrl: '#/portfolio/signal-feedback-intelligence',
  language: 'Python',
  category: 'ai-data',
  accent: '#7c3aed',
  updatedAt: '2026-07-14',
  status: {
    en: 'Case study ready',
    zh: '案例已整理',
  },
  title: {
    en: 'Traceable feedback intelligence',
    zh: '可追溯的用户反馈智能系统',
  },
  description: {
    en: 'A reproducible product-feedback pipeline that turns CSV comments into ranked themes, visible scoring logic, and source-linked evidence without requiring an API key.',
    zh: '一套可复现的产品反馈流程，把 CSV 评论转化为主题排序、透明评分逻辑与来源证据，并可在无需 API Key 的情况下完整运行。',
  },
  metrics: [
    {
      value: '23',
      label: { en: 'automated tests', zh: '项自动化测试' },
    },
    {
      value: '50',
      label: { en: 'evaluation cases', zh: '条评估样本' },
    },
    {
      value: '0',
      label: { en: 'keys required', zh: '必需 API Key' },
    },
  ],
  highlights: {
    en: [
      'Keeps semantic extraction separate from deterministic ranking.',
      'Preserves source-level evidence and allows human theme correction.',
      'Includes SQLite persistence, exports, and a constrained dataset-question agent.',
    ],
    zh: [
      '将语义提取与确定性排序分开，模型不会直接拥有优先级分数。',
      '保留来源级证据，并支持人工修正主题。',
      '包含 SQLite 持久化、导出和受约束的数据集问答 Agent。',
    ],
  },
  tags: ['Python', 'Streamlit', 'Pandas', 'SQLite'],
}
