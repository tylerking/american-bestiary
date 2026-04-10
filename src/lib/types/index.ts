import type { ObjectId } from 'mongodb'

export interface CreateCreatureInput {
  abstract: string
  anatomy: string
  behavior: string
  classification: string
  color: string
  ecology: string
  etymology: string
  mythology: string
  name: string
  region: string
  source: string
  visual: string
}

export interface Creature extends CreateCreatureInput {
  _id: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

export type UpdateCreatureInput = Partial<CreateCreatureInput>
