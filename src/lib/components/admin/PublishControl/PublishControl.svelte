<script
	lang='ts'>
	import { enhance } from '$app/forms'
	import Button from '$lib/components/elements/Button'
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import { keepValues } from '$lib/utils/forms'

	interface Props {
		published: boolean
		name: string
	}

	let { published, name }: Props = $props()
</script>

<form
	action={published ? '?/unpublish' : '?/publish'}
	class={styles.rowSpread}
	method='POST'
	use:enhance={keepValues}>
	<Text
		as='p'
		role='status'
		tone={published ? 'inherit' : 'vermilion'}
		variant='apparatusValue'>{published
			? `${name} is published and visible on the map, the archive, and the API.`
			: `${name} is hidden. Its territory is inert on the map and it is skipped in themes and neighbouring entries.`}</Text>
	<Button
		type='submit'
		variant={published ? 'outline' : 'vermilion'}>{published ? 'Unpublish' : 'Publish'}</Button>
</form>
