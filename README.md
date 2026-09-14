# American Bestiary

Fifty cryptids, one per state, catalogued like a medieval bestiary. Each specimen is named, classified, and weighed against the account that produced it; the verdict sits in the margin and sorts the archive.

## Stack

- **SvelteKit 2** and **Svelte 5** on **Netlify** through `@sveltejs/adapter-netlify`
- **Postgres** through **Drizzle ORM** and `node-postgres`; Netlify DB in production, migrations applied before every build
- The fifty original plates in `static/images`, served unaltered; the **Netlify Image CDN** makes the small and medium sizes on request, and plates uploaded in the admin go to **Netlify Blobs**
- **Vanilla Extract** for styles: primitives in `tokens.ts`, roles in `theme.css.ts`
- **Zod** at every boundary, **Scalar** for the API reference
- **Biome**, **svelte-check**, **knip**, **jscpd**, **Vitest**, **Playwright** with **axe**

```
src/
  hooks.server.ts         admin guard by route id, security headers
  error.html              static fallback page (values mirrored from tokens, test-guarded)
  lib/
    assets/us-map.json    the map, cleaned from the source SVG
    archive.ts            archive filtering, grouping, query strings
    codex.ts              codex order, alt text, territory slugs
    enums.ts              kinds, statuses, rubrics, the fifty territories
    revisions.ts          field-level snapshot diffs
    schemas.ts            every Zod schema
    labels/               interface labels, defaults, and editable overrides
    components/
      elements/           Text, Button, Plate, SpecimenCard, Gloss, FilterRow, ...
      layout/             AppShell, Header, ThemeColor, Footer, Seo, ...
      sections/           Incipit, TerritoryMap, Specimen, MonthlyTheme, Entry*
      pages/              HomePage, ArchivePage, EntryPage, ErrorPage
      admin/              dashboard charts, editors, revision history
    server/
      db/                 schema, queries, content writes with revisions, snapshots
      auth/               scrypt passwords, sessions, HMAC'd rate limits
      http/               cache headers, form parsing, _headers parsing
      media/              Netlify Blobs storage
      analytics/          dashboard queries and mock data
      api.ts, openapi.ts  public API serialisation and the OpenAPI document
  routes/
    (site)/               map, archives, creatures/[slug]
    admin/                dashboard, specimens, themes, globals, preview
    api/                  creatures, themes/current, health, docs, openapi.json, event
drizzle/                  generated migrations
netlify/functions/        monthly cache purge for the theme of the month
scripts/
  seed.ts                 content seed (localhost only without --force-production)
  seed-content/           the fifty specimens, twelve themes, and site settings
  set-password.ts         reset an admin password and sign out its sessions
static/images/            the fifty original plates, served unaltered
static/fonts/             Fraunces variable fonts (roman and italic), full axes
tests/
  setup/, helpers/        database reset, factories, request helpers
  component/              jsdom component tests
  integration/            database-backed tests
  e2e/                    Playwright specs and the preview server
```

## Local setup

Requires Node 24 and pnpm, plus Docker for Postgres.

```bash
docker run -d --name bestiary-pg -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bestiary -p 5434:5432 postgres:16
cp .env.example .env    # fill in the values below
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev                # http://localhost:5173
```

The first sign-in at `/admin/login` with `ADMIN_EMAIL` and `ADMIN_PASSWORD` creates the admin account.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string. Tests derive `<name>_test` and `<name>_e2e` from it. For a hosted database, require TLS (for example `?sslmode=verify-full`). |
| `APP_SECRET` | yes | At least 32 characters. Keys the HMAC on rate-limit client addresses. |
| `ADMIN_EMAIL` | first run | Email of the admin created on the first sign-in. Remove it once that account exists. |
| `ADMIN_PASSWORD` | first run | At least 12 characters. Remove it once that account exists; change the password with `pnpm set-password`. |
| `VITE_IMAGE_CDN` | set in `netlify.toml` | `true` routes plates through `/.netlify/images`. |

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm preview` | Production build and local preview |
| `pnpm check` | `svelte-kit sync` and `svelte-check` |
| `pnpm lint` / `pnpm lint:fix` | Biome |
| `pnpm knip` | Unused files, exports, and dependencies |
| `pnpm dup` | jscpd duplication check |
| `pnpm db:generate` | Generate a migration from `src/lib/server/db/schema.ts` |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:seed` | Replace specimens, themes, settings, and their revisions |
| `pnpm set-password <email>` | Set an admin password and end that user's sessions |
| `pnpm test` | All Vitest projects |
| `pnpm test:unit` / `test:component` / `test:integration` | One Vitest project |
| `pnpm test:coverage` | Vitest with coverage thresholds |
| `pnpm test:e2e` | Build, then Playwright |
| `pnpm verify` | Lint, check, knip, dup, coverage, and e2e |

## Tests

- **Unit** tests sit beside their source as `*.test.ts`; DOM-dependent ones are `*.dom.test.ts`.
- **Component** tests render Svelte components in jsdom.
- **Integration** tests run against a real Postgres database that is reset and migrated before the run and truncated before each test.
- **End to end** tests build the site, reset and seed an `_e2e` database, start a Netlify Blobs emulator with the plates, and run Playwright across Chromium, Firefox, WebKit, a Pixel 7, and an iPhone 14. Public and admin pages are checked with axe at WCAG 2.2 AA in light and dark.

Coverage thresholds for `src/**/*.ts`: 100% lines and functions, 99% statements, 90% branches.

## CI and deploys

GitHub Actions runs lint, check, knip, dup, a check that the committed migrations match the schema, coverage, and the Playwright suite against a Postgres service.

Netlify builds from the repository. Only production builds run migrations (`[context.production]` in `netlify.toml`), and they stop if `DATABASE_URL` is missing. Deploy previews and branch deploys only build, so give those contexts their own `DATABASE_URL` or they read and write production content. Keep migrations backward compatible, because they run before the new code goes live.

First production deploy:

1. Create the Postgres database and set `DATABASE_URL` for both builds and functions in the site's environment variables. If Netlify's database integration provides `NETLIFY_DATABASE_URL`, copy its value into `DATABASE_URL`.
2. Set `APP_SECRET` to at least 32 random characters. Sign-in and analytics refuse to run without it.
3. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD`, deploy, sign in once at `/admin/login` to create the account, then remove both variables.
4. Load the content into the new database: `DATABASE_URL=... pnpm db:seed --force-production`.
5. Netlify Blobs and the Image CDN need no setup.

To change the admin password later, run `DATABASE_URL=... pnpm set-password <email>`, which also ends that account's sessions.

Public pages are cached at the edge with the `content` tag. Admin saves purge it, and a scheduled function purges it on the first of each month so the theme of the month changes on time.

## Admin

`/admin` is guarded by the resolved route id, and every form action checks the session again.

- **Dashboard.** Visits, entry views, and outbound clicks, with a table view for every chart.
- **Specimens.** The fifty, grouped by kind and sortable. Each editor covers every field, the plate, publishing, a preview of unpublished entries, and revision history with a field-level diff and restore. The roster is fixed: there is no create or delete.
- **Themes.** Twelve months, each with a title, description, and four specimen slots with a note per slot.
- **Globals.** Site name, tagline, incipit, footer credit, and every interface label.

Every save writes a revision with its author.

## Theming

Colors are primitives in `src/lib/styles/tokens.ts` and roles in `src/lib/styles/theme.css.ts`. No hex value appears anywhere else, and a test enforces it (the static `src/error.html` mirrors the tokens and is checked against them).

The site follows the reader's operating system setting. Light and dark are the same roles assigned twice in `theme.css.ts`, switched by `prefers-color-scheme`, so there is no toggle, no cookie, no script, and nothing stored in the browser.

## Analytics and privacy

Google Tag Manager (container `GTM-5F34B659`, the same container as the previous site) loads on public pages from `src/app.html`. It never loads on admin pages: `hooks.server.ts` strips the marked tag block from every `/admin` response. The content security policy in `svelte.config.js` allows its loader script by hash and the Google Tag Manager and Google Analytics domains it needs.

The admin dashboard reads its own first-party beacons: page views and outbound link clicks are sent to `/api/event`. Those beacons set no cookie, honour Do Not Track, ignore bots, and reduce referrers to their host. IP addresses are never stored; the rate limiter keeps only an HMAC of the address that expires with its window.

## Security

- Content Security Policy in hash mode, with security headers from `_headers` applied to rendered responses too.
- Admin sessions use a random token stored only as a SHA-256 digest, in an `__Host-` cookie that is HttpOnly, Secure, and SameSite=Strict, with idle and absolute expiry.
- Passwords are hashed with scrypt. Failed sign-ins are limited per network (IPv4 address or IPv6 /64), and repeated failures for one account slow every attempt down instead of locking the account, so nobody can lock the admin out.
- Analytics beacons are limited per network and overall, and events older than 13 months are deleted.
- Uploads are identified by their bytes, not their declared type, and served with a sandboxing CSP. A replaced plate stays in Blobs under its random key so an earlier revision can restore it.
- The public API is read-only and never returns unpublished specimens.

## Credits and licensing

Illustrations by [Tavo Montañez](https://tavomontanez.art/the-american-bestiary), from *The American Bestiary*. They are his work and are **not** covered by this repository's license.

The source code is MIT licensed. The license excludes `static/images/` and every image in the repository; see [LICENSE](LICENSE).
