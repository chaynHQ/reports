# Chayn Next.js Starter

A production-ready Next.js starter for building Chayn web projects — multilingual, accessible, GDPR-compliant, and built with Chayn's design system.

This starter includes everything a Chayn project needs out of the box: i18n (English + Hindi), Rollbar error logging, cookie-gated analytics (GA4, Hotjar, Vercel Analytics), and a full CI/E2E test pipeline. Fork it, customise the content, and ship.

## Technologies

- [Next.js 16](https://nextjs.org/) — App Router, React Server Components, static rendering
- [React 19](https://react.dev/) — UI component library
- [TypeScript 5](https://www.typescriptlang.org/) — strict type safety throughout
- [Tailwind CSS 4](https://tailwindcss.com/) — utility-first styling with design tokens
- [next-intl 4](https://next-intl.dev/) — i18n with English (UK) and Hindi (Latin script); RTL-ready
- [Rollbar](https://rollbar.com/) — GDPR-compliant error logging (IP anonymised, no fingerprinting)
- [GA4](https://analytics.google.com/), [Hotjar](https://www.hotjar.com/), [Vercel Analytics](https://vercel.com/analytics) — analytics gated behind explicit cookie consent
- [Cypress 15](https://www.cypress.io/) — end-to-end testing
- [GitHub Actions](https://github.com/features/actions) — CI pipeline

## Local development

### Prerequisites

- Node.js 24+
- npm 11+

### Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/chaynHQ/<your-repo>.git
   cd <your-repo>
   npm install
   ```

2. Copy the example environment file and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   See [`.env.example`](.env.example) for all available variables. All integrations are optional — the app runs without any of them.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available scripts

```bash
npm run dev              # development server with Turbopack
npm run build            # production build
npm run start            # production server (requires build first)
npm run lint             # ESLint
npm run type-check       # TypeScript type checking

npm run cypress          # Cypress Test Runner (opens Cypress UI)
npm run cypress:headless # run all tests headlessly
```

### Running E2E tests

The `e2e` script starts the production server automatically and runs all Cypress specs:

```bash
npm run build
npm run e2e
```

## Customising for your project

### Content and copy

All visible text is managed through the translation files — this is the single source of truth:

- `messages/en.json` — UK English (default)
- `messages/hi.json` — Hindi in Latin script

Update `site.title`, `site.description`, `home.heading`, and `home.intro` for your project's identity. Add translation files in `messages/` for any additional locales.

### Navigation

Edit `components/layout/TopNav.tsx` to add nav items. The `navItems` array is empty by default — add `NavLinkItem` or `NavDropdownItem` entries as needed:

```ts
// Plain link
{ type: "link", href: "/about", label: "About" }

// Dropdown menu
{ type: "dropdown", id: "my-menu", label: "Menu", menuLabel: "Site sections",
  items: [{ href: "/section-one", label: "Section One" }] }
```

### Logo

The nav currently displays a text logo using the `nav.siteName` translation key. To use an image logo:

1. Add your logo file to `public/` (e.g. `public/logo.svg`)
2. Replace the `<span>` in `TopNav.tsx` with a Next.js `<Image>` component

### Branding and design

- Replace `/public/favicon.ico`, `/public/og-image.png`, `/public/apple-touch-icon.png`, and `/app/icon.png` with your own assets
- Update the colour palette in `app/globals.css` under `@theme inline`
- Update font choices in `app/[locale]/layout.tsx`

### Metadata

`app/[locale]/layout.tsx` generates metadata (title, description, Open Graph, Twitter cards) from `messages/<locale>.json`. Set `NEXT_PUBLIC_SITE_URL` in your environment to your production domain.

### Internationalisation

- Add or remove locales in `i18n/routing.ts`
- Add the corresponding writing direction in `lib/locale-dir.ts` (RTL is supported)
- Add a translation file at `messages/<locale>.json` matching the structure of `messages/en.json`

### Integrations

All integrations are optional and configured via environment variables (see `.env.example`):

| Integration                                | Purpose                  | Required?                  |
| ------------------------------------------ | ------------------------ | -------------------------- |
| [Rollbar](https://rollbar.com/)            | Error logging            | Recommended for production |
| [GA4](https://analytics.google.com/)       | Page and event analytics | Optional                   |
| [Hotjar](https://www.hotjar.com/)          | Session insights         | Optional                   |
| Vercel Analytics                           | Traffic analytics        | Auto-configured on Vercel  |
| [Cypress Cloud](https://cloud.cypress.io/) | CI test recording        | Optional                   |

### Deploying

This project is optimised for [Vercel](https://vercel.com/). Connect your repository and add your environment variables in the Vercel project settings. Set `NEXT_PUBLIC_SITE_URL` to your production domain.

## Architecture notes

- **React Server Components by default** — only components using hooks, browser APIs, or animation libraries are client components (`"use client"`)
- **No `clsx` or `tailwind-merge`** — use raw Tailwind template literals
- **State** — Zustand for shared client state
- **GDPR** — no tracking scripts load without explicit cookie consent; Rollbar anonymises IPs and disables fingerprinting

See `CLAUDE.md` for detailed architectural rules and conventions.

## Contributing

We warmly welcome contributions from the community. ⭐

Before making a contribution, please read our [Contributing Guidelines](CONTRIBUTING.md) and agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Support Chayn

Chayn is proudly open-source and built with volunteer contributions.

**Please consider giving this repository a star ⭐ and following our [GitHub profile](https://github.com/chaynHQ) to help us grow our open-source community.**

Support our mission further by [sponsoring us on GitHub](https://github.com/sponsors/chaynHQ), exploring [our volunteer programmes](https://www.chayn.co/get-involved), and following us on [social media](https://linktr.ee/chayn).

## Licence

This project is licensed under the [MIT Licence](LICENCE.md).
