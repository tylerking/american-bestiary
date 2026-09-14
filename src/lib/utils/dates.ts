const timestamp = new Intl.DateTimeFormat('en-US', {
	dateStyle: 'medium',
	timeStyle: 'short',
	timeZone: 'UTC'
})

export const formatTimestamp = (date: Date) => `${timestamp.format(date)} UTC`

const month = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' })

export const monthName = (value: number) => month.format(Date.UTC(2000, value - 1, 1))
