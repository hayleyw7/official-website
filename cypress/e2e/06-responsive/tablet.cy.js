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
    cy.get('#section-nav a[href="#contact"]').click({ scrollBehavior: false })
    cy.get('#contact').should('be.visible')
    cy.get('#contact .icons').should('have.class', 'contact-arrival')
    cy.assertNoHorizontalOverflow()

    cy.then(() => Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: { features: [] },
    }))
  })

  it('has no horizontal page overflow', () => cy.assertNoHorizontalOverflow())

  it('switches directly from six links in one row to two rows of three', () => {
    cy.viewport(737, 800)
    cy.visitHome()
    revealSectionNav()
    cy.get('#section-nav li').then(($items) => {
      const rows = [...$items].map((item) => item.getBoundingClientRect().top)
      expect(new Set(rows).size).to.equal(1)
    })

    cy.viewport(736, 800)
    cy.get('#section-nav li').then(($items) => {
      const rows = [...$items].map((item) => item.getBoundingClientRect().top)
      expect(new Set(rows.slice(0, 3)).size).to.equal(1)
      expect(new Set(rows.slice(3)).size).to.equal(1)
      expect(rows[3]).to.be.greaterThan(rows[0])
    })
    cy.assertNoHorizontalOverflow()
  })

  it('shortens the footer invitation at 500px', () => {
    cy.viewport(501, 800)
    cy.get('#contact .footer-text span').should('be.visible')
    cy.assertNoHorizontalOverflow()

    cy.viewport(500, 800)
    cy.get('#contact .footer-text span').should('not.be.visible')
    cy.get('#contact .footer-text').should('contain.text', 'Reach out to connect.')
    cy.assertNoHorizontalOverflow()
  })
})
