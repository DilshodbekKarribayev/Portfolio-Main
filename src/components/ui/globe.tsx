import { useEffect, useRef } from 'react'
import createGlobe, { type COBEOptions } from 'cobe'
import { cn } from '@/lib/utils'

const DEFAULT_GLOBE_CONFIG: COBEOptions = {
  width: 700,
  height: 700,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: -1.2,
  theta: 0.32,
  dark: 0,
  diffuse: 0.55,
  mapSamples: 16000,
  mapBrightness: 1.25,
  baseColor: [0.95, 0.95, 0.95],
  markerColor: [14 / 255, 165 / 255, 233 / 255],
  glowColor: [1, 1, 1],
  backgroundColor: [0, 0, 0, 0],
  markers: [
    { location: [41.3111, 69.2797], size: 0.13 }, // Tashkent, Uzbekistan
  ],
}

export function Globe({
  className,
  config = {},
}: {
  className?: string
  config?: Partial<COBEOptions>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(DEFAULT_GLOBE_CONFIG.phi ?? 0)
  const pointerInteractingRef = useRef<number | null>(null)
  const pointerRotationRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const mergedConfig = {
      ...DEFAULT_GLOBE_CONFIG,
      ...config,
    }

    const onResize = () => {
      const size = canvas.offsetWidth
      canvas.width = size * 2
      canvas.height = size * 2
    }

    onResize()
    window.addEventListener('resize', onResize)
    canvas.style.cursor = 'grab'
    canvas.style.touchAction = 'none'

    const handlePointerDown = (event: PointerEvent) => {
      pointerInteractingRef.current = event.clientX
      canvas.style.cursor = 'grabbing'
      canvas.setPointerCapture?.(event.pointerId)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (pointerInteractingRef.current === null) return
      const deltaX = event.clientX - pointerInteractingRef.current
      pointerInteractingRef.current = event.clientX
      pointerRotationRef.current += (deltaX / canvas.offsetWidth) * Math.PI * 0.9
    }

    const stopPointerInteraction = (event?: PointerEvent) => {
      if (pointerInteractingRef.current === null) return
      phiRef.current += pointerRotationRef.current
      pointerRotationRef.current = 0
      pointerInteractingRef.current = null
      canvas.style.cursor = 'grab'
      if (event) {
        canvas.releasePointerCapture?.(event.pointerId)
      }
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', stopPointerInteraction)
    canvas.addEventListener('pointercancel', stopPointerInteraction)
    canvas.addEventListener('pointerleave', stopPointerInteraction)

    const userOnRender = mergedConfig.onRender

    const globe = createGlobe(canvas, {
      ...mergedConfig,
      width: canvas.width,
      height: canvas.height,
      onRender: (state) => {
        // Keep Uzbekistan marker visible, but allow user drag interaction.
        if (pointerInteractingRef.current === null) {
          phiRef.current += 0.0008
        }
        state.phi = phiRef.current + pointerRotationRef.current
        state.width = canvas.width
        state.height = canvas.height
        userOnRender?.(state)
      },
    })

    canvas.style.opacity = '1'

    return () => {
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', stopPointerInteraction)
      canvas.removeEventListener('pointercancel', stopPointerInteraction)
      canvas.removeEventListener('pointerleave', stopPointerInteraction)
      globe.destroy()
    }
  }, [config])

  return (
    <div className={cn('relative z-[1] mx-auto aspect-square w-[300px] sm:w-[360px] lg:w-[380px]', className)}>
      <canvas
        ref={canvasRef}
        className="size-full opacity-0 transition-opacity duration-500"
      />
    </div>
  )
}

export default Globe
