describe('mobile and narrow layout', () => {
  const revealSectionNav = () => {
    cy.get('#header').then(($header) => {
      const heroHeight = Math.ceil($header.outerHeight())
      cy.window().then((win) => win.scrollTo(0, heroHeight + 1))
    })
    cy.get('#section-nav').should('be.visible')
  }

  const viewports = [
    ['common phone', 375, 667],
    ['minimum supported', 320, 568],
    ['short phone', 390, 420],
  ]

  viewports.forEach(([name, width, height]) => {
    context(name, () => {
      beforeEach(() => {
        cy.viewport(width, height)
        cy.visitHome()
      })

      it('hides secondary tagline details while keeping the primary role', () => {
        cy.get('.tagline').should('contain.text', 'Software Engineer')
        cy.get('.tagline-detail').should('not.be.visible')
      })

      it('keeps the tagline background full width', () => {
        cy.window().then((win) => {
          cy.get('.tagline').then(($tagline) => {
            const bounds = $tagline[0].getBoundingClientRect()
            expect(bounds.left).to.be.at.most(0)
            expect(bounds.right).to.be.at.least(win.document.documentElement.clientWidth)
          })
        })
      })

      it('keeps all buttons inside the viewport', () => {
        cy.get('a.button').each(($button) => {
          const bounds = $button[0].getBoundingClientRect()
          expect(bounds.left).to.be.at.least(0)
          expect(bounds.right).to.be.at.most(width)
        })
      })

      it('keeps every section navigation link inside the viewport', () => {
        revealSectionNav()
        cy.get('#section-nav a').each(($link) => {
          const bounds = $link[0].getBoundingClientRect()
          expect(bounds.left).to.be.at.least(0)
          expect(bounds.right).to.be.at.most(width)
        })
      })

      it('keeps the section navigation fully visible on short viewports', () => {
        revealSectionNav()
        cy.get('#section-nav').should(($nav) => {
          const bounds = $nav[0].getBoundingClientRect()
          expect(bounds.top).to.be.at.least(0)
          expect(bounds.bottom).to.be.at.most(height)
        })
      })

      it('lays out section navigation in two rows of three', () => {
        revealSectionNav()
        cy.get('#section-nav li').then(($items) => {
          const rows = [...$items].map((item) => item.getBoundingClientRect().top)
          expect(new Set(rows.slice(0, 3)).size).to.eq(1)
          expect(new Set(rows.slice(3)).size).to.eq(1)
          expect(rows[3]).to.be.greaterThan(rows[0])
        })
      })

      it('subtracts the navbar height from the About minimum height', () => {
        revealSectionNav()
        cy.get('#section-nav').then(($nav) => {
          cy.get('#about').should(($intro) => {
            const expected = height - $nav[0].getBoundingClientRect().height
            const actual = Number.parseFloat(getComputedStyle($intro[0]).minHeight)
            expect(actual).to.be.closeTo(expected, 1)
          })
        })
      })

      it('centers the profile and technical skills as one About composition', () => {
        cy.get('#about')
          .should('have.css', 'display', 'flex')
          .and('have.css', 'flex-direction', 'column')
          .and('have.css', 'justify-content', 'center')
        cy.get('#about > #profile').should('exist')
        cy.get('#about > #skills').should('exist')
      })

      it('keeps the portrait responsive and circular', () => {
        cy.get('img.avatar').then(($avatar) => {
          const bounds = $avatar[0].getBoundingClientRect()
          expect(bounds.width).to.be.at.most(width)
          expect(bounds.height).to.be.at.most(368)
          expect(bounds.width).to.be.closeTo(bounds.height, 1)
          expect(getComputedStyle($avatar[0]).borderRadius).to.equal('50%')
        })
      })

      it('lays out impact icons in two balanced rows of three', () => {
        cy.get('#impact ul.major-icons li').then(($icons) => {
          const rows = [...$icons].map((icon) => Math.round(icon.getBoundingClientRect().top))
          expect(new Set(rows.slice(0, 3)).size).to.equal(1)
          expect(new Set(rows.slice(3)).size).to.equal(1)
          expect(rows[3]).to.be.greaterThan(rows[0])
        })
      })

      it('left-aligns recognition titles with their descriptions', () => {
        cy.get('#recognition .content-group article').each(($article) => {
          cy.wrap($article).find('h4').should('have.css', 'text-align', 'left')
          cy.wrap($article).find('p').should('have.css', 'text-align', 'left')
        })
      })

      it('left-aligns recommendation quotes on mobile', () => {
        cy.get('#recommendations .content-group article').each(($article) => {
          cy.wrap($article).find('.recommendation-quote').should('have.css', 'text-align', 'left')
        })
      })

      it('breaks the intro heading after reliable on mobile', () => {
        cy.get('#profile .main-content h2 .mobile-line-break')
          .should('have.css', 'display', 'block')
          .and('have.css', 'white-space', 'nowrap')
          .and('contain.text', 'Usable Systems')
        cy.get('#impact h2 .mobile-line-break')
          .should('have.css', 'display', 'block')
          .and('have.css', 'white-space', 'nowrap')
          .and('contain.text', 'Community Impact')
      })

      it('uses compact spacing between recognition groups', () => {
        cy.get('#recognition .content-group:first-of-type')
          .should('have.css', 'margin-top', '0px')
        cy.get('#recognition .content-group:not(:first-of-type)')
          .should('have.length', 2)
          .each(($group) => {
            cy.wrap($group).should('have.css', 'margin-top', '12px')
          })
      })

      it('uses matching vertical padding across main sections', () => {
        const sectionSelectors = ['#impact', '#recommendations', '#portfolio', '#recognition']
        cy.get('#impact').invoke('css', 'padding-top').then((paddingTop) => {
          cy.get('#impact').invoke('css', 'padding-bottom').then((paddingBottom) => {
            sectionSelectors.forEach((selector) => {
              cy.get(selector).should('have.css', 'padding-top', paddingTop)
              cy.get(selector).should('have.css', 'padding-bottom', paddingBottom)
            })
          })
        })
      })

      it('has no horizontal page overflow', () => cy.assertNoHorizontalOverflow())
    })
  })
})
