import { RECEPTION_LEAD, RECEPTION_RESULTS, type ReceptionScenario } from '@/data/n8n-receptionist'
import ReceptionIcon from './ReceptionIcon'

const requests: Record<ReceptionScenario, string> = {
  availability: 'Do you have an opening on Thursday at 10:30 AM?', book: 'Please book the 11 AM appointment.',
  reschedule: 'Can I move my appointment to the afternoon?', cancel: 'I need to cancel my appointment.',
  'call-results': 'Thank you for your help with my consultation.',
}

export default function ReceptionOutputs({ statuses, scenario, visibleId, onSelect }: { statuses: Record<string, string>; scenario: ReceptionScenario; visibleId?: string; onSelect: (id: string) => void }) {
  const result = RECEPTION_RESULTS[scenario]
  const emailed = statuses['send-email'] === 'Completed'
  const received = statuses['voice-webhook'] === 'Completed'
  const normalized = statuses['code-arguments'] === 'Completed'
  const responded = statuses['respond-voice'] === 'Completed'
  const calendarDone = ['calendar-availability', 'book-calendar', 'update-calendar', 'cancel-calendar'].some((id) => statuses[id] === 'Completed')
  const logged = statuses['log-booking'] === 'Completed' || statuses['call-results'] === 'Completed'
  const cancelled = statuses['cancel-calendar'] === 'Completed'
  const moved = statuses['update-calendar'] === 'Completed'
  const booked = statuses['book-calendar'] === 'Completed'
  const calendarId = ['calendar-availability', 'book-calendar', 'update-calendar', 'cancel-calendar'].find((id) => statuses[id] === 'Completed')
  const recordId = statuses['call-results'] === 'Completed' ? 'call-results' : 'log-booking'
  const callId = responded ? 'respond-voice' : 'voice-webhook'
  const tabs = [
    ...(received ? [{ id: callId, label: 'Call conversation', group: 'call' }] : []),
    ...(calendarDone ? [{ id: calendarId!, label: 'Calendar', group: 'calendar' }] : []),
    ...(logged ? [{ id: recordId, label: 'Airtable', group: 'record' }] : []),
    ...(emailed ? [{ id: 'send-email', label: 'Gmail', group: 'email' }] : []),
  ]
  const activeGroup = visibleId === 'send-email' ? 'email' : visibleId && ['call-results', 'log-booking'].includes(visibleId) ? 'record' : visibleId && ['calendar-availability', 'book-calendar', 'update-calendar', 'cancel-calendar'].includes(visibleId) ? 'calendar' : 'call'
  const active = tabs.find((tab) => tab.group === activeGroup) ?? tabs.at(-1)
  const calendarSkipped = statuses['route-tool'] === 'Completed' && scenario === 'call-results'
  const recordSkipped = statuses['route-tool'] === 'Completed' && false
  return <section className="reception-output-panel" aria-labelledby="reception-live-title"><header className="reception-output-panel__head"><h2 id="reception-live-title">Live outputs</h2><span>Sample results · appear after each step completes</span></header>
    {tabs.length > 0 && <div className="journey-output-picker" role="group" aria-label="Completed app outputs">{tabs.map((tab) => <button type="button" key={tab.group} aria-pressed={active?.group === tab.group} onClick={() => onSelect(tab.id)}>{tab.label} ✓</button>)}</div>}
    <div className="reception-gallery" aria-label="Live tool previews">
    {!active && <div className="journey-output-empty"><h3>Watch the work take shape.</h3><p>Run a scenario. Tool previews appear here after their steps complete.</p></div>}
    <div className="reception-output-slot reception-output-slot--call" hidden={active?.group !== 'call'}>{received ?
    <article className="reception-app reception-call"><header><ReceptionIcon tool="Vapi" /><div><b>Inbound call · {RECEPTION_LEAD.phone}</b><small>Vapi voice agent · Sample conversation</small></div><span>{responded ? 'Completed' : received ? 'In progress' : 'Ready'}</span></header>
      <div className="reception-conversation" aria-live="polite">
        <p className="reception-call-time">{received ? 'Call started · 10:02 AM' : 'Waiting for the sample call'}</p>
        {received && <div className="reception-bubble reception-bubble--agent"><small>AI receptionist</small><p>Thanks for calling. I’m Ava, your appointment assistant. How can I help?</p></div>}
        {normalized && <div className="reception-bubble"><small>Caller · Maya</small><p>{requests[scenario]}</p></div>}
        {calendarDone && !responded && <div className="reception-bubble reception-bubble--agent"><small>AI receptionist</small><p>I’m processing your request. I’ll confirm the result once the steps finish.</p></div>}
        {responded && <><div className="reception-bubble reception-bubble--agent reception-voice__reply"><small>AI receptionist</small><p>{result.reply}</p></div><div className="reception-bubble"><small>Caller · Maya</small><p>{result.closing}</p></div><p className="reception-call-time">Call ended · sample replay</p></>}
      </div><footer>The voice response appears after the workflow returns its result.</footer>
    </article> : <div className="reception-output-waiting"><b>Call conversation</b><p>Appears after Voice webhook completes.</p></div>}</div>
    <div className="reception-output-slot reception-output-slot--calendar" hidden={active?.group !== 'calendar'}>{calendarDone ? <article className="reception-app reception-calendar"><header><ReceptionIcon tool="Google Calendar" /><b>Calendar</b><span>Thursday, Oct 15 · GMT+8</span></header>
      <div className="reception-agenda"><div><time>9:30–10:00 AM</time><p>Team briefing</p></div><div><time>10:30–11:00 AM</time><p>Consultation · Alex Rivera</p></div>
        {calendarDone ? booked || moved || cancelled ? <div className="reception-event" data-cancelled={cancelled}><time>{moved ? '2:30–3:00 PM' : '11:00–11:30 AM'}</time><p><b>{RECEPTION_LEAD.service} · Maya Santos</b><small>{cancelled ? 'Cancelled · calendar event removed' : moved ? 'Rescheduled · Online consultation' : 'Confirmed · Google Meet'}</small></p></div> : <><div className="reception-agenda-slot"><time>11:00–11:30 AM</time><p>Available appointment</p></div><div className="reception-agenda-slot"><time>2:30–3:00 PM</time><p>Available appointment</p></div></> : <p className="reception-pending">Calendar result appears when the calendar step completes.</p>}
        <div><time>4:00–4:30 PM</time><p>Follow-up · Sam Lee</p></div>
      </div><footer>{cancelled ? 'The cancellation is reflected in the calendar.' : moved ? 'Previous time: 11:00 AM → New time: 2:30 PM.' : booked ? 'Maya’s appointment is added with a sample meeting link.' : 'Existing events provide context; available slots appear after the check.'}</footer>
    </article> : <div className="reception-output-waiting"><b>Calendar output</b><p>{calendarSkipped ? 'Calendar step skipped in this scenario.' : 'Appears after the calendar step completes.'}</p></div>}</div>
    <div className="reception-output-slot reception-output-slot--record" hidden={active?.group !== 'record'}>{logged ? <article className="reception-app reception-record"><header><ReceptionIcon tool="Airtable" /><b>AI Receptionist · Operations</b><span>Airtable · Sample data</span></header>
      <div className="reception-table-scroll" tabIndex={0} aria-label="Appointment and call records"><table><thead><tr>{['Record', 'Caller', 'Phone', 'Appointment', 'Status', 'Summary', 'Cost'].map((label) => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody><tr><td>rec_demo_103</td><td>Alex Rivera</td><td>+63 900 000 0000</td><td>15 Oct · 10:30 AM</td><td>Existing booking</td><td>Initial consultation</td><td>—</td></tr>{logged && <tr className="reception-new-record"><td>{result.recordId}</td><td>Maya Santos</td><td>{RECEPTION_LEAD.phone}</td><td>{result.appointment}</td><td>{result.status}</td><td>{scenario === 'call-results' ? 'Consultation inquiry · transcript saved' : scenario === 'availability' ? 'Offered 11:00 AM / 2:30 PM · booking pending' : scenario === 'cancel' ? 'Appointment cancelled' : scenario === 'reschedule' ? 'Moved from 11:00 AM to 2:30 PM' : 'Initial consultation · Google Meet'}</td><td>{scenario === 'call-results' ? '$0.42' : '—'}</td></tr>}</tbody></table></div>
      <footer>{logged ? 'The completed Airtable step reflects Maya’s inquiry or appointment status.' : 'New records appear when the Airtable step completes.'}</footer>
    </article> : <div className="reception-output-waiting"><b>Airtable output</b><p>{recordSkipped ? 'Airtable step skipped in this scenario.' : 'Appears after the Airtable step completes.'}</p></div>}</div>
    <div className="reception-output-slot" hidden={active?.group !== 'email'}>{emailed && <article className="reception-app reception-email"><header><ReceptionIcon tool="Gmail" /><b>Gmail · Appointment desk</b><span>Simulated delivery</span></header><div className="reception-email__body"><h3>{result.subject}</h3><p className="reception-email__address">From: Ava · Appointment desk<br />To: {RECEPTION_LEAD.email}</p><p>Hi Maya,</p><p>{result.emailBody}</p><a href={result.link} target="_blank" rel="noreferrer">{scenario === 'availability' || scenario === 'cancel' ? 'Choose an appointment time' : 'Open meeting link'}</a><p>Best,<br />Ava · Appointment desk</p></div><footer>Sample email · example link · no email sent</footer></article>}</div>
  </div></section>
}
