import { useEffect, useRef, useState } from 'react'
import { sectionNavItems } from '../data/sectionNav.js'
import { getActiveSectionHref } from '../utils/activeSection.js'
import {
  scrollToSection,
  setSectionNavHeight,
  measureSectionNavHeight,
  getNavInset,
} from '../utils/scrollToSection.js'

export default function SectionNav({ onContactNavigate }) {
  const [visible, setVisible] = useState(false)
  const [activeHref, setActiveHref] = useState('#about')
  const onContactNavigateRef = useRef(onContactNavigate)
  const explicitSelectionRef = useRef(null)
  const scrollDirectionRef = useRef('down')
  const previousScrollYRef = useRef(0)
  const wasAtPageBottomRef = useRef(false)

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

    const updateActiveSection = (scrollDirection = 'down', justLeftPageBottom = false) => {
      setActiveHref(getActiveSectionHref(scrollDirection, justLeftPageBottom))
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

      const currentScrollY = window.scrollY
      const atPageBottom = currentScrollY + window.innerHeight
        >= document.documentElement.scrollHeight - 2
      const justLeftPageBottom = wasAtPageBottomRef.current && !atPageBottom
      if (currentScrollY !== previousScrollYRef.current) {
        scrollDirectionRef.current = currentScrollY < previousScrollYRef.current ? 'up' : 'down'
        previousScrollYRef.current = currentScrollY
      }
      wasAtPageBottomRef.current = atPageBottom

      const explicitSelection = explicitSelectionRef.current
      if (explicitSelection) {
        if (!explicitSelection.settled) return
        if (Math.abs(window.scrollY - explicitSelection.scrollY) > 1) {
          explicitSelectionRef.current = null
        } else {
          return
        }
      }

      updateActiveSection(scrollDirectionRef.current, justLeftPageBottom)
    }

    const onManualScrollIntent = (event) => {
      if (event.type === 'wheel' && event.deltaY) {
        scrollDirectionRef.current = event.deltaY < 0 ? 'up' : 'down'
      }
      explicitSelectionRef.current = null
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
    window.addEventListener('wheel', onManualScrollIntent, { passive: true })
    window.addEventListener('touchstart', onManualScrollIntent, { passive: true })
    window.addEventListener('pointerdown', onManualScrollIntent, { passive: true })
    window.addEventListener('keydown', onManualScrollIntent)
    window.addEventListener('resize', onResize)
    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onManualScrollIntent)
      window.removeEventListener('touchstart', onManualScrollIntent)
      window.removeEventListener('pointerdown', onManualScrollIntent)
      window.removeEventListener('keydown', onManualScrollIntent)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('popstate', onPopState)
      navResizeObserver.disconnect()
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  const handleSectionClick = (event, href) => {
    event.preventDefault()
    const target = document.querySelector(href)
    const alreadyAtTarget = target
      && Math.abs(target.getBoundingClientRect().top - getNavInset()) <= 2
    explicitSelectionRef.current = { href, settled: false, scrollY: window.scrollY }
    scrollToSection(href, { focusTarget: true })
    setActiveHref(href)

    const settleSelection = () => {
      const selection = explicitSelectionRef.current
      if (!selection || selection.href !== href) return
      explicitSelectionRef.current = { ...selection, settled: true, scrollY: window.scrollY }
      setActiveHref(href)
      if (href === '#connect') onContactNavigateRef.current?.()
    }

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', settleSelection, { once: true })
      if (alreadyAtTarget) window.requestAnimationFrame(settleSelection)
    } else {
      window.setTimeout(settleSelection, 1000)
    }

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
