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
        cy.get('.tagline').should('have.text', 'Full-Stack Software Engineer')
        cy.get('.tagline').should('have.text', 'Full-Stack Software Engineer')
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

      it('lays out section navigation in four items then three items', () => {
        revealSectionNav()
        cy.get('#section-nav li').then(($items) => {
          const rows = [...$items].map((item) => item.getBoundingClientRect().top)
          expect(new Set(rows.slice(0, 4)).size).to.eq(1)
          expect(new Set(rows.slice(4)).size).to.eq(1)
          expect(rows[4]).to.be.greaterThan(rows[0])
        })
        cy.get('#section-nav ul').should(($nav) => {
          const styles = getComputedStyle($nav[0])
          expect(styles.rowGap).to.equal('0px')
          expect(Number.parseFloat(styles.columnGap)).to.be.greaterThan(0)
        })
      })

      it('slightly emphasizes the active mobile navigation link', () => {
        cy.get('#section-nav a[href="#about"]').invoke('attr', 'aria-current', 'page')
          .should('have.css', 'font-weight', '600')
      })

      it('fits the 11px small-screen navigation across supported phone widths', () => {
        for (const width of [320, 360, 384, 412, 480]) {
          cy.viewport(width, 844)
          cy.visitHome()
          cy.window().then((window) => window.scrollTo(0, window.innerHeight))
          cy.get('#section-nav').should('be.visible')
          cy.get('#section-nav a').each(($link) => {
            const bounds = $link[0].getBoundingClientRect()
            expect(bounds.left).to.be.at.least(0)
            expect(bounds.right).to.be.at.most(width)
            expect(bounds.width).to.be.greaterThan(0)
          })
          cy.assertNoHorizontalOverflow()
        }
      })

      it('keeps the second navigation row centered with balanced visible gaps', () => {
        revealSectionNav()
        cy.get('#section-nav li:nth-child(5) a, #section-nav li:nth-child(6) a, #section-nav li:nth-child(7) a')
          .then(($links) => {
            const bounds = [...$links].map((link) => link.getBoundingClientRect())
            const firstGap = bounds[1].left - bounds[0].right
            const secondGap = bounds[2].left - bounds[1].right
            const groupCenter = (bounds[0].left + bounds[2].right) / 2
            const viewportCenter = $links[0].ownerDocument.documentElement.clientWidth / 2
            expect(firstGap).to.be.greaterThan(0)
            expect(secondGap).to.be.greaterThan(0)
            expect(Math.abs(firstGap - secondGap)).to.be.lessThan(4)
            expect(groupCenter).to.be.closeTo(viewportCenter, 8)
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

      it('keeps the skills panel in a compact two-column grid without overflow', () => {
        cy.get('#skills .skill-col').should(($skills) => {
          const style = getComputedStyle($skills[0])
          expect(style.gridTemplateColumns.split(' ').length).to.equal(2)
          expect($skills[0].getBoundingClientRect().right).to.be.at.most(width)
        })
        cy.get('#skills .skill').each(($skill) => cy.wrap($skill).should('be.visible'))
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

      it('keeps mobile Impact diamonds intact while reducing their glyphs', () => {
        cy.get('#impact ul.major-icons li .icon').first().then(($icon) => {
          const bounds = $icon[0].getBoundingClientRect()
          const glyph = getComputedStyle($icon[0], '::before')
      expect(bounds.width).to.be.closeTo(90.5, 1)
      expect(bounds.height).to.be.closeTo(90.5, 1)
          expect(glyph.fontSize).to.equal('30px')
        })
      })

      it('keeps Impact icons grouped at the 506px layout transition', () => {
        cy.viewport(506, 844)
        cy.visitHome()
        cy.get('#impact ul.major-icons').should(($icons) => {
          expect(getComputedStyle($icons[0]).justifyContent).to.equal('center')
          const bounds = $icons[0].getBoundingClientRect()
          const first = $icons[0].querySelector('li').getBoundingClientRect()
          const last = $icons[0].querySelector('li:last-child').getBoundingClientRect()
          expect(first.left).to.be.greaterThan(bounds.left)
          expect(last.right).to.be.lessThan(bounds.right)
        })
      })

      it('left-aligns recognition titles with their descriptions', () => {
        cy.get('#recognition .content-group article').each(($article) => {
          cy.wrap($article).find('h4').should('have.css', 'text-align', 'left')
          cy.wrap($article).find('p').should('have.css', 'text-align', 'left')
        })
      })

      it('left-aligns recommendation quotes on mobile', () => {
        cy.get('#reviews .content-group article').each(($article) => {
          cy.wrap($article).find('.review-quote').should('have.css', 'text-align', 'left')
        })
      })

      it('keeps the intro heading as one concise role title', () => {
        cy.get('#profile .main-content h2')
          .should('have.text', 'Usability-Centered Engineering')
          .and('not.have.descendants', '.mobile-line-break')
        cy.get('#impact h2 .mobile-line-break')
          .should('have.css', 'display', 'block')
          .and('have.css', 'white-space', 'nowrap')
          .and('contain.text', 'Community Impact')
      })

      it('matches organization card heading size to recognition cards', () => {
        cy.get('#organizations article h4').first().invoke('css', 'font-size').then((organizationSize) => {
          cy.get('#recognition article h4').first().should('have.css', 'font-size', organizationSize)
        })
      })

      it('keeps organization action spacing aligned with recognition cards', () => {
        cy.get('#recognition .content-group article').each(($article) => {
          cy.wrap($article).find('p').should('have.css', 'margin-bottom', '12px')
        })
        cy.get('#organizations .organization-role').each(($role) => {
          expect(parseFloat(getComputedStyle($role[0]).marginBottom)).to.be.lessThan(8)
        })
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
        const sectionSelectors = ['#impact', '#reviews', '#portfolio', '#recognition']
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
