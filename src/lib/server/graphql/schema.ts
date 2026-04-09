export const typeDefs = /* GraphQL */ `
  type Creature {
    _id: ID!
    name: String!
    region: String!
    classification: String!
    abstract: String!
    visual: String!
    etymology: String!
    anatomy: String!
    ecology: String!
    behavior: String!
    mythology: String!
    createdAt: String
    updatedAt: String
  }

  input CreateCreatureInput {
    name: String!
    region: String!
    classification: String!
    abstract: String!
    visual: String!
    etymology: String!
    anatomy: String!
    ecology: String!
    behavior: String!
    mythology: String!
  }

  input UpdateCreatureInput {
    name: String
    region: String
    classification: String
    abstract: String
    visual: String
    etymology: String
    anatomy: String
    ecology: String
    behavior: String
    mythology: String
  }

  type Query {
    creatures(region: String, classification: String, limit: Int, page: Int): [Creature!]!
    creature(id: ID!): Creature
  }

  type Mutation {
    createCreature(input: CreateCreatureInput!): Creature!
    updateCreature(id: ID!, input: UpdateCreatureInput!): Creature
    deleteCreature(id: ID!): Boolean!
  }
`
