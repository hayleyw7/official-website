export default function RecommendationCard({ item, index }) {
  return (
    <article className={`col-6 col-12-medium review-card${item.featured ? ' review-card-featured' : ' review-card-regular'}`} data-review-index={index}>
      <p className={`review-quote${item.featured ? ' review-quote-featured' : ''}`}>
        {item.featured && <span className="review-quote-mark" aria-hidden="true">“</span>}
        {item.featured ? '' : '"'}{item.quote}{item.featured ? <span className="review-quote-close">”</span> : '"'} {item.featured ? <strong>&mdash; {item.title}</strong> : <>&mdash; <strong>{item.title}</strong></>}
      </p>
    </article>
  )
}
