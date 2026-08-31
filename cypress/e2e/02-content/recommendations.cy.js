import { recommendations, recommendationsUrl } from '../../fixtures/contracts.js'

const recommendationCount = Object.values(recommendations).flat().length

describe('reviews content', () => {
  beforeEach(() => cy.visitHome())

  it('renders the recommendation groups and quotes without omissions or duplicates', () => {
    cy.get('#reviews .content-group').should('have.length', Object.keys(recommendations).length)

    Object.entries(recommendations).forEach(([group, titles]) => {
      cy.contains('#reviews .content-group', group).within(() => {
        cy.get('article').should('have.length', titles.length)
        cy.get('.review-quote').then(($quotes) => {
          titles.forEach((title, index) => {
            expect($quotes.eq(index).text()).to.include(`— ${title}`)
          })
        })
      })
    })
  })

  it('wraps each quote in quotation marks without blockquote styling', () => {
    cy.get('#reviews .review-quote').should('have.length', recommendationCount).each(($quote) => {
      cy.wrap($quote).invoke('text').should('match', /^".+" — .+$/)
      cy.wrap($quote).should('have.prop', 'tagName', 'P')
    })
    cy.get('#reviews blockquote').should('not.exist')
  })

  it('links to the LinkedIn recommendations page from the section header', () => {
    cy.get('#reviews .reviews-source .button')
      .should('have.length', 1)
      .and('have.attr', 'href', recommendationsUrl)
      .and('have.attr', 'aria-label', 'View reviews on LinkedIn (opens in new tab)')
      .and('contain.text', 'View on LinkedIn')
      .assertExternalLinkIsSafe()
  })
})
