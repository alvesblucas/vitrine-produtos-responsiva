import { useEffect, useRef } from 'react'
import { CATEGORY_COLORS } from '../../utils/catalog.js'
import './NeuralBackground.css'

const NODE_COLORS = Object.values(CATEGORY_COLORS)
const LINK_COLOR = '#8e7dff'

// Duas camadas dão profundidade: a distante é menor, mais apagada e rola mais devagar.
const LAYERS = [
  { areaPerNode: 30000, maxNodes: 45, radius: 1, alpha: 0.35, speed: 0.15, parallax: 0.06, linkDistance: 90, linkAlpha: 0.12 },
  { areaPerNode: 18000, maxNodes: 70, radius: 2, alpha: 0.85, speed: 0.35, parallax: 0.2, linkDistance: 140, linkAlpha: 0.3 },
]
const NEAR = 1

const MOUSE_DISTANCE = 170 // px: pontos da camada próxima a menos disso se ligam ao cursor
const MAX_PULSES = 14 // sinais viajando ao mesmo tempo
const PULSE_INTERVAL = 220 // ms entre novos sinais

function createNodes(layer, width, height) {
  const count = Math.min(layer.maxNodes, Math.max(16, Math.round((width * height) / layer.areaPerNode)))
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 2 * layer.speed,
    vy: (Math.random() - 0.5) * 2 * layer.speed,
    color: NODE_COLORS[i % NODE_COLORS.length],
  }))
}

function NeuralBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Só reage ao cursor em dispositivos com mouse (no toque não há "passar por cima").
    const hasMouse = window.matchMedia('(pointer: fine)').matches && !reduceMotion
    const mouse = { x: -9999, y: -9999 }
    let width = 0
    let height = 0
    let layers = []
    let pulses = []
    let lastPulseAt = 0
    let frameId = 0

    function resize() {
      // Limita a 2x: telas 3x gastariam muito mais sem diferença visível.
      const ratio = Math.min(window.devicePixelRatio, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      layers = LAYERS.map((layer) => ({ ...layer, nodes: createNodes(layer, width, height) }))
      pulses = []
    }

    // Posição na tela: desloca pela rolagem e "dá a volta" na altura (efeito infinito).
    function toScreen(layer) {
      const offset = reduceMotion ? 0 : window.scrollY * layer.parallax
      return layer.nodes.map((node) => ({
        x: node.x,
        y: (((node.y - offset) % height) + height) % height,
        color: node.color,
      }))
    }

    function drawLine(a, b, alpha) {
      context.globalAlpha = alpha
      context.beginPath()
      context.moveTo(a.x, a.y)
      context.lineTo(b.x, b.y)
      context.stroke()
    }

    function spawnPulse(points, linkDistance, now) {
      if (now - lastPulseAt < PULSE_INTERVAL || pulses.length >= MAX_PULSES) return
      const from = Math.floor(Math.random() * points.length)
      const neighbors = points
        .map((point, index) => ({ index, distance: Math.hypot(point.x - points[from].x, point.y - points[from].y) }))
        .filter(({ index, distance }) => index !== from && distance < linkDistance)
      if (neighbors.length === 0) return
      const to = neighbors[Math.floor(Math.random() * neighbors.length)].index
      pulses.push({ from, to, progress: 0, speed: 0.012 + Math.random() * 0.01 })
      lastPulseAt = now
    }

    function drawPulses(points, linkDistance) {
      pulses = pulses.filter((pulse) => {
        const a = points[pulse.from]
        const b = points[pulse.to]
        // Some se a conexão se desfez ou se o sinal chegou ao destino.
        if (Math.hypot(a.x - b.x, a.y - b.y) > linkDistance || pulse.progress >= 1) return false
        const x = a.x + (b.x - a.x) * pulse.progress
        const y = a.y + (b.y - a.y) * pulse.progress
        context.fillStyle = a.color
        context.globalAlpha = 0.25
        context.beginPath()
        context.arc(x, y, 6, 0, Math.PI * 2)
        context.fill()
        context.globalAlpha = 1
        context.beginPath()
        context.arc(x, y, 2.2, 0, Math.PI * 2)
        context.fill()
        pulse.progress += pulse.speed
        return true
      })
    }

    function draw(now) {
      context.clearRect(0, 0, width, height)
      context.strokeStyle = LINK_COLOR
      context.lineWidth = 1

      layers.forEach((layer, layerIndex) => {
        const points = toScreen(layer)

        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const distance = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y)
            if (distance < layer.linkDistance) {
              drawLine(points[i], points[j], (1 - distance / layer.linkDistance) * layer.linkAlpha)
            }
          }
        }

        if (layerIndex === NEAR && hasMouse) {
          for (const point of points) {
            const distance = Math.hypot(point.x - mouse.x, point.y - mouse.y)
            if (distance < MOUSE_DISTANCE) drawLine(point, mouse, (1 - distance / MOUSE_DISTANCE) * 0.5)
          }
        }

        context.globalAlpha = layer.alpha
        for (const point of points) {
          context.fillStyle = point.color
          context.beginPath()
          context.arc(point.x, point.y, layer.radius, 0, Math.PI * 2)
          context.fill()
        }

        if (layerIndex === NEAR && !reduceMotion) {
          spawnPulse(points, layer.linkDistance, now)
          drawPulses(points, layer.linkDistance)
        }
      })
    }

    function move() {
      for (const layer of layers) {
        for (const node of layer.nodes) {
          node.x += node.vx
          node.y += node.vy
          if (node.x < 0 || node.x > width) node.vx *= -1
          if (node.y < 0 || node.y > height) node.vy *= -1
        }
      }
    }

    // requestAnimationFrame já pausa sozinho quando a aba fica em segundo plano.
    function loop(now) {
      move()
      draw(now)
      frameId = requestAnimationFrame(loop)
    }

    function handleResize() {
      resize()
      if (reduceMotion) draw(0)
    }

    function handlePointerMove(event) {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }

    function handlePointerLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    if (reduceMotion) draw(0)
    else frameId = requestAnimationFrame(loop)
    window.addEventListener('resize', handleResize)
    if (hasMouse) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', handlePointerLeave)
    }

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return (
    <>
      {/* Aurora: manchas de luz desfocadas feitas só com CSS, atrás da rede. */}
      <div className="aurora" aria-hidden="true">
        <span className="aurora__blob aurora__blob--a" />
        <span className="aurora__blob aurora__blob--b" />
        <span className="aurora__blob aurora__blob--c" />
      </div>
      <canvas ref={canvasRef} className="neural-background" aria-hidden="true" />
    </>
  )
}

export default NeuralBackground
