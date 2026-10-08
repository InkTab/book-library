import { useEffect, useEffectEvent, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  animate,
  motion,
  motionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type ValueAnimationTransition,
} from 'motion/react'
import { spineLook } from './appearance'
import { Book3D } from './BookFaces'
import type { AddToCartResult, Book } from './types'

/** Seconds from the click until title, author, description and the cart button appear. */
const DETAILS_DELAY = 1.5
/** Resting angle once the book is out, so the page edge (and price tag) is visible. */
const OPEN_TILT = -16
/** Near-flat perspective while the book sits in the shelf, so it lines up with the flat spines. */
const SHELF_PERSPECTIVE = 20000
const STAGE_PERSPECTIVE = 1600

const EASE_FLIGHT = [0.65, 0, 0.35, 1] as const

interface Pose {
  x: number
  y: number
  z: number
  scale: number
  /** Lean in the screen plane, matching a tilted book on the shelf. */
  rotateZ: number
  rotateY: number
  perspective: number
}

const STAGE_POSE: Pose = { x: 0, y: 0, z: 0, scale: 1, rotateZ: 0, rotateY: OPEN_TILT, perspective: STAGE_PERSPECTIVE }
/** How much the book grows and lifts as it is pulled out of the shelf. */
const PULL_SCALE = 1.08
const PULL_LIFT = 6

const createValues = () => ({
  x: motionValue(0),
  y: motionValue(0),
  z: motionValue(0),
  scale: motionValue(1),
  rotateZ: motionValue(0),
  rotateY: motionValue(OPEN_TILT),
  perspective: motionValue(STAGE_PERSPECTIVE),
  opacity: motionValue(0),
  backdrop: motionValue(0),
  /** 0 = tucked between the pages, 1 = sticking out. */
  tag: motionValue(0),
})
type Values = ReturnType<typeof createValues>

const POSE_KEYS = ['x', 'y', 'z', 'scale', 'rotateZ', 'rotateY', 'perspective'] as const

function setPose(mv: Values, pose: Pose) {
  for (const key of POSE_KEYS) mv[key].set(pose[key])
}

type Tween = [MotionValue<number>, number, ValueAnimationTransition<number>]

const poseTweens = (mv: Values, pose: Pose, t: ValueAnimationTransition<number>): Tween[] =>
  POSE_KEYS.map((key) => [mv[key], pose[key], key === 'rotateY' ? { ...t, ease: 'easeInOut' } : t])

/** Runs tweens together; resolves when all finish. */
const together = (tweens: Tween[]) => Promise.all(tweens.map(([value, to, t]) => animate(value, to, t)))

const FADE = { duration: 0.3 }

/** Width and height of a box rotated by `degrees`, given its axis-aligned bounding box. */
function unrotatedSize(box: { width: number; height: number }, degrees: number) {
  const angle = Math.abs((degrees * Math.PI) / 180)
  const [cos, sin] = [Math.cos(angle), Math.sin(angle)]
  const d = cos * cos - sin * sin
  return {
    width: (box.width * cos - box.height * sin) / d,
    height: (box.height * cos - box.width * sin) / d,
  }
}

type CartState = 'idle' | 'adding' | 'added' | 'error'

const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | undefined)?.then === 'function'

interface BookStageProps {
  book: Book
  shelfLabel: string
  /** The spine button on the shelf the book came from. */
  getOrigin: () => HTMLElement | null
  onClosed: () => void
  onAddToCart?: (book: Book) => AddToCartResult
  formatPrice: (price: number) => string
}

export function BookStage({ book, shelfLabel, getOrigin, onClosed, onAddToCart, formatPrice }: BookStageProps) {
  const reduceMotion = useReducedMotion()
  const speed = reduceMotion ? 0 : 1
  const look = spineLook(book)

  const anchorRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const addRef = useRef<HTMLButtonElement>(null)
  const [closing, setClosing] = useState(false)
  // The details stay inert (no clicks, no focus) until they're visible.
  const [detailsDue, setDetailsDue] = useState(false)
  const detailsLive = detailsDue && !closing
  const [cart, setCart] = useState<CartState>('idle')
  const closingRef = useRef(false)
  const [mv] = useState(createValues)

  // `scale` in Motion is 2D; scale3d keeps the book's depth in proportion.
  const transform = useTransform(() => {
    const s = mv.scale.get()
    return `translate3d(${mv.x.get()}px, ${mv.y.get()}px, ${mv.z.get()}px) scale3d(${s}, ${s}, ${s}) rotateZ(${mv.rotateZ.get()}deg) rotateY(${mv.rotateY.get()}deg)`
  })
  const perspectiveCss = useTransform(() => `${mv.perspective.get()}px`)
  const tagOffset = useTransform(mv.tag, [0, 1], ['0%', '74%'])
  const tagRotate = useTransform(mv.tag, [0, 1], [0, 5])

  /**
   * The pose that puts the 3D book exactly over the book on the shelf: spine out at rest, or turned
   * part or all of the way to its cover while hovered, leaning as far as its shelf slot does.
   * The anchor is untransformed and the size of the open book, so its box is the book's resting place.
   */
  const shelfPose = (): Pose | null => {
    const button = getOrigin()
    const origin = button?.getBoundingClientRect()
    const anchor = anchorRef.current?.getBoundingClientRect()
    if (!button || !origin || !anchor || !origin.height) return null
    // The slot's current lean, mid-transition included. A leaning book's box is wider and taller
    // than the book itself, so recover the book's own size from it.
    const tilt = parseFloat(getComputedStyle(button.parentElement ?? button).rotate) || 0
    const { width, height } = unrotatedSize(origin, tilt)
    const s = height / anchor.height
    // Cover width and thickness on the shelf. The spine button widens from one to the other on the
    // same timing as the turn (see Bookshelf.css), so its width tells how far the book has turned.
    const cover = anchor.width * s
    const thickness = (height * look.thickness) / look.height
    const turned = Math.min(1, Math.max(0, (width - thickness) / (cover - thickness)))
    return {
      x: origin.left + origin.width / 2 - (anchor.left + anchor.width / 2),
      y: origin.top + origin.height / 2 - (anchor.top + anchor.height / 2),
      // Pull whichever face points at the visitor back to z = 0: the spine sits half a cover-width
      // in front of the pivot, the cover half a thickness.
      z: -(cover * (1 - turned) + thickness * turned) / 2,
      scale: s,
      rotateZ: tilt,
      rotateY: 90 * (1 - turned),
      perspective: SHELF_PERSPECTIVE,
    }
  }

  // Lock page scroll so the spine stays where we measure it. Declared before the open effect so it
  // runs first. Hiding the scrollbar widens the page; extra body padding takes up exactly that width
  // (none with overlay scrollbars or `scrollbar-gutter: stable`), on top of any padding the site has.
  useLayoutEffect(() => {
    const { documentElement: root, body } = document
    const previous = { overflow: root.style.overflow, paddingRight: body.style.paddingRight }
    const widthBefore = root.clientWidth
    root.style.overflow = 'hidden'
    // With `scrollbar-gutter: stable` the gutter stays reserved, although clientWidth reports it as freed.
    const gutterKept = getComputedStyle(root).scrollbarGutter.includes('stable')
    const widened = gutterKept ? 0 : root.clientWidth - widthBefore
    if (widened > 0) {
      const sitePadding = parseFloat(getComputedStyle(body).paddingRight) || 0
      body.style.paddingRight = `${sitePadding + widened}px`
    }
    return () => {
      root.style.overflow = previous.overflow
      body.style.paddingRight = previous.paddingRight
    }
  }, [])

  // Open: pull the book out of the shelf, fly it forward while turning it to the cover, then slide the tag out.
  // Returns a cancel function; the close sequence also stops it.
  const open = useEffectEvent(() => {
    closeRef.current?.focus({ preventScroll: true })
    const pose = shelfPose()
    if (!pose) {
      // The spine can't be found (e.g. removed from the page): fade the book in where it rests instead.
      setPose(mv, STAGE_POSE)
      animate(mv.opacity, 1, { duration: FADE.duration * speed })
      animate(mv.backdrop, 1, { duration: FADE.duration * speed })
      animate(mv.tag, 1, { duration: 0.55 * speed, delay: FADE.duration * speed })
      return
    }
    setPose(mv, pose)
    mv.opacity.set(1)

    let cancelled = false
    const stale = () => cancelled || closingRef.current
    ;(async () => {
      await together([
        [mv.scale, pose.scale * PULL_SCALE, { duration: 0.3 * speed, ease: 'easeOut' }],
        [mv.y, pose.y - PULL_LIFT, { duration: 0.3 * speed, ease: 'easeOut' }],
      ])
      if (stale()) return
      animate(mv.backdrop, 1, { duration: 0.6 * speed })
      await together(poseTweens(mv, STAGE_POSE, { duration: 0.9 * speed, ease: EASE_FLIGHT }))
      if (stale()) return
      animate(mv.tag, 1, { duration: 0.55 * speed, ease: [0.22, 1, 0.36, 1] })
    })()
    return () => {
      cancelled = true
    }
  })

  useLayoutEffect(() => open(), [])

  // Close: tuck the tag back in, fly the book back to its gap and push it into the shelf.
  const close = async () => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)

    await animate(mv.tag, 0, { duration: 0.3 * speed, ease: 'easeIn' })
    const pose = shelfPose()
    if (!pose) {
      // Nowhere to fly back to: fade out instead.
      await together([
        [mv.opacity, 0, { duration: FADE.duration * speed }],
        [mv.backdrop, 0, { duration: FADE.duration * speed }],
      ])
      return onClosed()
    }
    animate(mv.backdrop, 0, { duration: 0.6 * speed, delay: 0.2 * speed })
    await together(
      poseTweens(
        mv,
        { ...pose, y: pose.y - PULL_LIFT, scale: pose.scale * PULL_SCALE },
        { duration: 0.8 * speed, ease: EASE_FLIGHT },
      ),
    )
    await together([
      [mv.scale, pose.scale, { duration: 0.25 * speed, ease: 'easeIn' }],
      [mv.y, pose.y, { duration: 0.25 * speed, ease: 'easeIn' }],
    ])
    onClosed()
  }

  useEffect(() => {
    const timer = setTimeout(() => setDetailsDue(true), DETAILS_DELAY * speed * 1000)
    return () => clearTimeout(timer)
  }, [speed])

  const addToCart = async () => {
    if (cart === 'adding') return
    const result = onAddToCart?.(book)
    if (!isThenable(result)) return setCart('added')
    setCart('adding')
    try {
      await result
      setCart('added')
    } catch {
      setCart('error')
    }
  }

  // Revert the "Added" confirmation after a moment so the book can be added again.
  useEffect(() => {
    if (cart !== 'added') return
    const timer = setTimeout(() => setCart('idle'), 2000)
    return () => clearTimeout(timer)
  }, [cart])

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
    // Keep focus inside the dialog: cycle between its buttons.
    if (e.key === 'Tab') {
      e.preventDefault()
      const controls = [closeRef.current, detailsLive ? addRef.current : null].filter((el) => el !== null)
      const index = controls.indexOf(document.activeElement as HTMLButtonElement)
      const step = e.shiftKey ? -1 : 1
      controls[(index + step + controls.length) % controls.length]?.focus()
    }
  })

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const titleId = useId()
  const shown = !closing
  const price = formatPrice(book.price)
  const cartLabel = {
    idle: `Add to cart · ${price}`,
    adding: 'Adding…',
    added: 'Added to cart',
    error: 'Couldn’t add. Try again',
  }[cart]
  const cartStatus = { idle: '', adding: '', added: `${book.title} added to cart`, error: `Couldn’t add ${book.title} to the cart` }[cart]

  return createPortal(
    <div className="bks-stage" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <motion.div className="bks-stage__backdrop" style={{ opacity: mv.backdrop }} onClick={close} />

      <motion.button
        ref={closeRef}
        type="button"
        className="bks-stage__close"
        aria-label="Put the book back on the shelf"
        onClick={close}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 * speed, delay: shown ? 0.4 * speed : 0 }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.button>

      <div className="bks-stage__content">
        <div className="bks-stage__book-slot">
          <motion.div ref={anchorRef} className="bks-stage__anchor" style={{ perspective: perspectiveCss }}>
            <motion.div className="bks-stage__book" style={{ transform, opacity: mv.opacity }}>
              <Book3D book={book} look={look}>
                <motion.span className="bks-price-tag" style={{ x: tagOffset, rotate: tagRotate }}>
                  <span className="bks-price-tag__amount">{price}</span>
                </motion.span>
              </Book3D>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="bks-stage__details"
          inert={!detailsLive}
          initial={{ opacity: 0, x: 24 }}
          animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
          transition={shown ? { duration: 0.5 * speed, delay: DETAILS_DELAY * speed, ease: 'easeOut' } : { duration: 0.2 * speed }}
        >
          <p className="bks-stage__shelf">{shelfLabel}</p>
          <h2 id={titleId} className="bks-stage__title">
            {book.title}
          </h2>
          <p className="bks-stage__author">by {book.author}</p>
          {book.description && <p className="bks-stage__description">{book.description}</p>}
          {book.format && <p className="bks-stage__format">{book.format}</p>}
          <button
            ref={addRef}
            type="button"
            className="bks-stage__add"
            data-state={cart}
            aria-disabled={cart === 'adding' || undefined}
            onClick={addToCart}
          >
            {cartLabel}
          </button>
          <span className="bks-visually-hidden" role="status">
            {cartStatus}
          </span>
        </motion.div>
      </div>
    </div>,
    document.body,
  )
}
