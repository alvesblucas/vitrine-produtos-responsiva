import { useState } from 'react'
import { formatPrice, getInstallmentInCents, INSTALLMENTS } from '../../utils/formatPrice.js'
import { CATEGORY_COLORS } from '../../utils/catalog.js'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll.js'
import QuantitySelector from '../QuantitySelector/QuantitySelector.jsx'
import './ProductCard.css'

function CartIcon() {
  return (
    <svg className="product-card__button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  )
}

// Escreve a posição do ponteiro direto em variáveis CSS: sem useState, o React não
// re-renderiza o card a cada movimento do mouse.
function handlePointerMove(event) {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
  card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
}

function ProductCard({ agent, onAddToCart, index }) {
  const { id, name, category, specialty, priceInCents } = agent
  const [quantity, setQuantity] = useState(1)
  const [revealRef, isVisible] = useRevealOnScroll()

  function handleAddToCart() {
    onAddToCart(id, quantity)
    setQuantity(1)
  }

  return (
    // A cor da categoria vira variável CSS e colore etiqueta, borda e brilho do card.
    // O atraso em cascata reinicia a cada 4 cards (uma linha no desktop).
    <article
      ref={revealRef}
      className={`product-card${isVisible ? ' product-card--visible' : ''}`}
      style={{
        '--agent-color': CATEGORY_COLORS[category],
        '--reveal-delay': `${(index % 4) * 80}ms`,
      }}
      onPointerMove={handlePointerMove}
    >
      <div className="product-card__media">
        {/* alt vazio: a ilustração repete o nome que vem logo abaixo, então é decorativa. */}
        <img
          className="product-card__image"
          src={`${import.meta.env.BASE_URL}agents/${id}.svg`}
          alt=""
          width="400"
          height="300"
          loading="lazy"
        />
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{category}</p>
        <h2 className="product-card__name">{name}</h2>
        <p className="product-card__specialty">{specialty}</p>

        <div className="product-card__pricing">
          <p className="product-card__license">Licença anual</p>
          <p className="product-card__price">{formatPrice(priceInCents)}</p>
          <p className="product-card__installments">
            em até {INSTALLMENTS}x de {formatPrice(getInstallmentInCents(priceInCents))} sem juros
          </p>
        </div>

        <div className="product-card__actions">
          <QuantitySelector value={quantity} onChange={setQuantity} itemName={name} />
          {/* aria-label diferencia os 8 botões no leitor de tela e começa com o texto visível. */}
          <button
            type="button"
            className="product-card__button"
            onClick={handleAddToCart}
            aria-label={`Adicionar ao carrinho: ${name}`}
          >
            <CartIcon />
            Adicionar
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
