<script>
	//svelte
	import { onMount, createEventDispatcher, tick } from 'svelte';

	export let hasTabs = [];
	export let activeTab = '';

	const dispatch = createEventDispatcher();

	let tabHighlightLeft = 0;
	let tabHighlightWidth = 0;
	let tabs;
	let isMounted = false;

	$: if (isMounted && activeTab) {
		updateTab();
	}

	onMount(() => {
		isMounted = true;
		//console.log(activeTabDOM,tabHighlightLeft,tabHighlightWidth)
	});

	async function updateTab() {
		await tick();
		const activeTabDOM = tabs.getElementsByClassName('active');

		tabHighlightLeft = activeTabDOM[0].offsetLeft;
		tabHighlightWidth = activeTabDOM[0].offsetWidth - 12;
	}

	/**
	 * dispatchEvent
	 * Dispatch event passing option data
	 **/
	function dispatchEvent(options) {
		console.log(`[Dispatch Event][${options.action}]`, options);

		dispatch(options.action, options);
	}

	/**
	 * selectTab
	 **/
	function selectTab(e, tab) {
		//console.log('!!!!!!!', e)
		tabHighlightLeft = e.target.offsetLeft - 12;
		tabHighlightWidth = e.target.offsetWidth - 12;

		dispatchEvent({ action: 'tab', name: tab.name, path: tab.path });
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

<style>
	.tablist {
		display: flex;
		background: #f9fafc;
		border-radius: 100px;
	}

	.tablist ul {
		margin: 0px;
		padding: 0px;
		display: flex;
		position: relative;
		/*box-shadow: inset 0px -1px 0px 0px var(--borderColor-tablist-base);*/
		max-width: 966px;
		min-width: 320px;
		margin: 0px auto;
		flex: 2;
		overflow-x: auto;
		scrollbar-width: none;
	}

	@media only screen and (min-width: 769px) {
		.tablist ul {
			overflow-x: hidden;
		}
	}

	.tablist li {
		list-style: none;
		flex: 1;
		text-align: center;
		color: #403b52;
		font-weight: bold;
		opacity: 0.5;
		transition: opacity 0.2s;
		cursor: pointer;
		padding: 0px 20px;
		z-index: 10;
		position: relative;
	}

	.tablist li.active {
		opacity: 1;
	}

	.highlight {
		position: absolute;
		bottom: 6px;
		left: 6px;
		right: 6px;
		background-color: #fff;
		box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transition: -webkit-transform 0.25s !important;
		transition: -webkit-transform 0.25s !important;
		transition: transform 0.25s !important;
		transition: transform 0.25s, -webkit-transform 0.25s !important;
		opacity: 1 !important;
		top: 6px;
		border-radius: 100px;
		z-index: 0 !important;
		position: absolute !important;
	}
	.tablist li:first-child.active ~ .highlight {
		-webkit-transform: translateX(0) scaleX(0.5);
		transform: translateX(0) scaleX(0.5);
	}
	.tablist li:nth-child(2).active ~ .highlight {
		-webkit-transform: translateX(0) scaleX(0.5);
		transform: translateX(50%) scaleX(0.5);
	}
	:global([dir='rtl'] .tablist li:first-child.active ~ .highlight) {
		-webkit-transform: translateX(0) scaleX(0.5);
		transform: translateX(50%) scaleX(0.5);
	}
	:global([dir='rtl'] .tablist li:nth-child(2).active ~ .highlight) {
		-webkit-transform: translateX(0) scaleX(0.5);
		transform: translateX(0) scaleX(0.5);
	}
	.tablist li span {
		background-size: contain;
		background-repeat: no-repeat;
		min-height: 38px;
		line-height: 38px;
	}
	.tablist li span.default {
		background-image: url('/img/ico_tab.svg');
		padding-left: 40px;
		display: inline-block;
	}
	.tablist li span.player {
		background-image: url('/img/ico_player.svg');
		padding-left: 40px;
		display: inline-block;
		background-size: 20px;
		background-position: 12px center;
	}
	.tablist li span.resources {
		background-image: url('/img/ico_resources.svg');
		padding-left: 40px;
		display: inline-block;
		background-size: 20px;
		background-position: 12px center;
	}

	/* Medium devices (landscape tablets, 768px and up) */
	@media only screen and (min-width: 768px) {
		.tablist li span {
			min-height: 50px;
			line-height: 50px;
		}
		.highlight {
			height: 3px;
			/*background-color: #d40511;*/
			background-color: #ffcc00;
		}
	}
	.label {
		pointer-events: none;
	}
</style>

<svelte:window on:resize="{updateTab}" />

<!-- Tablist -->
<nav class="tablist">
	<div class="sidebar"></div>
	<ul bind:this="{tabs}" on:touchstart="{scrollStart}" on:touchend="{scrollEnd}">
		{#each hasTabs as tab, i}
			<li
				on:click="{(e) => {
					selectTab(e, tab);
				}}"
				class:active="{activeTab === tab.name}">
				<span class="label {tab.icon}">{tab.name}</span>
			</li>
		{/each}
		<li
			class="highlight"
			style="transform:translateX({tabHighlightLeft}px);width:{tabHighlightWidth}px;">
		</li>
	</ul>
	<div class="sidebar"></div>
</nav>
<!-- xTablist -->
