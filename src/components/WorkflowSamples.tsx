import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AUTOMATION_GALLERY, type AutomationPlatform } from '@/data/automation-gallery'

const PLATFORM_ICONS: Record<AutomationPlatform, string> = { n8n: '/icons/ai/n8n.svg', 'Make.com': '/icons/thesvg/make.svg', Zapier: '/icons/ai/zapier.svg' }
function PlatformBadge({ platform }: { platform: AutomationPlatform }) {
  return <span className="automation-gallery__badge" data-platform={platform}><img src={PLATFORM_ICONS[platform]} width="20" height="20" alt="" />{platform}</span>
}

export default function WorkflowSamples() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const samples = AUTOMATION_GALLERY
  const active = activeIndex === null ? null : samples[activeIndex]
  const isOpen = active !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isOpen) return
    dialog.showModal()
    return () => { dialog.close(); triggerRef.current?.focus() }
  }, [isOpen])

  const move = (direction: number) => setActiveIndex(index => index === null ? null : (index + direction + samples.length) % samples.length)

  return (
    <section className="automation-gallery automation-gallery--scrolling" aria-labelledby="automation-gallery-heading" data-lenis-prevent>
      <header className="automation-gallery__head">
        <span>Workflow systems</span><h2 id="automation-gallery-heading">Explore the automations.</h2>
        <p>Browse the tools, connections, and business tasks behind each workflow.</p>
      </header>
      <div className="automation-gallery__strip">
      <div className="automation-gallery__track" data-paused={isOpen}>
        {[...samples, ...samples].map((sample, index) => <article className="automation-gallery__card" key={`${sample.id}-${index}`} aria-hidden={index >= samples.length || undefined}>
          <div className="automation-gallery__window-bar" aria-hidden="true"><i /><i /><i /></div>
          <button className="automation-gallery__image" tabIndex={index >= samples.length ? -1 : undefined} type="button" aria-label={`Open ${sample.title} screenshot`} onClick={event => { triggerRef.current = event.currentTarget; setActiveIndex(index % samples.length) }}>
            <img src={`/automation-gallery/${sample.id}-thumb.webp`} alt={`${sample.title} workflow overview`} loading={index < samples.length ? 'eager' : 'lazy'} decoding="async" width="1672" height="941" />
            <span>View screenshot</span>
          </button>
          <div className="automation-gallery__copy">
            <PlatformBadge platform={sample.platform} />
            <h3>{sample.title}</h3>
          </div>
        </article>)}
      </div>
      </div>
      {createPortal(<dialog ref={dialogRef} className="automation-viewer" aria-label={active ? `${active.title} screenshot` : 'Workflow screenshot'} onCancel={event => { event.preventDefault(); setActiveIndex(null) }} onClick={event => { if (event.target === event.currentTarget) setActiveIndex(null) }} onKeyDown={event => {
        if (event.key === 'Escape') event.stopPropagation()
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
      }}>
        {active && <div className="automation-viewer__content">
          <header><div><PlatformBadge platform={active.platform} /><h2>{active.title}</h2></div><button type="button" aria-label="Close screenshot" onClick={() => setActiveIndex(null)}>✕</button></header>
          <img src={`/automation-gallery/${active.id}.webp`} alt={`${active.title} full workflow overview`} />
          <footer><button type="button" onClick={() => move(-1)}>Previous</button><span aria-live="polite">{(activeIndex ?? 0) + 1} / {samples.length}</span><button type="button" onClick={() => move(1)}>Next</button></footer>
          {active.demo && <Link className="automation-viewer__demo" to={active.demo}>Try the interactive demo ↗</Link>}
        </div>}
      </dialog>, document.body)}
    </section>
  )
}
