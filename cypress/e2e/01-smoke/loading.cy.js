describe('loading behavior', () => {
  it('starts in preload mode and removes it after the startup delay', () => {
    cy.visit('/')

    cy.get('body').should('have.class', 'is-preload')
    cy.wait(100)
    cy.get('body').should('not.have.class', 'is-preload')
  })

  it('keeps meaningful text available while the portrait is delayed', () => {
    cy.intercept('GET', '/images/me.png', (request) => {
      request.on('response', (response) => response.setDelay(500))
    }).as('portrait')

    cy.visit('/')
    cy.contains('h1', 'Hayley Witherell').should('be.visible')
    cy.contains('h2', 'Human-Centered Engineering').should('be.visible')
    cy.wait('@portrait').its('response.statusCode').should('be.oneOf', [200, 304])
  })

  it('loads the portrait successfully with useful dimensions', () => {
    cy.visitHome()

    cy.get('img.avatar')
      .should('be.visible')
      .and('have.attr', 'src', '/images/me.png')
      .should(($image) => {
        expect($image[0].complete, 'image loaded').to.equal(true)
        expect($image[0].naturalWidth).to.be.greaterThan(0)
        expect($image[0].naturalHeight).to.be.greaterThan(0)
      })
  })
})
