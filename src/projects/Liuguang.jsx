import { useEffect, useRef } from 'react'

// 流光 / Liúguāng — an isolated sub-project.
// Self-contained: depends only on React. All of its look lives under the
// `.theme-liuguang` scope (here + index.css), so nothing leaks into the
// ink-wash site. This is the template for future works: own file, own world.

export default function Liuguang() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const pointer = { x: width / 2, y: height / 2, has: false }
    const ribbons = Array.from({ length: 5 }, (_, i) => ({
      hue: 200 + i * 26,
      points: Array.from({ length: 36 }, () => ({ x: width / 2, y: height / 2 })),
      lag: 0.16 + i * 0.04,
    }))

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      const touch = event.touches?.[0]
      pointer.x = (touch ? touch.clientX : event.clientX) - rect.left
      pointer.y = (touch ? touch.clientY : event.clientY) - rect.top
      pointer.has = true
    }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('touchmove', onMove, { passive: true })

    let t = 0
    const render = () => {
      t += 0.01
      // idle drift when the pointer hasn't moved yet
      const tx = pointer.has ? pointer.x : width / 2 + Math.cos(t) * width * 0.22
      const ty = pointer.has ? pointer.y : height / 2 + Math.sin(t * 1.3) * height * 0.22

      ctx.fillStyle = 'rgba(8, 10, 22, 0.18)'
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      for (const ribbon of ribbons) {
        const head = ribbon.points[0]
        head.x += (tx - head.x) * ribbon.lag
        head.y += (ty - head.y) * ribbon.lag
        for (let i = ribbon.points.length - 1; i > 0; i--) {
          const p = ribbon.points[i]
          const prev = ribbon.points[i - 1]
          p.x += (prev.x - p.x) * 0.55
          p.y += (prev.y - p.y) * 0.55
        }
        for (let i = 0; i < ribbon.points.length - 1; i++) {
          const p = ribbon.points[i]
          const n = ribbon.points[i + 1]
          const a = 1 - i / ribbon.points.length
          ctx.beginPath()
          ctx.strokeStyle = `hsla(${ribbon.hue + Math.sin(t + i * 0.2) * 30}, 90%, 65%, ${a * 0.5})`
          ctx.lineWidth = a * 7
          ctx.lineCap = 'round'
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(n.x, n.y)
          ctx.stroke()
        }
      }
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('touchmove', onMove)
    }
  }, [])

  return (
    <div className="theme-liuguang">
      <a className="lg-back" href="#/lab">
        ← Works
      </a>
      <canvas ref={canvasRef} className="lg-canvas" />
      <div className="lg-overlay">
        <p className="lg-kicker">流光 / Liúguāng</p>
        <h1 className="lg-title">Light that follows you.</h1>
        <p className="lg-sub">Move your cursor — or touch — to trail ribbons of light.</p>
      </div>
    </div>
  )
}
