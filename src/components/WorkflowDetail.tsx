import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SAMPLE_LEAD, TOOL_ICONS, WORKFLOWS, type WorkflowDefinition, type WorkflowNode } from '@/data/workflows'
import { APPOINTMENT, APPOINTMENT_OUTPUTS, APPOINTMENT_SCENARIOS, appointmentPlan, type AppointmentScenario } from '@/data/appointment-care'
import AppointmentOutputs from './AppointmentOutputs'
import WelcomeOutputs from './WelcomeOutputs'
import ReceptionOutputs from './ReceptionOutputs'
import RagOutputs from './RagOutputs'
import HrOutputs from './HrOutputs'
import { HR_FIXTURE, HR_OUTPUTS, HR_SCENARIOS, hrPlan, type HrScenario } from '@/data/hr-assistant'
import { RAG_FIXTURE, RAG_OUTPUTS, RAG_SCENARIOS, ragPlan, type RagScenario } from '@/data/basic-rag'
import ReceptionIcon from './ReceptionIcon'
import { CLIENT, WELCOME_SCENARIOS, WELCOME_OUTPUTS, welcomePlan, type WelcomeScenario } from '@/data/client-welcome'
import { RECEPTION_LEAD, RECEPTION_OUTPUTS, RECEPTION_RESULTS, RECEPTION_SCENARIOS, receptionPlan, type ReceptionScenario } from '@/data/n8n-receptionist'

type LeadScenario = 'qualified' | 'nurture' | 'email-only'
type Scenario = LeadScenario | AppointmentScenario | WelcomeScenario | ReceptionScenario | RagScenario | HrScenario
type Status = 'Waiting' | 'Running' | 'Completed' | 'Skipped' | 'Interrupted'
type Point = { x: number; y: number }
type Viewport = Point & { scale: number }
const SCENARIOS: { id: LeadScenario; label: string; description: string }[] = [
  { id: 'qualified', label: 'Qualified lead', description: 'Ready for a discovery call → booking invitation' },
  { id: 'nurture', label: 'Needs more context', description: 'Still exploring → helpful follow-up questions' },
  { id: 'email-only', label: 'Email only', description: 'Ready for discovery, no WhatsApp → email invitation' },
]
const OUTPUTS = [
  { id: 'form', label: 'Form' }, { id: 'crm', label: 'CRM' }, { id: 'sheet', label: 'Sheets' },
  { id: 'telegram', label: 'Telegram' }, { id: 'whatsapp', label: 'WhatsApp' }, { id: 'gmail', label: 'Gmail' },
]

function ToolMark({ tool }: { tool: string }) {
  return TOOL_ICONS[tool] ? <img src={TOOL_ICONS[tool]} alt="" width={22} height={22} /> : <span aria-hidden="true">{tool === 'WhatsApp' ? '◉' : ['Email', 'SMS'].includes(tool) ? '✉' : '✦'}</span>
}

function ActionMark({ node }: { node: WorkflowNode }) {
  const paths: Record<string, string> = {
    form: 'M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5',
    crm: 'M4 5h16v14H4z M4 9h16 M9 9v10',
    qualify: 'M4 6h16 M4 12h16 M4 18h16 M9 3v6 M15 9v6 M9 15v6',
    route: 'M12 3v6 M6 21v-5h12v5 M12 9v7',
    channel: 'M12 3v6 M6 21v-5h12v5 M12 9v7',
    booking: 'M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16 M9 15l2 2 4-4',
    nurture: 'M12 3a9 9 0 1 0 9 9 M12 7v5l4 2',
    whatsapp: 'M5 4h14v13H9l-4 4z M8 8h8 M8 12h5',
    gmail: 'M3 5h18v14H3z M3 5l9 7 9-7',
    calendar: 'M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16',
    email: 'M3 5h18v14H3z M3 5l9 7 9-7',
    wait: 'M12 3a9 9 0 1 0 9 9 M12 7v5l4 2',
    condition: 'M12 3v6 M6 21v-5h12v5 M12 9v7',
    sms: 'M5 4h14v13H9l-4 4z M8 8h8 M8 12h5',
    stop: 'M5 5h14v14H5z M9 9l6 6 M15 9l-6 6',
  }
  const kind = node.nodeType ?? (node.icon === 'stop' ? 'stop' : ['condition', 'wait'].includes(node.icon ?? '') || ['route', 'channel'].includes(node.id) ? 'condition' : ['sheet', 'telegram'].includes(node.id) ? 'webhook' : 'action')
  return <span className="hl-action-icon" data-kind={kind} data-node-type={node.nodeType} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[node.icon ?? node.id] ?? 'M8 7H6a5 5 0 0 0 0 10h3 M16 7h2a5 5 0 0 1 0 10h-3 M8 12h8'} /></svg></span>
}

function WorkflowCanvas({ workflow, statuses, selected, onSelect, playing, activeNodeId, transfer, speed, plan, contactName, controls, children }: {
  workflow: WorkflowDefinition; statuses: Record<string, Status>; selected: string; onSelect: (id: string) => void; playing: boolean; activeNodeId?: string; transfer: { from: string; to: string } | null; speed: number; plan: string[]; contactName: string; controls: ReactNode; children: ReactNode
}) {
  const isN8n = workflow.platform === 'n8n'
  const NODE_WIDTH = isN8n ? 96 : 220
  const NODE_HEIGHT = isN8n ? 96 : 66
  const WORLD = { width: workflow.platform === 'n8n' ? 2060 : 900, height: workflow.canvasHeight ?? 1260 }
  const stage = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<Viewport>({ x: 16, y: 16, scale: .65 })
  const [positions, setPositions] = useState<Record<string, Point>>({})
  const [canvasTab, setCanvasTab] = useState<'builder' | 'logs'>('builder')
  const drag = useRef<{ kind: 'pan' | 'node'; id?: string; start: Point; origin: Point; moved: boolean } | null>(null)
  const moved = useRef(false)
  const position = (node: WorkflowNode) => positions[node.id] ?? node
  const fit = () => {
    const box = stage.current?.getBoundingClientRect()
    if (!box) return
    const scale = Math.min((box.width - 24) / WORLD.width, (box.height - 24) / WORLD.height, 1)
    setView({ scale, x: (box.width - WORLD.width * scale) / 2, y: (box.height - WORLD.height * scale) / 2 })
  }
  useEffect(() => {
    const element = stage.current
    if (!element) return
    const observer = new ResizeObserver(() => {
      const box = element.getBoundingClientRect()
      const scale = box.width < 600 ? .75 : .9
      setView({ scale, x: isN8n ? 35 : box.width / 2 - (340 + NODE_WIDTH / 2) * scale, y: 22 })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [WORLD.height, WORLD.width, isN8n, NODE_WIDTH])
  useEffect(() => {
    if (!playing || drag.current) return
    const box = stage.current?.getBoundingClientRect()
    const activeNode = workflow.nodes.find((node) => node.id === activeNodeId)
    if (!box || !activeNode) return
    const point = positions[activeNode.id] ?? activeNode
    setView((current) => {
      const left = current.x + point.x * current.scale
      const top = current.y + point.y * current.scale
      const right = left + NODE_WIDTH * current.scale
      const bottom = top + NODE_HEIGHT * current.scale
      const safeBottom = Math.max(NODE_HEIGHT * current.scale + 24, box.height - 176)
      const dx = left < 12 ? 12 - left : right > box.width - 12 ? box.width - 12 - right : 0
      const dy = top < 12 ? 12 - top : bottom > safeBottom ? safeBottom - bottom : 0
      if (!dx && !dy) return current
      return { ...current, x: current.x + dx, y: current.y + dy }
    })
  }, [playing, activeNodeId, positions, workflow.nodes, NODE_WIDTH, NODE_HEIGHT])
  const zoom = (factor: number) => {
    const box = stage.current?.getBoundingClientRect()
    if (!box) return
    setView((current) => {
      const scale = Math.max(.18, Math.min(2, current.scale * factor))
      const ratio = scale / current.scale
      return { scale, x: box.width / 2 - (box.width / 2 - current.x) * ratio, y: box.height / 2 - (box.height / 2 - current.y) * ratio }
    })
  }
  useEffect(() => {
    const element = stage.current
    if (!element) return
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const box = element.getBoundingClientRect()
      const factor = event.deltaY < 0 ? 1.1 : .9
      setView((current) => {
        const scale = Math.max(.18, Math.min(2, current.scale * factor))
        const ratio = scale / current.scale
        return { scale, x: box.width / 2 - (box.width / 2 - current.x) * ratio, y: box.height / 2 - (box.height / 2 - current.y) * ratio }
      })
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => element.removeEventListener('wheel', wheel)
  }, [])
  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-node]')
    const node = workflow.nodes.find((item) => item.id === button?.dataset.node)
    drag.current = { kind: node ? 'node' : 'pan', id: node?.id, start: { x: event.clientX, y: event.clientY }, origin: node ? position(node) : view, moved: false }
    moved.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current) return
    const dx = event.clientX - current.start.x
    const dy = event.clientY - current.start.y
    if (Math.abs(dx) + Math.abs(dy) < 4) return
    current.moved = true
    moved.current = true
    if (current.kind === 'node' && current.id) {
      const id = current.id
      setPositions((previous) => ({ ...previous, [id]: { x: Math.max(0, Math.min(WORLD.width - NODE_WIDTH, current.origin.x + dx / view.scale)), y: Math.max(0, Math.min(WORLD.height - NODE_HEIGHT, current.origin.y + dy / view.scale)) } }))
    } else setView((previous) => ({ ...previous, x: current.origin.x + dx, y: current.origin.y + dy }))
  }
  const platformClass = workflow.platform === 'n8n' ? 'n8n' : 'highlevel'
  return <div className={`journey-canvas journey-canvas--${platformClass}`} data-platform={workflow.platform} data-playing={playing} style={{ '--hl-execute-duration': `${1600 / speed}ms`, '--hl-transfer-duration': `${600 / speed}ms` } as CSSProperties}>
    {controls}
    <div className="hl-builder-header"><div><ToolMark tool={workflow.platform} /><b>{workflow.title}</b><span>{workflow.platform} · illustrative builder</span></div><div className="hl-builder-tabs" role="group" aria-label="Workflow view"><button type="button" aria-pressed={canvasTab === 'builder'} onClick={() => setCanvasTab('builder')}>Builder</button><button type="button" aria-pressed={canvasTab === 'logs'} onClick={() => setCanvasTab('logs')}>Execution logs</button></div><span className="hl-demo-contact">Sample run · {contactName}</span></div>
    <div className="journey-canvas__toolbar"><div><span className="workflow-badge">Standard builder · demo</span><span className="journey-canvas__hint">Select an action to inspect</span></div><span className="hl-workflow-status">Illustrative test · no live connections</span></div>
    <div ref={stage} className="journey-canvas__stage" role="region" aria-label={`${workflow.platform} workflow canvas`} tabIndex={0} data-lenis-prevent
      onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={(event) => {
        if (drag.current?.kind === 'node' && !drag.current.moved && drag.current.id) onSelect(drag.current.id)
        drag.current = null
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
      }} onPointerCancel={() => { drag.current = null }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        const directions: Record<string, Point> = { ArrowLeft: { x: 40, y: 0 }, ArrowRight: { x: -40, y: 0 }, ArrowUp: { x: 0, y: 40 }, ArrowDown: { x: 0, y: -40 } }
        if (directions[event.key]) { event.preventDefault(); const delta = directions[event.key]; setView((current) => ({ ...current, x: current.x + delta.x, y: current.y + delta.y })) }
        if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(1.25) }
        if (event.key === '-') { event.preventDefault(); zoom(.8) }
        if (event.key === '0') fit()
      }}>
      <div className="journey-canvas__world" hidden={canvasTab !== 'builder'} style={{ width: WORLD.width, height: WORLD.height, transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}>
        <svg className="journey-canvas__edges" width={WORLD.width} height={WORLD.height} aria-hidden="true">
          <defs><marker id="journey-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" stroke="none" /></marker></defs>
          {workflow.edges.map((edge) => {
            const from = position(workflow.nodes.find((node) => node.id === edge.from)!)
            const to = position(workflow.nodes.find((node) => node.id === edge.to)!)
            const x = from.x + NODE_WIDTH / 2; const y = from.y + NODE_HEIGHT
            const tx = to.x + NODE_WIDTH / 2; const ty = to.y
            const mid = (y + ty) / 2
            const bypass = edge.label?.includes('Go To') || ty - y > 300
            const d = isN8n ? `M ${from.x + NODE_WIDTH} ${from.y + NODE_HEIGHT / 2} C ${from.x + NODE_WIDTH + 90} ${from.y + NODE_HEIGHT / 2}, ${to.x - 90} ${to.y + NODE_HEIGHT / 2}, ${to.x} ${to.y + NODE_HEIGHT / 2}` : bypass ? `M ${x} ${y} V ${y + 18} Q ${x} ${y + 28} ${x + 10} ${y + 28} H 750 Q 760 ${y + 28} 760 ${y + 38} V ${ty - 38} Q 760 ${ty - 28} 750 ${ty - 28} H ${tx + 10} Q ${tx} ${ty - 28} ${tx} ${ty - 18} V ${ty}` : x === tx ? `M ${x} ${y} V ${ty}` : `M ${x} ${y} V ${mid - 10} Q ${x} ${mid} ${x + (tx > x ? 10 : -10)} ${mid} H ${tx + (tx > x ? -10 : 10)} Q ${tx} ${mid} ${tx} ${mid + 10} V ${ty}`
            const transferring = transfer?.from === edge.from && transfer.to === edge.to
            const active = plan.indexOf(edge.to) === plan.indexOf(edge.from) + 1 && ['Completed', 'Interrupted'].includes(statuses[edge.from]) && ['Running', 'Completed'].includes(statuses[edge.to])
            return <g key={`${edge.from}-${edge.to}`} data-active={active} data-transferring={transferring}><title>{edge.label ?? 'Next step'}</title><path d={d} />{transferring && <path className="hl-transfer" pathLength={100} d={d} />}{edge.label && <><rect className="hl-branch-label" x={tx - 65} y={ty - 35} width={130} height={20} rx={5} /><text className="hl-branch-text" x={tx} y={ty - 22} textAnchor="middle">{edge.label}</text></>}</g>
          })}
        </svg>
        {workflow.nodes.map((node) => <button type="button" data-node={node.id} data-node-type={node.nodeType} data-status={statuses[node.id]} data-system-event={workflow.id === 'appointment-care' && node.id === 'stop'} data-executing={activeNodeId === node.id && statuses[node.id] === 'Running'} aria-pressed={selected === node.id}
          className="journey-node" key={node.id} style={{ left: position(node).x, top: position(node).y }}
          onClick={() => { if (!moved.current) onSelect(node.id) }} onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') { moved.current = false; onSelect(node.id) }
            if (event.shiftKey && event.key.startsWith('Arrow')) {
              event.preventDefault(); const step = 16; const point = position(node)
              setPositions((previous) => ({ ...previous, [node.id]: { x: Math.max(0, Math.min(WORLD.width - NODE_WIDTH, point.x + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0))), y: Math.max(0, Math.min(WORLD.height - NODE_HEIGHT, point.y + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0))) } }))
            }
          }}>
          {isN8n ? <><span className="n8n-port n8n-port--in" /><span className="n8n-port n8n-port--out" /><ReceptionIcon tool={node.tool} /></> : <ActionMark node={node} />}<span className="hl-node-copy"><b>{node.title}</b><span>{node.subtitle}</span></span><small className="hl-node-status">{statuses[node.id] === 'Running' && !playing ? 'Paused' : statuses[node.id] === 'Completed' ? '✓' : statuses[node.id] === 'Running' ? '…' : statuses[node.id] === 'Interrupted' ? 'Stopped' : statuses[node.id] === 'Skipped' ? 'Skipped' : '···'}</small>
          {activeNodeId === node.id && statuses[node.id] === 'Running' && <svg className="hl-execution-ring" viewBox={`0 0 ${NODE_WIDTH + 6} ${NODE_HEIGHT + 6}`} aria-hidden="true"><rect x={3} y={3} width={NODE_WIDTH} height={NODE_HEIGHT} rx={8} pathLength={100} /></svg>}
        </button>)}
        <span className="hl-end" style={{ left: 340 + NODE_WIDTH / 2 - 18, top: WORLD.height - 26 }}>END</span>
      </div>
      {canvasTab === 'logs' && <div className="hl-canvas-log" onPointerDown={(event) => event.stopPropagation()}><header><h2>Execution logs</h2><span>{contactName} · sample contact</span></header><ol>{workflow.nodes.map((node) => <li key={node.id}><button type="button" onClick={() => onSelect(node.id)}><ActionMark node={node} /><b>{node.title}</b><span>{statuses[node.id] === 'Running' && !playing ? 'Paused' : statuses[node.id]}</span></button></li>)}</ol></div>}
      <div className="hl-minimap" hidden={canvasTab !== 'builder'} aria-label="Workflow overview" onPointerDown={(event) => event.stopPropagation()}><svg viewBox={`0 0 ${WORLD.width} ${WORLD.height}`} aria-hidden="true">{workflow.nodes.map((node) => <rect key={node.id} x={position(node).x} y={position(node).y} width={NODE_WIDTH} height={NODE_HEIGHT} data-status={statuses[node.id]} />)}<rect className="hl-minimap__viewport" x={-view.x / view.scale} y={-view.y / view.scale} width={(stage.current?.clientWidth ?? 600) / view.scale} height={(stage.current?.clientHeight ?? 600) / view.scale} /></svg><button type="button" onClick={fit}>Fit overview</button></div>
      <div className="journey-canvas__controls hl-stage-controls" hidden={canvasTab !== 'builder'} onPointerDown={(event) => event.stopPropagation()}>
        <button type="button" onClick={fit}>Fit view</button><button type="button" aria-label="Zoom out" onClick={() => zoom(.8)}>−</button><output aria-label="Canvas zoom">{Math.round(view.scale * 100)}%</output><button type="button" aria-label="Zoom in" onClick={() => zoom(1.25)}>+</button><button type="button" onClick={() => { setPositions({}); fit() }}>Reset layout</button>
      </div>
    </div>
    {children}
    <details className="journey-canvas__help"><summary>Canvas help</summary><p>Drag to pan or arrange nodes. Ctrl + scroll to zoom. Keyboard: arrows to pan, + / − to zoom, 0 to fit. Shift + arrows move a focused node.</p></details>
  </div>
}

function PreviewHeader({ tool, title, status }: { tool: string; title: string; status: Status }) {
  return <header className="journey-output__head"><div><ToolMark tool={tool} /><h3>{title}</h3></div><span data-status={status}>{status === 'Completed' ? 'Sample output' : status}</span></header>
}

function AppOutputs({ statuses, scenario, visibleId }: { statuses: Record<string, Status>; scenario: LeadScenario; visibleId: string }) {
  const qualified = scenario !== 'nurture'
  const whatsapp = scenario !== 'email-only'
  const done = (id: string) => statuses[id] === 'Completed'
  const next = qualified ? 'Discovery invited' : 'Needs more information'
  return <div className="journey-outputs">
      {visibleId === 'form' && done('form') && <article className="journey-output"><PreviewHeader tool="Website form" title="Website contact form" status={statuses.form} />
        <div className="journey-form"><span className="journey-app-label">riveracoaching.example · sample form</span><h4>Let’s build your system.</h4>
          <dl>{[['Name', SAMPLE_LEAD.name], ['Email', SAMPLE_LEAD.email], ['WhatsApp', whatsapp ? SAMPLE_LEAD.phone : 'Not provided'], ['Business', SAMPLE_LEAD.business], ['Ready for discovery?', qualified ? 'Yes' : 'Not yet'], ['How can we help?', SAMPLE_LEAD.inquiry]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <span className="journey-form__submitted">{done('form') ? '✓ Sample form submitted' : 'Ready for sample submission'}</span>
        </div><p className="journey-output__caption">A visitor asks for help with their CRM and follow-up.</p>
      </article>}
      {visibleId === 'crm' && done('crm') && <article className="journey-output"><PreviewHeader tool="GoHighLevel" title="GoHighLevel opportunity" status={statuses.crm} />
        <div className="journey-crm"><span className="journey-app-label">Client journey · sample pipeline</span><div className="journey-crm__stages"><span className={done('crm') && !done('booking') && !done('nurture') ? 'is-active' : ''}>New inquiry</span><span className={done('booking') || done('nurture') ? 'is-active' : ''}>{next}</span><span>Call booked</span></div>
          {done('crm') ? <div className="journey-crm__opportunity"><span className="journey-avatar">AR</span><div><b>{SAMPLE_LEAD.business}</b><p>{SAMPLE_LEAD.name}</p><span>CRM & automation</span><p>Stage: {done('booking') || done('nurture') ? next : 'New inquiry'}</p></div></div> : <p className="journey-waiting">The contact and opportunity appear after CRM capture.</p>}
          {(done('booking') || done('nurture')) && <div className="journey-task">✓ Next step: {qualified ? 'Discovery invitation' : 'Request goals and more context'}</div>}
        </div><p className="journey-output__caption">Contact fields, the opportunity and pipeline stage stay connected.</p>
      </article>}
      {visibleId === 'sheet' && done('sheet') && <article className="journey-output journey-output--sheet"><PreviewHeader tool="Google Sheets" title="Lead register" status={statuses.sheet} />
        <div className="journey-sheet" tabIndex={0} aria-label="Sample Google Sheets lead register" data-lenis-prevent><table><caption>Google Sheets · fictional sample data</caption><thead><tr>{['Name', 'Business', 'Email', 'Inquiry', 'Status', 'Source'].map((label) => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>
          {done('sheet') && <tr className="journey-sheet__new"><td>{SAMPLE_LEAD.name}</td><td>{SAMPLE_LEAD.business}</td><td>{SAMPLE_LEAD.email}</td><td>CRM, booking & follow-up</td><td>{done('booking') || done('nurture') ? next : 'New inquiry'}</td><td>Website</td></tr>}
        </tbody></table></div><p className="journey-output__caption">{done('sheet') ? 'The new inquiry is visible in the shared register.' : 'The new row appears when Record inquiry completes.'}</p>
      </article>}
      {visibleId === 'telegram' && done('telegram') && <article className="journey-output"><PreviewHeader tool="Telegram" title="Team lead alert" status={statuses.telegram} />
        <div className="journey-chat journey-chat--telegram"><div className="journey-chat__app">➤ Lead alerts <small>Demo team channel</small></div>{done('telegram') ? <div className="journey-message"><b>New inquiry · {SAMPLE_LEAD.business}</b><p>{SAMPLE_LEAD.name} · {SAMPLE_LEAD.email}</p><p>Needs CRM setup, a booking page and automated follow-up.</p><p><b>Next action:</b> {qualified ? 'Review the inquiry before the discovery call.' : 'Ask about goals, current tools and timing.'}</p><small>Simulated delivery · just now ✓</small></div> : <p className="journey-waiting">The team alert appears after qualification and routing.</p>}</div>
        <p className="journey-output__caption">The team receives a concise summary and a clear next action.</p>
      </article>}
      {visibleId === 'whatsapp' && done('whatsapp') && <article className="journey-output"><PreviewHeader tool="WhatsApp" title="Personal WhatsApp reply" status={statuses.whatsapp} />
        <div className="journey-chat journey-chat--whatsapp"><div className="journey-chat__app">◉ {SAMPLE_LEAD.name}<small>{whatsapp ? SAMPLE_LEAD.phone : 'No WhatsApp number provided'}</small></div>
          {done('whatsapp') ? <div className="journey-message"><p>Hi Alex! Thanks for reaching out about your coaching business. {qualified ? 'Let’s map out your CRM, booking page and follow-up. Pick a time for a discovery call:' : 'Could you share your current tools, priorities and timeline? I’ll help identify the right next step.'}</p>{qualified && <span className="journey-demo-link">example.com/book/discovery</span>}<small>Sample reply · simulated delivery ✓✓</small></div> : <p className="journey-waiting">{statuses.whatsapp === 'Skipped' ? 'Skipped: no WhatsApp number. The email path still runs.' : 'A personal reply appears when this step completes.'}</p>}
        </div><p className="journey-output__caption">A reply on the preferred channel, when a number and consent are available.</p>
      </article>}
      {visibleId === 'gmail' && done('gmail') && <article className="journey-output journey-output--gmail"><PreviewHeader tool="Gmail" title="Personalised follow-up email" status={statuses.gmail} />
        <div className="journey-email"><span className="journey-app-label">Gmail · sample message</span><h4>Your CRM & automation inquiry</h4><div className="journey-email__address"><b>Philip · Systems support</b><span>To: {SAMPLE_LEAD.email}</span></div>
          {done('gmail') ? <div className="journey-email__body"><p>Hi Alex,</p><p>Thanks for sharing what you need for Rivera Coaching. I can help connect your CRM, booking page and follow-up so your team has a clear view of every inquiry.</p><p>{qualified ? 'A discovery call is the next step. We’ll review your current tools, pipeline stages and follow-up process.' : 'Before recommending a system, I’d like to understand your current tools, main bottleneck and preferred timeline.'}</p>{qualified && <p><b>Book your discovery call</b><br /><span className="journey-demo-link">https://example.com/book/discovery</span></p>}<p>Best,<br />Philip</p><small>Prepared and delivered in the local simulation.</small></div> : <p className="journey-waiting">The personalised email appears after the email node completes.</p>}
        </div><p className="journey-output__caption">Every lead receives the next step appropriate to their journey.</p>
      </article>}
  </div>
}

export default function WorkflowDetail() {
  const { workflowId } = useParams()
  return <WorkflowReplay key={workflowId} workflowId={workflowId} />
}

function WorkflowReplay({ workflowId }: { workflowId?: string }) {
  const workflow = WORKFLOWS.find((item) => item.id === workflowId)
  const isAppointment = workflowId === 'appointment-care'
  const isWelcome = workflowId === 'client-welcome'
  const isReception = workflowId === 'ai-receptionist'
  const isRag = workflowId === 'basic-rag'
  const isHr = workflowId === 'hr-assistant'
  const isN8nDemo = isReception || isRag || isHr
  const scenarios = isHr ? HR_SCENARIOS : isRag ? RAG_SCENARIOS : isReception ? RECEPTION_SCENARIOS : isWelcome ? WELCOME_SCENARIOS : isAppointment ? APPOINTMENT_SCENARIOS : SCENARIOS
  const outputDefinitions = isHr ? HR_OUTPUTS : isRag ? RAG_OUTPUTS : isReception ? RECEPTION_OUTPUTS : isWelcome ? WELCOME_OUTPUTS : isAppointment ? APPOINTMENT_OUTPUTS : OUTPUTS
  const [scenario, setScenario] = useState<Scenario>(isHr ? 'review-ready' : isRag ? 'answer' : isReception ? 'availability' : isWelcome ? 'submitted' : isAppointment ? 'upcoming' : 'qualified')
  const [selection, setSelection] = useState<{ id: string; cursor: number } | null>(null)
  const [outputChoice, setOutputChoice] = useState<{ id: string; cursor: number } | null>(null)
  const [cursor, setCursor] = useState(-1)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [phase, setPhase] = useState<'action' | 'connector'>('action')
  const remaining = useRef<number | null>(null)
  const replayVersion = useRef(0)
  const plan = isHr ? hrPlan(scenario as HrScenario) : isRag ? ragPlan(scenario as RagScenario) : isReception ? receptionPlan(scenario as ReceptionScenario) : isWelcome ? welcomePlan(scenario as WelcomeScenario) : isAppointment ? appointmentPlan(scenario as AppointmentScenario) : ['form', 'crm', 'sheet', 'qualify', 'route', scenario === 'nurture' ? 'nurture' : 'booking', 'telegram', 'channel', ...(scenario === 'email-only' ? [] : ['whatsapp']), 'gmail']
  useEffect(() => {
    if (!running) return
    const version = replayVersion.current
    const duration = (remaining.current ?? (phase === 'action' ? 1600 : 600)) / speed
    const start = performance.now()
    let fired = false
    const timer = window.setTimeout(() => {
      fired = true
      remaining.current = null
      if (phase === 'action') {
        if (cursor >= plan.length - 1) { setCursor(plan.length); setRunning(false) }
        else setPhase('connector')
      } else { setCursor((previous) => previous + 1); setPhase('action') }
    }, duration)
    return () => {
      window.clearTimeout(timer)
      if (!fired && replayVersion.current === version) remaining.current = Math.max(0, duration - (performance.now() - start)) * speed
    }
  }, [running, cursor, speed, phase, plan.length])
  if (!workflow) return <section className="workflow-page"><h1>Workflow not found</h1><Link to="/work-in-action">Back to Work in Action</Link></section>
  const started = cursor >= 0
  const finished = cursor === plan.length
  const statuses: Record<string, Status> = Object.fromEntries(workflow.nodes.map((node) => {
    const index = plan.indexOf(node.id)
    return [node.id, index < 0 ? (started ? 'Skipped' : 'Waiting') : index < cursor || (index === cursor && phase === 'connector') ? 'Completed' : index === cursor ? 'Running' : 'Waiting']
  }))
  if (isAppointment && scenario === 'cancelled' && statuses.wait24 === 'Completed') statuses.wait24 = 'Interrupted'
  const selected = selection?.cursor === cursor ? selection.id : plan[Math.min(Math.max(cursor, 0), plan.length - 1)]
  const selectNode = (id: string) => {
    setSelection({ id, cursor })
    const outputId = isWelcome && ['wait', 'received', 'review-wait', 'review'].includes(id) ? 'won' : isAppointment && ['wait24', 'wait1', 'status24', 'status1'].includes(id) ? 'booked' : ['booking', 'nurture'].includes(id) ? 'crm' : id
    if (statuses[outputId] === 'Completed') setOutputChoice({ id: outputId, cursor })
  }
  const availableOutputs = outputDefinitions.filter((item) => statuses[item.id] === 'Completed')
  const lastCompletedStep = plan[cursor - (phase === 'connector' ? 0 : 1)]
  const latestOutput = isWelcome && ['wait', 'received', 'review-wait', 'review'].includes(lastCompletedStep) ? 'won' : isAppointment && ['wait24', 'wait1', 'status24', 'status1'].includes(lastCompletedStep) ? 'booked' : ['booking', 'nurture'].includes(lastCompletedStep) ? 'crm' : lastCompletedStep
  const autoOutput = availableOutputs.some((item) => item.id === latestOutput) ? latestOutput : availableOutputs.at(-1)?.id
  const visibleOutput = outputChoice?.cursor === cursor && statuses[outputChoice.id] === 'Completed' ? outputChoice.id : autoOutput
  const completed = Object.values(statuses).filter((status) => status === 'Completed').length
  const interrupted = Object.values(statuses).filter((status) => status === 'Interrupted').length
  const node = workflow.nodes.find((item) => item.id === selected) ?? workflow.nodes[0]
  const output: Record<string, unknown> = { ...node.output }
  const input: Record<string, unknown> = { ...node.input }
  if (scenario === 'nurture' && ['qualify', 'route'].includes(node.id)) Object.assign(output, { fit: 'Needs context', ready_for_discovery: false, path: 'Nurture', next_step: 'Ask about goals and timing' })
  if (scenario === 'nurture' && node.id === 'route') Object.assign(input, { ready_for_discovery: false })
  if (scenario === 'nurture' && node.id === 'qualify') input.ready_for_discovery = false
  if (scenario === 'nurture' && node.id === 'form') output.ready_for_discovery = false
  if (scenario === 'nurture' && node.id === 'route') output.follow_up_required = true
  if (scenario === 'nurture' && node.id === 'telegram') output.message = 'New inquiry: Alex Rivera · CRM & automation. Ask about goals and timing.'
  if (scenario === 'nurture' && node.id === 'whatsapp') output.message = 'Hi Alex! Could you share your current tools, priorities and timeline?'
  if (node.id === 'gmail') output.next_step = scenario === 'nurture' ? 'Reply with goals, tools and timeline' : 'Book a discovery call at https://example.com/book/discovery'
  if (scenario === 'email-only' && node.id === 'form') output.phone = null
  if (scenario === 'email-only' && node.id === 'channel') { input.phone = null; output.whatsapp_available = false; output.path = 'Email only' }
  if (isAppointment) {
    if (node.id === 'booked') { output.booking_notice_hours = scenario === 'last-minute' ? 2 : 72; if (scenario === 'cancelled' && statuses.wait24 === 'Interrupted') output.status = 'Cancelled' }
    if (node.id === 'wait24' && scenario === 'last-minute') Object.assign(output, { resume_at: 'Already passed', next_step: 'wait1', elapsed: '24-hour reminder bypassed' })
    if (node.id === 'wait24' && scenario === 'cancelled') Object.assign(output, { cancelled_during_wait: true, elapsed: 'Interrupted by appointment cancellation' })
    if (['status24', 'status1'].includes(node.id)) { input.appointment_status = scenario === 'cancelled' ? 'Cancelled' : 'Confirmed'; if (scenario === 'cancelled') Object.assign(output, { appointment_status: 'Cancelled', path: 'Stop reminder workflow' }) }
  }
  if (isWelcome) {
    if (['wait', 'received'].includes(node.id)) Object.assign(output, { intake_received: scenario !== 'overdue', path: scenario === 'overdue' ? 'Send reminder' : 'Review intake' })
    if (node.id === 'review') Object.assign(output, { reviewed: true, approved: scenario !== 'clarification' })
    if (node.id === 'intake' && scenario === 'clarification') output.goal = 'Improve the business — scope to clarify'
  }
  if (isReception) {
    const toolByScenario: Record<ReceptionScenario, string> = { availability: 'GetSlots', book: 'BookSlots', reschedule: 'UpdateSlots', cancel: 'cancelSlots', 'call-results': 'call_results' }
    const tool = toolByScenario[scenario as ReceptionScenario]
    if (node.id === 'voice-webhook') { input.tool = tool; output.tool = tool }
    if (node.id === 'route-tool') { input.requested_tool = tool; output.branch = scenario }
    const result = RECEPTION_RESULTS[scenario as ReceptionScenario]
    const requestedTime = scenario === 'availability' ? '2026-10-15T10:30:00+08:00' : scenario === 'book' ? '2026-10-15T11:00:00+08:00' : scenario === 'reschedule' ? '2026-10-15T14:30:00+08:00' : null
    if (node.id === 'voice-webhook') { input.requested_time = requestedTime; if (['reschedule', 'cancel'].includes(scenario)) input.appointment_id = RECEPTION_LEAD.appointmentId }
    if (node.id === 'code-arguments') { input.raw_time = requestedTime; output.requested_time = requestedTime; output.tool = tool }
    if (node.id === 'log-booking') { Object.assign(input, { operation: scenario, appointment_id: ['reschedule', 'cancel'].includes(scenario) ? RECEPTION_LEAD.appointmentId : null }); Object.assign(output, { record_id: result.recordId, status: result.status, appointment: result.appointment, operation: ['reschedule', 'cancel'].includes(scenario) ? 'Update existing record' : 'Create record' }) }
    if (node.id === 'send-email') Object.assign(output, { subject: result.subject, message: result.emailBody, link: result.link })
    if (node.id === 'respond-voice') { input.status = result.status; output.message = result.reply }
  }
  if (isRag) {
    if (scenario === 'add') {
      if (node.id === 'drive-trigger') Object.assign(output, { event: 'added', version: 'v1' })
      if (node.id === 'download-document') Object.assign(output, { text: RAG_FIXTURE.excerpt, version: 'v1' })
      if (node.id === 'split-document') { input.version = 'v1'; Object.assign(output, { chunks: 3, excerpt: RAG_FIXTURE.excerpt }) }
      if (node.id === 'embed-document') { input.chunks = 3; output.embedded_chunks = 3 }
      if (node.id === 'upsert-vectors') { input.version = 'v1'; Object.assign(output, { removed_old_chunks: 0, active_chunks: 3, version: 'v1' }) }
      if (node.id === 'sync-complete') Object.assign(output, { status: 'Indexed', active_chunks: 3, version: 'v1' })
    }
    if (scenario === 'no-source') {
      if (['chat-trigger', 'rag-agent'].includes(node.id)) output.question = RAG_FIXTURE.missingQuestion
      if (['rag-agent', 'retrieval'].includes(node.id)) input.question = RAG_FIXTURE.missingQuestion
      if (node.id === 'retrieval') { input.query = RAG_FIXTURE.missingQuestion; Object.assign(output, { matches: 0 }); delete output.source; delete output.excerpt; delete output.page }
      if (node.id === 'source-check') { input.matches = 0; output.supported = false }
    }
    if (scenario === 'archive') {
      if (node.id === 'drive-trigger') Object.assign(output, { event: 'archived', version: 'v1' })
      if (node.id === 'sync-complete') Object.assign(output, { status: 'Archived', active_chunks: 0 })
    }
    if (scenario === 'refresh' && node.id === 'sync-complete') Object.assign(output, { status: 'Indexed', active_chunks: 4, version: 'v2' })
  }
  if (isHr) {
    const missing = scenario === 'missing-detail'
    const approvedInterview = scenario === 'interview-approved'
    if (missing) {
      if (node.id === 'hr-read-cv') output.text = HR_FIXTURE.missingSummary
      if (node.id === 'hr-evidence') output.crm = 'Not stated · clarification needed'
      if (node.id === 'hr-review-packet') output.summary = HR_FIXTURE.missingSummary
    }
    if (node.id === 'hr-approval') { input.recruiter_action = approvedInterview ? 'Interview approved' : missing ? 'Clarify detail' : 'Review pending'; output.interview_approved = approvedInterview }
    if (node.id === 'hr-log') output.status = approvedInterview ? 'Interview scheduled' : missing ? 'Follow-up requested' : 'Awaiting recruiter review'
    if (node.id === 'hr-job-approval') { input.recruiter_approved = scenario === 'publish-approved'; output.publish_allowed = scenario === 'publish-approved' }
  }
  const reset = () => { replayVersion.current += 1; remaining.current = null; setPhase('action'); setRunning(false); setCursor(-1); setSelection(null); setOutputChoice(null) }
  return <section className="workflow-page workflow-detail" aria-labelledby="journey-title">
    <header className="journey-heading"><div><Link className="workflow-back" to="/work-in-action">← All workflows</Link><h1 id="journey-title">{workflow.title.replace(/ System$/, '')} <em>{isHr ? 'with AI.' : 'System.'}</em></h1><p>{isHr ? 'Prepare CV evidence, follow-up emails, approved interviews and job drafts while the recruiter stays in control.' : isRag ? 'A document-grounded assistant that answers repeat questions and keeps its knowledge in sync with Google Drive.' : isReception ? 'A simulated n8n voice receptionist that checks, books, reschedules, cancels and records appointments.' : isWelcome ? 'From a new client to a clear intake and a confident team handoff.' : isAppointment ? 'A GoHighLevel workflow for confirmations, timely reminders and cancellation checks.' : 'A GoHighLevel workflow, from form submission to personal follow-up.'}</p></div><span className="workflow-badge">{isN8nDemo ? 'n8n demo' : 'GoHighLevel demo'}</span></header>
    <WorkflowCanvas workflow={workflow} statuses={statuses} selected={selected} onSelect={selectNode} playing={running} activeNodeId={plan[cursor]} transfer={phase === 'connector' && cursor < plan.length - 1 ? { from: plan[cursor], to: plan[cursor + 1] } : null} speed={speed} plan={plan} contactName={isHr ? HR_FIXTURE.applicant : isRag ? 'Maya · knowledge assistant' : isReception ? RECEPTION_LEAD.caller : isWelcome ? CLIENT.name : isAppointment ? APPOINTMENT.name : SAMPLE_LEAD.name} controls={
      <div className="journey-command">
        <fieldset className="journey-scenarios"><legend>Choose a scenario</legend><div>{scenarios.map((item) => <button key={item.id} type="button" aria-pressed={scenario === item.id} disabled={running} onClick={() => { reset(); setScenario(item.id) }}>{item.label}</button>)}</div><p>{scenarios.find((item) => item.id === scenario)?.description}</p></fieldset>
        <div className="journey-command__actions"><fieldset className="journey-speed"><legend>Replay speed</legend><div>{[1, 2, 4].map((value) => <button key={value} type="button" aria-label={`${value}× replay speed`} aria-pressed={speed === value} onClick={() => setSpeed(value)}>{value}×</button>)}</div></fieldset>
          <button className="workflow-primary journey-run" type="button" onClick={() => { if (running) setRunning(false); else { if (finished || !started) { replayVersion.current += 1; remaining.current = null; setPhase('action'); setCursor(0); setSelection(null); setOutputChoice(null) } setRunning(true) } }}>{running ? 'Ⅱ Pause' : finished ? '↻ Run again' : started ? '▶ Resume' : isN8nDemo ? 'Execute workflow' : '▶ Test workflow'}</button>
          <button className="journey-reset" type="button" onClick={reset}>Reset</button>
        </div>
      </div>
    }>
      <div className="journey-progress"><p role="status">{finished ? '✓ Test complete' : running ? phase === 'connector' ? `Proceeding to · ${workflow.nodes.find((item) => item.id === plan[cursor + 1])?.title}` : `${workflow.nodes.find((item) => item.id === plan[cursor])?.icon === 'wait' ? 'Fast-forwarding simulated wait' : isAppointment && plan[cursor] === 'stop' ? 'Showing native exit' : isN8nDemo ? 'Executing n8n node' : 'Executing'} · ${workflow.nodes.find((item) => item.id === plan[cursor])?.title}` : started ? 'Ⅱ Test paused' : `Ready · choose a scenario and press ${isN8nDemo ? 'Execute workflow' : 'Test workflow'}`}</p><span>{completed + interrupted} / {plan.length} steps {interrupted ? 'processed' : 'completed'}</span><progress max={plan.length} value={completed + interrupted} aria-label="Replay progress" /></div>
      <div className="journey-dock">
        <section className="journey-step" aria-labelledby="journey-node-title"><header><span className="workflow-eyebrow">Selected step · {node.tool}</span><span className="journey-status" data-status={statuses[node.id]}>{statuses[node.id] === 'Running' && !running ? 'Paused' : statuses[node.id]}</span></header><h2 id="journey-node-title">{node.title}</h2><p>{node.description}</p>
            <details className="journey-step__data" key={node.id}><summary>Inspect sample input & output</summary><div><h3>Input</h3><pre>{started && statuses[node.id] !== 'Waiting' && statuses[node.id] !== 'Skipped' ? JSON.stringify(input, null, 2) : 'Input will arrive when this step runs.'}</pre><h3>Output</h3><pre>{statuses[node.id] === 'Completed' ? JSON.stringify(output, null, 2) : statuses[node.id] === 'Interrupted' ? isReception ? 'Tool call interrupted before the voice response.' : 'Wait interrupted: HighLevel automatically removed the contact after cancellation.' : statuses[node.id] === 'Skipped' ? 'Skipped for this scenario.' : 'Output appears after this step completes.'}</pre></div></details>
        </section>
        {isReception && <ReceptionOutputs statuses={statuses} scenario={scenario as ReceptionScenario} visibleId={visibleOutput} onSelect={(id) => setOutputChoice({ id, cursor })} />}
        {isHr && <HrOutputs statuses={statuses} scenario={scenario as HrScenario} visibleId={visibleOutput} onSelect={(id) => setOutputChoice({ id, cursor })} />}
        {isRag && <RagOutputs statuses={statuses} scenario={scenario as RagScenario} visibleId={visibleOutput} onSelect={(id) => setOutputChoice({ id, cursor })} />}
        <section className="journey-live" hidden={isN8nDemo} aria-labelledby="journey-outputs-title"><header className="journey-live__head"><h2 id="journey-outputs-title">Live outputs</h2><span>{availableOutputs.length ? 'Sample data · select to review' : 'Appear as each step completes'}</span></header>
          {availableOutputs.length > 0 && <div className="journey-output-picker" role="group" aria-label="Completed app outputs">{availableOutputs.map((item) => <button type="button" key={item.id} aria-pressed={visibleOutput === item.id} onClick={() => setOutputChoice({ id: item.id, cursor })}>{item.label}<span aria-hidden="true"> ✓</span></button>)}</div>}
           <div className="journey-live__body" data-lenis-prevent tabIndex={0} aria-label="Live output viewer">{visibleOutput ? isWelcome ? <WelcomeOutputs key={visibleOutput} statuses={statuses} scenario={scenario as WelcomeScenario} visibleId={visibleOutput} /> : isAppointment ? <AppointmentOutputs key={visibleOutput} statuses={statuses} scenario={scenario as AppointmentScenario} visibleId={visibleOutput} /> : <AppOutputs key={visibleOutput} statuses={statuses} scenario={scenario as LeadScenario} visibleId={visibleOutput} /> : <div className="journey-output-empty"><span aria-hidden="true">↗</span><h3>{started ? isReception ? 'Returning the voice result…' : isWelcome ? 'Confirming the new client…' : isAppointment ? 'Receiving the booking…' : 'Capturing the inquiry…' : 'Watch the work take shape.'}</h3><p>{started ? isReception ? 'The response payload appears when the selected n8n path reaches Respond to Webhook.' : isWelcome ? 'The CRM record appears when the Won trigger completes.' : isAppointment ? 'The calendar booking appears when the trigger completes.' : 'The sample form will appear when Form submitted completes.' : 'Test a scenario. Outputs appear here only as their steps complete.'}</p></div>}</div>
        </section>
      </div>
      <details className="journey-execution"><summary>Execution log <span>{completed} completed{interrupted ? ` · ${interrupted} interrupted` : ''}{started ? ` · ${workflow.nodes.length - plan.length} skipped` : ''}</span></summary><ol>{workflow.nodes.map((item, index) => <li key={item.id} data-status={statuses[item.id]}><button type="button" aria-pressed={selected === item.id} onClick={() => selectNode(item.id)}><span>{String(index + 1).padStart(2, '0')}</span><b>{item.title}</b><small>{statuses[item.id]}</small></button></li>)}</ol></details>
      <p className="journey-demo-note">Simulated replay · fictional data · no live records or messages. {isHr ? 'CV evidence, reviewer approvals, emails and postings are simulated.' : isRag ? 'Chat answers, document passages and database updates are fictional fixtures.' : isReception ? 'Calendar, voice and Airtable requests are deterministic fixtures.' : isWelcome ? 'Waits and human review are simulated; no actual days elapse.' : isAppointment ? 'Wait steps are fast-forwarded; no actual hours or days elapse.' : 'Booking links are examples.'}</p>
    </WorkflowCanvas>
    <details className="journey-reference"><summary>Workflow breakdown & integrations</summary><section className="journey-breakdown" aria-labelledby="journey-breakdown-title"><header className="workflow-section-head"><span className="workflow-eyebrow">Behind the workflow</span><h2 id="journey-breakdown-title">A journey your team can follow.</h2></header>
      <div className="journey-breakdown__grid">{isHr ? <><article><b>01 / Organize the evidence</b><h3>Make CV review easier.</h3><p>Extract the application and summarize explicit job-related evidence with CV references. Missing details become clarification questions, not automatic rejections.</p></article><article><b>02 / Coordinate the next step</b><h3>Act on the recruiter’s decision.</h3><p>A human approval gates interview scheduling. The confirmed sample time creates a Calendar event and Gmail invitation; the same application record tracks the outcome.</p></article><article><b>03 / Prepare job postings</b><h3>Draft first, approve before publishing.</h3><p>An employer brief drives the job draft. Unapproved drafts stay internal. Only the approved-posting scenario shows publication to a simulated careers page.</p></article></> : isRag ? <><article><b>01 / Find the evidence</b><h3>Answer from business documents.</h3><p>The chat triggers an agent retrieval request against active Supabase document chunks. Matching passages keep their document title, version and page.</p></article><article><b>02 / Answer responsibly</b><h3>Show where the answer comes from.</h3><p>The OpenRouter model produces a cited answer from the retrieved policy. If no source supports the question, the assistant asks the team rather than inventing an answer.</p></article><article><b>03 / Keep knowledge current</b><h3>Replace edited sources and remove archives.</h3><p>Google Drive changes start a separate sync path. Updated files are chunked and embedded; the old version is replaced using the file ID. Archived files are removed from retrieval.</p></article></> : isReception ? <><article><b>01 / Receive the call</b><h3>Turn a voice request into one predictable payload.</h3><p>Vapi calls an n8n webhook. A JavaScript transform normalizes the tool name, caller details, requested time and business timezone before any calendar action runs.</p></article><article><b>02 / Do the operational work</b><h3>Make each receptionist tool explicit.</h3><p>An If router sends GetSlots, BookSlots, UpdateSlots, cancelSlots or call_results down a visible path. Calendar and Airtable steps are deterministic in this portfolio demo, so the visitor can inspect the data contract.</p></article><article><b>03 / Respond and record</b><h3>Return a clear answer to the caller.</h3><p>Respond to Webhook sends a compact result back to Vapi. A production build adds credential management, idempotency, timezone validation, retries and safe handling for unavailable slots.</p></article></> : isWelcome ? <><article><b>01 / Welcome</b><h3>Give the client a clear first step.</h3><p>A Won opportunity starts the welcome email with an intake link. A real setup filters the right pipeline and avoids duplicate enrollment.</p></article><article><b>02 / Collect & review</b><h3>Wait for useful details.</h3><p>A companion Form Submitted workflow marks intake received. A conditional wait has a two-day timeout. A human review decides whether setup is ready or clarification is needed.</p></article><article><b>03 / Hand off</b><h3>Start with an approved intake.</h3><p>Approved clients move to Ready for setup and notify the assigned user. Overdue clients receive one reminder; unclear goals receive a focused question. Neither path starts setup.</p></article></> : isAppointment ? <><article><b>01 / Confirm the booking</b><h3>Make the appointment clear.</h3><p>A regular HighLevel calendar booking starts the workflow. The first email confirms the date, timezone, duration and meeting details.</p></article><article><b>02 / Time the reminders</b><h3>Send the right message at the right time.</h3><p>Appointment-based waits schedule the 24-hour email and 1-hour SMS. A past 24-hour wait jumps to the later reminder, avoiding a late “tomorrow” message.</p></article><article><b>03 / Check before sending</b><h3>Respect cancelled appointments.</h3><p>HighLevel automatically removes the contact when the booking is cancelled, interrupting the active wait. Status checks also guard the reminder path. Real waits are compressed into seconds; the cancellation card is a demo event marker.</p></article></> : <><article><b>01 / Capture & organise</b><h3>Give every inquiry a home.</h3><p>The HighLevel form creates the contact. Workflow actions organise the opportunity and hand data to the external lead-register integration.</p></article><article><b>02 / Assess & route</b><h3>Choose a useful next step.</h3><p>Contact fields and an If / Else condition determine readiness. The Yes branch prepares discovery; the No branch asks for more context.</p></article><article><b>03 / Communicate & hand off</b><h3>Keep people in the loop.</h3><p>HighLevel sends the personal follow-up. A webhook integration alerts the team in Telegram; the Gmail preview represents the recipient’s inbox.</p></article></>}</div>
      <div className="journey-integrations"><h3>Tools & integrations</h3><div className="workflow-tools">{workflow.tools.map((tool) => <span key={tool}><ToolMark tool={tool} />{tool}</span>)}</div><p>{isHr ? 'n8n coordinates AI-assisted drafting and recruitment admin. Google Drive supplies CV text; Airtable stores review packets and application status; Gmail and Calendar handle approved next steps. A live setup needs applicant access controls, data-retention rules and reliable approval and scheduling checks.' : isRag ? 'n8n orchestrates the chat and document sync paths. OpenRouter represents model generation; Supabase (pgvector) represents read-only retrieval and separate indexing operations. Production requires source access controls, consistent embedding configuration, file version handling and tested sync failures.' : isReception ? 'n8n is the orchestration layer. Vapi represents the voice agent, Google Calendar represents availability and appointment mutations, and Airtable represents the operations log. A real deployment needs credentials, retries, idempotency, timezone rules, consent and a tested failure path.' : isWelcome ? 'Built around Opportunity Status Changed, Send Email, conditional Wait, If / Else, Update Opportunity and Internal Notification. A companion form workflow updates intake fields. Production needs team ownership of the review fields, sending configuration and tested enrollment rules.' : isAppointment ? 'Built around HighLevel Calendar, Send Email, Send SMS, appointment-based Wait and If / Else actions, plus native cancellation handling. A real setup needs sending services, correct timezone settings and messaging consent. The sample demonstrates regular appointments, not recurring bookings or rescheduling.' : 'GoHighLevel is the workflow platform. Google Sheets and Telegram are illustrated external webhook handoffs. Messaging assumes the required connections and consent.'} The moving outline, connector replay and speed controls are portfolio-demo features.</p></div>
      <p className="workflow-disclaimer">This is an illustrative portfolio example, not measured client results or a live production workflow.</p>
    </section></details>
  </section>
}
