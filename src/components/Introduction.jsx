import Skills from './Skills.jsx'

export default function Introduction() {
  return (
    <section id="about">
      <section id="profile" className="main style1 main-top">
        <div className="container">
          <div className="row gtr-150 main-content-container-parent">
            <div className="col-6 col-12-medium main-content-container">
              <header className="major main-content">
                <h2><span className="intro-title-prefix">Usability-Focused</span>{' '}<span className="intro-title-role">Engineering</span></h2>
              </header>
              <p>Full-stack software engineer turning complex problems into thoughtful, easy-to-use experiences.</p>
              <p>Builds features and internal tools, untangles production bugs, and makes workflows a little smoother for the people using them. Cares about accessible interfaces, reliable code, and the details that make software feel good to use.</p>
              <p className="last-intro-para">Always diving into new AI models and tools, building multi-agent workflows, automations, and AI-powered apps that keep working while the world sleeps. Conjures up side projects, from practical problem-solvers to playful experiments, and turns ideas into little realities. Exhibited artist, published writer, and community builder.</p>
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
