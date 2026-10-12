import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from 'react'
import { ArrowLeft, ArrowUpRight, BookOpen, Briefcase, Gear, ShoppingBag } from '@phosphor-icons/react'
import { STRATEGY_RENDERED_FILES } from '../generated/strategyManifest'

type StrategyFormat = 'docx' | 'pdf'
type StrategyCategory = 'GHL' | 'Automation' | 'E-commerce VA'

type StrategyDocument = {
  id: string
  category: StrategyCategory
  title: string
  coverTitle: string
  summary: string
  source: string
  format: StrategyFormat
  accent: string
  Icon: ComponentType<{ size?: number; weight?: 'regular' | 'duotone' | 'bold'; 'aria-hidden'?: boolean }>
}

const DOCUMENTS: StrategyDocument[] = [
  {
    id: 'agency', category: 'GHL',
    title: 'GoHighLevel Agency Growth and Operations Strategy',
    coverTitle: 'Agency growth system',
    summary: 'Sales follow up client onboarding and scalable delivery',
    source: '/strategy-documents/GHL_Agency_Growth_and_Operations_Strategy.docx', format: 'docx',
    accent: '#DCEFE5', Icon: Briefcase,
  },
  {
    id: 'coaching', category: 'GHL',
    title: 'GoHighLevel Coaching Business Strategy',
    coverTitle: 'Coaching client journey',
    summary: 'Discovery calls enrollment onboarding and client retention',
    source: '/strategy-documents/GHL_Coaching_Business_Strategy.docx', format: 'docx',
    accent: '#E8E1F6', Icon: BookOpen,
  },
  {
    id: 'service', category: 'GHL',
    title: 'GoHighLevel Service Business Strategy',
    coverTitle: 'Service operations',
    summary: 'Inquiry handling estimates job bookings and repeat business',
    source: '/strategy-documents/GHL_Service_Business_Strategy.docx', format: 'docx',
    accent: '#F8E4D4', Icon: Gear,
  },
  {
    id: 'operations', category: 'Automation',
    title: 'Business Operations Automation Strategy',
    coverTitle: 'Business operations',
    summary: 'Inquiry handling client onboarding delivery and billing',
    source: '/strategy-documents/Business_Operations_Automation_Strategy.docx', format: 'docx',
    accent: '#DCE8F5', Icon: Gear,
  },
  {
    id: 'social', category: 'Automation',
    title: 'Social Media Lead Generation and Follow Up Strategy',
    coverTitle: 'Content-to-lead engine',
    summary: 'Content community management and consultation booking',
    source: '/strategy-documents/Social_Media_Lead_Generation_and_Follow_Up_Strategy.docx', format: 'docx',
    accent: '#F5E0EC', Icon: ArrowUpRight,
  },
  {
    id: 'amazon', category: 'E-commerce VA',
    title: 'Amazon Seller Operations and Inventory Strategy',
    coverTitle: 'Amazon seller ops',
    summary: 'Virtual assistant delivery and workflow automation',
    source: '/strategy-documents/Amazon_Seller_Operations_and_Inventory_Strategy.docx', format: 'docx',
    accent: '#F7E8C9', Icon: ShoppingBag,
  },
  {
    id: 'shopify', category: 'E-commerce VA',
    title: 'Shopify Store Operations and Customer Retention Strategy',
    coverTitle: 'Shopify retention',
    summary: 'Virtual assistant delivery and automation implementation',
    source: '/strategy-documents/Shopify_VA_Operations_and_Retention_Strategy.docx', format: 'docx',
    accent: '#DDF0D6', Icon: ShoppingBag,
  },
]

function Cover({ document }: { document: StrategyDocument }) {
  const CoverIcon = document.Icon
  return (
    <div className="strategy-card__cover" style={{ '--cover-color': document.accent } as CSSProperties} role="img" aria-label={`${document.category} strategy cover`}>
      <span className="strategy-card__cover-grid" aria-hidden="true" />
      <span className="strategy-card__cover-icon"><CoverIcon size={38} weight="duotone" aria-hidden={true} /></span>
      <span className="strategy-card__cover-label">{document.category}</span>
      <span className="strategy-card__cover-title">{document.coverTitle}</span>
    </div>
  )
}

function DocumentViewer({ document, onBack, onClose }: { document: StrategyDocument; onBack: () => void; onClose: () => void }) {
  const renderedSource = document.source.replace(/\.docx$/i, '.html').replace('/strategy-documents/', '/strategy-documents/rendered/')
  const renderedFile = renderedSource.split('/').pop() ?? ''
  const isAvailable = document.format === 'pdf' || STRATEGY_RENDERED_FILES.has(renderedFile)
  const [renderedMarkup, setRenderedMarkup] = useState<string | null>(null)
  const [renderError, setRenderError] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    globalThis.document.addEventListener('keydown', onKeyDown)
    return () => globalThis.document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!isAvailable || document.format !== 'docx') return
    const controller = new AbortController()
    setRenderedMarkup(null)
    setRenderError(false)
    fetch(renderedSource, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${response.status}`)
        return response.text()
      })
      .then((html) => {
        const parsed = new DOMParser().parseFromString(html, 'text/html')
        setRenderedMarkup(parsed.querySelector('article')?.innerHTML ?? '')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setRenderError(true)
      })
    return () => controller.abort()
  }, [document.format, isAvailable, renderedSource])

  return (
    <div className="strategy-viewer" role="dialog" aria-modal="true" aria-labelledby="strategy-viewer-title">
      <header className="strategy-viewer__bar">
        <button type="button" className="strategy-viewer__back" onClick={onBack}>
          <ArrowLeft size={18} weight="bold" aria-hidden="true" />
          Back to Library
        </button>
        <div className="strategy-viewer__title-wrap">
          <span className="strategy-viewer__category">{document.category}</span>
          <h2 id="strategy-viewer-title">{document.title}</h2>
        </div>
      </header>
      <main className="strategy-viewer__scroll" data-lenis-prevent>
        {!isAvailable ? (
          <div className="strategy-viewer__message" role="alert">
            <strong>This document is currently unavailable.</strong>
            <span>The source file could not be found in the public document library.</span>
          </div>
        ) : document.format === 'pdf' ? (
          <iframe className="strategy-viewer__pdf" src={document.source} title={document.title} />
        ) : renderError ? (
          <div className="strategy-viewer__message" role="alert">
            <strong>This document could not be displayed.</strong>
            <span>Return to the library and try opening it again.</span>
          </div>
        ) : renderedMarkup === null ? (
          <div className="strategy-viewer__loading" role="status" aria-live="polite">
            <span className="strategy-viewer__loading-orbit" aria-hidden="true" />
            Preparing the document for reading…
          </div>
        ) : (
          <article className="strategy-viewer__document" dangerouslySetInnerHTML={{ __html: renderedMarkup }} />
        )}
      </main>
    </div>
  )
}

export default function StrategyLibrary({ onClose }: { onClose?: () => void }) {
  const [selected, setSelected] = useState<StrategyDocument | null>(null)
  const lastTrigger = useRef<HTMLButtonElement | null>(null)

  const closeViewer = () => {
    setSelected(null)
    requestAnimationFrame(() => lastTrigger.current?.focus())
  }

  return (
    <div className="strategy-library ppanel ppanel--window">
      <div className="ppanel__bar">
        <span className="ppanel__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="ppanel__url"><span className="ppanel__url-host">Strategy Document Library</span></span>
      </div>
      <div className="strategy-library__scroll" data-lenis-prevent>
        <header className="strategy-library__hero">
          <div className="strategy-library__hero-topline">
            <span className="strategy-library__eyebrow">STRATEGY DOCUMENTS</span>
            <span className="strategy-library__hero-status"><i aria-hidden="true" /> {DOCUMENTS.length} source documents</span>
          </div>
          <h1>Operating plans for the systems I build.</h1>
          <p>Read the source strategies behind CRM, automation and e-commerce operations.</p>
          <div className="strategy-library__hero-meta" aria-label="Document categories">
            <span><b>03</b> GHL systems</span>
            <span><b>02</b> automation plays</span>
            <span><b>02</b> e-commerce VA plans</span>
          </div>
        </header>
        <div className="strategy-library__grid" role="list" aria-label="Strategy documents">
          {DOCUMENTS.map((document, index) => (
            <button
              key={document.id}
              ref={(element) => { if (element && selected?.id === document.id) lastTrigger.current = element }}
              type="button"
              className="strategy-card"
              style={{ '--card-delay': `${index * 70}ms` } as CSSProperties}
              onClick={(event) => { lastTrigger.current = event.currentTarget; setSelected(document) }}
              aria-haspopup="dialog"
              aria-label={`${document.title}. ${document.summary}`}
            >
              <Cover document={document} />
              <span className="strategy-card__body">
                <span className="strategy-card__category">{document.category}</span>
                <strong className="strategy-card__title">{document.title}</strong>
                <span className="strategy-card__summary">{document.summary}</span>
                <span className="strategy-card__footer">
                  <span className="strategy-card__format">{document.format.toUpperCase()} · READ ONLY</span>
                  <span className="strategy-card__action">Open document <ArrowUpRight size={15} weight="bold" aria-hidden="true" /></span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      {selected && <DocumentViewer document={selected} onBack={closeViewer} onClose={onClose ?? closeViewer} />}
    </div>
  )
}
