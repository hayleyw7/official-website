describe('tablet layout', () => {
  beforeEach(() => {
    cy.viewport(768, 1024)
    cy.visitHome()
  })

  const revealSectionNav = () => {
    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, Math.ceil($header.outerHeight()) + 1))
    })
    cy.get('#section-nav').should('be.visible')
  }

  it('stacks medium breakpoint columns and centers the portrait', () => {
    cy.get('.main-content-container').then(($column) => {
      expect($column[0].getBoundingClientRect().width).to.equal(
        $column[0].parentElement.getBoundingClientRect().width,
      )
    })
    cy.get('.imp-medium').then(($column) => {
      expect($column[0].getBoundingClientRect().width).to.equal(
        $column[0].parentElement.getBoundingClientRect().width,
      )
    })
    cy.get('.avatar-container').should('have.css', 'justify-content', 'center')
    cy.get('img.avatar').should(($avatar) => {
      const bounds = $avatar[0].getBoundingClientRect()
      const heading = $avatar[0].closest('#profile').querySelector('h2').getBoundingClientRect()
      const avatarCenter = bounds.left + bounds.width / 2
      const headingCenter = heading.left + heading.width / 2
      expect(avatarCenter).to.be.closeTo(headingCenter, 2)
      expect(bounds.width).to.be.closeTo(bounds.height, 1)
      expect(getComputedStyle($avatar[0]).borderRadius).to.equal('50%')
    })
  })

  it('centers the portrait just below the medium breakpoint', () => {
    cy.viewport(767, 1024)
    cy.visitHome()
    cy.get('img.avatar').should(($avatar) => {
      const bounds = $avatar[0].getBoundingClientRect()
      const heading = $avatar[0].closest('#profile').querySelector('h2').getBoundingClientRect()
      const avatarCenter = bounds.left + bounds.width / 2
      const headingCenter = heading.left + heading.width / 2
      expect(avatarCenter).to.be.closeTo(headingCenter, 2)
    })
  })

  it('lays out impact icons in two balanced rows of three above the copy', () => {
    cy.get('.major-icons-container').then(($iconsColumn) => {
      const icons = $iconsColumn[0].getBoundingClientRect()
      const copy = $iconsColumn[0].nextElementSibling.getBoundingClientRect()
      expect(icons.width).to.be.closeTo($iconsColumn[0].parentElement.getBoundingClientRect().width, 2)
      expect(icons.top).to.be.lessThan(copy.top)
    })
    cy.get('#impact ul.major-icons li').then(($icons) => {
      const rows = [...$icons].map((icon) => Math.round(icon.getBoundingClientRect().top))
      expect(new Set(rows.slice(0, 3)).size).to.equal(1)
      expect(new Set(rows.slice(3)).size).to.equal(1)
      expect(rows[3]).to.be.greaterThan(rows[0])
    })
  })

  it('keeps impact icons in one row at the narrow two-column breakpoint', () => {
    cy.viewport(851, 1024)
    cy.visitHome()
    cy.get('#impact ul.major-icons li').then(($icons) => {
      const rows = [...$icons].map((icon) => Math.round(icon.getBoundingClientRect().top))
      expect(new Set(rows).size).to.equal(1)
    })
  })

  it('keeps tablet impact icons centered inside the content column', () => {
    cy.viewport(792, 1024)
    cy.visitHome()
    cy.get('#impact ul.major-icons').then(($icons) => {
      const bounds = $icons[0].getBoundingClientRect()
      const first = $icons[0].querySelector('li').getBoundingClientRect()
      const last = $icons[0].querySelector('li:last-child').getBoundingClientRect()
      expect(first.left).to.be.greaterThan(bounds.left)
      expect(last.right).to.be.lessThan(bounds.right)
    })
  })

  it('matches organization card columns to recognition at the breakpoint', () => {
    cy.viewport(851, 1024)
    cy.visitHome()
    cy.get('#organizations article, #recognition .content-group article').then(($cards) => {
      const widths = [...$cards].map((card) => card.getBoundingClientRect().width)
      expect(widths[0]).to.be.closeTo(widths.at(-1), 2)
      expect(widths[0]).to.be.greaterThan(0)
    })
    cy.viewport(850, 1024)
    cy.visitHome()
    cy.get('#organizations article').then(($cards) => {
      expect($cards[0].getBoundingClientRect().width)
        .to.be.closeTo($cards[0].parentElement.getBoundingClientRect().width, 2)
    })
  })

  it('centers medium-width second-row navigation links between top-row centers', () => {
    cy.viewport(600, 900)
    cy.visitHome()
    cy.get('#section-nav li a').then(($links) => {
      const centers = [...$links].map((link) => {
        const bounds = link.getBoundingClientRect()
        return (bounds.left + bounds.right) / 2
      })
      expect(centers[4]).to.be.closeTo((centers[0] + centers[1]) / 2, 2)
      expect(centers[5]).to.be.closeTo((centers[1] + centers[2]) / 2, 2)
      expect(centers[6]).to.be.closeTo((centers[2] + centers[3]) / 2, 2)
    })
  })

  it('keeps organization actions at the shared desktop width', () => {
    cy.viewport(1024, 900)
    cy.visitHome()
    cy.get('#portfolio .button, #recognition .button, #organizations .button').each(($button) => {
      expect($button[0].getBoundingClientRect().width).to.be.closeTo(155, 1)
    })
  })

  it('renders Media and Organization actions at equal fixed widths', () => {
    cy.viewport(1024, 900)
    cy.visitHome()
    cy.get('#portfolio .button').first().then(($portfolioButton) => {
      cy.get('#organizations .button').first().should(($organizationButton) => {
        expect($organizationButton[0].getBoundingClientRect().width)
          .to.equal($portfolioButton[0].getBoundingClientRect().width)
      })
    })

    cy.viewport(390, 844)
    cy.get('#portfolio .button').first().then(($portfolioButton) => {
      cy.get('#organizations .button').first().should(($organizationButton) => {
        const portfolioBounds = $portfolioButton[0].getBoundingClientRect()
        const organizationBounds = $organizationButton[0].getBoundingClientRect()
        expect(organizationBounds.width).to.be.closeTo(portfolioBounds.width, 1)
        expect(portfolioBounds.width)
          .to.be.closeTo($portfolioButton[0].closest('li').getBoundingClientRect().width, 1)
        expect(organizationBounds.width)
          .to.be.closeTo($organizationButton[0].closest('li').getBoundingClientRect().width, 1)
      })
    })
  })

  it('keeps the skills outline compact', () => {
    cy.get('.skill-col').should(($skills) => {
      const style = getComputedStyle($skills[0])
      expect(Number.parseFloat(style.paddingTop)).to.be.lessThan(8)
      expect(Number.parseFloat(style.paddingBottom)).to.be.lessThan(8)
    })
    cy.get('.skill').each(($skill) => {
      expect(Number.parseFloat(getComputedStyle($skill[0]).marginTop)).to.equal(0)
    })
  })

  it('keeps recognition actions and copy visible', () => {
    cy.get('#recognition .content-group article').each(($article) => {
      cy.wrap($article).should('be.visible').find('.button').should('be.visible')
    })
  })

  it('reveals the section nav after the hero and keeps it inside the viewport', () => {
    cy.get('#section-nav').should('have.attr', 'hidden')
    revealSectionNav()
    cy.get('#section-nav').should('not.have.attr', 'hidden')
    cy.get('#section-nav').then(($nav) => {
      const bounds = $nav[0].getBoundingClientRect()
      expect(bounds.left).to.be.at.least(0)
      expect(bounds.right).to.be.at.most(768)
      expect(bounds.bottom).to.be.at.most(1024)
    })
  })

  it('keeps tablet hash navigation aligned below the navbar', () => {
    revealSectionNav()
    cy.get('#section-nav a[href="#portfolio"]').click({ scrollBehavior: false })
    cy.get('#portfolio').should(($projects) => {
      const nav = $projects[0].ownerDocument.querySelector('#section-nav')
      const difference = $projects[0].getBoundingClientRect().top
        - nav.getBoundingClientRect().bottom
      expect(Math.abs(difference)).to.be.lessThan(1)
    })
  })

  it('keeps the layout usable at large text scale', () => {
    cy.visitHome({
      onBeforeLoad(win) {
        win.document.documentElement.style.fontSize = '200%'
      },
    })

    cy.get('html').should(($html) => {
      expect(Number.parseFloat(getComputedStyle($html[0]).fontSize)).to.be.greaterThan(16)
    })
    cy.get('#header').should('be.visible')
    revealSectionNav()
    cy.get('#section-nav').then(($nav) => {
      const bounds = $nav[0].getBoundingClientRect()
      expect(bounds.left).to.be.at.least(0)
      expect(bounds.right).to.be.at.most(768)
    })
    cy.assertNoHorizontalOverflow()
  })

  it('keeps the footer usable when large text and reduced motion combine', () => {
    cy.then(() => Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] },
    }))

    cy.visitHome({
      onBeforeLoad(win) {
        win.document.documentElement.style.fontSize = '200%'
      },
    })

    revealSectionNav()
    cy.get('#section-nav a[href="#connect"]').click({ scrollBehavior: false })
    cy.get('#connect').should('be.visible')
    cy.get('#connect a[href^="mailto:"]').should('be.visible')
    cy.assertNoHorizontalOverflow()

    cy.then(() => Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: { features: [] },
    }))
  })

  it('has no horizontal page overflow', () => cy.assertNoHorizontalOverflow())

  it('switches to four links then three links below the mobile breakpoint', () => {
    cy.viewport(851, 800)
    cy.visitHome()
    revealSectionNav()
    cy.get('#section-nav li').then(($items) => {
      const rows = [...$items].map((item) => item.getBoundingClientRect().top)
      expect(new Set(rows).size).to.equal(1)
    })

    cy.viewport(850, 800)
    cy.get('#section-nav li').then(($items) => {
      const rows = [...$items].map((item) => item.getBoundingClientRect().top)
      expect(new Set(rows.slice(0, 4)).size).to.equal(1)
      expect(new Set(rows.slice(4)).size).to.equal(1)
      expect(rows[4]).to.be.greaterThan(rows[0])
    })
    cy.assertNoHorizontalOverflow()
  })

  it('keeps the footer visible around 500px', () => {
    cy.viewport(501, 800)
    cy.get('#contact').should('be.visible')
    cy.assertNoHorizontalOverflow()

    cy.viewport(500, 800)
    cy.get('#contact').should('be.visible')
    cy.assertNoHorizontalOverflow()
  })
})
