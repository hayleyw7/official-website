import { recommendationGroups, recommendationsUrl } from '../data/recommendations.js'
import ExternalLink from './ExternalLink.jsx'
import RecommendationCard from './RecommendationCard.jsx'

export default function Recommendations() {
  return (
    <section id="reviews" className="main style1 special">
      <div className="container">
        <header className="major">
          <h2>Reviews</h2>
          <ul className="actions special reviews-source">
            <li>
              <ExternalLink
                url={recommendationsUrl}
                className="button"
                label="View reviews on LinkedIn"
              >
                View on LinkedIn
              </ExternalLink>
            </li>
          </ul>
        </header>
        {recommendationGroups.map((group) => (
          <section className="content-group" key={group.title}>
            <h3 className="media-title">{group.title}</h3>
            <div className={`reviews-layout${group.items.length === 1 ? ' aln-center' : ''}`}>
              <div className="reviews-column reviews-column-left">
                {group.items.filter((_, index) => group.items.length > 4 ? [0, 3, 4].includes(index) : index % 2 === 0).map((item) => (
                  <RecommendationCard item={item} index={group.items.indexOf(item)} key={item.title} />
                ))}
              </div>
              <div className="reviews-column reviews-column-right">
                {group.items.filter((_, index) => group.items.length > 4 ? [1, 2, 5].includes(index) : index % 2 === 1).map((item) => (
                  <RecommendationCard item={item} index={group.items.indexOf(item)} key={item.title} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
