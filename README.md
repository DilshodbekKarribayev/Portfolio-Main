# Xayrusha Portfolio

Production-oriented portfolio built with React + Vite, focused on project case studies, rich UI motion, and SEO-ready pages.

## Tech Stack

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 4
- Motion + GSAP + Lenis
- Lucide Icons
- COBE globe

## Features

- Home + Work listing + dynamic project detail pages (`/work/:projectId`)
- SEO metadata (title/description/OG/twitter/canonical) updated per route
- Structured data (`schema.org` Person/WebSite), `robots.txt`, `sitemap.xml`
- Responsive device showcases (desktop/tablet/mobile)
- Contact funnel (email/telegram prefilled message)
- Optional public GitHub latest push widget
- Local audio widget (lazy-loaded track on first play)
- Scroll-to-top action

## Project Structure

```text
src/
  components/
    layout/
    pages/
    sections/
    ui/
  data/
    projectsData.js    # project catalog + media imports
    siteData.js        # nav/skills/about/footer/social content
  styles/
    foundation.css
    components.css
    projects.css
    theme.css
  test/
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Environment Variables

Create `.env`:

```env
VITE_GITHUB_USERNAME=XayrulloWeb
```

Notes:

- The GitHub widget uses public GitHub API.
- Do not store private tokens in frontend `VITE_*` env vars.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run preview` - preview built app
- `npm run lint` - ESLint checks (JS/JSX/TS/TSX)
- `npm test` - run Vitest tests
- `npm run test:watch` - watch mode tests

## Testing

Current baseline:

- Data integrity smoke tests for project catalog
- Hero navigation render test

Run:

```bash
npm test
```

## SEO Files

- `index.html` - base meta tags + schema.org
- `public/robots.txt`
- `public/sitemap.xml`

Domain currently configured for:

- `https://xayrusha.uz`
