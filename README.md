# Welcome to Chayn Reports

[![Cypress E2E](https://github.com/chaynHQ/reports/actions/workflows/cypress.yml/badge.svg)](https://github.com/chaynHQ/reports/actions/workflows/cypress.yml)

[Chayn Reports](https://reports.chayn.co) is an open-source, multilingual platform for publishing Chayn's research and impact reports as accessible, high-performance scrollytelling experiences. Built to be engaging in multiple languages and privacy-first.

Since 2013, [Chayn](https://www.chayn.co/about) has reached over 500,000 survivors worldwide through trauma-informed, survivor-centred, and intersectional approaches — using open-source technology for positive social impact. These reports share our research, findings, and the voices of the communities we work with.

Explore Chayn's [website](https://www.chayn.co/about), [research](https://org.chayn.co/research), [resources](https://www.chayn.co/resources), [projects](https://org.chayn.co/projects), [impact](https://org.chayn.co/impact), and [support services directory](https://www.chayn.co/global-directory). 💖

## Technologies used

- [Next.js 16](https://nextjs.org/) — App Router, React Server Components, static rendering
- [React 19](https://react.dev/) — UI component library
- [TypeScript 5](https://www.typescriptlang.org/) — strict type safety throughout
- [Tailwind CSS 4](https://tailwindcss.com/) — utility-first styling with design tokens
- [next-intl 4](https://next-intl.dev/) — i18n with English (UK) and Hindi (Latin script)
- [Rollbar](https://rollbar.com/) — GDPR-compliant error logging (IP anonymised, no fingerprinting)
- [GA4](https://analytics.google.com/), [Hotjar](https://www.hotjar.com/), [Vercel Analytics](https://vercel.com/analytics) — analytics gated behind explicit cookie consent
- [Lenis](https://lenis.darkroom.engineering/) + [GSAP 3](https://gsap.com/) — smooth scroll engine and animation library, sharing a single rAF loop
- [Zustand 5](https://zustand-demo.pmnd.rs/) — lightweight global state (active chapter, audio, interaction flags)
- [Cypress 15](https://www.cypress.io/) — end-to-end testing
- [GitHub Actions](https://github.com/features/actions) — CI pipeline

## Local development

### Prerequisites

- Node.js 24+
- npm 11+

### Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/chaynHQ/reports.git
   cd reports
   npm install
   ```

2. Copy the example environment file and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   See [`.env.example`](.env.example) for all available variables and guidance on where to obtain them. If you're an official Chayn volunteer, ask the team for access to the shared environment variables.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available scripts

```bash
npm run dev            # development server with Turbopack
npm run build          # production build
npm run start          # production server (requires build first)
npm run lint           # ESLint

npm run cypress        # Cypress Test Runner (opens cypress UI to run test suites)
npm run cypress:headless # Cypress Headless Runner (runs all tests without cypress UI)
```

See all scripts in `package.json`

### Running E2E tests

The `e2e` script starts the production server automatically and runs all Cypress specs headlessly:

```bash
npm run build
npm run e2e
```

## Using this as a template (open source implementations)

This codebase is designed to be forked and adapted. Here's what to update when building your own report on this platform:

### Branding and design

- Replace `/public/chayn_logo.png`, `/public/favicon.ico`, `/public/og-image.png`, `/public/apple-touch-icon.png` and `/app/icon.png` with your own assets
- Update the colour palette in `app/globals.css` under `@theme inline`
- Update font choices in `app/[locale]/layout.tsx`

### Site copy and metadata

- Update `messages/en.json` with your site title, description, nav labels, and footer copy — this is the single source of truth for all visible text
- Add translation files in `messages/` for any additional locales you support

### Navigation and footer

- Edit `components/layout/TopNav.tsx` to update nav items and the header CTA link (currently points to `chayn.co`)
- Edit `components/layout/Footer.tsx` to update the footer link columns, social media links, and charity registration details

### Integrations

Each integration is optional — the app runs without any of them. Configure via environment variables (see `.env.example`):

| Integration                                | Purpose                  | Required?                  |
| ------------------------------------------ | ------------------------ | -------------------------- |
| [Rollbar](https://rollbar.com/)            | Error logging            | Recommended for production |
| [GA4](https://analytics.google.com/)       | Page and event analytics | Optional                   |
| [Hotjar](https://www.hotjar.com/)          | Session insights         | Optional                   |
| Vercel Analytics                           | Traffic analytics        | Auto-configured on Vercel  |
| [Cypress Cloud](https://cloud.cypress.io/) | CI test recording        | Optional                   |

### Internationalisation

- Add or remove locales in `i18n/routing.ts` (the `locales` array)
- Add the corresponding writing direction in `lib/locale-dir.ts`
- Add a translation file at `messages/<locale>.json` matching the structure of `messages/en.json`

### Deploying

This project is optimised for [Vercel](https://vercel.com/). Connect your repository and add your environment variables in the Vercel project settings. Set `NEXT_PUBLIC_SITE_URL` to your production domain.

## Contributing

We warmly welcome contributions from the community. ⭐

Before making a contribution, please read our [Contributing Guidelines](CONTRIBUTING.md) and agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

New contributors should start with the [Contributing Guidelines](CONTRIBUTING.md) — they cover how to pick up issues, our branching conventions, and what to expect from the review process.

Happy coding! 💖

## Support our work

Chayn is proudly open-source and built with volunteer contributions. We are grateful for the generosity of the open-source community.

**Please consider giving this repository a star ⭐ and following our [GitHub profile](https://github.com/chaynHQ) to help us grow our open-source community and find more contributors like you!**

Support our mission further by [sponsoring us on GitHub](https://github.com/sponsors/chaynHQ), exploring [our volunteer programmes](https://www.chayn.co/get-involved), and following us on [social media](https://linktr.ee/chayn).

## Licence

This project is licensed under the [MIT Licence](LICENCE.md).

Chayn Reports and all of Chayn's projects are open-source. While the core tech stack is open-source, some external integrations used in production may require subscriptions.
