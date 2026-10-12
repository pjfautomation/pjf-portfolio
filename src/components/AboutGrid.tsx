import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, MapPin } from '@/components/slab'
import { profile } from '@/data/profile'
import HeroEcosystem from './HeroEcosystem'

/**
 * AboutGrid - the About view as a fixed viewport.
 *
 * One glass sheet, two columns: who you are on the left, the illustration
 * on the right. Sized to the panel, so nothing here scrolls.
 *
 * The left column is a ladder, not a paragraph block: one display statement,
 * one line of context, then the four things you do - each carrying the marks
 * of the tools it is built with. The tools are the proof, so they are the
 * visual. Swap the marks below for your own (any square SVG/PNG in public/).
 */

const N8N = { src: '/icons/ai/n8n.svg', name: 'n8n' }
const ZAPIER = { src: '/icons/ai/zapier.svg', name: 'Zapier' }
const MAKE = { src: '/icons/thesvg/make.svg', name: 'Make' }
const SHOPIFY = { src: '/icons/thesvg/shopify.svg', name: 'Shopify' }
const CLAUDE = { src: '/icons/thesvg/claude.svg', name: 'Claude' }
const CODEX = { src: '/icons/ai/codex.svg', name: 'Codex' }
const CHATGPT = { src: '/icons/thesvg/openai-chatgpt.svg', name: 'ChatGPT' }
const GHL = { src: '/icons/gohighlevel.png', name: 'GoHighLevel' }
const CLAUDE_CODE = { src: '/icons/claude-code-logo.png', name: 'Claude Code' }
const AMAZON = { src: '/icons/thesvg/amazon.svg', name: 'Amazon' }

const CERTIFICATIONS = [
  { src: '/certifications/highlevel-crm.png', title: 'HighLevel CRM certificate', label: 'HighLevel CRM' },
  { src: '/certifications/n8n.png', title: 'AI Automation with n8n certificate', label: 'n8n' },
  { src: '/certifications/make.png', title: 'Make certificate', label: 'Make' },
  { src: '/certifications/zapier.png', title: 'Zapier certificate', label: 'Zapier' },
  { src: '/certifications/prompt-engineering.png', title: 'Prompt Engineering certificate', label: 'Prompt Engineering' },
] as const

type Capability = {
  index: string
  title: string
  marks: { src: string; name: string }[]
}

const CAPABILITIES: Capability[] = [
  {
    index: '01',
    title: 'GoHighLevel CRM and lead journeys',
    marks: [GHL],
  },
  {
    index: '02',
    title: 'Automation with n8n, Make.com and Zapier',
    marks: [N8N, MAKE, ZAPIER],
  },
  {
    index: '03',
    title: 'AI-assisted builds and operations',
    marks: [CLAUDE_CODE, CODEX, CHATGPT, CLAUDE],
  },
  {
    index: '04',
    title: 'Shopify and Amazon VA support',
    marks: [SHOPIFY, AMAZON],
  },
]

export default function AboutGrid() {
  const [selected, setSelected] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const certificate = selected === null ? null : CERTIFICATIONS[selected]

  useEffect(() => {
    if (selected !== null && !dialogRef.current?.open) dialogRef.current?.showModal()
  }, [selected])

  const closeViewer = () => {
    dialogRef.current?.close()
    setSelected(null)
    triggerRef.current?.focus()
  }
  const move = (direction: number) => {
    setSelected((current) => current === null ? null : (current + direction + CERTIFICATIONS.length) % CERTIFICATIONS.length)
  }
  return (
    <section className="pgrid agrid" aria-labelledby="about-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">About</span>
        <h1 className="pgrid__title" id="about-title">
          {`Hi, I’m ${profile.firstName}.`}
        </h1>
        <p className="pgrid__lede">
          I help coaches, agencies, service businesses and e-commerce teams connect their systems and simplify daily operations.
        </p>
      </header>

      <div className="home__glass agrid__glass">
        <div className="agrid__copy">
          <p className="agrid__lead">
            GoHighLevel and automation are at the core of my work.
            <span> AI-assisted solutions and e-commerce VA support complete the picture.</span>
          </p>

          <p className="agrid__note">
            <strong>I build connected systems and support the work behind them.</strong>{' '}
            From GoHighLevel CRM and n8n, Make.com and Zapier workflows to Claude Code, Codex, ChatGPT and Claude — plus hands-on Shopify and Amazon VA support.
          </p>

          <ul className="agrid__caps" role="list">
            {CAPABILITIES.map((c) => (
              <li key={c.index} className="agrid__cap">
                <span className="agrid__cap-marks">
                  {c.marks.map((m, i) => (
                    <span
                      key={m.name}
                      className="agrid__mark"
                      style={{ '--i': c.marks.length - i } as CSSProperties}
                    >
                      <img src={m.src} alt={m.name} loading="lazy" decoding="async" />
                    </span>
                  ))}
                </span>
                <span className="agrid__cap-title">{c.title}</span>
                <span className="agrid__cap-index" aria-hidden="true">
                  {c.index}
                </span>
              </li>
            ))}
          </ul>

          {/* Credentials stay in the proof area and open at full size. */}
          <div className="agrid__bar">
            <span className="agrid__cell">
              <span className="agrid__cell-mark">
                <MapPin size={16} weight="fill" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">Based in the Philippines</span>
                <span className="agrid__cell-meta">GMT+8 · US hours</span>
              </span>
            </span>

            <a className="agrid__cell" href="https://www.linkedin.com/in/philipjeidf" target="_blank" rel="noreferrer">
              <span className="agrid__cell-mark agrid__cell-mark--linkedin">
                <img src="/icons/linkedin.svg" alt="" loading="lazy" decoding="async" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">Let’s connect</span>
                <span className="agrid__cell-meta">Find me on LinkedIn</span>
              </span>
              <ArrowUpRight className="agrid__cell-go" size={15} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="agrid__visual">
          <div className="agrid__portrait agrid__portrait--ecosystem">
            <HeroEcosystem />
          </div>
          <section className="agrid__certs" aria-labelledby="certifications-title">
            <div className="agrid__certs-copy">
              <h2 className="agrid__certs-title" id="certifications-title">Training & certifications</h2>
              <p className="agrid__certs-note">Explore my credentials</p>
            </div>
            <div className="agrid__certs-slots">
              {CERTIFICATIONS.map((item, index) => (
                <button type="button" className="agrid__cert-slot" key={item.src}
                  aria-label={`View ${item.title}`} aria-haspopup="dialog"
                  onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(index) }}>
                  <img src={item.src} alt="" loading="lazy" decoding="async" />
                  <span className="agrid__cert-slot-label">{item.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
      {createPortal(
        <dialog ref={dialogRef} className="certificate-viewer" aria-labelledby="certificate-viewer-title"
          onCancel={(event) => { event.preventDefault(); closeViewer() }}
          onClose={() => { setSelected(null); triggerRef.current?.focus() }}
          onClick={(event) => { if (event.target === event.currentTarget) closeViewer() }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
            if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
          }}>
          <div className="certificate-viewer__content">
            <header className="certificate-viewer__head">
              <div><p>Certificate of completion</p><h2 id="certificate-viewer-title" aria-live="polite">{certificate?.label}</h2></div>
              <button type="button" onClick={closeViewer} aria-label="Close certificate viewer" autoFocus>×</button>
            </header>
            {certificate && <img className="certificate-viewer__image" src={certificate.src} alt={certificate.title} />}
            <footer className="certificate-viewer__footer">
              <button type="button" onClick={() => move(-1)} aria-label="Previous certificate">← <span>Previous</span></button>
              <span>{selected === null ? 0 : selected + 1} / {CERTIFICATIONS.length}</span>
              <button type="button" onClick={() => move(1)} aria-label="Next certificate"><span>Next</span> →</button>
            </footer>
          </div>
        </dialog>, document.body,
      )}
    </section>
  )
}
