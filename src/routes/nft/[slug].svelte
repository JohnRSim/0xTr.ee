<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ fetch, params, url }) {
		const { pathname } = url;
		const { slug } = params;

		//check address is potential wallet path
		//TODO add more checking ;)
		if (slug.startsWith('0x')) {
			const searchParams = url.searchParams;
			const tab = searchParams.get('tab');
			console.log('slug', slug);

			//send across tab path if defined
			return {
				props: {
					slug,
					tab: tab ? tab : 'Offers',
				},
			};
			//if it isn't 0x then 404 page..
		} else {
			return {
				status: 404,
			};
		}
	}
</script>

<script>
	//sveltkit
	import { goto } from '$app/navigation';

	// svelte
	import { onDestroy, onMount } from 'svelte';

	//components
	import HeaderTabList from '$lib/components/HeaderTabList.svelte';

	export let tab, slug;

	let hasTabs = [
		{
			name: 'Offers',
			path: `/nft/${slug}?tab=Offers`,
		},
		{
			name: 'History',
			path: `/nft/${slug}?tab=History`,
		},
		{
			name: 'Activity',
			path: `/nft/${slug}?tab=Activity`,
		},
	];
</script>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.scrollable {
		overflow-y: scroll;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior-y: none;
		position: fixed;
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		background-color: var(--bg-baseWrap);
		padding-bottom: 80px;
	}

	article {
		display: flex;
		justify-content: start;
		flex-direction: column;
		margin: 0px;
		text-align: left;
		align-items: center;
	}
</style>

<section style="transform: translate3d(0px, 60px, 0px);" id="XT-NFT" class="scrollable gpu_acc">
	<div style="flex:1;display:flex;flex-direction:column;">
		<article style="flex:1;" dir="auto">
			<HeaderTabList
				on:tab="{(e) => {
					goto(e.detail.path, { replaceState: true, noscroll: true });
				}}"
				hasTabs="{hasTabs}"
				activeTab="{tab}" />

			<div style="width:100%;">
				{#if tab === 'Offers'}
					Offers
				{:else if tab === 'History'}
					History
				{:else if tab === 'Activity'}
					Activity
				{/if}
			</div>
		</article>
	</div>
</section>
