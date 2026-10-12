import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WORKFLOWS, TOOL_ICONS } from '@/data/workflows'

export function JourneyPreview({ appointment = false, welcome = false }: { appointment?: boolean; welcome?: boolean }) {
  return <div className="journey-preview" aria-hidden="true">
    {welcome ? <><span>▤<small>Client</small></span><i>→</i><span>✉<small>Welcome</small></span><i>→</i><span>▦<small>Intake</small></span><i>→</i><span>✓<small>Handoff</small></span></> : appointment ? <><span>▦<small>Booked</small></span><i>→</i><span>✉<small>Confirm</small></span><i>→</i><span>◷<small>Wait</small></span><i>→</i><span>▣<small>Remind</small></span></> : <><span>↗<small>Inquiry</small></span><i>→</i><span>▤<small>CRM</small></span><i>→</i><span>✦<small>Qualify</small></span><i>→</i><span>▣<small>Next step</small></span></>}
  </div>
}

export default function WorkflowLibrary() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All workflows')
  const categories = ['All workflows', ...new Set(WORKFLOWS.map((item) => item.category))]
  const workflows = WORKFLOWS.filter((item) => (category === 'All workflows' || item.category === category) && `${item.title} ${item.summary} ${item.tools.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="workflow-page workflow-library" aria-labelledby="workflow-library-title">
    <header className="workflow-page__head"><span className="workflow-eyebrow">Work in Action</span>
      <h1 id="workflow-library-title">See the systems.<br /><em>Follow the work.</em></h1>
      <p>Explore interactive workflows, run a sample journey, and see what appears in the tools your team uses.</p>
    </header>
    <div className="workflow-library__toolbar">
      <div className="workflow-filters" aria-label="Workflow categories">{categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <label className="workflow-search"><span>Search workflows</span><input type="search" placeholder="Search by workflow or tool…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    </div>
    <p className="workflow-library__count" aria-live="polite">{workflows.length} interactive {workflows.length === 1 ? 'workflow' : 'workflows'}</p>
    <div className="workflow-library__grid">{workflows.map((item) => <Link className="workflow-library__card" key={item.id} to={`/work-in-action/${item.id}`}>
      <div className="workflow-library__art"><span className="workflow-badge">{item.platform} · Interactive demo</span><JourneyPreview appointment={item.id === 'appointment-care'} welcome={item.id === 'client-welcome'} /></div>
      <div className="workflow-library__copy"><span className="workflow-eyebrow">{item.category}</span><h2>{item.title}</h2><p>{item.summary}</p>
        <div className="workflow-tools">{item.tools.slice(0, 4).map((tool) => <span key={tool}>{TOOL_ICONS[tool] && <img src={TOOL_ICONS[tool]} alt="" width={18} height={18} />}{tool}</span>)}</div>
        <div className="workflow-library__foot"><span>{item.nodes.length} steps · 3 sample scenarios</span><b>Explore workflow ↗</b></div>
      </div>
    </Link>)}</div>
    {workflows.length === 0 && <div className="workflow-empty"><h2>No matching workflows</h2><p>Try a tool such as GoHighLevel or Google Sheets.</p><button type="button" onClick={() => { setQuery(''); setCategory('All workflows') }}>Clear search</button></div>}
    <aside className="workflow-library__note"><span>◈</span><div><h2>A growing library of practical systems</h2><p>Explore the Lead Journey, Appointment Care and Client Welcome systems. Each demo explains the decisions, integrations and outputs behind the workflow.</p></div></aside>
    <p className="workflow-disclaimer">Portfolio demonstrations use fictional sample data. No real API calls, credentials or messages are involved.</p>
  </section>
}
