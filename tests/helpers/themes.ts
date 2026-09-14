export const themeForm = (ids: readonly string[], overrides: Record<string, string> = {}) => ({
	slug: 'the-winged',
	title: 'The winged',
	description: 'Air.',
	...Object.fromEntries(
		ids.flatMap((id, index) => [
			[`specimen${index + 1}`, id],
			[`note${index + 1}`, `Note ${index + 1}`]
		])
	),
	...overrides
})
