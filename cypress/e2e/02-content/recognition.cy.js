import { recognition } from '../../fixtures/contracts.js'

describe('recognition content', () => {
  beforeEach(() => cy.visitHome())

  it('renders all groups and cards without omissions or duplicates', () => {
    cy.get('#recognition .content-group').should('have.length', Object.keys(recognition).length)

    Object.entries(recognition).forEach(([group, cards]) => {
      cy.contains('#recognition .content-group', group).within(() => {
        cy.get('article').should('have.length', cards.length)
        cy.get('h4').then(($headings) => {
          expect([...$headings].map((heading) => heading.textContent)).to.deep.equal(cards)
        })
      })
    })
  })

  it('pairs every card with descriptive copy and one action', () => {
    cy.get('#recognition .content-group article').should('have.length', 11).each(($article) => {
      cy.wrap($article).within(() => {
        cy.get('h4').invoke('text').should('not.be.empty')
        cy.get('p').invoke('text').should('have.length.greaterThan', 20)
        cy.get('a.button').should('have.length', 1).and('not.have.text', '')
      })
    })
  })
})
