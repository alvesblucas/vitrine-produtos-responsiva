import { useEffect, useState } from 'react'
import './Header.css'

function Header({ cartCount }) {
  const licenseLabel = cartCount === 1 ? 'licença' : 'licenças'
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 8)

  useEffect(() => {
    // passive: avisa o navegador que não vamos bloquear a rolagem, que continua fluida.
    // O React ignora o setState quando o valor não muda, então não re-renderiza a cada pixel.
    function handleScroll() {
      setIsScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header${isScrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner">
        {/* O h1 da página fica na abertura; aqui o nome da loja é o logotipo. */}
        <p className="header__logo">
          Agentes<span className="header__logo-accent"> Exemplo</span>
        </p>

        {/* aria-live faz o leitor de tela anunciar quando o total muda. */}
        <p className="header__cart" aria-live="polite">
          <span className="header__cart-dot" aria-hidden="true" />
          <span className="header__cart-label">Carrinho: </span>
          <strong className="header__cart-count">{cartCount}</strong> {licenseLabel}
        </p>
      </div>
    </header>
  )
}

export default Header
