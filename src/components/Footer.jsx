import { socialLinks } from '../data/socialLinks.js'
import ExternalLink from './ExternalLink.jsx'

export default function Footer() {
  return (
    <footer id="contact" aria-label="Contact">
      <ul
        className="icons"
      >
        {socialLinks.filter((link) => link.label !== 'Email').map((link) => (
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
