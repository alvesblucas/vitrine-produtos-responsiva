import { useState } from 'react'
import agents from './data/agents.json'
import Header from './components/Header/Header.jsx'
import ProductCard from './components/ProductCard/ProductCard.jsx'

function App() {
  // Carrinho no formato { idDoAgente: quantidadeDeLicenças }.
  const [cart, setCart] = useState({})

  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)

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
        <ul className="app__list">
          {agents.map((agent) => (
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
