import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  Heart,
  LayoutDashboard,
  Link2,
  MessageCircleQuestion,
  Send,
  Server,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react'

const roomImage = '/works/game-night-invite/cozy-gaming-room.png'

const copy = {
  en: {
    back: 'Back to Lab',
    eyebrow: 'Product experiment / 2026',
    title: 'Game Night Invite',
    intro:
      'A small invitation product for a very human question: do you want to play together tonight?',
    note:
      'The final experience is intentionally smaller than the planning problem. One question keeps the emotional center clear; the backend keeps the answer from disappearing in chat.',
    openPrototype: 'Open local prototype',
    localOnly: 'The interactive prototype is running locally on port 5174.',
    flowLabel: 'The flow',
    flowTitle: 'From a vague plan to one clear answer.',
    flowIntro:
      'The original multi-step booking idea became a private question link. The recipient only sees the decision that matters, while the sender gets a calm place to check the response.',
    steps: [
      {
        icon: MessageCircleQuestion,
        title: 'Create one question',
        detail: 'Write the prompt and choose Chinese or English copy.',
      },
      {
        icon: Link2,
        title: 'Share a private link',
        detail: 'A unique question ID makes the invitation easy to send.',
      },
      {
        icon: Users,
        title: 'Recipient taps once',
        detail: 'Yes and No end the decision without exposing the dashboard.',
      },
      {
        icon: LayoutDashboard,
        title: 'Watch the answer arrive',
        detail: 'The admin view shows status, timestamps, and response metadata.',
      },
    ],
    architectureLabel: 'What is actually happening',
    architectureTitle: 'A soft interface on top of a very simple system.',
    layers: [
      {
        icon: Sparkles,
        label: 'Creator UI',
        detail: 'A focused form generates the invitation instead of collecting unnecessary details.',
      },
      {
        icon: Server,
        label: 'Express API',
        detail: 'The server creates IDs, validates answers, and writes a small JSON data store.',
      },
      {
        icon: Database,
        label: 'Admin dashboard',
        detail: 'The sender can see pending, Yes, and No states with created and answered times.',
      },
    ],
    resultLabel: 'Design decisions',
    resultTitle: 'Cute is doing product work here.',
    results: [
      'The Yes / No choice is the only required action.',
      'No answer can be submitted twice, so the signal stays legible.',
      'Chinese and English are complete modes, not mixed strings in the same screen.',
    ],
    stackLabel: 'Stack',
    stack: ['React', 'Vite', 'Express', 'REST API', 'JSON persistence', 'Responsive UI'],
    proofLabel: 'Project note',
    proof:
      'This is a personal product experiment. The public site documents the interaction and system design; the working API demo remains local until authentication and deployment are added.',
    yes: 'Yes',
    no: 'No',
  },
  zh: {
    back: '返回 Lab',
    eyebrow: '产品实验 / 2026',
    title: '今晚开黑吗？',
    intro: '一个为非常真实的问题做的小邀请产品：今晚要不要一起玩？',
    note:
      '最终体验刻意比原本的计划更小。一个问题保留了情绪中心；后台则让回答不会消失在聊天记录里。',
    openPrototype: '打开本地原型',
    localOnly: '交互原型当前运行在本地 5174 端口。',
    flowLabel: '交互流程',
    flowTitle: '从模糊的计划，到一个明确的回答。',
    flowIntro:
      '原本复杂的预约想法被收束成一条专属提问链接。收件人只看到真正需要决定的事情，发起人则有一个安静的地方等待回答。',
    steps: [
      {
        icon: MessageCircleQuestion,
        title: '创建一个问题',
        detail: '写下问题，并选择中文或英文模式。',
      },
      {
        icon: Link2,
        title: '分享专属链接',
        detail: '每个问题都有唯一 ID，可以直接发送给对方。',
      },
      {
        icon: Users,
        title: '对方点一次',
        detail: 'Yes 和 No 结束决定，同时不暴露后台。',
      },
      {
        icon: LayoutDashboard,
        title: '在后台等待回答',
        detail: '发起人可以查看状态、时间戳和回答元数据。',
      },
    ],
    architectureLabel: '实际发生了什么',
    architectureTitle: '柔软的界面，建立在一个很简单的系统上。',
    layers: [
      {
        icon: Sparkles,
        label: '发起人界面',
        detail: '用一个聚焦的表单生成邀请，不收集不必要的信息。',
      },
      {
        icon: Server,
        label: 'Express API',
        detail: '服务端创建 ID、校验回答，并写入轻量 JSON 数据存储。',
      },
      {
        icon: Database,
        label: '后台数据面板',
        detail: '发起人可以看到等待中、Yes、No，以及创建和回答时间。',
      },
    ],
    resultLabel: '设计决策',
    resultTitle: '可爱在这里确实完成了产品工作。',
    results: [
      'Yes / No 是唯一必须完成的动作。',
      '同一个问题不能重复提交，信号因此保持清晰。',
      '中英文是完整模式，而不是同一屏里混杂的字符串。',
    ],
    stackLabel: '技术栈',
    stack: ['React', 'Vite', 'Express', 'REST API', 'JSON 持久化', '响应式 UI'],
    proofLabel: '项目说明',
    proof:
      '这是一个个人产品实验。个人网站展示交互和系统设计；可工作的 API 演示暂时保留在本地，正式公开前还需要加入管理员登录和部署。',
    yes: '要！',
    no: '不了',
  },
}

export default function GameNight({ language = 'en' }) {
  const t = copy[language === 'zh' ? 'zh' : 'en']
  const localPrototype =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#f3c2d5] bg-[#fff8fb] text-[#3d2534] shadow-[0_24px_80px_rgba(137,69,104,0.18)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_8%,rgba(228,190,255,0.5),transparent_30%),radial-gradient(circle_at_12%_34%,rgba(255,213,225,0.8),transparent_34%)]" />

      <div className="relative p-5 sm:p-8 lg:p-10">
        <a className="inline-flex items-center gap-2 text-sm font-semibold text-[#8a5471] transition hover:text-[#d84f87]" href="#/lab">
          <ArrowLeft className="size-4" />
          {t.back}
        </a>

        <section className="mt-7 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#d84f87]">
              <Heart className="size-3.5" fill="currentColor" />
              {t.eyebrow}
            </p>
            <h1 className="mt-5 max-w-2xl font-serif text-5xl font-semibold leading-[0.98] tracking-tight text-[#38232f] sm:text-7xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-xl font-serif text-xl font-semibold leading-8 text-[#6d4059] sm:text-2xl">
              {t.intro}
            </p>
            <p className="mt-5 max-w-xl leading-7 text-[#835f71]">{t.note}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {localPrototype ? (
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-[#e9689b] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(222,87,139,0.3)] transition hover:-translate-y-0.5 hover:bg-[#d84f87]"
                  href="http://127.0.0.1:5174/"
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink className="size-4" />
                  {t.openPrototype}
                </a>
              ) : null}
              <span className="inline-flex items-center gap-2 text-xs font-medium text-[#9a7185]">
                <Clock3 className="size-4" />
                {localPrototype ? t.localOnly : t.proofLabel}
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] border-8 border-white bg-white shadow-[0_22px_50px_rgba(115,70,105,0.22)]">
            <img className="aspect-[4/3] w-full object-cover" src={roomImage} alt={t.title} />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white/85 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#64344e]">
                  <MessageCircleQuestion className="size-4 text-[#e9689b]" />
                  {language === 'zh' ? '今晚要一起玩游戏吗？' : 'Want to play together tonight?'}
                </span>
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="grid size-7 place-items-center rounded-full bg-[#ffe1ec] text-[#e9689b]"><CheckCircle2 className="size-4" /></span>
                  <span className="grid size-7 place-items-center rounded-full bg-[#eee0ff] text-[#9974cf]"><XCircle className="size-4" /></span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-[#f3d9e3] pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#d84f87]">{t.flowLabel}</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-[#38232f] sm:text-4xl">{t.flowTitle}</h2>
              <p className="mt-4 leading-7 text-[#835f71]">{t.flowIntro}</p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {t.steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <li className="rounded-2xl border border-[#f3d9e3] bg-white/75 p-4" key={step.title}>
                    <div className="flex items-start gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ffe1ec] text-[#d84f87]"><Icon className="size-4" /></span>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#c58ba5]">0{index + 1}</p>
                        <h3 className="mt-1 font-semibold text-[#553247]">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#8d6a7a]">{step.detail}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>

        <section className="mt-16 border-t border-[#f3d9e3] pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#d84f87]">{t.architectureLabel}</p>
          <h2 className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-tight text-[#38232f] sm:text-4xl">{t.architectureTitle}</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {t.layers.map((layer) => {
              const Icon = layer.icon
              return (
                <article className="border-l-2 border-[#f0a6c2] pl-4" key={layer.label}>
                  <Icon className="size-5 text-[#d84f87]" />
                  <h3 className="mt-3 font-serif text-xl font-semibold text-[#553247]">{layer.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#8d6a7a]">{layer.detail}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-16 grid gap-5 border-t border-[#f3d9e3] pt-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#d84f87]">{t.resultLabel}</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-[#38232f]">{t.resultTitle}</h2>
          </div>
          <div className="grid gap-3">
            {t.results.map((result) => (
              <div className="flex gap-3 rounded-2xl border border-[#f3d9e3] bg-white/75 p-4 text-sm leading-6 text-[#704a60]" key={result}>
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#d84f87]" />
                <p>{result}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-5 border-t border-[#f3d9e3] pt-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-12">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#d84f87]">{t.stackLabel}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {t.stack.map((item) => <span className="rounded-full border border-[#efbfd2] bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#8a5471]" key={item}>{item}</span>)}
            </div>
          </div>
          <div className="rounded-2xl border border-[#efbfd2] bg-[#fff0f6] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#d84f87]">{t.proofLabel}</p>
            <p className="mt-3 text-sm leading-7 text-[#835f71]">{t.proof}</p>
          </div>
        </section>

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-[#f3d9e3] pt-6 text-xs text-[#a5788f]">
          <span className="inline-flex items-center gap-2"><Send className="size-3.5" /> {language === 'zh' ? '把问题交给对方，把答案留给系统。' : 'Send the question. Let the system hold the answer.'}</span>
          <span className="hidden items-center gap-2 sm:inline-flex"><span className="size-2 rounded-full bg-[#e9689b]" /> {t.yes} / <span className="size-2 rounded-full bg-[#9974cf]" /> {t.no}</span>
        </div>
      </div>
    </div>
  )
}
