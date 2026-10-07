import { Bookshelf } from './components/Bookshelf/Bookshelf'
import { shelves } from './data/books'

export default function App() {
  return (
    <main>
      <Bookshelf shelves={shelves} />
    </main>
  )
}
