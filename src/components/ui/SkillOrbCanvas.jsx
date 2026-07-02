import { useEffect, useRef } from 'react'

function SkillOrbCanvas({ size = 250, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let rafId = 0
    let rotation = 0
    let mounted = true

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawBackgroundGlow = (time) => {
      const cx = size / 2
      const cy = size / 2
      const pulse = 0.9 + Math.sin(time * 0.0012) * 0.12

      const glow = ctx.createRadialGradient(cx, cy, size * 0.09, cx, cy, size * 0.52)
      glow.addColorStop(0, `rgba(110, 140, 255, ${0.24 * pulse})`)
      glow.addColorStop(0.45, `rgba(66, 95, 200, ${0.14 * pulse})`)
      glow.addColorStop(1, 'rgba(5, 7, 18, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, size * 0.54, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawOrbLayers = () => {
      const cx = size / 2
      const cy = size / 2
      const orbWidth = size * 0.78
      const orbHeight = size * 0.66

      ctx.save()
      ctx.translate(cx, cy)

      ctx.save()
      ctx.rotate(-rotation * 0.6)
      ctx.globalAlpha = 0.24
      ctx.filter = 'blur(7px)'
      const back = ctx.createRadialGradient(0, 0, orbWidth * 0.05, 0, 0, orbWidth * 0.52)
      back.addColorStop(0, 'rgba(180,210,255,0.45)')
      back.addColorStop(0.5, 'rgba(66,95,200,0.26)')
      back.addColorStop(1, 'rgba(8,12,22,0)')
      ctx.fillStyle = back
      ctx.beginPath()
      ctx.ellipse(0, 0, orbWidth / 2, orbHeight / 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.rotate(rotation)
      ctx.globalAlpha = 0.94
      ctx.filter = 'none'
      const main = ctx.createRadialGradient(0, 0, orbWidth * 0.05, 0, 0, orbWidth * 0.52)
      main.addColorStop(0, 'rgba(214,231,255,0.75)')
      main.addColorStop(0.35, 'rgba(98,126,233,0.62)')
      main.addColorStop(1, 'rgba(11,16,30,0.08)')
      ctx.fillStyle = main
      ctx.beginPath()
      ctx.ellipse(0, 0, orbWidth / 2, orbHeight / 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.rotate(rotation * 1.3)
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.34
      ctx.filter = 'blur(2px)'
      const ring = ctx.createLinearGradient(-orbWidth / 2, 0, orbWidth / 2, 0)
      ring.addColorStop(0, 'rgba(0,0,0,0)')
      ring.addColorStop(0.5, 'rgba(149,195,255,0.7)')
      ring.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.strokeStyle = ring
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(0, 0, orbWidth * 0.42, orbHeight * 0.42, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      ctx.restore()
    }

    const drawOrb = (time) => {
      ctx.clearRect(0, 0, size, size)
      drawBackgroundGlow(time)
      drawOrbLayers()

      const cx = size / 2
      const cy = size / 2
      const rim = ctx.createRadialGradient(cx, cy, size * 0.22, cx, cy, size * 0.52)
      rim.addColorStop(0.65, 'rgba(99, 102, 241, 0)')
      rim.addColorStop(1, 'rgba(99, 102, 241, 0.22)')
      ctx.strokeStyle = rim
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(cx, cy, size * 0.47, 0, Math.PI * 2)
      ctx.stroke()
    }

    const render = (time) => {
      if (!mounted) return

      // Рендерим каждый 2-й кадр (30fps) — для медленного вращения достаточно
      if (!reduceMotion) {
        rotation += 0.0042
        rafId = window.requestAnimationFrame((t) => {
          if (!mounted) return
          drawOrb(t)
          rafId = window.requestAnimationFrame(render)
        })
      } else {
        drawOrb(time)
      }
    }

    resize()
    render(0)

    const onResize = () => {
      resize()
      drawOrb(0)
    }

    window.addEventListener('resize', onResize)

    return () => {
      mounted = false
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
    }
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  )
}

export default SkillOrbCanvas
