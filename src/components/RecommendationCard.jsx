export default function RecommendationCard({ item }) {
  return (
    <article className="col-6 col-12-medium">
      <p className="review-quote">
        "{item.quote}" &mdash; <strong>{item.title}</strong>
      </p>
    </article>
  )
}
