import type { UpdateCreatureInput } from '$lib/types'

import { json } from '@sveltejs/kit'
import { findOne, remove, update } from '$lib/server/creatures'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
  const creature = await findOne(params.id)
  if (!creature) {
    return json({ error: `Creature #${params.id} not found` }, { status: 404 })
  }
  return json(creature)
}

export const PATCH: RequestHandler = async ({ params, request }) => {
  const body = (await request.json()) as UpdateCreatureInput
  const creature = await update(params.id, body)
  if (!creature) {
    return json({ error: `Creature #${params.id} not found` }, { status: 404 })
  }
  return json(creature)
}

export const DELETE: RequestHandler = async ({ params }) => {
  const deleted = await remove(params.id)
  if (!deleted) {
    return json({ error: `Creature #${params.id} not found` }, { status: 404 })
  }
  return new Response(null, { status: 204 })
}
