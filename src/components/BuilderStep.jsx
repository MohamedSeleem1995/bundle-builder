import { Camera, Shield, Radar, ShieldPlus, ChevronDown, ChevronUp } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getSelectedCount } from '../context/selectors'
import ProductCard from './ProductCard'

const ICONS = {
  camera: Camera,
  shield: Shield,
  sensor: Radar,
  extra: ShieldPlus,
}

export default function BuilderStep({
  category,
  stepNumber,
  totalSteps,
  isOpen,
  onToggle,
  onNext,
  isLastStep,
}) {
  const { state } = useCart()
  const products = state[category]
  const stepTitle = state.meta.stepTitles[category]
  const selectedCount = getSelectedCount(state, category)
  const Icon = ICONS[
    { cameras: 'camera', plan: 'shield', sensors: 'sensor', accessories: 'extra' }[category]
  ]

  return (
    <div className={`border-b border-gray-200 ${isOpen ? 'bg-brand-light/40' : 'bg-white'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={isOpen}
      >
        <div>
          <div className="text-[11px] uppercase tracking-wide text-gray-400">
            Step {stepNumber} of {totalSteps}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-base font-semibold text-gray-900">
            <Icon size={18} className="text-gray-500" />
            {stepTitle}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          {isOpen && selectedCount > 0 && <span>{selectedCount} selected</span>}
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.id} category={category} product={product} />
            ))}
          </div>

          {!isLastStep && (
            <button
              type="button"
              onClick={onNext}
              className="mt-4 w-full rounded-md border border-brand py-2 text-sm font-medium text-brand hover:bg-brand-light sm:w-auto sm:px-6"
            >
              Next: {state.meta.stepTitles[nextCategoryOf(category)]}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Small helper kept local since ordering is fixed by the spec (cameras -> plan -> sensors -> accessories)
function nextCategoryOf(category) {
  const order = ['cameras', 'plan', 'sensors', 'accessories']
  return order[order.indexOf(category) + 1]
}
