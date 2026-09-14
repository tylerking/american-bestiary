<script
	lang='ts'>
	import { initial } from './Initial.css'

	interface Props {
		text: string
		size: keyof typeof initial
	}

	let { text, size }: Props = $props()
</script>

<span
	class={initial[size]}>{text.slice(0, 1)}</span>{text.slice(1)}
