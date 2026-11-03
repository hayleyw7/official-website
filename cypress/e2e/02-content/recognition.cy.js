import { recognition } from '../../fixtures/contracts.js'

describe('recognition content', () => {
  beforeEach(() => cy.visitHome())

  it('renders all groups and cards without omissions or duplicates', () => {
    cy.get('#recognition .content-group').should('have.length', Object.keys(recognition).length)

    Object.entries(recognition).forEach(([group, cards]) => {
      cy.contains('#recognition .content-group', group).within(() => {
        cy.get('article').should('have.length', cards.length)
        cy.get('h4').then(($headings) => {
          const titles = [...$headings].map((heading) => {
            const clone = heading.cloneNode(true)
            clone.querySelectorAll('.entity-icon-fallback').forEach((fallback) => fallback.remove())
            return clone.textContent
          })
          expect(titles).to.deep.equal(cards)
        })
      })
    })
  })

  it('pairs every card with descriptive copy and one action', () => {
    cy.get('#recognition .content-group article').should('have.length', 12).each(($article) => {
      cy.wrap($article).within(() => {
        cy.get('h4').invoke('text').should('not.be.empty')
        cy.get('p').invoke('text').should('have.length.greaterThan', 20)
        cy.get('a.button').should('have.length', 1).and('not.have.text', '')
      })
    })
  })

  it('presents the pending NDIT Wikipedia article alongside CBN in media', () => {
    cy.contains('#recognition .content-group', 'Media & Publications').within(() => {
      cy.contains('article h4', 'Wikipedia: ND In Tech').closest('article').within(() => {
        cy.get('p').should('have.text', 'Notes my role as founder')
        cy.get('img.entity-icon').should('have.attr', 'src', 'https://en.wikipedia.org/static/favicon/wikipedia.ico')
        cy.get('a.button').should('have.length', 1).and('contain.text', 'Article')
      })
    })
  })

  it('uses the approved concise media descriptions', () => {
    cy.contains('#recognition article h4', 'Neurodiverse Hackers').closest('article')
      .find('p').should('have.text', 'Highlights my ND In Tech work')
    cy.contains('#recognition article h4', 'Wikipedia: CBN').closest('article')
      .find('p').should('have.text', 'Notes my role as co-founder')
  })

  it('uses the approved book description and action', () => {
    cy.contains('#recognition article h4', 'The Cognitive Edge').closest('article').within(() => {
      cy.get('p').should('have.text', 'Features ND In Tech as a resource')
      cy.get('a.button').should('have.text', 'Book (opens in new tab)')
    })
  })

  it('uses the approved podcast description', () => {
    cy.contains('#recognition article h4', 'Seed to Sound').closest('article')
      .find('p').should('have.text', 'Building and running CBN')
    cy.contains('#recognition article h4', 'Seed to Sound').closest('article')
      .find('a.button').should('have.text', 'Episode (opens in new tab)')
  })

  it('gives the Code the Dream mark a tight light backing', () => {
    cy.contains('#recognition article h4', 'Volunteer of the Month')
      .find('img.entity-icon')
      .should('have.class', 'entity-icon-light-background')
      .and('have.css', 'background-color', 'rgb(255, 255, 255)')
  })

  it('uses the approved analytical testing description', () => {
    cy.contains('#recognition article h4', 'GEN Biotech News').closest('article')
      .find('p').should('have.text', 'Quotes my industry insight')
  })

  it('uses the approved CBN article description', () => {
    cy.contains('#recognition article h4', 'The Rooster').closest('article')
      .find('p').should('have.text', "CBN's impact on the industry")
  })

  it('renders the Autistic Techie organization mention accurately', () => {
    cy.contains('#recognition article h4', 'Autistic Techie').closest('article')
      .find('p').should('have.text', 'Recommendation of ND In Tech')
    cy.contains('#recognition article h4', 'Autistic Techie').closest('article')
      .find('a.button').should('have.text', 'Episode (opens in new tab)')
      .and('have.attr', 'href', 'https://www.autistic-techie.com/coding-interviews-adhd-and-staying-focused-with-mihai-todor')
  })
})
