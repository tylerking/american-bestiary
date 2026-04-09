export const openApiSpec = {
  components: {
    schemas: {
      CreateCreatureInput: {
        properties: {
          desc: { type: 'string' },
          fact: { type: 'string' },
          image: { type: 'string' },
          name: { type: 'string' },
          region: { type: 'string' },
          state: { type: 'string' },
          type: { type: 'string' },
        },
        required: ['name', 'state', 'desc'],
        type: 'object',
      },
      Creature: {
        properties: {
          _id: { example: '507f1f77bcf86cd799439011', type: 'string' },
          createdAt: { format: 'date-time', type: 'string' },
          desc: { example: 'A mysterious 8-foot creature covered in white hair.', type: 'string' },
          fact: { example: 'First sighted in the 1940s.', type: 'string' },
          image: { example: 'white-thang.jpg', type: 'string' },
          name: { example: 'White Thang', type: 'string' },
          region: { example: 'Southeast', type: 'string' },
          state: { example: 'Alabama', type: 'string' },
          type: { example: 'cryptid', type: 'string' },
          updatedAt: { format: 'date-time', type: 'string' },
        },
        required: ['_id', 'name', 'state', 'desc'],
        type: 'object',
      },
      UpdateCreatureInput: {
        properties: {
          desc: { type: 'string' },
          fact: { type: 'string' },
          image: { type: 'string' },
          name: { type: 'string' },
          region: { type: 'string' },
          state: { type: 'string' },
          type: { type: 'string' },
        },
        type: 'object',
      },
    },
  },
  info: {
    description: 'REST API for legendary creatures of North America',
    title: 'American Bestiary API',
    version: '3.0.0',
  },
  openapi: '3.1.0',
  paths: {
    '/creatures': {
      get: {
        operationId: 'listCreatures',
        parameters: [
          { description: 'Filter by US state', in: 'query', name: 'state', schema: { type: 'string' } },
          { description: 'Filter by creature type', in: 'query', name: 'type', schema: { type: 'string' } },
          { description: 'Results per page', in: 'query', name: 'limit', schema: { default: 100, type: 'integer' } },
          { description: 'Page number', in: 'query', name: 'page', schema: { default: 1, type: 'integer' } },
        ],
        responses: {
          '200': {
            content: { 'application/json': { schema: { items: { $ref: '#/components/schemas/Creature' }, type: 'array' } } },
            description: 'Array of creatures',
          },
        },
        summary: 'List all creatures',
        tags: ['Creatures'],
      },
      post: {
        operationId: 'createCreature',
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCreatureInput' } } },
          required: true,
        },
        responses: {
          '201': {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Creature' } } },
            description: 'Created creature',
          },
          '400': { description: 'Validation error' },
        },
        summary: 'Create a new creature',
        tags: ['Creatures'],
      },
    },
    '/creatures/{id}': {
      delete: {
        operationId: 'deleteCreature',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'Deleted successfully' },
          '404': { description: 'Creature not found' },
        },
        summary: 'Delete a creature',
        tags: ['Creatures'],
      },
      get: {
        operationId: 'getCreature',
        parameters: [{ description: 'MongoDB ObjectId', in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Creature' } } }, description: 'Creature found' },
          '404': { description: 'Creature not found' },
        },
        summary: 'Get a creature by ID',
        tags: ['Creatures'],
      },
      patch: {
        operationId: 'updateCreature',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateCreatureInput' } } },
        },
        responses: {
          '200': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Creature' } } }, description: 'Updated creature' },
          '404': { description: 'Creature not found' },
        },
        summary: 'Partially update a creature',
        tags: ['Creatures'],
      },
    },
    '/health': {
      get: {
        operationId: 'healthCheck',
        responses: {
          '200': {
            content: {
              'application/json': {
                schema: {
                  properties: {
                    service: { type: 'string' },
                    status: { example: 'ok', type: 'string' },
                    timestamp: { format: 'date-time', type: 'string' },
                  },
                  type: 'object',
                },
              },
            },
            description: 'Service is healthy',
          },
        },
        summary: 'Health check',
        tags: ['Health'],
      },
    },
  },
  servers: [
    { description: 'Current server', url: '/api' },
  ],
}
