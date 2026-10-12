import { Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TabBar from '@/components/TabBar'
import QuickMenu from '@/components/QuickMenu'
import Rail from '@/components/Rail'
import IntroOverlay from '@/components/IntroOverlay'
import CursorRing from '@/components/CursorRing'
import AccessMenu from '@/components/AccessMenu'
import { useLenis, SCROLLER_ID } from '@/hooks/useLenis'
import { useIsPhone } from '@/hooks/useMediaQuery'
import { watchFrameHealth } from '@/lib/perf'

/**
 * The shell. It owns everything that outlives a route change: the botanical
 * background, the intro, the profile rail and the one scrolling panel. Each route
 * renders its view into that panel through the Outlet.
 *
 * Home stays within one viewport on laptops and monitors.
 * Work in Action and its workflow demos scroll inside the main panel.
 * About and Contact retain their fixed panel budget.
 */
export default function App() {
  useLenis()

  const { pathname } = useLocation()
  const FIXED_ROUTES = ['/about', '/contact']
  // Home is a fixed viewport composition too; keeping it in this contract
  // prevents the panel scrollbar from appearing during the intro handoff.
  const isFixed = pathname === '/' || FIXED_ROUTES.includes(pathname)
  // Below the shell breakpoint the rail is gone: a bottom tab bar navigates,
  // the QuickMenu (theme + accessibility) floats top-right on every page but
  // Home (whose profile header carries it), and the visits widget folds into
  // that header.
  const phone = useIsPhone()
  const panelRef = useRef<HTMLElement>(null)

  // The panel is the scroller, so a route change has to reset it by hand -
  // the browser only restores scroll on the document.
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  // From the first route change on, a page that mounts rises into place
  // (mobile-pass.css). Not on the first load: the intro owns that arrival.
  // Layout effect: set before paint, or the new page shows for one frame at
  // full opacity and then jumps back to start its rise.
  const firstPath = useRef(pathname)
  useLayoutEffect(() => {
    if (pathname !== firstPath.current) document.documentElement.classList.add('has-navigated')
  }, [pathname])

  useEffect(() => { void watchFrameHealth() }, [])

  return (
    <>
      <IntroOverlay />
      <CursorRing />
      <a href={`#${SCROLLER_ID}`} className="skip-link">Skip to main content</a>
      {/* The botanical image uses a static decorative layer that
          stays mounted across routes, independent of the glass panels. */}
      <div className="portfolio-background" aria-hidden="true">
        <div className="portfolio-background__canvas-fallback" />
      </div>
      {phone && pathname !== '/' && <QuickMenu className="qmenu--float" />}
      <div className="shell">
        <Rail />
        <main
          ref={panelRef}
          id={SCROLLER_ID}
          className="shell__panel"
          data-fixed={isFixed ? 'true' : 'false'}
        >
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      {phone && <TabBar />}
      <AccessMenu />
    </>
  )
}
