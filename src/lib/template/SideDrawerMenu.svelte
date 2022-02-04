<script>
	// svelte
	import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte';

	export let enableAutoTransitions = false;
	export let drawerMenuPos = '0px';

	const dispatch = createEventDispatcher();

	//globals
	let isMounted = false;

	//bind
	let drawerMenu;

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
	#S-drawerMenu {
		will-change: transform;
		position: fixed;
		top: 0;
		bottom: 0px;
		left: 0px;
		right: 0px;
		z-index: 20;
		display: flex;
	}

	#S-navPanel {
		background: #fff;
		flex: 1;
		color: #323232;
		display: flex;
		flex-direction: column;
	}

	#S-navPanel header {
		padding: 15px;
		border-bottom: 1px solid #f2f2f2;
	}

	nav {
		flex: 1;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	nav ul {
		margin: 0px;
		padding: 15px 0px;
	}

	nav ul li {
		list-style: none;
		padding: 8px 15px;
	}

	#S-navPanel footer ul {
		padding-bottom: 0px;
	}

	.autoTransition {
		transition: transform 0.3s, opacity 0.3s;
	}
</style>

{#if isMounted}
	<!-- Drawer Menu -->
	<aside
		id="S-drawerMenu"
		bind:this="{drawerMenu}"
		class="gpu_accx"
		class:autoTransition="{enableAutoTransitions}"
		style="transform: translate3d({drawerMenuPos}, 0px, 0px);">
		<!-- Nav PanelWrapper -->
		<div id="S-navPanel">
			<!-- Header -->
			<header class="main" on:click="{() => {}}"></header>
			<!-- xHeader -->

			<!-- Nav -->
			<nav>
				<ul style="padding:5px 0px;">
					<li
						on:click="{() => {
							dispatchEvent({ action: 'nav', path: '/' });
						}}">
						Home
					</li>
				</ul>
			</nav>
			<!-- xNav -->
		</div>
		<!-- xNav PanelWrapper -->

		<!-- Spacer -->
		<div
			style="min-width:20%"
			on:click="{() => {
				dispatchEvent({ action: 'collapseMenu' });
			}}">
		</div>
		<!-- xSpacer -->
	</aside>
	<!-- xDrawer Menu -->
{/if}
