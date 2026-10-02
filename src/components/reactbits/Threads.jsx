import { useRef, useEffect, useCallback } from 'react'

/**
 * Threads — A lightweight canvas background with flowing animated lines
 * that respond to pointer movement.
 *
 * Inspired by ReactBits Threads component.
 * Pure Canvas API, zero external dependencies.
 *
 * Props:
 *  color     — [r, g, b] array, 0–255 (default: [59, 130, 246] — blue-500)
 *  amplitude — vertical wave height in px (default: 80)
 *  speed     — animation speed multiplier (default: 0.5)
 *  count     — number of thread lines (default: 24)
 *  className — additional class names for the wrapper
 */

const DEFAULTS = {
  color: [59, 130, 246],
  amplitude: 80,
  speed: 0.5,
  count: 24,
}

export default function Threads({
  color = DEFAULTS.color,
  amplitude = DEFAULTS.amplitude,
  speed = DEFAULTS.speed,
  count = DEFAULTS.count,
  className = '',
}) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetRef = useRef({ x: 0.5, y: 0.5 })
  const frameRef = useRef(0)
  const reducedMotion = useRef(false)

  const handlePointerMove = useCallback((e) => {
    if (reducedMotion.current) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    targetRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.current = mql.matches

    const handleMotionChange = (e) => {
      reducedMotion.current = e.matches
    }
    mql.addEventListener('change', handleMotionChange)

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0

    function resize() {
      const parent = canvas.parentElement
      if (!parent) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    let t = 0
    let running = true

    function draw() {
      if (!running) return

      ctx.clearRect(0, 0, width, height)

      // Lerp mouse
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.05
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.05

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      if (reducedMotion.current) {
        // Static lines for reduced motion
        for (let i = 0; i < count; i++) {
          const yBase = (height / (count + 1)) * (i + 1)
          const alpha = 0.04 + (i / count) * 0.06
          ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(0, yBase)
          ctx.lineTo(width, yBase)
          ctx.stroke()
        }
        frameRef.current = requestAnimationFrame(draw)
        return
      }

      t += speed * 0.008

      for (let i = 0; i < count; i++) {
        const progress = i / (count - 1)
        const yBase = (height / (count + 1)) * (i + 1)

        // Thread opacity based on distance from center
        const distFromCenter = Math.abs(progress - 0.5) * 2
        const alpha = 0.03 + (1 - distFromCenter) * 0.08

        ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`
        ctx.lineWidth = 0.8 + (1 - distFromCenter) * 0.6

        ctx.beginPath()

        const segments = 80
        for (let s = 0; s <= segments; s++) {
          const xFrac = s / segments
          const x = xFrac * width

          // Distance from mouse
          const dx = xFrac - mx
          const dy = ((yBase / height) - my)
          const dist = Math.sqrt(dx * dx + dy * dy)
          const influence = Math.max(0, 1 - dist * 2.5)

          // Composite wave
          const wave1 = Math.sin(xFrac * 4 + t + i * 0.3) * amplitude * 0.4
          const wave2 = Math.sin(xFrac * 7 - t * 0.7 + i * 0.5) * amplitude * 0.2
          const wave3 = Math.cos(xFrac * 3 + t * 0.5 + i * 0.2) * amplitude * 0.15
          const mouseWave = Math.sin(xFrac * 6 + t * 2) * amplitude * 0.6 * influence

          const y = yBase + wave1 + wave2 + wave3 + mouseWave

          if (s === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      running = false
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      mql.removeEventListener('change', handleMotionChange)
    }
  }, [color, amplitude, speed, count])

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      onPointerMove={handlePointerMove}
      style={{ pointerEvents: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
        aria-hidden="true"
      />
    </div>
  )
}
