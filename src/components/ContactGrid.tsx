import { useEffect, useRef, useState } from 'react'
import { EnvelopeSimple, CaretDown } from '@/components/slab'
import { FAQS } from '@/data/faqs'
import { profile } from '@/data/profile'

const CALENDLY_URL = 'https://calendly.com/philipjeidf/30min'

export default function ContactGrid() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const calendarViewport = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = calendarViewport.current
    if (!viewport) return
    const observer = new ResizeObserver(([entry]) => {
      const scale = Math.min(1, entry.contentRect.height / 720)
      viewport.style.setProperty('--calendar-scale', String(scale))
    })
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="pgrid cgrid cgrid--booking" aria-labelledby="contact-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">FAQs / Contact</span>
        <h1 className="pgrid__title" id="contact-title">
          Let’s talk about your system.
        </h1>
        <p className="pgrid__lede">
          Tell me about your GoHighLevel setup, workflow or e-commerce operation and what you want to improve.
        </p>
      </header>

      <div className="home__glass cgrid__glass">
        {/* FAQs and direct contact remain beside the booking calendar. */}
        <aside className="cgrid__aside" aria-labelledby="contact-faq">
          <div className="cgrid__aside-head">
            <span className="cgrid__eyebrow">FAQs</span>
            <h2 className="cgrid__aside-title" id="contact-faq">
              Quick answers.
              <br />
              <span>Let’s discuss your next step.</span>
            </h2>
          </div>

          <ul className="cgrid__faqs" role="list">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <li key={f.q} className={`cgrid__faq${isOpen ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="cgrid__faq-q"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`cfaq-${i}`}
                  >
                    <span className="cgrid__step-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span className="cgrid__faq-text">{f.q}</span>
                    <CaretDown size={14} weight="bold" className="cgrid__faq-caret" aria-hidden="true" />
                  </button>
                  <div className="cgrid__faq-a" id={`cfaq-${i}`} hidden={!isOpen}>
                    <p>{f.a}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="cgrid__direct">
            <a className="cgrid__mail" href={`mailto:${profile.email}`}>
              <EnvelopeSimple size={16} weight="fill" aria-hidden="true" />
              <span>{profile.email}</span>
            </a>
            <ul className="cgrid__socials" role="list">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a className="cgrid__social" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <img src={s.iconPath} alt="" loading="lazy" decoding="async" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="cgrid__panel cgrid__calendar">
          <div className="cgrid__calendar-head">
            <h2>Book a 30-minute call</h2>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Open calendar in a new tab</a>
          </div>
          <div className="cgrid__calendar-viewport" ref={calendarViewport}>
            <iframe
              src={`${CALENDLY_URL}?embed_domain=${encodeURIComponent(window.location.hostname)}&embed_type=Inline&primary_color=187b49&hide_event_type_details=1&hide_gdpr_banner=1`}
              title="Book a 30-minute call with Philip Jeid Fabito"
              className="cgrid__calendar-frame"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
