export const connectedProjects = [
  {
    "slug": "livematch",
    "title": "周末同行",
    "en": "LiveMatch",
    "access": "public",
    "kind": {
      "en": "Group planning",
      "zh": "一起选活动"
    },
    "tagline": {
      "en": "Turn a group invitation into a shared decision.",
      "zh": "从邀请、投票到敲定周末活动。"
    },
    "blurb": {
      "en": "Shared voting, participation progress and a final itinerary in the original full-stack application.",
      "zh": "原版全栈应用支持共享投票、参与进度与最终行程。"
    },
    "interaction": {
      "en": "Open the public homepage to start or join a plan. No private invitation is linked here.",
      "zh": "打开公开首页发起或加入计划；此处不链接私人邀请。"
    },
    "availability": {
      "en": "The original application is hosted separately. Its data and sign-in follow that site’s rules.",
      "zh": "原应用独立托管，数据与登录遵循该站点的规则。"
    },
    "tags": [
      "Voting",
      "Full stack"
    ],
    "group": "projects",
    "year": "2026",
    "status": "catalog",
    "type": "project",
    "accent": "#53766a",
    "url": "https://livematch-weekend-club.wangziyanryan0816.chatgpt.site/"
  },
  {
    "slug": "f1-race-lab",
    "title": "比赛策略实验室",
    "en": "F1 Race Lab",
    "access": "local",
    "kind": {
      "en": "Race analysis",
      "zh": "赛事分析"
    },
    "tagline": {
      "en": "Change a pit stop. Compare the race.",
      "zh": "改一次进站，对照整场比赛。"
    },
    "blurb": {
      "en": "Original historical race snapshots, synchronized lap charts and strategy experiments for Monza and Abu Dhabi.",
      "zh": "复用蒙扎与阿布扎比历史快照、同步圈速图和策略实验原版。"
    },
    "interaction": {
      "en": "Explore the race guide, adjust a pit lap, then restore the observed strategy.",
      "zh": "先读比赛导读，再调整进站圈，最后还原真实策略。"
    },
    "availability": {
      "en": "An analysis prototype, not Pit Wall Panic. Simulation assumptions are not race predictions. Photos and attribution stay in the local original; they are not bundled with this site.",
      "zh": "这是分析原型，与 Pit Wall Panic 游戏不同。模拟假设不等于比赛预测；照片及署名留在本地原版，不打包进主站。"
    },
    "tags": [
      "Race data",
      "Simulation"
    ],
    "group": "projects",
    "year": "2026",
    "status": "catalog",
    "type": "project",
    "accent": "#53766a"
  },
  {
    "slug": "splitfair",
    "title": "旅行分账",
    "en": "SplitFair",
    "access": "local",
    "kind": {
      "en": "Travel ledger",
      "zh": "旅行账本"
    },
    "tagline": {
      "en": "Follow shared expenses through refunds and settlement.",
      "zh": "从共同花费，一直核对到退款与结算。"
    },
    "blurb": {
      "en": "The original ledger records advances, repayments, refunds, budgets and settlement reviews.",
      "zh": "原版账本记录垫付、还款、退款、预算及结算核对。"
    },
    "interaction": {
      "en": "Try the editable example, inspect an amount’s source, then create your own trip.",
      "zh": "试用可编辑示例，查看金额来源，再创建自己的旅行。"
    },
    "availability": {
      "en": "Data stays in the current browser. This is bookkeeping, not a payment service. No personal ledger is included in this overview.",
      "zh": "数据保存在当前浏览器，不提供支付。此介绍页不包含个人账本。"
    },
    "tags": [
      "Local storage",
      "Settlement"
    ],
    "group": "projects",
    "year": "2026",
    "status": "catalog",
    "type": "project",
    "accent": "#53766a"
  },
  {
    "slug": "trip-evidence",
    "title": "旅行凭证台",
    "en": "Trip Evidence",
    "access": "service",
    "kind": {
      "en": "Evidence workspace",
      "zh": "凭证工作台"
    },
    "tagline": {
      "en": "Trace an itinerary back to the original evidence.",
      "zh": "让行程的每条信息，都能找回原件。"
    },
    "blurb": {
      "en": "Original local-first workspace for text, PDF and email evidence, conflicts, manual notes and itinerary exports.",
      "zh": "原版本地工作台整理文本、PDF 与邮件凭证，核对冲突、补充备注并导出行程。"
    },
    "interaction": {
      "en": "Import sources, compare conflicting fields and follow page or line citations.",
      "zh": "导入资料，对照冲突字段，并跟随页码或行号查回原文。"
    },
    "availability": {
      "en": "Requires its original local Python parser for PDF and email imports. No hosted demo is verified here; personal receipts and test files are not included.",
      "zh": "PDF 与邮件导入依赖原版本地 Python 解析服务。此处尚未核实公开演示；不包含私人凭证或测试文件。"
    },
    "tags": [
      "PDF",
      "Evidence"
    ],
    "group": "projects",
    "year": "2026",
    "status": "catalog",
    "type": "project",
    "accent": "#53766a"
  },
  {
    "slug": "seatcompare",
    "title": "机票舱位对比",
    "en": "SeatCompare",
    "access": "extension",
    "kind": {
      "en": "Browser extension",
      "zh": "浏览器扩展"
    },
    "tagline": {
      "en": "Compare the fare you actually need to pay.",
      "zh": "比较真正需要支付的机票总价。"
    },
    "blurb": {
      "en": "Original Chrome extension compares quotes, baggage and seat fees, fare terms, and saved decision snapshots.",
      "zh": "原版 Chrome 扩展对照报价、托运选座费用、退改条件与决策快照。"
    },
    "interaction": {
      "en": "Check fee assumptions, compare two quotes and record a provisional choice.",
      "zh": "核对附加费依据，对比两份报价，再记录暂选方案。"
    },
    "availability": {
      "en": "Runs as a locally installed Chrome extension and uses chrome.storage. It is not an ordinary embedded webpage and does not book or pay for tickets.",
      "zh": "需本地安装 Chrome 扩展，依赖 chrome.storage；不是可直接嵌入的网页，也不订票或付款。"
    },
    "tags": [
      "Chrome",
      "Fare comparison"
    ],
    "group": "projects",
    "year": "2026",
    "status": "catalog",
    "type": "project",
    "accent": "#53766a"
  },
  {
    "slug": "pit-wall-panic",
    "title": "围场指挥",
    "en": "Pit Wall Panic",
    "access": "local",
    "kind": {
      "en": "Strategy game",
      "zh": "策略游戏"
    },
    "tagline": {
      "en": "Twelve laps. Tires, weather and one more decision.",
      "zh": "十二圈，在轮胎、天气和决策之间冲线。"
    },
    "blurb": {
      "en": "Original standalone strategy game with team selection, tire wear, pit calls, energy and race debriefs.",
      "zh": "原版独立策略游戏：选择车队，管理胎耗、进站与能量，赛后查看复盘。"
    },
    "interaction": {
      "en": "Enter race control, make a lap decision, then replay the same scenario.",
      "zh": "进入指挥席，逐圈决策，结束后重赛同一场景。"
    },
    "availability": {
      "en": "A separate game from F1 Race Lab. The original includes third-party driver photos and team marks, so this page provides an overview only; those assets are not published here.",
      "zh": "与 F1 Race Lab 是不同作品。原版包含第三方车手照片和车队标识，此处仅展示作品介绍；不发布这些素材。"
    },
    "tags": [
      "Game",
      "Race strategy"
    ],
    "group": "projects",
    "year": "2026",
    "status": "catalog",
    "type": "project",
    "accent": "#53766a"
  }
]

export function projectAccessLabel(work, language) {
  const zh = language === 'zh'
  return { public: zh ? '公开应用' : 'Public app', local: zh ? '本地原版' : 'Local original', service: zh ? '需本地服务' : 'Local service required', extension: zh ? 'Chrome 扩展' : 'Chrome extension' }[work.access]
}
