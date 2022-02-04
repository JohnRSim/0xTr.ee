<script>
	// svelte
	import { onMount, onDestroy, tick } from 'svelte';

	export let blur = false;
	export let opacityVal = 0;

	//global
	let isMounted = false;

	//bind
	let navMaskEle;

	onMount(() => {
		isMounted = true;
	});
	 
</script>

<style>

	#S-mask {
		position: fixed;
		top:0px;
		left:0px;
		right:0px;
		bottom:0px;
		z-index:15; 
		pointer-events: none;
    	backdrop-filter: blur(2.6px) opacity(0);
  		transition: backdrop-filter 0.2s;
		will-change:opacity;
	}
	
	#S-mask.blur {
   		background: rgba(0,0,0,0.01);
    	backdrop-filter: blur(2.6px) opacity(1);
	}

	.maskBlur {
		opacity: 0;
		position: fixed;
		top:0px;
		left:0px;
		right:0px;
		bottom:0px;
		background-color: rgb(50, 50, 50);
		will-change:opacity;
		pointer-events: none;
	}
</style>


{#if (isMounted)}
<div 
	class="gpu_accx" 
	class:blur="{blur}" 
	bind:this="{navMaskEle}" 
	id="S-mask">
	
	<div class="maskBlur" style="opacity:{opacityVal};"></div>
</div>
{/if}