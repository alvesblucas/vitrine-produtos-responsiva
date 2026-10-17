import { useState } from 'react'
import agents from './data/agents.json'
import { ALL_CATEGORIES, getCategories, getVisibleAgents } from './utils/catalog.js'
import NeuralBackground from './components/NeuralBackground/NeuralBackground.jsx'
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
      <NeuralBackground />

      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Header cartCount={cartCount} />

      <main id="conteudo" className="app">
        <section className="hero" aria-labelledby="hero-title">
          <p className="hero__eyebrow">Vitrine fictícia · projeto de portfólio</p>
          <h1 id="hero-title" className="hero__title">
            Monte sua equipe de agentes
          </h1>
          <p className="hero__text">
            Licenças anuais de agentes de IA especializados. Escolha o agente, defina quantas pessoas
            do seu time vão usar e adicione ao carrinho.
          </p>
        </section>

        <CatalogToolbar
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultCount={visibleAgents.length}
        />

        <ul className="app__list">
          {visibleAgents.map((agent, index) => (
            <li key={agent.id} className="app__item">
              <ProductCard agent={agent} onAddToCart={handleAddToCart} index={index} />
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default App
