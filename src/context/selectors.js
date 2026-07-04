import { CATEGORIES } from './cartReducer'

// Number of DISTINCT products with at least one variant qty > 0.
// Per spec: two variants of the same product (e.g. Red x2, Blue x3)
// still count as ONE selected product, not two.
export function getSelectedCount(state, category) {
  return state[category].filter((product) =>
    product.variants.some((v) => v.qty > 0),
  ).length
}

// Flat list of every variant with qty > 0, across every category,
// each carrying its own category/product/variant info for the review panel.
export function getLineItems(state) {
  const lines = []
  for (const category of CATEGORIES) {
    for (const product of state[category]) {
      for (const variant of product.variants) {
        if (variant.qty > 0) {
          lines.push({
            category,
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            variantLabel: variant.label,
            image: product.image,
            qty: variant.qty,
            unitPrice: product.price,
            unitCompareAtPrice: product.compareAtPrice,
            control: product.control,
            billingSuffix: product.billingSuffix || null,
          })
        }
      }
    }
  }
  return lines
}

export function getTotals(state) {
  const lines = getLineItems(state)
  let subtotal = 0
  let compareAtSubtotal = 0

  for (const line of lines) {
    subtotal += line.unitPrice * line.qty
    compareAtSubtotal += (line.unitCompareAtPrice ?? line.unitPrice) * line.qty
  }

  // Shipping: shown as its own line, discounted to free in this promo.
  subtotal += state.shipping.price
  compareAtSubtotal += state.shipping.compareAtPrice

  const savings = Math.max(0, compareAtSubtotal - subtotal)

  return { subtotal, compareAtSubtotal, savings }
}
