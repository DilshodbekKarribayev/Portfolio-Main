# Requirements Document

## Introduction

This feature rebrands and re-personalizes the existing "Xayrusha" portfolio (React 19 + Vite 7 + React Router 7 + Tailwind CSS 4) for a new owner. The framework, motion system, routing, and layout are preserved as-is; only owner identity, content, brand assets, project catalog, SEO metadata, structured data, domain-scoped URLs, social/contact links, and supporting documentation change.

The rebrand covers every surface that references the previous owner:

- Content data (`src/data/siteData.js`, `src/data/projectsData.js`)
- Section components that hardcode identity strings (Hero, About, Footer, HeaderNav)
- Case-study project detail page (`src/components/pages/WorkDetailPage.jsx`) via data
- Base HTML metadata (`index.html`) — title, description, OG/Twitter, canonical, schema.org `Person`/`WebSite`
- Dynamic per-route SEO in `src/App.jsx` (`SITE_URL`, `DEFAULT_SEO`, meta upsert)
- Public brand assets (`public/brand/*`, `public/favicon.svg`, `public/assets/demo/*`)
- Owner photo (`src/assets/Me/image.webp`) and per-project media directories
- SEO files (`public/sitemap.xml`, `public/robots.txt`)
- Environment variables (`.env`, `.env.example`) for the GitHub widget
- Project documentation (`README.md`) and Vitest baseline tests

The result is a portfolio site that presents the new owner consistently across UI, SEO, structured data, and repository documentation, with zero remaining references to the previous owner.

## Glossary

- **Portfolio_Site**: The deployed React SPA served from the project's production domain, comprising the Home, Work list, Work Detail, and 404 routes.
- **Owner_Identity**: The set of personal fields describing the portfolio owner — legal name, display alias, one-line role, location (city + country), portrait photo, avatar, and brand mark.
- **Owner_Content**: The prose and enumerations authored in the owner's voice — About paragraphs, marquee words, skillset entries, footer tagline, and copyright line.
- **Content_Store**: The centralized data modules at `src/data/siteData.js` and `src/data/projectsData.js` from which all sections read.
- **Project_Catalog**: The ordered list of case-study project entries exported by `src/data/projectsData.js`. Each entry contains `id`, `name`, `tagline`, `timeline`, `projectType`, `role`, `liveUrl`, `githubUrl`, `collaborators`, `description`, `problem`, `outcome`, `features`, `deviceScreens` (`desktop`/`tablet`/`mobile`), `responsibilities`, `process`, `gallery`, and `tags`.
- **Social_Links**: The set of external URLs for the owner's public profiles (GitHub, LinkedIn, Telegram, Instagram, X/Twitter, and any additional networks) plus a `mailto:` contact address, exported from `src/data/siteData.js`.
- **Brand_Assets**: The static SVG/PNG files that visually represent the owner — favicon, header wordmark, header symbol mark, OG preview image, and profile card icon pattern.
- **SEO_Engine**: The combined static metadata in `index.html` and the runtime metadata upsert logic in `src/App.jsx` that maintains `<title>`, `<meta name="description">`, `<meta name="robots">`, Open Graph tags, Twitter card tags, and `<link rel="canonical">` per route.
- **Structured_Data**: The `application/ld+json` block in `index.html` containing `schema.org` `WebSite` and `Person` entities describing the owner.
- **Sitemap**: The `public/sitemap.xml` file listing indexable absolute URLs for the site.
- **Robots_File**: The `public/robots.txt` file declaring crawler policy and pointing to the Sitemap.
- **GitHub_Widget**: The optional public GitHub latest-push widget that consumes the `VITE_GITHUB_USERNAME` environment variable.
- **Contact_Funnel**: The form in `FooterSection` that composes an email or Telegram message using the owner's contact email and Telegram handle.
- **Site_Origin**: The absolute origin of the deployed Portfolio_Site (scheme + host, no trailing slash), e.g. `https://example.com`.
- **New_Owner**: The person the portfolio is being rebranded for.
- **Previous_Owner_Reference**: Any string, asset filename, URL, handle, email, or metadata value that identifies the prior owner ("Xayrusha", "Raxmonberganov Xayrullo", "XayrulloWeb", "xayrullo01_02", "xayrulloweb@gmail.com", "xayrusha.uz", "Urgench", "Uzbekistan" when tied to the prior owner's location, and asset paths under `xayrusha-*`).
- **Test_Suite**: The Vitest-based tests under `src/` executed by `npm test`.

## Requirements

### Requirement 1: Owner Identity Configuration

**User Story:** As the New_Owner, I want a single source of truth for my identity fields, so that every section of the Portfolio_Site renders my name, alias, role, and location consistently without duplicated hardcoded strings.

#### Acceptance Criteria

1. THE Content_Store SHALL expose a single owner profile object containing the New_Owner's full legal name, display alias, one-line role, location city, location country, location country code (ISO-3166-1 alpha-2), portrait image reference, and brand mark reference.
2. WHEN a section component renders an identity field, THE section component SHALL read the value from the Content_Store owner profile rather than embedding a literal string.
3. THE Content_Store SHALL export the owner profile using named exports consumable by existing sections without additional runtime configuration.
4. IF an identity field is not provided by the New_Owner, THEN THE Content_Store SHALL fall back to an explicit `TBD` placeholder value and THE Portfolio_Site SHALL still build and render.

### Requirement 2: Hero Section Personalization

**User Story:** As a visitor, I want the Hero section to display the New_Owner's alias, tagline, and location, so that the entry point reflects the current owner.

#### Acceptance Criteria

1. WHEN the Home route renders, THE HeroSection SHALL display the New_Owner's display alias as the primary heading.
2. WHEN the Home route renders, THE HeroSection SHALL display the New_Owner's tagline sourced from the Content_Store.
3. WHEN the Home route renders, THE HeroSection SHALL display the New_Owner's location city and country sourced from the Content_Store.
4. THE HeroSection SHALL NOT contain a literal reference to the Previous_Owner_Reference.

### Requirement 3: About Section Content Replacement

**User Story:** As the New_Owner, I want the About section prose, profile card, and stat chips to describe me, so that visitors understand my background rather than the previous owner's.

#### Acceptance Criteria

1. THE Content_Store SHALL provide the About heading, heading highlight, and an ordered array of About paragraphs authored for the New_Owner.
2. WHEN the AboutSection renders, THE AboutSection SHALL display each About paragraph from the Content_Store in the provided order.
3. WHEN the AboutSection renders the ProfileCard, THE AboutSection SHALL bind the ProfileCard `name`, `handle`, `status`, and `avatarUrl` to the New_Owner's identity fields from the Content_Store.
4. WHEN the AboutSection renders the caption beneath the ProfileCard, THE AboutSection SHALL display the New_Owner's display alias and one-line role from the Content_Store.
5. THE AboutSection SHALL NOT contain a literal reference to the Previous_Owner_Reference.

### Requirement 4: Skillset and Marquee Content

**User Story:** As the New_Owner, I want the Skills grid and MarqueeRibbon to advertise my technology stack and specialties, so that the site reflects my actual expertise.

#### Acceptance Criteria

1. THE Content_Store SHALL export a `skillset` array whose entries describe the New_Owner's technologies with a display `name`, a Lucide icon reference, and a hex color.
2. THE Content_Store SHALL export a `marqueeWords` array of uppercase strings representing the New_Owner's specialties and keywords.
3. WHEN the SkillsSection renders, THE SkillsSection SHALL display every entry from `skillset` in the provided order.
4. WHEN the MarqueeRibbon renders, THE MarqueeRibbon SHALL display every entry from `marqueeWords` in the provided order.
5. THE `skillset` array SHALL contain between 6 and 16 entries inclusive.

### Requirement 5: Project Catalog Replacement

**User Story:** As the New_Owner, I want the Work list and Work Detail pages to showcase my projects, so that visitors evaluate my work rather than the previous owner's.

#### Acceptance Criteria

1. THE Project_Catalog SHALL be composed exclusively of case-study entries authored for the New_Owner.
2. THE Project_Catalog SHALL contain at least one project entry.
3. FOR EACH entry in the Project_Catalog, THE entry SHALL include non-empty values for `id`, `name`, `href`, `tagline`, `projectType`, `role`, `description`, `problem`, `outcome`, `deviceScreens.desktop`, `deviceScreens.tablet`, `deviceScreens.mobile`, `gallery`, and `tags`.
4. FOR EACH entry in the Project_Catalog, THE `id` SHALL be unique across the catalog and match the trailing path segment of `href` (`/work/{id}`).
5. FOR EACH entry in the Project_Catalog, THE `gallery` SHALL contain at least three items and every item SHALL provide a `key`, a `title`, and a `src` resolving to a bundled `.webp` asset.
6. FOR EACH entry in the Project_Catalog, THE `collaborators` array SHALL identify the New_Owner (not the Previous_Owner_Reference) when the New_Owner participated in that project.
7. IF an entry provides a `liveUrl` or `githubUrl`, THEN THE value SHALL be an absolute HTTPS URL that does not reference the Previous_Owner_Reference's GitHub username or domains.
8. THE Project_Catalog SHALL NOT contain any entry whose media assets remain located under the Previous_Owner_Reference's original directories (`src/assets/FilmZone`, `src/assets/Dream Go`, `src/assets/Finance`, `src/assets/Mchs`, `src/assets/TempMonitoring`) unless that project is explicitly retained for the New_Owner with written attribution.

### Requirement 6: Social Links and Contact Address

**User Story:** As the New_Owner, I want my public profiles and contact email wired into the site, so that visitors reach me through channels I control.

#### Acceptance Criteria

1. THE Content_Store SHALL export a `socialLinks` object with entries for `github`, `linkedin`, `telegram`, `instagram`, `twitter`, and `email`.
2. THE `socialLinks.email` value SHALL be a `mailto:` URI whose local part and domain belong to the New_Owner.
3. FOR EACH non-email entry in `socialLinks`, THE value SHALL be either an absolute HTTPS URL to the New_Owner's profile on that network or the literal string `#` when the New_Owner has no presence on that network.
4. THE Contact_Funnel SHALL compose email drafts using the address from `socialLinks.email`.
5. THE Contact_Funnel SHALL compose Telegram drafts using the URL from `socialLinks.telegram` and SHALL fall back to a documented default only when `socialLinks.telegram` is `#`.
6. THE FooterSection social icon row SHALL link to the entries in `socialLinks` for GitHub, LinkedIn, Telegram, and Instagram.
7. THE `socialLinks` object SHALL NOT contain a Previous_Owner_Reference handle or URL.

### Requirement 7: Footer Branding and Copyright

**User Story:** As the New_Owner, I want the footer's brand block, tagline, and copyright to reflect me, so that the closing frame of every page matches the rest of the site.

#### Acceptance Criteria

1. WHEN the FooterSection renders, THE FooterSection SHALL display the New_Owner's display alias as the brand block heading.
2. WHEN the FooterSection renders, THE FooterSection SHALL display a tagline paragraph sourced from the Content_Store rather than a hardcoded string.
3. WHEN the FooterSection renders, THE FooterSection SHALL display a copyright line containing the current calendar year and the New_Owner's display alias.
4. THE `footerColumns.Projects` links SHALL enumerate every project in the Project_Catalog with matching `href` values.

### Requirement 8: Header Logo and Wordmark

**User Story:** As a visitor, I want the fixed header to display the New_Owner's brand mark and wordmark, so that the site's persistent chrome matches the owner.

#### Acceptance Criteria

1. WHEN the HeaderNav renders, THE HeaderNav SHALL load the New_Owner's brand mark from `public/brand/` and display it beside the wordmark.
2. WHEN the HeaderNav renders, THE HeaderNav SHALL display the New_Owner's display alias as the wordmark text.
3. THE `public/brand/` directory SHALL contain a symbol mark file and a lockup file whose filenames use the New_Owner's alias in kebab-case rather than the Previous_Owner_Reference.

### Requirement 9: Brand and Media Assets

**User Story:** As the New_Owner, I want my portrait, favicon, avatar, and OG preview image to appear across the site and share previews, so that visual identity matches the content.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL load the New_Owner's portrait from a bundled asset referenced by the Content_Store owner profile.
2. THE `public/favicon.svg` file SHALL depict the New_Owner's brand mark rather than the Previous_Owner_Reference's mark.
3. THE `public/assets/demo/` directory SHALL contain an OG preview image and an avatar SVG whose filenames and content correspond to the New_Owner.
4. WHEN a section references the OG preview image path, THE section SHALL use the New_Owner's OG preview image filename.
5. IF the New_Owner has not yet provided a portrait, THEN THE Portfolio_Site SHALL render a documented neutral placeholder image and log no runtime errors.

### Requirement 10: Site Origin and Canonical URLs

**User Story:** As the New_Owner, I want every absolute URL emitted by the site to point at my production domain, so that indexing, sharing, and structured data work correctly after deployment.

#### Acceptance Criteria

1. THE SEO_Engine SHALL define exactly one Site_Origin constant used by every absolute URL emitted at runtime.
2. WHEN any route renders, THE SEO_Engine SHALL set `<link rel="canonical">` to `{Site_Origin}{normalized_path}`.
3. WHEN any route renders, THE SEO_Engine SHALL set `og:url` to `{Site_Origin}{normalized_path}`.
4. WHEN any route renders, THE SEO_Engine SHALL set `og:image` to a URL beginning with the Site_Origin unless the underlying image resolver already returns an absolute HTTPS URL.
5. THE Sitemap SHALL list only URLs whose origin equals the Site_Origin.
6. THE Robots_File SHALL reference the Sitemap using the Site_Origin.
7. THE Site_Origin SHALL NOT equal `https://xayrusha.uz`.

### Requirement 11: Per-Route SEO Metadata

**User Story:** As a visitor sharing a link, I want the previewed title and description to describe the specific page, so that the New_Owner's site presents accurate previews on social platforms and search engines.

#### Acceptance Criteria

1. WHEN the Home route renders, THE SEO_Engine SHALL set the document `<title>` to the New_Owner's default site title retrieved from the Content_Store, where the title is a non-empty string between 1 and 60 characters.
2. WHEN the Work list route renders, THE SEO_Engine SHALL set the document `<title>` to a string that contains the literal word "Work" and the New_Owner's display alias, with total length between 1 and 60 characters.
3. WHEN a Work Detail route renders for a project whose identifier exists in the Content_Store, THE SEO_Engine SHALL set the document `<title>` to the exact string `{project.name} | Work | {owner.alias}` and truncate to 60 characters if the composed string exceeds that length.
4. WHEN a Work Detail route renders for a project whose identifier exists in the Content_Store, THE SEO_Engine SHALL set the `<meta name="description">` content to the project's `description` value when it is a non-empty string, otherwise to the project's `tagline` when it is a non-empty string, otherwise to the site default description from the Content_Store, with the resulting value truncated to a maximum of 160 characters.
5. IF the current path does not match the Home route, the Work list route, or a Work Detail route whose project identifier exists in the Content_Store, THEN THE SEO_Engine SHALL set `<meta name="robots">` to the exact value `noindex, nofollow` and prepend the exact prefix `404 | Page not found | ` to the document `<title>`.
6. THE SEO_Engine SHALL read the site default title, default description, and default OG image from a single Content_Store entry and SHALL NOT define these values in any other location.
7. WHEN any route renders and the required Content_Store entry is unavailable or its title, description, or OG image field is missing or empty, THEN THE SEO_Engine SHALL set the document `<title>` to the literal string `Portfolio`, set `<meta name="description">` to an empty string, and omit the OG image meta tag.

### Requirement 12: Structured Data Personalization

**User Story:** As a search engine, I want the site's structured data to identify the New_Owner, so that rich results and knowledge panels reflect the correct person.

#### Acceptance Criteria

1. THE Structured_Data SHALL contain exactly one `WebSite` entity whose `url` equals the Site_Origin with a trailing slash and whose `name` equals the New_Owner's display alias.
2. THE Structured_Data SHALL contain exactly one `Person` entity whose `name` equals the New_Owner's full legal name.
3. THE Structured_Data `Person.alternateName` array SHALL contain the New_Owner's display alias and any additional aliases from the Content_Store, and SHALL NOT contain a Previous_Owner_Reference alias.
4. THE Structured_Data `Person.url` SHALL equal the Site_Origin with a trailing slash.
5. THE Structured_Data `Person.image` SHALL be an absolute HTTPS URL beginning with the Site_Origin.
6. THE Structured_Data `Person.jobTitle` array SHALL contain the New_Owner's role strings from the Content_Store.
7. THE Structured_Data `Person.address.addressCountry` SHALL equal the New_Owner's ISO-3166-1 alpha-2 country code from the Content_Store.
8. THE Structured_Data `Person.sameAs` array SHALL contain the resolved non-`#` HTTPS URLs from `socialLinks` and SHALL NOT contain any Previous_Owner_Reference URL.

### Requirement 13: Sitemap and Robots Alignment

**User Story:** As a search engine crawler, I want an accurate sitemap and robots policy, so that I index every published route of the New_Owner's site and nothing else.

#### Acceptance Criteria

1. THE Sitemap SHALL contain exactly one `<url>` entry for the Home route.
2. THE Sitemap SHALL contain exactly one `<url>` entry for the Work list route.
3. FOR EACH entry in the Project_Catalog, THE Sitemap SHALL contain exactly one `<url>` entry whose `<loc>` equals `{Site_Origin}/work/{project.id}`.
4. THE Sitemap SHALL NOT contain any `<url>` entry referencing a project `id` that is absent from the Project_Catalog.
5. THE Robots_File SHALL emit `Allow: /` for user-agent `*` and SHALL reference the Sitemap URL.

### Requirement 14: GitHub Widget Configuration

**User Story:** As the New_Owner, I want the optional GitHub latest-push widget to read from my GitHub account, so that visitors see activity from my public repositories.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL read the GitHub username used by the GitHub_Widget from the `VITE_GITHUB_USERNAME` environment variable.
2. THE `.env.example` file SHALL declare `VITE_GITHUB_USERNAME` with the New_Owner's GitHub username as the example value.
3. THE tracked `.env` file, if present in the repository, SHALL declare `VITE_GITHUB_USERNAME` with the New_Owner's GitHub username or shall be absent from version control.
4. IF `VITE_GITHUB_USERNAME` is unset at runtime, THEN THE GitHub_Widget SHALL either render a neutral empty state or unmount without throwing an unhandled error.
5. THE `VITE_GITHUB_USERNAME` value SHALL NOT equal `XayrulloWeb`.

### Requirement 15: Locale Configuration

**User Story:** As the New_Owner, I want the site's declared locale and language attribute to match my target audience, so that assistive tech and social platforms treat the content correctly.

#### Acceptance Criteria

1. THE `index.html` `<html>` element SHALL declare a `lang` attribute matching the New_Owner's primary content language as a BCP-47 tag.
2. THE SEO_Engine SHALL emit `og:locale` using the underscore-delimited locale form corresponding to the `<html lang>` value.
3. THE `<html lang>` attribute and the `og:locale` meta content SHALL refer to the same language.

### Requirement 16: Removal of Previous Owner References

**User Story:** As the New_Owner, I want no residual mention of the previous owner anywhere in the shipped bundle or repository, so that the handoff is clean and no visitor or crawler encounters legacy identity.

#### Acceptance Criteria

1. THE Portfolio_Site production bundle SHALL NOT contain the literal substrings `Xayrusha`, `xayrusha`, `Raxmonberganov`, `XayrulloWeb`, `xayrullo01_02`, `xayrulloweb@gmail.com`, or `xayrusha.uz` (case-insensitive), except within Git history or unversioned local files.
2. THE tracked source tree SHALL NOT contain the literal substrings listed in criterion 1 (case-insensitive), except within Git history, this requirements document, this spec's design and tasks documents, or the `CHANGELOG` if present.
3. THE `public/` directory SHALL NOT contain filenames beginning with `xayrusha-`.
4. THE `src/assets/` directory SHALL NOT contain a folder named `Me` whose sole image is the Previous_Owner_Reference's portrait; the folder MAY be renamed or MAY host the New_Owner's portrait instead.
5. IF a project from the Previous_Owner_Reference is retained for the New_Owner, THEN the retained entry SHALL explicitly attribute the Previous_Owner_Reference in its `collaborators` array and the removal check in criterion 1 SHALL exempt that attribution string in bundled JavaScript.

### Requirement 17: Documentation Update

**User Story:** As a future maintainer, I want the README and environment example to describe the New_Owner's site, so that onboarding matches the deployed reality.

#### Acceptance Criteria

1. THE `README.md` file SHALL name the New_Owner's site in its top-level heading and introductory paragraph.
2. THE `README.md` file SHALL document the Site_Origin under the SEO section rather than `https://xayrusha.uz`.
3. THE `README.md` file SHALL document the `VITE_GITHUB_USERNAME` variable with the New_Owner's GitHub username.
4. THE `README.md` file SHALL preserve the existing sections describing tech stack, features, project structure, scripts, and testing.

### Requirement 18: Test Suite Alignment

**User Story:** As the New_Owner, I want the automated tests to pass after rebranding, so that regressions in the Content_Store, routing, or hero are caught in CI.

#### Acceptance Criteria

1. THE Test_Suite SHALL execute `npm test` and exit with status code zero after the rebrand changes.
2. WHERE existing tests reference Previous_Owner_Reference strings or Project_Catalog contents, THE tests SHALL be updated to reference the New_Owner and the updated Project_Catalog.
3. THE Test_Suite SHALL include at least one data-integrity test that asserts every Project_Catalog entry conforms to the field requirements in Requirement 5.
4. THE Test_Suite SHALL include at least one test that asserts the Content_Store's owner profile fields are non-empty strings.

### Requirement 19: Visual and Motion Continuity

**User Story:** As a visitor, I want the site to look and feel identical in interaction quality to the original, so that only identity and content change, not usability.

#### Acceptance Criteria

1. WHEN a route renders after the rebrand, THE Portfolio_Site SHALL preserve the existing Motion, GSAP, Lenis smooth scroll, cursor glow, particle field, and scroll progress behaviors.
2. THE HeroSection, TopCardsSection, SkillsSection, MarqueeRibbon, AboutSection, BlogsSection, TestimonialsSection, BehindCurtains, and FooterSection SHALL remain composed on the Home route in their current order.
3. THE Portfolio_Site SHALL preserve the skip-to-content link, focus-visible outlines, and `main#main-content` landmark.
4. THE Portfolio_Site SHALL respond to the `/`, `/work`, `/work/:projectId`, and unknown routes with the same page shells as before the rebrand.

### Requirement 20: Palette and Theme Adjustments (Optional)

**User Story:** As the New_Owner, I want the option to change accent colors and script font emphasis, so that the visual identity can be tuned without altering layout.

#### Acceptance Criteria

1. WHERE the New_Owner requests palette adjustments, THE Portfolio_Site SHALL apply the requested accent color changes exclusively through `src/styles/theme.css` and Tailwind config, without editing layout or motion code.
2. WHERE the New_Owner requests palette adjustments, THE Portfolio_Site SHALL retain the existing dark base (`#07090d`) unless the New_Owner explicitly specifies a different base color.
3. WHERE the New_Owner requests a font change, THE Portfolio_Site SHALL update the font family via `@fontsource-variable/geist` or an equivalent variable font import, without breaking the existing typographic scale.

### Requirement 21: Build and Deployment Readiness

**User Story:** As the New_Owner, I want to ship the rebranded site with one build command, so that the handoff can be deployed immediately.

#### Acceptance Criteria

1. WHEN `npm run build` executes after the rebrand, THE build SHALL exit with status code zero.
2. WHEN `npm run lint` executes after the rebrand, THE lint SHALL exit with status code zero.
3. WHEN the production preview served by `npm run preview` is loaded at `/`, `/work`, `/work/{first_project_id}`, and `/does-not-exist`, THE Portfolio_Site SHALL render each route without console errors originating from the application code.
4. THE production `dist/` output SHALL include the New_Owner's favicon, brand marks, OG preview image, and portrait.
