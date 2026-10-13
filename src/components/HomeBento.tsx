import type React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  FolderOpen,
  User,
  Robot,
  Medal,
  Stack,
  Quotes,
  FunnelSimple,
  Gear,
  AddressBook,
  Globe,
  AppWindow,
  CalendarBlank,
  ArrowsClockwise,
  MagnifyingGlass,
  FileText,
  Bell,
  GitBranch,
  ShoppingBag,
  Package,
  VideoCamera,
  ClipboardText,
} from '@/components/slab'
import { aiStack, type StackNode } from '@/data/ai-stack'

/**
 * Home's showcase: one card per rail view, each an index of what that view
 * holds, each built from content the portfolio already ships. Every card is
 * a link. Nothing here invents a fact - the funnels, the tools, the clients
 * and the credentials are the same records the views render in full.
 *
 * Motion is transform-only on a clipped inner track, so a card never adds
 * height and Home stays a single viewport.
 */

const PROJECT_SHOTS = [
  '/home/project-categories/workflow-systems.png',
  '/home/project-categories/strategy-documents.png',
  '/home/project-categories/websites.png',
  '/home/project-categories/growth-systems.png',
]

const OFFERS = [
  { Icon: FunnelSimple, title: 'CRM & sales pipelines', note: 'GoHighLevel systems' },
  { Icon: AddressBook, title: 'Funnels, forms & campaigns', note: 'Lead conversion paths' },
  { Icon: Gear, title: 'n8n · Make · Zapier automation', note: 'Connected workflows' },
  { Icon: Globe, title: 'Shopify & Amazon operations', note: 'E-commerce support' },
  { Icon: AppWindow, title: 'Social media support', note: 'Content and community' },
] as const

const ABOUT_TOOLS = [
  { name: 'GoHighLevel', src: '/icons/gohighlevel.png' },
  { name: 'n8n', src: '/icons/ai/n8n.svg' },
  { name: 'Make', src: '/icons/thesvg/make.svg' },
  { name: 'Shopify', src: '/icons/thesvg/shopify.svg' },
] as const

/** The AI systems as a flat list: every leaf of the Projects tree, in order. */
const leaves = (n: StackNode): StackNode[] =>
  n.children?.length ? n.children.flatMap(leaves) : [n]
const AI_BUILDS = leaves(aiStack)
const BUILD_ICONS: Record<string, typeof Robot> = {
  'lead-capture-follow-up-engine': FunnelSimple,
  'appointment-booking-reminder-system': CalendarBlank,
  'lead-reactivation-engine': ArrowsClockwise,
  'crm-pipeline-opportunity-system': AddressBook,
  'lead-routing-enrichment-engine': GitBranch,
  'client-onboarding-automation': ClipboardText,
  'cross-platform-data-sync': ArrowsClockwise,
  'internal-notification-handoff-system': Bell,
  'ai-lead-qualification-assistant': Robot,
  'ai-knowledge-assistant': MagnifyingGlass,
  'ai-content-repurposing-workflow': FileText,
  'shopify-store-operations': ShoppingBag,
  'product-listing-optimization': MagnifyingGlass,
  'amazon-seller-operations': Package,
  'content-repurposing-pipeline': VideoCamera,
  'social-content-workflow': FileText,
}

function CardHead({
  Icon,
  title,
  desc,
}: {
  Icon: typeof FolderOpen
  title: string
  desc: string
}) {
  return (
    <header className="bento__head">
      <span className="bento__label">
        <span className="bento__icon">
          <Icon size={20} weight="fill" aria-hidden="true" />
        </span>
        <h3 className="bento__title">{title}</h3>
      </span>
      <p className="bento__desc">{desc}</p>
      <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
    </header>
  )
}

export default function HomeBento() {
  const half = Math.ceil(AI_BUILDS.length / 2)
  const toolRows = [AI_BUILDS.slice(0, half), AI_BUILDS.slice(half)]

  return (
    <nav className="bento" aria-label="Explore the portfolio">
      {/* Projects: category thumbnails drift upward on the existing looped track. */}
      <Link to="/projects" className="bento__card bento__card--projects">
        <CardHead Icon={FolderOpen} title="Projects" desc="CRM systems, workflows and e-commerce operations." />
        <div className="bento__media bento__reel bento__reel--categories" aria-hidden="true">
          <div className="bento__reel-track">
            {[...PROJECT_SHOTS, ...PROJECT_SHOTS].map((src, i) => (
              <span key={i} className="bento__shot" data-copy={i >= PROJECT_SHOTS.length ? 1 : 0}>
                <img src={src} alt="" loading="lazy" decoding="async" width={1672} height={941} />
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* About: Philip's portrait and the tools behind his work. */}
      <Link to="/about" className="bento__card bento__card--about">
        <CardHead Icon={User} title="About Philip" desc="CRM, automation, and e-commerce systems specialist." />
        <div className="bento__media bento__identity">
          <div className="bento__identity-portrait" aria-hidden="true">
            <img className="bento__identity-illustration" src="/philip-waving-illustration-v1.png" alt="" loading="lazy" decoding="async" width={1301} height={1227} />
          </div>
          <div className="bento__identity-tools">
            {ABOUT_TOOLS.map((tool) => (
              <span key={tool.name}><img src={tool.src} alt="" width={14} height={14} loading="lazy" decoding="async" />{tool.name}</span>
            ))}
          </div>
          <span className="bento__credential-cta">Meet Philip <ArrowUpRight size={14} weight="bold" aria-hidden="true" /></span>
        </div>
      </Link>

      {/* AI builds: the systems from the Projects tree, two chip rows
          scrolling against each other. */}
      <Link to="/projects" className="bento__card bento__card--ai">
        <CardHead Icon={Robot} title="AI Builds" desc="Claude Code, Claude, Codex, ChatGPT, Cursor and AntiGravity." />
        <div className="bento__media bento__chips" aria-hidden="true">
          {toolRows.map((row, r) => (
            <div key={r} className="bento__chip-row" data-dir={r ? 'right' : 'left'}>
              <div className="bento__chip-track">
                {[...row, ...row].map((n, i) => {
                  const BuildIcon = BUILD_ICONS[n.id] ?? n.Icon
                  return (
                  <span key={`${n.id}-${i}`} className="bento__chip" data-status={n.status} data-copy={i >= row.length ? 1 : 0}>
                    <BuildIcon size={15} weight="regular" />
                    {n.name}
                  </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Link>

      {/* Credentials: a preview of the real certificates in About. */}
      <Link to="/about#certifications-title" className="bento__card bento__card--creds">
        <CardHead Icon={Medal} title="Credentials" desc="Training in the tools behind the systems I build." />
        <div className="bento__media bento__credentials">
          <div className="bento__certificate-stack" aria-hidden="true">
            {['n8n', 'zapier', 'highlevel-crm'].map((name, index) => (
              <img key={name} src={`/certifications/${name}.png`} alt="" loading="lazy" decoding="async"
                style={{ '--certificate-index': index } as React.CSSProperties} />
            ))}
          </div>
          <p className="bento__credential-tools">HighLevel · n8n · Make · Zapier · AI</p>
          <span className="bento__credential-cta">View certifications <ArrowUpRight size={14} weight="bold" aria-hidden="true" /></span>
        </div>
      </Link>

      {/* Capabilities: the five core offers as a compact index. */}
      <Link to="/services" className="bento__card bento__card--services">
        <CardHead Icon={Stack} title="Core capabilities" desc="GoHighLevel systems, connected automation and practical operations support." />
        <ul className="bento__media bento__offers" role="list">
          {OFFERS.map(({ Icon, title, note }, i) => (
            <li key={title} className="bento__offer" style={{ '--i': i } as React.CSSProperties}>
              <span className="bento__offer-tile">
                <Icon size={15} weight="duotone" aria-hidden="true" />
              </span>
              <span className="bento__offer-text">
                <span className="bento__offer-title">{title}</span>
                <span className="bento__offer-note">{note}</span>
              </span>
              <span className="bento__offer-num" aria-hidden="true">
                0{i + 1}
              </span>
            </li>
          ))}
        </ul>
      </Link>

      {/* Work in Action: scroll the shipped workflow thumbnails. */}
      <Link to="/work-in-action" className="bento__card bento__card--quotes">
        <CardHead Icon={Quotes} title="Work in Action" desc="Run interactive workflows and see the outputs in the tools your team uses." />
        <div className="bento__media bento__reel bento__reel--categories" aria-hidden="true">
          <div className="bento__reel-track">
            {[0, 1].flatMap(copy => ['lead-journey', 'appointment-care', 'client-welcome', 'ai-receptionist', 'basic-rag', 'hr-assistant'].map(id => (
              <span className="bento__shot" key={`${copy}-${id}`} data-copy={copy}><img src={`/workflow-thumbnails/${id}.png`} alt="" width={1672} height={941} loading="lazy" decoding="async" /></span>
            )))}
          </div>
        </div>
      </Link>
    </nav>
  )
}
