const emailSelector = '#connect .connect-action .button'
const connectNavSelector = '#section-nav a[href="#connect"]'

function measureLayout(win) {
  return {
    section: win.document.querySelector('#connect').getBoundingClientRect().height,
    document: win.document.documentElement.scrollHeight,
  }
}

function expectStableLayout(win, baseline) {
  const current = measureLayout(win)
  expect(current.section, 'Connect section height').to.be.closeTo(baseline.section, 0.5)
  expect(current.document, 'document height').to.equal(baseline.document)
}

describe('Connect animation layout stability', () => {
  for (const [width, height] of [[1180, 757], [390, 844]]) {
    it(`keeps its height through first navigation and repeated clicks at ${width}px`, () => {
      cy.viewport(width, height)
      cy.visitHome()
      cy.document().then((doc) => doc.fonts.ready)
      cy.get('#about').scrollIntoView()
      cy.get('#section-nav').should('be.visible')
      cy.get(emailSelector).should('not.have.class', 'contact-arrival')

      cy.window().then((win) => {
        const baseline = measureLayout(win)
        const samples = []
        let sampling = true
        const sample = () => {
          samples.push(measureLayout(win))
          if (sampling) win.requestAnimationFrame(sample)
        }
        sample()

        cy.get(connectNavSelector).click({ scrollBehavior: false })
        cy.get(emailSelector).should('have.class', 'contact-arrival')
        cy.window().then((currentWindow) => expectStableLayout(currentWindow, baseline))

        // Replay while the first sweep is still active, without scrolling away.
        cy.get(emailSelector).then(($first) => {
          cy.get(connectNavSelector).click({ scrollBehavior: false })
          cy.get(emailSelector).should(($replayed) => {
            expect($replayed[0], 'a new sweep starts').not.to.equal($first[0])
          })
        })

        cy.get(emailSelector).then({ timeout: 10000 }, ($link) => {
          const animations = $link[0].getAnimations({ subtree: true })
          expect(animations.length, 'sweep animation is running').to.be.greaterThan(0)
          return Promise.all(animations.map((animation) => animation.finished))
        })
        cy.window().then((currentWindow) => expectStableLayout(currentWindow, baseline))

        // Replay again after completion and ensure no extra scrollable white space appears.
        cy.get(emailSelector).then(($completed) => {
          const previousScrollY = win.scrollY
          cy.get(connectNavSelector).click({ scrollBehavior: false })
          cy.get(emailSelector).should(($replayed) => {
            expect($replayed[0]).not.to.equal($completed[0])
          })
          cy.window().should((currentWindow) => {
            expectStableLayout(currentWindow, baseline)
            expect(currentWindow.scrollY, 'repeat click scroll position')
              .to.be.closeTo(previousScrollY, 1)
          })
        })
        cy.then(() => {
          sampling = false
          for (const sample of samples) {
            expect(sample.section, 'sampled section height').to.be.closeTo(baseline.section, 0.5)
            expect(sample.document, 'sampled document height').to.equal(baseline.document)
          }
        })
      })
    })
  }
})

