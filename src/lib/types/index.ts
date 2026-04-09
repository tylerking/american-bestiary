import type { ObjectId } from 'mongodb'

export interface CreateCreatureInput {
  abstract: string
  anatomy: string
  behavior: string
  classification: string
  ecology: string
  etymology: string
  mythology: string
  name: string
  region: string
  visual: string
}

export interface Creature extends CreateCreatureInput {
  _id: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

export type UpdateCreatureInput = Partial<CreateCreatureInput>
