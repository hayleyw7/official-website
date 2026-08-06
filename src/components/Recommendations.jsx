import { recommendationGroups, recommendationsUrl } from '../data/recommendations.js'
import ExternalLink from './ExternalLink.jsx'
import RecommendationCard from './RecommendationCard.jsx'

export default function Recommendations() {
  return (
    <section id="recommendations" className="main style2 special">
      <div className="container">
        <header className="major">
          <h2>Recommendations</h2>
          <ul className="actions special recommendations-source">
            <li>
              <ExternalLink
                url={recommendationsUrl}
                className="button"
                label="View recommendations on LinkedIn"
              >
                View on LinkedIn
              </ExternalLink>
            </li>
          </ul>
        </header>
        {recommendationGroups.map((group) => (
          <section className="content-group" key={group.title}>
            <h3 className="media-title">{group.title}</h3>
            <div className={`row gtr-150 gtr-uniform${group.items.length === 1 ? ' aln-center' : ''}`}>
              {group.items.map((item) => (
                <RecommendationCard item={item} key={item.title} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
