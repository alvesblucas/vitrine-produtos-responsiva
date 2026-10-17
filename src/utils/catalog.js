export const ALL_CATEGORIES = 'todas'

// Cor de sinal de cada categoria: usada na etiqueta do card e nas ilustrações.
export const CATEGORY_COLORS = {
  Atendimento: '#3FD6C6',
  Marketing: '#FF7A9A',
  Desenvolvimento: '#FFB547',
  Dados: '#6FA8FF',
}

export const SORT_OPTIONS = [
  { value: 'name', label: 'Nome (A–Z)' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
]

// localeCompare com 'pt-BR' ordena acentos corretamente ("Á" junto do "A").
function compareText(a, b) {
  return a.localeCompare(b, 'pt-BR')
}

const COMPARATORS = {
  name: (a, b) => compareText(a.name, b.name),
  'price-asc': (a, b) => a.priceInCents - b.priceInCents,
  'price-desc': (a, b) => b.priceInCents - a.priceInCents,
}

export function getCategories(agents) {
  return [...new Set(agents.map((agent) => agent.category))].sort(compareText)
}

export function getVisibleAgents(agents, category, sortBy) {
  const filtered =
    category === ALL_CATEGORIES ? agents : agents.filter((agent) => agent.category === category)

  // Copia antes de ordenar: sort() altera o array original.
  return [...filtered].sort(COMPARATORS[sortBy])
}
