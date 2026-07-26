import {
  Activity, ArrowUpRight, BadgeCheck, BarChart3, CalendarCheck, FileText,
  Percent, ShieldCheck, Upload,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  allocationData, chaseReport, portfolioAnalystLens, portfolioWatch,
  portfolioWatchlist,
} from '../data/dashboardData'
import {
  BentoCard, DonutChart, PageHeader, PageTransition, Progress,
} from '../App'

const vaultTheses = [
  {
    id: 'memory',
    label: { en: 'Memory cycle', zh: '存储周期' },
    tickers: ['DRAM', 'MUU'],
    statement: {
      en: 'The portfolio makes its clearest directional bet on memory pricing, supply discipline, and AI-driven demand.',
      zh: '组合最明确的方向性押注，是存储价格、供给纪律与 AI 需求共同驱动的周期。',
    },
    tension: {
      en: 'High conviction creates the largest single source of drawdown risk.',
      zh: '高确信度也带来组合最大的单一回撤来源。',
    },
  },
  {
    id: 'compute',
    label: { en: 'AI compute', zh: 'AI 算力' },
    tickers: ['NVDA', 'AMD', 'ARM'],
    statement: {
      en: 'GPU platforms, CPUs, and chip architecture express a long-duration view on accelerated computing.',
      zh: 'GPU 平台、CPU 与芯片架构共同表达对加速计算的长期判断。',
    },
    tension: {
      en: 'Execution can remain strong while valuation still compresses.',
      zh: '即使业务执行保持强劲，估值仍可能压缩。',
    },
  },
  {
    id: 'rails',
    label: { en: 'Data rails', zh: '数据基础设施' },
    tickers: ['MRVL', 'MRVU', 'AVGO'],
    statement: {
      en: 'Networking, custom silicon, and connectivity are the less-visible rails behind AI infrastructure growth.',
      zh: '网络、定制芯片与连接能力，是 AI 基础设施增长背后不那么显眼的轨道。',
    },
    tension: {
      en: 'MRVU adds daily leveraged path dependency to an already cyclical theme.',
      zh: 'MRVU 在周期主题之上进一步增加了每日杠杆的路径依赖。',
    },
  },
  {
    id: 'optionality',
    label: { en: 'Core + optionality', zh: '核心与可选性' },
    tickers: ['GOOGL', 'NOK', 'VOO', 'SMH', 'Other'],
    statement: {
      en: 'Broad-market exposure and smaller positions preserve optionality around a concentrated semiconductor thesis.',
      zh: '宽基与小仓位在集中半导体主线之外保留了可选性。',
    },
    tension: {
      en: 'This sleeve diversifies names more than it diversifies the underlying growth factor.',
      zh: '这一层分散了名称，但对底层增长因子的分散仍有限。',
    },
  },
]

function VaultThesisBoard({ language }) {
  const isZh = language === 'zh'
  const [activeId, setActiveId] = useState(vaultTheses[0].id)
  const active = vaultTheses.find((item) => item.id === activeId) || vaultTheses[0]
  const positions = active.tickers
    .map((ticker) => portfolioWatch.find((holding) => holding.label === ticker))
    .filter(Boolean)
  const weight = positions.reduce((sum, holding) => sum + holding.value, 0)

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface/94 shadow-[0_22px_60px_rgba(91,64,35,0.09)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20" data-no-translate>
      <div className="grid lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="border-b border-line p-5 dark:border-white/10 lg:border-b-0 lg:border-r sm:p-6">
          <p className="font-mono text-xs uppercase text-cinnabar">{isZh ? 'Ryan 的持仓逻辑' : "Ryan's thesis board"}</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink">
            {isZh ? '先看为什么，再看持仓。' : 'Start with why, then inspect the positions.'}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-1" role="tablist" aria-label={isZh ? '投资主题' : 'Investment themes'}>
            {vaultTheses.map((thesis) => {
              const thesisWeight = thesis.tickers
                .map((ticker) => portfolioWatch.find((holding) => holding.label === ticker)?.value || 0)
                .reduce((sum, value) => sum + value, 0)
              return (
                <button
                  aria-selected={active.id === thesis.id}
                  className={`ui-card-interactive flex min-h-16 items-center justify-between gap-3 rounded-lg border px-3 py-3 text-left ${active.id === thesis.id ? 'border-cinnabar/40 bg-cinnabar/10 text-cinnabar' : 'border-line bg-surface-sunk/65 text-ink-soft dark:border-white/10 dark:bg-white/[0.035]'}`}
                  key={thesis.id}
                  onClick={() => setActiveId(thesis.id)}
                  role="tab"
                  type="button"
                >
                  <span className="text-sm font-semibold">{thesis.label[language]}</span>
                  <span className="font-mono text-xs">{thesisWeight.toFixed(1)}%</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase text-ink-faint">{active.label[language]}</p>
              <p className="mt-2 font-serif text-5xl font-semibold tracking-tight text-ink">{weight.toFixed(1)}%</p>
              <p className="mt-1 text-xs text-ink-faint">{isZh ? '投资账户内部占比' : 'of the investment account'}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-sunk px-3 py-2 font-mono text-[11px] uppercase text-ink-faint dark:border-white/10 dark:bg-white/[0.04]">
              <ShieldCheck className="size-3.5 text-cinnabar" />
              {isZh ? '仅显示比例' : 'Percentage only'}
            </span>
          </div>

          <p className="mt-7 max-w-3xl font-serif text-2xl font-semibold leading-9 text-ink">{active.statement[language]}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {positions.map((holding) => (
              <span className="rounded-md bg-ink px-3 py-2 font-mono text-xs font-bold text-white dark:bg-white dark:text-ink" key={holding.label}>
                {holding.label} · {holding.value}%
              </span>
            ))}
          </div>
          <div className="mt-7 border-l-2 border-cinnabar/45 pl-4">
            <p className="font-mono text-[11px] uppercase text-cinnabar">{isZh ? '需要持续验证' : 'What must stay true'}</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-soft">{active.tension[language]}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function VaultPage({ allocationTotal, language }) {
  const isZh = language === 'zh'
  return (
    <PageTransition>
      <PageHeader
        icon={Percent}
        kicker="/Vault"
        subtitle={isZh
          ? '一个只展示比例、同时记录持仓逻辑与风险条件的个人资本系统。'
          : 'A percentage-only capital system that records position logic, concentration, and the conditions that must stay true.'}
        title={isZh ? 'Ryan 的财富系统' : "Ryan's Wealth System"}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface/82 px-4 py-3 text-sm shadow-[0_12px_32px_rgba(91,64,35,0.06)] dark:border-white/10 dark:bg-white/[0.035]">
        <span className="inline-flex items-center gap-2 font-semibold text-ink">
          <BadgeCheck className="size-4 text-cinnabar" />
          {isZh ? '隐私规则：只展示百分比' : 'Privacy rule: percentage-only portfolio snapshot'}
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase text-ink-faint">
          <CalendarCheck className="size-3.5" />
          {chaseReport.parser}
        </span>
      </div>

      <VaultThesisBoard language={language} />

      <section className="grid gap-4 lg:grid-cols-12">
        <BentoCard className="lg:col-span-7" title="Allocation" icon={Percent}>
          <DonutChart data={allocationData} total={allocationTotal} />
          <p className="mt-4 text-sm leading-6 text-ink-faint">
            Click a slice or allocation row to open its own vault page.
          </p>
        </BentoCard>

        <BentoCard className="lg:col-span-5" title={isZh ? '定投纪律' : 'Contribution Rule'} icon={CalendarCheck}>
          <p className="leading-7 text-ink-soft">
            {isZh
              ? '按周追踪持续性与配置比例，不展示账户金额，也不把短期择时当作系统。'
              : 'Track weekly consistency and allocation percentages without exposing account value or turning short-term timing into the system.'}
          </p>
          <Progress value={88} color="bg-cinnabar" className="mt-5" />
        </BentoCard>

        <BentoCard className="lg:col-span-12" title="Chase Holdings Report Slot" icon={Upload}>
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-lg border border-cinnabar/25 bg-cinnabar/8 p-4">
              <FileText className="mb-4 size-6 text-cinnabar" />
              <p className="font-semibold text-ink">{chaseReport.source}</p>
              <p className="mt-2 text-sm text-ink-soft">{chaseReport.status}</p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-mono text-xs uppercase text-ink-faint">{chaseReport.parser}</p>
              <p className="mt-3 leading-7 text-ink-soft">{chaseReport.note}</p>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-12" title="Major Investment Holdings" icon={BarChart3}>
          <p className="mb-4 text-sm leading-6 text-ink-faint">
            Holdings at or above 2% are shown individually. Smaller positions are grouped into Other.
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {portfolioWatch.map((holding) => (
              <HoldingCard holding={holding} key={holding.label} />
            ))}
          </div>
        </BentoCard>

        <PortfolioAnalystLens />
      </section>
    </PageTransition>
  )
}

function VaultDetailPage({ allocationTotal, language, route }) {
  const slug = route.split('/')[1]
  const allocation = allocationData.find((item) => item.slug === slug)

  if (!allocation) {
    return <VaultPage allocationTotal={allocationTotal} language={language} />
  }

  return (
    <PageTransition>
      <PageHeader
        icon={Percent}
        kicker="/Vault detail"
        subtitle={allocation.description}
        title={allocation.name}
      />

      <section className="grid gap-4 lg:grid-cols-12">
        <BentoCard className="lg:col-span-4" title="Allocation Signal" icon={Percent}>
          <div className="grid place-items-center rounded-lg border border-line bg-surface-sunk py-8 dark:border-white/10 dark:bg-white/[0.04]">
            <div
              className="grid size-36 place-items-center rounded-full border-[14px] bg-white dark:bg-slate-950"
              style={{ borderColor: allocation.color }}
            >
              <div className="text-center">
                <p className="font-mono text-4xl font-black text-ink">
                  {allocation.value}%
                </p>
                <p className="mt-1 text-xs uppercase text-ink-faint">of vault</p>
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-4" title="Role" icon={ShieldCheck}>
          <p className="font-mono text-xs uppercase text-ink-faint">{allocation.role}</p>
          <p className="mt-4 leading-7 text-ink-soft">{allocation.description}</p>
        </BentoCard>

        <BentoCard className="lg:col-span-4" title="Update Source" icon={FileText}>
          <p className="font-mono text-xs uppercase text-ink-faint">{allocation.updateSource}</p>
          <p className="mt-4 leading-7 text-ink-soft">
            This detail page is ready for backend data later. Values remain percentage-based for privacy.
          </p>
        </BentoCard>

        {allocation.slug === 'stocks' && (
          <>
            <BentoCard className="lg:col-span-12" title="Investment Detail Watch" icon={BarChart3}>
              <p className="mb-4 text-sm leading-6 text-ink-faint">
                Main positions from the uploaded positions file. Anything below 2% is grouped into Other.
              </p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {portfolioWatch.map((holding) => (
                  <HoldingCard holding={holding} key={holding.label} />
                ))}
              </div>
            </BentoCard>
            <PortfolioAnalystLens />
          </>
        )}

        <a
          className="ui-action inline-flex w-fit items-center gap-2 bg-ink py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-cinnabar dark:bg-white dark:text-ink dark:hover:bg-cinnabar dark:hover:text-white lg:col-span-12"
          href="#/vault"
        >
          Back to Vault <ArrowUpRight className="size-4" />
        </a>
      </section>
    </PageTransition>
  )
}

function PortfolioAnalystLens() {
  return (
    <BentoCard className="lg:col-span-12" title="Analyst Lens" icon={Activity}>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="max-w-3xl leading-7 text-ink-soft">
            Wall Street read: this is a concentrated semiconductor and AI infrastructure sleeve. It is
            aggressively growth-oriented by design, with the biggest risk coming from sector
            concentration, memory-cycle timing, and leveraged ETF path dependency.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {portfolioAnalystLens.map((item) => (
              <div
                className="rounded-lg border border-line bg-surface-sunk/70 p-4 dark:border-white/10 dark:bg-white/[0.04]"
                key={item.label}
              >
                <p className="font-mono text-xs uppercase text-ink-faint">{item.label}</p>
                <p className="mt-2 font-semibold text-ink">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-cinnabar/25 bg-cinnabar/8 p-4 dark:border-cinnabar/20 dark:bg-cinnabar/10">
          <p className="font-mono text-xs uppercase text-cinnabar">Monitor List</p>
          <div className="mt-4 space-y-3">
            {portfolioWatchlist.map((item) => (
              <div className="flex gap-3 text-sm leading-6 text-ink-soft" key={item}>
                <span className="mt-2 size-1.5 rounded-full bg-cinnabar" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-ink-faint">
            Educational portfolio commentary only, not personalized financial advice.
          </p>
        </div>
      </div>
    </BentoCard>
  )
}

function HoldingCard({ holding }) {
  return (
    <div className="rounded-lg border border-line bg-surface-sunk/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-lg font-black text-ink">
            {holding.label}
          </p>
          <p className="mt-1 text-sm text-ink-faint">{holding.value}%</p>
        </div>
        <span className="rounded-lg bg-surface-sunk px-2.5 py-1 font-mono text-xs text-ink-faint dark:bg-white/10 dark:text-slate-300">
          {holding.label === 'Other' ? 'grouped' : 'major'}
        </span>
      </div>
      <Progress value={holding.value} color={holding.color} />
      <p className="mt-3 text-sm leading-6 text-ink-soft">
        {holding.business}
      </p>
    </div>
  )
}

export default function VaultRoutes({ language = 'en', route }) {
  const allocationTotal = useMemo(
    () => allocationData.reduce((sum, item) => sum + item.value, 0),
    [],
  )
  return route === 'vault'
    ? <VaultPage allocationTotal={allocationTotal} language={language} />
    : <VaultDetailPage allocationTotal={allocationTotal} language={language} route={route} />
}
