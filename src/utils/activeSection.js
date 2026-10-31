import { sectionNavItems } from '../data/sectionNav.js'
import { getNavInset } from './scrollToSection.js'

export function getActiveSectionHref() {
  const activationLine = getNavInset() + 8
  const organizations = document.querySelector('#organizations')
  const isMobileViewport = window.matchMedia('(max-width: 736px)').matches
  const atPageBottom = window.scrollY + window.innerHeight
    >= document.documentElement.scrollHeight - 2
  const organizationsBottomReached = organizations
    && organizations.getBoundingClientRect().bottom
      <= window.innerHeight - (isMobileViewport ? activationLine : 0)
  const organizationsRect = organizations?.getBoundingClientRect()
  const organizationsVisible = organizationsRect
    && organizationsRect.top < window.innerHeight
    && organizationsRect.bottom > 0
  const recognitionRect = document.querySelector('#recognition')?.getBoundingClientRect()
  const recognitionDominatesMobile = isMobileViewport
    && recognitionRect
    && recognitionRect.top < window.innerHeight
    && recognitionRect.bottom > window.innerHeight / 2

  if (atPageBottom) return '#connect'
  if (organizationsBottomReached) return '#connect'
  if (recognitionDominatesMobile) return '#recognition'

  if (organizationsVisible
    && (!isMobileViewport || organizationsRect.bottom > window.innerHeight - activationLine)) {
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
