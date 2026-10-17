import './Header.css'

function Header({ cartCount }) {
  const licenseLabel = cartCount === 1 ? 'licença' : 'licenças'

  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__title">Agentes Exemplo</h1>

        {/* aria-live faz o leitor de tela anunciar quando o total muda. */}
        <p className="header__cart" aria-live="polite">
          Carrinho: <strong className="header__cart-count">{cartCount}</strong> {licenseLabel}
        </p>
      </div>
    </header>
  )
}

export default Header
