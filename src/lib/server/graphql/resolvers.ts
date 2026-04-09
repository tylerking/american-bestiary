import { create, findAll, findOne, remove, update } from '$lib/server/creatures'

export const resolvers = {
  Mutation: {
    createCreature: async (_: unknown, args: { input: Parameters<typeof create>[0] }) => {
      return create(args.input)
    },

    deleteCreature: async (_: unknown, args: { id: string }) => {
      return remove(args.id)
    },

    updateCreature: async (
      _: unknown,
      args: { id: string; input: Parameters<typeof update>[1] },
    ) => {
      return update(args.id, args.input)
    },
  },

  Query: {
    creature: async (_: unknown, args: { id: string }) => {
      return findOne(args.id)
    },

    creatures: async (
      _: unknown,
      args: { classification?: string; limit?: number; page?: number; region?: string; },
    ) => {
      return findAll({
        classification: args.classification ?? undefined,
        limit: args.limit ?? 100,
        page: args.page ?? 1,
        region: args.region ?? undefined,
      })
    },
  },
}
