const WHITE = 'rgb(255, 255, 255)'
const SLATE_BUTTON = 'rgb(95, 113, 132)'
const BLUE_GRAY = 'rgb(109, 127, 146)'

const findRule = (window, matchingSelector) => {
  const visitRules = (rules) => {
    for (const rule of rules) {
      if (rule.selectorText?.split(',').map((selector) => selector.trim()).includes(matchingSelector)) {
        return rule
      }
      if (rule.cssRules) {
        const nestedMatch = visitRules(rule.cssRules)
        if (nestedMatch) return nestedMatch
      }
    }
    return undefined
  }

  for (const sheet of window.document.styleSheets) {
    try {
      const match = visitRules(sheet.cssRules)
      if (match) return match
    } catch {
      // Cross-origin font stylesheets are not inspectable and do not define app hover states.
    }
  }
  return undefined
}

describe('hover states', () => {
  beforeEach(() => cy.visitHome())

  it('defines a visible branded hover response for Embark', () => {
    cy.window().then((window) => {
      const rule = findRule(window, '#header .embark-btn:hover')
      expect(rule, 'Embark hover rule').to.exist
      expect(rule.style.background).to.include('255, 255, 255')
      expect(rule.style.color).to.equal(BLUE_GRAY)
      expect(rule.style.opacity).to.equal('0.8')
    })
    cy.get('.embark-btn').trigger('mouseover').should('be.visible')
  })

  it('keeps Embark hover styles ahead of generic header link and button hovers', () => {
    cy.window().then((window) => {
      const embarkRule = findRule(window, '#header .embark-btn:hover')
      const genericButtonHover = findRule(window, '#header .button:hover')
      const genericAnchorHover = findRule(window, '#header a:hover')
      const scopedButtonHover = findRule(window, '#header .button:not(.embark-btn):hover')
      const scopedAnchorHover = findRule(window, '#header a:not(.embark-btn):hover')

      expect(embarkRule, 'Embark hover rule').to.exist
      expect(scopedButtonHover, 'scoped header button hover rule').to.exist
      expect(scopedAnchorHover, 'scoped header anchor hover rule').to.exist
      expect(genericButtonHover, 'generic header button hover rule').to.not.exist
      expect(genericAnchorHover, 'generic header anchor hover rule').to.not.exist
      expect(embarkRule.style.background).to.include('255, 255, 255')
      expect(embarkRule.style.color).to.equal(BLUE_GRAY)
      expect(embarkRule.style.opacity).to.equal('0.8')
    })
  })

  it('defines a high-contrast hover response for recognition actions', () => {
    cy.window().then((window) => {
      const rule = findRule(window, '#recognition .content-group .button:hover')
      expect(rule, 'recognition button hover rule').to.exist
      expect(rule.style.backgroundColor).to.equal(SLATE_BUTTON)
      expect(rule.style.color).to.equal(WHITE)
    })
    cy.get('#recognition .content-group .button').first().trigger('mouseover').should('be.visible')
  })

  it('defines a high-contrast hover response for project actions', () => {
    cy.window().then((window) => {
      const rule = findRule(window, '.content-group .button:hover')
      expect(rule, 'project button hover rule').to.exist
      expect(rule.style.backgroundColor).to.equal(SLATE_BUTTON)
      expect(rule.style.color).to.equal(WHITE)
    })
    cy.get('#portfolio .content-group .button').first().trigger('mouseover').should('be.visible')
  })

  it('defines a high-contrast hover response for recommendation actions', () => {
    cy.window().then((window) => {
      const buttonRule = findRule(window, '.main.style2 .button:hover')
      const linkRule = findRule(window, '.main.style2 a:hover')
      expect(buttonRule, 'dark-section button hover rule').to.exist
      expect(linkRule, 'dark-section link hover rule').to.exist
      expect(buttonRule.style.backgroundColor).to.equal(BLUE_GRAY)
      expect(linkRule.style.color).to.equal(WHITE)
    })
    cy.get('#reviews .reviews-source .button').trigger('mouseover').should('be.visible')
  })

  it('keeps the Digital Bug-Out Bag action disabled on hover', () => {
    cy.window().then((window) => {
      const rule = findRule(window, '#portfolio .content-group .button:disabled:hover')
      expect(rule, 'disabled project button hover rule').to.exist
      expect(rule.style.backgroundColor).to.equal('rgb(245, 247, 248)')
      expect(rule.style.color).to.equal(BLUE_GRAY)
    })
    cy.contains('#portfolio article h4', 'Digital Bug-Out Bag').closest('article').find('button.button')
      .trigger('mouseover', { force: true })
      .should('be.disabled')
  })

  it('defines a visible footer-link hover color', () => {
    cy.window().then((window) => {
      const rule = findRule(window, '#contact a:hover')
      expect(rule, 'footer hover rule').to.exist
      expect(rule.style.color).to.equal(WHITE)
    })
    cy.get('#contact a').first().trigger('mouseover').should('be.visible')
  })

  it('defines a visible Connect action hover color', () => {
    cy.window().then((window) => {
      const rule = findRule(window, '#connect .connect-action .button:hover')
      expect(rule, 'Connect action hover rule').to.exist
      expect(rule.style.color).to.equal('rgb(255, 255, 255)')
    })
    cy.get('#connect a').trigger('mouseover').should('be.visible')
  })

  it('defines the Connect Email diagonal sweep animation', () => {
    cy.window().then((window) => {
      const rule = findRule(window, '#connect .connect-action .contact-arrival')
      expect(rule, 'Connect Email animation rule').to.exist
      expect(rule.style.animation).to.include('connect-email-sweep')
      expect(rule.style.background).to.include('linear-gradient')
      expect(rule.style.backgroundSize).to.equal('250% 250%')
    })
  })

  it('defines a visible section nav hover color', () => {
    cy.window().then((window) => {
      const rule = findRule(window, '.section-nav a:hover')
      expect(rule, 'section nav hover rule').to.exist
      expect(rule.style.color).to.equal('rgb(197, 211, 222)')
      const focusRule = findRule(window, '.section-nav a:focus-visible')
      expect(focusRule, 'section nav focus rule').to.exist
      expect(focusRule.style.outline).to.include('2px')
      expect(focusRule.style.outline).to.include('rgb(197, 211, 222)')
    })

    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav').should('be.visible')
    cy.get('#section-nav a[href="#impact"]').trigger('mouseover').should('be.visible')
  })

  it('defines cloud raindrop animation on hover', () => {
    cy.window().then((window) => {
      const rule = findRule(window, '.cloud-container:hover .drop1')
      expect(rule, 'cloud hover rule').to.exist
      expect(rule.style.animation).to.include('drop')
    })
    cy.get('.cloud-container').trigger('mouseover').should('be.visible')
  })
})
