# Security Bundle Builder

A 4-step accordion product builder with a live-updating review panel, built with React + Vite + Tailwind.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## How it's organized

```
src/
  data/products.json       -- all product/plan/sensor/accessory data (single source of truth)
  context/
    cartReducer.js          -- the only place cart data is mutated
    selectors.js             -- derives counts, line items, totals from state (nothing is stored twice)
    CartContext.jsx           -- React Context + localStorage persistence
  components/
    ProductCard.jsx            -- variant selector + qty stepper for one product
    VariantSelector.jsx         -- color chip row
    QuantityStepper.jsx          -- shared +/- control (used on both card and review line)
    BuilderStep.jsx                -- one accordion step
    BuilderPanel.jsx                 -- the 4-step accordion
    ReviewPanel.jsx                   -- the right-hand summary
  App.jsx                                -- two-column layout
```

## Key decisions

- **One cart reducer, everything else derived.** Subtotal, savings, per-step
  "N selected" counts, and the review panel's line items are all computed
  from the single `cart` state object on every render (`selectors.js`).
  Nothing is duplicated into separate pieces of state that could drift out
  of sync.

- **Variant selection is UI state, not cart state.** Which color chip is
  "active" on a card lives in local `useState` inside `ProductCard`. The
  quantity stepper always reads/writes `variants[activeVariant].qty` on the
  cart. This is what makes the required behavior work: add 2 Red, switch the
  chip to Blue, the stepper shows 0 (Blue's own count), Red's 2 are
  untouched, and the review panel still shows both Red x2 and Blue x(n) as
  separate lines once each has a qty above zero.

- **"N selected" counts distinct products, not variant totals.** A product
  with Red x2 and Blue x3 selected counts as 1 selected product in the step
  header, per spec.

- **Every product shares one data shape**, including single-variant products
  (`variants: [{ id: "default", label: null, ... }]`) and non-color items.
  This means `ProductCard`, the stepper, and the review panel never branch
  on "does this product have colors" - they just read whatever's in
  `variants`. The `control` field (`variant-qty` / `fixed` / `single-select`)
  is what changes behavior (editable stepper vs. required/locked vs.
  plan-style single choice), not the presence of variants.

- **Persistence is explicit, not automatic.** "Save my system for later"
  writes the full cart state to `localStorage`. On load, the app only
  restores from `localStorage` if a save exists; otherwise it always starts
  from the seed data in `products.json`, so a fresh visitor sees the design
  exactly as specified rather than picking up someone else's in-progress
  state.

## Known gaps / what I'd do next

- **Steps 2-4 (Plan, Sensors, Extra protection) are wired up functionally
  but not yet pixel-matched** - I only had the Step 1 (Cameras) screen to
  match precisely. The data model and components already support all four
  step types; once I have those screens the visual pass should be quick.
- **Product images are placeholder SVGs** in `public/products/` - swap in
  real exports from Figma at the same filenames referenced in
  `src/data/products.json`.
- **Mobile breakpoint** has been given a basic responsive treatment
  (single column below `sm`, cards stack), but hasn't been checked against
  a specific mobile frame from the design since none was provided.
- **Selected-chip highlighting** was intentionally left minimal per the
  spec's note to focus on behavior over that particular styling detail.
