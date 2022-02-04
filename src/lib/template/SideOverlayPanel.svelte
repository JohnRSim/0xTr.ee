<script>
	// svelte
	import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte';

	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';
	import BannerImage from '$lib/components/BannerImage.svelte';

	export let enableAutoTransitions = false;
	export let sideOverlayPos = '0px';
	export let dir = 'ltr';

	const dispatch = createEventDispatcher();

	//global
	let isMounted = false;

	//bind
	let chatview;
	let collapseNFT = true;

	onMount(() => {
		isMounted = true;
	});

	/**
	 * dispatchEvent
	 * Dispatch event passing option data
	 **/
	function dispatchEvent(options) {
		console.log(`[Dispatch Event][${options.action}]`, options);

		dispatch(options.action, options);
	}
</script>

<style>
	#S-chatView {
		will-change: transform;
		position: fixed;
		top: 0;
		bottom: 0px;
		left: 0px;
		right: 0px;
		z-index: 20;
		display: flex;
	}

	#S-chatView[dir='ltr'] {
		transform: translate3d(100%, 0, 0);
	}

	#S-chatView[dir='rtl'] {
		transform: translate3d(-100%, 0, 0);
	}

	#S-navPanel {
		background: #fff;
		flex: 1;
		color: #323232;
		display: flex;
		flex-direction: column;
		max-width: 360px;
		min-width: 280px;
	}

	nav {
		flex: 1;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	.autoTransition {
		transition: transform 0.3s, opacity 0.3s;
	}
</style>

{#if isMounted}
	<!-- Chat Menu -->
	<aside
		dir="{dir}"
		id="S-chatView"
		bind:this="{chatview}"
		class="gpu_accx"
		class:autoTransition="{enableAutoTransitions}"
		style="transform: translate3d({sideOverlayPos}, 0px, 0px);">
		<!-- Spacer -->
		<div
			style="flex:1;"
			on:click="{() => {
				dispatchEvent({ action: 'collapseMenu' });
			}}">
		</div>
		<!-- xSpacer -->

		<!-- Nav PanelWrapper -->
		<div id="S-navPanel">
			<!-- Nav -->
			<nav></nav>
			<!-- xNav -->
		</div>
		<!-- xNav PanelWrapper -->

		<!-- panel template -->
	</aside>
	<!-- xChat Menu -->
{/if}
