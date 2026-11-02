import { sectionScrollTargets } from '../data/sectionNav.js'

let cachedNavHeight = 0

export function measureSectionNavHeight(nav = document.querySelector('#section-nav')) {
  if (!nav) return 0

  const liveHeight = nav.getBoundingClientRect().height
  if (liveHeight > 0) return Math.ceil(liveHeight)

  const wasHidden = nav.hidden
  const previousVisibility = nav.style.visibility
  const previousPointerEvents = nav.style.pointerEvents

  nav.hidden = false
  nav.style.visibility = 'hidden'
  nav.style.pointerEvents = 'none'
  const measured = Math.ceil(nav.getBoundingClientRect().height)

  nav.style.visibility = previousVisibility
  nav.style.pointerEvents = previousPointerEvents
  if (wasHidden) nav.hidden = true

  return measured
}

export function setSectionNavHeight(height) {
  if (height > 0) {
    cachedNavHeight = height
    document.documentElement.style.setProperty('--section-nav-height', `${height}px`)
  }
}

export function getScrollTarget(href) {
  const selector = sectionScrollTargets[href]
  return selector ? document.querySelector(selector) : null
}

export function getNavInset() {
  const nav = document.querySelector('#section-nav')
  const measured = measureSectionNavHeight(nav)
  if (measured > 0) return measured

  if (cachedNavHeight > 0) return cachedNavHeight

  const fromCss = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--section-nav-height'),
  )

  return Number.isFinite(fromCss) && fromCss > 0 ? fromCss : 0
}

function getSectionTop(element) {
  return element.getBoundingClientRect().top + window.scrollY
}

function waitForScrollEnd(callback) {
  if ('onscrollend' in window) {
    window.addEventListener('scrollend', callback, { once: true })
    return
  }

  let lastScrollY = window.scrollY
  let stableFrames = 0

  const check = () => {
    if (window.scrollY === lastScrollY) {
      stableFrames += 1
      if (stableFrames >= 3) {
        callback()
        return
      }
    } else {
      stableFrames = 0
      lastScrollY = window.scrollY
    }

    requestAnimationFrame(check)
  }

  requestAnimationFrame(check)
}

export function focusSectionTarget(target) {
  const heading = target.querySelector('h2, h3, h1')
  const focusEl = heading ?? target

  focusEl.setAttribute('tabindex', '-1')
  focusEl.focus({ preventScroll: true })
  focusEl.addEventListener('blur', () => focusEl.removeAttribute('tabindex'), { once: true })
}

export function scrollToSection(
  href,
  { behavior = 'smooth', updateHistory = true, focusTarget = false } = {},
) {
  const target = getScrollTarget(href)
  if (!target) return

  const anchorCorrection = href === '#impact' || href === '#organizations' ? 1 : 0
  const top = Math.ceil(getSectionTop(target) - getNavInset() + anchorCorrection)
  const complete = () => {
    if (focusTarget) focusSectionTarget(target)
  }

  window.scrollTo({ top: Math.max(0, top), behavior })

  if (focusTarget) {
    if (behavior === 'auto') {
      requestAnimationFrame(complete)
    } else {
      waitForScrollEnd(complete)
    }
  }

  if (updateHistory) {
    window.history.pushState(null, '', href)
  }
}
