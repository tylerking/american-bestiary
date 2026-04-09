import 'dotenv/config'
import { MongoClient } from 'mongodb'

import { creatures as rawCreatures } from '../src/lib/data/creatures'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is required.')
  console.error('Copy .env.example to .env and fill in your connection string.')
  process.exit(1)
}

async function seed() {
  console.info('Connecting to MongoDB...')
  const client = new MongoClient(MONGODB_URI as string)
  await client.connect()
  console.info('Connected.')

  const db = client.db('bestiary')
  const collection = db.collection('creatures')

  console.info('Resetting the database by deleting all existing creatures...')
  await collection.deleteMany({})

  const now = new Date()
  const creatures = rawCreatures.map((c) => ({
    ...c,
    createdAt: now,
    updatedAt: now,
  }))

  await collection.insertMany(creatures)
  console.info(`Seeded ${creatures.length} creatures into the database.`)

  await client.close()
  console.info('Disconnected. Done.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
