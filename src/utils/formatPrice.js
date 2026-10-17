const INSTALLMENTS = 6

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatPrice(priceInCents) {
  return currencyFormatter.format(priceInCents / 100)
}

// Arredonda para baixo em centavos para a parcela nunca passar do preço total.
export function getInstallmentInCents(priceInCents) {
  return Math.floor(priceInCents / INSTALLMENTS)
}

export { INSTALLMENTS }
