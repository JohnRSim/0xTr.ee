<script>
	// svelte
	import { onMount, onDestroy, tick } from 'svelte';

	let isMounted = false;

	onMount(() => {
		isMounted = true;
	});
	 
</script>

<style>

	#M-site {
		position: relative;
		flex:1;
		display:flex;
		flex-direction:column;
		/*overflow-y: scroll;*/
    	overflow-y: hidden;
    	overflow-x: hidden;
		transition: margin 0.3s;
		/*-webkit-overflow-scrolling: touch;
		overscroll-behavior-y: none;*/
   		height: 99.9%;
	}
</style>


<div id="M-site">
	
	<!-- Page layout -->
	<slot></slot>
</div>