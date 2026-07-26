import { lazy } from 'react'

// slug → built experience. Only works with status 'live' need an entry here.
// Lazy so each work's code (and any heavy canvas/WebGL deps) only loads when
// someone actually opens it — keeps the main ink-wash bundle lean.
export const WORK_COMPONENTS = {
  liuguang: lazy(() => import('./Liuguang.jsx')),
  'game-night-invite': lazy(() => import('./GameNight.jsx')),
}
