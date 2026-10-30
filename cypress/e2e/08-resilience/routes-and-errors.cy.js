describe('sad paths and runtime resilience', () => {
  it('does not emit uncaught errors, unhandled rejections, or console errors', () => {
    const uncaught = cy.stub().as('uncaught')
    const rejections = cy.stub().as('rejections')

    cy.visit('/', {
      onBeforeLoad(win) {
        win.addEventListener('error', uncaught)
        win.addEventListener('unhandledrejection', rejections)
      },
    })
    cy.scrollTo('bottom')
    cy.get('@uncaught').should('not.have.been.called')
    cy.get('@rejections').should('not.have.been.called')
  })

  it('renders the SPA shell for an unknown route instead of a server error', () => {
    cy.visit('/route-that-does-not-exist', { failOnStatusCode: false })
    cy.contains('h1', 'Hayley Witherell').should('be.visible')
    cy.get('body').should('not.contain.text', '404 Not Found')
  })

  it('keeps the application usable if the portrait request fails', () => {
    cy.intercept('GET', '/images/me.png', { statusCode: 404 }).as('missingPortrait')
    cy.visit('/')
    cy.wait('@missingPortrait')
    cy.contains('h2', 'Full-Stack Software Engineer').should('be.visible')
    cy.get('.embark-btn').should('be.visible')
    cy.get('#contact a').should('have.length', 4)
  })
})
