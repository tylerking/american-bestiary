function postgresField(error: unknown, field: 'code' | 'constraint'): unknown {
	if (typeof error !== 'object' || error === null) return undefined
	if (field in error) return (error as Record<string, unknown>)[field]
	return 'cause' in error ? postgresField(error.cause, field) : undefined
}

export const isUniqueViolation = (error: unknown) => postgresField(error, 'code') === '23505'

export const violatedConstraint = (error: unknown) => postgresField(error, 'constraint')
