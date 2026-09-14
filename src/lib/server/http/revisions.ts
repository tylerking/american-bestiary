import { error, fail, redirect } from '@sveltejs/kit'
import { ZodError } from 'zod'
import { diffSnapshots } from '$lib/revisions'
import { uuidSchema } from '$lib/schemas'
import type { Revision, RevisionEntity } from '$lib/types'
import { adminActions } from '../auth/auth'
import { currentSnapshot, getRevision, restoreRevision, specimenNames } from '../db/content'
import { unique } from './forms'

export const revisionSummaries = (revisions: Revision[]) =>
	revisions.map(({ id, createdAt, author }) => ({ id, createdAt, author }))

async function findRevision(entityType: RevisionEntity, entityId: string, revisionId: string | undefined) {
	const id = uuidSchema.safeParse(revisionId)
	const revision = id.success ? await getRevision(id.data) : null
	if (!revision || revision.entityType !== entityType || revision.entityId !== entityId)
		throw error(404, 'Revision not found')
	return revision
}

async function compareRevision(entityType: RevisionEntity, entityId: string, revisionId: string | undefined) {
	const revision = await findRevision(entityType, entityId, revisionId)
	const [current, names] = await Promise.all([currentSnapshot(entityType, entityId), specimenNames()])
	return {
		revision: { id: revision.id, createdAt: revision.createdAt, author: revision.author },
		changes: diffSnapshots(current ?? {}, revision.snapshot, names)
	}
}

async function restoreFrom(
	entityType: RevisionEntity,
	entityId: string,
	revisionId: string | undefined,
	userId: number | null,
	destination: string
) {
	const revision = await findRevision(entityType, entityId, revisionId)
	const restored = await unique(() => restoreRevision(revision, userId)).catch((caught: unknown) =>
		caught instanceof ZodError ? ('invalid' as const) : Promise.reject(caught)
	)
	if (restored === 'invalid')
		return fail(400, { message: 'This revision no longer passes validation, so it cannot be restored.' })
	if (typeof restored !== 'boolean')
		return fail(400, { message: 'That revision conflicts with another entry, so it cannot be restored.' })
	throw restored ? redirect(303, `${destination}?restored=1`) : error(404, 'Not found')
}

type RouteParams = Partial<Record<string, string>>

export function revisionRoute(
	entityType: RevisionEntity,
	subjectOf: (params: RouteParams) => Promise<{ id: string; name: string; href: string }>
) {
	return {
		load: async ({ params }: { params: RouteParams }) => {
			const subject = await subjectOf(params)
			return { subject, ...(await compareRevision(entityType, subject.id, params.revisionId)) }
		},
		actions: adminActions({
			restore: async ({ params, locals }: { params: RouteParams; locals: App.Locals }) => {
				const subject = await subjectOf(params)
				return restoreFrom(entityType, subject.id, params.revisionId, locals.userId, subject.href)
			}
		})
	}
}
