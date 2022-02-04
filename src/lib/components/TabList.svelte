<script>
	//svelte
	import { createEventDispatcher } from 'svelte';

	export let activeTab = '';
	export let tabList = [];

	const dispatch = createEventDispatcher();

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
	.tablist {
		position: absolute;
		bottom: -1px;
		left: 0px;
		right: 0px;
		font-weight: bold;
		text-transform: uppercase;
	}

	.tablist ul {
		margin: 0px;
		padding: 0px;
		display: flex;
		justify-content: center;
	}

	.tablist li {
		list-style: none;
		min-height: 55px;
		padding: 0px 24px;
		display: flex;
		align-items: center;
		color: #000;
		border-radius: 4px 4px 0px 0px;
		cursor: pointer;
		border: solid 1px transparent;
		border-bottom: 0px;
		position: relative;
		overflow: hidden;
	}

	.tablist li span {
		align-items: center;
		text-align: center;
		position: relative;
		z-index: 10;
	}

	.tablist li.active:before,
	.tablist li.active:hover:before {
		transition-duration: 0.5s;
		background: #333;
		border-top: solid 1px #8c8c8c;
		border-left: solid 1px #8c8c8c;
		border-right: solid 1px #8c8c8c;
		-webkit-transform: translateY(0);
		transform: translateY(0);
	}
	.tablist li:before {
		z-index: 1;
		position: absolute;
		content: '';
		width: 100%;
		height: 120%;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.2);
		-webkit-transform: translateY(100%);
		transform: translateY(100%);
		transition-duration: 0.25s;
		border-radius: 4px 4px 0 0;
		border: solid 1px transparent;
	}

	.tablist li:hover:before {
		-webkit-transform: translateY(70%);
		transform: translateY(70%);
	}

	.featuredTab span:before {
		content: '';
	}

	.resourcesTab span:before {
		content: '';
	}

	.tablist b {
		min-width: 26px;
		height: 26px;
		border-radius: 40px;
		background: #8c8c8c;
		line-height: 26px;
		text-align: center;
		margin: 0px 10px;
		font-weight: normal;
		font-size: 0.875em;
		position: relative;
		z-index: 10;
	}

	.tablist .active b {
		background: #666;
	}

	/* Medium devices (landscape tablets, 768px and up) */
	@media only screen and (min-width: 768px) {
		.featuredTab span:before,
		.resourcesTab span:before {
			content: 'Show Me ';
		}

		.tablist li {
			list-style: none;
			min-height: 64px;
			padding: 0px 53px;
		}
	}
</style>

<!-- Tablist -->
{#if tabList.length > 0}
	<nav class="tablist">
		<ul>
			{#each tabList as tab}
				<li
					on:click="{() => {
						dispatchEvent({ action: 'featuredTab' });
					}}"
					class:active="{activeTab === tab.name}"
					class="featuredTab">
					<span>{tab.name}</span>
					{#if tab.total}
						<b>{tab.total}</b>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
{/if}
<!-- xTablist -->
