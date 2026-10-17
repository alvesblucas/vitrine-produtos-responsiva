import { useEffect, useRef, useState } from 'react'

// Retorna uma ref e um booleano que vira true (uma única vez) quando o elemento entra na tela.
export function useRevealOnScroll() {
  const ref = useRef(null)
  // Navegador sem IntersectionObserver: já começa visível, sem efeito.
  const [isVisible, setIsVisible] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const element = ref.current
    if (isVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // já apareceu: não precisa mais observar
        }
      },
      // Dispara um pouco antes do fim da tela, para o card já estar subindo quando for visto.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [isVisible])

  return [ref, isVisible]
}
