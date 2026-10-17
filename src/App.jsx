import { useState } from 'react'
import agents from './data/agents.json'
import { ALL_CATEGORIES, getCategories, getVisibleAgents } from './utils/catalog.js'
import Header from './components/Header/Header.jsx'
import CatalogToolbar from './components/CatalogToolbar/CatalogToolbar.jsx'
import ProductCard from './components/ProductCard/ProductCard.jsx'

// Os dados não mudam durante o uso, então as categorias são calculadas uma vez só.
const categories = getCategories(agents)

function App() {
  // Carrinho no formato { idDoAgente: quantidadeDeLicenças }.
  const [cart, setCart] = useState({})
  const [category, setCategory] = useState(ALL_CATEGORIES)
  const [sortBy, setSortBy] = useState('name')

  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const visibleAgents = getVisibleAgents(agents, category, sortBy)

  function handleAddToCart(agentId, quantity) {
    setCart((currentCart) => ({
      ...currentCart,
      [agentId]: (currentCart[agentId] ?? 0) + quantity,
    }))
  }

  return (
    <>
      <Header cartCount={cartCount} />

      <main className="app">
        <CatalogToolbar
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultCount={visibleAgents.length}
        />

        <ul className="app__list">
          {visibleAgents.map((agent) => (
            <li key={agent.id} className="app__item">
              <ProductCard agent={agent} onAddToCart={handleAddToCart} />
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default App
