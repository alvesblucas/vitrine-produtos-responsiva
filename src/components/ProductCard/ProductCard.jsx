import { formatPrice, getInstallmentInCents, INSTALLMENTS } from '../../utils/formatPrice.js'
import './ProductCard.css'

function ProductCard({ agent }) {
  const { name, category, specialty, priceInCents, color } = agent

  return (
    <article className="product-card">
      <div
        className="product-card__image"
        style={{ backgroundColor: color }}
        role="img"
        aria-label={`Imagem ilustrativa: ${name}`}
      />

      <div className="product-card__body">
        <p className="product-card__category">{category}</p>
        <h2 className="product-card__name">{name}</h2>
        <p className="product-card__specialty">{specialty}</p>

        <p className="product-card__license">Licença anual</p>
        <p className="product-card__price">{formatPrice(priceInCents)}</p>
        <p className="product-card__installments">
          em até {INSTALLMENTS}x de {formatPrice(getInstallmentInCents(priceInCents))} sem juros
        </p>
      </div>
    </article>
  )
}

export default ProductCard
