import { useState } from 'react'
import { Bookshelf, type Book } from './components/Bookshelf'
import { sampleShelves } from './demo/sampleShelves'

/** Stand-in for a real cart API call. */
const fakeCartRequest = (book: Book) => new Promise((resolve) => setTimeout(() => resolve(book.id), 400))

export default function App() {
  const [cart, setCart] = useState<string[]>([])

  return (
    <main>
      <p className="demo-cart" aria-live="polite">
        Cart: {cart.length} {cart.length === 1 ? 'item' : 'items'}
      </p>
      <Bookshelf
        shelves={sampleShelves}
        onAddToCart={async (book) => {
          await fakeCartRequest(book)
          setCart((items) => [...items, book.id])
        }}
      />
    </main>
  )
}
