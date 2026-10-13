import type { WorkflowDefinition } from './workflows'

export type ReceptionScenario = 'availability' | 'book' | 'reschedule' | 'cancel' | 'call-results'

export const RECEPTION_LEAD = {
  caller: 'Maya Santos', phone: '+63 917 555 0142', requestedTime: '2026-10-15T10:30:00+08:00',
  email: 'maya@example.com',
  timezone: 'Asia/Manila', service: 'Initial consultation', appointmentId: 'apt_demo_104',
}

export const RECEPTION_RESULTS: Record<ReceptionScenario, { reply: string; closing: string; status: string; appointment: string; recordId: string; subject: string; emailBody: string; link: string }> = {
  availability: { reply: 'Thursday at 10:30 AM is busy. I found 11:00 AM and 2:30 PM available. I’ve emailed those options with a booking link. No appointment is booked yet.', closing: 'Thanks. I’ll review the options and use the booking link later.', status: 'Availability inquiry', appointment: 'Not booked', recordId: 'rec_inquiry_104', subject: 'Your available consultation times', emailBody: 'Thursday, October 15 at 10:30 AM is busy. Available options are 11:00 AM or 2:30 PM (GMT+8). Choose a time using the booking link. Availability will be checked again when you book; no appointment is reserved yet.', link: 'https://example.com/book/consultation' },
  book: { reply: 'You’re booked for Thursday, October 15 at 11:00 AM. I’ve emailed your confirmation and meeting link.', closing: 'Perfect, I’ll see you at 11 AM. Thank you!', status: 'Booking confirmed', appointment: '15 Oct · 11:00 AM', recordId: 'rec_demo_104', subject: 'Your consultation is confirmed', emailBody: 'Your initial consultation is confirmed for Thursday, October 15 at 11:00 AM (GMT+8), for 30 minutes. Join using the meeting link below.', link: 'https://example.com/meet/demo-104' },
  reschedule: { reply: 'Your appointment has been moved to Thursday, October 15 at 2:30 PM. I’ve emailed the updated confirmation and meeting link.', closing: '2:30 PM works for me. Thank you!', status: 'Rescheduled', appointment: '15 Oct · 2:30 PM', recordId: 'rec_demo_104', subject: 'Your consultation has been rescheduled', emailBody: 'Your appointment has moved from 11:00 AM to 2:30 PM on Thursday, October 15 (GMT+8). The original time is released. Your meeting link remains the same.', link: 'https://example.com/meet/demo-104' },
  cancel: { reply: 'Your appointment has been cancelled. I’ve emailed a cancellation confirmation with a link to book again.', closing: 'Thank you for confirming the cancellation.', status: 'Cancelled', appointment: '15 Oct · 11:00 AM (cancelled)', recordId: 'rec_demo_104', subject: 'Your consultation has been cancelled', emailBody: 'Your Thursday, October 15 appointment at 11:00 AM (GMT+8) has been cancelled. There is no active booking for this appointment. Use the link below if you would like to book another time.', link: 'https://example.com/book/consultation' },
  'call-results': { reply: 'Your call notes have been saved for the team.', closing: 'Thank you.', status: 'Call completed', appointment: '—', recordId: 'rec_call_104', subject: '', emailBody: '', link: '' },
}

export const RECEPTION_SCENARIOS: { id: ReceptionScenario; label: string; description: string }[] = [
  { id: 'availability', label: 'Check availability', description: 'Voice caller asks for an open appointment time.' },
  { id: 'book', label: 'Book appointment', description: 'Validated caller details become a calendar booking.' },
  { id: 'reschedule', label: 'Reschedule appointment', description: 'Find the existing booking, move it, and confirm the change.' },
  { id: 'cancel', label: 'Cancel appointment', description: 'Find the existing booking, cancel it, and return a friendly response.' },
  { id: 'call-results', label: 'Save call result', description: 'Store the recording, transcript, summary, and cost after the call.' },
]

export const RECEPTION_OUTPUTS = [
  { id: 'voice-webhook', label: 'Call conversation' },
  { id: 'calendar-availability', label: 'Calendar availability' },
  { id: 'format-slots', label: 'Voice options' },
  { id: 'book-calendar', label: 'Booking result' },
  { id: 'update-calendar', label: 'Reschedule result' },
  { id: 'cancel-calendar', label: 'Cancellation result' },
  { id: 'call-results', label: 'Call record' },
  { id: 'log-booking', label: 'Booking log' },
  { id: 'send-email', label: 'Gmail' },
  { id: 'respond-voice', label: 'Voice response' },
]

const lead = { caller: RECEPTION_LEAD.caller, phone: RECEPTION_LEAD.phone, service: RECEPTION_LEAD.service }

export const RECEPTION_WORKFLOW: WorkflowDefinition = {
  id: 'ai-receptionist', title: 'AI Receptionist', category: 'n8n voice automation', platform: 'n8n',
  summary: 'A simulated n8n workflow that lets a voice receptionist check, book, reschedule, cancel and log appointments without missing the caller.',
  tools: ['n8n', 'Vapi', 'Google Calendar', 'Airtable', 'Gmail', 'Code (JavaScript)', 'If', 'Respond to Webhook'], canvasHeight: 1120,
  nodes: [
    { id: 'voice-webhook', title: 'Voice webhook', subtitle: 'Vapi · Tool call', symbol: '⌁', tool: 'Vapi', nodeType: 'trigger', x: 70, y: 280, description: 'Vapi calls this n8n webhook when the caller asks the AI receptionist to check, book, move or cancel an appointment.', input: { tool: 'GetSlots', caller: RECEPTION_LEAD.caller, requested_time: RECEPTION_LEAD.requestedTime }, output: { received: true, tool: 'GetSlots' } },
    { id: 'code-arguments', title: 'Normalize arguments', subtitle: 'Code · JavaScript', symbol: '{}', tool: 'Code (JavaScript)', nodeType: 'transform', x: 350, y: 280, description: 'Normalize the voice agent payload, preserve the business timezone, and prepare one predictable object for the next nodes.', input: { raw_time: RECEPTION_LEAD.requestedTime, timezone: RECEPTION_LEAD.timezone }, output: { requested_time: RECEPTION_LEAD.requestedTime, timezone: RECEPTION_LEAD.timezone, duration_minutes: 30 } },
    { id: 'route-tool', title: 'Choose receptionist tool', subtitle: 'If · Operation', symbol: '⑂', tool: 'If', icon: 'condition', nodeType: 'condition', x: 630, y: 280, description: 'Route the tool call to availability, booking, rescheduling, cancellation, or post-call logging.', input: { requested_tool: 'GetSlots' }, output: { branch: 'availability' } },
    { id: 'calendar-availability', title: 'Check availability', subtitle: 'Google Calendar · Free/busy', symbol: '▣', tool: 'Google Calendar', icon: 'calendar', nodeType: 'action', x: 900, y: 120, description: 'Check the calendar for the requested time. This portfolio run uses a deterministic fixture instead of making an API call.', input: { requested_time: RECEPTION_LEAD.requestedTime, duration_minutes: 30 }, output: { available: false, suggested_slots: ['2026-10-15T11:00:00+08:00', '2026-10-15T14:30:00+08:00'] } },
    { id: 'format-slots', title: 'Format open slots', subtitle: 'Code · JavaScript', symbol: '{}', tool: 'Code (JavaScript)', nodeType: 'transform', x: 1180, y: 120, description: 'Turn calendar results into short, voice-friendly options the receptionist can read back to the caller.', input: { suggested_slots: ['2026-10-15T11:00:00+08:00', '2026-10-15T14:30:00+08:00'] }, output: { spoken_options: ['Thursday at 11:00 AM', 'Thursday at 2:30 PM'] } },
    { id: 'book-calendar', title: 'Create calendar event', subtitle: 'Google Calendar · Create', symbol: '▣', tool: 'Google Calendar', icon: 'calendar', nodeType: 'action', x: 900, y: 330, description: 'Create the appointment after the voice agent confirms the selected slot and caller details.', input: { ...lead, start: '2026-10-15T11:00:00+08:00' }, output: { event_id: 'event_demo_104', status: 'confirmed', meet_link: 'https://example.com/meet/demo-104' } },
    { id: 'update-calendar', title: 'Move calendar event', subtitle: 'Google Calendar · Update', symbol: '↻', tool: 'Google Calendar', icon: 'calendar', nodeType: 'action', x: 900, y: 540, description: 'Move the existing appointment to the confirmed replacement time while retaining caller and service details.', input: { appointment_id: RECEPTION_LEAD.appointmentId, new_start: '2026-10-15T14:30:00+08:00' }, output: { appointment_id: RECEPTION_LEAD.appointmentId, status: 'rescheduled', new_start: '2026-10-15T14:30:00+08:00' } },
    { id: 'cancel-calendar', title: 'Cancel calendar event', subtitle: 'Google Calendar · Delete', symbol: '×', tool: 'Google Calendar', icon: 'stop', nodeType: 'action', x: 900, y: 750, description: 'Cancel the existing appointment and return a clear confirmation to the voice agent.', input: { appointment_id: RECEPTION_LEAD.appointmentId }, output: { appointment_id: RECEPTION_LEAD.appointmentId, status: 'cancelled' } },
    { id: 'log-booking', title: 'Create or update record', subtitle: 'Airtable · Inquiry / appointment', symbol: '▤', tool: 'Airtable', nodeType: 'action', x: 1430, y: 330, description: 'Create an availability inquiry or booking record; rescheduling and cancellation update the existing appointment record rather than creating a duplicate.', input: { caller: RECEPTION_LEAD.caller }, output: { record_id: 'rec_inquiry_104', status: 'Availability inquiry', appointment: 'Not booked' } },
    { id: 'send-email', title: 'Send follow-up email', subtitle: 'Gmail · Scenario result', symbol: '✉', tool: 'Gmail', icon: 'email', nodeType: 'action', x: 1640, y: 330, description: 'Email available options and a booking link, or a booking, reschedule or cancellation confirmation. This demo simulates delivery.', input: { to: RECEPTION_LEAD.email }, output: { to: RECEPTION_LEAD.email, subject: RECEPTION_RESULTS.availability.subject, message: RECEPTION_RESULTS.availability.emailBody, link: RECEPTION_RESULTS.availability.link, delivery: 'Simulated' } },
    { id: 'respond-voice', title: 'Respond to voice agent', subtitle: 'Respond to Webhook', symbol: '↩', tool: 'Respond to Webhook', nodeType: 'response', x: 1860, y: 430, description: 'Return the scenario result to Vapi only after the required actions complete. An availability inquiry does not create a booking.', input: { status: 'Availability inquiry' }, output: { success: true, message: RECEPTION_RESULTS.availability.reply } },
    { id: 'call-results', title: 'Save call result', subtitle: 'Airtable · Call record', symbol: '▤', tool: 'Airtable', nodeType: 'action', x: 1180, y: 900, description: 'After the call ends, save the recording, transcript, summary and cost so the team can review the conversation.', input: { caller: RECEPTION_LEAD.caller, summary: 'Caller asked about an initial consultation.', duration_seconds: 186 }, output: { record_id: 'rec_call_104', summary_saved: true, transcript_saved: true, cost_usd: 0.42 } },
  ],
  edges: [
    { from: 'voice-webhook', to: 'code-arguments' }, { from: 'code-arguments', to: 'route-tool' },
    { from: 'route-tool', to: 'calendar-availability', label: 'GetSlots' }, { from: 'route-tool', to: 'book-calendar', label: 'BookSlots' },
    { from: 'route-tool', to: 'update-calendar', label: 'UpdateSlots' }, { from: 'route-tool', to: 'cancel-calendar', label: 'cancelSlots' },
    { from: 'route-tool', to: 'call-results', label: 'call_results' }, { from: 'calendar-availability', to: 'format-slots' },
    { from: 'format-slots', to: 'log-booking' }, { from: 'book-calendar', to: 'log-booking' }, { from: 'log-booking', to: 'send-email' }, { from: 'send-email', to: 'respond-voice' },
    { from: 'update-calendar', to: 'log-booking' }, { from: 'cancel-calendar', to: 'log-booking' }, { from: 'call-results', to: 'respond-voice' },
  ],
}

export function receptionPlan(scenario: ReceptionScenario): string[] {
  const prefix = ['voice-webhook', 'code-arguments', 'route-tool']
  const followUp = ['log-booking', 'send-email', 'respond-voice']
  if (scenario === 'availability') return [...prefix, 'calendar-availability', 'format-slots', ...followUp]
  if (scenario === 'book') return [...prefix, 'book-calendar', ...followUp]
  if (scenario === 'reschedule') return [...prefix, 'update-calendar', ...followUp]
  if (scenario === 'cancel') return [...prefix, 'cancel-calendar', ...followUp]
  return [...prefix, 'call-results', 'respond-voice']
}
