import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, ChartBar, CheckCircle, Desktop, FileText, TreeStructure } from '@phosphor-icons/react'
import { X } from '@/components/slab'
import { WorkflowPreview, StrategyPreview, WebsitePreview, GrowthPreview } from './ProjectPreviews'
import { AutomationsPanel, PlanPanel, BarrelPanel, AIWindow } from './ProjectPanels'
import { useIsPhone } from '@/hooks/useMediaQuery'

/**
 * Four illustrated project categories, translated from the approved reference.
 * Each card opens its existing section in a near-fullscreen dialog.
 *
 * The dialog is a portal at z 8000, under the funnel preview (9000) so the
 * barrel's own "open this page" dialog can still stack on top of it.
 */
type Project = {
  id: string
  title: string
  desc: string
  Icon: ComponentType<{ size?: number }>
  Section: ComponentType<{ onClose?: () => void }>
  category: string
  features: string[]
  Preview: ComponentType
  /** Phone filter bucket. */
  cat: Cat
}

type Cat = 'work' | 'sites' | 'ai'
const FILTERS: { key: Cat | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'work', label: 'Work' },
  { key: 'sites', label: 'Sites' },
  { key: 'ai', label: 'AI' },
]

const PROJECTS: Project[] = [
  { id: 'workflows', cat: 'work', category: 'CRM & automation', title: 'Workflow systems', desc: 'Screens and handoffs that turn repeatable tasks into reliable operations.', Icon: TreeStructure, Section: AutomationsPanel, Preview: WorkflowPreview, features: ['Custom workflows', 'Task automation', 'Team handoffs', 'CRM setup & optimization'] },
  { id: 'plan', cat: 'work', category: 'Strategy & planning', title: 'Strategy Documents', desc: 'Seven operating plans for CRM, automation and e-commerce operations.', Icon: FileText, Section: PlanPanel, Preview: StrategyPreview, features: ['Clear roadmap', 'Actionable strategies', 'KPIs & milestones', 'Tools & integrations'] },
  { id: 'funnels', cat: 'sites', category: 'Web design & development', title: 'Conversion-ready websites', desc: 'Landing pages and customer journeys built to make the next step obvious.', Icon: Desktop, Section: BarrelPanel, Preview: WebsitePreview, features: ['Conversion-focused design', 'Clear user journeys', 'Responsive page layouts', 'Lead capture & booking'] },
  { id: 'ai', cat: 'ai', category: 'Growth & integrations', title: 'Growth systems & automation', desc: 'CRM, automation and e-commerce systems that reduce manual work.', Icon: ChartBar, Section: AIWindow, Preview: GrowthPreview, features: ['CRM setup & automation', 'E-commerce integrations', 'Connected workflows', 'Notifications & handoffs'] },
]

/* ---------- Dialog ----------
   A backdrop, a close button in the corner, and the work. No panel, no
   header: each Section brings its own window (or, for the strip, none). */
function ProjectModal({ project, onClose, children }: { project: Project; onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab') return
      // A second dialog (e.g. a website preview) owns focus when stacked above us.
      const dialog = dialogRef.current
      if (!dialog || document.activeElement?.closest('[role="dialog"]') !== dialog) return
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])'))
        .filter(el => !el.hasAttribute('disabled') && el.getClientRects().length > 0)
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    const previousOverflow = document.body.style.overflow
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return createPortal(
    <div
      ref={dialogRef}
      className="pmodal"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button ref={closeRef} type="button" className="pmodal__close" onClick={onClose} aria-label="Close">
        <X size={18} weight="bold" />
      </button>
      <div className="pmodal__stage">{children}</div>
    </div>,
    document.body,
  )
}

/* ---------- The page ---------- */

export default function ProjectsGrid() {
  const [open, setOpen] = useState<Project | null>(null)
  const phone = useIsPhone()
  const [cat, setCat] = useState<Cat | 'all'>('all')
  const keep = (p: Project) => !phone || cat === 'all' || p.cat === cat
  const projects = PROJECTS.filter(keep)
  const triggerRef = useRef<HTMLElement | null>(null)

  const show = useCallback((p: Project, el: HTMLElement) => {
    triggerRef.current = el
    setOpen(p)
  }, [])
  const close = useCallback(() => {
    setOpen(null)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  return (
    <section className="pgrid pgrid--studio" aria-labelledby="projects-title" data-lenis-prevent>
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Projects</span>
        <h1 className="pgrid__title" id="projects-title">
          Systems that turn busywork into momentum.
        </h1>
        <p className="pgrid__lede">A practical portfolio of CRM builds, automation workflows, strategy documents, and conversion-ready digital experiences for growing teams.</p>
      </header>

      {phone && (
        <div className="pfilter" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className="pfilter__btn"
              aria-pressed={cat === f.key}
              onClick={() => setCat(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="project-gallery">
        {projects.map((p, index) => (
          <button
            key={p.id}
            type="button"
            className="project-card"
            data-id={p.id}
            style={{ ['--project-delay' as string]: index * 80 + 'ms' }}
            onClick={(e) => show(p, e.currentTarget)}
            aria-haspopup="dialog"
            aria-label={'View ' + p.title}
            aria-describedby={'project-description-' + p.id}
          >
            <span className="project-card__content">
              <span className="project-card__topline">
                <span className="project-card__icon" aria-hidden="true"><p.Icon size={30} /></span>
                <span className="project-card__category">{p.category}</span>
              </span>
              <span className="project-card__title">{p.title}</span>
              <span className="project-card__desc" id={'project-description-' + p.id}>{p.desc}</span>
              <span className="project-card__features">
                {p.features.map(feature => <span key={feature}><CheckCircle size={17} aria-hidden="true" />{feature}</span>)}
              </span>
              <span className="project-card__cta">View project <ArrowRight size={21} aria-hidden="true" /></span>
            </span>
            <p.Preview />
          </button>
        ))}
      </div>

      {open && (
        <ProjectModal project={open} onClose={close}>
          {open.id === 'plan' ? <open.Section onClose={close} /> : <open.Section />}
        </ProjectModal>
      )}
    </section>
  )
}
