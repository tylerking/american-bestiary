import type { CreateCreatureInput } from '$lib/types'

import { json } from '@sveltejs/kit'
import { create, findAll } from '$lib/server/creatures'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
  const region = url.searchParams.get('region') ?? undefined
  const classification = url.searchParams.get('classification') ?? undefined
  const limit = Number(url.searchParams.get('limit')) || 100
  const page = Number(url.searchParams.get('page')) || 1

  const creatures = await findAll({ classification, limit, page, region })
  return json(creatures)
}

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as CreateCreatureInput

  if (!body.name || !body.region || !body.abstract) {
    return json({ error: 'name, region, and abstract are required' }, { status: 400 })
  }

  const creature = await create({
    abstract: body.abstract,
    anatomy: body.anatomy,
    behavior: body.behavior,
    classification: body.classification,
    ecology: body.ecology,
    etymology: body.etymology,
    mythology: body.mythology,
    name: body.name,
    region: body.region,
    visual: body.visual,
  })

  return json(creature, { status: 201 })
}
