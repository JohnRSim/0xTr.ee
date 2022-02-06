<script>
	// svelte
	import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte';

	export let enableAutoTransitions = false;
	export let drawerMenuPos = '0px';
	export let userAccount = false;
	export let treeContract = false;
	export let treeTokenAddress = false;

	const dispatch = createEventDispatcher();

	//globals
	let isMounted = false;

	//bind
	let drawerMenu;
	let searchAddress;

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
		display: flex;
		align-items: center;
	}

	#S-navPanel footer ul {
		padding-bottom: 0px;
	}

	.autoTransition {
		transition: transform 0.3s, opacity 0.3s;
	}
	.priceField {
		border: solid 2px #eaeaea;
		border-radius: 100px;
		overflow: hidden;
	}
	.priceField,
	.priceField label {
		display: flex;
		align-items: center;
	}
	.priceField label {
		border-right: solid 2px #eaeaea;
		padding-right: 10px;
	}

	.priceField label > div {
		display: flex;
		align-items: center;
	}
	.priceField input {
		border: 0px;
		flex: 1;
		line-height: 40px;
		text-indent: 10px;
		width: 150px;
	}

	.priceField label img {
		margin: 0px 8px 0px 10px;
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
			<header class="main" on:click="{() => {}}">
				<form on:submit|preventDefault>
					<div class="priceField">
						<label for="priceField">
							<div style="align-items:center;">
								<img width="26" src="/img/ico_search.svg" alt="Search by wallet id" />
							</div>
							<div class="crypto">Search</div>
						</label>
						<input
							on:keyup="{(e) => {
								if (e.key === 'Enter') {
									dispatchEvent({ action: 'nav', path: `/${searchAddress}` });
								}
							}}"
							id="priceField"
							bind:value="{searchAddress}"
							type="text"
							placeholder="Enter Wallet ID" />
					</div>
				</form>
			</header>
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
					{#if userAccount}
						<li
							on:click="{() => {
								dispatchEvent({ action: 'nav', path: `/${userAccount}` });
							}}">
							My Wallet
						</li>
					{:else}
						<li
							on:click="{() => {
								dispatchEvent({ action: 'nav', path: `/login` });
							}}">
							Login
						</li>
					{/if}
					<li
						on:click="{() => {
							dispatchEvent({ action: 'nav', path: `/${treeContract}` });
						}}">
						Tree Contract
					</li>
					<li
						on:click="{() => {
							dispatchEvent({ action: 'nav', path: `/${treeTokenAddress}` });
						}}">
						Tree Token
					</li>
					<li
						on:click="{() => {
							dispatchEvent({ action: 'nav', path: `/0x123e710c69b6806ef32Cf52e49dCC5EEEc368a22` });
						}}">
						Test Wallet
					</li>
					<li
						on:click="{() => {
							dispatchEvent({ action: 'nav', path: '/uniswap' });
						}}">
						<img width="26" src="/img/ico_uniswap.svg" alt="" />Uniswap
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
