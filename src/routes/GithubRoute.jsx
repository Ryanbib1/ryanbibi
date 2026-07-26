import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Boxes,
  ExternalLink,
  GitFork,
  GitPullRequestArrow,
  Sparkles,
  TerminalSquare,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageTransition, SectionKicker, cardMotion, cn } from '../App'
import { githubProfile } from '../data/githubFeatured'
import { githubShowcase } from '../data/githubShowcase'
import { works } from '../projects/registry'

const repositoryFilters = [
  { id: 'all', label: { en: 'All builds', zh: '全部作品' } },
  { id: 'automation', label: { en: 'Automation', zh: '自动化' } },
  { id: 'ai-data', label: { en: 'AI & data', zh: 'AI 与数据' } },
  { id: 'creative', label: { en: 'Creative web', zh: '创意网页' } },
]

const workStatus = {
  live: { en: 'Live', zh: '可体验' },
  wip: { en: 'In progress', zh: '制作中' },
  concept: { en: 'Concept', zh: '概念阶段' },
}

function formatDate(value, language) {
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`))
}

function RepositoryCard({ featured, language, repository }) {
  const isZh = language === 'zh'

  return (
    <motion.article
      {...cardMotion}
      className={cn(
        'ui-card-interactive group relative flex min-h-[390px] flex-col overflow-hidden rounded-lg border p-5 shadow-[0_18px_48px_rgba(91,64,35,0.08)] sm:p-6',
        featured
          ? 'border-slate-950 bg-slate-950 text-white dark:border-white/12 dark:bg-white/[0.07] lg:col-span-2 xl:col-span-3'
          : 'border-line bg-surface/94 text-ink dark:border-white/10 dark:bg-white/[0.045]',
      )}
      style={{ '--repo-accent': repository.accent }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: repository.accent }}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              'grid size-10 shrink-0 place-items-center rounded-lg border',
              featured
                ? 'border-white/12 bg-white/[0.06] text-white'
                : 'border-line bg-surface-sunk text-ink dark:border-white/10 dark:bg-white/[0.05]',
            )}
          >
            <GitFork className="size-4.5" />
          </span>
          <div className="min-w-0">
            <p className={cn('font-mono text-[10px] uppercase', featured ? 'text-white/42' : 'text-ink-faint')}>
              {repository.language} / {repository.category.replace('-', ' + ')}
            </p>
            <p className={cn('mt-1 truncate font-mono text-xs', featured ? 'text-white/70' : 'text-ink-soft')}>
              {repository.name}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase',
            featured
              ? 'border-white/12 bg-white/[0.06] text-white/68'
              : 'border-line bg-surface-sunk text-ink-faint dark:border-white/10 dark:bg-white/[0.05]',
          )}
        >
          {repository.status[language]}
        </span>
      </div>

      <div className={cn('mt-7', featured && 'max-w-4xl')}>
        <h3 className={cn('font-serif font-semibold leading-tight', featured ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-3xl')}>
          {repository.title[language]}
        </h3>
        <p className={cn('mt-4 max-w-3xl leading-7', featured ? 'text-white/62' : 'text-ink-soft')}>
          {repository.description[language]}
        </p>
      </div>

      <div className={cn('mt-7 grid grid-cols-3 gap-3', featured ? 'max-w-3xl' : '')}>
        {repository.metrics.map((metric) => (
          <div
            className={cn('min-w-0 border-t pt-3', featured ? 'border-white/12' : 'border-line dark:border-white/10')}
            key={metric.label.en}
          >
            <strong className={cn('block truncate font-mono text-base sm:text-lg', featured ? 'text-white' : 'text-ink')}>
              {metric.value}
            </strong>
            <span className={cn('mt-1 block text-[10px] leading-4 sm:text-xs', featured ? 'text-white/42' : 'text-ink-faint')}>
              {metric.label[language]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-7">
        <div className="flex flex-wrap gap-2">
          {repository.tags.map((tag) => (
            <span
              className={cn(
                'rounded-md px-2.5 py-1.5 text-xs',
                featured ? 'bg-white/[0.06] text-white/58' : 'bg-surface-sunk text-ink-soft dark:bg-white/[0.05]',
              )}
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className={cn('mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t pt-4', featured ? 'border-white/12' : 'border-line dark:border-white/10')}>
          <a
            className={cn('inline-flex items-center gap-2 text-sm font-semibold transition', featured ? 'text-white hover:text-cinnabar-soft' : 'text-ink hover:text-cinnabar')}
            href={repository.url}
            rel="noreferrer"
            target="_blank"
          >
            {isZh ? '查看仓库' : 'View repository'}
            <ExternalLink className="size-3.5" />
          </a>
          {repository.internalUrl && (
            <a
              className={cn('inline-flex items-center gap-2 text-sm font-semibold transition', featured ? 'text-white/58 hover:text-white' : 'text-ink-soft hover:text-cinnabar')}
              href={repository.internalUrl}
            >
              {isZh ? '站内作品' : 'Site story'}
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
          {repository.homepage && (
            <a
              className={cn('inline-flex items-center gap-2 text-sm font-semibold transition', featured ? 'text-white/58 hover:text-white' : 'text-ink-soft hover:text-cinnabar')}
              href={repository.homepage}
              rel="noreferrer"
              target="_blank"
            >
              {isZh ? '线上体验' : 'Live experience'}
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
          <span className={cn('ml-auto font-mono text-[10px] uppercase', featured ? 'text-white/35' : 'text-ink-faint')}>
            {formatDate(repository.updatedAt, language)}
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export default function GithubRoute({ language = 'en' }) {
  const isZh = language === 'zh'
  const [activeFilter, setActiveFilter] = useState('all')
  const visibleRepositories = useMemo(
    () =>
      activeFilter === 'all'
        ? githubShowcase
        : githubShowcase.filter((repository) => repository.category === activeFilter),
    [activeFilter],
  )

  const scrollToRepositories = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('repositories')?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <PageTransition className="gap-12 sm:gap-16" data-no-translate>
      <section className="relative overflow-hidden rounded-lg border border-slate-950 bg-slate-950 px-5 py-8 text-white shadow-[0_26px_80px_rgba(15,23,42,0.22)] dark:border-white/10 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div aria-hidden="true" className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div aria-hidden="true" className="absolute -right-20 top-8 size-80 rounded-full border border-white/8 sm:right-8 sm:size-[28rem]" />
        <div aria-hidden="true" className="absolute right-16 top-28 hidden h-px w-72 bg-gradient-to-r from-cinnabar via-amber-300/70 to-transparent lg:block" />
        <span aria-hidden="true" className="absolute right-72 top-[6.8rem] hidden size-3 rounded-full border-2 border-slate-950 bg-cinnabar ring-4 ring-white/12 lg:block" />
        <span aria-hidden="true" className="absolute right-44 top-[6.8rem] hidden size-3 rounded-full border-2 border-slate-950 bg-amber-300 ring-4 ring-white/12 lg:block" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <SectionKicker icon={GitFork} text={isZh ? 'GitHub / 创作档案' : 'GitHub / Build archive'} />
            <h1 className="mt-5 max-w-4xl font-serif text-4xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              {isZh ? '代码不是附件，是作品发生的地方。' : 'The code is not an appendix. It is where the work happens.'}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              {isZh
                ? '这里不是把所有仓库原样搬过来，而是整理 Ryanbibi 真正值得打开的系统、实验和构建记录。'
                : 'Not a mirror of every repository. A curated record of the systems, experiments, and build decisions worth opening.'}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cinnabar-soft"
                href={githubProfile.url}
                rel="noreferrer"
                target="_blank"
              >
                @{githubProfile.handle}
                <ExternalLink className="size-4" />
              </a>
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-white/14 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                onClick={scrollToRepositories}
                type="button"
              >
                {isZh ? '浏览精选项目' : 'Browse selected builds'}
                <ArrowDown className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-white/12 pt-5 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            {[
              { value: githubProfile.publicRepoCount, en: 'public repositories', zh: '个公开仓库' },
              { value: githubShowcase.length, en: 'curated builds', zh: '个精选项目' },
              { value: works.length, en: 'interactive works', zh: '个互动作品' },
            ].map((metric) => (
              <div className="min-w-0 lg:border-b lg:border-white/10 lg:pb-4 lg:last:border-0 lg:last:pb-0" key={metric.en}>
                <strong className="block font-mono text-2xl sm:text-3xl">{metric.value}</strong>
                <span className="mt-1 block text-[10px] leading-4 text-white/40 sm:text-xs">
                  {isZh ? metric.zh : metric.en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-28" id="repositories">
        <div className="flex flex-col justify-between gap-5 border-b border-line pb-6 dark:border-white/10 lg:flex-row lg:items-end">
          <div>
            <SectionKicker icon={TerminalSquare} text={isZh ? '01 / 精选仓库' : '01 / Selected repositories'} />
            <h2 className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-5xl">
              {isZh ? '只展示能够讲清楚问题与方法的构建。' : 'Selected for the problem, process, and proof.'}
            </h2>
          </div>
          <div
            aria-label={isZh ? '仓库类型' : 'Repository categories'}
            className="grid w-full grid-cols-2 gap-1 rounded-lg border border-line bg-surface/78 p-1 dark:border-white/10 dark:bg-white/[0.04] sm:inline-flex sm:w-auto"
            role="group"
          >
            {repositoryFilters.map((filter) => (
              <button
                aria-controls="repository-panel"
                aria-pressed={activeFilter === filter.id}
                className={cn(
                  'min-h-11 rounded-md px-3 py-2 text-xs font-semibold transition sm:shrink-0 sm:text-sm',
                  activeFilter === filter.id
                    ? 'bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950'
                    : 'text-ink-soft hover:bg-surface hover:text-ink dark:hover:bg-white/10',
                )}
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                type="button"
              >
                {filter.label[language]}
              </button>
            ))}
          </div>
        </div>

        <div
          className={cn(
            'mt-6 grid gap-4',
            activeFilter === 'all' ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-2',
          )}
          id="repository-panel"
        >
          {visibleRepositories.map((repository, index) => (
            <RepositoryCard
              featured={activeFilter === 'all' && index === 0}
              key={repository.slug}
              language={language}
              repository={repository}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="grid gap-6 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
          <motion.div {...cardMotion} className="lg:sticky lg:top-28">
            <SectionKicker icon={Sparkles} text={isZh ? '02 / 互动作品' : '02 / Interactive works'} />
            <h2 className="mt-4 max-w-xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-5xl">
              {isZh ? '有些想法应该先被体验，再被解释。' : 'Some ideas should be experienced before they are explained.'}
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-ink-soft">
              {isZh
                ? '这些作品直接运行在网站里，覆盖生成艺术、声音、游戏系统和轻量产品流程。'
                : 'Runnable experiments across generative art, sound, game systems, and lightweight product flows.'}
            </p>
            <a className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-cinnabar" href="#/lab">
              {isZh ? '进入完整 Lab' : 'Open the full Lab'}
              <ArrowUpRight className="size-4" />
            </a>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2">
            {works.map((work, index) => (
              <motion.a
                {...cardMotion}
                className={cn(
                  'ui-card-interactive group relative min-h-[230px] overflow-hidden rounded-lg border border-line bg-surface/92 p-5 shadow-[0_16px_42px_rgba(91,64,35,0.07)] dark:border-white/10 dark:bg-white/[0.045]',
                  index === 0 && 'sm:col-span-2 sm:min-h-[260px]',
                )}
                href={`#/lab/${work.slug}`}
                key={work.slug}
              >
                <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: work.accent }} />
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-10 place-items-center rounded-lg border border-line bg-surface-sunk text-ink dark:border-white/10 dark:bg-white/[0.05]">
                    {work.type === 'embed' ? <Boxes className="size-4" /> : <BookOpen className="size-4" />}
                  </span>
                  <span className="rounded-md bg-surface-sunk px-2 py-1 font-mono text-[10px] uppercase text-ink-faint dark:bg-white/[0.05]">
                    {workStatus[work.status]?.[language] || work.status}
                  </span>
                </div>
                <p className="mt-7 font-mono text-[10px] uppercase text-ink-faint">{work.year} / {work.type}</p>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">
                  {isZh ? work.title : work.en}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">{work.tagline}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="flex flex-wrap gap-2">
                    {work.tags.slice(0, 3).map((tag) => (
                      <span className="text-xs text-ink-faint" key={tag}>{tag}</span>
                    ))}
                  </span>
                  <ArrowUpRight className="size-4 text-ink-faint transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cinnabar" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 rounded-lg border border-line bg-surface/92 p-6 shadow-[0_18px_48px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-cinnabar">
            <GitPullRequestArrow className="size-4" />
            {isZh ? '持续更新' : 'Continuously updated'}
          </div>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-ink sm:text-4xl">
            {isZh ? '这里展示策展后的作品，GitHub 保留完整时间线。' : 'This page is curated. GitHub keeps the complete timeline.'}
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-ink-soft">
            {isZh
              ? `最后策展于 ${githubProfile.curatedAt}。新项目只需要更新一份数据文件，就能进入主页和创作档案。`
              : `Last curated ${githubProfile.curatedAt}. New public builds can enter the homepage and archive through one maintained data file.`}
          </p>
        </div>
        <a
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cinnabar dark:bg-white dark:text-slate-950 dark:hover:bg-cinnabar dark:hover:text-white"
          href={githubProfile.url}
          rel="noreferrer"
          target="_blank"
        >
          {isZh ? '查看全部仓库' : 'View all repositories'}
          <ExternalLink className="size-4" />
        </a>
      </section>
    </PageTransition>
  )
}
