import { useId, useState } from 'react'
import './QuantitySelector.css'

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max)
}

function QuantitySelector({ value, onChange, itemName, min = 1, max = 99 }) {
  const inputId = useId()
  // Texto digitado enquanto o campo está em edição; null = mostra o valor real.
  const [draft, setDraft] = useState(null)

  function commitDraft() {
    if (draft === null) return
    const typed = Number.parseInt(draft, 10)
    onChange(Number.isNaN(typed) ? min : clamp(typed, min, max))
    setDraft(null)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') commitDraft()
  }

  return (
    <div className="quantity-selector">
      <button
        type="button"
        className="quantity-selector__button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Diminuir licenças de ${itemName}`}
      >
        −
      </button>

      <label className="visually-hidden" htmlFor={inputId}>
        Quantidade de licenças: {itemName}
      </label>
      <input
        id={inputId}
        className="quantity-selector__input"
        type="text"
        inputMode="numeric"
        value={draft ?? String(value)}
        onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
        onBlur={commitDraft}
        onKeyDown={handleKeyDown}
      />

      <button
        type="button"
        className="quantity-selector__button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Aumentar licenças de ${itemName}`}
      >
        +
      </button>
    </div>
  )
}

export default QuantitySelector
