import ExternalLink from './ExternalLink.jsx'

export default function RecognitionCard({ item }) {
  return (
    <article className="col-6 col-12-medium">
      <h4>{item.title}</h4>
      <p className={item.role ? 'organization-role' : undefined}>{item.role || item.description}</p>
      {item.role && <p className="organization-description">{item.description}</p>}
      <ul className="actions special">
        <li>
          {item.comingSoon ? (
            <button type="button" className="button" disabled>
              {item.label}
            </button>
          ) : (
            <ExternalLink url={item.url} className="button">{item.label}</ExternalLink>
          )}
        </li>
      </ul>
    </article>
  )
}
