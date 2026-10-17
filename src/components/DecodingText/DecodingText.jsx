import { Fragment, useEffect, useState } from 'react'
import './DecodingText.css'

// Mantém maiúscula/minúscula do original: as letras sorteadas ficam com largura parecida.
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DURATION_MS = 1200
const FRAME_MS = 40

function randomFrom(glyphs) {
  return glyphs[Math.floor(Math.random() * glyphs.length)]
}

function scramble(text, revealedCount) {
  return [...text]
    .map((char, index) => {
      if (index < revealedCount || char === ' ') return char
      return char === char.toUpperCase() ? randomFrom(UPPER) : randomFrom(LOWER)
    })
    .join('')
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Texto que "decodifica" uma vez ao aparecer, da esquerda para a direita.
function DecodingText({ text }) {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? null : scramble(text, 0)))

  useEffect(() => {
    if (prefersReducedMotion()) return
    const startedAt = performance.now()
    const timer = setInterval(() => {
      const progress = Math.min((performance.now() - startedAt) / DURATION_MS, 1)
      if (progress === 1) {
        clearInterval(timer)
        setDisplay(null)
      } else {
        setDisplay(scramble(text, Math.floor(progress * text.length)))
      }
    }, FRAME_MS)
    return () => clearInterval(timer)
  }, [text])

  const words = text.split(' ')
  const scrambledWords = display?.split(' ')

  // Palavra por palavra: a quebra de linha é sempre a do texto real, e cada versão
  // embaralhada fica por cima só da sua palavra.
  return (
    <span className="decoding-text">
      {words.map((word, index) => (
        <Fragment key={index}>
          <span className="decoding-text__word">
            {/* O texto real fica sempre no lugar: reserva o espaço e é o que o leitor de tela lê. */}
            <span className={scrambledWords ? 'decoding-text__final--hidden' : undefined}>{word}</span>
            {scrambledWords && (
              <span className="decoding-text__scramble" aria-hidden="true">
                {scrambledWords[index]}
              </span>
            )}
          </span>
          {index < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  )
}

export default DecodingText
