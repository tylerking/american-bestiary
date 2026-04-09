import type { CreateCreatureInput, Creature, UpdateCreatureInput } from '$lib/types'

import { slugify } from '$lib/utils/slugify'
import { ObjectId } from 'mongodb'

import { getCreaturesCollection } from './db'

export async function create(input: CreateCreatureInput): Promise<Creature> {
  const collection = getCreaturesCollection()
  const now = new Date()
  const doc = { ...input, createdAt: now, updatedAt: now }
  const result = await collection.insertOne(doc as Creature)
  return { ...doc, _id: result.insertedId } as Creature
}

export async function findAll(options?: {
  classification?: string
  limit?: number
  page?: number
  region?: string
}): Promise<Creature[]> {
  const collection = getCreaturesCollection()
  const filter: Record<string, unknown> = {}

  if (options?.region) filter.region = { $options: 'i', $regex: options.region }
  if (options?.classification) filter.classification = { $options: 'i', $regex: options.classification }

  const limit = options?.limit ?? 100
  const page = options?.page ?? 1
  const skip = (page - 1) * limit

  return collection.find(filter).sort({ name: 1 }).skip(skip).limit(limit).toArray()
}

export function findBySlug(
  slug: string,
  allCreatures: Creature[],
): Creature | null {
  return allCreatures.find((creature) => slugify(creature.name) === slug) ?? null
}

export async function findOne(id: string): Promise<Creature | null> {
  const collection = getCreaturesCollection()
  return collection.findOne({ _id: new ObjectId(id) })
}

export async function remove(id: string): Promise<boolean> {
  const collection = getCreaturesCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}

export async function update(
  id: string,
  input: UpdateCreatureInput,
): Promise<Creature | null> {
  const collection = getCreaturesCollection()
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...input, updatedAt: new Date() } },
    { returnDocument: 'after' },
  )
  return result
}
