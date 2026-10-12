import { Key, Browser, type Icon } from '@/components/slab'
import { mobileApps, type AppProject } from '@/data/projects'
import AIStack from '@/components/AIStack'
import Flagship from '@/components/Flagship'

/* Browser extensions - small Chrome tools, shown as a compact two-up block
   inside this same section (not a new section of their own). */
type Extension = {
  name: string
  desc: string
  imageSrc: string
  imageAlt: string
  Icon: Icon
}

const EXTENSIONS: Extension[] = [
  {
    name: 'CRM workflow helper',
    desc: 'A small utility concept for organizing repeatable CRM and follow-up work.',
    imageSrc: '/placeholders/extension-1.jpg',
    imageAlt: 'Extension one popup placeholder',
    Icon: Key,
  },
  {
    name: 'Operations shortcut',
    desc: 'A browser utility concept for reducing repetitive research and admin steps.',
    imageSrc: '/placeholders/extension-2.jpg',
    imageAlt: 'Extension two popup placeholder',
    Icon: Browser,
  },
]

/* ── Extension card ─────────────────────────────────────────────
   Vertical card: a faux browser window on top (chrome bar + equal-height
   stage), then badge / title / description below. The stage is the same
   height on both cards so portrait and landscape screenshots read as a
   matched set; each image is centered with
   object-fit: contain and never displayed past its native width. */
function ExtensionCard({ ext }: { ext: Extension }) {
  const ExtIcon = ext.Icon
  return (
    <li className="ext-card">
      <figure className="ext-card__window">
        <div className="ext-card__chrome" aria-hidden="true">
          <span className="ext-card__dots">
            <span className="ext-card__dot" />
            <span className="ext-card__dot" />
            <span className="ext-card__dot" />
          </span>
          <span className="ext-card__urlbar">
            <ExtIcon size={12} weight="bold" />
            chrome-extension
          </span>
        </div>
        <div className="ext-card__stage">
          <img
            className="ext-card__img"
            src={ext.imageSrc}
            alt={ext.imageAlt}
            loading="lazy"
            decoding="async"
          />
        </div>
      </figure>
      <div className="ext-card__body">
        <span className="ext-card__badge">
          <ExtIcon size={14} weight="bold" aria-hidden="true" />
          Chrome Extension
        </span>
        <h4 className="ext-card__name">{ext.name}</h4>
        <p className="ext-card__desc">{ext.desc}</p>
      </div>
    </li>
  )
}

/* ── App card ───────────────────────────────────────────────── */
function AppCard({ app }: { app: AppProject }) {
  return (
    <li
      className="app-card"
      style={{ ['--app-color' as string]: app.accentColor }}
    >
      <div className="app-card__img-wrap">
        {app.imageSrc ? (
          <img
            className="app-card__img"
            src={app.imageSrc}
            alt={`${app.name} screenshot`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="app-card__img-placeholder" aria-hidden="true">
            <span className="app-card__img-initials">
              {app.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </span>
          </div>
        )}
        <span className="app-card__badge">{app.badge}</span>
        <span className="app-card__img-fade" aria-hidden="true" />
      </div>
      <div className="app-card__body">
        <h3 className="app-card__name">{app.name}</h3>
        <p className="app-card__tagline">{app.tagline}</p>
        <p className="app-card__desc">{app.description}</p>
        <ul className="app-card__stats" role="list">
          {app.stats.map((stat) => (
            <li key={stat.label} className="app-card__stat">
              <span className="app-card__stat-value">{stat.value}</span>
              <span className="app-card__stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

/* ── Sections ───────────────────────────────────────────────
   Two exports so the Projects dialog can open each body of work on its own;
   the default still composes them (with Flagship) for anything that wants
   the whole section. */
export function AIStackSection() {
  return (
    <section
      className="projects projects--ai"
      id="projects"
      aria-labelledby="projects-heading"
      data-reveal
    >
      <header className="projects__header">
        <span className="projects__eyebrow">Systems and tools</span>
        <h2 className="projects__headline" id="projects-heading">
          GoHighLevel systems and connected automation.
        </h2>
        <p className="projects__subhead">
          The tools I use to build CRM workflows, AI-assisted operations and practical business systems.
          Open a branch to explore the stack.
        </p>
      </header>
      <div className="projects__panel" id="projects-panel">
        <AIStack />
      </div>
    </section>
  )
}

export function AppsSection() {
  return (
    <section className="projects projects--apps" aria-label="Apps and extensions" data-reveal>
      <div className="projects__panel">
        <span className="projects__ext-eyebrow">Automation and e-commerce tools</span>
        <ul className="projects__apps" role="list">
          {mobileApps.map((app) => (
            <AppCard key={app.name} app={app} />
          ))}
        </ul>

        {/* Browser extensions - a compact companion block in the same section */}
        <div className="projects__ext">
          <span className="projects__ext-eyebrow">Workflow utilities</span>
          <ul className="ext-grid" role="list">
            {EXTENSIONS.map((ext) => (
              <ExtensionCard key={ext.name} ext={ext} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function Projects() {
  return (
    <>
      <AIStackSection />
      <AppsSection />
      <Flagship />
    </>
  )
}
