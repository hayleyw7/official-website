import { sections, skills } from '../../fixtures/contracts.js'

describe('header and introduction content', () => {
  beforeEach(() => cy.visitHome())

  it('identifies the owner and professional roles', () => {
    cy.get('h1').should('have.text', 'Hayley Witherell')
    cy.get('.tagline').should('contain.text', 'Software Engineer')
    cy.get('.tagline-detail')
      .should('contain.text', 'Organization Founder')
      .and('contain.text', 'Educational Volunteer')
  })

  it('exposes one primary page heading and the expected section headings', () => {
    cy.get('h1').should('have.length', 1)
    sections.forEach(({ id, heading }) => {
      cy.get(`#${id}`).contains('h2', heading).should('exist')
    })
  })

  it('renders all introduction paragraphs without truncating their core claims', () => {
    cy.get('#profile p').should('have.length', 3)
    cy.get('#profile').should('contain.text', '5+ years')
    cy.get('#profile').should('contain.text', 'production debugging')
    cy.get('#profile').should('contain.text', 'automation and AI tools')
  })

  it('shows the concise professional heading', () => {
    cy.get('#profile h2').should('have.text', 'Full-Stack Software Engineer')
  })

  it('renders the exact skill set once and in its intended order', () => {
    cy.get('#skills').should('have.attr', 'aria-label', 'Technical skills')
    cy.get('.skill').should('have.length', skills.length)
    cy.get('.skill').then(($skills) => {
      expect([...$skills].map((element) => element.textContent)).to.deep.equal(skills)
    })
  })

  it('gives the portrait a useful text alternative', () => {
    cy.get('img.avatar').should('have.attr', 'alt', 'Hayley Witherell')
  })
})
