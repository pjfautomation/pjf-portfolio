import type { WorkflowDefinition, WorkflowNode } from './workflows'

export type HrScenario = 'review-ready' | 'missing-detail' | 'interview-approved' | 'job-draft' | 'publish-approved'
export const HR_SCENARIOS: { id: HrScenario; label: string; description: string }[] = [
  { id: 'review-ready', label: 'Prepare applicant review', description: 'Summarize the CV and queue the evidence for a recruiter’s decision.' },
  { id: 'missing-detail', label: 'Ask a follow-up question', description: 'Request the missing CRM detail without rejecting the applicant.' },
  { id: 'interview-approved', label: 'Approved interview', description: 'A recruiter has approved the interview and the applicant has chosen the sample time.' },
  { id: 'job-draft', label: 'Draft a job posting', description: 'Turn an employer brief into a draft awaiting publication approval.' },
  { id: 'publish-approved', label: 'Approved job posting', description: 'Publish the fictional job only after explicit recruiter approval.' },
]
export const HR_FIXTURE = {
  applicant: 'Jordan Reyes', email: 'jordan@example.com', applicationId: 'app_demo_104',
  role: 'Operations Assistant', cv: 'Jordan_Reyes_CV.pdf',
  summary: 'Two years of administrative support, calendar coordination and weekly reporting. CV page 1 describes maintaining CRM contact records and task lists.',
  missingSummary: 'Two years of administrative support, calendar coordination and weekly reporting. The CV does not describe CRM work; request a clarification rather than assuming no experience.',
  question: 'Could you share an example of using a CRM to update contact records or manage tasks?',
  interview: '20 Oct 2026 · 2:00–2:30 PM', timezone: 'Asia/Manila (GMT+8)',
  meeting: 'https://example.com/meet/interview-104', jobUrl: 'https://example.com/careers/operations-assistant',
  duties: ['Maintain CRM contact records and follow-up tasks.', 'Coordinate calendars and meeting details.', 'Prepare weekly operations reports.'],
  requirements: ['Relevant administrative support experience.', 'Familiarity with CRM contact and task management.', 'Clear written communication and organized reporting.'],
}
export const HR_OUTPUTS = [
  { id: 'hr-read-cv', label: 'Applicant' }, { id: 'hr-review-packet', label: 'Recruiter review' },
  { id: 'hr-follow-up', label: 'Gmail' }, { id: 'hr-calendar', label: 'Calendar' },
  { id: 'hr-invite', label: 'Gmail' }, { id: 'hr-log', label: 'Airtable' },
  { id: 'hr-job-draft', label: 'Job draft' }, { id: 'hr-save-draft', label: 'Draft saved' },
  { id: 'hr-publish', label: 'Job posting' },
]
const node = (id: string, title: string, tool: string, x: number, y: number, description: string, input: Record<string, unknown>, output: Record<string, unknown>, nodeType: WorkflowNode['nodeType'] = 'action'): WorkflowNode => ({ id, title, tool, x, y, description, input, output, nodeType, subtitle: tool, symbol: '◈' })
export const HR_WORKFLOW: WorkflowDefinition = {
  id: 'hr-assistant', title: 'HR Evaluation & Job Posting Assistant', platform: 'n8n', category: 'n8n recruitment operations', canvasHeight: 1100,
  summary: 'Reduce repetitive recruitment admin: summarize CV evidence, request missing details, prepare approved interviews and draft job posts. Hiring decisions and publication stay with the recruiter. Simulated n8n replay.',
  tools: ['n8n', 'AI Agent', 'Google Drive', 'Gmail', 'Google Calendar', 'Airtable', 'Careers website'],
  nodes: [
    node('hr-application', 'Application received', 'Webhook', 70, 100, 'Receive the application and CV attachment using fictional applicant details.', { role: HR_FIXTURE.role }, { application_id: HR_FIXTURE.applicationId, applicant: HR_FIXTURE.applicant }, 'trigger'),
    node('hr-read-cv', 'Read the CV', 'Google Drive', 350, 100, 'Extract the CV text and retain source references. Only job-related evidence is included in the review packet.', { file: HR_FIXTURE.cv }, { text: HR_FIXTURE.summary, source: 'CV page 1' }),
    node('hr-evidence', 'Organize role evidence', 'AI Agent', 650, 100, 'Map explicit CV evidence to the employer’s role requirements. Mark missing information as unknown; do not score, rank or decide whether to hire the applicant.', { role: HR_FIXTURE.role, requirements: HR_FIXTURE.requirements }, { administrative_support: 'CV page 1', crm: 'CV page 1', decision: 'Recruiter review required' }),
    node('hr-review-packet', 'Prepare recruiter review', 'Airtable', 930, 100, 'Prepare a concise evidence packet with source references for a human recruiter.', { application_id: HR_FIXTURE.applicationId }, { summary: HR_FIXTURE.summary, review_status: 'Awaiting recruiter review' }),
    node('hr-approval', 'Recruiter decision?', 'If', 1210, 100, 'Use a recruiter-supplied action, never an AI hiring decision. The approved-interview scenario supplies explicit approval and a confirmed time.', { recruiter_action: 'Review pending' }, { interview_approved: false }, 'condition'),
    node('hr-calendar', 'Schedule approved interview', 'Google Calendar', 1450, 100, 'Create the interview only after recruiter approval and the applicant’s sample slot confirmation. A live setup would check conflicts before creation.', { recruiter_approved: true, applicant_confirmed: true, time: HR_FIXTURE.interview }, { event_id: 'interview_demo_104', status: 'Confirmed', meeting: HR_FIXTURE.meeting }),
    node('hr-invite', 'Send interview invitation', 'Gmail', 1720, 100, 'Email the confirmed interview time, timezone and meeting link after calendar creation completes.', { to: HR_FIXTURE.email, event_id: 'interview_demo_104' }, { subject: 'Your Operations Assistant interview', time: HR_FIXTURE.interview, meeting: HR_FIXTURE.meeting, delivery: 'Simulated' }),
    node('hr-follow-up', 'Request missing detail', 'Gmail', 1450, 340, 'Ask a focused job-related question. Missing CV information is not a rejection or proof the applicant lacks the skill.', { to: HR_FIXTURE.email }, { subject: 'A quick question about your application', question: HR_FIXTURE.question, delivery: 'Simulated' }),
    node('hr-log', 'Update applicant record', 'Airtable', 1720, 410, 'Update the same application ID with review, clarification or interview status. Do not create duplicate applicants.', { application_id: HR_FIXTURE.applicationId }, { status: 'Awaiting recruiter review', hiring_decision: 'Not made' }),
    node('hr-job-brief', 'Employer brief received', 'Webhook', 70, 740, 'Receive a separate job-posting brief containing the employer-approved role responsibilities and requirements.', { role: HR_FIXTURE.role }, { duties: HR_FIXTURE.duties, requirements: HR_FIXTURE.requirements }, 'trigger'),
    node('hr-job-draft', 'Draft the job posting', 'AI Agent', 350, 740, 'Draft the posting from the supplied brief. The recruiter reviews wording and employment details before publication.', { role: HR_FIXTURE.role, duties: HR_FIXTURE.duties }, { title: HR_FIXTURE.role, status: 'Draft · awaiting approval' }),
    node('hr-job-approval', 'Publication approved?', 'If', 650, 740, 'Publish only when the recruiter explicitly approves the job posting. The ordinary draft scenario remains unpublished.', { recruiter_approved: false }, { publish_allowed: false }, 'condition'),
    node('hr-save-draft', 'Save for review', 'Airtable', 930, 900, 'Save the draft for recruiter review without posting it publicly.', { title: HR_FIXTURE.role }, { record_id: 'job_demo_104', status: 'Draft', published: false }),
    node('hr-publish', 'Publish approved job', 'Careers website', 930, 640, 'Publish a simulated careers-page posting only after the recruiter-approved scenario passes the approval gate.', { recruiter_approved: true, approval_id: 'approval_demo_104' }, { status: 'Published · simulated', url: HR_FIXTURE.jobUrl, approval_id: 'approval_demo_104' }),
  ],
  edges: [
    { from: 'hr-application', to: 'hr-read-cv' }, { from: 'hr-read-cv', to: 'hr-evidence' }, { from: 'hr-evidence', to: 'hr-review-packet' }, { from: 'hr-review-packet', to: 'hr-approval' },
    { from: 'hr-approval', to: 'hr-calendar', label: 'Recruiter approved' }, { from: 'hr-calendar', to: 'hr-invite' }, { from: 'hr-invite', to: 'hr-log' },
    { from: 'hr-approval', to: 'hr-follow-up', label: 'Clarify detail' }, { from: 'hr-follow-up', to: 'hr-log' }, { from: 'hr-approval', to: 'hr-log', label: 'Review pending' },
    { from: 'hr-job-brief', to: 'hr-job-draft' }, { from: 'hr-job-draft', to: 'hr-job-approval' }, { from: 'hr-job-approval', to: 'hr-save-draft', label: 'Pending' }, { from: 'hr-job-approval', to: 'hr-publish', label: 'Approved' },
  ],
}
export function hrPlan(scenario: HrScenario): string[] {
  if (scenario === 'job-draft' || scenario === 'publish-approved') return ['hr-job-brief', 'hr-job-draft', 'hr-job-approval', scenario === 'job-draft' ? 'hr-save-draft' : 'hr-publish']
  return ['hr-application', 'hr-read-cv', 'hr-evidence', 'hr-review-packet', 'hr-approval', ...(scenario === 'missing-detail' ? ['hr-follow-up'] : scenario === 'interview-approved' ? ['hr-calendar', 'hr-invite'] : []), 'hr-log']
}
