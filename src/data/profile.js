export const profile = {
  name: 'Ziyan Wang',
  handle: 'ryanbibi',
  email: 'wangziyanryan0816@gmail.com',
  linkedIn: 'https://www.linkedin.com/in/ziyan-wang-275651290/',
  location: 'New York, New York, United States',
  currentSchool: 'New York University',
  currentProgram: 'Information Systems',
  sourceLabel: {
    en: 'Synced from LinkedIn export - July 2026',
    zh: '同步自 LinkedIn 导出 - 2026 年 7 月',
  },
}

export const professionalExperiences = [
  {
    company: 'AutoCoder.cc',
    role: 'AI Engineer & CMO',
    period: 'Jun 2026 - Present',
    location: 'Haidian District',
    current: true,
    icon: 'ai',
    summary: {
      en: 'Current internship in progress. The role, shipped work, and measurable outcomes will be expanded as the internship develops.',
      zh: '当前实习进行中。具体职责、已上线工作和量化成果会随着实习推进持续补充。',
    },
    highlights: {
      en: ['Building in public while the role is still taking shape.'],
      zh: ['在岗位仍持续发展的阶段，逐步记录真实工作与成果。'],
    },
    tags: ['AI Engineering', 'Product', 'Growth'],
  },
  {
    company: 'Unitree Robotics + BUPT Lab',
    role: 'LLM Trainer / Embodied AI Research',
    period: 'May 2026 - Present',
    location: 'Haidian District',
    current: true,
    icon: 'ai',
    summary: {
      en: 'Integrating language models with edge devices and quadruped robots for offline deployment, therapeutic AI, and elderly-care companionship.',
      zh: '把语言模型与边缘设备、四足机器人结合，探索离线部署、心理关怀 AI 和老年陪伴场景。',
    },
    highlights: {
      en: [
        'Generated a dataset of 5,000+ question-answer pairs.',
        'Reached 85% human-AI alignment in offline evaluation.',
        'Compressed the deployment model to 0.5B parameters for edge use.',
        'Integrated ESP32 voice interaction, LoRA/LLaMA-Factory training, BGE retrieval, and rule-based safeguards.',
      ],
      zh: [
        '生成 5,000+ 组问答训练数据。',
        '离线评估中达到 85% 人机对齐度。',
        '将部署模型压缩至 0.5B 参数以适配边缘设备。',
        '整合 ESP32 语音交互、LoRA/LLaMA-Factory 训练、BGE 检索和规则安全层。',
      ],
    },
    tags: ['Embodied AI', 'LLM / SLM', 'ESP32', 'Offline AI'],
  },
  {
    company: 'University of Pittsburgh',
    role: 'Computing Lab Assistant',
    period: 'Feb 2026 - May 2026',
    location: 'Pittsburgh, Pennsylvania',
    icon: 'support',
    summary: {
      en: 'Supported students in campus computing labs and helped them work through everyday technical problems.',
      zh: '在校园计算机实验室为学生提供技术支持，协助解决日常计算与软件问题。',
    },
    highlights: {
      en: ['Helped students learn practical Microsoft Excel, Word, and PowerPoint workflows.'],
      zh: ['帮助学生掌握 Microsoft Excel、Word 和 PowerPoint 的基础使用流程。'],
    },
    tags: ['Technical Support', 'Microsoft Office', 'Student Services'],
  },
  {
    company: 'Lenovo',
    role: 'Data Analyst Intern',
    period: 'Jun 2025 - Aug 2025',
    location: 'Beijing, China',
    icon: 'data',
    summary: {
      en: 'Built data pipelines, cleaned CRM data, analyzed purchase behavior, and translated operational signals into Power BI reporting.',
      zh: '搭建数据管道、清洗 CRM 数据、分析购买行为，并把运营信号转化为 Power BI 报表。',
    },
    highlights: {
      en: [
        'Built a daily SQL ETL pipeline for the ThinkPad Sales Tracker, cutting preparation time by 35%.',
        'Cleaned and standardized 2M+ CRM records.',
        'Used regression and clustering to identify three accessory-bundle trends.',
        'Developed six interactive Power BI dashboards for SKU-level e-commerce analysis.',
      ],
      zh: [
        '为 ThinkPad Sales Tracker 搭建每日 SQL ETL 管道，将数据准备时间缩短 35%。',
        '清洗并标准化 200 万+ 条 CRM 记录。',
        '通过回归与聚类识别出 3 个配件组合购买趋势。',
        '开发 6 个交互式 Power BI 仪表盘，用于 SKU 级电商分析。',
      ],
    },
    tags: ['SQL', 'ETL', 'Power BI', 'CRM Analytics'],
  },
  {
    company: 'Beijing Defuxiang',
    role: 'Financial Analyst Intern',
    period: 'May 2024 - Aug 2024',
    location: 'Haidian District',
    icon: 'finance',
    summary: {
      en: 'Analyzed regional sales and inventory data for a food business, turning underperformance and procurement signals into operating recommendations.',
      zh: '为食品企业分析区域销售与库存数据，把产品表现和采购信号转化为经营建议。',
    },
    highlights: {
      en: [
        'Identified three underperforming product lines and recommended expansion into two university districts.',
        'Designed a sales-and-procurement inventory dashboard that reduced key raw-material stockouts by 15%.',
      ],
      zh: [
        '识别 3 条表现不佳的产品线，并建议进入 2 个大学片区。',
        '设计销售与采购一体化库存仪表盘，使关键原材料缺货减少 15%。',
      ],
    },
    tags: ['Financial Analysis', 'Inventory', 'Dashboarding'],
  },
  {
    company: 'Massachusetts Institute of Technology',
    role: 'Research Assistant with Dr. Peter Kempthorne',
    period: 'Aug 2023 - Jan 2024',
    location: 'Boston, Massachusetts',
    icon: 'research',
    summary: {
      en: 'Researched trends in China\'s accommodation and food-service industry through statistical analysis and econometric modeling in RStudio.',
      zh: '使用 RStudio 进行统计分析和计量建模，研究中国住宿与餐饮服务行业的发展趋势。',
    },
    highlights: {
      en: [
        'Managed research methodology, data collection, analysis, and paper preparation.',
        'Published a peer-reviewed paper in Business, Economics, and Management Review, Vol. 30.',
      ],
      zh: [
        '负责研究方法、数据收集、分析和论文准备的完整流程。',
        '在 Business, Economics, and Management Review 第 30 卷发表同行评审论文。',
      ],
    },
    tags: ['RStudio', 'Econometrics', 'Research'],
    link: 'https://doi.org/10.54097/94r1am97',
  },
]

export const education = [
  {
    school: 'New York University',
    program: 'B.S. Information Systems',
    period: 'Jun 2026 - May 2028',
    current: true,
  },
  {
    school: 'University of Pittsburgh',
    program: 'Computer Science',
    period: 'Aug 2024 - Jun 2026',
  },
  {
    school: 'Wilbraham & Monson Academy',
    program: 'High School',
    period: 'Aug 2022 - May 2024',
  },
  {
    school: 'University of Chicago',
    program: 'Precollege Summer Session - Computer Science',
    period: 'May 2023 - Jul 2023',
  },
  {
    school: 'SJA',
    program: 'High School',
    period: 'Aug 2020 - Jun 2022',
  },
]

// Optional public sections. They stay hidden until Ryan provides verified entries.
export const leadership = []
export const certifications = []
