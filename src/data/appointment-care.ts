import type { WorkflowDefinition, WorkflowNode } from './workflows'

export type AppointmentScenario = 'upcoming' | 'cancelled' | 'last-minute'
export const APPOINTMENT = {
  name: 'Maya Santos', email: 'maya@example.com', phone: '+63 900 000 0001',
  service: 'CRM discovery call', date: 'Thursday, 22 October 2026', time: '10:00 AM',
  timezone: 'Asia/Manila · GMT+8', duration: '30 minutes', location: 'Online meeting',
}
export const APPOINTMENT_SCENARIOS: { id: AppointmentScenario; label: string; description: string }[] = [
  { id: 'upcoming', label: 'Upcoming appointment', description: 'Booked 3 days ahead → confirmation, 24-hour and 1-hour reminders' },
  { id: 'cancelled', label: 'Cancelled appointment', description: 'Cancelled during the first wait → stop without sending reminders' },
  { id: 'last-minute', label: 'Last-minute booking', description: 'Booked 2 hours ahead → bypass the past 24-hour reminder' },
]
export const APPOINTMENT_OUTPUTS = [
  { id: 'booked', label: 'Calendar' }, { id: 'confirmation', label: 'Confirmation' },
  { id: 'reminder24', label: '24-hour email' }, { id: 'reminder1', label: '1-hour SMS' }, { id: 'stop', label: 'Workflow exit' },
]
export function appointmentPlan(scenario: AppointmentScenario) {
  const start = ['booked', 'confirmation', 'wait24']
  if (scenario === 'cancelled') return [...start, 'stop']
  if (scenario === 'last-minute') return [...start, 'wait1', 'status1', 'reminder1']
  return [...start, 'status24', 'reminder24', 'wait1', 'status1', 'reminder1']
}
const node = (id: string, title: string, subtitle: string, y: number, icon: WorkflowNode['icon'], description: string, output: Record<string, unknown>, x = 340): WorkflowNode => ({
  id, title, subtitle, x, y, icon, symbol: '◇', tool: 'GoHighLevel', description,
  input: { contact: APPOINTMENT.name, appointment_id: 'demo_appointment_201' }, output,
})
export const APPOINTMENT_WORKFLOW: WorkflowDefinition = {
  id: 'appointment-care', title: 'Appointment Care System', category: 'CRM & automation', platform: 'GoHighLevel', canvasHeight: 1040,
  summary: 'Confirm bookings, send reminders at the right time and stop follow-up when an appointment is cancelled.',
  tools: ['GoHighLevel', 'HighLevel Calendar', 'Email', 'SMS'],
  nodes: [
    node('booked', 'Appointment booked', 'Trigger · Customer Booked Appointment', 24, 'calendar', 'A customer books a regular appointment through a HighLevel calendar. The booking enrolls the contact in this workflow.', { appointment_id: 'demo_appointment_201', start: '2026-10-22T10:00:00+08:00', status: 'Confirmed' }),
    node('confirmation', 'Confirm the booking', 'Send Email · Appointment details', 136, 'email', 'Send the appointment date, time, timezone and meeting link immediately. Calendar-level notifications should be coordinated with this workflow to avoid duplicates.', { to: APPOINTMENT.email, subject: 'Your discovery call is booked', delivery: 'Simulated' }),
    node('wait24', 'Wait until 24 hours before', 'Wait · Appointment / Calendar Event', 248, 'wait', 'Wait until 24 hours before the appointment. If that time has already passed, use Go to specific step to jump to the 1-hour wait. Real waits are fast-forwarded in this demo.', { resume_at: '2026-10-21T10:00:00+08:00', elapsed: 'Simulated time advance', if_date_passed: 'Go to Wait until 1 hour before' }),
    node('status24', 'Appointment still active?', 'If / Else · Appointment status', 384, 'condition', 'Check the appointment associated with this enrollment. Continue only if it is still active; a cancelled appointment leaves the reminder workflow.', { appointment_status: 'Confirmed', path: 'Send 24-hour reminder' }),
    node('reminder24', 'Send 24-hour reminder', 'Send Email · Tomorrow’s appointment', 520, 'email', 'Send a concise reminder one day before the appointment, including the meeting and cancellation links.', { to: APPOINTMENT.email, subject: 'Your discovery call is tomorrow', delivery: 'Simulated' }, 190),
    node('wait1', 'Wait until 1 hour before', 'Wait · Appointment / Calendar Event', 656, 'wait', 'Wait until one hour before the appointment. The last-minute sample is booked two hours ahead, so this reminder is still timely. In a real build, exit if this wait time is already past.', { resume_at: '2026-10-22T09:00:00+08:00', elapsed: 'Simulated time advance', if_date_passed: 'Exit contact from automation' }),
    node('status1', 'Check status before SMS', 'If / Else · Appointment status', 792, 'condition', 'Check the appointment again before the final reminder. This prevents an outbound reminder for an appointment cancelled after the earlier email.', { appointment_status: 'Confirmed', path: 'Send 1-hour reminder' }),
    node('reminder1', 'Send 1-hour reminder', 'Send SMS · Meeting starts soon', 928, 'sms', 'Send the final reminder with the meeting link. This sample assumes a valid phone number, SMS consent and no messaging restriction.', { to: APPOINTMENT.phone, delivery: 'Simulated', message: 'Your discovery call starts in 1 hour.' }, 190),
    node('stop', 'Appointment cancelled', 'System event · Automatic workflow exit', 928, 'stop', 'HighLevel automatically removes the contact from this appointment workflow when the booking is cancelled. This card is a demo exit marker, not an action you need to add to the builder. The active wait is interrupted and all later reminder actions are skipped.', { appointment_status: 'Cancelled', reminder_workflow: 'Automatically exited', outbound_reminders: 0 }, 490),
  ],
  edges: [
    { from: 'booked', to: 'confirmation' }, { from: 'confirmation', to: 'wait24' },
    { from: 'wait24', to: 'status24', label: 'Scheduled wait' }, { from: 'wait24', to: 'wait1', label: 'Past time · Go To' },
    { from: 'wait24', to: 'stop', label: 'Cancelled · Auto-exit' },
    { from: 'status24', to: 'reminder24', label: 'Yes · Active' }, { from: 'status24', to: 'stop', label: 'No · Cancelled' },
    { from: 'reminder24', to: 'wait1' }, { from: 'wait1', to: 'status1' },
    { from: 'status1', to: 'reminder1', label: 'Yes · Active' }, { from: 'status1', to: 'stop', label: 'No · Cancelled' },
  ],
}
