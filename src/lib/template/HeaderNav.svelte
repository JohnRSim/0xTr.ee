<script>
	//svelte
	import { createEventDispatcher, onMount } from 'svelte';

	export let showBurger = false;
	export let showBack = false;
	export let headerTheme = 'light';
	export let leftSpacer = false;
	export let rightSpacer = false;
	export let showLogo = false;
	export let showSaveProfile = false;
	export let pageTitle = false;

	const dispatch = createEventDispatcher();

	/**
	 * dispatchEvent
	 * Dispatch event passing option data
	 **/
	function dispatchEvent(options) {
		console.log(`[Dispatch Event][${options.action}]`, options);

		dispatch(options.action, options);
	}

	/**
	 * scrollStart
	 **/
	function scrollStart() {
		dispatchEvent({ action: 'scrollStart' });
	}

	/**
	 * scrollStart
	 **/
	function scrollEnd() {
		dispatchEvent({ action: 'scrollEnd' });
	}
</script>

<!-- xHeader Nav-->
<style>
	#appHeaderPanel {
		margin: 0px;
		padding: 0px;
		min-height: 60px;
		display: flex;
	}

	li {
		list-style: none;
		margin: 0px;
	}

	li i.ico {
		/*background-color: var(--maskColor-ico);*/
		background-color: #000;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
		-webkit-mask-size: 25px;
		height: 36px;
		display: block;
	}

	.hamburger {
		padding: 12px 15px;
	}

	.hamburger .ico {
		-webkit-mask-image: unset;
		background-color: #f5f7f5;
		background-image: url('/img/ico_hamburger.svg');
		background-position: 3px 0px;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-size: 11px;
		background-repeat: no-repeat;
		background-position: center;
	}

	.back {
		min-width: 60px;
		align-self: center;
		cursor: pointer;
	}

	.back .ico {
		-webkit-mask-image: unset;
		background-color: #f5f7f5;
		background-image: url('/img/ico_chevron_left.svg');
		margin-left: 10px;
		background-position: 3px 0px;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-size: 28px;
		background-repeat: no-repeat;
		background-position: center;
	}

	.pageTitle {
		text-align: center;
		align-self: center;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		justify-content: center;
		display: flex;
	}

	.spacer {
		padding: 12px 15px;
		width: 60px;
	}

	.sectionHeader {
		display: flex;
		color: var(--color-headerTitle);
		flex: 1;
	}
	.hamburger {
		transition: width 0.2s, padding 0.2s;
		overflow: hidden;
	}
	.hamburger .ico {
		opacity: 1;
		transition: opacity 0.2s;
	}
	.hamburger.expandSearch {
		padding-right: 0px;
		width: 0px;
	}
	.hamburger.expandSearch .ico {
		opacity: 0;
	}
	.headerTitle {
		color: var(--color-headerTitle);
	}

	.txtLink {
		align-self: center;
		min-width: 60px;
		color: #00a0f0;
		font-weight: bold;
	}
	.logo {
		height: 30px;
	}
</style>

<svelte:head />

<!-- Header Nav-->
<ul id="appHeaderPanel" class="{headerTheme}">
	{#if showBurger}
		<li
			class="hamburger"
			on:click="{() => {
				dispatchEvent({ action: 'nav' });
			}}">
			<i class="ico mask"></i>
		</li>
	{/if}
	<!-- Left -->
	{#if leftSpacer}
		<li class="spacer"></li>
	{/if}
	{#if showBack}
		<li
			class="back"
			on:click="{() => {
				dispatchEvent({ action: 'goBack' });
			}}">
			<i class="ico mask"></i>
		</li>
	{/if}
	<!-- Left -->

	<!-- Center -->
	<li
		style="flex:1;"
		class="pageTitle"
		on:click="{() => {
			dispatchEvent({ action: 'titleSelected' });
		}}">
		{#if showLogo}
			<img class="logo" src="/logo.svg" alt="" />
		{:else if pageTitle}
			{pageTitle}
		{/if}
	</li>
	<!-- xCenter -->

	<!-- Right -->
	{#if showSaveProfile}
		<li class="txtLink">Save</li>
	{/if}
	{#if rightSpacer}
		<li class="spacer"></li>
	{/if}
	<!-- xRight -->
</ul>
