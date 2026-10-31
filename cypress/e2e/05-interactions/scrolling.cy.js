describe('scroll behavior', () => {
  beforeEach(() => cy.visitHome())

  it('starts at the top of the page', () => {
    cy.window().its('scrollY').should('eq', 0)
    cy.get('#header').should('be.visible')
  })

  it('Embark prevents the default jump and requests a smooth scroll', () => {
    cy.window().then((win) => {
      cy.stub(win, 'scrollTo').as('scrollTo')
    })
    cy.get('.embark-btn').click()
    cy.get('@scrollTo').should('have.been.calledOnce')
    cy.get('@scrollTo').its('firstCall.args.0.behavior').should('eq', 'smooth')
    cy.location('hash').should('eq', '')
  })

  it('aligns About beneath the navbar after Embark', () => {
    cy.viewport(390, 844)
    cy.visit('/')
    cy.get('#section-nav').should('have.attr', 'hidden')
    cy.get('.embark-btn').click()
    cy.get('#section-nav', { timeout: 10000 }).should('be.visible')
    cy.get('#about').should(($about) => {
      const nav = $about[0].ownerDocument.querySelector('#section-nav')
      const difference = $about[0].getBoundingClientRect().top
        - nav.getBoundingClientRect().bottom
      expect(Math.abs(difference)).to.be.lessThan(2)
    })
  })

  it('aligns About beneath the navbar after Embark on desktop', () => {
    cy.viewport(1280, 800)
    cy.visit('/')
    cy.get('#section-nav').should('have.attr', 'hidden')
    cy.get('.embark-btn').click()
    cy.get('#section-nav', { timeout: 10000 }).should('be.visible')
    cy.get('#about').should(($about) => {
      const nav = $about[0].ownerDocument.querySelector('#section-nav')
      const difference = $about[0].getBoundingClientRect().top
        - nav.getBoundingClientRect().bottom
      expect(Math.abs(difference)).to.be.lessThan(2)
    })
  })

  it('can scroll through each major section and reach the footer', () => {
    ;['#about', '#impact', '#portfolio', '#reviews', '#recognition', '#contact'].forEach((selector) => {
      cy.get(selector).scrollIntoView().should('be.visible')
    })
    cy.window().its('scrollY').should('be.greaterThan', 0)
  })

  it('restores a direct fragment URL to valid content', () => {
    cy.visit('/#recognition')
    cy.location('hash').should('eq', '#recognition')
    cy.get('#recognition').should('be.visible')
  })

  it('reveals section navigation on mobile only after passing the hero', () => {
    cy.viewport(390, 844)
    cy.visit('/')
    cy.get('#section-nav').should('have.attr', 'hidden')
    cy.window().then((win) => {
      win.scrollTo(0, win.innerHeight / 2)
    })
    cy.get('#section-nav').should('have.attr', 'hidden')
    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav').should('not.have.attr', 'hidden')
    cy.get('#section-nav').should('be.visible')
  })

  it('keeps the mobile navbar visible after navigating back to About', () => {
    cy.viewport(390, 844)
    cy.visit('/')
    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav').should('be.visible')
    cy.get('#section-nav a[href="#about"]').click({ scrollBehavior: false })
    cy.get('#section-nav').should('be.visible')
    cy.get('#about').should(($intro) => {
      const nav = $intro[0].ownerDocument.querySelector('#section-nav')
      const difference = $intro[0].getBoundingClientRect().top
        - nav.getBoundingClientRect().bottom
      expect(Math.abs(difference)).to.be.lessThan(1)
    })
  })

  it('reveals section navigation on desktop only after passing the hero', () => {
    cy.get('#section-nav').should('have.attr', 'hidden')
    cy.window().then((win) => {
      win.scrollTo(0, win.innerHeight / 2)
    })
    cy.get('#section-nav').should('have.attr', 'hidden')
    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav').should('not.have.attr', 'hidden')
    cy.get('#section-nav').should('be.visible')
  })

  it('jumps to a section with smooth scrolling and updates the fragment', () => {
    cy.window().then((win) => {
      win.scrollTo(0, win.innerHeight)
      cy.stub(win, 'scrollTo').as('scrollTo')
    })
    cy.get('#section-nav').should('not.have.attr', 'hidden')
    cy.get('#section-nav a[href="#impact"]').click({ scrollBehavior: false })
    cy.get('@scrollTo').should('have.been.calledOnce')
    cy.get('@scrollTo').its('firstCall.args.0.behavior').should('eq', 'smooth')
    cy.location('hash').should('eq', '#impact')
  })

  it('restores section scroll when using browser back and forward', () => {
    cy.window().then((win) => {
      win.scrollTo(0, win.innerHeight)
    })
    cy.get('#section-nav a[href="#impact"]').click({ scrollBehavior: false })
    cy.location('hash').should('eq', '#impact')
    cy.get('#impact').should('be.visible')

    cy.go('back')
    cy.location('hash').should('eq', '')
    cy.window().its('scrollY').should('eq', 0)
    cy.get('#header').should('be.visible')

    cy.go('forward')
    cy.location('hash').should('eq', '#impact')
    cy.get('#impact').should(($impact) => {
      const nav = $impact[0].ownerDocument.querySelector('#section-nav')
      const difference = $impact[0].getBoundingClientRect().top
        - nav.getBoundingClientRect().bottom
      expect(Math.abs(difference)).to.be.lessThan(1)
    })
  })

  it('keeps direct fragment loads aligned beneath the navbar', () => {
    cy.visit('/#impact')
    cy.location('hash').should('eq', '#impact')
    cy.get('#section-nav').should('be.visible')
    cy.get('#impact').should(($impact) => {
      const nav = $impact[0].ownerDocument.querySelector('#section-nav')
      const difference = $impact[0].getBoundingClientRect().top
        - nav.getBoundingClientRect().bottom
      expect(Math.abs(difference)).to.be.lessThan(12)
    })
  })

  it('keeps a refreshed Impact fragment aligned beneath the navbar', () => {
    cy.visit('/#impact')
    cy.reload()
    cy.get('#section-nav').should('be.visible')
    cy.get('#impact').should(($impact) => {
      const nav = $impact[0].ownerDocument.querySelector('#section-nav')
      const difference = $impact[0].getBoundingClientRect().top
        - nav.getBoundingClientRect().bottom
      expect(Math.abs(difference)).to.be.lessThan(12)
    })
  })

  it('updates the highlighted section while manually scrolling in both directions', () => {
    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav').should('be.visible')
    cy.window().then((win) => {
      win.scrollTo(0, win.document.querySelector('#portfolio').offsetTop)
    })
    cy.get('#section-nav a[href="#portfolio"]').should('have.attr', 'aria-current', 'page')
    cy.get('#section-nav a[href="#about"]').should('not.have.attr', 'aria-current')
    cy.window().then((win) => win.scrollTo(0, win.document.querySelector('#about').offsetTop))
    cy.get('#section-nav a[href="#about"]').should('have.attr', 'aria-current', 'page')
  })

  it('updates the highlighted mobile link after click navigation and manual scrolling', () => {
    cy.viewport(390, 844)
    cy.visit('/')
    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav').should('be.visible')

    cy.get('#section-nav a[href="#portfolio"]').click({ scrollBehavior: false })
    cy.get('#section-nav a[href="#portfolio"]')
      .should('have.attr', 'aria-current', 'page')
      .and('have.css', 'color', 'rgb(255, 255, 255)')
      .and('have.css', 'font-weight', '300')
    cy.get('#section-nav a[aria-current="page"]').should('have.length', 1)
    cy.get('#section-nav a[href="#about"]').should('not.have.attr', 'aria-current')

    cy.window().then((win) => {
      win.dispatchEvent(new Event('wheel'))
      win.scrollTo(0, win.document.querySelector('#reviews').offsetTop)
    })
    cy.get('#section-nav a[href="#reviews"]')
      .should('have.attr', 'aria-current', 'page')
      .and('have.css', 'color', 'rgb(255, 255, 255)')
      .and('have.css', 'font-weight', '300')
    cy.get('#section-nav a[aria-current="page"]').should('have.length', 1)
    cy.get('#section-nav a[href="#portfolio"]').should('not.have.attr', 'aria-current')

    cy.window().then((win) => {
      win.dispatchEvent(new Event('wheel'))
      win.scrollTo(0, win.document.querySelector('#about').offsetTop)
    })
    cy.get('#section-nav a[href="#about"]').should('have.attr', 'aria-current', 'page')
    cy.get('#section-nav a[href="#reviews"]').should('not.have.attr', 'aria-current')
  })

  it('keeps explicit Organizations and Connect selections while allowing later scroll updates', () => {
    cy.viewport(390, 844)
    cy.visit('/')
    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav').should('be.visible')

    cy.get('#section-nav a[href="#organizations"]').click({ scrollBehavior: false })
    cy.get('#section-nav a[href="#organizations"]').should('have.attr', 'aria-current', 'page')
    cy.get('#section-nav a[aria-current="page"]').should('have.length', 1)
    cy.get('#section-nav a[href="#connect"]').click({ scrollBehavior: false })
    cy.get('#section-nav a[href="#connect"]').should('have.attr', 'aria-current', 'page')
    cy.get('#section-nav a[aria-current="page"]').should('have.length', 1)

    cy.window().then((win) => {
      const organizations = win.document.querySelector('#organizations')
      win.dispatchEvent(new Event('wheel'))
      win.scrollTo(0, organizations.offsetTop + organizations.offsetHeight - win.innerHeight + 1)
    })
    cy.get('#section-nav a[href="#connect"]').should('have.attr', 'aria-current', 'page')
    cy.get('#section-nav a[href="#organizations"]').should('not.have.attr', 'aria-current')
    cy.get('#section-nav a[aria-current="page"]').should('have.length', 1)

    cy.window().then((win) => {
      win.dispatchEvent(new Event('wheel'))
      win.scrollTo(0, win.document.documentElement.scrollHeight)
    })
    cy.get('#section-nav a[href="#connect"]').should('have.attr', 'aria-current', 'page')
    cy.get('#section-nav a[aria-current="page"]').should('have.length', 1)

  })

  it('preserves Organizations after top and bottom clicks until manual scrolling', () => {
    ;[390, 1280].forEach((width) => {
      cy.viewport(width, 844)
      cy.visit('/')
      cy.get('#header').then(($header) => {
        cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
      })
      cy.get('#section-nav').should('be.visible')

      cy.get('#section-nav a[href="#organizations"]').click({ scrollBehavior: false })
      cy.get('#section-nav a[href="#organizations"]').should('have.attr', 'aria-current', 'page')
      cy.get('#section-nav a[aria-current="page"]').should('have.length', 1)

      cy.window().then((win) => win.scrollTo(0, win.document.documentElement.scrollHeight))
      cy.get('#section-nav a[href="#organizations"]').click({ scrollBehavior: false })
      cy.get('#section-nav a[href="#organizations"]').should('have.attr', 'aria-current', 'page')
      cy.get('#section-nav a[href="#connect"]').should('not.have.attr', 'aria-current')

      cy.window().then((win) => {
        win.dispatchEvent(new Event('wheel'))
        win.scrollTo(0, win.document.querySelector('#reviews').offsetTop)
      })
      cy.get('#section-nav a[href="#reviews"]').should('have.attr', 'aria-current', 'page')
      cy.get('#section-nav a[href="#organizations"]').should('not.have.attr', 'aria-current')
    })
  })

  it('visually marks the selected desktop section after click and scroll', () => {
    cy.viewport(1280, 800)
    cy.visit('/')
    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav').should('be.visible')

    cy.get('#section-nav a[href="#portfolio"]').click({ scrollBehavior: false })
    cy.get('#section-nav a[href="#portfolio"]')
      .should('have.attr', 'aria-current', 'page')
      .and('have.css', 'color', 'rgb(255, 255, 255)')
      .and('have.css', 'font-weight', '300')
      .and('have.css', 'font-weight', '300')

    cy.window().then((win) => {
      win.dispatchEvent(new Event('wheel'))
      win.scrollTo(0, win.document.querySelector('#reviews').offsetTop)
    })
    cy.get('#section-nav a[href="#reviews"]')
      .should('have.attr', 'aria-current', 'page')
      .and('have.css', 'color', 'rgb(255, 255, 255)')
      .and('have.css', 'font-weight', '300')
      .and('have.css', 'font-weight', '300')
    cy.get('#section-nav a[href="#portfolio"]').should('not.have.attr', 'aria-current')
  })

  it('navigates to Connect and reveals the email action', () => {
    cy.window().then((win) => {
      win.scrollTo(0, win.innerHeight)
    })
    cy.get('#section-nav a[href="#connect"]').click({ scrollBehavior: false })
    cy.location('hash').should('eq', '#connect')
    cy.get('#connect a[href^="mailto:"]').should('be.visible')
  })

  it('aligns each section color boundary with the navbar bottom', () => {
    const destinations = [
      ['#about', '#about'],
      ['#impact', '#impact'],
      ['#reviews', '#reviews'],
      ['#portfolio', '#portfolio'],
      ['#recognition', '#recognition'],
    ]

    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav').should('be.visible')

    destinations.forEach(([href, target]) => {
      cy.get(`#section-nav a[href="${href}"]`).click({ scrollBehavior: false })
      cy.get(target).should(($target) => {
        const nav = $target[0].ownerDocument.querySelector('#section-nav')
        expect(nav.hidden).to.equal(false)
        const navBottom = nav.getBoundingClientRect().bottom
        const sectionTop = $target[0].getBoundingClientRect().top
        expect(Math.abs(sectionTop - navBottom)).to.be.lessThan(1)
      })
    })
  })

  it('recalculates the navbar offset after a viewport resize', () => {
    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav').should('be.visible')

    cy.get('#section-nav').then(($nav) => {
      const desktopNavHeight = $nav[0].getBoundingClientRect().height

      cy.viewport(390, 844)
      cy.get('#section-nav').should('be.visible')
      cy.get('#section-nav').then(($resizedNav) => {
        const mobileNavHeight = $resizedNav[0].getBoundingClientRect().height
        expect(mobileNavHeight).to.not.equal(desktopNavHeight)
      })

      cy.get('#section-nav a[href="#portfolio"]').click({ scrollBehavior: false })
      cy.get('#portfolio').should(($projects) => {
        const nav = $projects[0].ownerDocument.querySelector('#section-nav')
        const difference = $projects[0].getBoundingClientRect().top
          - nav.getBoundingClientRect().bottom
        expect(Math.abs(difference)).to.be.lessThan(1)
      })
    })
  })

  it('keeps hash navigation aligned after resizing from a deep scroll position', () => {
    cy.window().then((win) => {
      win.scrollTo(0, win.document.documentElement.scrollHeight)
    })
    cy.get('#section-nav').should('be.visible')

    cy.viewport(390, 844)
    cy.get('#section-nav').should('be.visible')
    cy.get('#section-nav a[href="#about"]').click({ scrollBehavior: false })
    cy.get('#about').should(($intro) => {
      const nav = $intro[0].ownerDocument.querySelector('#section-nav')
      const difference = $intro[0].getBoundingClientRect().top
        - nav.getBoundingClientRect().bottom
      expect(Math.abs(difference)).to.be.lessThan(1)
    })
  })

  it('loads the footer directly with the footer still visible', () => {
    cy.visit('/#contact')
    cy.location('hash').should('eq', '#contact')
    cy.get('#contact').should('be.visible')
    cy.get('#section-nav').should('be.visible')
  })

  it('restores the previous section when backing out of Contact after a resize', () => {
    cy.get('#header').then(($header) => {
      cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
    })
    cy.get('#section-nav a[href="#portfolio"]').click({ scrollBehavior: false })
    cy.location('hash').should('eq', '#portfolio')

    cy.get('#section-nav a[href="#connect"]').click({ scrollBehavior: false })
    cy.location('hash').should('eq', '#connect')
    cy.get('#connect a[href^="mailto:"]').should('be.visible')

    cy.viewport(390, 844)
    cy.go('back')
    cy.location('hash').should('eq', '#portfolio')
    cy.get('#portfolio').should(($projects) => {
      const nav = $projects[0].ownerDocument.querySelector('#section-nav')
      const difference = $projects[0].getBoundingClientRect().top
        - nav.getBoundingClientRect().bottom
      expect(Math.abs(difference)).to.be.lessThan(1)
    })
  })
})
