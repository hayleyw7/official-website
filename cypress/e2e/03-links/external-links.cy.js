import { socialLinks, sectionFragmentHashes } from '../../fixtures/contracts.js'

describe('external links', () => {
  beforeEach(() => cy.visitHome())

  it('uses secure absolute destinations for every recognition action', () => {
    cy.get('#recognition .content-group a').should('have.length', 11).each(($link) => {
      cy.wrap($link).assertExternalLinkIsSafe()
    })
  })

  it('renders the community organization website actions', () => {
    cy.contains('#organizations article h4', 'Neurodiversity In Tech')
      .closest('article').find('a.button')
      .should('contain.text', 'Visit')
      .should('have.attr', 'href', 'https://nd-in-tech.org/')
    cy.contains('#organizations article h4', 'Colorado Badged Network')
      .closest('article').find('a.button')
      .should('contain.text', 'Visit')
      .should('have.attr', 'href', 'https://www.coloradobadgednetwork.com/')
  })

  it('uses secure absolute destinations for every project action', () => {
    cy.get('#portfolio .content-group a').should('have.length', 6).each(($link) => {
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

  it('uses the current St. Ursula alumnae article URL', () => {
    cy.contains('#recognition article h4', 'Arrows Making an Impact')
      .closest('article').find('a.button')
      .should(
        'have.attr',
        'href',
        'https://www.toledosua.org/community/alumnae/news/post/~board/alumnae-news/post/making-an-impact-hayley-witherell',
      )
  })

  it('uses the archived Rooster article URL', () => {
    cy.contains('#recognition article h4', 'The Rooster')
      .closest('article').find('a.button')
      .should(
        'have.attr',
        'href',
        'https://web.archive.org/web/20260307182938/https://therooster.com/articles/despite-the-rules-one-cannabis-industry-group-still-thrives-on-facebook/',
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
