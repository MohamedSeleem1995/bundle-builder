import { createContext, useContext, useReducer, useState } from 'react'
import { cartReducer, buildInitialState } from './cartReducer'
import seedData from '../data/products.json'

const STORAGE_KEY = 'bundle-builder:saved-system'

const CartContext = createContext(null)

function loadInitialState() {
  // Deliberately NOT auto-restoring on every load from scratch - only when
  // the shopper has explicitly saved before. If nothing was ever saved,
  // the app should look exactly like the seed design on first load.
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // corrupted or inaccessible storage - fall back to seed silently
  }
  return buildInitialState(seedData)
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState)
  const [justSaved, setJustSaved] = useState(false)

  function saveForLater() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2000)
    } catch {
      // localStorage unavailable (private browsing, quota, etc.) - fail quietly
    }
  }

  function hasSavedSystem() {
    return localStorage.getItem(STORAGE_KEY) !== null
  }

  return (
    <CartContext.Provider value={{ state, dispatch, saveForLater, justSaved, hasSavedSystem }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
