import { skills } from '../data/skills.js'

export default function Skills() {
  return (
    <section id="skills" className="main style1 special techspace" aria-label="Technical skills">
      <div className="container">
        <div className="row gtr-150">
          <div className="col-6 col-12-medium">
            <ul className="skill-col">
              {skills.map((skill) => (
                <li className="skill" key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
