import type { WorkflowDefinition, WorkflowNode } from './workflows'

export type WelcomeScenario = 'submitted' | 'overdue' | 'clarification'
export const CLIENT = { name: 'Alex Rivera', email: 'alex@example.com', business: 'Rivera Coaching', goal: 'Organise inquiries and automate follow-up', tools: 'GoHighLevel · Google Workspace' }
export const WELCOME_SCENARIOS: { id: WelcomeScenario; label: string; description: string }[] = [
  { id: 'submitted', label: 'Intake submitted', description: 'Form received and reviewed → ready for setup and team handoff' },
  { id: 'overdue', label: 'Intake overdue', description: 'No submission after 2 days → one reminder; setup stays pending' },
  { id: 'clarification', label: 'Clarification needed', description: 'Form received; review flags an unclear goal → request more detail' },
]
export const WELCOME_OUTPUTS = [{ id: 'won', label: 'CRM' }, { id: 'welcome', label: 'Welcome' }, { id: 'intake', label: 'Intake' }, { id: 'reminder', label: 'Reminder' }, { id: 'clarify', label: 'Clarification' }, { id: 'ready', label: 'Ready' }, { id: 'handoff', label: 'Team' }]
export function welcomePlan(scenario: WelcomeScenario) {
  const start = ['won', 'welcome', 'wait', 'received']
  return scenario === 'overdue' ? [...start, 'reminder'] : [...start, 'intake', 'review-wait', 'review', ...(scenario === 'clarification' ? ['clarify'] : ['ready', 'handoff'])]
}
const node = (id: string, title: string, subtitle: string, y: number, icon: WorkflowNode['icon'], description: string, output: Record<string, unknown>, x = 340): WorkflowNode => ({ id, title, subtitle, y, x, icon, tool: 'GoHighLevel', symbol: '◇', description, input: { contact: CLIENT.name, opportunity_id: 'demo_client_301' }, output })
export const WELCOME_WORKFLOW: WorkflowDefinition = {
  id: 'client-welcome', title: 'Client Welcome System', category: 'CRM & automation', platform: 'GoHighLevel', canvasHeight: 1280,
  summary: 'Welcome new clients, collect their intake, follow up on missing details and give the team a clear setup handoff.',
  tools: ['GoHighLevel', 'Forms', 'Email', 'Internal notifications'],
  nodes: [
    node('won', 'New client confirmed', 'Trigger · Opportunity Status Changed: Won', 24, undefined, 'An opportunity changing to Won starts onboarding. Filter to the intended service pipeline and prevent unintended repeat enrollment in a real setup.', { status: 'Won', stage: 'Awaiting intake', client: CLIENT.name }),
    node('welcome', 'Send welcome email', 'Send Email · Intake invitation', 136, 'email', 'Welcome the client and share the onboarding form. Explain what to prepare and what happens next.', { to: CLIENT.email, subject: 'Welcome aboard, Alex', form_url: 'https://example.com/onboarding', delivery: 'Simulated' }),
    node('wait', 'Wait for intake', 'Wait · Condition with 2-day timeout', 248, 'wait', 'Wait for an intake-received field, with a two-day timeout. A companion Form Submitted workflow sets that field. This replay also compresses the team review; real review takes human input.', { intake_received: true, elapsed: 'Simulated time advance' }),
    node('received', 'Intake received?', 'If / Else · Intake-received field', 384, 'condition', 'Check the intake-received field after the wait. A timeout without submission sends one reminder and ends this reminder pass; setup is not started.', { intake_received: true, path: 'Review intake' }),
    node('reminder', 'Send intake reminder', 'Send Email · No submission', 520, 'email', 'Send one gentle reminder with the form link. Keep the client pending; this demo does not assume they subsequently submit.', { to: CLIENT.email, subject: 'Your onboarding details', delivery: 'Simulated', stage: 'Awaiting intake' }, 490),
    node('intake', 'Intake available', 'Form Submitted · Companion workflow', 520, undefined, 'The companion workflow stores form answers and marks intake received. This card visualises that external form event, not another form-submission action inside the main workflow.', { ...CLIENT, intake_received: true }, 190),
    node('review-wait', 'Wait for team review', 'Wait · Review-complete field', 632, 'wait', 'Pause until a team member reviews the submitted answers and sets the review-complete field. The team must explicitly approve or request clarification. This demo supplies that human decision in seconds.', { reviewed: true, elapsed: 'Simulated human review' }),
    node('review', 'Intake approved?', 'If / Else · Human review field', 744, 'condition', 'A team member reviews the intake and sets the approval field. The preceding wait holds the contact until review is complete. The demo supplies a fictional completed review; automation does not judge the answers.', { reviewed: true, approved: true }),
    node('clarify', 'Ask for clarification', 'Send Email · Review needs detail', 880, 'email', 'Ask a focused question when the reviewer needs more detail. Keep onboarding pending until the client replies and the team reviews it.', { to: CLIENT.email, subject: 'One question before we start', delivery: 'Simulated', stage: 'Needs clarification' }, 490),
    node('ready', 'Mark ready for setup', 'Update Opportunity · Intake approved', 880, undefined, 'Move the onboarding opportunity to Ready for setup only after the team approves the submitted intake.', { stage: 'Ready for setup', intake_approved: true }, 190),
    node('handoff', 'Notify the setup team', 'Internal Notification · Assigned user', 1016, undefined, 'Notify the assigned HighLevel user with the client, goals and next action. This is an internal notification, not a message to the client.', { recipient: 'Assigned setup owner', client: CLIENT.name, next_action: 'Review intake and prepare the kickoff' }),
  ],
  edges: [{ from: 'won', to: 'welcome' }, { from: 'welcome', to: 'wait' }, { from: 'wait', to: 'received' }, { from: 'received', to: 'intake', label: 'Yes · Submitted' }, { from: 'received', to: 'reminder', label: 'No · Timeout' }, { from: 'intake', to: 'review-wait' }, { from: 'review-wait', to: 'review' }, { from: 'review', to: 'ready', label: 'Yes · Approved' }, { from: 'review', to: 'clarify', label: 'No · Needs detail' }, { from: 'ready', to: 'handoff' }],
}
