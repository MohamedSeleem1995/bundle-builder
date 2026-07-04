import { useState } from 'react'
import { useCart } from '../context/CartContext'
import QuantityStepper from './QuantityStepper'
import VariantSelector from './VariantSelector'

function formatPrice(n) {
  return `$${n.toFixed(2)}`
}

export default function ProductCard({ category, product }) {
  const { dispatch } = useCart()

  // UI-only state: which variant's stepper is currently visible on this card.
  // Defaults to the first variant that already has a qty, else the first variant.
  const initialVariant =
    product.variants.find((v) => v.qty > 0)?.id ?? product.variants[0].id
  const [activeVariantId, setActiveVariantId] = useState(initialVariant)

  const activeVariant = product.variants.find((v) => v.id === activeVariantId)
  const isSelected = product.variants.some((v) => v.qty > 0)

  function handleQtyChange(qty) {
    dispatch({
      type: 'SET_VARIANT_QTY',
      category,
      productId: product.id,
      variantId: activeVariantId,
      qty,
    })
  }

  function handleSingleSelect() {
    dispatch({ type: 'SELECT_SINGLE', category, productId: product.id })
  }

  return (
    <div
      className={`relative rounded-lg border bg-white p-3 shadow-card ${
        isSelected ? 'border-brand ring-1 ring-brand' : 'border-gray-200'
      }`}
    >
      {product.badge && (
        <span className="absolute left-3 top-3 rounded bg-badge px-2 py-0.5 text-[11px] font-semibold text-white">
          {product.badge}
        </span>
      )}

      <div className="flex gap-3">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden'
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
          <p className="mt-0.5 text-xs leading-snug text-gray-500">
            {product.description}{' '}
            {product.learnMoreUrl && (
              <a href={product.learnMoreUrl} className="text-brand underline">
                Learn More
              </a>
            )}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <VariantSelector
          variants={product.variants}
          activeVariantId={activeVariantId}
          onSelect={setActiveVariantId}
        />

        <div className="ml-auto text-right">
          {product.compareAtPrice != null && (
            <div className="text-xs text-savings line-through">
              {formatPrice(product.compareAtPrice)}
            </div>
          )}
          <div className="text-sm font-semibold text-gray-900">
            {product.price === 0 ? 'FREE' : formatPrice(product.price)}
            {product.billingSuffix}
          </div>
        </div>
      </div>

      <div className="mt-3">
        {product.control === 'fixed' ? (
          <QuantityStepper qty={activeVariant.qty} onChange={() => {}} disabled />
        ) : product.control === 'single-select' ? (
          <button
            type="button"
            onClick={handleSingleSelect}
            className={`rounded border px-3 py-1 text-xs font-medium ${
              isSelected
                ? 'border-brand bg-brand text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isSelected ? 'Selected' : 'Select plan'}
          </button>
        ) : (
          <QuantityStepper qty={activeVariant.qty} onChange={handleQtyChange} />
        )}
      </div>
    </div>
  )
}
