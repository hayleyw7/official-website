import { sectionNavItems } from '../data/sectionNav.js'
import { getNavInset } from './scrollToSection.js'

export function getActiveSectionHref(scrollDirection = 'down', justLeftPageBottom = false) {
  void scrollDirection
  void justLeftPageBottom
  const activationLine = getNavInset() + 8
  const atPageBottom = window.scrollY + window.innerHeight
    >= document.documentElement.scrollHeight - 2

  if (atPageBottom) return '#connect'

  const organizations = document.querySelector('#organizations')?.getBoundingClientRect()
  const isDesktopViewport = window.matchMedia('(min-width: 737px)').matches
  if (isDesktopViewport && organizations
    && organizations.top < window.innerHeight
    && organizations.bottom > window.innerHeight / 2) {
    return '#organizations'
  }

  let activeHref = sectionNavItems[0].href

  for (const item of sectionNavItems) {
    const section = document.querySelector(item.target)
    if (!section) continue

    if (section.getBoundingClientRect().top <= activationLine) {
      activeHref = item.href
    }
  }

  return activeHref
}
