import { useEffect, useRef, useState } from 'react'
import { sectionNavItems } from '../data/sectionNav.js'
import { getActiveSectionHref } from '../utils/activeSection.js'
import { scrollToSection, setSectionNavHeight, measureSectionNavHeight } from '../utils/scrollToSection.js'

export default function SectionNav({ onContactNavigate }) {
  const [visible, setVisible] = useState(false)
  const [activeHref, setActiveHref] = useState('#about')
  const onContactNavigateRef = useRef(onContactNavigate)

  useEffect(() => {
    onContactNavigateRef.current = onContactNavigate
  }, [onContactNavigate])

  useEffect(() => {
    const header = document.querySelector('#header')
    const nav = document.querySelector('#section-nav')
    if (!header || !nav) return undefined

    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const updateVisibility = () => {
      const { bottom } = header.getBoundingClientRect()
      const navHeight = nav.getBoundingClientRect().height || Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--section-nav-height'),
      )
      setVisible(bottom <= Math.ceil(navHeight) + 1)
    }

    const updateActiveSection = () => {
      setActiveHref(getActiveSectionHref())
    }

    const updateNavHeight = () => {
      setSectionNavHeight(measureSectionNavHeight(nav))
    }

    const onResize = () => {
      updateVisibility()
      updateNavHeight()
      updateActiveSection()
    }

    const onScroll = () => {
      updateVisibility()
      updateActiveSection()
    }

    const onPopState = () => {
      const { hash } = window.location
      if (!hash) {
        window.scrollTo({ top: 0, behavior: 'auto' })
        updateActiveSection()
        return
      }

      scrollToSection(hash, { behavior: 'auto', updateHistory: false, focusTarget: true })
      if (hash === '#connect') onContactNavigateRef.current?.()
      updateActiveSection()
    }

    const restoreInitialHash = () => {
      const { hash } = window.location
      if (!hash) return

      scrollToSection(hash, { behavior: 'auto', updateHistory: false, focusTarget: true })
      if (hash === '#connect') onContactNavigateRef.current?.()
      updateActiveSection()
    }

    updateVisibility()
    updateNavHeight()
    updateActiveSection()
    requestAnimationFrame(() => requestAnimationFrame(restoreInitialHash))

    const navResizeObserver = new ResizeObserver(() => {
      updateNavHeight()
      updateActiveSection()
    })
    navResizeObserver.observe(nav)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('popstate', onPopState)
      navResizeObserver.disconnect()
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  const handleSectionClick = (event, href) => {
    event.preventDefault()
    scrollToSection(href, { focusTarget: true })
    setActiveHref(href)
    if (href === '#connect') onContactNavigateRef.current?.()
  }

  return (
    <nav
      id="section-nav"
      className="section-nav"
      aria-label="Page sections"
      hidden={!visible}
    >
      <ul>
        {sectionNavItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={activeHref === item.href ? 'page' : undefined}
              onClick={(event) => handleSectionClick(event, item.href)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
