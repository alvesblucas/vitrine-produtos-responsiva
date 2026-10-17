import { useEffect, useRef } from 'react'
import { CATEGORY_COLORS } from '../../utils/catalog.js'
import './NeuralBackground.css'

const NODE_COLORS = Object.values(CATEGORY_COLORS)
const LINK_DISTANCE = 130 // px: abaixo disso, dois pontos ganham uma linha
const PARALLAX = 0.15 // a rede rola a 15% da velocidade da página
const AREA_PER_NODE = 22000 // px² por ponto: menos pontos em telas menores

function createNodes(width, height) {
  const count = Math.min(70, Math.max(24, Math.round((width * height) / AREA_PER_NODE)))
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    color: NODE_COLORS[i % NODE_COLORS.length],
  }))
}

function NeuralBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let nodes = []
    let frameId = 0

    function resize() {
      // Limita a 2x: telas 3x gastariam muito mais sem diferença visível.
      const ratio = Math.min(window.devicePixelRatio, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      nodes = createNodes(width, height)
    }

    function draw() {
      const offset = reduceMotion ? 0 : window.scrollY * PARALLAX
      // Posição na tela: desloca pela rolagem e "dá a volta" na altura (efeito infinito).
      const points = nodes.map((node) => ({
        x: node.x,
        y: (((node.y - offset) % height) + height) % height,
        color: node.color,
      }))

      context.clearRect(0, 0, width, height)

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const distance = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y)
          if (distance < LINK_DISTANCE) {
            context.globalAlpha = (1 - distance / LINK_DISTANCE) * 0.25
            context.strokeStyle = '#8e7dff'
            context.beginPath()
            context.moveTo(points[i].x, points[i].y)
            context.lineTo(points[j].x, points[j].y)
            context.stroke()
          }
        }
      }

      context.globalAlpha = 0.7
      for (const point of points) {
        context.fillStyle = point.color
        context.beginPath()
        context.arc(point.x, point.y, 1.6, 0, Math.PI * 2)
        context.fill()
      }
    }

    function move() {
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1
      }
    }

    // requestAnimationFrame já pausa sozinho quando a aba fica em segundo plano.
    function loop() {
      move()
      draw()
      frameId = requestAnimationFrame(loop)
    }

    function handleResize() {
      resize()
      if (reduceMotion) draw()
    }

    resize()
    if (reduceMotion) draw()
    else loop()
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="neural-background" aria-hidden="true" />
}

export default NeuralBackground
