import { ArrowUpRight, ChevronLeft } from 'lucide-react'

import { projectAccessLabel } from './connectedProjects.js'

export default function ConnectedProject({ work, language }) {
  const zh = language === 'zh'
  return <section className="mx-auto w-full max-w-4xl py-4" data-no-translate>
    <a className="inline-flex min-h-11 items-center gap-2 text-ink-soft hover:text-cinnabar" href="#/lab"><ChevronLeft size={17} />{zh ? '返回实验室' : 'Back to Lab'}</a>
    <p className="mt-8 font-mono text-xs text-cinnabar">{projectAccessLabel(work, language)} · {work.year}</p>
    <h1 className="mt-3 break-words font-serif text-4xl text-ink sm:text-6xl">{work.en}</h1>
    <p className="mt-5 font-serif text-2xl leading-snug text-ink">{work.tagline[language]}</p>
    <p className="mt-5 max-w-2xl leading-7 text-ink-soft">{work.blurb[language]}</p>
    <div className="my-8 border-y border-line py-6">
      <h2 className="font-serif text-2xl text-ink">{zh ? '怎样体验' : 'How to explore'}</h2>
      <p className="mt-3 leading-7 text-ink-soft">{work.interaction[language]}</p>
      <p className="mt-4 text-sm leading-7 text-ink-faint">{work.availability[language]}</p>
      {work.access === 'public' && <a className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-cinnabar" href={work.url} target="_blank" rel="noreferrer">{zh ? '打开公开应用' : 'Open public app'}<ArrowUpRight size={18} /></a>}
      {work.access === 'local' && <p className="mt-5 text-sm text-ink-soft">{zh ? '当前展示作品介绍，暂无公开在线体验。' : 'Project overview only; a public online experience is not available here.'}</p>}
    </div>
    <a href="#/lab" className="inline-flex min-h-11 items-center gap-2 text-ink-soft hover:text-cinnabar">{zh ? '继续浏览其他作品' : 'Explore more works'}<ArrowUpRight size={17} /></a>
  </section>
}
