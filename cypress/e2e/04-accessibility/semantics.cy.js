describe('semantic accessibility', () => {
  beforeEach(() => cy.visitHome())

  it('uses landmark elements and keeps all visible content inside them', () => {
    cy.get('header#header').should('exist')
    cy.get('main').should('exist')
    cy.get('footer#contact').should('exist')
    cy.get('main section').should('have.length.greaterThan', 3)
  })

  it('gives every link a discernible accessible name', () => {
    cy.get('a').each(($link) => {
      const name = $link.attr('aria-label') || $link.text().trim() || $link.attr('title')
      expect(name, $link.attr('href')).to.be.a('string').and.not.be.empty
    })
  })

  it('has no duplicate IDs and every fragment target exists', () => {
    cy.get('[id]').then(($elements) => {
      const ids = [...$elements].map((element) => element.id)
      expect(new Set(ids).size).to.equal(ids.length)
    })

    cy.get('a[href^="#"]').each(($link) => {
      cy.get($link.attr('href')).should('exist')
    })
  })

  it('keeps decorative cloud animation hidden from assistive technology', () => {
    cy.get('.cloud-container').should('have.attr', 'aria-hidden', 'true')
  })

  it('labels the contact footer landmark', () => {
    cy.get('footer#contact').should('have.attr', 'aria-label', 'Contact')
  })

  it('keeps the footer focused on social links after moving email to Connect', () => {
    cy.get('#contact .footer-text').should('not.exist')
    cy.get('#contact a').should('have.length', 3)
  })

  it('marks the active section in the page navigation', () => {
    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav').should('be.visible')
    cy.get('#section-nav a[href="#about"]').should('have.attr', 'aria-current', 'page')
    cy.get('#section-nav a[href="#impact"]').click({ scrollBehavior: false })
    cy.get('#section-nav a[href="#impact"]').should('have.attr', 'aria-current', 'page')
    cy.get('#section-nav a[href="#about"]').should('not.have.attr', 'aria-current')
  })

  it('announces external links that open in a new tab', () => {
    cy.get('#portfolio .content-group a').first()
      .find('.sr-only')
      .should('contain.text', '(opens in new tab)')
    cy.get('footer a[href^="https://"]').first()
      .invoke('attr', 'aria-label')
      .should('match', /\(opens in new tab\)$/)
  })
})
