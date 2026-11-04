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
          expect([...$headings].map((heading) => heading.innerText.trim())).to.deep.equal(cards)
        })
      })
    })
  })

  it('pairs every project card with descriptive copy and one action', () => {
    cy.get('#portfolio .content-group article').should('have.length', 7).each(($article) => {
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

  it('uses the approved Critterwave and Whimsy Grove taglines', () => {
    cy.contains('#portfolio article h4', 'Critterwave').closest('article')
      .find('p').should('have.text', 'Want to battle? Defeat waves of critters!')
    cy.contains('#portfolio article h4', 'Whimsy Grove').closest('article')
      .find('p').should('have.text', 'Feeling whimsical? Create a dreamscape!')
  })

  it('keeps Flickmoji commented out of the rendered portfolio', () => {
    cy.contains('#portfolio article h4', 'Flickmoji').should('not.exist')
  })

  it('shows Whimsy Grove as coming soon with a disabled action', () => {
    cy.contains('#portfolio article h4', 'Whimsy Grove').closest('article').within(() => {
      cy.get('p').should('contain.text', 'Feeling whimsical? Create a dreamscape!')
      cy.get('button.button').should('be.disabled').and('have.text', 'Soon')
    })
  })

  it('temporarily hides Digital Bug-Out Bag', () => {
    cy.contains('#portfolio article h4', 'Digital Bug-Out Bag').should('not.exist')
  })

  it('uses the approved centered Decisionator favicon', () => {
    cy.contains('#portfolio article h4', 'Decisionator').find('img.entity-icon')
      .should('be.visible')
      .and(($img) => {
        expect($img[0].complete).to.equal(true)
        expect($img[0].naturalWidth).to.be.greaterThan(0)
      })
      .should('have.attr', 'src', '/images/decisionator-favicon.svg')

    cy.request('/images/decisionator-favicon.svg').then(({ body }) => {
      const doc = new DOMParser().parseFromString(body, 'image/svg+xml')
      expect(doc.querySelector('parsererror')).to.equal(null)
      expect(doc.documentElement.getAttribute('viewBox')).to.equal('0 0 32 32')

      const face = doc.querySelectorAll('rect')[1]
      expect(Number(face.getAttribute('x')) + Number(face.getAttribute('width')) / 2).to.equal(16)
      expect(Number(face.getAttribute('y')) + Number(face.getAttribute('height')) / 2).to.equal(16)

      const centers = [...doc.querySelectorAll('circle')].map((circle) => [
        Number(circle.getAttribute('cx')),
        Number(circle.getAttribute('cy')),
      ])
      expect(centers).to.deep.equal([[11, 11], [21, 21], [16, 16], [21, 11], [11, 21]])
    })
  })
})
