describe('color and typography contracts', () => {
  beforeEach(() => cy.visitHome())

  it('uses the intended base colors for light and dark sections', () => {
    cy.get('body').should('have.css', 'background-color', 'rgb(255, 255, 255)')
    cy.get('#profile').should('have.css', 'background-color', 'rgb(255, 255, 255)')
    cy.get('#impact').should('have.css', 'background-color', 'rgb(51, 60, 68)')
    cy.get('#impact h2').should('have.css', 'color', 'rgb(157, 177, 192)')
    cy.get('#portfolio').should('have.css', 'background-color', 'rgb(255, 255, 255)')
    cy.get('#portfolio h2').should('have.css', 'color', 'rgb(109, 127, 146)')
    cy.get('#portfolio h3').should('have.css', 'color', 'rgb(51, 60, 68)')
    cy.get('#portfolio h4').should('have.css', 'color', 'rgb(43, 43, 43)')
    cy.get('#portfolio .button').first().should('have.css', 'color', 'rgb(95, 113, 132)')
    cy.get('#recommendations').should('have.css', 'background-color', 'rgb(51, 60, 68)')
    cy.get('#recommendations h2').should('have.css', 'color', 'rgb(157, 177, 192)')
    cy.get('#recommendations h3').should('have.css', 'color', 'rgb(197, 211, 222)')
    cy.get('#recommendations strong').first().should('have.css', 'color', 'rgb(255, 255, 255)')
    cy.get('#recommendations .button').first().should('have.css', 'color', 'rgb(255, 255, 255)')
    cy.get('#recognition').should('have.css', 'background-color', 'rgb(255, 255, 255)')
    cy.get('#recognition h2').should('have.css', 'color', 'rgb(109, 127, 146)')
    cy.get('#recognition h3').should('have.css', 'color', 'rgb(51, 60, 68)')
  })

  it('uses the intended skill panel palette and monospace type', () => {
    cy.get('.skill-col')
      .should('have.css', 'background-color', 'rgb(245, 247, 248)')
      .and('have.css', 'color', 'rgb(38, 53, 71)')
      .and('have.css', 'border-top-color', 'rgb(109, 127, 146)')
      .and('have.css', 'font-family')
      .and('match', /Courier New/)
  })

  it('preserves the branded gradients and readable header text', () => {
    cy.get('#header')
      .should('have.css', 'background-image')
      .and('include', 'linear-gradient')
    cy.get('#contact')
      .should('have.css', 'background-image')
      .and('include', 'linear-gradient')
    cy.get('#header h1').should('have.css', 'color', 'rgb(255, 255, 255)')
  })

  it('self-hosts the body font without requesting Google Fonts', () => {
    cy.get('body')
      .should('be.visible')
      .and('have.css', 'font-family')
      .and('match', /Source Sans Pro/)
      .and('match', /sans-serif/)

    cy.window().then((win) => {
      const requests = win.performance.getEntriesByType('resource').map((entry) => entry.name)
      expect(requests.some((name) => name.includes('fonts.googleapis.com'))).to.equal(false)
      expect(requests.some((name) => name.includes('fonts.gstatic.com'))).to.equal(false)
    })
  })
})
