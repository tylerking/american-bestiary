# American Bestiary

A modern bestiary that catalogs the legendary creatures of North America. Where medieval scholars used parchment and allegory, this project applies a pseudo-scientific classification system to document the anatomy, ecology, behavior, and mythology of the continent's most enduring cryptids.

The site doubles as a working REST and GraphQL API, so the same specimens that appear in the browser can be queried by anyone building against the data.

## Features

- Browseable catalog of cryptids with detail pages, regional grouping, and an archive view
- REST API with filtering by region and classification, plus pagination
- GraphQL API backed by the same data layer
- OpenAPI 3 spec served at `/api/docs`, rendered with Scalar
- Health check endpoint at `/api/health`
- Full-text creature search powered by a shared filter utility
- Type-safe data model shared between server, client, and tests
- Containerized dev environment and reproducible cloud infrastructure

## Tech Stack

### Application
- **[SvelteKit](https://kit.svelte.dev)** (Svelte 5) for routing, SSR, and the API layer
- **[TypeScript](https://www.typescriptlang.org)** across the entire codebase
- **[Vanilla Extract](https://vanilla-extract.style)** for type-safe, zero-runtime CSS with design tokens
- **[GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)** for the GraphQL endpoint
- **[Scalar](https://scalar.com)** for interactive API reference docs

### Data
- **[MongoDB](https://www.mongodb.com)** as the primary datastore, accessed through the official Node driver
- A `seed` script (`pnpm seed`) populates the database from the local fixtures in `src/lib/data`

### Tooling
- **[Vite](https://vite.dev)** for dev server and builds
- **[Vitest](https://vitest.dev)** for unit tests
- **[Playwright](https://playwright.dev)** for end-to-end tests
- **[ESLint](https://eslint.org)** with `typescript-eslint`, `eslint-plugin-svelte`, and `eslint-plugin-perfectionist`
- **[svelte-check](https://www.npmjs.com/package/svelte-check)** for Svelte and TypeScript diagnostics
- **[pnpm](https://pnpm.io)** as the package manager

### Infrastructure
- **[Netlify](https://www.netlify.com)** hosts the deployed site via `@sveltejs/adapter-netlify`
- **[Docker](https://www.docker.com)** + Compose provide a reproducible local environment
- **[Terraform](https://www.terraform.io)** provisions the MongoDB Atlas cluster and Netlify site as code

## Project Layout

```
src/
  lib/
    components/   Svelte components (elements, sections, pages)
    data/         Static seed data and content for the home and archive pages
    server/       MongoDB client, REST handlers, GraphQL schema and resolvers, OpenAPI spec
    styles/       Vanilla Extract themes, tokens, and global styles
    types/        Shared TypeScript types
    utils/        Shared utilities (e.g. creature filtering)
  routes/
    api/          REST, GraphQL, OpenAPI docs, and health endpoints
    archives/     Archive index and per-region pages
    creatures/    Catalog index and per-creature detail pages
scripts/          Database seed script
terraform/        Infrastructure as code for MongoDB Atlas and Netlify
tests/
  unit/           Vitest unit tests
  e2e/            Playwright end-to-end tests with page objects and fixtures
```

## Getting Started

### Prerequisites
- Node.js 22
- pnpm
- A MongoDB connection string (local or Atlas)

### Install
```sh
pnpm install
```

### Configure
Copy `.env.example` to `.env` and fill in your MongoDB connection string:

```sh
cp .env.example .env
```

`MONGODB_URI` is the only required variable. The database name (`bestiary`) and collection (`creatures`) are set in `src/lib/server/db.ts`.

### Seed the database
```sh
pnpm seed
```

### Run the dev server
```sh
pnpm dev
```

### Run with Docker
```sh
docker compose up
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the SvelteKit dev server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview the production build |
| `pnpm check` | Run `svelte-check` and TypeScript diagnostics |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with autofix |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm test:watch` | Run unit tests in watch mode |
| `pnpm test:e2e` | Run Playwright end-to-end tests |
| `pnpm seed` | Seed MongoDB from local fixtures |

## API

### REST
- `GET /api/creatures` — list creatures, with optional `region`, `classification`, `limit`, and `page` query parameters
- `POST /api/creatures` — create a creature (`name`, `region`, and `abstract` are required)
- `GET /api/creatures/[id]` — fetch a single creature
- `PATCH /api/creatures/[id]` — update a creature
- `DELETE /api/creatures/[id]` — remove a creature
- `GET /api/health` — service health check
- `GET /api/docs` — OpenAPI 3 specification

### GraphQL
- `POST /api/graphql` — GraphQL endpoint backed by the same data layer as the REST API

## Testing

Unit tests live in `tests/unit` and run under Vitest. End-to-end tests live in `tests/e2e` and use Playwright with a page object pattern and shared fixtures.

```sh
pnpm test
pnpm test:e2e
```

## Deployment

The site is deployed to Netlify via `@sveltejs/adapter-netlify`. The MongoDB Atlas cluster and Netlify site are both managed in `terraform/`, so the entire production environment can be recreated from source.

## Credits

- Concept and illustrations from [The American Bestiary](https://tavomontanez.art/the-american-bestiary)

## License

MIT
