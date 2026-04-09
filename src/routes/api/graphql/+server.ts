import { resolvers } from '$lib/server/graphql/resolvers'
import { typeDefs } from '$lib/server/graphql/schema'
import { createSchema, createYoga } from 'graphql-yoga'

import type { RequestHandler } from './$types'

const yoga = createYoga({
  fetchAPI: globalThis,
  graphqlEndpoint: '/api/graphql',
  schema: createSchema({ resolvers, typeDefs }),
})

export const GET: RequestHandler = async ({ request }) => {
  const response = await yoga.fetch(request)
  return new Response(response.body, {
    headers: Object.fromEntries(response.headers.entries()),
    status: response.status,
  })
}

export const POST: RequestHandler = async ({ request }) => {
  const response = await yoga.fetch(request)
  return new Response(response.body, {
    headers: Object.fromEntries(response.headers.entries()),
    status: response.status,
  })
}
