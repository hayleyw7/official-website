describe('initial rendering', () => {
  it('renders every top-level region in document order', () => {
    cy.visitHome()

    cy.get('body > #root').should('exist')
    cy.get('#root').children().then(($children) => {
      expect([...$children].map((element) => element.tagName)).to.deep.equal([
        'HEADER',
        'NAV',
        'MAIN',
        'FOOTER',
      ])
    })
    cy.get('header#header').should('be.visible')
    cy.get('main').should('be.visible')
    cy.get('footer#contact').should('be.visible')
  })

  it('renders the main sections in page order', () => {
    cy.visitHome()

    cy.get('main > section').should(($sections) => {
      expect([...$sections].map((section) => section.id)).to.deep.equal([
        'about',
        'impact',
        'portfolio',
        'recommendations',
        'recognition',
      ])
    })
  })

  it('does not render an error page, empty root, or accidental placeholder copy', () => {
    cy.visitHome()

    cy.get('#root').children().should('have.length', 4)
    cy.get('body').should('not.contain.text', 'undefined')
    cy.get('body').should('not.contain.text', '[object Object]')
    cy.get('body').should('not.contain.text', 'Lorem ipsum')
  })
})
