import { scrollToSection } from '../utils/scrollToSection.js'

export default function Header() {
  const scrollToIntroduction = (event) => {
    event.preventDefault()
    scrollToSection('#about', { updateHistory: false, focusTarget: true })
  }

  return (
    <header id="header">
      <div className="inner">
        <div className="cloud-container" aria-hidden="true">
          <span className="icon solid major fa-cloud" />
          <span className="icon solid major fa-tint drop1" />
          <span className="icon solid major fa-tint drop2" />
          <span className="icon solid major fa-tint drop3" />
        </div>
      </div>

      <h1>Hayley Witherell</h1>
      <p className="tagline">
        <span className="tagline-prefix">Full-Stack</span>{' '}
        <span className="tagline-role">Software Engineer</span>
      </p>
      <ul className="actions special embark-container">
        <li>
          <a href="#about" className="button embark-btn" onClick={scrollToIntroduction}>
            <strong>Embark</strong>
          </a>
        </li>
      </ul>
    </header>
  )
}
