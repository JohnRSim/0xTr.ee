<script>
	// svelte
	import { onMount, onDestroy, tick } from 'svelte';

	export let enableInset = false;
	export let enableOutset = false;

	//global
	let isMounted = false;

	onMount(() => {
		isMounted = true;
	});
</script>

<style>
	#S-mainContent {
		will-change:transform, opacity;
		flex:1;
		transform: translate3d(0%,0,0);
		opacity:1;
		display: flex;
		z-index: 10;
		transition: transform 0.3s, opacity 0.3s;
	}

	#S-mainContent main {
		display: flex;
		flex-direction: column;
		
		max-width: 966px;
		min-width: 360px;
		/* margin: 0px auto; */
		
    	margin: 0px auto;
		width: 100%;
		position: relative;
		flex: 2;
	}

	#S-mainContent.inset {
   		transform: translate3d(-10%,0,0);
	}

	#S-mainContent.outset {
   		transform: translate3d(+10%,0,0);
	}
</style>


<!-- Main Content Wrapper -->
<div id="S-mainContent" 
	class="gpu_acc" 
	class:inset="{enableInset}" 
	class:outset="{enableOutset}">
	
	<main>
		<slot></slot>
	</main>
</div>
<!-- xMain Content Wrapper -->