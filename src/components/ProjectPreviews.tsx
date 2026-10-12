import { ArrowRight, Bell, ChartBar, Database, Desktop, FileText, Funnel, Gear, Lightning, ListChecks, Target, TreeStructure, Users } from '@phosphor-icons/react'

const GHL = '/icons/gohighlevel.png'
const SLACK = '/icons/ai/slack-color.svg'

function WindowDots() {
  return <span className="project-window-dots"><i /><i /><i /></span>
}

/** Decorative, code-native product illustrations; these do not expose fake live data. */
export function WorkflowPreview() {
  const steps = [
    { label: 'New inquiry', detail: 'Form submission', Icon: FileText },
    { label: 'Qualify lead', detail: 'Score & route', Icon: Funnel },
    { label: 'Notify team', detail: 'Team handoff', logo: SLACK, Icon: Bell },
    { label: 'Create in CRM', detail: 'Add contact', Icon: Database },
  ]
  return (
    <div className="project-art project-art--workflow" aria-hidden="true">
      <div className="project-pipeline">
        <div className="project-window-bar"><WindowDots /><span /></div>
        <div className="project-pipeline__body">
          <div className="project-pipeline__rail"><Users /><ListChecks /><Bell /><Gear /></div>
          <div className="project-pipeline__main">
            <div className="project-pipeline__heading"><strong>Pipeline</strong><span>Lead journey</span></div>
            <div className="project-pipeline__columns">
              {['New inquiry', 'Qualified', 'Proposal', 'Won'].map((stage, i) => (
                <div className="project-pipeline__column" key={stage}>
                  <strong>{stage}</strong><i className="project-pipeline__stage-dot" />
                  {[0, 1, 2].map(row => (
                    <div className="project-pipeline__ticket" key={row}>
                      {row === 1 ? <span className="project-pipeline__avatar"><Users size={9} /></span> : null}
                      <span><i /><i /></span>
                      <b style={{ background: ['#d4eee0', '#cee9ed', '#ebe5f3', '#d6edda'][i] }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="project-flow">
        <strong>Automated workflow</strong>
        <div className="project-flow__steps">
          {steps.map((step, i) => (
            <div className="project-flow__step" key={step.label}>
              <span className={`project-flow__icon project-flow__icon--${i}`}>
                {step.logo ? <img src={step.logo} alt="" /> : <step.Icon size={21} />}
              </span>
              <strong>{step.label}</strong><small>{step.detail}</small>
              {i < steps.length - 1 ? <ArrowRight className="project-flow__arrow" size={18} /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function StrategyPreview() {
  return (
    <div className="project-art project-art--strategy" aria-hidden="true">
      <div className="project-paper project-paper--back" />
      <div className="project-paper project-paper--middle" />
      <div className="project-paper project-paper--front">
        <FileText size={20} weight="duotone" />
        <span className="project-paper__eyebrow">Operating plan</span>
        <strong>CRM & automation<br />growth plan</strong>
        <div className="project-paper__rows">
          {[['Strategy & execution', Target], ['Automation roadmap', TreeStructure], ['KPIs & milestones', ChartBar], ['Tools & integrations', Gear]].map(([label, Icon]) => {
            const RowIcon = Icon as typeof Target
            return <span key={label as string}><i><RowIcon size={14} /></i>{label as string}</span>
          })}
        </div>
        <span className="project-paper__footer">7 source documents · Read-only</span>
      </div>
    </div>
  )
}

function SiteContent({ phone = false }: { phone?: boolean }) {
  return (
    <>
      <div className="project-site__nav"><WindowDots />{!phone ? <span>Home &nbsp; Features &nbsp; Contact</span> : null}<i /></div>
      <div className="project-site__hero">
        <div><strong>Turn visitors<br />into customers</strong><span className="project-site__line" /><span className="project-site__line project-site__line--short" /><b>Get started</b></div>
        <div className="project-site__botanical" />
      </div>
      {phone ? <div className="project-site__mobile-lines"><i /><i /><i /><i /></div> : (
        <div className="project-site__features">
          {[[Desktop, 'Responsive'], [Users, 'Clear journeys'], [Lightning, 'Lead capture']].map(([Icon, label]) => {
            const FeatureIcon = Icon as typeof Desktop
            return <span key={label as string}><FeatureIcon size={24} /><strong>{label as string}</strong></span>
          })}
        </div>
      )}
    </>
  )
}

export function WebsitePreview() {
  return (
    <div className="project-art project-art--website" aria-hidden="true">
      <div className="project-site project-site--desktop"><SiteContent /></div>
      <div className="project-site project-site--phone"><SiteContent phone /></div>
    </div>
  )
}

const tools = [
  { name: 'GoHighLevel', src: GHL },
  { name: 'Shopify', src: '/icons/thesvg/shopify.svg' },
  { name: 'n8n', src: '/icons/thesvg/n8n.svg' },
  { name: 'Slack', src: SLACK },
]

export function GrowthPreview() {
  return (
    <div className="project-art project-art--growth" aria-hidden="true">
      <svg className="project-orbit" viewBox="0 0 300 280" fill="none">
        <circle cx="150" cy="140" r="98" />
        <circle cx="150" cy="140" r="68" />
        <path d="M68 60Q150 65 150 140M232 60Q150 65 150 140M68 220Q150 215 150 140M232 220Q150 215 150 140" />
        <g className="project-orbit__dots">{[[150,42],[248,140],[150,238],[52,140],[101,91],[199,189]].map(([cx,cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" />)}</g>
        <circle className="project-orbit__pulse" cx="150" cy="140" r="40" />
      </svg>
      <span className="project-growth-core"><ChartBar size={38} /></span>
      {tools.map((tool, i) => <span key={tool.name} className={`project-tool project-tool--${i}`}><span><img src={tool.src} alt="" width={36} height={36} /></span><small>{tool.name}</small></span>)}
    </div>
  )
}
