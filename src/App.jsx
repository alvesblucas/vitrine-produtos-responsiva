import agents from './data/agents.json'
import ProductCard from './components/ProductCard/ProductCard.jsx'

function App() {
  return (
    <main className="app">
      <h1 className="app__title">Agentes Exemplo</h1>

      <ul className="app__list">
        {agents.map((agent) => (
          <li key={agent.id} className="app__item">
            <ProductCard agent={agent} />
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
