# book-library

UI for a book store.

## Bookshelf section

Three full-width shelves of books with their spines facing out. Hovering (or tabbing to) a spine raises a small price slip from the top of the book. Clicking a spine pulls the book off the shelf. It turns to show its cover and comes forward over a dimmed overlay. A price tag slides out from between the pages at the bottom-right corner. Title, author, format (hardcover or paperback), description and an Add to cart button appear 1.5 s after the click. The close button, Escape, or a click on the backdrop puts the book back.

Each shelf holds about 1,360px of books. On narrower screens each shelf scrolls sideways; on wider ones a bookend follows the last book.

`<Bookshelf onAddToCart={(book) => …} />` is called when Add to cart is pressed. The button confirms with "Added to cart" for 2 s; wire the callback to your cart.

```sh
npm install
npm run dev     # http://localhost:5173
npm run build   # typecheck + production build
npm run lint
```

Built with React 19, TypeScript, Vite and [Motion](https://motion.dev) (formerly Framer Motion).

### Where things live

| File | What it does |
| --- | --- |
| `src/data/books.ts` | Shelves and books (sample data): title, author, format, description, price, binding colour, spine height/thickness. `formatPrice` sets the currency (USD). |
| `src/components/Bookshelf/Bookshelf.tsx` | The section: renders shelves and spines, tracks the selected book. |
| `src/components/Bookshelf/BookStage.tsx` | The overlay: the open/close animation sequence, price tag, details, Add to cart and close buttons. Timing constants (`DETAILS_DELAY`, `OPEN_TILT`, …) are at the top. |
| `src/components/Bookshelf/BookFaces.tsx` | The spine artwork (shared by the shelf and the 3D book) and the 3D book itself. |
| `src/components/Bookshelf/Bookshelf.css` | All styles for the section. |

### How the animation works

The spines on the shelf are flat buttons. On click, a 3D book (a CSS `preserve-3d` box) is rendered in the overlay. It starts rotated 90° and scaled so that its spine lies exactly over the clicked spine, and the spine on the shelf is hidden to leave a gap. From there the book:

1. grows slightly, as if pulled forward off the shelf (0.3 s);
2. flies to its resting place while turning to show the cover (0.9 s);
3. pushes the price tag out between the covers (0.55 s).

The details fade in on their own timer, starting 1.5 s after the click. Closing runs these steps in reverse. The shelf position is measured again at close time, so the book returns to the right gap.

With `prefers-reduced-motion`, the book and details appear without animation.
