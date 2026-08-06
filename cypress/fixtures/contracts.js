export const sections = [
  { id: 'about', heading: 'Building Reliable, Usable Systems' },
  { id: 'impact', heading: 'Professional & Community Impact' },
  { id: 'portfolio', heading: 'Project Portfolio' },
  { id: 'recommendations', heading: 'Recommendations' },
  { id: 'recognition', heading: 'Public Recognition' },
]

export const sectionNav = [
  { label: 'About', href: '#about' },
  { label: 'Impact', href: '#impact' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Recommendations', href: '#recommendations' },
  { label: 'Recognition', href: '#recognition' },
  { label: 'Contact', href: '#contact' },
]

export const sectionFragmentHashes = sectionNav.map((item) => item.href)

export const skills = ['JavaScript', 'Ruby on Rails', 'React', 'HTML/CSS']

export const impactHeadings = [
  'Engineering Complex Workflows',
  'Leading Operations at Scale',
  'Mentorship Through Advocacy',
]

export const recommendations = {
  Autotroph: [
    'Engineering Manager',
    'Director of Design',
    'Director of Marketing',
    'Senior Customer Success Manager',
    'Cofounder & Managing Director',
    'Software Developer',
  ],
  'ID Business Solutions': [
    'DevOps Engineer',
    'Senior Software Engineer',
  ],
}

export const recognition = {
  'Awards & Honors': ['Volunteer of the Month', 'Arrows Making an Impact'],
  'Panels & Interviews': ['Code The Dream', 'Turing Alumni Showcase'],
  'Media & Publications': [
    'The Cognitive Edge',
    'Neurodiverse Hackers',
    'Sound Bytes',
    'Wikipedia',
    'GEN & Biotech News',
    'Seed to Sound',
    'The Rooster',
  ],
}

export const projects = {
  Games: ['Critterwave', 'Flickmoji'],
  'Web Apps': [
    'Limerickster',
    'Affirming Access',
    'Rancid Tomatillos',
    'Decisionator',
  ],
}

export const recommendationsUrl =
  'https://www.linkedin.com/in/hayleywitherell/details/recommendations/'

export const socialLinks = {
  'Twitter profile': 'https://twitter.com/hayleywitherell',
  'GitHub profile': 'https://github.com/hayleyw7',
  'LinkedIn profile': 'https://www.linkedin.com/in/hayleywitherell',
  'Send email': 'mailto:hayleywitherell@gmail.com',
}
