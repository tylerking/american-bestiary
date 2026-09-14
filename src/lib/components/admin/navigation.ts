export interface AdminLink {
	href: string
	label: string
}

export const ADMIN_NAVIGATION: { title: string; links: AdminLink[] }[] = [
	{ title: '', links: [{ href: '/admin', label: 'Dashboard' }] },
	{
		title: 'Codex',
		links: [
			{ href: '/admin/specimens', label: 'Specimens' },
			{ href: '/admin/themes', label: 'Themes' }
		]
	},
	{ title: 'Settings', links: [{ href: '/admin/globals', label: 'Globals' }] }
]
