<script>
	// svelte
	import { onMount, onDestroy, tick } from 'svelte';

	export let internalTheme = false;
	export let activePageLayout = false;
	export let langDirection = 'ltr';

	let isMounted = false;

	onMount(() => {
		isMounted = true;
	});
	 
</script>

<style>

	#M-siteWrapper {
		display: flex;
		height:100%;
		flex:1;
		min-width: 360px;
		/*transition: background 0.2s;*/
		position: fixed;
		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;
		background-color:var(--bg-baseWrap);
	}
</style>


<div 
	id="M-siteWrapper" 
	class="gpu_acc {internalTheme} {activePageLayout}" 
	dir="{langDirection}">
	
	<!-- page template -->
	<slot></slot>
</div>