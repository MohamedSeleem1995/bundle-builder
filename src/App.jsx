import { CartProvider } from './context/CartContext'
import BuilderPanel from './components/BuilderPanel'
import ReviewPanel from './components/ReviewPanel'

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <BuilderPanel />
          <ReviewPanel />
        </div>
      </div>
    </CartProvider>
  )
}
