import { BadgeCheck, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getLineItems, getTotals } from '../context/selectors'
import QuantityStepper from './QuantityStepper'

function formatPrice(n) {
  return `$${n.toFixed(2)}`
}

const CATEGORY_LABELS = {
  cameras: 'Cameras',
  sensors: 'Sensors',
  accessories: 'Accessories',
  plan: 'Plan',
}

export default function ReviewPanel() {
  const { state, dispatch, saveForLater, justSaved } = useCart()
  const lines = getLineItems(state)
  const { subtotal, compareAtSubtotal, savings } = getTotals(state)

  const grouped = lines.reduce((acc, line) => {
    ;(acc[line.category] ??= []).push(line)
    return acc
  }, {})

  function handleQtyChange(line, qty) {
    dispatch({
      type: 'SET_VARIANT_QTY',
      category: line.category,
      productId: line.productId,
      variantId: line.variantId,
      qty,
    })
  }

  return (
    <div className="rounded-lg border border-brand-light bg-brand-light/30 p-4">
      <div className="text-[11px] uppercase tracking-wide text-gray-400">Review</div>
      <h2 className="mt-0.5 text-lg font-bold text-gray-900">Your security system</h2>
      <p className="mt-1 text-xs text-gray-500">
        Review your personalized protection system designed to keep what matters most safe.
      </p>

      <div className="mt-4 space-y-4">
        {Object.entries(grouped).map(([category, categoryLines]) => (
          <div key={category}>
            <div className="text-[11px] uppercase tracking-wide text-gray-400">
              {CATEGORY_LABELS[category]}
            </div>
            <div className="mt-1 space-y-2">
              {categoryLines.map((line) => (
                <div key={`${line.productId}-${line.variantId}`} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-white">
                    <img
                      src={line.image}
                      alt=""
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.visibility = 'hidden'
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1 text-xs text-gray-800">
                    {line.name}
                    {line.variantLabel ? ` — ${line.variantLabel}` : ''}
                  </div>

                  {line.control === 'variant-qty' ? (
                    <QuantityStepper qty={line.qty} onChange={(q) => handleQtyChange(line, q)} size="sm" />
                  ) : (
                    <span className="text-xs text-gray-400">
                      {line.control === 'fixed' ? 'Required' : ''}
                    </span>
                  )}

                  <div className="w-16 flex-shrink-0 text-right">
                    {line.unitCompareAtPrice != null && (
                      <div className="text-[10px] text-savings line-through">
                        {formatPrice(line.unitCompareAtPrice * line.qty)}
                      </div>
                    )}
                    <div className="text-xs font-semibold text-gray-900">
                      {line.unitPrice * line.qty === 0
                        ? 'FREE'
                        : formatPrice(line.unitPrice * line.qty)}
                      {line.billingSuffix}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-brand-light pt-3 text-xs text-gray-700">
        <div className="flex items-center gap-1.5">
          <Truck size={14} className="text-brand" />
          {state.shipping.label}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-savings line-through">
            {formatPrice(state.shipping.compareAtPrice)}
          </div>
          <div className="font-semibold text-gray-900">FREE</div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
        <BadgeCheck size={16} className="text-brand" />
        100% satisfaction guarantee
      </div>

      <div className="mt-3 border-t border-brand-light pt-3 text-right">
        <div className="text-xs text-savings line-through">{formatPrice(compareAtSubtotal)}</div>
        <div className="text-2xl font-bold text-brand">{formatPrice(subtotal)}</div>
      </div>

      {savings > 0 && (
        <p className="mt-1 text-right text-xs font-medium text-green-600">
          Congrats! You're saving {formatPrice(savings)} on your security bundle!
        </p>
      )}

      <button
        type="button"
        onClick={() => window.alert('This is a prototype - checkout is not implemented.')}
        className="mt-4 w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Checkout
      </button>

      <button
        type="button"
        onClick={saveForLater}
        className="mt-2 w-full text-center text-xs text-gray-500 underline hover:text-gray-700"
      >
        {justSaved ? 'Saved!' : 'Save my system for later'}
      </button>
    </div>
  )
}
