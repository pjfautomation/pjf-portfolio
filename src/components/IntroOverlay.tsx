import { useEffect, useRef, useState } from 'react'
import { profile } from '@/data/profile'

const SERVICES = [
  { label: 'GoHighLevel CRM', detail: 'Leads & customer journeys', path: 'M4 4h16v16H4zM8 8h8M8 12h5M8 16h3', cable: 'M180 170C290 170 290 50 420 50' },
  { label: 'Workflow automation', detail: 'Connected tools & tasks', path: 'M12 3v6M5 15v6M19 15v6M5 15V12h14v3M9 3h6v6H9zM2 15h6v6H2zM16 15h6v6h-6z', cable: 'M180 170H420' },
  { label: 'E-commerce support', detail: 'Orders & store operations', path: 'M4 8h16l-1 13H5L4 8zM8 8V6a4 4 0 0 1 8 0v2', cable: 'M180 170C290 170 290 290 420 290' },
] as const

const shouldRun = typeof window !== 'undefined' && window.location.pathname === '/' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (shouldRun) document.documentElement.classList.add('is-intro')
const release = () => document.documentElement.classList.remove('is-intro', 'is-intro-head')

/** Decorative service intro. All animation stays outside React's render loop. */
export default function IntroOverlay() {
  const [gone, setGone] = useState(!shouldRun)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shouldRun) { release(); return }
    document.documentElement.classList.add('is-intro')
    const root = rootRef.current
    if (!root) { release(); setGone(true); return }
    const animations: Animation[] = []
    const animate = (el: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = el.animate(frames, { fill: 'both', ...options })
      animations.push(animation)
      return animation
    }
    const easing = 'cubic-bezier(0.16, 1, 0.3, 1)'
    animate(root.querySelector('.intro__heading')!, [
      { opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' },
    ], { duration: 650, easing })
    root.querySelectorAll('.intro__node').forEach((node, index) => {
      animate(node, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 500, delay: 150 + index * 90, easing })
    })
    root.querySelectorAll<SVGPathElement>('.intro__connection--live').forEach((path, index) => {
      const length = path.getTotalLength()
      animate(path, [{ strokeDasharray: `${length}`, strokeDashoffset: `${length}` },
        { strokeDasharray: `${length}`, strokeDashoffset: '0' }],
      { duration: 650, delay: 550 + index * 400, easing })
    })
    root.querySelectorAll('.intro__check').forEach((check, index) => {
      animate(check, [{ opacity: 0, transform: 'scale(0.4)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 350, delay: 1100 + index * 400, easing })
    })
    const complete = window.setTimeout(() => {
      const status = root.querySelector('.intro__status')
      if (status) status.textContent = 'Your business, connected.'
      root.classList.add('is-connected')
    }, 2100)
    const exit = window.setTimeout(() => {
      const headline = root.querySelector<HTMLElement>('.intro__headline')
      const sources = root.querySelectorAll<HTMLElement>('.intro__headline > span')
      const targets = document.querySelectorAll<HTMLElement>('.home__line > span')
      if (!headline || sources.length !== 2 || targets.length !== 2) {
        animate(root, [{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing })
        return
      }

      // Fly each phrase to its actual text bounds, rather than the full hero
      // width. This preserves natural spacing across desktop and phone layouts.
      document.documentElement.classList.add('is-intro-head')
      sources.forEach((source, index) => {
        const target = targets[index]
        const textBounds = (element: HTMLElement) => {
          const range = document.createRange()
          range.selectNodeContents(element)
          return range.getBoundingClientRect()
        }
        const from = textBounds(source)
        const to = textBounds(target)
        const type = getComputedStyle(target)
        const clone = document.createElement('span')
        clone.className = 'intro__flying-phrase'
        clone.textContent = target.textContent
        Object.assign(clone.style, {
          fontFamily: type.fontFamily,
          fontSize: type.fontSize,
          fontWeight: type.fontWeight,
          letterSpacing: type.letterSpacing,
          lineHeight: type.lineHeight,
          color: type.color,
        })
        root.append(clone)
        const scale = parseFloat(getComputedStyle(source).fontSize) / parseFloat(type.fontSize)
        const ink = textBounds(clone)
        animate(clone, [
          { transform: `translate(${from.left - ink.left * scale}px, ${from.top - ink.top * scale}px) scale(${scale})` },
          { transform: `translate(${to.left - ink.left}px, ${to.top - ink.top}px) scale(1)` },
        ], { duration: 900, easing: 'cubic-bezier(0.76, 0, 0.24, 1)' })
      })
      headline.style.visibility = 'hidden'
      root.querySelectorAll('.intro__eyebrow, .intro__workflow, .intro__status').forEach(element => {
        animate(element, [{ opacity: 1 }, { opacity: 0 }], { duration: 350, easing })
      })
    }, 2550)
    // Reveal the page near landing, holding its headline until the copy arrives.
    const reveal = window.setTimeout(() => document.documentElement.classList.remove('is-intro'), 3250)
    const finish = window.setTimeout(() => { release(); setGone(true) }, 3450)
    return () => {
      clearTimeout(complete); clearTimeout(exit); clearTimeout(reveal); clearTimeout(finish)
      root.querySelectorAll('.intro__flying-phrase').forEach(element => element.remove())
      animations.forEach(animation => animation.cancel())
      release()
    }
  }, [])

  if (gone) return null
  return (
    <div className="boot intro" ref={rootRef} aria-hidden="true">
      <div className="intro__content">
        <div className="intro__heading">
          <p className="intro__eyebrow">CRM · Automation · E-commerce</p>
          <div className="intro__headline"><span className="intro__lead">{profile.displayName.line1}</span>{' '}<span>{profile.displayName.line2}</span></div>
        </div>
        <div className="intro__workflow">
          <svg className="intro__connections" viewBox="0 0 760 340" fill="none">
            {SERVICES.map(service => <g key={service.label}>
              <path className="intro__connection" d={service.cable} />
              <path className="intro__connection intro__connection--live" d={service.cable} />
            </g>)}
          </svg>
          <div className="intro__node intro__hub">
            <span className="intro__icon"><svg viewBox="0 0 24 24" fill="none"><path d="M3 21h18M5 21V7h14v14M9 7V3h6v4M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-3h4v3" /></svg></span>
            <strong>Your business</strong><small>One connected ecosystem</small>
          </div>
          <div className="intro__services">
            {SERVICES.map(service => <div className="intro__node intro__service" key={service.label}>
              <span className="intro__icon"><svg viewBox="0 0 24 24" fill="none"><path d={service.path} /></svg></span>
              <div><strong>{service.label}</strong><small>{service.detail}</small></div>
              <span className="intro__check"><svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4 10-10" /></svg></span>
            </div>)}
          </div>
        </div>
        <p className="intro__status">Connecting your business…</p>
      </div>
    </div>
  )
}
