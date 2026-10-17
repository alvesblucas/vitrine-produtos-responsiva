import './Header.css'

function Header({ cartCount }) {
  const licenseLabel = cartCount === 1 ? 'licença' : 'licenças'

  return (
    <header className="header">
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
