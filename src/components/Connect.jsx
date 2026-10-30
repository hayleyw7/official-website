import { socialLinks } from '../data/socialLinks.js'
import ExternalLink from './ExternalLink.jsx'

const emailLink = socialLinks.find((link) => link.label === 'Email')

export default function Connect() {
  return (
    <section id="connect" className="main style1 special">
      <div className="container">
        <header className="major">
          <h2>Connect</h2>
          <ul className="actions special connect-action">
            <li><ExternalLink url={emailLink.url} className="button">Email</ExternalLink></li>
          </ul>
        </header>
      </div>
    </section>
  )
}
