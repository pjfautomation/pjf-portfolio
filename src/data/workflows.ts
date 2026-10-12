import { APPOINTMENT_WORKFLOW } from './appointment-care'
import { WELCOME_WORKFLOW } from './client-welcome'

export type WorkflowNode = {
  id: string; title: string; subtitle: string; symbol: string; tool: string
  icon?: 'calendar' | 'email' | 'wait' | 'condition' | 'sms' | 'stop'
  x: number; y: number; description: string; input: Record<string, unknown>; output: Record<string, unknown>
}
export type WorkflowDefinition = {
  id: string; title: string; category: string; platform: 'GoHighLevel'; summary: string; tools: string[]; canvasHeight?: number
  nodes: WorkflowNode[]; edges: { from: string; to: string; label?: string }[]
}

export const SAMPLE_LEAD = {
  name: 'Alex Rivera', email: 'alex@example.com', phone: '+63 900 000 0000',
  business: 'Rivera Coaching', inquiry: 'I need a CRM, a booking page and automated follow-up for my coaching business.',
  ready_for_discovery: true,
  messaging_consent: true,
}

const nodes: WorkflowNode[] = [
  { id: 'form', title: 'Form submitted', subtitle: 'Trigger · Coaching inquiry', symbol: '↗', tool: 'GoHighLevel', x: 340, y: 24,
    description: 'A GoHighLevel landing-page form captures the inquiry and creates or updates the contact. The submitted form enrolls Alex in this sample workflow.', input: { source: 'GoHighLevel form' }, output: SAMPLE_LEAD },
  { id: 'crm', title: 'Create opportunity', subtitle: 'Create / Update Opportunity', symbol: '▤', tool: 'GoHighLevel', x: 340, y: 136,
    description: 'Use the contact captured by the form to create or update a GoHighLevel opportunity in the Client journey pipeline, at the New inquiry stage.', input: { email: SAMPLE_LEAD.email, source: 'GoHighLevel form' }, output: { contact_id: 'demo_contact_104', pipeline: 'Client journey', stage: 'New inquiry' } },
  { id: 'sheet', title: 'Record inquiry', subtitle: 'Webhook · Google Sheets', symbol: '▦', tool: 'GoHighLevel', x: 340, y: 248,
    description: 'A GoHighLevel outbound webhook hands the contact data to a configured integration that appends it to the shared Google Sheets lead register. This external handoff is simulated.', input: { contact_id: 'demo_contact_104', name: SAMPLE_LEAD.name }, output: { sheet: 'Lead register', row: 3, status: 'New inquiry', source: 'GoHighLevel form' } },
  { id: 'qualify', title: 'Update contact fields', subtitle: 'Service interest & readiness', symbol: '✦', tool: 'GoHighLevel', x: 340, y: 360,
    description: 'Store the service interest and discovery-call readiness captured in the form as contact fields. The following If / Else checks these explicit fields; this example does not rely on AI qualification.', input: { inquiry: SAMPLE_LEAD.inquiry, business: SAMPLE_LEAD.business, ready_for_discovery: true }, output: { fit: 'Qualified', service: 'CRM & automation', ready_for_discovery: true, next_step: 'Send discovery call link' } },
  { id: 'route', title: 'Ready for discovery?', subtitle: 'If / Else · Contact fields', symbol: '⑂', tool: 'GoHighLevel', x: 340, y: 472,
    description: 'A GoHighLevel If / Else condition checks the contact’s readiness field. The Yes branch prepares a discovery invitation; the No branch requests more context.', input: { ready_for_discovery: true }, output: { path: 'Qualified', follow_up_required: false } },
  { id: 'booking', title: 'Prepare booking', subtitle: 'Update Opportunity · Yes', symbol: '▣', tool: 'GoHighLevel', x: 190, y: 608,
    description: 'Move the opportunity to Discovery invited. The later message uses a configured HighLevel calendar link; this example URL does not open a real calendar. The branch rejoins the team handoff through a Go To connection.', input: { contact_id: 'demo_contact_104' }, output: { stage: 'Discovery invited', booking_url: 'https://example.com/book/discovery' } },
  { id: 'nurture', title: 'Start follow-up', subtitle: 'Update Opportunity · No', symbol: '◷', tool: 'GoHighLevel', x: 490, y: 608,
    description: 'Move the opportunity to Needs more information. The branch rejoins the team handoff through a Go To connection; the later messages request goals, tools and timing.', input: { contact_id: 'demo_contact_104' }, output: { stage: 'Needs more information', next_action: 'Ask about goals and timing' } },
  { id: 'telegram', title: 'Alert the team', subtitle: 'Webhook · Telegram', symbol: '➤', tool: 'GoHighLevel', x: 340, y: 744,
    description: 'A GoHighLevel outbound webhook sends the inquiry summary and next action to a configured Telegram integration. Telegram delivery is external to HighLevel and is simulated here.', input: { name: SAMPLE_LEAD.name, business: SAMPLE_LEAD.business }, output: { channel: 'Demo sales team', message: 'New inquiry: Alex Rivera · CRM & automation. Discovery link prepared.', status: 'Simulated delivery' } },
  { id: 'channel', title: 'WhatsApp available?', subtitle: 'If / Else · Number & consent', symbol: '⑂', tool: 'GoHighLevel', x: 340, y: 880,
    description: 'A second HighLevel If / Else checks for a WhatsApp number and messaging consent. The Yes branch sends WhatsApp, then email. The No branch proceeds directly to email.', input: { phone: SAMPLE_LEAD.phone, messaging_consent: true }, output: { whatsapp_available: true, path: 'WhatsApp, then email' } },
  { id: 'whatsapp', title: 'Send WhatsApp', subtitle: 'WhatsApp · Personal follow-up', symbol: '◉', tool: 'GoHighLevel', x: 190, y: 1016,
    description: 'If a WhatsApp number and appropriate messaging consent are available, prepare a personal reply with the next step. The no-WhatsApp scenario skips this node.', input: { phone: SAMPLE_LEAD.phone, consent: 'Sample consent' }, output: { recipient: SAMPLE_LEAD.name, status: 'Simulated delivery', message: 'Hi Alex! Thanks for your inquiry. Let’s discuss your coaching CRM and follow-up system.' } },
  { id: 'gmail', title: 'Send email', subtitle: 'Send Email · Personal follow-up', symbol: '✉', tool: 'GoHighLevel', x: 340, y: 1152,
    description: 'Use HighLevel’s Send Email action to deliver the next step. The preview shows how the message would appear in a Gmail inbox; Gmail is the recipient mailbox, not the workflow engine.', input: { to: SAMPLE_LEAD.email }, output: { to: SAMPLE_LEAD.email, subject: 'Your CRM & automation inquiry', status: 'Simulated delivery' } },
]

export const WORKFLOWS: WorkflowDefinition[] = [{
  id: 'lead-journey', title: 'Lead Journey System', category: 'CRM & automation', platform: 'GoHighLevel',
  summary: 'A GoHighLevel workflow for form capture, opportunities, conditional routing and personalised follow-up, with external integration previews.',
  tools: ['GoHighLevel', 'Google Sheets', 'Telegram', 'WhatsApp'],
  nodes,
  edges: [
    { from: 'form', to: 'crm' }, { from: 'crm', to: 'sheet' }, { from: 'sheet', to: 'qualify' }, { from: 'qualify', to: 'route' },
    { from: 'route', to: 'booking', label: 'Yes · Ready' }, { from: 'route', to: 'nurture', label: 'No · Needs context' },
    { from: 'booking', to: 'telegram' }, { from: 'nurture', to: 'telegram' },
    { from: 'telegram', to: 'channel' }, { from: 'channel', to: 'whatsapp', label: 'Yes · WhatsApp' }, { from: 'channel', to: 'gmail', label: 'No · Email only' }, { from: 'whatsapp', to: 'gmail' },
  ],
}, APPOINTMENT_WORKFLOW, WELCOME_WORKFLOW]

export const TOOL_ICONS: Record<string, string> = {
  GoHighLevel: '/icons/gohighlevel.png', n8n: '/icons/ai/n8n.svg', Make: '/icons/thesvg/make.svg',
  Zapier: '/icons/ai/zapier.svg', 'Google Sheets': '/icons/thesvg/google-sheets.svg',
  Telegram: '/icons/ai/telegram.svg', Gmail: '/icons/thesvg/gmail.svg',
  'HighLevel Calendar': '/icons/gohighlevel.png',
}
