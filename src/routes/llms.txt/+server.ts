import { global } from '$lib/data/global'
import { findAll } from '$lib/server/creatures'
import { slugify } from '$lib/utils/slugify'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
  const creatures = await findAll({ limit: 100 })
  const origin = url.origin

  const creatureLines = creatures
    .map((c) => `- [${c.name}](${origin}/creatures/${slugify(c.name)}): ${c.region} — ${c.abstract}`)
    .join('\n')

  const body = `# American Bestiary

> ${global.site_meta.description} This modern bestiary applies a pseudo-scientific classification system to document the biological anatomy, ecological niches, behavioral profiles, etymology, and mythology of the most enduring cryptid legends of North America.

## Browse

- [Interactive Map](${origin}/): Explore cryptids by U.S. state
- [Cryptid Archives](${origin}/archives): ${global.archives_meta.description}

## Creatures

${creatureLines}

## API

- [OpenAPI Reference](${origin}/api/docs): Interactive REST API documentation
- [GraphQL Endpoint](${origin}/api/graphql): GraphQL API backed by the same data layer
- [List creatures](${origin}/api/creatures): REST endpoint for querying creatures, supports \`region\`, \`classification\`, \`limit\`, and \`page\` query parameters
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
