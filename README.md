# book-library

UI for a book store.

## Bookshelf section

Shelves of books with their spines facing out. Books are drawn at twice their `spine` size so the titles are easy to read; on phones, books and shelves are drawn at half that. Two or three books per shelf lean slightly to one side, with 2–5 upright books between each pair. A small settings button (gear) beside the heading opens a menu with a **Shelves** switch that hides the bookcase and shelf labels, so the books stand on the page. The menu closes on Escape, a click outside, or tabbing away. Hovering (or tabbing to) a book stands it up straight and turns it to face the visitor with a slight spring (the `--bks-turn` easing in `Bookshelf.css`), widening its slot so the neighbouring books slide aside, and raises a small price slip from the top of the book. Clicking a book pulls it off the shelf, starting from however far it has turned. It turns to show its cover and comes forward over a dimmed overlay. A price tag slides out from between the pages at the bottom-right corner. The title, "by" and the author, the description, the format and an Add to cart button showing the price appear 1.5 s after the click. The close button, Escape, or a click on the backdrop puts the book back.

Shelves span the full width of the page. The books end at a bookend on the right and are centred on wide screens; on narrow screens each shelf scrolls sideways, starting from the first book.

```sh
npm install
npm run dev     # demo page at http://localhost:5173
npm run build   # typecheck + production build
npm run lint
```

Built with React 19, TypeScript, Vite and [Motion](https://motion.dev) (formerly Framer Motion). Requires `react`, `react-dom` and `motion`.

### Live demo

Every push to `main` builds the demo and publishes it to GitHub Pages (`.github/workflows/pages.yml`). In the repository's **Settings → Pages**, **Source** must be set to **GitHub Actions**.

## Adding it to your shop

Copy `src/components/Bookshelf/` into your project and import from its `index.ts`:

```tsx
import { Bookshelf, type Book, type Shelf } from './components/Bookshelf'

<Bookshelf
  shelves={shelves}
  onAddToCart={(book) => cart.add(book.id)}
  formatPrice={(price) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price)}
/>
```

### Props

| Prop | Type | |
| --- | --- | --- |
| `shelves` | `Shelf[]` | Required. Shelves in display order, each with its books in display order. |
| `onAddToCart` | `(book: Book) => void \| Promise<unknown>` | Called when Add to cart is pressed. Return a promise (your cart API call) to show "Adding…" until it settles. If it rejects, the button shows "Couldn’t add. Try again". |
| `formatPrice` | `(price: number) => string` | Formats prices on the tags and the cart button. Defaults to US dollars. |
| `title` | `string` | Section heading. Defaults to "Browse the shelves". |
| `showSettings` | `boolean` | Shows the settings button and its menu (the Shelves switch). Defaults to `true`. |

### Data shape

Only `id`, `title`, `author` and `price` are required, so most catalogue tables map straight across:

```ts
interface Shelf {
  id: string        // stable key, e.g. a category ID
  label: string
  books: Book[]
}

interface Book {
  id: string        // stable, unique: SKU, ISBN or database key. Passed back to onAddToCart.
  title: string
  author: string
  price: number     // major currency units, e.g. 12.99
  format?: string   // e.g. "Hardcover"; hidden when omitted
  description?: string
  spine?: { color?: string; height?: number; thickness?: number; tilt?: number } // see below
}
```

**Spine appearance is optional.** Any `spine` value you leave out is derived from the book's `id`, so a book keeps the same colour and size on every page load without storing anything; which books lean is derived from the shelf's `id` the same way. Derived colours come from the palette (see Styling). To control it, store a hex `color`, a `height` (about 185–245 px), a `thickness` (about 24–75 px), for example from page count, and a `tilt` in degrees (about -3 to 3; negative leans left, `0` stands the book up straight). A supplied `tilt` overrides the shelf's own choice for that book, so spacing between leaning books is then up to you. The shelf draws height and thickness at twice that size, or at that size on phones.

**The same book can sit on more than one shelf** (e.g. a book in two categories). Book IDs only need to be unique within a shelf.

Example: grouping rows from a `books` table by category:

```ts
type Row = { sku: string; title: string; author: string; price_cents: number; binding: string; blurb: string; category: string }

function toShelves(rows: Row[], categories: { id: string; name: string }[]): Shelf[] {
  return categories.map((category) => ({
    id: category.id,
    label: category.name,
    books: rows
      .filter((row) => row.category === category.id)
      .map((row) => ({
        id: row.sku,
        title: row.title,
        author: row.author,
        price: row.price_cents / 100,
        format: row.binding,
        description: row.blurb,
      })),
  }))
}
```

The component only renders what it's given; fetch the data however your app already does and pass the result in. `src/demo/sampleShelves.ts` is the sample catalogue used by the demo page, and `src/App.tsx` shows `onAddToCart` with an async cart call.

### Styling

Every class and CSS custom property is prefixed `bks-`, so they won't clash with your site's styles. To theme the section, override these on `.bks-bookshelf, .bks-stage`:

| Property | Default |
| --- | --- |
| `--bks-font-serif` | Uncial Antiqua, falling back to `system-ui` |
| `--bks-font-hand` | Caveat (price tags), falling back to cursive |
| `--bks-text`, `--bks-text-muted` | Heading and hint text colours |
| `--bks-wood`, `--bks-wood-light` | Bookcase colours |
| `--bks-fired-clay`, `--bks-dune`, `--bks-portobello`, `--bks-lagoon`, `--bks-wild-thyme`, `--bks-cream` | The palette: `#c1572f`, `#d18730`, `#57311a`, `#1e3147`, `#5f5f40`, `#f4e7d7`. Darker and lighter shades (`--bks-fired-clay-deep`, `--bks-dune-light`, `--bks-portobello-deep`) are used where text needs more contrast. |

Spine colours derived from book IDs use the same five colours, each in three shades (`PALETTE` in `appearance.ts`).

The demo loads Uncial Antiqua and Caveat from Google Fonts in `index.html`; add the same `<link>` to your site to get the same look. Uncial Antiqua has a single weight and no italic, so the component sets serif text at weight 400. The open book is placed in a fixed overlay at `z-index: 1000`.

## Where things live

| File | What it does |
| --- | --- |
| `src/components/Bookshelf/index.ts` | Public exports: `Bookshelf` and the data types. |
| `src/components/Bookshelf/types.ts` | `Book`, `Shelf`, `SpineStyle`. |
| `src/components/Bookshelf/Bookshelf.tsx` | The section: renders the settings, shelves and spines, tracks the selected book. |
| `src/components/Bookshelf/SettingsMenu.tsx` | The gear button and its menu panel. Settings are passed in as children, so more can be added as rows. |
| `src/components/Bookshelf/BookStage.tsx` | The overlay: the open/close animation sequence, price tag, details, Add to cart and close buttons. Timing constants (`DETAILS_DELAY`, `OPEN_TILT`, …) are at the top. |
| `src/components/Bookshelf/BookFaces.tsx` | The spine artwork (shared by the shelf and the 3D book) and the 3D book itself. |
| `src/components/Bookshelf/appearance.ts` | Spine colour and size derived from a book's ID; which books lean on each shelf; text colour for contrast; the default price format. |
| `src/components/Bookshelf/Bookshelf.css` | All styles, including the palette, the open book's size, leaning books and the single phone breakpoint (759px), which halves the shelf scale (`--bks-shelf-scale`). |
| `src/demo/sampleShelves.ts` | Sample catalogue for the demo page (placeholder prices). |

## How the animation works

The spines on the shelf are flat buttons. On click, a 3D book (a CSS `preserve-3d` box) is rendered in the overlay. It starts rotated 90°, leaning as far as the book on the shelf, and scaled so that its spine lies exactly over the clicked spine, and the spine on the shelf is hidden to leave a gap. From there the book:

1. grows slightly, as if pulled forward off the shelf (0.3 s);
2. flies to its resting place while turning to show the cover, on a spring that overshoots a little and settles (about 0.9 s);
3. springs the price tag out between the covers (about 0.45 s).

The springiness is set by `BOUNCE_OPEN`, `BOUNCE_CLOSE` and `BOUNCE_TAG` in `BookStage.tsx` (0 = no bounce). The flight back uses less, so the book doesn't swing past its gap.

The details fade in on their own timer, starting 1.5 s after the click; until then they can't be clicked or focused. Closing runs these steps in reverse. The shelf position is measured again at close time, so the book returns to the right gap. If the spine can't be found, the book fades in or out in place instead.

The open book's size is set in CSS (`--bks-h` on `.bks-stage`); the script reads the rendered size rather than computing it.

With `prefers-reduced-motion`, the book and details appear without animation.

While a book is open, page scrolling is locked. If hiding the scrollbar widens the page, the body gets that much extra right padding (on top of the site's own) so nothing shifts; with overlay scrollbars or `scrollbar-gutter: stable` nothing is added.

## Tests

```sh
npm run test:unit        # helpers (Vitest, Node)
npm run test:component   # Bookshelf with different data and cart callbacks (Vitest, real Chromium)
npm run test:e2e         # the demo page in Chromium, Firefox and WebKit (Playwright)
npm test                 # all of the above
```

| Suite | Where | What it covers |
| --- | --- | --- |
| Unit | `src/**/*.test.ts` | Spine look derived from ids (stable, varied, overridable), leaning books per shelf (two or three, spaced 2–5 apart, fewer on short rows), text contrast, default price format. |
| Component | `src/**/*.test.tsx` | The settings menu (opening, closing three ways), the Shelves switch and `showSettings`, minimal and full book data, missing optional fields, custom `formatPrice`, empty catalogue, the same book on two shelves, two bookshelves on a page, and `onAddToCart` returning nothing, resolving or rejecting (with retry). |
| End-to-end | `tests/e2e/` | Shelf layout and centring, leaning books, hiding the bookcase, half-size shelves on phones, hover price slips, turning a hovered book to its cover, phone layout, the open-book dialog, closing three ways with focus return, focus trap, pick-up alignment (upright and leaning), details timing and inertness, scroll locking on four kinds of host page, and axe accessibility checks (WCAG 2.2 AA). |

CI (`.github/workflows/ci.yml`) runs lint, build and all three suites on every pull request; the end-to-end suite runs in Chromium, Firefox and WebKit.

Before the first run, install browsers with `npx playwright install`. To use a Chromium that's already installed instead, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its path.

Not covered automatically: how smooth the animation feels on real devices, and Safari itself (WebKit in CI is the same engine, drawn differently). Check those by hand on a Mac, an iPhone and a low-end Android phone.
