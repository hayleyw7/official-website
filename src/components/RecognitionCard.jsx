import ExternalLink from './ExternalLink.jsx'

export default function RecognitionCard({ item }) {
  return (
    <article className="col-6 col-12-medium">
      <h4 className="card-title">{item.iconUrl && <img className={`entity-icon${item.roundLogo ? ' entity-icon-round' : ''}${item.iconSize ? ` ${item.iconSize}` : ''}${item.darkLogo ? ' entity-icon-dark' : ''}`} src={item.iconUrl} alt="" aria-hidden="true" onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.nextElementSibling.hidden = false }} />}{item.iconFallback && <span className="entity-icon-fallback" aria-hidden="true" hidden={Boolean(item.iconUrl)}>{item.iconFallback}</span>}{item.title}</h4>
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
