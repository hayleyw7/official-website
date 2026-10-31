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
    cy.get('#portfolio .content-group article').should('have.length', 8).each(($article) => {
      cy.wrap($article).within(() => {
        cy.get('h4').invoke('text').should('not.be.empty')
        cy.get('p').invoke('text').should('have.length.greaterThan', 10)
        cy.get('.actions.special .button').should('have.length', 1).and('not.have.text', '')
      })
    })
  })

  it('uses the approved Affirming Access and Frankesso taglines', () => {
    cy.contains('#portfolio article h4', 'Affirming Access').closest('article')
      .find('p').should('have.text', 'Gotta go? Find safe restrooms near you!')
    cy.contains('#portfolio article h4', 'Frankesso').closest('article')
      .find('p').should('have.text', 'Need AI when offline? Meet this agent!')
  })

  it('keeps Flickmoji commented out of the rendered portfolio', () => {
    cy.contains('#portfolio article h4', 'Flickmoji').should('not.exist')
  })

  it('shows Whimsy Grove as coming soon with a disabled action', () => {
    cy.contains('#portfolio article h4', 'Whimsy Grove').closest('article').within(() => {
      cy.get('p').should('contain.text', 'Feeling whimsical? Create a magical grove!')
      cy.get('button.button').should('be.disabled').and('have.text', 'Soon')
    })
  })

  it('shows Digital Bug-Out Bag as coming soon with a disabled action', () => {
    cy.contains('#portfolio article h4', 'Digital Bug-Out Bag').closest('article').within(() => {
      cy.get('p').should('contain.text', 'Outage ahead? Pack your essentials!')
      cy.get('button.button')
        .should('be.disabled')
        .and('have.text', 'Soon')
        .and('have.css', 'color', 'rgb(95, 113, 132)')
        .and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .and('have.css', 'cursor', 'not-allowed')
        .and('have.css', 'opacity', '1')
    })

    cy.get('#portfolio a.button').first().then(($activeButton) => {
      cy.contains('#portfolio article h4', 'Digital Bug-Out Bag').closest('article').find('button.button')
        .should('have.css', 'font-family', $activeButton.css('font-family'))
        .and('have.css', 'font-size', $activeButton.css('font-size'))
        .and('have.css', 'height', $activeButton.css('height'))
    })
  })
})
