import { projects } from '../../fixtures/contracts.js'

describe('projects content', () => {
  beforeEach(() => cy.visitHome())

  it('renders the project groups and cards without omissions or duplicates', () => {
    cy.get('#portfolio .content-group').should('have.length', Object.keys(projects).length)

    Object.entries(projects).forEach(([group, cards]) => {
      cy.get('#portfolio .content-group').contains('h3', group).should('exist')
      cy.contains('#portfolio .content-group', group).within(() => {
        cy.get('article').should('have.length', cards.length)
        cy.get('h4').then(($headings) => {
          expect([...$headings].map((heading) => heading.textContent)).to.deep.equal(cards)
        })
      })
    })
  })

  it('pairs every project card with descriptive copy and one action', () => {
    cy.get('#portfolio .content-group article').should('have.length', 6).each(($article) => {
      cy.wrap($article).within(() => {
        cy.get('h4').invoke('text').should('not.be.empty')
        cy.get('p').invoke('text').should('have.length.greaterThan', 10)
        cy.get('.actions.special .button').should('have.length', 1).and('not.have.text', '')
      })
    })
  })

  it('shows Flickmoji as coming soon with a disabled action', () => {
    cy.contains('#portfolio article h4', 'Flickmoji').closest('article').within(() => {
      cy.get('p').should('contain.text', 'Movie trivia aficionado? Prove it!')
      cy.get('button.button')
        .should('be.disabled')
        .and('have.text', 'Soon')
        .and('have.css', 'color', 'rgb(95, 113, 132)')
        .and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .and('have.css', 'cursor', 'not-allowed')
        .and('have.css', 'opacity', '1')
    })

    cy.get('#portfolio a.button').first().then(($activeButton) => {
      cy.contains('#portfolio article h4', 'Flickmoji').closest('article').find('button.button')
        .should('have.css', 'font-family', $activeButton.css('font-family'))
        .and('have.css', 'font-size', $activeButton.css('font-size'))
        .and('have.css', 'height', $activeButton.css('height'))
    })
  })
})
