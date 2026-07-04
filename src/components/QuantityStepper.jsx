export default function QuantityStepper({ qty, onChange, disabled = false, size = 'md' }) {
  const dim = size === 'sm' ? 'h-6 w-6 text-xs' : 'h-7 w-7 text-sm'

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || qty <= 0}
        onClick={() => onChange(qty - 1)}
        className={`${dim} flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent`}
      >
        –
      </button>
      <span className="min-w-[1.25rem] text-center text-sm font-medium text-gray-800">{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(qty + 1)}
        className={`${dim} flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent`}
      >
        +
      </button>
    </div>
  )
}
