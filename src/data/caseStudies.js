export const professionalCaseStudies = [
  {
    slug: 'signal-feedback-intelligence',
    company: 'Signal',
    status: 'active',
    accent: '#7c3aed',
    role: {
      en: 'Independent Builder / Product & AI Engineering',
      zh: '独立开发 / 产品与 AI 工程',
    },
    period: {
      en: 'Jul 2026 - Present',
      zh: '2026 年 7 月 - 至今',
    },
    location: {
      en: 'Personal project',
      zh: '个人项目',
    },
    metaLabel: {
      en: 'Project type',
      zh: '项目类型',
    },
    headline: {
      en: 'Turning scattered product feedback into ranked, traceable product decisions.',
      zh: '把分散的产品反馈转化为可排序、可追溯的产品决策信号。',
    },
    context: {
      en: 'Signal is a reproducible feedback-intelligence demo that turns uploaded CSV comments into structured pain points, recurring themes, transparent priority scores, and source-linked evidence. Its complete deterministic workflow runs without an API key; model-backed extraction remains optional.',
      zh: 'Signal 是一个可复现的反馈分析演示工具：它把上传的 CSV 评论转化为结构化痛点、重复主题、透明的优先级分数和可追溯的原始证据。完整的确定性流程无需 API Key，模型提取为可选能力。',
    },
    challenge: {
      en: 'Reduce the manual work between scattered public comments and a prioritized problem map without allowing opaque AI output to control rankings or break evidence traceability.',
      zh: '减少从分散公开评论到优先级问题地图之间的人工工作，同时避免让不透明的 AI 输出控制排序或切断证据追溯。',
    },
    workflow: [
      {
        title: { en: 'Collect', zh: '收集' },
        detail: {
          en: 'Keep data acquisition separate from analysis: Codex can collect accessible public comments, preserve source URLs, and normalize one comment per CSV row.',
          zh: '将数据获取与分析分离：Codex 可以收集可访问的公开评论、保留来源链接，并规范为每行一条评论的 CSV。',
        },
      },
      {
        title: { en: 'Validate', zh: '校验' },
        detail: {
          en: 'Map fields, isolate invalid rows, normalize text, and consolidate exact and near-duplicate records without overwriting the raw input.',
          zh: '映射字段、隔离无效行、规范文本，并合并完全重复与近似重复记录，同时保留原始输入。',
        },
      },
      {
        title: { en: 'Structure', zh: '结构化' },
        detail: {
          en: 'Extract atomic pain points and exact evidence, then group related records into controlled, inspectable themes.',
          zh: '提取原子化痛点与精确证据，再把相关记录组织为可检查、受控的主题。',
        },
      },
      {
        title: { en: 'Prioritize', zh: '排序' },
        detail: {
          en: 'Rank themes with a visible frequency, severity, and recency formula, then expose the evidence, uncertainty, human corrections, and exports.',
          zh: '通过可见的频率、严重度与时效性公式排序主题，并开放证据、不确定性、人工修正与导出能力。',
        },
      },
    ],
    metrics: [
      { value: '60', label: { en: 'Demo comments', zh: '演示评论' } },
      { value: '50', label: { en: 'Evaluation cases', zh: '评估样本' } },
      { value: '23', label: { en: 'Automated tests', zh: '自动化测试' } },
      { value: '0', label: { en: 'API keys required', zh: '必需 API Key' } },
    ],
    highlights: {
      en: [
        'Built an end-to-end CSV pipeline for validation, cleanup, structured extraction, theme grouping, scoring, evidence review, and export.',
        'Separated semantic interpretation from deterministic ranking so the model never owns the priority score.',
        'Added source-level traceability, human theme correction, SQLite persistence, and a constrained dataset-question agent.',
        'Created a 50-case evaluation set and verified all 23 automated tests against the current deterministic baseline.',
      ],
      zh: [
        '搭建端到端 CSV 流程，覆盖校验、清洗、结构化提取、主题聚类、评分、证据检查与导出。',
        '将语义解释与确定性排序分离，确保模型不会直接决定优先级分数。',
        '加入来源级追溯、人工主题修正、SQLite 持久化和受约束的数据集问答 Agent。',
        '建立 50 条评估样本，并在当前确定性基线上验证全部 23 个自动化测试。',
      ],
    },
    evidence: [
      {
        status: 'verified',
        label: { en: 'Working application', zh: '可运行应用' },
        claim: {
          en: 'The local Streamlit application completes the no-key workflow from CSV upload to ranked, evidence-backed themes.',
          zh: '本地 Streamlit 应用能够在无需 API Key 的情况下完成从 CSV 上传到证据支撑主题排序的完整流程。',
        },
        source: { en: 'Local project repository and runnable demo', zh: '本地项目仓库与可运行演示' },
      },
      {
        status: 'verified',
        label: { en: 'Automated verification', zh: '自动化验证' },
        claim: {
          en: 'All 23 checked-in tests pass against the current implementation.',
          zh: '当前实现中的 23 个自动化测试已全部通过。',
        },
        source: { en: 'Pytest run, July 2026', zh: 'Pytest 运行记录，2026 年 7 月' },
      },
      {
        status: 'verified',
        label: { en: 'Evaluation harness', zh: '评估框架' },
        claim: {
          en: 'A checked-in 50-case dataset evaluates schema reliability, actionability, category assignment, severity, and evidence faithfulness.',
          zh: '仓库内置 50 条评估数据，用于检查 Schema 可靠性、可行动性、类别判断、严重度和证据忠实度。',
        },
        source: { en: 'Evaluation dataset and reproducible script', zh: '评估数据集与可复现脚本' },
      },
      {
        status: 'pending',
        label: { en: 'Public deployment', zh: '公开部署' },
        claim: {
          en: 'A permanent public demo and reusable automated collection Skill are planned but not yet presented as shipped outcomes.',
          zh: '长期公开演示和可复用的自动收集 Skill 仍在规划中，当前不作为已上线成果展示。',
        },
        source: { en: 'Project roadmap', zh: '项目路线图' },
      },
    ],
    stack: ['Python', 'Streamlit', 'Pandas', 'scikit-learn', 'Pydantic', 'SQLite', 'Codex', 'OpenAI (optional)'],
    disclosure: {
      en: 'Personal project and reproducible demo. The sample and evaluation data are synthetic; evaluation results describe the checked-in baseline, not production accuracy or customer impact.',
      zh: '个人项目与可复现演示。样本和评估数据均为合成数据；评估结果描述的是仓库内置基线，不代表生产环境准确率或客户成效。',
    },
  },
  {
    slug: 'autocoder',
    company: 'AutoCoder.cc',
    status: 'active',
    accent: '#c1432e',
    headline: {
      en: 'An in-progress record across AI engineering, product, and growth.',
      zh: '一份持续更新的 AI 工程、产品与增长工作记录。',
    },
    context: {
      en: 'The internship began in June 2026. This page deliberately separates verified public information from work that is still developing.',
      zh: '这段实习始于 2026 年 6 月。本页会明确区分已可公开验证的信息与仍在推进中的工作。',
    },
    challenge: {
      en: 'Represent an active role honestly before its shipped work, visuals, and measurable outcomes are ready for public release.',
      zh: '在上线成果、视觉材料和量化结果尚未适合公开前，诚实地呈现一段仍在进行中的岗位。',
    },
    workflow: [
      {
        title: { en: 'Current scope', zh: '当前范围' },
        detail: {
          en: 'AI engineering, product thinking, and growth are the verified focus areas from the current profile.',
          zh: '当前资料中可确认的工作范围是 AI 工程、产品思维与增长。',
        },
      },
      {
        title: { en: 'Public evidence', zh: '公开证据' },
        detail: {
          en: 'Shipped work, screenshots, and contribution details remain intentionally unpublished until they are cleared.',
          zh: '已上线成果、截图和具体贡献会在确认适合公开后再加入。',
        },
      },
      {
        title: { en: 'Next update', zh: '下一次更新' },
        detail: {
          en: 'The case study will gain measurable outcomes only when the internship produces claims that can be verified publicly.',
          zh: '只有在实习产生可公开验证的结果后，本案例才会加入量化成果。',
        },
      },
    ],
    metrics: [
      { value: 'Jun 2026', label: { en: 'Started', zh: '开始时间' } },
      { value: 'Active', label: { en: 'Status', zh: '当前状态' } },
      { value: '3', label: { en: 'Focus areas', zh: '工作方向' } },
    ],
    evidence: [
      {
        status: 'verified',
        label: { en: 'Role record', zh: '岗位记录' },
        claim: {
          en: 'Internship active since June 2026 across AI engineering, product, and growth.',
          zh: '自 2026 年 6 月起参与 AI 工程、产品与增长工作。',
        },
        source: { en: 'LinkedIn profile export', zh: 'LinkedIn 个人资料导出' },
      },
      {
        status: 'private',
        label: { en: 'Work-in-progress artifacts', zh: '进行中工作材料' },
        claim: {
          en: 'Product screens, contribution details, and internal performance data are not cleared for publication.',
          zh: '产品界面、具体贡献与内部绩效数据尚未确认可公开。',
        },
        source: { en: 'Internal working record', zh: '内部工作记录' },
      },
      {
        status: 'pending',
        label: { en: 'Outcome update', zh: '成果更新' },
        claim: {
          en: 'This slot will only receive shipped outcomes that can be publicly verified.',
          zh: '这里只会补充已经上线且能够公开验证的成果。',
        },
        source: { en: 'Pending public release', zh: '等待公开发布' },
      },
    ],
    stack: ['AI Engineering', 'Product', 'Growth'],
    disclosure: {
      en: 'Working record. No unverified product or performance claims are included.',
      zh: '进行中记录：当前不包含未经验证的产品或绩效声明。',
    },
  },
  {
    slug: 'unitree-embodied-ai',
    company: 'Unitree Robotics + BUPT Lab',
    status: 'active',
    accent: '#28756f',
    headline: {
      en: 'Compressing language intelligence into an offline embodied-AI system.',
      zh: '把语言智能压缩进可离线运行的具身 AI 系统。',
    },
    context: {
      en: 'An ongoing research role connecting language models, ESP32 voice interaction, retrieval, safeguards, and quadruped robots for companionship-oriented scenarios.',
      zh: '一项持续进行的研究工作，将语言模型、ESP32 语音交互、检索、安全规则和四足机器人连接到陪伴型场景。',
    },
    challenge: {
      en: 'Build useful language interaction under edge-device constraints while preserving offline operation, alignment quality, and rule-based safety.',
      zh: '在边缘设备限制下实现有效的语言交互，同时兼顾离线运行、对齐质量和规则安全。',
    },
    workflow: [
      {
        title: { en: 'Dataset', zh: '数据集' },
        detail: {
          en: 'Generated more than 5,000 question-answer pairs for the target interaction domain.',
          zh: '围绕目标交互场景生成 5,000+ 组问答数据。',
        },
      },
      {
        title: { en: 'Training', zh: '训练' },
        detail: {
          en: 'Used LoRA and LLaMA-Factory workflows to adapt a compact language model.',
          zh: '使用 LoRA 与 LLaMA-Factory 流程适配小型语言模型。',
        },
      },
      {
        title: { en: 'Retrieval + safety', zh: '检索与安全' },
        detail: {
          en: 'Combined BGE retrieval with rule-based safeguards for grounded offline responses.',
          zh: '结合 BGE 检索与规则安全层，提高离线回答的可靠性。',
        },
      },
      {
        title: { en: 'Edge integration', zh: '边缘集成' },
        detail: {
          en: 'Compressed deployment to 0.5B parameters and connected ESP32 voice interaction with the embodied system.',
          zh: '将部署模型压缩到 0.5B 参数，并把 ESP32 语音交互连接到具身系统。',
        },
      },
    ],
    metrics: [
      { value: '5,000+', label: { en: 'QA pairs', zh: '问答数据' } },
      { value: '85%', label: { en: 'Offline alignment', zh: '离线对齐度' } },
      { value: '0.5B', label: { en: 'Deployment model', zh: '部署模型' } },
    ],
    evidence: [
      {
        status: 'verified',
        label: { en: 'Training dataset', zh: '训练数据集' },
        claim: {
          en: 'More than 5,000 domain question-answer pairs prepared for model adaptation.',
          zh: '为模型适配准备了 5,000+ 组场景问答数据。',
        },
        source: { en: 'LinkedIn profile export', zh: 'LinkedIn 个人资料导出' },
      },
      {
        status: 'verified',
        label: { en: 'Evaluation result', zh: '评估结果' },
        claim: {
          en: 'Current offline human-AI alignment recorded at 85%.',
          zh: '当前离线人机对齐度记录为 85%。',
        },
        source: { en: 'LinkedIn profile export', zh: 'LinkedIn 个人资料导出' },
      },
      {
        status: 'verified',
        label: { en: 'Edge deployment', zh: '边缘部署' },
        claim: {
          en: 'A 0.5B-parameter model connected to ESP32 voice interaction and the embodied system.',
          zh: '0.5B 参数模型连接 ESP32 语音交互与具身系统。',
        },
        source: { en: 'LinkedIn profile export', zh: 'LinkedIn 个人资料导出' },
      },
      {
        status: 'private',
        label: { en: 'Research artifacts', zh: '研究材料' },
        claim: {
          en: 'Training logs, evaluation sheets, and hardware integration media remain internal.',
          zh: '训练日志、评估表与硬件集成影像暂不公开。',
        },
        source: { en: 'Research workspace', zh: '研究工作区' },
      },
    ],
    stack: ['LLM / SLM', 'LoRA', 'LLaMA-Factory', 'BGE', 'ESP32', 'Offline AI'],
    disclosure: {
      en: 'Ongoing research. Metrics reflect the current LinkedIn export and may evolve with later evaluations.',
      zh: '研究仍在进行；指标来自当前 LinkedIn 导出，后续评估可能继续更新。',
    },
  },
  {
    slug: 'lenovo-data-analytics',
    company: 'Lenovo',
    status: 'complete',
    accent: '#263f63',
    headline: {
      en: 'Turning two million CRM records into faster commercial reporting.',
      zh: '把 200 万条 CRM 记录转化为更快、更清晰的商业报表。',
    },
    context: {
      en: 'A completed data-analytics internship focused on ThinkPad sales tracking, CRM standardization, purchase-pattern analysis, and SKU-level reporting.',
      zh: '一段已完成的数据分析实习，聚焦 ThinkPad 销售追踪、CRM 标准化、购买模式分析和 SKU 级报表。',
    },
    challenge: {
      en: 'Reduce repetitive data preparation while making large CRM inputs trustworthy enough for daily sales analysis and operational reporting.',
      zh: '减少重复的数据准备工作，并让大规模 CRM 输入足够可靠，可用于每日销售分析和运营报表。',
    },
    workflow: [
      {
        title: { en: 'SQL ETL', zh: 'SQL ETL' },
        detail: {
          en: 'Built a daily pipeline for the ThinkPad Sales Tracker.',
          zh: '为 ThinkPad Sales Tracker 搭建每日数据管道。',
        },
      },
      {
        title: { en: 'Data quality', zh: '数据质量' },
        detail: {
          en: 'Cleaned and standardized more than two million CRM records.',
          zh: '清洗并标准化超过 200 万条 CRM 记录。',
        },
      },
      {
        title: { en: 'Analysis', zh: '分析' },
        detail: {
          en: 'Used regression and clustering to identify three accessory-bundle trends.',
          zh: '通过回归与聚类识别出 3 个配件组合购买趋势。',
        },
      },
      {
        title: { en: 'Reporting', zh: '报表' },
        detail: {
          en: 'Developed six interactive Power BI dashboards for SKU-level e-commerce analysis.',
          zh: '开发 6 个交互式 Power BI 仪表盘，用于 SKU 级电商分析。',
        },
      },
    ],
    metrics: [
      { value: '2M+', label: { en: 'CRM records', zh: 'CRM 记录' } },
      { value: '35%', label: { en: 'Less prep time', zh: '准备时间降低' } },
      { value: '6', label: { en: 'Dashboards', zh: '仪表盘' } },
      { value: '3', label: { en: 'Purchase trends', zh: '购买趋势' } },
    ],
    evidence: [
      {
        status: 'verified',
        label: { en: 'Data scale', zh: '数据规模' },
        claim: {
          en: 'More than two million CRM records cleaned and standardized.',
          zh: '清洗并标准化超过 200 万条 CRM 记录。',
        },
        source: { en: 'LinkedIn profile export', zh: 'LinkedIn 个人资料导出' },
      },
      {
        status: 'verified',
        label: { en: 'Workflow impact', zh: '流程影响' },
        claim: {
          en: 'Daily SQL ETL reduced recurring data-preparation time by 35%.',
          zh: '每日 SQL ETL 将重复数据准备时间降低 35%。',
        },
        source: { en: 'LinkedIn profile export', zh: 'LinkedIn 个人资料导出' },
      },
      {
        status: 'verified',
        label: { en: 'Reporting output', zh: '报表成果' },
        claim: {
          en: 'Six Power BI dashboards and three accessory-bundle purchase trends delivered.',
          zh: '完成 6 个 Power BI 仪表盘，并识别 3 个配件组合购买趋势。',
        },
        source: { en: 'LinkedIn profile export', zh: 'LinkedIn 个人资料导出' },
      },
      {
        status: 'private',
        label: { en: 'Internal proof', zh: '内部证据' },
        claim: {
          en: 'Dashboard screenshots, schemas, and company data are withheld for confidentiality.',
          zh: '出于保密要求，仪表盘截图、数据结构与公司数据不公开。',
        },
        source: { en: 'Lenovo internal systems', zh: 'Lenovo 内部系统' },
      },
    ],
    stack: ['SQL', 'ETL', 'Data Cleaning', 'Regression', 'Clustering', 'Power BI'],
    disclosure: {
      en: 'Completed internship. Internal dashboards and schemas are not published; only verified outcome summaries are shown.',
      zh: '实习已完成；内部仪表盘与数据结构不公开，本页仅展示可验证的成果摘要。',
    },
  },
]

export function findProfessionalCase(slug) {
  return professionalCaseStudies.find((item) => item.slug === slug)
}
