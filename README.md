# Hayley Witherell — Portfolio

A responsive React portfolio built with Vite and deployed to GitHub Pages at [hayw.dev](https://hayw.dev).

## Technology

- React 19 and Vite
- JavaScript and Sass/SCSS
- ESLint
- Cypress and cypress-axe (end-to-end and accessibility tests)
- GitHub Actions and GitHub Pages

## Site structure

The page is a single scrolling portfolio with alternating light and dark sections:

| Section | Hash | Contents |
|---------|------|----------|
| **Hero** | `#header` | Gradient header, cloud animation, Embark CTA |
| **About** | `#about` | Bio (`#profile`), portrait, and tech stack (`#skills`) |
| **Impact** | `#impact` | Professional and community impact |
| **Reviews** | `#reviews` | Quotes grouped by company |
| **Portfolio** | `#portfolio` | Video games and web applications |
| **Recognition** | `#recognition` | Awards, panels, and media coverage |
| **Connect** | `#connect` | Email action before the social-link footer |

After scrolling past the hero, a **sticky section nav** appears with links to each major section. Nav items stay aligned to section boundaries (accounting for nav height), update `aria-current="page"` as you scroll, and support direct hash URLs such as `/#portfolio`.

Responsive layouts use explicit boundaries rather than natural wrapping: profile and card columns stack at 850px, the section nav switches to intentional four-over-three rows at 850px while retaining normal nav text until the phone breakpoint, and impact icons render as either one row of six or two balanced rows of three.

The social-link footer keeps its short icon animation when you navigate to Connect from the section nav.

## Project layout

```
src/
  components/     Section UI (Header, SectionNav, Introduction, Portfolio, etc.)
  data/           Content datasets — edit these to update site copy and links
  styles/         SCSS partials composed through index.scss
  utils/          Scroll helpers and active-section detection for the nav
public/
  images/         Portrait, favicon, social preview
  assets/         Static overlays and Font Awesome webfonts
cypress/
  e2e/            End-to-end specs grouped by concern (21 files)
  fixtures/       contracts.js — shared expectations for content tests
```

### Content files

| File | What it drives |
|------|----------------|
| `skills.js` | Technical skills chips in About: JavaScript, Ruby on Rails, AI Automation, and Accessible UX |
| `impact.js` | Impact section copy |
| `recommendations.js` | Recommendation cards |
| `projects.js` | Portfolio groups and project cards |
| `recognition.js` | Recognition groups |
| `organizations.js` | Community organization cards |
| `socialLinks.js` | Footer social and email links |
| `sectionNav.js` | Sticky nav labels and scroll targets, including Organizations and Connect |

Components import the data file they need. `cypress/fixtures/contracts.js` mirrors the public content contracts used by tests — update both when changing headings, skills, or section IDs.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm start` is an equivalent alias.

To preview the production build locally:

```bash
npm run build
npm run preview
```

## Quality checks

```bash
npm run lint
npm run build
npm test
npm run test:e2e
```

`npm test` runs lint, build, and the full Cypress suite. `test:e2e` starts the Vite dev server on port 3000 and runs Cypress. Use `npm run cypress:open` for interactive debugging while the dev server is running.

The Cypress suite has **21 spec files** and **148 tests** covering:

| Area | What it checks |
|------|----------------|
| `01-smoke` | Preload timing, portrait loading, top-level render order |
| `02-content` | Section headings, skills, impact, recommendations, projects, recognition, metadata |
| `03-links` | External link labels, `noopener`/`noreferrer`, and safe destinations |
| `04-accessibility` | axe WCAG A/AA, keyboard tab order, landmarks, semantics, and `aria-current` nav state |
| `05-interactions` | Embark scroll, sticky section nav, hash routing, scroll alignment, hover states |
| `06-responsive` | Desktop, tablet, and mobile layouts (320px–1280px), exact breakpoint boundaries, line wrapping, icon grids, portrait shape, section spacing, and touch targets |
| `07-visual` | Section colors and `prefers-reduced-motion` behavior |
| `08-resilience` | Portrait failure, runtime errors, and direct hash routes |

## Deployment

Pushes to `main` trigger the GitHub Pages workflow in `.github/workflows/deploy.yml` (Node 20, `npm ci`, `npm run build`, deploy `dist/`).

## Credits

The original visual design is based on Photon by [HTML5 UP](https://html5up.net), licensed under Creative Commons Attribution 3.0. See `LICENSE.txt`.
