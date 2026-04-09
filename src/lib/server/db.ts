import 'dotenv/config'
import type { Creature } from '$lib/types'

import { type Collection, type Db, MongoClient } from 'mongodb'

let client: MongoClient
let database: Db

const MONGODB_URI = process.env.MONGODB_URI

export function getClient(): MongoClient {
  if (!client) {
    const uri = MONGODB_URI
    
    if (!uri || typeof uri !== 'string') {
      throw new Error('MONGODB_URI environment variable is required and must be a string')
    }

    client = new MongoClient(uri)
  }
  return client
}

export function getCreaturesCollection(): Collection<Creature> {
  return getDb().collection<Creature>('creatures')
}

export function getDb(): Db {
  if (!database) {
    database = getClient().db('bestiary')
  }
  return database
}
