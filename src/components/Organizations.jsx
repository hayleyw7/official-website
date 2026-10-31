import { organizations } from '../data/organizations.js'
import RecognitionCard from './RecognitionCard.jsx'

export default function Organizations() {
  return (
    <section id="organizations" className="main style2 special">
      <div className="container">
        <header className="major"><h2>Organizations</h2></header>
        <h3 className="sr-only">Organizations</h3>
        <div className="row gtr-150">
          {organizations.map((item) => (
            <RecognitionCard item={item} key={item.title} />
          ))}
        </div>
      </div>
    </section>
  )
}
