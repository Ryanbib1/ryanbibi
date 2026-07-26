import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../App'

function EntryReveal({ enableThree = true, onDismiss, show }) {
  const [isEntering, setIsEntering] = useState(false)
  const entryTimerRef = useRef(null)

  const beginEntry = useCallback(() => {
    if (isEntering) return
    setIsEntering(true)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    entryTimerRef.current = window.setTimeout(onDismiss, reducedMotion ? 40 : 1080)
  }, [isEntering, onDismiss])

  useEffect(
    () => () => {
      if (entryTimerRef.current) window.clearTimeout(entryTimerRef.current)
    },
    [],
  )

  useEffect(() => {
    if (!show || typeof window === 'undefined') return

    const onKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        beginEntry()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [beginEntry, show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          animate={{ opacity: 1 }}
          aria-label="Opening ryanbibi digital garden"
          className={cn('entry-reveal', isEntering && 'is-entering')}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(16px)' }}
          initial={{ opacity: 1 }}
          aria-modal="true"
          role="dialog"
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <EntryPortalScene enabled={enableThree} entering={isEntering} />
          <div className="entry-reveal-paper" />
          <div className="entry-reveal-grid" />
          <div className="entry-reveal-bamboo entry-reveal-bamboo-left" />
          <div className="entry-reveal-bamboo entry-reveal-bamboo-right" />
          <div className="entry-reveal-orbit entry-reveal-orbit-one" />
          <div className="entry-reveal-orbit entry-reveal-orbit-two" />
          <div className="entry-reveal-comet entry-reveal-comet-one" />
          <div className="entry-reveal-comet entry-reveal-comet-two" />
          <button className="entry-reveal-skip" onClick={onDismiss} type="button">
            Skip / 跳过
          </button>
          <div className="entry-reveal-core">
            <div className="entry-reveal-mark">
              <img src="./rb-flow-pure-animated.svg" alt="" />
            </div>
            <p className="entry-reveal-kicker">ryanbibi digital garden</p>
            <h1 className="entry-reveal-title">Ziyan Wang / ryanbibi</h1>
            <div className="entry-reveal-pills" aria-hidden="true">
              <span>Portfolio</span>
              <span>Food Atlas</span>
              <span>Vault %</span>
              <span>Life OS</span>
            </div>
            <button
              className="entry-reveal-enter"
              disabled={isEntering}
              onClick={beginEntry}
              type="button"
            >
              <span>{isEntering ? 'Entering' : 'Enter'}</span>
              <span>{isEntering ? '穿越中' : '进入'}</span>
            </button>
          </div>
          <div className="entry-reveal-tunnel" />
          <div className="entry-reveal-wipe" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function EntryPortalScene({ enabled, entering }) {
  const mountRef = useRef(null)
  const enteringRef = useRef(entering)

  useEffect(() => {
    enteringRef.current = entering
  }, [entering])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active = true
    let cleanup = () => {}

    import('../lib/threeSceneKit').then((THREE) => {
      if (!active || !mountRef.current) return

      const mount = mountRef.current
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80)
      camera.position.set(0, 0, 8.6)

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      })
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35))
      mount.appendChild(renderer.domElement)

      const portal = new THREE.Group()
      scene.add(portal)

      const pointer = new THREE.Vector2(0, 0)
      const target = new THREE.Vector2(0, 0)
      const start = performance.now()
      let entryEase = 0

      const ringMaterials = [
        new THREE.MeshBasicMaterial({
          color: 0xf7efe2,
          opacity: 0.2,
          transparent: true,
          depthWrite: false,
        }),
        new THREE.MeshBasicMaterial({
          color: 0xc1432e,
          opacity: 0.36,
          transparent: true,
          depthWrite: false,
        }),
        new THREE.MeshBasicMaterial({
          color: 0x22c7bb,
          opacity: 0.22,
          transparent: true,
          depthWrite: false,
        }),
      ]

      const rings = Array.from({ length: 11 }, (_, index) => {
        const geometry = new THREE.TorusGeometry(1.08 + index * 0.18, 0.006, 8, 168)
        const material = ringMaterials[index % ringMaterials.length]
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.z = -index * 0.62
        mesh.rotation.x = Math.PI / 2.55
        mesh.rotation.z = index * 0.27
        mesh.userData.baseScale = 1 + index * 0.035
        portal.add(mesh)
        return mesh
      })

      const ribbonMaterial = new THREE.LineBasicMaterial({
        color: 0xf7efe2,
        opacity: 0.18,
        transparent: true,
      })
      const accentRibbonMaterial = new THREE.LineBasicMaterial({
        color: 0xc1432e,
        opacity: 0.42,
        transparent: true,
      })

      const makeSpiral = (radius, twist, material, phase = 0) => {
        const points = []
        for (let i = 0; i < 260; i += 1) {
          const t = i / 259
          const angle = t * Math.PI * 2 * twist + phase
          points.push(
            new THREE.Vector3(
              Math.cos(angle) * radius * (1 + t * 0.52),
              Math.sin(angle) * radius * 0.38,
              -t * 6.8,
            ),
          )
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(geometry, material)
        line.rotation.x = 0.15
        portal.add(line)
        return { geometry, line }
      }

      const spirals = [
        makeSpiral(0.92, 2.1, ribbonMaterial, 0.2),
        makeSpiral(1.16, 1.56, accentRibbonMaterial, 1.8),
      ]

      const particleCount = 240
      const particleGeometry = new THREE.BufferGeometry()
      const particlePositions = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount; i += 1) {
        const angle = Math.random() * Math.PI * 2
        const radius = 0.35 + Math.random() * 4.4
        particlePositions[i * 3] = Math.cos(angle) * radius
        particlePositions[i * 3 + 1] = Math.sin(angle) * radius * 0.58
        particlePositions[i * 3 + 2] = -Math.random() * 7.2
      }
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xf7efe2,
        opacity: 0.38,
        size: 0.024,
        transparent: true,
        depthWrite: false,
      })
      const particles = new THREE.Points(particleGeometry, particleMaterial)
      portal.add(particles)

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
      window.addEventListener('pointermove', onPointerMove, { passive: true })

      let raf = 0
      const render = () => {
        if (!active) return

        if (!document.hidden) {
          const elapsed = (performance.now() - start) / 1000
          entryEase += ((enteringRef.current ? 1 : 0) - entryEase) * 0.08
          pointer.lerp(target, 0.04)

          portal.rotation.y = pointer.x * 0.12 + elapsed * 0.045
          portal.rotation.x = pointer.y * 0.06
          portal.position.z = entryEase * 4.2
          portal.scale.setScalar(1 + entryEase * 1.15)
          camera.position.z = 8.6 - entryEase * 4.4
          camera.fov = 42 + entryEase * 16
          camera.updateProjectionMatrix()

          rings.forEach((ring, index) => {
            ring.rotation.z += 0.0025 + index * 0.00028 + entryEase * 0.018
            const pulse = 1 + Math.sin(elapsed * 1.35 + index * 0.55) * 0.018
            const rush = enteringRef.current ? 1 + entryEase * (index + 1) * 0.03 : 1
            ring.scale.setScalar(ring.userData.baseScale * pulse * rush)
            ring.material.opacity = Math.max(0.05, (index % 3 === 1 ? 0.34 : 0.18) + entryEase * 0.22)
          })

          particles.rotation.z = elapsed * 0.018
          particles.position.z = entryEase * 2.6
          particleMaterial.opacity = 0.34 + entryEase * 0.28

          spirals.forEach(({ line }, index) => {
            line.rotation.z = elapsed * (0.06 + index * 0.026) + entryEase * 0.8
            line.position.z = entryEase * 1.9
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
        window.removeEventListener('pointermove', onPointerMove)
        rings.forEach((ring) => ring.geometry.dispose())
        ringMaterials.forEach((material) => material.dispose())
        spirals.forEach(({ geometry }) => geometry.dispose())
        ribbonMaterial.dispose()
        accentRibbonMaterial.dispose()
        particleGeometry.dispose()
        particleMaterial.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })

    return () => {
      active = false
      cleanup()
    }
  }, [enabled])

  return <div ref={mountRef} className="entry-portal-scene" aria-hidden="true" />
}

export default EntryReveal
