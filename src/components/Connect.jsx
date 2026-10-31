import { socialLinks } from '../data/socialLinks.js'
import ExternalLink from './ExternalLink.jsx'

const emailLink = socialLinks.find((link) => link.label === 'Email')

export default function Connect({ contactNavigation }) {
  return (
    <section id="connect" className="main style1 special">
      <div className="container">
        <header className="major">
          <h2>Connect</h2>
          <ul className="actions special connect-action">
            <li><ExternalLink key={contactNavigation} url={emailLink.url} className={`button${contactNavigation ? ' contact-arrival' : ''}`}><span className="email-label">Email</span></ExternalLink></li>
          </ul>
        </header>
      </div>
    </section>
  )
}
