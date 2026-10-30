import { socialLinks } from '../data/socialLinks.js'
import ExternalLink from './ExternalLink.jsx'

const emailLink = socialLinks.find((link) => link.label === 'Email')

export default function Connect() {
  return (
    <section id="connect" className="main style1 special">
      <div className="container">
        <header className="major"><h2>Connect</h2></header>
        <ExternalLink url={emailLink.url} className="button">Email Me</ExternalLink>
      </div>
    </section>
  )
}
