/**
 * YOUR IDENTITY - start here.
 *
 * Everything that says who you are lives in this file: name, handle, photo,
 * socials, email and the Home headline.
 *
 * Page-specific copy (projects, services, testimonials, FAQs) lives in the
 * other files in src/data/ and at the top of each view component.
 */

import { Briefcase, SealCheck, Clock, type Icon } from '@/components/slab'

export type SocialLink = {
  label: string
  href: string
  iconPath: string
}

/** A proof fact on the phone's Home: a glyph, a short value, a caption. */
export type Stat = { value: string; label: string; Icon: Icon }

export type Profile = {
  name: string
  /** First name, used in "Hi, I'm ___." on About. */
  firstName: string
  handle: string
  /** Short role line under the handle on phones. */
  role: string
  /** Square image. An SVG, WebP or PNG with a transparent background looks best. */
  avatarSrc: string
  /** Tooltip / screen-reader label on the verified tick next to your name. */
  verifiedLabel: string
  email: string
  location: string
  /** Three short proof facts shown on phones under the Home lede. */
  stats: Stat[]
  displayName: { line1: string; line2: string }
  hero: {
    body: string
    portraitSrc: string
    portraitAlt: string
  }
  socials: SocialLink[]
}

export const profile: Profile = {
  name: 'Philip Jeid Fabito',
  firstName: 'Philip',
  handle: '@philipjeidf',
  role: 'GoHighLevel & Automation Specialist',
  // Versioned URL ensures browsers fetch the latest supplied portrait after an asset replacement.
  avatarSrc: '/profile-philip-black-jacket-transparent.png',
  verifiedLabel: '',
  email: 'philipjeidf@gmail.com',
  location: 'Bacoor, Cavite, Philippines',
  stats: [
    { value: 'GHL', label: 'Primary focus', Icon: Briefcase },
    { value: 'n8n', label: 'Automation', Icon: SealCheck },
    { value: 'PH', label: 'Based in Bacoor', Icon: Clock },
  ],
  // The intro types this line, then flies it into the Home headline.
  // Keep it short: two halves, 5-8 words total.
  displayName: { line1: 'Less friction.', line2: 'More momentum.' },
  hero: {
    body: 'Systems that connect your leads, tools, and team. I help businesses scale without adding more work.',
    portraitSrc: '/avatar.svg',
    portraitAlt: 'Portrait placeholder',
  },
  socials: [
    { label: 'Facebook profile', href: 'https://www.facebook.com/AdsByPeej/', iconPath: '/icons/facebook.svg' },
    { label: 'LinkedIn profile', href: 'https://linkedin.com/in/philipjeidf', iconPath: '/icons/linkedin.svg' },
    { label: 'OnlineJobs.PH profile', href: 'https://v2.onlinejobs.ph/jobseekers/info/2925295', iconPath: '/icons/onlinejobs.png' },
  ],
}
