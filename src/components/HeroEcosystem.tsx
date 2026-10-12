import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const TOOLS = [
  { name: 'GoHighLevel', src: '/icons/gohighlevel.png', className: 'ghl' },
  { name: 'n8n', src: '/icons/thesvg/n8n.svg', className: 'n8n' },
  { name: 'Make', src: '/icons/thesvg/make.svg', className: 'make' },
  { name: 'Zapier', src: '/icons/thesvg/zapier.svg', className: 'zapier' },
] as const

export default function HeroEcosystem({ compact = false }: { compact?: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = gsap.matchMedia()
    media.add(
      compact ? '(min-width: 1100px) and (prefers-reduced-motion: no-preference)' : '(prefers-reduced-motion: no-preference)',
      () => {
        if (!root.current) return
        const tiles = root.current.querySelectorAll('.ecosystem__tile')
        const floats = Array.from(tiles, (tile, i) =>
          gsap.to(tile, {
            y: i % 2 ? 5 : -5,
            rotation: i % 2 ? 1.5 : -1.5,
            duration: 2.5 + i * 0.3,
            delay: i * 0.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        )
        const syncVisibility = () =>
          floats.forEach((float) => (document.hidden ? float.pause() : float.resume()))
        syncVisibility()
        document.addEventListener('visibilitychange', syncVisibility)
        return () => document.removeEventListener('visibilitychange', syncVisibility)
      },
      root,
    )
    return () => media.revert()
  }, [compact])

  return (
    <div className="ecosystem" ref={root}>
      <div className="ecosystem__scene">
        <svg
          className="ecosystem__connections"
          viewBox="0 0 440 360"
          fill="none"
          aria-hidden="true"
        >
          <path d="M60 55 C145 0 290 0 375 65 S430 195 385 235 M60 55 C5 95 5 175 55 215 M55 215 C140 300 295 300 385 235" />
        </svg>
        <img
          className="ecosystem__portrait"
          src="/illustrations/philip-workstation-transparent.png"
          alt="Illustration of Philip working at a desktop computer, facing left"
          width={1254}
          height={1254}
          fetchPriority="high"
        />
        {TOOLS.map((tool) => (
          <div className={`ecosystem__tile ecosystem__tile--${tool.className}`} key={tool.name}>
            <img src={tool.src} alt="" width={30} height={30} />
            <span>{tool.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
