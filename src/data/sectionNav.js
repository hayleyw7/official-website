export const sectionNavItems = [
  { label: 'About', href: '#about', target: '#about' },
  { label: 'Impact', href: '#impact', target: '#impact' },
  { label: 'Portfolio', href: '#portfolio', target: '#portfolio' },
  { label: 'Reviews', href: '#reviews', target: '#reviews' },
  { label: 'Recognition', href: '#recognition', target: '#recognition' },
  { label: 'Contact', href: '#contact', target: '#contact' },
]

export const sectionScrollTargets = Object.fromEntries(
  sectionNavItems.map(({ href, target }) => [href, target]),
)
