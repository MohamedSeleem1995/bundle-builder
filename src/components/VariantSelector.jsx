export default function VariantSelector({ variants, activeVariantId, onSelect }) {
  // Products with a single unnamed variant (no color options) render nothing.
  if (variants.length === 1 && variants[0].label === null) return null

  return (
    <div className="flex items-center gap-2">
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          onClick={() => onSelect(variant.id)}
          aria-pressed={activeVariantId === variant.id}
          className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs text-gray-700 ${
            activeVariantId === variant.id ? 'border-brand' : 'border-gray-300'
          }`}
        >
          <span
            className="h-3 w-3 rounded-full border border-gray-300"
            style={{ backgroundColor: variant.swatch }}
          />
          {variant.label}
        </button>
      ))}
    </div>
  )
}
