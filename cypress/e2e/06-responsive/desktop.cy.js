describe('desktop layout', () => {
  beforeEach(() => {
    cy.viewport(1280, 800)
    cy.visitHome()
  })

  it('uses two columns for the introduction and impact areas', () => {
    cy.get('.main-content-container').then(($column) => {
      expect($column[0].getBoundingClientRect().width).to.be.closeTo(
        $column[0].parentElement.getBoundingClientRect().width / 2,
        2,
      )
    })
    cy.get('.major-icons-container').then(($column) => {
      expect($column[0].getBoundingClientRect().width).to.be.closeTo(
        $column[0].parentElement.getBoundingClientRect().width / 2,
        2,
      )
    })
  })

  it('uses two balanced rows of three impact icons in the side column', () => {
    cy.get('#impact ul.major-icons li').then(($icons) => {
      const rows = [...$icons].map((icon) => Math.round(icon.getBoundingClientRect().top))
      expect(new Set(rows.slice(0, 3)).size).to.equal(1)
      expect(new Set(rows.slice(3)).size).to.equal(1)
      expect(rows[3]).to.be.greaterThan(rows[0])
    })
  })

  it('shows the complete tagline and right-aligns the portrait column', () => {
    cy.get('.tagline-detail').should('be.visible')
    cy.get('.avatar-container').should('have.css', 'justify-content', 'flex-end')
    cy.get('img.avatar').should(($avatar) => {
      const bounds = $avatar[0].getBoundingClientRect()
      expect(bounds.width).to.be.closeTo(bounds.height, 1)
      expect(getComputedStyle($avatar[0]).borderRadius).to.equal('50%')
    })
  })

  it('uses equal visible gaps around and between skill labels', () => {
    cy.get('.skill-col').then(($box) => {
      cy.get('.skill').then(($skills) => {
        const box = $box[0].getBoundingClientRect()
        const bounds = [...$skills].map((skill) => skill.getBoundingClientRect())
        const gaps = [
          bounds[0].left - box.left,
          ...bounds.slice(1).map((item, index) => item.left - bounds[index].right),
          box.right - bounds.at(-1).right,
        ]
        gaps.forEach((gap) => expect(gap).to.be.at.least(20))
        gaps.forEach((gap) => expect(gap).to.be.closeTo(gaps[0], 1))
      })
    })
  })

  it('aligns the skills box with the text column above', () => {
    cy.get('#profile .main-content').then(($textColumn) => {
      cy.get('.skill-col').then(($skills) => {
        const textBounds = $textColumn[0].getBoundingClientRect()
        const skillBounds = $skills[0].getBoundingClientRect()
        expect(skillBounds.left).to.be.closeTo(textBounds.left, 1)
        expect(skillBounds.width).to.be.closeTo(textBounds.width, 1)
      })
    })
  })

  it('keeps heading phrases together when they wrap', () => {
    cy.get('#profile h2 .mobile-line-break, #impact h2 .mobile-line-break')
      .each(($line) => cy.wrap($line).should('have.css', 'white-space', 'nowrap'))
  })

  it('has no horizontal page overflow', () => cy.assertNoHorizontalOverflow())

  it('left-aligns project and recognition card contents', () => {
    cy.get('#portfolio .content-group > .media-title, #recognition .content-group > .media-title, #recommendations .content-group > .media-title')
      .each(($heading) => cy.wrap($heading).should('have.css', 'text-align', 'left'))
    cy.get('#portfolio .content-group article, #recognition .content-group article').each(($card) => {
      cy.wrap($card).should('have.css', 'text-align', 'left')
      cy.wrap($card).find('.actions.special')
        .should('have.css', 'justify-content', 'flex-start')
        .and('have.css', 'text-align', 'left')
    })
  })

  it('places the single Critterwave card in the left project column', () => {
    cy.contains('#portfolio article h4', 'Critterwave').closest('article').then(($card) => {
      const card = $card[0].getBoundingClientRect()
      const row = $card[0].parentElement.getBoundingClientRect()
      expect(card.left).to.be.closeTo(row.left, 1)
    })
  })

  context('narrow desktop', () => {
    beforeEach(() => {
      cy.viewport(1141, 800)
      cy.visitHome()
    })

    it('keeps the two-column desktop layout just above the breakpoint', () => {
      cy.get('.main-content-container').then(($column) => {
        expect($column[0].getBoundingClientRect().width).to.be.closeTo(
          $column[0].parentElement.getBoundingClientRect().width / 2,
          2,
        )
      })
      cy.get('.major-icons-container').then(($column) => {
        expect($column[0].getBoundingClientRect().width).to.be.closeTo(
          $column[0].parentElement.getBoundingClientRect().width / 2,
          2,
        )
      })
      cy.get('#impact h2 .mobile-line-break').should('have.css', 'display', 'inline')
    })

    it('splits Community Impact onto a new line at 1140px', () => {
      cy.viewport(1140, 800)
      cy.get('#impact h2 .mobile-line-break').should('have.css', 'display', 'block')
    })

    it('uses a full-width skills box through the transition range', () => {
      cy.viewport(983, 800)
      cy.get('#skills .col-6').then(($column) => {
        expect($column[0].getBoundingClientRect().width).to.be.closeTo(
          $column[0].parentElement.getBoundingClientRect().width,
          2,
        )
      })
      cy.get('.skill-col').then(($box) => {
        const box = $box[0].getBoundingClientRect()
        cy.get('.skill').then(($skills) => {
          const bounds = [...$skills].map((skill) => skill.getBoundingClientRect())
          const gaps = [
            bounds[0].left - box.left,
            ...bounds.slice(1).map((item, index) => item.left - bounds[index].right),
            box.right - bounds.at(-1).right,
          ]
          gaps.forEach((gap) => expect(gap).to.be.closeTo(gaps[0], 1))
        })
      })
      cy.assertNoHorizontalOverflow()
    })

    it('keeps the section nav usable without horizontal overflow', () => {
      cy.get('#section-nav').should('have.attr', 'hidden')
      cy.window().then((win) => {
        win.scrollTo(0, win.innerHeight / 2)
      })
      cy.get('#section-nav').should('have.attr', 'hidden')
      cy.get('#header').then(($header) => {
        cy.window().then((win) => win.scrollTo(0, $header.outerHeight()))
      })
      cy.get('#section-nav').should('be.visible')
      cy.assertNoHorizontalOverflow()
    })
  })

  context('section-only card breakpoint', () => {
    beforeEach(() => {
      cy.viewport(851, 800)
      cy.visitHome()
    })

    it('keeps profile and cards in two columns while stacking impact icons above copy', () => {
      cy.get('.main-content-container').then(($column) => {
        expect($column[0].getBoundingClientRect().width).to.be.closeTo(
          $column[0].parentElement.getBoundingClientRect().width / 2,
          2,
        )
      })
      cy.get('.major-icons-container').then(($column) => {
        expect($column[0].getBoundingClientRect().width).to.be.closeTo(
          $column[0].parentElement.getBoundingClientRect().width,
          2,
        )
      })
      cy.get('#impact ul.major-icons li').then(($icons) => {
        const firstRowTop = $icons[0].getBoundingClientRect().top
        const firstRow = [...$icons].filter((icon) => (
          Math.abs(icon.getBoundingClientRect().top - firstRowTop) < 1
        ))
        expect(firstRow.length).to.equal(6)
      })

      cy.get('#portfolio article, #recommendations article, #recognition article').each(($card) => {
        expect($card[0].getBoundingClientRect().width).to.be.closeTo(
          $card[0].parentElement.getBoundingClientRect().width / 2,
          2,
        )
      })

      cy.get('img.avatar').should(($avatar) => {
        const bounds = $avatar[0].getBoundingClientRect()
        expect(bounds.width).to.be.closeTo(bounds.height, 1)
        expect(getComputedStyle($avatar[0]).borderRadius).to.equal('50%')
      })

      cy.get('.last-intro-para').should(($paragraph) => {
        expect(Number.parseFloat(getComputedStyle($paragraph[0]).marginBottom)).to.be.lessThan(8)
      })

      cy.get('#profile h2 .mobile-line-break').should('have.css', 'display', 'block')
      cy.get('#impact h2 .mobile-line-break').should('have.css', 'display', 'block')
      cy.get('.skill-col').should(($skills) => {
        expect(Number.parseFloat(getComputedStyle($skills[0]).paddingTop)).to.be.lessThan(8)
      })
      cy.get('#contact .footer-text span').should('be.visible')
    })

    it('stacks sections at 850px without applying the two-column heading split', () => {
      cy.viewport(850, 800)

      cy.get('.main-content-container').then(($column) => {
        expect($column[0].getBoundingClientRect().width).to.be.closeTo(
          $column[0].parentElement.getBoundingClientRect().width,
          2,
        )
      })

      cy.get('.major-icons-container').then(($column) => {
        expect($column[0].getBoundingClientRect().width).to.be.closeTo(
          $column[0].parentElement.getBoundingClientRect().width,
          2,
        )
      })

      cy.get('#profile h2 .mobile-line-break').should('have.css', 'display', 'inline')
      cy.get('#impact h2 .mobile-line-break').should('have.css', 'display', 'block')
      cy.get('#contact .footer-text span').should('be.visible')

      cy.get('#portfolio article, #recommendations article, #recognition article').each(($card) => {
        expect($card[0].getBoundingClientRect().width).to.be.closeTo(
          $card[0].parentElement.getBoundingClientRect().width,
          2,
        )
      })
    })
  })
})
