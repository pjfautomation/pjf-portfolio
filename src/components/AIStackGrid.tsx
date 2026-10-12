import { aiStack, type StackNode } from '@/data/ai-stack'
import { Funnel, CalendarCheck, ArrowClockwise, Kanban, ArrowsSplit, UserPlus, ArrowsLeftRight, BellRinging, Robot, BookOpen, Article, Storefront, Tag, ShoppingBag, VideoCamera, CalendarDots, FlowArrow, ListChecks, Megaphone, Gear, Database, MagnifyingGlass, Headset, Scissors } from '@phosphor-icons/react'

/**
 * The AI systems as a logo-first grid, for the Projects pop-up.
 *
 * The tree (AIStack.tsx) explains the hierarchy; this view answers the
 * question a hiring reader actually has: what is each thing built ON. Every
 * card leads with the marks of the model, the harness and the services
 * behind it, then the plain-English line, then the stack string from the
 * data file. Names, copy and status come straight from ai-stack.ts; only the
 * logo mapping lives here, and only marks that exist in public/icons.
 */

type Tool = { name: string; src: string }

const TOOL_MARKS: Record<string, string> = {
  GoHighLevel: '/icons/gohighlevel.png',
  n8n: '/icons/thesvg/n8n.svg',
  Make: '/icons/thesvg/make.svg',
  Zapier: '/icons/thesvg/zapier.svg',
  Shopify: '/icons/thesvg/shopify.svg',
  'Google Sheets': '/icons/thesvg/google-sheets.svg',
  Gmail: '/icons/thesvg/gmail.svg',
  Meta: '/icons/thesvg/meta.svg',
  AI: '/icons/thesvg/claude.svg',
  'Claude AI': '/icons/thesvg/claude.svg',
  Codex: '/icons/ai/codex.svg',
  Canva: '/icons/thesvg/canva.svg',
  Notion: '/icons/thesvg/notion.svg',
  Amazon: '/icons/thesvg/amazon.svg',
  Facebook: '/icons/thesvg/facebook.svg',
  Instagram: '/icons/thesvg/instagram.svg',
  TikTok: '/icons/thesvg/tiktok.svg',
}
const CAPABILITY_ICONS = {
  Forms: ListChecks, Workflows: FlowArrow, Calendars: CalendarDots,
  Campaigns: Megaphone, Pipelines: Kanban, Automation: Gear,
  RAG: Database, 'Knowledge Base': BookOpen, 'Content Workflow': Article,
  Gorgias: Headset, SEO: MagnifyingGlass, 'Seller Central': Storefront,
  CapCut: Scissors, 'Google Drive': Database, Slack: BellRinging,
}
const CAPABILITY_COLORS: Record<string, string> = {
  Forms: '#2563EB', Workflows: '#8B5CF6', Calendars: '#0891B2',
  Campaigns: '#F97316', Pipelines: '#D97706', Automation: '#6366F1',
  RAG: '#7C3AED', 'Knowledge Base': '#0284C7', 'Content Workflow': '#DB2777',
  Gorgias: '#F97316', SEO: '#10B981', 'Seller Central': '#FF9900',
  CapCut: '#111827', 'Google Drive': '#4285F4', Slack: '#611F69',
}
const HARNESS: Tool[] = ['GoHighLevel', 'n8n', 'Make', 'Zapier', 'Shopify'].map(name => ({name, src: TOOL_MARKS[name]}))
type Group = { title: string; what: string; systems: StackNode[] }

/** Flatten the tree into groups: a branch with children is a group, a leaf
 *  branch (one with a status) is a group of itself plus any children. */
function groups(root: StackNode): Group[] {
  return (root.children ?? []).map((branch) => ({
    title: branch.name,
    what: branch.what,
    systems: branch.status ? [branch, ...(branch.children ?? [])] : (branch.children ?? []),
  }))
}

function Card({ n }: { n: StackNode }) {
  const icons = [
    [/Lead Capture/, Funnel], [/Appointment/, CalendarCheck], [/Reactivation/, ArrowClockwise],
    [/CRM Pipeline/, Kanban], [/Routing/, ArrowsSplit], [/Onboarding/, UserPlus],
    [/Data Sync/, ArrowsLeftRight], [/Notification/, BellRinging], [/Qualification/, Robot],
    [/Knowledge/, BookOpen], [/AI Content/, Article], [/Shopify Store/, Storefront],
    [/Listing Optimization/, Tag], [/Amazon/, ShoppingBag], [/Repurposing Pipeline/, VideoCamera],
    [/Social Content/, CalendarDots],
  ] as const
  const TitleIcon = icons.find(([pattern]) => pattern.test(n.name))?.[1] ?? Robot
  const tags = (n.stack ?? '').split(' · ')
  const tools = tags.flatMap(name => name === 'Social Platforms' ? ['Facebook', 'Instagram', 'TikTok'] : [name === 'AI' ? 'Claude AI' : name])
  const marks = tools.filter(name => TOOL_MARKS[name] || name in CAPABILITY_ICONS).slice(0, 3)
  return (
    <li className="aig__card">
      <div className="aig__marks">
        {marks.length ? marks.map(name => (
          <span className="aig__mark" key={name} title={name}>
            {TOOL_MARKS[name] ? <img src={TOOL_MARKS[name]} alt={name} width={22} height={22} loading="lazy" /> : (() => {
              const Mark = CAPABILITY_ICONS[name as keyof typeof CAPABILITY_ICONS]
              return <Mark size={22} aria-label={name} color={CAPABILITY_COLORS[name]} />
            })()}
          </span>
        )) : <span className="aig__mark"><TitleIcon size={22} aria-hidden="true" /></span>}
        <span className="aig__status" data-status={n.status}>{n.status}</span>
      </div>
      <h4 className="aig__name"><TitleIcon size={16} aria-hidden="true" />{n.name}</h4>
      <p className="aig__what">{n.what}</p>
      {n.stack && <p className="aig__stack">{n.stack}</p>}
      <ul className="aig__tools" aria-label="Tools and capabilities">{tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    </li>
  )
}

function GroupIcon({ title }: { title: string }) {
  const Icon = title.includes('GoHighLevel') ? Funnel
    : title.includes('Automation') ? FlowArrow
      : title.includes('AI') ? Robot
        : title.includes('E-commerce') ? Storefront
          : Article
  return <Icon size={17} weight="duotone" aria-hidden="true" />
}

export default function AIStackGrid() {
  const grouped = groups(aiStack)
  const systemCount = grouped.reduce((total, group) => total + group.systems.length, 0)
  return (
    <div className="aig">
      <header className="aig__head">
        <div className="aig__head-text">
          <div className="aig__head-kicker">
            <span className="aig__eyebrow">Systems I build</span>
            <span className="aig__head-live"><i aria-hidden="true" /> {systemCount} operating plays</span>
          </div>
          <h3 className="aig__title">{aiStack.what}</h3>
          <p className="aig__intro">CRM, automation, AI and store operations—connected around your business.</p>
          <div className="aig__head-stats" aria-label="System categories">
            <span><b>{grouped.length}</b> operating layers</span>
            <span><b>03</b> client-facing systems</span>
            <span><b>05</b> connected tools</span>
          </div>
        </div>
        <div className="aig__harness" aria-label="Available tools">
          <span className="aig__harness-label">Built with</span>
          {HARNESS.map((t) => (
            <span key={t.name} className="aig__harness-item">
              <img src={t.src} alt="" width={20} height={20} />
              {t.name}
            </span>
          ))}
        </div>
      </header>

      {grouped.map((g, index) => (
        <section key={g.title} className="aig__group" aria-label={g.title}>
          <div className="aig__group-head">
            <div className="aig__group-title-wrap">
              <span className="aig__group-index">0{index + 1}</span>
              <span className="aig__group-icon"><GroupIcon title={g.title} /></span>
              <h3 className="aig__group-title">{g.title}</h3>
            </div>
            <p className="aig__group-what">{g.what}</p>
          </div>
          <ul className="aig__cards" role="list">
            {g.systems.map((n) => (
              <Card key={n.id} n={n} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
