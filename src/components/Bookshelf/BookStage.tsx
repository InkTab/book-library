import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
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
import { formatPrice, type Book } from '../../data/books'
import { Book3D, COVER_RATIO } from './BookFaces'

/** Seconds from the click until title, author and description appear. */
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
  rotateY: number
  perspective: number
}

const STAGE_POSE: Pose = { x: 0, y: 0, z: 0, scale: 1, rotateY: OPEN_TILT, perspective: STAGE_PERSPECTIVE }
/** How much the book grows and lifts as it is pulled out of the shelf. */
const PULL_SCALE = 1.08
const PULL_LIFT = 6

const createValues = () => ({
  x: motionValue(0),
  y: motionValue(0),
  z: motionValue(0),
  scale: motionValue(1),
  rotateY: motionValue(OPEN_TILT),
  perspective: motionValue(STAGE_PERSPECTIVE),
  opacity: motionValue(0),
  backdrop: motionValue(0),
  /** 0 = tucked between the pages, 1 = sticking out. */
  tag: motionValue(0),
})
type Values = ReturnType<typeof createValues>

const POSE_KEYS = ['x', 'y', 'z', 'scale', 'rotateY', 'perspective'] as const

function setPose(mv: Values, pose: Pose) {
  for (const key of POSE_KEYS) mv[key].set(pose[key])
}

type Tween = [MotionValue<number>, number, ValueAnimationTransition<number>]

const poseTweens = (mv: Values, pose: Pose, t: ValueAnimationTransition<number>): Tween[] =>
  POSE_KEYS.map((key) => [mv[key], pose[key], key === 'rotateY' ? { ...t, ease: 'easeInOut' } : t])

/** Runs tweens together; resolves when all finish. */
const together = (tweens: Tween[]) => Promise.all(tweens.map(([value, to, t]) => animate(value, to, t)))

function useViewport() {
  const read = () => ({ width: window.innerWidth, height: window.innerHeight })
  const [size, setSize] = useState(read)
  useEffect(() => {
    const onResize = () => setSize(read())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

function stageBookHeight({ width, height }: { width: number; height: number }) {
  if (width < 760) {
    // Leave room for the price tag sticking out on the right.
    return Math.round(Math.min(300, height * 0.46, (width - 140) / COVER_RATIO))
  }
  return Math.round(Math.min(440, height * 0.64))
}

interface BookStageProps {
  book: Book
  shelfLabel: string
  /** The spine button on the shelf the book came from. */
  getOrigin: () => HTMLElement | null
  onClosed: () => void
}

export function BookStage({ book, shelfLabel, getOrigin, onClosed }: BookStageProps) {
  const reduceMotion = useReducedMotion()
  const speed = reduceMotion ? 0 : 1
  const height = stageBookHeight(useViewport())

  const anchorRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const [mv] = useState(createValues)

  // `scale` in Motion is 2D; scale3d keeps the book's depth in proportion.
  const transform = useTransform(() => {
    const s = mv.scale.get()
    return `translate3d(${mv.x.get()}px, ${mv.y.get()}px, ${mv.z.get()}px) scale3d(${s}, ${s}, ${s}) rotateY(${mv.rotateY.get()}deg)`
  })
  const perspectiveCss = useTransform(() => `${mv.perspective.get()}px`)
  const tagOffset = useTransform(mv.tag, [0, 1], ['0%', '74%'])
  const tagRotate = useTransform(mv.tag, [0, 1], [0, 5])

  /** The pose that puts the 3D book's spine exactly over the spine on the shelf. */
  const shelfPose = (): Pose | null => {
    const origin = getOrigin()?.getBoundingClientRect()
    const anchor = anchorRef.current?.getBoundingClientRect()
    if (!origin || !anchor) return null
    const s = origin.height / height
    return {
      x: origin.left + origin.width / 2 - (anchor.left + anchor.width / 2),
      y: origin.top + origin.height / 2 - (anchor.top + anchor.height / 2),
      // After rotating 90°, the spine sits half a cover-width in front of the pivot; pull it back to z = 0.
      z: -(height * COVER_RATIO * s) / 2,
      scale: s,
      rotateY: 90,
      perspective: SHELF_PERSPECTIVE,
    }
  }

  // Lock page scroll so the spine stays where we measure it. Declared before the open effect so it
  // runs first; the padding stands in for the scrollbar so nothing on the page shifts.
  useLayoutEffect(() => {
    const { documentElement: root, body } = document
    const scrollbar = window.innerWidth - root.clientWidth
    const previous = { overflow: root.style.overflow, paddingRight: body.style.paddingRight }
    root.style.overflow = 'hidden'
    body.style.paddingRight = `${scrollbar}px`
    return () => {
      root.style.overflow = previous.overflow
      body.style.paddingRight = previous.paddingRight
    }
  }, [])

  // Open: pull the book out of the shelf, fly it forward while turning it to the cover, then slide the tag out.
  // Returns a cancel function; the close sequence also stops it.
  const open = useEffectEvent(() => {
    const pose = shelfPose()
    if (!pose) return
    setPose(mv, pose)
    mv.opacity.set(1)
    closeRef.current?.focus({ preventScroll: true })

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
    if (!pose) return onClosed()
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

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
    // The close button is the only focusable control in the dialog.
    if (e.key === 'Tab') {
      e.preventDefault()
      closeRef.current?.focus()
    }
  })

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const titleId = `stage-title-${book.id}`
  const shown = !closing

  return createPortal(
    <div className="stage" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <motion.div className="stage__backdrop" style={{ opacity: mv.backdrop }} onClick={close} />

      <motion.button
        ref={closeRef}
        type="button"
        className="stage__close"
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

      <div className="stage__content">
        <div className="stage__book-slot">
          <motion.div ref={anchorRef} className="stage__anchor" style={{ perspective: perspectiveCss }}>
            <motion.div className="stage__book" style={{ transform, opacity: mv.opacity }}>
              <Book3D book={book} height={height}>
                <motion.div
                  className="price-tag"
                  style={{ x: tagOffset, rotate: tagRotate }}
                >
                  <span className="price-tag__amount">{formatPrice(book.price)}</span>
                </motion.div>
              </Book3D>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="stage__details"
          initial={{ opacity: 0, x: 24 }}
          animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
          transition={shown ? { duration: 0.5 * speed, delay: DETAILS_DELAY * speed, ease: 'easeOut' } : { duration: 0.2 * speed }}
        >
          <p className="stage__shelf">{shelfLabel}</p>
          <h2 id={titleId} className="stage__title">
            {book.title}
          </h2>
          <p className="stage__author">{book.author}</p>
          <p className="stage__description">{book.description}</p>
        </motion.div>
      </div>
    </div>,
    document.body,
  )
}
