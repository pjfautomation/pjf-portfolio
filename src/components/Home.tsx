import { Link } from 'react-router-dom'
import { ArrowUpRight } from '@/components/slab'
import { Buildings, UsersThree, Briefcase, Storefront } from '@phosphor-icons/react'
import { profile } from '@/data/profile'
import ToolsMarquee from './ToolsMarquee'
import HomeBento from './HomeBento'
import { HomeProfile } from './HomeMobile'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useIsPhone } from '@/hooks/useMediaQuery'

/**
 * Home. One viewport, three bands, no scroll:
 *
 *   head       the display line the intro writes, then the lede
 *   tools      "Tools I work with" beside the marquee, on its own plate
 *   showcase   the bento - one card per view, see HomeBento - on its own
 *
 * The grid is `auto auto 1fr` so the showcase absorbs the slack instead of
 * pushing the panel into a scrollbar. Every other view scrolls; this one is
 * laid out to the box.
 *
 * On a phone the page becomes an app screen: a profile header where the rail
 * used to be, the proof stats under the lede, and the bento replaced by a
 * snap row of tiles (HomeMobile). The CTA leaves the head - the tab bar's
 * Contact action carries it on every screen.
 *
 * `.home__title` is also the intro's landing target: IntroOverlay measures it
 * and flies its copy into this exact rect, so the line the visitor watched
 * being written is the line that stays on the page.
 */
export default function Home() {
  useScrollReveal()
  const phone = useIsPhone()
  const { displayName } = profile

  return (
    <section className="home" aria-labelledby="home-title">
      {phone && <HomeProfile />}

      <div className="home__head">
        <ul className="home__audience" aria-label="Businesses I support">
          {[
            { label: 'Agencies', Icon: Buildings },
            { label: 'Coaches', Icon: UsersThree },
            { label: 'Service businesses', Icon: Briefcase },
            { label: 'Ecommerce', Icon: Storefront },
          ].map(({ label, Icon }, index) => (
            <li key={label} className={`home__audience-pill home__audience-pill--${index}`}>
              <Icon size={15} weight="duotone" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
        <div className="home__headline">
          <h1 className="home__title" id="home-title">
            <span className="home__line">
              <span>{displayName.line1}</span>{' '}
              <span className="home__line--accent">{displayName.line2}</span>
            </span>
          </h1>

            <Link className="home__cta" to="/contact">
              Get in touch
              <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
            </Link>
        </div>

        <p className="home__lede">
          Systems that connect your leads, tools, and team.{' '}
          I help businesses scale without adding more work.
        </p>
      </div>

      <div className="home__hero-tools home__tools-strip"><ToolsMarquee /></div>

      <div className="home__glass home__glass--showcase">
        <div className="home__showcase"><HomeBento /></div>
      </div>
    </section>
  )
}
