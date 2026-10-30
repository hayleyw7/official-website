import { socialLinks, sectionFragmentHashes } from '../../fixtures/contracts.js'

describe('external links', () => {
  beforeEach(() => cy.visitHome())

  it('uses secure absolute destinations for every recognition action', () => {
    cy.get('#recognition .content-group a').should('have.length', 11).each(($link) => {
      cy.wrap($link).assertExternalLinkIsSafe()
    })
  })

  it('uses secure absolute destinations for every project action', () => {
    cy.get('#portfolio .content-group a').should('have.length', 7).each(($link) => {
      cy.wrap($link).assertExternalLinkIsSafe()
    })
  })

  it('uses the expected destination for every social action', () => {
    Object.entries(socialLinks).forEach(([label, href]) => {
      const ariaLabel = href.startsWith('mailto:') ? label : `${label} (opens in new tab)`
      cy.get(`#contact a[aria-label="${ariaLabel}"]`)
        .should('have.attr', 'href', href)
        .assertExternalLinkIsSafe()
    })
  })

  it('uses the deployed Decisionator URL and current Neurodiverse Hackers article', () => {
    cy.contains('#portfolio article h4', 'Decisionator').closest('article').find('a.button')
      .should('have.attr', 'href', 'https://decisionator.surge.sh/')

    cy.contains('#recognition article h4', 'Neurodiverse Hackers').closest('article').find('a.button')
      .should(
        'have.attr',
        'href',
        'https://ndhack.org/articles/building-an-inclusive-future',
      )
  })

  it('does not create blank, fragment-only, JavaScript, or insecure HTTP external links', () => {
    cy.get('a').each(($link) => {
      const href = $link.attr('href')
      expect(href, $link.text()).to.be.a('string').and.not.be.empty
      expect(href).not.to.match(/^javascript:/i)
      expect(href).not.to.match(/^http:\/\//i)
      if (href.startsWith('#')) expect(sectionFragmentHashes, href).to.include(href)
    })
  })
})
