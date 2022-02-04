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
	import Button from '$lib/components/Button.svelte';
	import { bigBlue } from '$lib/components/conf/Buttons.js';

	//stores
	import { modal as sModal } from '../../stores/modal.js';

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
	$: nftMeta = {};
	$: nftImage = nftMeta.image ? `background-image:url("${nftMeta.image}")` : '';
	$: activity = [];
	//$: nftImage =
	//typeof nftImage.image !== 'undefined' ? `background-image:url("${nftImage.image}")` : '';

	onMount(async () => {
		const addressArr = slug.split('_');
		console.log(addressArr);
		const options = { address: addressArr[0], token_id: addressArr[1], chain: 'mumbai' };
		//const metaData = await Moralis.Web3API.token.getNFTMetadata(options);
		//const tokenMetadata = await Moralis.Web3API.token.getTokenMetadata(options);
		const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(options);
		console.log('-------------', tokenIdMetadata);
		nftMeta = JSON.parse(tokenIdMetadata.metadata);
		console.log(nftMeta);

		const getWalletTokenIdTransfers = await Moralis.Web3API.token.getWalletTokenIdTransfers(
			options,
		);
		console.log('getWalletTokenIdTransfers', getWalletTokenIdTransfers);
		activity = getWalletTokenIdTransfers.result;
	});
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
	header {
		width: 100%;
		position: relative;
		z-index: 10;
	}
	.profileBG {
		background: #fff;
		min-height: 160px;
		position: relative;
		width: 100%;
		background-repeat: no-repeat;
		background-position: center;
	}
	.infoPanel {
		padding: 0px 20px;
	}
	.infoPanel h4 {
		margin: 15px 0px 10px;
		color: #383c3a;
	}
</style>

<section style="transform: translate3d(0px, 0px, 0px);" id="XT-NFT" class="scrollable gpu_acc">
	<div style="flex:1;display:flex;flex-direction:column;">
		<article style="flex:1;" dir="auto">
			<header>
				<div class="profileBG" style="{nftImage}"></div>
				<div class="infoPanel">
					{#if nftMeta.name}
						<h4>{nftMeta.name}</h4>
						<p>{nftMeta.description}</p>
					{/if}
				</div>
				<div style="display:flex;align-items:center;justif-content:center">
					<Button
						{...bigBlue}
						on:click="{() => {
							sModal.showModal({
								enable: 'true',
								title: 'Make an  Offer',
								subHeader:
									'By making an offer you will be sending funds into a holding area until offer has been accepted.',
								tpl: 'price',
								buttons: [
									{
										text: 'Make An Offer',
										action: 'makeOffer',
									},
								],
							});
						}}">Make Offer</Button>
				</div>
				<br />
			</header>
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
					{#each activity as active}a{/each}
				{/if}
			</div>
		</article>
	</div>
</section>
