import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WORKFLOWS, TOOL_ICONS } from '@/data/workflows'

const PRESENTATION: Record<string, { useCase: string; benefit: string; steps: [string, string][] }> = {
  'lead-journey': { useCase: 'Lead follow-up', benefit: 'Capture inquiries, organize the CRM and guide each lead toward a useful next step.', steps: [['form', 'Form'], ['crm', 'CRM'], ['email', 'Follow-up']] },
  'appointment-care': { useCase: 'Appointment reminders', benefit: 'Confirm bookings, send timely reminders and stop follow-up when an appointment is cancelled.', steps: [['calendar', 'Booking'], ['email', 'Confirm'], ['clock', 'Remind']] },
  'client-welcome': { useCase: 'Client onboarding', benefit: 'Welcome new clients, collect their intake and prepare a clear team handoff.', steps: [['email', 'Welcome'], ['form', 'Intake'], ['check', 'Handoff']] },
  'ai-receptionist': { useCase: 'Voice appointments', benefit: 'Handle appointment inquiries, coordinate the calendar and send the right confirmation.', steps: [['phone', 'Call'], ['calendar', 'Calendar'], ['email', 'Confirm']] },
  'basic-rag': { useCase: 'Document knowledge', benefit: 'Answer repeat questions from business documents with sources your team can inspect.', steps: [['docs', 'Documents'], ['search', 'Retrieve'], ['chat', 'Cited answer']] },
  'hr-assistant': { useCase: 'Recruitment support', benefit: 'Prepare CV evidence, follow-up emails, approved interviews and job-post drafts for recruiter review.', steps: [['docs', 'CV'], ['search', 'Review'], ['check', 'Next step']] },
}
const ICON_PATHS: Record<string, string> = {
  form: 'M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5',
  crm: 'M4 5h16v14H4z M4 9h16 M9 9v10',
  email: 'M3 5h18v14H3z M3 5l9 7 9-7',
  calendar: 'M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16 M8 15h3 M14 15h3',
  clock: 'M21 12a9 9 0 1 1-9-9 M12 7v5l4 2',
  check: 'M4 12l5 5L20 6',
  phone: 'M7 3l4 4-3 3c2 3 3 4 6 6l3-3 4 4-3 4C9 21 3 15 3 6z',
  docs: 'M6 3h10l4 4v14H6z M16 3v5h4 M9 12h8 M9 16h6',
  search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z M15 15l6 6',
  chat: 'M3 4h18v13H9l-6 4z M7 8h10 M7 12h7',
}

export function JourneyPreview({ workflowId = 'lead-journey' }: { workflowId?: string }) {
  const steps = PRESENTATION[workflowId]?.steps ?? PRESENTATION['lead-journey'].steps
  return <div className="journey-preview" aria-hidden="true">{steps.map(([icon, label], index) => <span key={label} className="workflow-preview-step"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={ICON_PATHS[icon]} /></svg><small>{label}</small>{index < steps.length - 1 && <svg className="workflow-preview-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h17 M15 7l5 5-5 5" /></svg>}</span>)}</div>
}

export default function WorkflowLibrary() {
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('All workflows')
  const platforms = ['All workflows', ...new Set(WORKFLOWS.map((item) => item.platform))]
  const workflows = WORKFLOWS.filter((item) => (platform === 'All workflows' || item.platform === platform) && `${item.title} ${item.summary} ${PRESENTATION[item.id]?.useCase ?? ''} ${item.tools.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))
  return <section className="workflow-page workflow-library" aria-labelledby="workflow-library-title">
    <header className="workflow-page__head"><span className="workflow-eyebrow">Work in Action</span><h1 id="workflow-library-title">See the systems.<br /><em>Follow the work.</em></h1><p>Explore practical automations. Run a sample scenario and see the results in the tools your team uses.</p></header>
    <div className="workflow-library__toolbar">
      <div className="workflow-filters" role="group" aria-label="Filter by platform">{platforms.map((item) => <button type="button" key={item} aria-pressed={platform === item} onClick={() => setPlatform(item)}>{item === 'GoHighLevel' ? 'GHL' : item}</button>)}</div>
      <label className="workflow-search"><span>Search workflows</span><input type="search" placeholder="Search workflow or tool…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    </div>
    <p className="workflow-library__count" aria-live="polite">{workflows.length} interactive {workflows.length === 1 ? 'workflow' : 'workflows'}{platform !== 'All workflows' && ` · ${platform === 'GoHighLevel' ? 'GHL' : platform}`}</p>
    <div className="workflow-library__grid">{workflows.map((item) => <Link className="workflow-library__card" data-platform={item.platform} key={item.id} to={`/work-in-action/${item.id}`}>
      <div className="workflow-library__art"><span className="workflow-badge">{item.platform === 'GoHighLevel' ? 'GHL' : item.platform} · Interactive demo</span>{item.id === 'lead-journey' ? <img className="workflow-thumbnail-image" src="/workflow-thumbnails/lead-journey.png" alt="Lead inquiry flowing through CRM qualification and follow-up to a completed next step" /> : item.id === 'appointment-care' ? <img className="workflow-thumbnail-image" src="/workflow-thumbnails/appointment-care.png" alt="Appointment booking flowing through confirmation, timed reminders and cancellation checks" /> : item.id === 'client-welcome' ? <img className="workflow-thumbnail-image" src="/workflow-thumbnails/client-welcome.png" alt="New client flowing through a welcome email, intake review and team handoff" /> : item.id === 'ai-receptionist' ? <img className="workflow-thumbnail-image" src="/workflow-thumbnails/ai-receptionist.png" alt="AI voice receptionist answering calls, checking availability, booking appointments and sending confirmation" /> : item.id === 'basic-rag' ? <img className="workflow-thumbnail-image" src="/workflow-thumbnails/basic-rag.png" alt="Business documents flowing through document search to a grounded answer with source citations" /> : item.id === 'hr-assistant' ? <img className="workflow-thumbnail-image" src="/workflow-thumbnails/hr-assistant.png" alt="CV evidence flowing through recruiter review, interview coordination and job posting preparation" /> : <JourneyPreview workflowId={item.id} />}</div>
      <div className="workflow-library__copy"><span className="workflow-eyebrow">{PRESENTATION[item.id]?.useCase ?? item.category}</span><h2>{item.title}</h2><p>{PRESENTATION[item.id]?.benefit ?? item.summary}</p>
        <div className="workflow-tools">{item.tools.slice(0, 3).map((tool) => <span key={tool}>{TOOL_ICONS[tool] && <img src={TOOL_ICONS[tool]} alt="" width={16} height={16} />}{tool}</span>)}{item.tools.length > 3 && <span className="workflow-tools__more">+{item.tools.length - 3} {item.tools.length === 4 ? 'tool' : 'tools'}</span>}</div>
        <div className="workflow-library__foot"><span>{item.nodes.length} steps · {item.platform === 'n8n' ? 5 : 3} scenarios</span><b>Explore workflow <span aria-hidden="true">↗</span></b></div>
      </div>
    </Link>)}</div>
    {workflows.length === 0 && <div className="workflow-empty"><h2>No matching workflows</h2><p>Try another search or switch platforms.</p><button type="button" onClick={() => { setQuery(''); setPlatform('All workflows') }}>Clear search & filters</button></div>}
    <p className="workflow-disclaimer">Interactive portfolio demos · fictional sample data · no live integrations.</p>
  </section>
}
