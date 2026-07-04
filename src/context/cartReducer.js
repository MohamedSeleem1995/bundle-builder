// The reducer is the ONLY place cart data changes.
// Everything else (subtotal, savings, "N selected", review lines) is derived
// from this state at render time - nothing else is stored redundantly.

export const CATEGORIES = ['cameras', 'plan', 'sensors', 'accessories']

export function buildInitialState(seedData) {
  const state = {}
  for (const category of CATEGORIES) {
    state[category] = seedData[category].items.map((item) => ({
      ...item,
      variants: item.variants.map((v) => ({ ...v })),
    }))
  }
  state.shipping = seedData.shipping
  state.meta = {
    stepTitles: Object.fromEntries(CATEGORIES.map((c) => [c, seedData[c].stepTitle])),
  }
  return state
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_VARIANT_QTY': {
      const { category, productId, variantId, qty } = action
      const safeQty = Math.max(0, qty)
      return {
        ...state,
        [category]: state[category].map((product) => {
          if (product.id !== productId) return product
          return {
            ...product,
            variants: product.variants.map((v) =>
              v.id === variantId ? { ...v, qty: safeQty } : v,
            ),
          }
        }),
      }
    }

    // Plan is single-select: choosing one product sets its qty to 1 and
    // zeroes every other product in the same category.
    case 'SELECT_SINGLE': {
      const { category, productId } = action
      return {
        ...state,
        [category]: state[category].map((product) => ({
          ...product,
          variants: product.variants.map((v) => ({
            ...v,
            qty: product.id === productId ? 1 : 0,
          })),
        })),
      }
    }

    case 'HYDRATE': {
      return action.state
    }

    default:
      return state
  }
}
