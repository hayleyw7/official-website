import { useEffect, useRef, useState } from 'react'
import { socialLinks } from '../data/socialLinks.js'
import ExternalLink from './ExternalLink.jsx'

export default function Footer({ contactNavigation }) {
  const iconsRef = useRef(null)
  const [animationRun, setAnimationRun] = useState(0)

  useEffect(() => {
    if (!contactNavigation || !iconsRef.current) return undefined

    const icons = iconsRef.current
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setAnimationRun(contactNavigation)
      observer.disconnect()
    }, { threshold: 0.75 })

    observer.observe(icons)
    return () => observer.disconnect()
  }, [contactNavigation])

  return (
    <footer id="contact" aria-label="Contact">
      <p className="footer-text">
        Reach out to connect.
      </p>
      <ul
        key={animationRun}
        ref={iconsRef}
        className={`icons${animationRun ? ' contact-arrival' : ''}`}
      >
        {socialLinks.map((link) => (
          <li key={link.label}>
            <ExternalLink
              url={link.url}
              className={`icon ${link.type} alt ${link.icon}`}
              label={link.label === 'Email' ? 'Send email' : `${link.label} profile`}
            >
              <span className="label">{link.label}</span>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </footer>
  )
}
