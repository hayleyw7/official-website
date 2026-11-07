const parseColor = (value) => {
  const channels = value.match(/[\d.]+/g).map(Number)
  return [...channels.slice(0, 3), channels[3] ?? 1]
}

const composite = (foreground, background) => foreground.slice(0, 3).map(
  (channel, index) => channel * foreground[3] + background[index] * (1 - foreground[3]),
)

const luminance = (color) => {
  const linear = color.map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

const assertReadableFallback = (element) => {
  const win = element.ownerDocument.defaultView
  const layers = []
  for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
    const style = win.getComputedStyle(ancestor)
    expect(style.backgroundImage, 'solid fallback backdrop').to.equal('none')
    expect(Number(style.opacity), 'fully opaque fallback and ancestors').to.equal(1)
    layers.push(parseColor(style.backgroundColor))
  }

  const background = layers.reverse().reduce(
    (backdrop, layer) => composite(layer, backdrop),
    [255, 255, 255],
  )
  const foreground = composite(parseColor(win.getComputedStyle(element).color), background)
  const light = Math.max(luminance(foreground), luminance(background))
  const dark = Math.min(luminance(foreground), luminance(background))
  const contrast = (light + 0.05) / (dark + 0.05)

  expect(contrast, 'computed fallback text contrast').to.be.at.least(4.5)
}

const fallbacks = [
  {
    section: 'portfolio',
    title: 'Affirming Access',
    initials: 'AA',
    image: '/images/icons/affirming-access.png',
    color: 'rgb(43, 43, 43)',
  },
  {
    section: 'portfolio',
    title: 'Decisionator',
    initials: 'D',
    image: '/images/decisionator-favicon.svg',
    color: 'rgb(43, 43, 43)',
  },
  {
    section: 'portfolio',
    title: 'Frankesso',
    initials: 'F',
    image: '/images/frankesso-favicon.png',
    color: 'rgb(43, 43, 43)',
  },
  {
    section: 'recognition',
    title: 'Autistic Techie',
    initials: 'AT',
    image: '/images/autistic-techie-brain.png',
    color: 'rgb(255, 255, 255)',
  },
  {
    section: 'organizations',
    title: 'Neurodiversity In Tech',
    initials: 'ND',
    image: '/images/icons/nd-in-tech.ico',
    color: 'rgb(255, 255, 255)',
  },
  {
    section: 'organizations',
    title: 'Colorado Badged Network',
    initials: 'CBN',
    image: '/images/cbn-leaf-circle-tight.png',
    color: 'rgb(255, 255, 255)',
  },
]

;[
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
].forEach(({ name, width, height }) => {
  describe(`failed-logo contrast on ${name}`, () => {
    fallbacks.forEach(({ section, title, initials, image, color }) => {
      it(`keeps ${title} initials readable in ${section}`, () => {
        cy.viewport(width, height)
        const failedImage = `${image}?fallback-contrast=${name}`
        cy.intercept('GET', failedImage, {
          statusCode: 404,
          headers: { 'cache-control': 'no-store' },
        }).as('missingLogo')
        cy.visitHome()
        cy.contains(`#${section} article h4`, title).find('img.entity-icon')
          .should('have.attr', 'src', image)
          .invoke('attr', 'src', failedImage)
        cy.wait('@missingLogo')
        cy.contains(`#${section} article h4`, title).within(() => {
          cy.get('img.entity-icon').should('not.be.visible')
          cy.get('.entity-icon-fallback')
            .should('be.visible')
            .and('have.text', initials)
            .should(($fallback) => {
              expect($fallback).to.have.attr('aria-hidden', 'true')
              expect($fallback).to.have.css('color', color)
              assertReadableFallback($fallback[0])
            })
        })
      })
    })
  })
})
