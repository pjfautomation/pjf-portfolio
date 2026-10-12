import type { CSSProperties } from 'react'
import { MagnetStraight, Timer, Trophy, CheckCircle } from '@/components/slab'
import type { Icon } from '@/components/slab'
import Autopilot, { TOOLS } from '@/components/Autopilot'

/**
 * ServicesGrid - the Services view on one glass sheet.
 *
 * Three bands, top to bottom: your three-step method (on a dark plate so it
 * is the first thing the eye lands on), the five services as cards that carry
 * the marks of what each one is built with, and the live automation demo
 * scaled into whatever height is left. Same object language as Home and
 * Projects: the glass, the bento card, plated marks, orange for the index
 * and the accent.
 *
 * Service descriptions are based on the supplied resume and current offer.
 */

/* ---------- The method ---------- */

type Stage = {
  index: string
  label: string
  body: string
  Icon: Icon
  chips: string[]
}

const STAGES: Stage[] = [
  {
    index: '01',
    label: 'Map the process',
    body: 'Understand the customer journey, current tools, repetitive tasks and desired outcome.',
    Icon: MagnetStraight,
    chips: ['CRM', 'Leads', 'Operations'],
  },
  {
    index: '02',
    label: 'Build the system',
    body: 'Configure GoHighLevel and connect the workflows, pages and tools the business needs.',
    Icon: Timer,
    chips: ['GHL', 'n8n', 'Make'],
  },
  {
    index: '03',
    label: 'Manage and improve',
    body: 'Test every handoff, document the setup and continue improving the system.',
    Icon: Trophy,
    chips: ['SOPs', 'Testing', 'Support'],
  },
]

/* ---------- The services ---------- */

// Example tool marks from /public/icons. Swap for the tools you actually use.
const GHL = '/icons/gohighlevel.png'
const N8N = '/icons/ai/n8n.svg'
const MAKE = '/icons/thesvg/make.svg'
const ZAPIER = '/icons/thesvg/zapier.svg'
const SHOPIFY = '/icons/thesvg/shopify.svg'
const AMAZON = '/icons/thesvg/amazon.svg'
const META = '/icons/thesvg/meta.svg'
const INSTAGRAM = '/icons/thesvg/instagram.svg'
const FACEBOOK = '/icons/thesvg/facebook.svg'

type Service = {
  index: string
  title: string
  description: string
  chip: string
  logos: string[]
  bullets: string[]
}

const SERVICES: Service[] = [
  {
    index: '01', title: 'GoHighLevel CRM & Sales Systems',
    description: 'Complete GoHighLevel systems built around how your business captures, manages and converts leads.',
    chip: 'Primary offer', logos: [GHL],
    bullets: ['Custom CRM setup and configuration', 'Pipelines, stages and opportunities', 'Calendars, forms and appointment booking', 'Lead nurturing and follow-up campaigns'],
  },
  {
    index: '02', title: 'Landing Pages & Campaigns',
    description: 'Conversion-focused pages and campaigns built directly inside GoHighLevel.',
    chip: 'GoHighLevel', logos: [GHL],
    bullets: ['Landing pages, funnels and forms', 'Email and SMS campaign setup', 'Triggers, workflows and follow-up sequences', 'Tracking, testing and optimization'],
  },
  {
    index: '03', title: 'Workflow Automation',
    description: 'Connected workflows that reduce manual work and keep information moving between your tools.',
    chip: 'Automation', logos: [N8N, MAKE, ZAPIER],
    bullets: ['n8n, Make.com and Zapier workflows', 'App integrations and data synchronization', 'Automated tasks, notifications and handoffs', 'Workflow testing and documentation'],
  },
  {
    index: '04', title: 'E-commerce Operations',
    description: 'Reliable day-to-day support for Shopify and Amazon stores.',
    chip: 'Operations support', logos: [SHOPIFY, AMAZON],
    bullets: ['Product listings and catalog updates', 'Order and customer support', 'Store administration and reporting', 'Inventory and seller account assistance'],
  },
  {
    index: '05', title: 'Social Media Management',
    description: 'Consistent social media support that keeps your brand active and organized.',
    chip: 'Additional support', logos: [META, INSTAGRAM, FACEBOOK],
    bullets: ['Content scheduling and publishing', 'Caption and content preparation', 'Community and inbox support', 'Performance tracking and reporting'],
  },
]

/** The tool marks, stacked horizontally on white tiles (same as Projects). */
function Marks({ logos }: { logos: string[] }) {
  return (
    <span className="bento__logos" aria-hidden="true">
      {logos.map((src) => (
        <span key={src} className="bento__logo">
          <img src={src} alt="" width={22} height={22} decoding="async" />
        </span>
      ))}
    </span>
  )
}

/* ---------- The page ---------- */

export default function ServicesGrid() {
  return (
    <section className="pgrid sgrid" aria-labelledby="services-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Services</span>
        <h1 className="pgrid__title" id="services-title">
          GoHighLevel systems, automation and operations support.
        </h1>
        <p className="pgrid__lede">
          I build and manage CRM systems, landing pages, pipelines, campaigns and connected automations — plus practical e-commerce and social media support.
        </p>
      </header>

      <div className="home__glass sgrid__glass">
        {/* One dark plate, the headline on the left, the three stages wired
            in order on the right with a signal running them. */}
        <div className="sgrid__method" aria-labelledby="method-title">
          <div className="sgrid__method-copy">
            <span className="sgrid__method-eyebrow">My approach</span>
            <h2 className="sgrid__method-title" id="method-title">
              Map. Build. Improve.
              <br />
              <span>A practical process for turning scattered tasks into a connected system.</span>
            </h2>
            <p className="sgrid__method-sub">
              Every system is tested and documented so it can be understood, maintained and improved.
            </p>
          </div>

          <ol className="sgrid__stages" role="list">
            {STAGES.map((s, i) => {
              const StageIcon = s.Icon
              return (
                <li key={s.index} className="sgrid__stage" style={{ '--i': i } as CSSProperties}>
                  <span className="sgrid__stage-ghost" aria-hidden="true">{s.index}</span>
                  <span className="sgrid__stage-icon" aria-hidden="true">
                    <StageIcon size={22} weight="duotone" />
                  </span>
                  <h3 className="sgrid__stage-label">{s.label}.</h3>
                  <p className="sgrid__stage-body">{s.body}</p>
                  <ul className="sgrid__stage-chips" role="list" aria-label={`${s.label} touches`}>
                    {s.chips.map((c) => (
                      <li key={c} className="sgrid__stage-chip">{c}</li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Five cards, each carrying the marks of what it is built with. */}
        <div className="sgrid__offers">
          <div className="sgrid__offers-head">
            <h2 className="sgrid__offers-title">How I can support your business.</h2>
            <p className="sgrid__offers-sub">CRM and automation first, with dependable operational support alongside them.</p>
          </div>
          <ul className="bento sgrid__services" role="list">
            {SERVICES.map((s) => (
              <li key={s.title} className="bento__card sgrid__service">
                <span className="bento__head">
                  <span className="sgrid__service-top">
                    <Marks logos={s.logos} />
                    <span className="sgrid__service-index" aria-hidden="true">{s.index} / 05</span>
                  </span>
                  <span className="bento__title">{s.title}</span>
                  <span className="bento__desc">{s.description}</span>
                </span>
                <span className="sgrid__chip" aria-hidden="true">{s.chip}</span>
                <ul className="sgrid__bullets" role="list">
                  {s.bullets.map((b) => (
                    <li key={b} className="sgrid__bullet">
                      <CheckCircle size={15} weight="duotone" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* The live workflow. Its caption and the tool chips sit in a header
            above the window, so the canvas gets the whole glass width. */}
        <div className="sgrid__flow">
          <header className="sgrid__flow-head">
            <div className="sgrid__flow-copy">
              <span className="sgrid__flow-eyebrow">Live automation</span>
          <h2 className="sgrid__flow-title">Connected systems that save time.</h2>
              <p className="sgrid__flow-sub">
                See how lead capture, CRM updates, team notifications and automated follow-up work together in one connected workflow.
              </p>
            </div>
            <ul className="sgrid__flow-tools" role="list" aria-label="Tools that power this flow">
              {TOOLS.map(({ Icon: ToolIcon, label }) => (
                <li key={label} className="sgrid__flow-tool">
                  <ToolIcon size={14} weight="duotone" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </header>
          <div className="sgrid__flow-main">
            <Autopilot compact maxScale={1.08} />
          </div>
        </div>
      </div>
    </section>
  )
}
