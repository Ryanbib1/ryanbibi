/* eslint-disable react-refresh/only-export-components */
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Code2,
  Clock3,
  Database,
  FileText,
  GitFork,
  GraduationCap,
  Home,
  MapPin,
  Mail,
  Moon,
  Percent,
  Printer,
  Shapes,
  ShieldCheck,
  Sparkles,
  Sun,
  Utensils,
  Zap,
} from 'lucide-react'
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { findProfessionalCase, professionalCaseStudies } from './data/caseStudies'
import { education, professionalExperiences, profile } from './data/profile'
import activityFeed from './data/activityFeed.json'
import foodSummary from './data/foodSummary.json'
import { githubFeaturedRepository, githubProfile } from './data/githubFeatured'
import { getChoiceMemoryLead, getChoiceMemoryTags, slugifyRegion } from './data/homeFoodUtils'
import { getRestaurantDisplayName } from './i18n/foodNames'
import { setI18nLanguage } from './i18n/runtime'
import { findWork, STATUS_LABEL, works } from './projects/registry'
import { WORK_COMPONENTS } from './projects/components'

const routes = [
  { key: 'home', label: '/Home', shortLabel: 'Home', icon: Home },
  { key: 'portfolio', label: '/Portfolio', shortLabel: 'CV', icon: BadgeCheck },
  { key: 'lab', label: '/Lab', shortLabel: 'Lab', icon: Shapes },
  { key: 'github', label: '/GitHub', shortLabel: 'Git', icon: GitFork },
  { key: 'vault', label: '/Vault', shortLabel: 'Vault', icon: Percent },
  { key: 'life', label: '/Life', shortLabel: 'Life', icon: Sparkles },
  { key: 'food', label: '/Food', shortLabel: 'Food', icon: Utensils },
]

const statuses = [
  'Building AI products at AutoCoder.cc',
  'Building Signal, an AI feedback intelligence tool',
  'Tracking health, wealth, and lifestyle signals',
]

const linkedInUrl = profile.linkedIn
const contactEmail = profile.email
const ENTRY_SESSION_KEY = 'ryanbibi-entry-seen-v1'

const EntryReveal = lazy(() => import('./routes/EntryReveal'))
const FoodRoutes = lazy(() => import('./routes/FoodRoutes'))
const GithubRoute = lazy(() => import('./routes/GithubRoute'))
const LifeRoute = lazy(() => import('./routes/LifeRoute'))
const VaultRoutes = lazy(() => import('./routes/VaultRoutes'))

const featuredFoodChoices = foodSummary.featuredChoices

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const portfolioCases = [
  {
    title: 'Pathfinder',
    role: 'Multimedia Website Project',
    caseType: 'Product + Frontend Build',
    headline: 'A discovery product that connects reflection, media, and lightweight tracking.',
    icon: Code2,
    problem: 'Build a personal discovery experience that connects media, reflection, and lightweight tracking.',
    actions: [
      'Designed a multimedia website around passion discovery.',
      'Built room for a carbon-cycle tracker and personal analytics modules.',
      'Framed the project as a living product rather than a static class artifact.',
    ],
    outcome:
      'A project foundation that can grow into screenshots, metrics, build notes, and a deeper product story.',
    proof: ['React interface', 'Carbon-cycle tracker slot', 'Personal analytics framing'],
    next: 'Ready to expand into a product story with user flows, screenshots, and build decisions.',
    tags: ['React', 'Carbon cycle', 'Storytelling', 'Tracker UI'],
  },
]

const capabilityStack = [
  {
    label: 'AI systems',
    value: 88,
    color: 'bg-cinnabar',
    detail: 'LLM/SLM training, offline deployment, retrieval, and edge-device integration.',
  },
  {
    label: 'SQL analysis',
    value: 92,
    color: 'bg-stone-700',
    detail: 'Querying, validating, joining, and turning raw tables into usable signals.',
  },
  {
    label: 'Data cleaning',
    value: 89,
    color: 'bg-stone-600',
    detail: 'Making messy inputs consistent enough for analysis and reporting.',
  },
  {
    label: 'Dashboard storytelling',
    value: 86,
    color: 'bg-stone-500',
    detail: 'Building dashboards that explain the business question, not just the metric.',
  },
]

const workingPrinciples = [
  'Start with the messy table, not the slide.',
  'Use dashboards to reduce confusion, not decorate numbers.',
  'Turn personal systems into public proof of taste and discipline.',
]

const homeFeaturedCaseRoles = {
  'signal-feedback-intelligence': {
    en: 'Independent Builder / Product & AI',
    zh: '独立开发 / 产品与 AI',
  },
  autocoder: {
    en: 'AI Engineer & CMO',
    zh: 'AI Engineer & CMO',
  },
  'unitree-embodied-ai': {
    en: 'LLM Trainer / Embodied AI Research',
    zh: 'LLM Trainer / 具身智能研究',
  },
  'lenovo-data-analytics': {
    en: 'Data Analyst Intern',
    zh: '数据分析实习生',
  },
}

export const cardMotion = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, ease: 'easeOut' },
}


function getRouteFromHash() {
  const hash = window.location.hash.replace('#/', '').replace('#', '')
  const [rawPrimary, secondary, tertiary] = hash.split('/')
  const primary = rawPrimary === 'work' ? 'lab' : rawPrimary
  const normalizedHash = rawPrimary === 'work' ? ['lab', secondary, tertiary].filter(Boolean).join('/') : hash
  const isPrimaryRoute = routes.some((route) => route.key === primary)
  const isVaultDetail = primary === 'vault' && Boolean(secondary)
  const isFoodPlaceDetail = primary === 'food' && secondary === 'place' && Boolean(tertiary)
  const isFoodCityDetail = primary === 'food' && Boolean(secondary) && secondary !== 'place'
  const isWorkDetail = primary === 'lab' && Boolean(findWork(secondary))
  const isPortfolioDetail = primary === 'portfolio' && Boolean(findProfessionalCase(secondary))

  if (isPortfolioDetail) return normalizedHash
  if (isVaultDetail) return normalizedHash
  if (isFoodPlaceDetail) return normalizedHash
  if (isFoodCityDetail) return normalizedHash
  if (isWorkDetail) return normalizedHash
  if (isPrimaryRoute && !secondary) return primary
  return 'home'
}

function hasSeenEntryThisSession() {
  if (typeof window === 'undefined') return false
  try {
    return window.sessionStorage.getItem(ENTRY_SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

function rememberEntryForSession() {
  try {
    window.sessionStorage.setItem(ENTRY_SESSION_KEY, 'true')
  } catch {
    // File previews can expose storage as an opaque origin; the site still works without it.
  }
}

function canUseEnhancedVisuals() {
  if (typeof window === 'undefined') return false
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const desktopCanvas = window.matchMedia('(min-width: 900px)').matches
  const saveData = Boolean(navigator.connection?.saveData)
  const constrainedCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
  return desktopCanvas && !reducedMotion && !saveData && !constrainedCpu
}

function useEnhancedVisuals() {
  const [enabled, setEnabled] = useState(canUseEnhancedVisuals)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktopQuery = window.matchMedia('(min-width: 900px)')
    const update = () => setEnabled(canUseEnhancedVisuals())
    motionQuery.addEventListener?.('change', update)
    desktopQuery.addEventListener?.('change', update)
    window.addEventListener('online', update)
    return () => {
      motionQuery.removeEventListener?.('change', update)
      desktopQuery.removeEventListener?.('change', update)
      window.removeEventListener('online', update)
    }
  }, [])

  return enabled
}

function useSecondaryPageInteractions(rootRef, route, enhancedVisuals) {
  useEffect(() => {
    const root = rootRef.current
    const isSecondaryRoute = route !== 'home' && !route.startsWith('lab/')
    if (!root || !isSecondaryRoute || typeof window === 'undefined') return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const revealNodes = new Set()
    const revealSelector = [
      '.page-stack > section',
      '.page-stack > article',
      '.page-stack > aside',
      '.page-stack > div',
    ].join(',')

    const revealObserver = !reduceMotion && 'IntersectionObserver' in window
      ? new window.IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return
              entry.target.classList.add('is-route-visible')
              revealObserver.unobserve(entry.target)
            })
          },
          { rootMargin: '0px 0px -7% 0px', threshold: 0.06 },
        )
      : null

    const syncRevealNodes = () => {
      root.querySelectorAll(revealSelector).forEach((node, index) => {
        if (revealNodes.has(node) || node.classList.contains('route-atmosphere')) return
        revealNodes.add(node)
        node.classList.add('route-reveal')
        node.style.setProperty('--route-reveal-delay', `${Math.min(index % 4, 3) * 55}ms`)
        if (revealObserver) revealObserver.observe(node)
        else node.classList.add('is-route-visible')
      })
    }

    syncRevealNodes()
    const mutationObserver = new window.MutationObserver(syncRevealNodes)
    mutationObserver.observe(root, { childList: true, subtree: true })

    let pointerFrame = 0
    let pendingPointer = null
    let activeSurface = null
    const surfaceSelector = '.ui-card-interactive, .ui-card'

    const clearSurface = () => {
      activeSurface?.classList.remove('is-route-surface-active')
      activeSurface = null
    }

    const paintPointer = () => {
      pointerFrame = 0
      if (!pendingPointer) return
      const { clientX, clientY, target } = pendingPointer
      const xRatio = clientX / Math.max(window.innerWidth, 1)
      const yRatio = clientY / Math.max(window.innerHeight, 1)
      root.style.setProperty('--route-shift-x', `${(xRatio - 0.5) * 18}px`)
      root.style.setProperty('--route-shift-y', `${(yRatio - 0.5) * 12}px`)

      const nextSurface = target instanceof Element ? target.closest(surfaceSelector) : null
      const surface = nextSurface && root.contains(nextSurface) ? nextSurface : null
      if (surface !== activeSurface) {
        clearSurface()
        activeSurface = surface
        activeSurface?.classList.add('is-route-surface-active')
      }
      if (surface) {
        const rect = surface.getBoundingClientRect()
        surface.style.setProperty('--route-surface-x', `${clientX - rect.left}px`)
      }
    }

    const onPointerMove = (event) => {
      pendingPointer = event
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(paintPointer)
    }

    const onScroll = () => {
      root.style.setProperty('--route-scroll-y', `${Math.min(window.scrollY * 0.025, 22)}px`)
    }

    if (enhancedVisuals && finePointer && !reduceMotion) {
      root.addEventListener('pointermove', onPointerMove, { passive: true })
      root.addEventListener('pointerleave', clearSurface)
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    }

    return () => {
      window.cancelAnimationFrame(pointerFrame)
      mutationObserver.disconnect()
      revealObserver?.disconnect()
      root.removeEventListener('pointermove', onPointerMove)
      root.removeEventListener('pointerleave', clearSurface)
      window.removeEventListener('scroll', onScroll)
      clearSurface()
      revealNodes.forEach((node) => {
        node.classList.remove('route-reveal', 'is-route-visible')
        node.style.removeProperty('--route-reveal-delay')
      })
      root.style.removeProperty('--route-shift-x')
      root.style.removeProperty('--route-shift-y')
      root.style.removeProperty('--route-scroll-y')
    }
  }, [enhancedVisuals, rootRef, route])
}

function App() {
  const enhancedVisuals = useEnhancedVisuals()
  const mainRef = useRef(null)
  const [showEntryReveal, setShowEntryReveal] = useState(() => {
    if (typeof window === 'undefined') return false
    return getRouteFromHash() === 'home' && !hasSeenEntryThisSession()
  })
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    return localStorage.getItem('language') || 'en'
  })
  const [route, setRoute] = useState(() => {
    if (typeof window === 'undefined') return 'home'
    return getRouteFromHash()
  })
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('theme-v2') === 'dark'
  })
  const primaryRoute = route.split('/')[0]
  const hasSecondaryAtmosphere = route !== 'home' && !route.startsWith('lab/')

  useSecondaryPageInteractions(mainRef, route, enhancedVisuals)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash())
      window.scrollTo({ top: 0, behavior: 'auto' })
      window.requestAnimationFrame(() => {
        mainRef.current?.focus({ preventScroll: true })
      })
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme-v2', darkMode ? 'dark' : 'light')
  }, [darkMode])

  setI18nLanguage(language)

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    localStorage.setItem('language', language)
  }, [language])

  useEffect(() => {
    const routeTitle = {
      home: { en: 'Digital Garden', zh: '数字花园' },
      portfolio: { en: 'Portfolio', zh: '作品集' },
      lab: { en: 'Interactive Lab', zh: '互动实验室' },
      github: { en: 'GitHub & Build Archive', zh: 'GitHub 创作档案' },
      vault: { en: 'Wealth Vault', zh: '财富库' },
      life: { en: 'Life Dashboard', zh: '生活仪表盘' },
      food: { en: 'Global Food Atlas', zh: '全球美食地图' },
    }
    const primaryRoute = route.split('/')[0]
    const caseStudy = primaryRoute === 'portfolio' ? findProfessionalCase(route.split('/')[1]) : null
    const sectionTitle = routeTitle[primaryRoute]?.[language] || routeTitle.home[language]
    document.title = `${caseStudy?.company || sectionTitle} | Ziyan Wang / ryanbibi`
  }, [language, route])

  useEffect(() => {
    if (!showEntryReveal || typeof document === 'undefined') return

    document.body.classList.add('entry-reveal-lock')
    return () => {
      document.body.classList.remove('entry-reveal-lock')
    }
  }, [showEntryReveal])

  const dismissEntryReveal = useCallback(() => {
    rememberEntryForSession()
    setShowEntryReveal(false)
  }, [])

  return (
    <div className="site-shell relative isolate min-h-screen text-slate-950 transition-colors duration-500 dark:text-white">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          mainRef.current?.focus({ preventScroll: true })
          mainRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' })
        }}
      >
        {language === 'zh' ? '跳到主要内容' : 'Skip to main content'}
      </a>
      <InkShaderBackground enabled={enhancedVisuals} />
      <ScrollProgress />
      <InkWipe enabled={enhancedVisuals} trigger={route} />
      <BrushCursor />
      {showEntryReveal && (
        <Suspense fallback={<div className="entry-reveal" aria-hidden="true" />}>
          <EntryReveal enableThree={enhancedVisuals} onDismiss={dismissEntryReveal} show />
        </Suspense>
      )}
      <Header
        darkMode={darkMode}
        language={language}
        route={route}
        setDarkMode={setDarkMode}
        setLanguage={setLanguage}
      />

      <main
        className={cn(
          'mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-4 sm:px-6 lg:px-8',
          hasSecondaryAtmosphere && 'route-stage',
        )}
        data-route={primaryRoute}
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
      >
        {hasSecondaryAtmosphere && <SecondaryRouteAtmosphere route={primaryRoute} />}
        <AnimatePresence mode="wait">
          {route === 'home' && <HomePage enableThree={enhancedVisuals && !showEntryReveal} key="home" language={language} />}
          {route === 'portfolio' && <PortfolioPage key="portfolio" language={language} />}
          {route.startsWith('portfolio/') && (
            <PortfolioCasePage key={route} language={language} route={route} />
          )}
          {route === 'github' && (
            <Suspense fallback={<RouteLoading label="GitHub" />}>
              <GithubRoute key="github" language={language} />
            </Suspense>
          )}
          {route.startsWith('vault') && (
            <Suspense fallback={<RouteLoading label="Vault" />}>
              <VaultRoutes key={route} language={language} route={route} />
            </Suspense>
          )}
          {route === 'life' && (
            <Suspense fallback={<RouteLoading label="Life" />}>
              <LifeRoute key="life" language={language} route={route} />
            </Suspense>
          )}
          {route.startsWith('food') && (
            <Suspense fallback={<RouteLoading label="Food Atlas" />}>
              <FoodRoutes key={route} language={language} route={route} />
            </Suspense>
          )}
          {route === 'lab' && <WorkIndexPage key="lab" />}
          {route.startsWith('lab/') && <WorkDetailPage key={route} language={language} route={route} />}
        </AnimatePresence>
      </main>
      <ContactFooter language={language} />
    </div>
  )
}

function RouteLoading({ label }) {
  return (
    <section className="grid min-h-[44vh] place-items-center rounded-lg border border-line bg-surface/82 p-8 text-center dark:border-white/10 dark:bg-white/[0.035]" role="status">
      <div>
        <span className="mx-auto block size-8 animate-spin rounded-full border-2 border-line border-t-cinnabar" />
        <p className="mt-4 font-mono text-xs uppercase text-ink-faint">Loading {label}</p>
      </div>
    </section>
  )
}

function Header({ darkMode, language, route, setDarkMode, setLanguage }) {
  const primaryRoute = route.split('/')[0]

  return (
    <header className="sticky top-0 z-40 overflow-x-clip border-b border-line/85 bg-surface/90 backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/82">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a
          href="#/home"
          className="flex min-w-0 items-center gap-2 font-mono text-sm text-stone-700 dark:text-slate-200"
        >
          <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-stone-200 bg-slate-950 shadow-sm shadow-stone-300/40 dark:border-white/10 dark:bg-slate-950">
            <img src="./rb-flow-pure.svg" alt="RB Flow Pure Mark" className="size-full" />
          </span>
          <span className="truncate">Ziyan Wang / ryanbibi</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 rounded-lg border border-line bg-surface/78 p-1 text-sm text-stone-600 shadow-sm shadow-stone-300/40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-none xl:flex">
          {routes.map((item) => {
            const Icon = item.icon
            return (
              <a
                aria-current={primaryRoute === item.key ? 'page' : undefined}
                key={item.key}
                href={`#/${item.key}`}
                className={cn(
                  'inline-flex min-h-8 items-center gap-2 rounded-md px-3 py-1.5 transition',
                  primaryRoute === item.key
                    ? 'bg-slate-950 text-white shadow-sm shadow-stone-400/30 hover:bg-slate-950 hover:text-white dark:bg-white dark:text-slate-950 dark:hover:bg-white dark:hover:text-slate-950'
                    : 'text-stone-600 hover:bg-white/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
                )}
              >
                <Icon className="size-3.5" />
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2" data-no-translate>
          <button
            type="button"
            onClick={() => setLanguage((current) => (current === 'en' ? 'zh' : 'en'))}
            className="ui-icon-action grid h-11 min-w-14 place-items-center border border-line bg-surface px-3 text-sm font-semibold text-stone-700 shadow-sm shadow-stone-300/40 hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:shadow-none dark:hover:text-white"
            aria-label={language === 'en' ? '中文 - Switch to Chinese' : 'EN - Switch to English'}
            title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
          >
            {language === 'en' ? '中文' : 'EN'}
          </button>
          <button
            type="button"
            onClick={() => setDarkMode((current) => !current)}
            className="ui-icon-action grid size-11 place-items-center border border-line bg-surface text-stone-700 shadow-sm shadow-stone-300/40 hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:shadow-none dark:hover:text-white"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>

      <nav
        aria-label="Primary navigation"
        className="mx-auto grid w-full max-w-7xl grid-cols-7 gap-1 px-4 pb-2.5 text-stone-600 dark:text-slate-300 sm:px-6 xl:hidden"
      >
        {routes.map((item) => {
          const Icon = item.icon
          return (
            <a
              aria-current={primaryRoute === item.key ? 'page' : undefined}
              aria-label={item.label.slice(1)}
              key={item.key}
              href={`#/${item.key}`}
              title={item.label.slice(1)}
              className={cn(
                'grid min-h-12 min-w-0 place-items-center gap-0.5 rounded-lg border px-1 py-1.5 transition sm:flex sm:min-h-11 sm:justify-center sm:gap-2 sm:px-2',
                primaryRoute === item.key
                  ? 'border-slate-950 bg-slate-950 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-950'
                  : 'border-line bg-surface/78 text-stone-600 hover:border-cinnabar/25 hover:text-cinnabar dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
              )}
            >
              <Icon aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="min-w-0 truncate font-mono text-[9px] leading-none sm:hidden">
                {item.shortLabel}
              </span>
              <span className="hidden min-w-0 truncate text-xs sm:inline">{item.label}</span>
            </a>
          )
        })}
      </nav>
    </header>
  )
}

function ContactFooter({ language }) {
  const isZh = language === 'zh'

  return (
    <footer className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8" data-no-translate>
      <div className="flex flex-col justify-between gap-5 border-t border-line pt-7 dark:border-white/10 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-xs uppercase text-cinnabar">ryanbibi / contact</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
            {isZh
              ? 'AutoCoder.cc 实习进行中。欢迎通过邮件或 LinkedIn 交流数据、AI、产品与有趣的合作想法。'
              : 'Currently interning at AutoCoder.cc. Reach out for conversations around data, AI, products, and thoughtful collaborations.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            className="ui-action inline-flex items-center gap-2 bg-ink py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-cinnabar dark:bg-white dark:text-ink dark:hover:bg-cinnabar dark:hover:text-white"
            href={`mailto:${contactEmail}`}
          >
            <Mail className="size-4" />
            {contactEmail}
          </a>
          <a
            className="ui-action inline-flex items-center gap-2 border border-line bg-surface py-3 text-sm font-semibold text-ink-soft hover:-translate-y-0.5 hover:border-cinnabar/40 hover:text-cinnabar dark:border-white/10 dark:bg-white/[0.05]"
            href={linkedInUrl}
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export function PageTransition({ children, className = '', ...props }) {
  return (
    <motion.div
      {...props}
      animate={{ opacity: 1, y: 0 }}
      className={cn('page-stack flex flex-col', className)}
      exit={{ opacity: 0, y: -8 }}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-cinnabar"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

function SecondaryRouteAtmosphere({ route }) {
  return (
    <div aria-hidden="true" className="route-atmosphere" data-atmosphere={route}>
      <span className="route-atmosphere-grid" />
      <span className="route-atmosphere-stroke route-atmosphere-stroke-a" />
      <span className="route-atmosphere-stroke route-atmosphere-stroke-b" />
    </div>
  )
}

// Ink-wash wipe that sweeps across the screen on every route change.
function InkWipe({ enabled, trigger }) {
  const [play, setPlay] = useState(null)
  const mounted = useRef(false)

  useEffect(() => {
    if (!enabled) return
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const raf = requestAnimationFrame(() => {
      setPlay(`${trigger}-${Date.now()}`)
    })
    return () => cancelAnimationFrame(raf)
  }, [enabled, trigger])

  return (
    <AnimatePresence>
      {enabled && play && (
        <motion.div
          aria-hidden="true"
          className="ink-wipe"
          key={play}
          initial={{ opacity: 0, scaleX: 0.985, y: '108%' }}
          animate={{
            opacity: [0, 1, 0.94, 0],
            scaleX: [0.985, 1.025, 1.01],
            y: ['108%', '9%', '-18%', '-110%'],
          }}
          transition={{
            duration: 0.78,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.32, 0.58, 1],
          }}
          onAnimationComplete={() => setPlay(null)}
        >
          <span className="ink-wipe-sheet" />
          <span className="ink-wipe-grain" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Soft ink dab trailing the cursor — desktop / fine-pointer / motion-on only.
function BrushCursor() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Trail of points; each carries a width derived from how fast the brush
    // was moving there — slow = pressed/thick, fast = flicked/thin (flying white).
    const pts = []
    const LIFE = 480 // ms a point lingers
    let lastX = null
    let lastY = null
    let lastT = 0
    let raf = 0
    let running = false
    let width = 6 // smoothed brush width

    const onMove = (e) => {
      const now = performance.now()
      if (lastX != null) {
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY)
        const dt = Math.max(8, now - lastT)
        const speed = dist / dt // px per ms
        const target = Math.max(1.4, Math.min(9, 9 - speed * 7))
        width += (target - width) * 0.35 // ease for smooth taper
      }
      lastX = e.clientX
      lastY = e.clientY
      lastT = now
      pts.push({ x: e.clientX, y: e.clientY, t: now, w: width })
      if (pts.length > 42) pts.shift()
      if (!running) {
        running = true
        raf = requestAnimationFrame(render)
      }
    }
    window.addEventListener('pointermove', onMove)

    const isDark = () => document.documentElement.classList.contains('dark')
    const render = () => {
      const now = performance.now()
      ctx.clearRect(0, 0, w, h)
      while (pts.length && now - pts[0].t > LIFE) pts.shift()

      if (pts.length >= 2) {
        const ink = isDark() ? '233, 230, 222' : '28, 25, 22'
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.shadowColor = `rgba(${ink}, 0.5)`
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1]
          const b = pts[i]
          const age = (now - b.t) / LIFE // 0 fresh → 1 old
          const fade = (1 - age) * (1 - age) // ease-out fade
          const lw = ((a.w + b.w) / 2) * (0.35 + 0.65 * fade)
          // smooth the centre line through segment midpoints
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          ctx.lineWidth = lw
          ctx.strokeStyle = `rgba(${ink}, ${0.32 * fade})`
          ctx.shadowBlur = lw * 1.6
          ctx.beginPath()
          ctx.moveTo((pts[i - 2]?.x ?? a.x) * 0.5 + a.x * 0.5, (pts[i - 2]?.y ?? a.y) * 0.5 + a.y * 0.5)
          ctx.quadraticCurveTo(a.x, a.y, mx, my)
          ctx.stroke()
        }
        ctx.shadowBlur = 0
      }
      if (pts.length) {
        raf = requestAnimationFrame(render)
      } else {
        running = false
      }
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="brush-cursor" aria-hidden="true" />
}

// Faint flowing-ink field behind everything — raw WebGL, no libraries.
// Domain-warped fbm noise, very low alpha, tint flips with the theme.
function InkShaderBackground({ enabled }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
      premultipliedAlpha: false,
    })
    if (!gl) return

    const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`
    const fs = `
      precision highp float;
      uniform vec2 u_res; uniform float u_time; uniform float u_dark;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),
                   mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x), u.y); }
      float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }
      void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p = uv * vec2(u_res.x/u_res.y, 1.0) * 2.2;
        float t = u_time * 0.02;
        vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(3.4, -t)));
        float n = fbm(p + 1.6*q + t*0.4);
        n = smoothstep(0.35, 0.95, n);
        float ink = n * 0.10;
        vec3 col = mix(vec3(0.13,0.12,0.11), vec3(0.86,0.83,0.77), u_dark);
        gl_FragColor = vec4(col, ink);
      }`

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uDark = gl.getUniformLocation(prog, 'u_dark')

    const resize = () => {
      const shaderDpr = Math.min(window.devicePixelRatio || 1, 1.25)
      canvas.width = Math.round(window.innerWidth * shaderDpr)
      canvas.height = Math.round(window.innerHeight * shaderDpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let lastFrame = 0
    const frameMs = 1000 / 30
    const start = performance.now()
    const render = (time) => {
      if (!document.hidden && time - lastFrame >= frameMs) {
        lastFrame = time
        gl.uniform2f(uRes, canvas.width, canvas.height)
        gl.uniform1f(uTime, (performance.now() - start) / 1000)
        gl.uniform1f(uDark, document.documentElement.classList.contains('dark') ? 1 : 0)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [enabled])

  return <canvas ref={canvasRef} className="ink-shader-bg" aria-hidden="true" />
}

const HOME_FEATURED_CASE_SLUGS = ['signal-feedback-intelligence', 'unitree-embodied-ai', 'lenovo-data-analytics']

function HomeFeaturedWork({ language }) {
  const isZh = language === 'zh'
  const featuredCases = HOME_FEATURED_CASE_SLUGS.map((slug) => findProfessionalCase(slug)).filter(Boolean)

  return (
    <section className="home-chapter" data-no-translate>
      <div className="mb-6 flex flex-col justify-between gap-5 border-b border-line pb-6 dark:border-white/10 md:flex-row md:items-end">
        <div>
          <SectionKicker icon={BriefcaseBusiness} text={isZh ? '02 / 代表经历' : '02 / Selected experience'} />
          <h2 className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-5xl">
            {isZh ? '不是职位列表，而是我如何解决问题的证据。' : 'Not a list of titles. Evidence of how I solve problems.'}
          </h2>
        </div>
        <a
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition hover:text-cinnabar"
          href="#/portfolio"
        >
          {isZh ? '查看完整 Portfolio' : 'View the full portfolio'}
          <ArrowUpRight className="size-4" />
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {featuredCases.map((caseStudy, index) => {
          const role = homeFeaturedCaseRoles[caseStudy.slug]?.[language]
          const isActive = caseStudy.status === 'active'
          return (
            <motion.a
              {...cardMotion}
              className="home-case-card ui-card-interactive group relative flex min-h-[390px] flex-col overflow-hidden rounded-lg border border-line bg-surface/94 p-6 shadow-[0_18px_48px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20"
              href={`#/portfolio/${caseStudy.slug}`}
              key={caseStudy.slug}
              style={{ '--case-accent': caseStudy.accent }}
              transition={{ ...cardMotion.transition, delay: index * 0.06 }}
            >
              <span className="absolute inset-x-0 top-0 h-1 bg-[var(--case-accent)]" aria-hidden="true" />
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-md border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase text-ink-faint dark:border-white/10">
                  {isActive ? (isZh ? '进行中' : 'In progress') : (isZh ? '已完成' : 'Completed')}
                </span>
                <ArrowUpRight className="size-5 text-ink-faint transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cinnabar" />
              </div>

              <div className="mt-8">
                <p className="font-mono text-xs uppercase text-cinnabar">{role}</p>
                <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink">
                  {caseStudy.company}
                </h3>
                <p className="mt-4 leading-7 text-ink-soft">{caseStudy.headline[language]}</p>
              </div>

              <div className="mt-auto grid grid-cols-3 gap-2 pt-8">
                {caseStudy.metrics.slice(0, 3).map((metric) => (
                  <span className="min-w-0 border-t border-line pt-3 dark:border-white/10" key={metric.label.en}>
                    <strong className="block text-lg font-bold text-ink">{metric.value}</strong>
                    <span className="mt-1 block text-[10px] leading-4 text-ink-faint">
                      {metric.label[language]}
                    </span>
                  </span>
                ))}
              </div>
            </motion.a>
          )
        })}
      </div>
    </section>
  )
}

function HomePage({ enableThree, language }) {
  const isZh = language === 'zh'

  return (
    <PageTransition className="home-ink-scene gap-12 sm:gap-16">
      <div aria-hidden="true" className="ink-motif ink-bamboo ink-bamboo-right" />
      <div aria-hidden="true" className="ink-motif ink-bamboo ink-bamboo-left" />
      <Hero enableThree={enableThree} language={language} />

      <section className="home-chapter grid gap-6 lg:grid-cols-[0.36fr_0.64fr] lg:items-start" data-no-translate>
        <motion.div {...cardMotion} className="lg:sticky lg:top-28">
          <SectionKicker icon={Zap} text={isZh ? '01 / 最新动态' : '01 / Latest from the desk'} />
          <h2 className="mt-4 max-w-xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-5xl">
            {isZh ? '这个网站会随着经历一起生长。' : 'A living record, updated as the work happens.'}
          </h2>
          <p className="mt-4 max-w-lg leading-7 text-ink-soft">
            {isZh
              ? '实习进展、项目上线和新餐厅会自动进入这里。不是一次写完的简历，而是一份持续更新的个人记录。'
              : 'Internship progress, shipped projects, and new restaurant notes surface here automatically. This is a living record, not a resume frozen in time.'}
          </p>
        </motion.div>
        <HomeActivityPanel language={language} />
      </section>

      <HomeFeaturedWork language={language} />

      <HomeGithubShowcase language={language} />

      <HomeFoodChapter language={language} />
    </PageTransition>
  )
}

function HomeGithubShowcase({ language }) {
  const isZh = language === 'zh'
  const featuredRepo = githubFeaturedRepository
  const featuredCreations = ['liuguang', 'xuan', 'sheng']
    .map((slug) => findWork(slug))
    .filter(Boolean)

  return (
    <section className="home-chapter" data-no-translate>
      <div className="mb-6 flex flex-col justify-between gap-5 border-b border-line pb-6 dark:border-white/10 md:flex-row md:items-end">
        <div>
          <SectionKicker icon={Code2} text={isZh ? '03 / GitHub 展示' : '03 / GitHub showcase'} />
          <h2 className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-5xl">
            {isZh ? '把构建过程也作为作品的一部分。' : 'The build process is part of the work.'}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-cinnabar"
            href="#/github"
          >
            {isZh ? '查看创作档案' : 'View the build archive'}
            <ArrowUpRight className="size-4" />
          </a>
          <a
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition hover:text-cinnabar"
            href={githubProfile.url}
            rel="noreferrer"
            target="_blank"
          >
            @{githubProfile.handle}
            <GitFork className="size-4" />
          </a>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.65fr)]">
        <motion.a
          {...cardMotion}
          className="ui-card-interactive group relative flex min-h-[430px] flex-col overflow-hidden rounded-lg border border-line bg-ink p-6 text-white shadow-[0_22px_58px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/25 sm:p-8"
          href={featuredRepo.url}
          rel="noreferrer"
          target="_blank"
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-cinnabar" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-cinnabar-soft">
                <Code2 className="size-5" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase text-white/45">Featured repository</p>
                <p className="mt-1 font-mono text-xs text-white/72">{featuredRepo.name}</p>
              </div>
            </div>
            <span className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1.5 font-mono text-[10px] uppercase text-emerald-200">
              {featuredRepo.status[language]}
            </span>
          </div>

          <div className="mt-9 max-w-3xl">
            <p className="font-mono text-xs uppercase text-cinnabar-soft">{featuredRepo.language} / Automation</p>
            <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-5xl">
              {featuredRepo.title[language]}
            </h3>
            <p className="mt-5 max-w-2xl leading-7 text-white/66">
              {featuredRepo.description[language]}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {featuredRepo.metrics.map((metric) => (
              <span className="border-t border-white/12 pt-3" key={metric.label.en}>
                <strong className="block font-mono text-xl text-white">{metric.value}</strong>
                <span className="mt-1 block text-xs leading-5 text-white/45">{metric.label[language]}</span>
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-8">
            <div className="flex flex-wrap gap-2">
              {featuredRepo.tags.map((tag) => (
                <span className="rounded-md bg-white/[0.07] px-2.5 py-1.5 text-xs text-white/62" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:text-cinnabar-soft">
              {isZh ? '查看源代码' : 'View source'}
              <ArrowUpRight className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </div>
        </motion.a>

        <motion.aside
          {...cardMotion}
          className="flex min-h-[430px] flex-col rounded-lg border border-line bg-surface/94 p-6 shadow-[0_18px_48px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20"
        >
          <p className="font-mono text-xs uppercase text-cinnabar">{isZh ? '构建说明' : 'Build notes'}</p>
          <h3 className="mt-4 font-serif text-2xl font-semibold leading-tight text-ink">
            {isZh ? '从能运行，到能被验证。' : 'From working code to verifiable work.'}
          </h3>
          <div className="mt-6 grid gap-4">
            {featuredRepo.highlights[language].map((highlight, index) => (
              <div className="border-l-2 border-cinnabar/45 pl-4" key={highlight}>
                <p className="font-mono text-[10px] uppercase text-ink-faint">0{index + 1}</p>
                <p className="mt-1 text-sm leading-6 text-ink-soft">{highlight}</p>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-7">
            <p className="font-mono text-[10px] uppercase text-ink-faint">
              {isZh ? '公开方向' : 'Public focus'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {githubProfile.focus[language].map((item) => (
                <span className="rounded-md border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-soft dark:border-white/10" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {featuredCreations.map((work, index) => (
          <motion.a
            {...cardMotion}
            className="ui-card-interactive group relative min-h-[170px] overflow-hidden rounded-lg border border-line bg-surface/92 p-5 shadow-[0_14px_36px_rgba(91,64,35,0.06)] dark:border-white/10 dark:bg-white/[0.04]"
            href={`#/lab/${work.slug}`}
            key={work.slug}
          >
            <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: work.accent }} />
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-[10px] uppercase text-ink-faint">
                0{index + 1} / {work.year}
              </span>
              <ArrowUpRight className="size-4 text-ink-faint transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cinnabar" />
            </div>
            <h3 className="mt-7 font-serif text-2xl font-semibold text-ink">
              {isZh ? work.title : work.en}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-soft">{work.tagline}</p>
          </motion.a>
        ))}
      </div>
    </section>
  )
}

function formatActivityDate(date, language) {
  if (!date) return '—'
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

function HomeActivityPanel({ language }) {
  const isZh = language === 'zh'
  const highlights = activityFeed.highlights
  const preferredItems = [
    highlights.project,
    highlights.restaurant,
    highlights.site,
    ...activityFeed.items,
  ]
    .filter(Boolean)
    .filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 5)
  const typeIcons = {
    project: Code2,
    restaurant: Utensils,
    site: Sparkles,
  }

  return (
    <motion.aside
      {...cardMotion}
      className="rounded-lg border border-ink bg-ink p-6 text-white shadow-[0_22px_55px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20 sm:p-7"
      transition={{ ...cardMotion.transition, delay: 0.08 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-[#f6c3b6]">
            {isZh ? '持续更新流' : 'Living update stream'}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-white">
            {isZh ? '这个花园仍在生长。' : 'This garden keeps growing.'}
          </h2>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 font-mono text-[10px] uppercase text-white/55">
          <Clock3 className="size-3 text-cinnabar-soft" />
          {formatActivityDate(activityFeed.updatedAt, language)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 border-y border-white/10 py-4">
        <div className="border-r border-white/10 pr-4">
          <p className="font-mono text-[10px] uppercase text-white/40">
            {isZh ? '最新餐厅' : 'Latest restaurant'}
          </p>
          <a
            className="mt-2 block truncate text-sm font-semibold text-white transition hover:text-cinnabar-soft"
            href={highlights.restaurant?.href}
          >
            {highlights.restaurant?.title[language] || '—'}
          </a>
        </div>
        <div className="pl-4">
          <p className="font-mono text-[10px] uppercase text-white/40">
            {isZh ? '项目进展' : 'Project progress'}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-white">
              {highlights.project?.progress ?? 0}%
            </span>
            <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-cinnabar-soft"
                style={{ width: `${highlights.project?.progress ?? 0}%` }}
              />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 grid">
        {preferredItems.map((item) => {
          const Icon = typeIcons[item.type] || Sparkles
          return (
            <a
              className="group grid grid-cols-[32px_minmax(0,1fr)_auto] items-start gap-3 border-b border-white/10 py-3.5 last:border-b-0"
              href={item.href}
              key={item.id}
            >
              <span className="grid size-8 place-items-center rounded-md bg-white/[0.06] text-cinnabar-soft">
                <Icon className="size-3.5" />
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase text-cinnabar-soft">
                    {item.meta[language]}
                  </span>
                  <span className="font-mono text-[9px] text-white/35">
                    {item.section[language]}
                  </span>
                </span>
                <span className="mt-1 block text-sm font-semibold leading-5 text-white transition group-hover:text-cinnabar-soft">
                  {item.title[language]}
                </span>
                <span className="mt-1 line-clamp-1 block text-xs leading-5 text-white/50">
                  {item.detail[language]}
                </span>
              </span>
              <span className="pt-0.5 font-mono text-[9px] text-white/35">
                {item.date.slice(5)}
              </span>
            </a>
          )
        })}
      </div>
    </motion.aside>
  )
}

function HomeFoodChapter({ language }) {
  const isZh = language === 'zh'
  const latestRestaurant = activityFeed.highlights.restaurant

  return (
    <section className="home-chapter border-y border-line py-10 dark:border-white/10 sm:py-14" data-no-translate>
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <motion.div {...cardMotion} className="lg:sticky lg:top-28">
          <SectionKicker icon={Utensils} text={isZh ? '04 / 美食记忆' : '04 / Food memories'} />
          <h2 className="mt-5 max-w-xl font-serif text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl">
            {isZh ? '一顿饭，也可以成为一张记忆卡。' : 'A meal can hold an entire chapter.'}
          </h2>
          <p className="mt-5 max-w-lg leading-7 text-ink-soft">
            {isZh
              ? 'Food Atlas 不只是餐厅目录。城市、朋友、推荐菜和某个阶段的自己，共同构成这份持续增长的味觉档案。'
              : 'Food Atlas is more than a restaurant directory. It connects cities, people, signature dishes, and the version of me who was sitting at that table.'}
          </p>

          <div className="mt-7 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line dark:border-white/10 dark:bg-white/10">
            <div className="bg-surface p-4 dark:bg-surface">
              <p className="font-mono text-[10px] uppercase text-ink-faint">{isZh ? '餐厅档案' : 'Places logged'}</p>
              <p className="mt-2 text-3xl font-black text-ink">{foodSummary.total}</p>
            </div>
            <div className="bg-surface p-4 dark:bg-surface">
              <p className="font-mono text-[10px] uppercase text-ink-faint">Ryanbibi Choice</p>
              <p className="mt-2 text-3xl font-black text-ink">{foodSummary.choiceCount}</p>
            </div>
          </div>

          {latestRestaurant && (
            <a
              className="group mt-4 flex max-w-md items-center justify-between gap-4 rounded-lg border border-line bg-surface/88 p-4 transition hover:border-cinnabar/40 dark:border-white/10 dark:bg-white/[0.04]"
              href={latestRestaurant.href}
            >
              <span>
                <span className="font-mono text-[10px] uppercase text-cinnabar">
                  {isZh ? '最近新增' : 'Latest addition'}
                </span>
                <strong className="mt-1 block text-sm text-ink">
                  {latestRestaurant.title[language]}
                </strong>
              </span>
              <ArrowUpRight className="size-4 text-ink-faint transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cinnabar" />
            </a>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryLink href="#/food">{isZh ? '打开 Food Atlas' : 'Open Food Atlas'}</PrimaryLink>
            <SecondaryLink href={`#/food/${slugifyRegion(featuredFoodChoices[0]?.region || 'New York')}`}>
              {isZh ? '浏览城市章节' : 'Browse a city chapter'}
            </SecondaryLink>
          </div>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2">
          {featuredFoodChoices.map((place, index) => (
            <HomeFoodMemoryCard
              index={index}
              key={place.id}
              language={language}
              place={place}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function HomeFoodMemoryCard({ index, language, place }) {
  const isZh = language === 'zh'
  return (
    <motion.a
      {...cardMotion}
      className="ui-card-interactive group relative flex min-h-[280px] flex-col overflow-hidden rounded-lg border border-line bg-surface p-5 shadow-[0_16px_42px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20"
      href={`#/food/place/${place.id}`}
      transition={{ ...cardMotion.transition, delay: index * 0.04 }}
    >
      <span className="absolute inset-y-0 left-0 w-0.5 bg-cinnabar/60" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-cinnabar">
            {isZh ? 'Choice 记忆' : 'Choice memory'}
          </p>
          <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight tracking-tight text-ink">
            {getRestaurantDisplayName(place, language)}
          </h3>
          <p className="mt-2 text-sm text-ink-faint">
            {place.region} / {place.area}
          </p>
        </div>
        <ArrowUpRight className="size-5 shrink-0 text-ink-faint transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cinnabar" />
      </div>
      <p className="mt-5 line-clamp-4 leading-7 text-ink-soft">
        {getChoiceMemoryLead(place, language)}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {getChoiceMemoryTags(place, language).map((tag) => (
          <span
            className="rounded-lg bg-cinnabar/8 px-2.5 py-1 text-xs font-semibold text-cinnabar"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  )
}

function Hero({ enableThree, language }) {
  const isZh = language === 'zh'
  return (
    <section className="relative isolate overflow-hidden rounded-lg border border-line bg-surface/95 shadow-[0_24px_70px_rgba(91,64,35,0.12)] dark:border-white/10 dark:bg-slate-950 dark:shadow-black/30" data-no-translate>
      <div className="absolute inset-0 -z-10 opacity-90 dark:opacity-100">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(91,64,35,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(91,64,35,0.055)_1px,transparent_1px)] bg-[size:52px_52px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.06)_1px,transparent_1px)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-cinnabar/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_16%,rgba(193,67,46,0.07),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.66),transparent_52%)] dark:bg-[radial-gradient(circle_at_88%_16%,rgba(217,99,78,0.08),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_55%)]" />
        {enableThree && <HeroThreeScene />}
      </div>
      <div className="relative grid min-h-[620px] items-center justify-between gap-8 p-5 sm:p-8 lg:p-10 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full min-w-0 max-w-[calc(100vw-72px)] flex-col justify-center gap-10 overflow-hidden sm:max-w-none xl:min-h-[540px] xl:max-w-[680px]"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-3">
            <StatusPill />
            <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface/70 px-3 py-2 text-sm text-ink-soft shadow-sm shadow-stone-300/30 backdrop-blur dark:bg-white/5 dark:shadow-none">
              <Sparkles className="size-4 text-cinnabar" />
              {isZh ? '数字花园在线' : 'digital garden online'}
            </span>
          </div>

          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-lg border border-line bg-cinnabar/8 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-cinnabar dark:border-white/10">
              {isZh ? 'Information Systems / AI / 数据分析' : 'information systems / AI / analytics'}
            </p>
            <h1 className="max-w-full text-balance font-serif text-[clamp(2.8rem,11vw,6.4rem)] font-semibold leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-8xl">
              <span className="block">Ziyan Wang</span>
              <span className="block">/ ryanbibi</span>
            </h1>
            <p className="mt-5 max-w-[230px] text-base leading-7 text-ink-soft sm:max-w-2xl sm:text-xl sm:leading-8">
              {isZh
                ? 'NYU Information Systems 学生，正在构建 AI 产品、数据分析项目和一个量化的数字花园。'
                : 'NYU Information Systems student building AI products, analytics systems, and a quantified digital garden.'}
            </p>
            <p className="mt-4 max-w-[280px] leading-7 text-ink-faint sm:max-w-2xl">
              {isZh
                ? '我把杂乱数据转化为可用系统，也把旅行、食物与个人习惯整理成有温度的公开档案。'
                : 'I turn messy data into useful systems, then document the travel, food, and personal rituals that make the work feel human.'}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryLink href="#/portfolio">{isZh ? '查看 Portfolio' : 'View my portfolio'}</PrimaryLink>
              <SecondaryLink href={`mailto:${contactEmail}`}>{isZh ? '联系我' : 'Contact me'}</SecondaryLink>
            </div>
          </div>
        </motion.div>

        <div className="min-w-0 xl:justify-self-end">
          <HeroConsole />
        </div>
      </div>
    </section>
  )
}

function HeroThreeScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active = true
    let cleanup = () => {}

    import('./lib/threeSceneKit').then((THREE) => {
      if (!active || !mountRef.current) return

      const mount = mountRef.current
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
      camera.position.set(0, 0.55, 8.2)

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      })
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35))
      mount.appendChild(renderer.domElement)

      const startTime = performance.now()
      const pointer = new THREE.Vector2(0, 0)
      const target = new THREE.Vector2(0, 0)
      const isDark = () => document.documentElement.classList.contains('dark')

      const ink = new THREE.Group()
      ink.position.set(1.35, -0.05, -1.1)
      ink.rotation.set(-0.12, 0.08, 0)
      scene.add(ink)

      const ribbonMaterial = new THREE.LineBasicMaterial({
        color: 0x2a211c,
        opacity: 0.3,
        transparent: true,
      })
      const accentMaterial = new THREE.LineBasicMaterial({
        color: 0xc1432e,
        opacity: 0.48,
        transparent: true,
      })
      const tealMaterial = new THREE.LineBasicMaterial({
        color: 0x0f766e,
        opacity: 0.34,
        transparent: true,
      })

      const makeRibbon = (radius, turns, height, material, phase = 0) => {
        const points = []
        for (let i = 0; i < 340; i += 1) {
          const t = i / 339
          const angle = t * Math.PI * 2 * turns + phase
          const breathe = 0.26 * Math.sin(t * Math.PI * 6 + phase)
          points.push(
            new THREE.Vector3(
              Math.cos(angle) * (radius + breathe),
              (t - 0.5) * height + Math.sin(angle * 0.55) * 0.18,
              Math.sin(angle) * (radius * 0.34 + breathe * 0.35),
            ),
          )
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(geometry, material)
        line.rotation.x = 0.42
        line.rotation.z = -0.08
        ink.add(line)
        return { geometry, line, phase, radius, turns }
      }

      const ribbons = [
        makeRibbon(2.12, 1.08, 2.8, ribbonMaterial, 0.1),
        makeRibbon(1.54, 1.36, 2.18, accentMaterial, 1.7),
        makeRibbon(2.62, 0.78, 2.45, tealMaterial, 2.5),
      ]

      const particleCount = 130
      const particleGeometry = new THREE.BufferGeometry()
      const particlePositions = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount; i += 1) {
        const lane = i / particleCount
        particlePositions[i * 3] = (Math.random() - 0.5) * 7.6
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3.8
        particlePositions[i * 3 + 2] =
          -0.7 - Math.random() * 2.4 + Math.sin(lane * Math.PI * 4) * 0.32
      }
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xc1432e,
        opacity: 0.36,
        size: 0.026,
        transparent: true,
      })
      const particles = new THREE.Points(particleGeometry, particleMaterial)
      particles.position.x = 1.2
      scene.add(particles)

      const resize = () => {
        const rect = mount.getBoundingClientRect()
        const width = Math.max(1, Math.round(rect.width))
        const height = Math.max(1, Math.round(rect.height))
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }

      const onPointerMove = (event) => {
        const rect = mount.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
        target.y = ((event.clientY - rect.top) / rect.height - 0.5) * -2
      }

      resize()
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(mount)
      let inViewport = true
      const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          inViewport = entry.isIntersecting
        },
        { rootMargin: '120px' },
      )
      visibilityObserver.observe(mount)
      window.addEventListener('pointermove', onPointerMove, { passive: true })

      let raf = 0
      let lastFrame = 0
      const render = (time = performance.now()) => {
        if (!active) return

        if (!document.hidden && inViewport && time - lastFrame >= 1000 / 30) {
          lastFrame = time
          const elapsed = (performance.now() - startTime) / 1000
          pointer.lerp(target, 0.045)
          ink.rotation.y = 0.08 + pointer.x * 0.13 + Math.sin(elapsed * 0.22) * 0.04
          ink.rotation.x = -0.12 + pointer.y * 0.055
          ink.position.y = -0.05 + Math.sin(elapsed * 0.42) * 0.035
          particles.rotation.y = elapsed * 0.035
          particles.rotation.x = pointer.y * 0.025

          const dark = isDark()
          ribbonMaterial.color.set(dark ? 0xf4efe6 : 0x2a211c)
          ribbonMaterial.opacity = dark ? 0.22 : 0.3
          particleMaterial.color.set(dark ? 0xd9634e : 0xc1432e)

          ribbons.forEach((ribbon, ribbonIndex) => {
            const position = ribbon.geometry.attributes.position
            const height = 2.35 + ribbonIndex * 0.22
            for (let i = 0; i < position.count; i += 1) {
              const t = i / (position.count - 1)
              const angle =
                t * Math.PI * 2 * ribbon.turns +
                ribbon.phase +
                elapsed * (0.08 + ribbonIndex * 0.018)
              const breathe = 0.25 * Math.sin(t * Math.PI * 6 + ribbon.phase + elapsed * 0.6)
              position.setXYZ(
                i,
                Math.cos(angle) * (ribbon.radius + breathe),
                (t - 0.5) * height + Math.sin(angle * 0.55) * 0.18,
                Math.sin(angle) * (ribbon.radius * 0.34 + breathe * 0.35),
              )
            }
            position.needsUpdate = true
          })

          renderer.render(scene, camera)
        }

        raf = requestAnimationFrame(render)
      }
      render()

      cleanup = () => {
        active = false
        cancelAnimationFrame(raf)
        resizeObserver.disconnect()
        visibilityObserver.disconnect()
        window.removeEventListener('pointermove', onPointerMove)
        renderer.dispose()
        ribbonMaterial.dispose()
        accentMaterial.dispose()
        tealMaterial.dispose()
        particleGeometry.dispose()
        particleMaterial.dispose()
        ribbons.forEach(({ geometry }) => geometry.dispose())
        renderer.domElement.remove()
      }
    })

    return () => {
      active = false
      cleanup()
    }
  }, [])

  return <div ref={mountRef} className="hero-three-scene" aria-hidden="true" />
}

function StatusPill() {
  const [activeStatus, setActiveStatus] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStatus((current) => (current + 1) % statuses.length)
    }, 2600)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="inline-flex min-h-10 max-w-full min-w-0 items-center gap-2 rounded-lg border border-line bg-surface/70 px-3 py-2 text-sm text-ink-soft shadow-sm shadow-stone-300/30 dark:bg-white/5 dark:shadow-none">
      <span className="relative flex size-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cinnabar opacity-50" />
        <span className="relative inline-flex size-2.5 rounded-full bg-cinnabar" />
      </span>
      <span className="shrink-0 text-ink-faint">Currently</span>
      <AnimatePresence mode="wait">
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 font-medium text-ink [overflow-wrap:anywhere]"
          exit={{ opacity: 0, y: -8 }}
          initial={{ opacity: 0, y: 8 }}
          key={statuses[activeStatus]}
          transition={{ duration: 0.28 }}
        >
          {statuses[activeStatus]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function HeroConsole() {
  const signals = [
    { label: 'Analytics', value: 92 },
    { label: 'Food memory layer', value: 89 },
    { label: 'Personal systems', value: 84 },
  ]

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex min-h-[470px] min-w-0 items-center justify-center"
      initial={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.12 }}
    >
      <div className="absolute inset-0 rounded-lg border border-line bg-surface-sunk/80 shadow-inner shadow-stone-300/60 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20" />
      <div className="relative w-full max-w-md rounded-lg border border-line bg-surface/88 p-5 shadow-[0_24px_60px_rgba(91,64,35,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/78 dark:shadow-black/40">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase text-ink-faint">ryanbibi OS</p>
            <h2 className="text-2xl font-bold text-ink">Live desk</h2>
          </div>
          <div className="grid size-11 place-items-center overflow-hidden rounded-lg bg-ink dark:bg-slate-950">
            <img src="./rb-flow-pure.svg" alt="RB Flow Pure Mark" className="size-full" />
          </div>
        </div>

        <div className="live-desk-preview mb-5" aria-hidden="true">
          <div className="live-desk-grid" />
          <div className="live-desk-orbit live-desk-orbit-one" />
          <div className="live-desk-orbit live-desk-orbit-two" />
          <div className="live-desk-ribbon live-desk-ribbon-one" />
          <div className="live-desk-ribbon live-desk-ribbon-two" />
          <div className="live-desk-chip">
            <img src="./rb-flow-pure.svg" alt="" className="size-full" />
          </div>
          <span className="live-desk-dot live-desk-dot-a" />
          <span className="live-desk-dot live-desk-dot-b" />
          <span className="live-desk-dot live-desk-dot-c" />
          <span className="live-desk-label live-desk-label-one">food</span>
          <span className="live-desk-label live-desk-label-two">vault</span>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          <DeskMetric label="Food" value={foodSummary.total} />
          <DeskMetric label="Choice" value={foodSummary.choiceCount} />
          <DeskMetric label="Vault" value="%" />
        </div>

        <div className="grid gap-3">
          {signals.map((item, index) => (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg border border-line bg-surface-sunk/80 p-3 dark:border-white/10 dark:bg-white/[0.04]"
              initial={{ opacity: 0, x: -10 }}
              key={item.label}
              transition={{ delay: 0.18 + index * 0.08, duration: 0.45 }}
            >
              <ProgressLabel label={item.label} value={item.value} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function DeskMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-surface-sunk/80 p-3 text-center dark:border-white/10 dark:bg-white/[0.04]">
      <p className="font-mono text-[10px] uppercase text-ink-faint">{label}</p>
      <p className="mt-1 text-xl font-black text-ink">{value}</p>
    </div>
  )
}

export function PrimaryLink({ children, href }) {
  return (
    <a
      className="ui-action inline-flex items-center justify-center gap-2 bg-ink py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-cinnabar dark:bg-white dark:text-ink dark:hover:bg-cinnabar dark:hover:text-white"
      href={href}
    >
      {children}
      <ArrowUpRight className="size-4" />
    </a>
  )
}

export function SecondaryLink({ children, href }) {
  return (
    <a
      className="ui-action inline-flex items-center justify-center gap-2 border border-line bg-surface/78 py-3 text-sm font-semibold text-ink-soft hover:-translate-y-0.5 hover:border-cinnabar/40 hover:text-ink dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:hover:text-white"
      href={href}
    >
      {children}
    </a>
  )
}

function PortfolioPage({ language }) {
  const isZh = language === 'zh'

  return (
    <PageTransition className="portfolio-resume-page">
      <section className="portfolio-resume-masthead relative overflow-hidden rounded-lg border border-line bg-surface/95 p-6 shadow-[0_24px_70px_rgba(91,64,35,0.1)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/25 sm:p-8 lg:p-10" data-no-translate>
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-cinnabar" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase text-cinnabar">
              {isZh ? '电子简历 · Portfolio' : 'Digital resume · Portfolio'}
            </p>
            <h1 className="mt-4 text-balance font-serif text-5xl font-semibold leading-[0.98] tracking-tight text-ink sm:text-7xl">
              Ziyan Wang
              <span className="mt-2 block text-2xl font-normal text-ink-faint sm:text-3xl">/ ryanbibi</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-ink sm:text-xl">
              {isZh
                ? 'NYU 信息系统学生，连接 AI 工程、数据分析与可用产品。'
                : 'NYU Information Systems student working across AI engineering, data analytics, and usable products.'}
            </p>
            <p className="mt-3 max-w-3xl leading-7 text-ink-soft">
              {isZh
                ? '目前在 AutoCoder.cc 和 Unitree Robotics + BUPT Lab 推进 AI 工作；此前在 Lenovo 完成数据分析实习。'
                : 'Currently building at AutoCoder.cc and Unitree Robotics + BUPT Lab, following a completed data-analytics internship at Lenovo.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-faint">
              <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-cinnabar" />{profile.location}</span>
              <a className="inline-flex items-center gap-2 transition hover:text-cinnabar" href={`mailto:${contactEmail}`}><Mail className="size-4" />{contactEmail}</a>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-lg border border-line bg-surface-sunk/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="font-mono text-[11px] uppercase text-ink-faint">{isZh ? '当前身份' : 'Current profile'}</p>
              <p className="mt-2 font-serif text-xl font-semibold text-ink">NYU · Information Systems</p>
              <p className="mt-1 text-sm text-ink-soft">AI Engineer & CMO · AutoCoder.cc</p>
            </div>
            <div className="print-hidden grid grid-cols-2 gap-3">
              <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cinnabar dark:bg-white dark:text-ink dark:hover:bg-cinnabar dark:hover:text-white" href={linkedInUrl} rel="noreferrer" target="_blank">
                LinkedIn <ArrowUpRight className="size-4" />
              </a>
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink-soft transition hover:-translate-y-0.5 hover:border-cinnabar/40 hover:text-cinnabar dark:border-white/10 dark:bg-white/[0.05]" onClick={() => window.print()} type="button">
                <Printer className="size-4" /> {isZh ? '打印' : 'Print'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProfessionalCases language={language} />

      <ProfessionalTimeline language={language} />

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionKicker icon={Code2} text={isZh ? '产品项目' : 'Product project'} />
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink">
              Pathfinder
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-ink-faint">
            {isZh ? '个人探索与轻量量化追踪的多媒体网站项目。' : 'A multimedia website for personal discovery and lightweight quantified tracking.'}
          </p>
        </div>
        <div className="grid gap-4">
        {portfolioCases.map((item) => (
          <PortfolioCaseStudy item={item} key={item.title} />
        ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <BentoCard className="lg:col-span-7" title="Capability Stack" icon={Database}>
          <div className="grid gap-4">
            {capabilityStack.map((item) => (
              <div key={item.label}>
                <ProgressLabel label={item.label} value={item.value} color={item.color} />
                <p className="mt-2 text-sm leading-6 text-ink-faint">{item.detail}</p>
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-5" title="Working Principles" icon={Zap}>
          <div className="grid gap-3">
            {workingPrinciples.map((principle, index) => (
              <div
                className="rounded-lg border border-line bg-surface-sunk/70 p-4 dark:border-white/10 dark:bg-white/[0.04]"
                key={principle}
              >
                <p className="font-mono text-[11px] uppercase text-cinnabar">
                  principle 0{index + 1}
                </p>
                <p className="mt-2 font-semibold leading-6 text-ink">{principle}</p>
              </div>
            ))}
          </div>
        </BentoCard>

      </section>
    </PageTransition>
  )
}

const caseStudyIcons = {
  'signal-feedback-intelligence': BarChart3,
  autocoder: Sparkles,
  'unitree-embodied-ai': Activity,
  'lenovo-data-analytics': Database,
}

function FeaturedProfessionalCases({ language }) {
  const isZh = language === 'zh'

  return (
    <section data-no-translate>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionKicker icon={BadgeCheck} text={isZh ? '精选案例' : 'Featured case studies'} />
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            {isZh ? '从角色名称进入真实工作。' : 'From role titles into the actual work.'}
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-ink-faint">
          {isZh
            ? '职业经历与个人项目都只使用可验证的信息；进行中的工作会明确标注。'
            : 'Professional work and personal projects both use verifiable evidence, with active work clearly marked as in progress.'}
        </p>
      </div>

      <div className="portfolio-case-grid grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {professionalCaseStudies.map((caseStudy) => {
          const experience = professionalExperiences.find(
            (item) => item.company === caseStudy.company,
          )
          const period = caseStudy.period?.[language] || experience?.period
          const role = caseStudy.role?.[language] || experience?.role
          const Icon = caseStudyIcons[caseStudy.slug] || BriefcaseBusiness

          return (
            <motion.a
              {...cardMotion}
              className="ui-card-interactive group relative flex min-h-[360px] flex-col overflow-hidden rounded-lg border border-line bg-surface/94 p-6 shadow-[0_16px_42px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20"
              href={`#/portfolio/${caseStudy.slug}`}
              key={caseStudy.slug}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: caseStudy.accent }}
              />
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-lg border border-line bg-surface-sunk text-cinnabar dark:border-white/10 dark:bg-white/[0.05]">
                  <Icon className="size-5" />
                </span>
                <span
                  className={cn(
                    'rounded-md px-2 py-1 font-mono text-[10px] uppercase',
                    caseStudy.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : 'bg-stone-500/10 text-ink-faint',
                  )}
                >
                  {caseStudy.status === 'active'
                    ? isZh
                      ? '进行中'
                      : 'Active'
                    : isZh
                      ? '已完成'
                      : 'Complete'}
                </span>
              </div>

              <p className="mt-6 font-mono text-[11px] uppercase text-cinnabar">
                {period}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-ink">
                {caseStudy.company}
              </h3>
              <p className="mt-1 text-sm font-semibold text-ink-soft">{role}</p>
              <p className="mt-5 font-serif text-lg font-semibold leading-7 text-ink">
                {caseStudy.headline[language]}
              </p>

              <div className="mt-auto grid grid-cols-3 gap-2 pt-6">
                {caseStudy.metrics.slice(0, 3).map((metric) => (
                  <div className="rounded-lg bg-surface-sunk/75 p-3 dark:bg-white/[0.05]" key={metric.label.en}>
                    <p className="font-mono text-sm font-bold text-ink">{metric.value}</p>
                    <p className="mt-1 text-[10px] leading-4 text-ink-faint">{metric.label[language]}</p>
                  </div>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-faint transition group-hover:text-cinnabar">
                {isZh ? '查看案例' : 'Open case study'} <ArrowUpRight className="size-4" />
              </span>
            </motion.a>
          )
        })}
      </div>
    </section>
  )
}

function PortfolioCasePage({ language, route }) {
  const isZh = language === 'zh'
  const slug = route.split('/')[1]
  const caseStudy = findProfessionalCase(slug)

  if (!caseStudy) return <PortfolioPage language={language} />

  const experience = professionalExperiences.find((item) => item.company === caseStudy.company)
  const role = caseStudy.role?.[language] || experience?.role
  const period = caseStudy.period?.[language] || experience?.period
  const location = caseStudy.location?.[language] || experience?.location
  const metaLabel = caseStudy.metaLabel?.[language] || (isZh ? '地点' : 'Location')
  const highlights = caseStudy.highlights?.[language] || experience?.highlights?.[language] || []
  const Icon = caseStudyIcons[caseStudy.slug] || BriefcaseBusiness
  const caseIndex = professionalCaseStudies.findIndex((item) => item.slug === caseStudy.slug)
  const previousCase = professionalCaseStudies[(caseIndex - 1 + professionalCaseStudies.length) % professionalCaseStudies.length]
  const nextCase = professionalCaseStudies[(caseIndex + 1) % professionalCaseStudies.length]
  const evidenceStatus = {
    verified: {
      icon: BadgeCheck,
      label: isZh ? '公开可验证' : 'Publicly verified',
      className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    },
    private: {
      icon: ShieldCheck,
      label: isZh ? '因保密不公开' : 'Private artifact',
      className: 'bg-stone-500/10 text-ink-faint',
    },
    pending: {
      icon: Clock3,
      label: isZh ? '等待公开结果' : 'Pending release',
      className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    },
  }

  return (
    <PageTransition className="portfolio-resume-page" data-no-translate>
      <nav className="print-hidden flex flex-wrap items-center gap-2 text-sm text-ink-faint">
        <a className="transition hover:text-cinnabar" href="#/portfolio">
          Portfolio
        </a>
        <ChevronRight className="size-3.5" />
        <span className="text-ink-soft">{caseStudy.company}</span>
      </nav>

      <section className="portfolio-case-hero relative overflow-hidden rounded-lg border border-line bg-surface/95 p-6 shadow-[0_24px_70px_rgba(91,64,35,0.1)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/25 sm:p-8 lg:p-10">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: caseStudy.accent }} />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid size-11 place-items-center rounded-lg border border-line bg-surface-sunk text-cinnabar dark:border-white/10 dark:bg-white/[0.05]">
                <Icon className="size-5" />
              </span>
              <span className={cn('rounded-md px-2.5 py-1 font-mono text-[11px] uppercase', caseStudy.status === 'active' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-stone-500/10 text-ink-faint')}>
                {caseStudy.status === 'active' ? (isZh ? '进行中' : 'Active') : isZh ? '已完成' : 'Complete'}
              </span>
            </div>
            <p className="mt-6 font-mono text-xs uppercase text-cinnabar">{period}</p>
            <h1 className="mt-3 text-balance font-serif text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl">
              {caseStudy.company}
            </h1>
            <p className="mt-3 text-lg font-semibold text-ink-soft">{role}</p>
            <p className="mt-6 max-w-3xl font-serif text-xl font-semibold leading-8 text-ink sm:text-2xl">
              {caseStudy.headline[language]}
            </p>
            <p className="mt-4 max-w-3xl leading-8 text-ink-soft">
              {caseStudy.context[language]}
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-lg border border-line bg-surface-sunk/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="font-mono text-[11px] uppercase text-ink-faint">{metaLabel}</p>
              <p className="mt-2 inline-flex items-center gap-2 font-semibold text-ink"><MapPin className="size-4 text-cinnabar" />{location}</p>
            </div>
            <div className="print-hidden grid grid-cols-2 gap-3">
              <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cinnabar dark:bg-white dark:text-ink" href={`mailto:${contactEmail}`}>
                <Mail className="size-4" /> {isZh ? '联系' : 'Contact'}
              </a>
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink-soft transition hover:-translate-y-0.5 hover:border-cinnabar/40 hover:text-cinnabar dark:border-white/10 dark:bg-white/[0.05]" onClick={() => window.print()} type="button">
                <Printer className="size-4" /> {isZh ? '打印' : 'Print'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="portfolio-case-metrics grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {caseStudy.metrics.map((metric) => (
          <article className="rounded-lg border border-line bg-surface/92 p-5 dark:border-white/10 dark:bg-white/[0.045]" key={metric.label.en}>
            <p className="font-serif text-3xl font-semibold tracking-tight text-ink">{metric.value}</p>
            <p className="mt-2 font-mono text-[11px] uppercase text-ink-faint">{metric.label[language]}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <article className="rounded-lg border border-line bg-surface/92 p-6 dark:border-white/10 dark:bg-white/[0.045] lg:col-span-5">
          <SectionKicker icon={Zap} text={isZh ? '问题' : 'Challenge'} />
          <p className="mt-5 font-serif text-xl font-semibold leading-8 text-ink">
            {caseStudy.challenge[language]}
          </p>
        </article>

        <article className="rounded-lg border border-line bg-surface/92 p-6 dark:border-white/10 dark:bg-white/[0.045] lg:col-span-7">
          <SectionKicker icon={BadgeCheck} text={isZh ? '验证成果' : 'Verified outcomes'} />
          <div className="mt-5 grid gap-3">
            {highlights.map((highlight) => (
              <div className="flex gap-3 leading-7 text-ink-soft" key={highlight}>
                <BadgeCheck className="mt-1 size-4 shrink-0 text-cinnabar" />
                <p>{highlight}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-line bg-surface/92 p-6 dark:border-white/10 dark:bg-white/[0.045] sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionKicker icon={Database} text={isZh ? '工作流' : 'Workflow'} />
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink">
              {isZh ? '从输入到结果。' : 'From input to outcome.'}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase text-ink-faint">{caseStudy.workflow.length} stages</span>
        </div>
        <ol className="relative mt-8 grid gap-7 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-4">
          <span aria-hidden="true" className="absolute left-0 right-0 top-4 hidden h-px bg-line xl:block dark:bg-white/10" />
          {caseStudy.workflow.map((step, index) => (
            <li className="relative pl-12 md:pl-0 md:pt-11" key={step.title.en}>
              <span aria-hidden="true" className="absolute bottom-0 left-4 top-8 w-px bg-line md:hidden dark:bg-white/10" />
              <span className="absolute left-0 top-0 z-10 grid size-8 place-items-center rounded-full border border-cinnabar/35 bg-surface font-mono text-[11px] font-bold text-cinnabar shadow-sm md:left-0 dark:bg-slate-950">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-xl font-semibold text-ink">{step.title[language]}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{step.detail[language]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-lg border border-line bg-surface/92 p-6 dark:border-white/10 dark:bg-white/[0.045] sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 dark:border-white/10 sm:flex-row sm:items-end">
          <div>
            <SectionKicker icon={FileText} text={isZh ? '案例证据' : 'Evidence registry'} />
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink">
              {isZh ? '每条结论都有出处，也有公开边界。' : 'Every claim has a source and a disclosure boundary.'}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-ink-faint">
            {isZh
              ? '这里区分公开可验证、因保密不公开与仍等待发布的材料。'
              : 'Claims are separated into publicly verified, private, and pending evidence.'}
          </p>
        </div>

        <div className="divide-y divide-line dark:divide-white/10">
          {(caseStudy.evidence || []).map((item) => {
            const status = evidenceStatus[item.status] || evidenceStatus.pending
            const StatusIcon = status.icon

            return (
              <article className="grid gap-3 py-5 first:pt-6 last:pb-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6" key={item.label.en}>
                <div>
                  <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[10px] font-semibold uppercase', status.className)}>
                    <StatusIcon className="size-3.5" />
                    {status.label}
                  </span>
                  <p className="mt-3 font-semibold text-ink">{item.label[language]}</p>
                </div>
                <div>
                  <p className="leading-7 text-ink-soft">{item.claim[language]}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase text-ink-faint">
                    {isZh ? '来源' : 'Source'} · {item.source[language]}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-lg border border-line bg-surface/92 p-6 dark:border-white/10 dark:bg-white/[0.045]">
          <p className="font-mono text-xs uppercase text-cinnabar">{isZh ? '技术栈' : 'Stack'}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {caseStudy.stack.map((item) => (
              <span className="rounded-lg border border-line bg-surface-sunk px-3 py-2 text-sm font-semibold text-ink-soft dark:border-white/10 dark:bg-white/[0.05]" key={item}>{item}</span>
            ))}
          </div>
        </article>
        <aside className="rounded-lg border border-cinnabar/25 bg-cinnabar/8 p-6">
          <p className="font-mono text-xs uppercase text-cinnabar">{isZh ? '公开说明' : 'Disclosure'}</p>
          <p className="mt-3 text-sm leading-7 text-ink-soft">{caseStudy.disclosure[language]}</p>
        </aside>
      </section>

      <nav className="print-hidden grid gap-3 sm:grid-cols-2">
        <a className="group rounded-lg border border-line bg-surface/92 p-5 transition hover:border-cinnabar/35 dark:border-white/10 dark:bg-white/[0.045]" href={`#/portfolio/${previousCase.slug}`}>
          <p className="font-mono text-[11px] uppercase text-ink-faint">{isZh ? '上一个案例' : 'Previous case'}</p>
          <p className="mt-2 font-serif text-xl font-semibold text-ink transition group-hover:text-cinnabar"><ChevronLeft className="mr-1 inline size-4" />{previousCase.company}</p>
        </a>
        <a className="group rounded-lg border border-line bg-surface/92 p-5 text-right transition hover:border-cinnabar/35 dark:border-white/10 dark:bg-white/[0.045]" href={`#/portfolio/${nextCase.slug}`}>
          <p className="font-mono text-[11px] uppercase text-ink-faint">{isZh ? '下一个案例' : 'Next case'}</p>
          <p className="mt-2 font-serif text-xl font-semibold text-ink transition group-hover:text-cinnabar">{nextCase.company}<ChevronRight className="ml-1 inline size-4" /></p>
        </a>
      </nav>
    </PageTransition>
  )
}

const experienceIcons = {
  ai: Sparkles,
  data: Database,
  finance: BarChart3,
  research: FileText,
  support: Code2,
}

function ProfessionalTimeline({ language }) {
  const isZh = language === 'zh'
  const primaryEducation = education.slice(0, 2)
  const earlierEducation = education.slice(2)

  return (
    <section data-no-translate>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionKicker icon={BriefcaseBusiness} text={isZh ? '完整经历' : 'Career record'} />
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            {isZh ? '完整时间线，不重复案例详情。' : 'The complete timeline, without repeating the case studies.'}
          </h2>
        </div>
        <div className="max-w-xl text-sm leading-6 text-ink-faint">
          <p>
            {isZh
              ? '这里负责日期、角色与核心成果；完整过程留在上方案例页。'
              : 'Dates, roles, and one proof point live here. Full methods stay in the case-study pages above.'}
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase">
            {isZh ? profile.sourceLabel.zh : profile.sourceLabel.en}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {professionalExperiences.map((experience) => (
          <ExperienceCard
            experience={experience}
            key={`${experience.company}-${experience.period}`}
            language={language}
          />
        ))}
      </div>

      <div className="mt-7">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg border border-line bg-surface text-cinnabar dark:border-white/10 dark:bg-white/[0.05]">
            <GraduationCap className="size-4" />
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase text-cinnabar">
              {isZh ? '教育背景' : 'Education'}
            </p>
            <h3 className="font-serif text-2xl font-semibold tracking-tight text-ink">
              {isZh ? '从计算机科学到信息系统' : 'From computer science to information systems'}
            </h3>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {primaryEducation.map((item) => (
            <article
              className="rounded-lg border border-line bg-surface/92 p-4 shadow-[0_12px_30px_rgba(91,64,35,0.07)] dark:border-white/10 dark:bg-white/[0.045]"
              key={`${item.school}-${item.period}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-serif text-base font-semibold leading-tight text-ink">{item.school}</h4>
                {item.current && (
                  <span className="rounded-md bg-cinnabar/10 px-2 py-1 font-mono text-[10px] uppercase text-cinnabar">
                    {isZh ? '当前' : 'Current'}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-ink-soft">{item.program}</p>
              <p className="mt-3 font-mono text-xs text-ink-faint">{item.period}</p>
            </article>
          ))}
        </div>
        <details className="mt-3 rounded-lg border border-line bg-surface/70 p-4 dark:border-white/10 dark:bg-white/[0.035]">
          <summary className="cursor-pointer font-semibold text-ink transition hover:text-cinnabar">
            {isZh ? '查看更早教育经历' : 'View earlier education'}
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {earlierEducation.map((item) => (
              <article
                className="rounded-lg border border-line bg-surface-sunk/65 p-4 dark:border-white/10 dark:bg-white/[0.04]"
                key={`${item.school}-${item.period}`}
              >
                <h4 className="font-serif text-base font-semibold leading-tight text-ink">{item.school}</h4>
                <p className="mt-2 text-sm font-semibold text-ink-soft">{item.program}</p>
                <p className="mt-3 font-mono text-xs text-ink-faint">{item.period}</p>
              </article>
            ))}
          </div>
        </details>
      </div>
    </section>
  )
}

function ExperienceCard({ experience, language }) {
  const isZh = language === 'zh'
  const Icon = experienceIcons[experience.icon] || BriefcaseBusiness
  const highlights = isZh ? experience.highlights.zh : experience.highlights.en
  const caseStudy = professionalCaseStudies.find((item) => item.company === experience.company)

  return (
    <article
      className="relative grid gap-4 overflow-hidden rounded-lg border border-line bg-surface/92 p-4 shadow-[0_14px_34px_rgba(91,64,35,0.07)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6 sm:p-5"
    >
      <span className="absolute inset-y-0 left-0 w-0.5 bg-cinnabar/60" aria-hidden="true" />
      <div className="flex items-start gap-3 sm:block">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-cinnabar/20 bg-cinnabar/8 text-cinnabar">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 sm:mt-4">
          <p className="font-mono text-[11px] uppercase text-cinnabar">{experience.period}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-faint">
            <MapPin className="size-3.5" />
            {experience.location}
          </p>
          {experience.current && (
            <span className="mt-2 block w-fit rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-[10px] uppercase text-emerald-700 dark:text-emerald-300">
              {isZh ? '进行中' : 'Active'}
            </span>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="font-serif text-xl font-semibold leading-tight tracking-tight text-ink sm:text-2xl">
          {experience.company}
        </h3>
        <p className="mt-1 text-sm font-semibold text-ink-soft">{experience.role}</p>
        {caseStudy ? (
          <p className="mt-3 text-sm leading-6 text-ink-soft">{caseStudy.headline[language]}</p>
        ) : (
          <>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              {isZh ? experience.summary.zh : experience.summary.en}
            </p>
            {highlights[0] && (
              <p className="mt-3 border-l-2 border-cinnabar/45 pl-3 text-sm font-medium leading-6 text-ink">
                {highlights[0]}
              </p>
            )}
          </>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3 dark:border-white/10">
          {!caseStudy &&
            experience.tags.slice(0, 3).map((tag) => (
              <span
                className="rounded-md bg-cinnabar/8 px-2.5 py-1 text-xs font-semibold text-cinnabar"
                key={tag}
              >
                {tag}
              </span>
            ))}
          {experience.link && (
            <a
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-ink-faint transition hover:text-cinnabar"
              href={experience.link}
              rel="noreferrer"
              target="_blank"
            >
              DOI <ArrowUpRight className="size-3.5" />
            </a>
          )}
          {caseStudy && (
            <a
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-ink-faint transition hover:text-cinnabar"
              href={`#/portfolio/${caseStudy.slug}`}
            >
              {isZh ? '案例详情' : 'Case study'} <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function PortfolioCaseStudy({ item }) {
  const Icon = item.icon

  return (
    <motion.article
      {...cardMotion}
      className="rounded-lg border border-line bg-surface/92 p-6 shadow-[0_16px_42px_rgba(91,64,35,0.08)] transition hover:border-cinnabar/30 dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-cinnabar/20 bg-cinnabar/8 text-cinnabar">
            <Icon className="size-5" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase text-ink-faint">{item.caseType}</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink">{item.title}</h2>
            <p className="mt-1 text-sm text-ink-faint">{item.role}</p>
          </div>
        </div>
        <ArrowUpRight className="size-5 text-ink-faint" />
      </div>

      <div className="mt-6 rounded-lg border border-line bg-surface-sunk/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="font-mono text-xs uppercase text-cinnabar">case headline</p>
        <p className="mt-2 font-serif text-xl font-semibold leading-snug tracking-tight text-ink">{item.headline}</p>
      </div>

      <div className="mt-6 grid gap-4">
        <CaseSection label="Problem" text={item.problem} />
        <div className="rounded-lg border border-line bg-surface-sunk/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="font-mono text-xs uppercase text-ink-faint">What I did</p>
          <div className="mt-3 grid gap-2">
            {item.actions.map((action) => (
              <div className="flex gap-3 leading-6 text-ink-soft" key={action}>
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cinnabar" />
                <p>{action}</p>
              </div>
            ))}
          </div>
        </div>
        <CaseSection label="Outcome" text={item.outcome} />
        <div className="rounded-lg border border-line bg-surface-sunk/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="font-mono text-xs uppercase text-ink-faint">Proof points</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.proof.map((proof) => (
              <span
                className="rounded-lg bg-cinnabar/8 px-3 py-1.5 text-sm text-cinnabar"
                key={proof}
              >
                {proof}
              </span>
            ))}
          </div>
        </div>
        <CaseSection label="Next layer" text={item.next} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            className="rounded-lg border border-line bg-surface-sunk px-3 py-1 text-sm text-ink-soft dark:border-white/10 dark:bg-white/[0.07]"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  )
}

function CaseSection({ label, text }) {
  return (
    <div className="rounded-lg border border-line bg-surface-sunk/60 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="font-mono text-xs uppercase text-ink-faint">{label}</p>
      <p className="mt-2 leading-7 text-ink-soft">{text}</p>
    </div>
  )
}

function WorkIndexPage() {
  return (
    <PageTransition>
      <PageHeader
        icon={Shapes}
        kicker="/Lab"
        subtitle="A cabinet of interactive experiments. Each piece has its own visual language, canvas, and reason to exist."
        title="Interactive Lab"
      />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work) => (
          <WorkCard key={work.slug} work={work} />
        ))}
      </section>
    </PageTransition>
  )
}

function WorkPreview({ work, hovered }) {
  // Default: an instant accent cover. On hover (desktop only), mount the real
  // work in a muted, non-interactive iframe so the card previews live motion.
  const [canHover] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )
  const showLive = canHover && hovered && (work.embed || work.poster == null)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-sunk">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${work.accent}2e, transparent 60%), linear-gradient(135deg, ${work.accent}1f, transparent 70%)`,
        }}
      >
        <span
          className="select-none font-serif text-6xl font-semibold tracking-tight opacity-25"
          style={{ color: work.accent }}
          data-no-translate
        >
          {work.title}
        </span>
      </div>

      {work.poster && (
        <img
          alt={work.title}
          className="absolute inset-0 size-full object-cover"
          decoding="async"
          loading="lazy"
          src={work.poster}
        />
      )}

      {showLive && work.embed && (
        <iframe
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 size-full border-0 transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          src={work.embed}
          tabIndex={-1}
          title=""
        />
      )}

      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: work.accent }}
      />
    </div>
  )
}

function WorkCard({ work }) {
  const clickable = work.status !== 'concept'
  const [hovered, setHovered] = useState(false)
  const statusTone =
    work.status === 'live'
      ? 'text-cinnabar'
      : work.status === 'wip'
        ? 'text-ink-soft'
        : 'text-ink-faint'

  const body = (
    <>
      <WorkPreview work={work} hovered={hovered} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide">
            <span className="size-2 rounded-full" style={{ background: work.accent }} />
            <span className={statusTone}>{STATUS_LABEL[work.status]}</span>
          </span>
          <span className="font-mono text-[11px] text-ink-faint">{work.year}</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2.5">
          <h2 className="font-serif text-2xl font-semibold text-ink" data-no-translate>
            {work.title}
          </h2>
          <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">{work.en}</span>
        </div>
        <p className="mt-2 line-clamp-2 leading-6 text-ink-soft">{work.blurb}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          {work.tags.slice(0, 3).map((tag) => (
            <span
              className="rounded-md border border-line bg-surface-sunk px-2 py-0.5 text-[11px] text-ink-faint dark:border-white/10 dark:bg-white/[0.05]"
              key={tag}
            >
              {tag}
            </span>
          ))}
          {clickable && (
            <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-ink-faint transition group-hover:text-cinnabar">
              {work.status === 'live' ? 'Open' : 'Preview'}
              <ArrowUpRight className="size-4" />
            </span>
          )}
        </div>
      </div>
    </>
  )

  const className =
    'group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface/92 shadow-[0_16px_42px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20'

  if (!clickable) {
    return <div className={cn(className, 'opacity-80')}>{body}</div>
  }
  return (
    <motion.a
      {...cardMotion}
      className={cn(className, 'ui-card-interactive')}
      href={`#/lab/${work.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {body}
    </motion.a>
  )
}

function WorkLoading({ work }) {
  return (
    <div className="grid min-h-[60vh] place-items-center rounded-lg border border-line bg-surface/92 dark:border-white/10 dark:bg-white/[0.045]">
      <div className="text-center">
        <span
          className="mx-auto block size-3 animate-ping rounded-full"
          style={{ background: work.accent }}
        />
        <p className="mt-4 font-mono text-xs uppercase tracking-wide text-ink-faint">
          loading {work.en}…
        </p>
      </div>
    </div>
  )
}

function WorkEmbed({ work }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="work-embed" style={{ '--work-accent': work.accent }}>
      <a className="work-embed-back" href="#/lab">
        <ChevronLeft className="size-4" /> Lab
      </a>
      {!loaded && (
        <div className="work-embed-loader">
          <span className="size-3 animate-ping rounded-full" style={{ background: work.accent }} />
          <p className="font-mono text-xs uppercase tracking-wide">loading {work.en}…</p>
        </div>
      )}
      <iframe
        allow="autoplay; fullscreen; microphone; gamepad; xr-spatial-tracking"
        className="work-embed-frame"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        src={work.embed}
        title={`${work.title} / ${work.en}`}
      />
    </div>
  )
}

function WorkDetailPage({ language, route }) {
  const slug = route.split('/')[1]
  const work = findWork(slug)

  if (!work) return <WorkIndexPage />

  // Ready works render by `type`: a React component, or a fully isolated iframe.
  if (work.status === 'live') {
    if (work.type === 'embed' && work.embed) {
      return <WorkEmbed work={work} />
    }
    const LiveExperience = WORK_COMPONENTS[slug]
    if (LiveExperience) {
      return (
        <Suspense fallback={<WorkLoading work={work} />}>
          <LiveExperience language={language} />
        </Suspense>
      )
    }
  }

  return (
    <PageTransition>
      <a
        className="inline-flex items-center gap-1 text-sm font-semibold text-ink-faint transition hover:text-cinnabar"
        href="#/lab"
      >
        <ChevronLeft className="size-4" /> Lab
      </a>
      <section className="relative overflow-hidden rounded-lg border border-line bg-surface/92 p-6 shadow-[0_18px_45px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20 sm:p-10">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: work.accent }}
        />
        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-ink-faint">
          <span className="size-2 rounded-full" style={{ background: work.accent }} />
          {STATUS_LABEL[work.status]} · {work.year}
        </span>
        <h1 className="mt-5 font-serif text-5xl font-semibold tracking-tight text-ink sm:text-7xl" data-no-translate>
          {work.title}
        </h1>
        <p className="mt-2 font-mono text-sm uppercase tracking-wide text-ink-faint">{work.en}</p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">{work.blurb}</p>
        <div className="mt-7 rounded-lg border border-dashed border-line-strong bg-surface-sunk/60 p-5 dark:border-white/15 dark:bg-white/[0.04]">
          <p className="font-mono text-xs uppercase text-cinnabar">
            {work.status === 'wip' ? 'In progress' : 'Concept'}
          </p>
          <p className="mt-2 leading-7 text-ink-soft">
            This work is still in progress. When it is ready, it will open here with a
            visual world of its own.
          </p>
        </div>
      </section>
    </PageTransition>
  )
}

export function PageHeader({ icon: Icon, kicker, subtitle, title }) {
  return (
    <section className="ui-route-hero relative overflow-hidden rounded-lg border border-line bg-surface/92 shadow-[0_18px_45px_rgba(91,64,35,0.08)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20">
      <div className="absolute inset-x-0 top-0 h-px bg-cinnabar/50" />
      <SectionKicker icon={Icon} text={kicker} />
      <h1 className="mt-5 text-balance font-serif font-semibold text-ink">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl leading-7 text-ink-soft">{subtitle}</p>
    </section>
  )
}

export function DonutChart({ data, total }) {
  const segments = data.reduce(
    (acc, item) => {
      const start = acc.cursor
      const end = start + item.value * 3.6
      return {
        cursor: end,
        items: [...acc.items, { ...item, start, end }],
      }
    },
    { cursor: 0, items: [] },
  ).items

  return (
    <div className="grid gap-5 sm:grid-cols-[0.9fr_1.1fr]">
      <div className="grid place-items-center">
        <motion.div
          initial={{ opacity: 0, rotate: -18, scale: 0.94 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
          className="relative grid size-56 place-items-center"
        >
          <svg className="size-56 overflow-visible" viewBox="0 0 200 200">
            {segments.map((item) => (
              <a href={`#/vault/${item.slug}`} key={item.slug}>
                <path
                  className="cursor-pointer transition duration-200 hover:brightness-110 focus:outline-none"
                  d={describeDonutArc(100, 100, 92, 54, item.start, item.end)}
                  fill={item.color}
                >
                  <title>
                    {item.name}: {item.value}%
                  </title>
                </path>
              </a>
            ))}
          </svg>
          <div className="pointer-events-none absolute grid size-28 place-items-center rounded-full border border-slate-200 bg-white text-center shadow-inner dark:border-white/10 dark:bg-slate-950">
            <div>
              <p className="font-mono text-3xl font-black text-ink">{total}%</p>
              <p className="mt-1 text-xs uppercase text-ink-faint">allocated</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid content-center gap-3">
        {data.map((item) => (
          <a
            className="flex items-center justify-between gap-3 rounded-lg border border-transparent p-2 transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-white/10 dark:hover:bg-white/[0.04]"
            href={`#/vault/${item.slug}`}
            key={item.name}
          >
            <span className="flex items-center gap-2 text-sm text-ink-soft">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-mono text-sm text-ink">{item.value}%</span>
          </a>
        ))}
      </div>
    </div>
  )
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeDonutArc(x, y, outerRadius, innerRadius, startAngle, endAngle) {
  const outerStart = polarToCartesian(x, y, outerRadius, startAngle)
  const outerEnd = polarToCartesian(x, y, outerRadius, endAngle)
  const innerStart = polarToCartesian(x, y, innerRadius, endAngle)
  const innerEnd = polarToCartesian(x, y, innerRadius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ')
}

export function RecoveryChart({ data }) {
  const points = data
    .map((item, index) => {
      const x = 18 + index * 44
      const y = 116 - item.recovery
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="rounded-lg border border-line bg-surface-sunk p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-ink">WHOOP Recovery</p>
          <p className="text-sm text-ink-faint">Mock API data</p>
        </div>
        <Activity className="size-5 text-cinnabar" />
      </div>
      <svg viewBox="0 0 300 130" className="h-44 w-full overflow-visible">
        <defs>
          <linearGradient id="healthFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={`18,120 ${points} 282,120`} fill="url(#healthFill)" />
        <polyline fill="none" points={points} stroke="#2dd4bf" strokeLinecap="round" strokeWidth="5" />
        {data.map((item, index) => (
          <g key={item.day}>
            <circle cx={18 + index * 44} cy={116 - item.recovery} fill="#2dd4bf" r="4" />
            <text className="fill-slate-400 text-[10px]" textAnchor="middle" x={18 + index * 44} y="128">
              {item.day}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export function BentoCard({ title, icon: Icon, className, children }) {
  return (
    <motion.article
      {...cardMotion}
      className={cn(
        'ui-card rounded-lg border border-line bg-surface/92 dark:border-white/10 dark:bg-white/[0.045]',
        className,
      )}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg border border-line bg-surface-sunk text-cinnabar dark:border-white/10 dark:bg-white/[0.05]">
            <Icon className="size-4" />
          </span>
          <h3 className="ui-card-title font-serif font-semibold text-ink">{title}</h3>
        </div>
      </div>
      {children}
    </motion.article>
  )
}

export function SectionKicker({ icon: Icon, text }) {
  return (
    <span className="ui-kicker inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-xs uppercase text-ink-soft shadow-sm shadow-stone-300/30 dark:bg-white/[0.05] dark:shadow-none">
      <Icon className="size-3.5 text-cinnabar" />
      {text}
    </span>
  )
}

export function ProgressLabel({ label, value, color = 'bg-cinnabar' }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className="font-mono text-ink">{value}%</span>
      </div>
      <Progress value={value} color={color} />
    </div>
  )
}

export function Progress({ value, color, className }) {
  return (
    <div className={cn('h-2.5 overflow-hidden rounded-full bg-line dark:bg-white/10', className)}>
      <motion.div
        className={cn('h-full rounded-full', color)}
        initial={{ width: 0 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        viewport={{ once: true }}
        whileInView={{ width: `${value}%` }}
      />
    </div>
  )
}

export function MiniMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-surface-sunk p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="font-mono text-xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs uppercase text-ink-faint">{label}</p>
    </div>
  )
}

export default App
