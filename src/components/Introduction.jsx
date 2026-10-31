import Skills from './Skills.jsx'

export default function Introduction() {
  return (
    <section id="about">
      <section id="profile" className="main style1 main-top">
        <div className="container">
          <div className="row gtr-150 main-content-container-parent">
            <div className="col-6 col-12-medium main-content-container">
              <header className="major main-content">
                <h2><span className="intro-title-prefix">Usability-Centered</span>{' '}<span className="intro-title-role">Engineering</span></h2>
              </header>
              <p>Full-stack software engineer building features in JavaScript and Ruby on Rails across frontend and backend systems.</p>
              <p>Works across feature development, internal tools, and production debugging, including resolving issues that impact real users. Breaks down complex problems into clear, maintainable solutions.</p>
              <p className="last-intro-para">Emphasizes thoughtful, practical UI patterns, documentation, and testing practices. Uses automation and AI tools to improve developer workflows and code quality.</p>
            </div>
            <div className="col-6 col-12-medium imp-medium">
              <span className="image fit avatar-container">
                <img className="avatar" src="/images/me.png" alt="Hayley Witherell" />
              </span>
            </div>
          </div>
        </div>
      </section>
      <Skills />
    </section>
  )
}
