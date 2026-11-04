const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
]

viewports.forEach(({ name, width, height }) => {
  describe(`small logo corners on ${name}`, () => {
    beforeEach(() => {
      cy.viewport(width, height)
      cy.visitHome()
    })

    ;['portfolio', 'recognition', 'organizations'].forEach((section) => {
      it(`matches the button radius for square logos in ${section}`, () => {
        cy.get(`#${section} .button`).first().invoke('css', 'border-radius').then((radius) => {
          expect(radius).to.equal('4px')
          cy.get(`#${section} .entity-icon:not(.entity-icon-round)`)
            .should('have.length.greaterThan', 0)
            .each(($logo) => {
              cy.wrap($logo).should('have.css', 'border-radius', radius)
                .and('have.css', 'object-fit', 'contain')
            })
        })
      })
    })

    it('uses the same subtle radius for logo fallbacks', () => {
      cy.get('.entity-icon-fallback').should('have.length.greaterThan', 0).each(($fallback) => {
        cy.wrap($fallback).should('have.css', 'border-radius', '4px')
      })
    })

    it('preserves intentionally circular logos', () => {
      cy.get('.entity-icon-round').should('have.length.greaterThan', 0).each(($logo) => {
        cy.wrap($logo).should('have.css', 'border-radius', '50%')
          .and('have.css', 'object-fit', 'cover')
      })
    })
  })
})
