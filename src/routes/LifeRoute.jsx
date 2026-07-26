import {
  ArrowUpRight, Dumbbell, Gamepad2, Headphones, MapPin, MountainSnow,
  Music2, ShieldCheck, Sparkles, Utensils,
} from 'lucide-react'
import { useState } from 'react'
import {
  gamingRotation, gearLoadout, macros, musicQueue, recoveryData, spotifyProfile,
} from '../data/dashboardData'
import {
  BentoCard, MiniMetric, PageHeader, PageTransition, Progress, ProgressLabel,
  RecoveryChart, SecondaryLink, cn,
} from '../App'
import foodSummary from '../data/foodSummary.json'

const restaurantPins = foodSummary.restaurantPins

function RyanModeStory({ language }) {
  const isZh = language === 'zh'
  const modes = [
    {
      id: 'build',
      icon: Dumbbell,
      label: isZh ? '构建' : 'Build',
      eyebrow: isZh ? '身体决定节奏' : 'Body sets the pace',
      title: isZh ? '先读身体信号，再决定今天推多远。' : 'Read the body signal, then decide how far to push.',
      story: isZh
        ? 'WHOOP 恢复、碳循环宏量营养和训练负荷在这里不是打卡，它们共同回答一个问题：今天的精力应该投在哪里？'
        : 'WHOOP recovery, carb-cycle macros, and training load are not streaks here. Together they answer one question: where should today’s energy go?',
      signals: ['WHOOP recovery', 'Carbon-cycle macros', isZh ? '训练节奏' : 'Training tempo'],
    },
    {
      id: 'reset',
      icon: Gamepad2,
      label: isZh ? '重启' : 'Reset',
      eyebrow: isZh ? '下班后的频道' : 'After-hours channel',
      title: isZh ? '战术游戏和一首循环歌曲，是我的重启键。' : 'Tactical games and one song on repeat are my reset button.',
      story: isZh
        ? 'Valorant 的精确、Tarkov 的耐心、Overwatch 的团队节奏，再加上 NewJeans。它们是工作之外仍然很 Ryanbibi 的一面。'
        : 'Valorant precision, Tarkov patience, Overwatch team tempo, then NewJeans on repeat. This is the part of the system that still feels unmistakably Ryanbibi after work.',
      signals: ['Ryanbibi#bib1', 'BiboRyan#1489', 'Ryanbib1 on Spotify'],
    },
    {
      id: 'explore',
      icon: MountainSnow,
      label: isZh ? '探索' : 'Explore',
      eyebrow: isZh ? '把兴趣变成档案' : 'Turn taste into an archive',
      title: isZh ? '雪山、装备与餐桌记忆，构成地图之外的我。' : 'Snow, gear, and table memories map the life outside the screen.',
      story: isZh
        ? '滑雪与雪地摩托给我速度感，Food Atlas 留住人与餐桌的记忆。Life 不是兴趣清单，而是一组持续生长的个人坐标。'
        : 'Winter sports bring speed; the Food Atlas preserves people and table memories. Life is not an interest list. It is a growing set of personal coordinates.',
      signals: ["Arc'teryx Konseal", 'Salomon / Black Diamond', isZh ? '全球美食记忆' : 'Global food memories'],
    },
  ]
  const [activeMode, setActiveMode] = useState('build')
  const active = modes.find((mode) => mode.id === activeMode) || modes[0]
  const ActiveIcon = active.icon

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface/94 shadow-[0_22px_60px_rgba(91,64,35,0.09)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-black/20" data-no-translate>
      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="border-b border-line p-4 dark:border-white/10 lg:border-b-0 lg:border-r sm:p-5">
          <p className="px-2 pb-3 font-mono text-[11px] uppercase text-cinnabar">
            {isZh ? 'Ryan 的模式切换' : 'Ryan mode switch'}
          </p>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1" role="tablist" aria-label={isZh ? '生活模式' : 'Life modes'}>
            {modes.map((mode) => {
              const Icon = mode.icon
              return (
                <button
                  aria-selected={activeMode === mode.id}
                  className={cn(
                    'ui-card-interactive flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border px-3 py-3 text-center text-sm font-semibold lg:min-h-14 lg:flex-row lg:justify-start lg:text-left',
                    activeMode === mode.id
                      ? 'border-cinnabar/40 bg-cinnabar/10 text-cinnabar'
                      : 'border-transparent bg-surface-sunk/65 text-ink-faint hover:border-line hover:text-ink dark:bg-white/[0.035]',
                  )}
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  role="tab"
                  type="button"
                >
                  <Icon className="size-4 shrink-0" />
                  {mode.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10">
          <span aria-hidden="true" className="absolute right-6 top-5 font-serif text-7xl text-cinnabar/8 sm:text-9xl">{String(modes.findIndex((mode) => mode.id === activeMode) + 1).padStart(2, '0')}</span>
          <div className="relative max-w-3xl">
            <span className="grid size-11 place-items-center rounded-lg bg-ink text-white dark:bg-white dark:text-ink">
              <ActiveIcon className="size-5" />
            </span>
            <p className="mt-6 font-mono text-xs uppercase text-cinnabar">{active.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              {active.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-soft">{active.story}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {active.signals.map((signal) => (
                <span className="rounded-md border border-line bg-surface-sunk px-3 py-2 text-xs font-semibold text-ink-soft dark:border-white/10 dark:bg-white/[0.04]" key={signal}>{signal}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LifePage({ activeGame, language, setActiveGame }) {
  const isZh = language === 'zh'
  return (
    <PageTransition>
      <PageHeader
        icon={Sparkles}
        kicker="/Life"
        subtitle={isZh
          ? '身体信号、战术游戏、冬季装备与餐桌记忆，组成 Ryanbibi 的生活侧写。'
          : 'Body signals, tactical games, winter gear, and table memories form a personal operating portrait.'}
        title={isZh ? 'Ryan 的生活信号' : "Ryan's Life Signals"}
      />

      <RyanModeStory language={language} />

      <section className="grid gap-4 lg:grid-cols-12">
        <BentoCard className="lg:col-span-7" title={isZh ? '身体信号' : 'Body Signal'} icon={Dumbbell}>
          <p className="mb-5 font-mono text-[11px] uppercase text-ink-faint">
            {isZh ? '模拟 API 快照 · 等待连接 WHOOP' : 'Mock API snapshot · ready for WHOOP connection'}
          </p>
          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <MiniMetric label="WHOOP" value="82%" />
                <MiniMetric label="recovery" value="86%" />
                <MiniMetric label="macro split" value="100%" />
              </div>
              <div className="space-y-4">
                {macros.map((macro) => (
                  <ProgressLabel
                    color={macro.color}
                    key={macro.label}
                    label={`Carbon Cycle ${macro.label}`}
                    value={macro.value}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <RecoveryChart data={recoveryData} />
            </div>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-5" title={isZh ? '战术游戏轮换' : 'After-hours Rotation'} icon={Gamepad2}>
          <div className="mb-5 flex items-center justify-between rounded-lg border border-line bg-surface-sunk p-3">
            <span className="flex items-center gap-2 text-sm font-medium text-ink-soft">
              <span className="size-2.5 rounded-full bg-cinnabar" />
              Online
            </span>
            <span className="font-mono text-sm text-ink-faint">
              {activeGame.server}
            </span>
          </div>

          <div className="grid gap-2">
            {gamingRotation.map((game) => (
              <button
                className={cn(
                  'ui-card-interactive rounded-lg border p-3 text-left',
                  activeGame.title === game.title
                    ? 'border-cinnabar/40 bg-cinnabar/10 text-ink'
                    : 'border-line bg-surface-sunk text-ink-soft dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300',
                )}
                key={game.title}
                onClick={() => setActiveGame(game)}
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{game.title}</span>
                  <span className="font-mono text-xs">{game.value}%</span>
                </div>
                <div className="mt-3 grid gap-1 text-xs text-ink-faint">
                  <span>{game.meta}</span>
                  <span className="font-mono">
                    {game.server}: {game.handle}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </BentoCard>

        <BentoCard className="overflow-hidden lg:col-span-7" title={isZh ? '冬季装备档案' : 'Winter Loadout'} icon={MountainSnow}>
          <div className="relative min-h-[330px] rounded-lg border border-line bg-[linear-gradient(135deg,rgba(20,19,15,0.07),rgba(138,131,120,0.16),rgba(193,67,46,0.12))] p-4 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(138,131,120,0.12),rgba(217,99,78,0.12))]">
            <div className="grid h-full gap-4 sm:grid-cols-2">
              <div className="flex min-h-48 flex-col justify-between rounded-lg border border-white/40 bg-white/62 p-4 shadow-lg shadow-slate-300/40 backdrop-blur dark:border-white/10 dark:bg-slate-950/50 dark:shadow-black/30">
                <MountainSnow className="size-8 text-cinnabar" />
                <div>
                  <h3 className="text-2xl font-bold text-ink">{isZh ? '冬季运动' : 'Winter Sports'}</h3>
                  <p className="mt-2 leading-7 text-ink-soft">
                    {isZh
                      ? 'Laurel Mountain、Coldstream Adventures、滑雪、单板和雪地摩托带来的速度感。'
                      : 'Laurel Mountain runs, Coldstream Adventures, snowboarding, skiing, and snowmobile energy.'}
                  </p>
                </div>
              </div>

              <div className="flex min-h-48 flex-col justify-between rounded-lg border border-white/40 bg-white/62 p-4 shadow-lg shadow-slate-300/40 backdrop-blur dark:border-white/10 dark:bg-slate-950/50 dark:shadow-black/30">
                <ShieldCheck className="size-8 text-cinnabar" />
                <div>
                  <h3 className="text-2xl font-bold text-ink">{isZh ? '装备清单' : 'Gear Loadout'}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {gearLoadout.map((gear) => (
                      <span
                        className="rounded-lg border border-line bg-surface/70 px-3 py-1.5 text-sm text-ink-soft backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                        key={gear}
                      >
                        {gear}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-5" title={isZh ? 'Ryanbib1 正在播放' : 'Ryanbib1 on Repeat'} icon={Headphones}>
          <div className="space-y-4">
            <a
              className="ui-card-interactive block rounded-lg border border-line bg-surface-sunk p-4"
              href={spotifyProfile.url}
              rel="noreferrer"
              target="_blank"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{isZh ? 'Spotify 主页' : 'Spotify Profile'}</p>
                  <p className="mt-1 font-mono text-sm text-cinnabar">
                    {spotifyProfile.username}
                  </p>
                </div>
                <ArrowUpRight className="size-5 text-cinnabar" />
              </div>
              <div className="mt-4 grid gap-3">
                {spotifyProfile.modules.map((module) => (
                  <ProgressLabel
                    color="bg-cinnabar"
                    key={module.label}
                    label={module.label}
                    value={module.value}
                  />
                ))}
              </div>
            </a>

            {musicQueue.map((track, index) => (
              <div
                className="rounded-lg border border-line bg-surface-sunk p-4 dark:border-white/10 dark:bg-white/[0.04]"
                key={track.title}
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-ink text-white dark:bg-white dark:text-ink">
                    <Music2 className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{track.title}</p>
                    <p className="text-sm text-ink-faint">{track.artist}</p>
                  </div>
                  {index === 0 && (
                    <span className="ml-auto rounded-lg bg-cinnabar/12 px-2 py-1 text-xs text-cinnabar">
                      live
                    </span>
                  )}
                </div>
                <Progress value={track.progress} color="bg-cinnabar" className="mt-4" />
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-12" title={isZh ? '味觉也是个人档案' : 'Taste Belongs in the Record'} icon={Utensils}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-2xl text-sm leading-6 text-ink-faint">
              {isZh
                ? '这里仅保留少量坐标线索；完整餐厅、真实探店与 Choice 记忆都收录在 Global Food Atlas。'
                : 'Only a few coordinate cues live here. The full restaurant archive, real visits, and Choice memories belong in the Global Food Atlas.'}
            </p>
            <SecondaryLink href="#/food">Open Food Atlas</SecondaryLink>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {restaurantPins.map((pin) => (
              <div
                className="rounded-lg border border-line bg-surface-sunk p-4 dark:border-white/10 dark:bg-white/[0.04]"
                key={pin.name}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 size-5 shrink-0 text-cinnabar" />
                  <div>
                    <p className="font-semibold text-ink">{pin.name}</p>
                    <p className="mt-1 text-sm text-ink-faint">{pin.cuisine}</p>
                    <p className="mt-3 font-mono text-xs uppercase text-ink-faint">
                      {pin.coordinates
                        ? `${pin.coordinates.lat}, ${pin.coordinates.lng}`
                        : pin.note}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </section>
    </PageTransition>
  )
}

export default function LifeRoute({ language = 'en' }) {
  const [activeGame, setActiveGame] = useState(gamingRotation[0])
  return <LifePage activeGame={activeGame} language={language} setActiveGame={setActiveGame} />
}
