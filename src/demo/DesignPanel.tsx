import { useEffect, useId, useRef, useState } from 'react'
import { cleanValues, DEFAULTS, designCss, SETTINGS, type DesignValues, type Setting } from './designSettings'
import './designPanel.css'

const STORAGE_KEY = 'book-library:design'

function loadValues(): DesignValues {
  try {
    return cleanValues(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'))
  } catch {
    return {}
  }
}

const groups = [...new Set(SETTINGS.map((s) => s.group))]

/**
 * Demo-only design controls: sliders and colour pickers that restyle the bookshelf live. Values are kept
 * in localStorage; "Copy CSS" copies the override rules so they can be pasted into a site's stylesheet.
 */
export function DesignPanel() {
  const [open, setOpen] = useState(false)
  // Only changed settings are stored, so new defaults in a later version still apply.
  const [values, setValues] = useState<DesignValues>(loadValues)
  const [copied, setCopied] = useState(false)
  const panelId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const css = designCss(values)
  const changedCount = Object.keys(values).length

  useEffect(() => {
    if (changedCount) localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    else localStorage.removeItem(STORAGE_KEY)
  }, [values, changedCount])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKeyDown = (e: KeyboardEvent) => {
      // Escape inside an open book closes the book, not the panel.
      if (e.key !== 'Escape' || document.querySelector('.bks-stage')) return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const set = (setting: Setting, value: number | string) =>
    setValues((current) => {
      const next = { ...current }
      if (value === DEFAULTS[setting.key]) delete next[setting.key]
      else next[setting.key] = value
      return next
    })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css || '/* Every setting is at its default. */')
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked (e.g. not a secure context): nothing to copy to.
    }
  }

  return (
    <>
      {css && <style data-design-overrides="">{css}</style>}
      <button
        ref={toggleRef}
        type="button"
        className="demo-design__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        Customize design{changedCount ? ` (${changedCount})` : ''}
      </button>
      <aside id={panelId} className="demo-design" aria-label="Design controls" hidden={!open}>
        <div className="demo-design__header">
          <h2 className="demo-design__title">Design</h2>
          <button
            ref={closeRef}
            type="button"
            className="demo-design__close"
            aria-label="Close design controls"
            onClick={() => {
              setOpen(false)
              toggleRef.current?.focus()
            }}
          >
            ×
          </button>
        </div>
        <p className="demo-design__hint">Changes apply live. Hover a book or open one to see the effects on it.</p>

        {groups.map((group) => (
          <fieldset key={group} className="demo-design__group">
            <legend>{group}</legend>
            {SETTINGS.filter((s) => s.group === group).map((setting) => (
              <Control key={setting.key} setting={setting} value={values[setting.key] ?? setting.default} onChange={set} />
            ))}
          </fieldset>
        ))}

        <div className="demo-design__actions">
          <button type="button" onClick={copy}>
            {copied ? 'Copied' : 'Copy CSS'}
          </button>
          <button type="button" disabled={!changedCount} onClick={() => setValues({})}>
            Reset all
          </button>
        </div>
      </aside>
    </>
  )
}

interface ControlProps {
  setting: Setting
  value: number | string
  onChange: (setting: Setting, value: number | string) => void
}

function Control({ setting, value, onChange }: ControlProps) {
  const id = useId()
  const isChanged = value !== setting.default

  return (
    <div className="demo-design__row" data-changed={isChanged || undefined}>
      <label htmlFor={id}>{setting.label}</label>
      {setting.type === 'range' ? (
        <>
          <output htmlFor={id}>
            {value}
            {setting.unit}
          </output>
          <input
            id={id}
            type="range"
            min={setting.min}
            max={setting.max}
            step={setting.step}
            value={value}
            onChange={(e) => onChange(setting, Number(e.target.value))}
          />
        </>
      ) : (
        <input id={id} type="color" value={value} onChange={(e) => onChange(setting, e.target.value)} />
      )}
      <button
        type="button"
        className="demo-design__reset"
        aria-label={`Reset ${setting.label}`}
        title="Reset"
        disabled={!isChanged}
        onClick={() => onChange(setting, setting.default)}
      >
        ↺
      </button>
    </div>
  )
}
