describe('motion preferences', () => {
  it('uses smooth scrolling in the default preference', () => {
    cy.visitHome()
    cy.get('html').should('have.css', 'scroll-behavior', 'smooth')
  })

  it('disables smooth scrolling and long transitions for reduced motion', () => {
    cy.then(() => Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] },
    }))
    cy.visitHome()

    cy.get('html').should('have.css', 'scroll-behavior', 'auto')
    cy.get('.embark-btn').should(($button) => {
      const durations = getComputedStyle($button[0]).transitionDuration
        .split(',')
        .map((duration) => Number.parseFloat(duration))
      expect(durations.every((duration) => duration <= 0.00001)).to.equal(true)
    })
  })

  it('keeps the Connect action transition reduced-motion safe', () => {
    cy.then(() => Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] },
    }))
    cy.visitHome()

    cy.get('#header').then(($header) => {
      cy.window().then((win) => {
        win.scrollTo(0, Math.ceil($header.outerHeight()) + 1)
      })
    })
    cy.get('#section-nav').should('be.visible')
      .find('a[href="#connect"]').click({ scrollBehavior: false })
    cy.get('#connect a').should(($link) => {
      const { transitionDuration } = getComputedStyle($link[0])
      expect(transitionDuration.split(',').every((duration) => Number.parseFloat(duration) <= 0.00001)).to.equal(true)
    })
  })

  afterEach(() => {
    cy.then(() => Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: { features: [] },
    }))
  })
})
