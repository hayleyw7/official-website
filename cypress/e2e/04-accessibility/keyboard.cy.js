describe('keyboard accessibility', () => {
  beforeEach(() => cy.visitHome())

  it('reaches interactive elements in visual document order', () => {
    const projectTitles = [
      'Critterwave',
      'Limerickster',
      'Affirming Access',
      'Rancid Tomatillos',
      'Decisionator',
    ]
    const recognitionTitles = [
      'Volunteer of the Month',
      'Arrows Making an Impact',
      'Code The Dream',
      'Turing Alumni Showcase',
      'The Cognitive Edge',
      'Neurodiverse Hackers',
      'Sound Bytes',
      'Wikipedia',
      'GEN & Biotech News',
      'Seed to Sound',
      'The Rooster',
    ]
    const expectedOrder = [
      'Embark',
      'About',
      'Impact',
      'Portfolio',
      'Recommendations',
      'Recognition',
      'Contact',
      ...projectTitles,
      'View recommendations on LinkedIn (opens in new tab)',
      ...recognitionTitles,
      'Twitter profile (opens in new tab)',
      'GitHub profile (opens in new tab)',
      'LinkedIn profile (opens in new tab)',
      'Send email',
    ]

    cy.get('a[href]').then(($links) => {
      const actualOrder = [...$links].map((link) => (
        link.getAttribute('aria-label')
        || link.closest('article')?.querySelector('h4')?.textContent
        || link.textContent.trim()
      ))
      expect(actualOrder).to.deep.equal(expectedOrder)
    })

    cy.get('a[href]').each(($link) => {
      expect($link[0].tabIndex, `${$link.attr('href')} tab index`).to.equal(0)
    })
  })

  it('activates Embark with the keyboard', () => {
    cy.get('.embark-btn').focus().type('{enter}')
    cy.location('hash').should('eq', '')
    cy.window().its('scrollY').should('be.greaterThan', 0)
  })
})
