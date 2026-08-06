describe('browser-facing security contracts', () => {
  beforeEach(() => cy.visitHome())

  it('isolates every new browsing context from window.opener', () => {
    cy.get('a[target="_blank"]').each(($link) => {
      cy.wrap($link).should('have.attr', 'rel').and('match', /\bnoopener\b/).and('match', /\bnoreferrer\b/)
    })
    cy.get('a[target="_blank"]').should('have.length', 21)
  })

  it('does not inject inline event handlers or executable URLs', () => {
    cy.get('*').each(($element) => {
      const attributes = [...$element[0].attributes]
      attributes.forEach(({ name, value }) => {
        expect(name.toLowerCase()).not.to.match(/^on/)
        expect(value).not.to.match(/^\s*javascript:/i)
      })
    })
  })

  it('does not expose password, token, secret, or API-key fields in markup', () => {
    cy.document().then((document) => {
      const markup = document.documentElement.outerHTML
      expect(markup).not.to.match(/(api[_-]?key|access[_-]?token|client[_-]?secret|password\s*=)/i)
    })
  })
})
