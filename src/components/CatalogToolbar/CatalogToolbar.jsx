import { useId } from 'react'
import { ALL_CATEGORIES, SORT_OPTIONS } from '../../utils/catalog.js'
import './CatalogToolbar.css'

function CatalogToolbar({ categories, category, onCategoryChange, sortBy, onSortChange, resultCount }) {
  const categoryId = useId()
  const sortId = useId()
  const resultLabel = resultCount === 1 ? 'agente encontrado' : 'agentes encontrados'

  return (
    <div className="catalog-toolbar">
      <div className="catalog-toolbar__field">
        <label className="catalog-toolbar__label" htmlFor={categoryId}>
          Categoria
        </label>
        <select
          id={categoryId}
          className="catalog-toolbar__select"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value={ALL_CATEGORIES}>Todas</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="catalog-toolbar__field">
        <label className="catalog-toolbar__label" htmlFor={sortId}>
          Ordenar por
        </label>
        <select
          id={sortId}
          className="catalog-toolbar__select"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <p className="catalog-toolbar__count" aria-live="polite">
        {resultCount} {resultLabel}
      </p>
    </div>
  )
}

export default CatalogToolbar
