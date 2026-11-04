import { recognition } from '../../fixtures/contracts.js'

describe('recognition content', () => {
  beforeEach(() => cy.visitHome())

  it('renders all groups and cards without omissions or duplicates', () => {
    cy.get('#recognition .content-group').should('have.length', Object.keys(recognition).length)

    Object.entries(recognition).forEach(([group, cards]) => {
      cy.contains('#recognition .content-group', group).within(() => {
        cy.get('article').should('have.length', cards.length)
        cy.get('h4').then(($headings) => {
          const titles = [...$headings].map((heading) => {
            const clone = heading.cloneNode(true)
            clone.querySelectorAll('.entity-icon-fallback').forEach((fallback) => fallback.remove())
            return clone.textContent
          })
          expect(titles).to.deep.equal(cards)
        })
      })
    })
  })

  it('pairs every card with descriptive copy and one action', () => {
    const descriptions = [
      'Recognition for educational service',
      'Recognition for founding ND In Tech',
      'Interview about founding ND In Tech',
      'ND In Tech as a resource',
      'Coverage of my ND In Tech work',
      'Recommendation of my app Limerickster',
      'My role as founder',
      'My role as co-founder',
      'My quoted industry insight',
      'Building and running CBN',
      "CBN's impact on the industry",
      'Recommendation of ND In Tech',
    ]

    cy.get('#recognition .content-group article').should('have.length', descriptions.length).each(($article, index) => {
      cy.wrap($article).within(() => {
        cy.get('h4').invoke('text').should('not.be.empty')
        cy.get('p').should('have.text', descriptions[index])
        cy.get('a.button').should('have.length', 1).and('not.have.text', '')
      })
    })
  })

  it('presents the pending NDIT Wikipedia article alongside CBN in media', () => {
    cy.contains('#recognition .content-group', 'Media & Publications').within(() => {
      cy.contains('article h4', 'Wikipedia: ND In Tech').closest('article').within(() => {
        cy.get('p').should('have.text', 'My role as founder')
        cy.get('img.entity-icon').should('have.attr', 'src', 'https://en.wikipedia.org/static/favicon/wikipedia.ico')
        cy.get('a.button').should('have.length', 1).and('contain.text', 'Article')
      })
    })
  })

  it('uses the approved concise media descriptions', () => {
    cy.contains('#recognition article h4', 'Neurodiverse Hackers').closest('article')
      .find('p').should('have.text', 'Coverage of my ND In Tech work')
    cy.contains('#recognition article h4', 'Wikipedia: CBN').closest('article')
      .find('p').should('have.text', 'My role as co-founder')
  })

  it('uses the approved Sound Bytes description and Episode action', () => {
    cy.contains('#recognition article h4', 'Sound Bytes').closest('article').within(() => {
      cy.get('p').should('have.text', 'Recommendation of my app Limerickster')
      cy.get('a.button').should('have.text', 'Episode (opens in new tab)')
    })
  })

  it('uses the approved book description and action', () => {
    cy.contains('#recognition article h4', 'The Cognitive Edge').closest('article').within(() => {
      cy.get('p').should('have.text', 'ND In Tech as a resource')
      cy.get('a.button').should('have.text', 'Book (opens in new tab)')
    })
  })

  it('uses the approved podcast description', () => {
    cy.contains('#recognition article h4', 'Seed to Sound').closest('article')
      .find('p').should('have.text', 'Building and running CBN')
    cy.contains('#recognition article h4', 'Seed to Sound').closest('article')
      .find('a.button').should('have.text', 'Episode (opens in new tab)')
  })

  it('gives the Code the Dream mark a tight light backing', () => {
    cy.contains('#recognition article h4', 'Volunteer of the Month')
      .find('img.entity-icon')
      .should('have.class', 'entity-icon-light-background')
      .and('have.css', 'background-color', 'rgb(255, 255, 255)')
  })

  it('uses the approved analytical testing description', () => {
    cy.contains('#recognition article h4', 'GEN Biotech News').closest('article')
      .find('p').should('have.text', 'My quoted industry insight')
  })

  it('uses the approved CBN article description', () => {
    cy.contains('#recognition article h4', 'The Rooster').closest('article')
      .find('p').should('have.text', "CBN's impact on the industry")
  })

  it('renders the Autistic Techie organization mention accurately', () => {
    cy.contains('#recognition article h4', 'Autistic Techie').closest('article')
      .find('p').should('have.text', 'Recommendation of ND In Tech')
    cy.contains('#recognition article h4', 'Autistic Techie').closest('article')
      .find('a.button').should('have.text', 'Episode (opens in new tab)')
      .and('have.attr', 'href', 'https://www.autistic-techie.com/coding-interviews-adhd-and-staying-focused-with-mihai-todor')
  })

  it('loads the supplied brain-only Autistic Techie logo', () => {
    cy.contains('#recognition article h4', 'Autistic Techie').within(() => {
      cy.get('img.entity-icon')
        .should('have.attr', 'src', '/images/autistic-techie-brain.png')
        .and('have.attr', 'alt', '')
        .and('have.attr', 'aria-hidden', 'true')
        .and('be.visible')
        .should(($image) => {
          expect($image[0].naturalWidth).to.equal(512)
          expect($image[0].naturalHeight).to.equal(512)
        })
      cy.get('.entity-icon-fallback').should('not.be.visible')
    })
  })

  it('uses the approved square logo without changing the image', () => {
    cy.request({ url: '/images/autistic-techie-brain.png', encoding: 'binary' }).then(({ body }) => {
      const bytes = Uint8Array.from(body, (character) => character.charCodeAt(0))
      return crypto.subtle.digest('SHA-256', bytes).then((digest) => {
        const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
        expect(hash).to.equal('0c35f92c9f58ca379ac5928f85519cc10646b6d69c5f5038fdc52e374f5dfe64')
      })
    })
  })

  it('keeps the Autistic Techie fallback if its logo cannot load', () => {
    cy.intercept('GET', '/images/autistic-techie-brain.png', { statusCode: 404 }).as('missingTechieLogo')
    cy.visitHome()
    cy.wait('@missingTechieLogo')
    cy.contains('#recognition article h4', 'Autistic Techie').within(() => {
      cy.get('img.entity-icon').should('not.be.visible')
      cy.get('.entity-icon-fallback').should('be.visible').and('have.text', 'AT')
    })
  })
})
