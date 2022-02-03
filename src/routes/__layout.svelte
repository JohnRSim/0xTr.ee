<script>
	import { page } from '$app/stores';
	import { browser } from '$app/env';
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';

	// svelte
	import { onMount, onDestroy, tick } from 'svelte';

	// Lora - supported variants:
	// weights: [400, 500, 600, 700]
	// styles: italic, normal
	import '@fontsource/lora/400.css';
	import '@fontsource/lora/600.css';
	import '@fontsource/lora/700.css';
	import '@fontsource/lora/700-italic.css';

	// Source Sans Pro - supported variants:
	// weights: [200, 300, 400, 600, 700, 900]
	// styles: italic, normal
	import '@fontsource/source-sans-pro/400.css';
	import '@fontsource/source-sans-pro/400-italic.css';

	import '$lib/styles/normalise.css';
	import '$lib/styles/index.scss';

	//tpl
	import ModalWindow from '$lib/components/ModalWindow.svelte';

	//stores
	import { modal as sModal } from '../stores/modal.js';

	import PWA from '$lib/components/PWA.svelte';

	//console styles
	const Inf = 'background-color: #f8ffff; color: #276f86';

	//defaults
	let isMounted = false;

	//modal
	let modalHeader = '';
	let modalButtons = [];
	let modalContent = '';
	let showModal = 'false';
	let modalSubHeader = '';
	let modalTpl = '';
	let modalHasShadow = false;
	let showSocialModal = 'false';
	let socialModalTpl = '';
	let socialModalHeader = '';
	let socialModalButtons = [];

	//used for modal window input text fields
	let keyboardShown = false;

	$: if ($sModal && isMounted) {
		setTimeout(() => {
			showModal = $sModal.enable;
			modalHeader = $sModal.title;
			modalSubHeader = $sModal.subHeader;
			modalButtons = $sModal.buttons;
			modalTpl = $sModal.tpl;
			modalHasShadow = $sModal.hasShadow;
		}, 50);
	}

	/**
	 * onMount
	 * initial page setup
	 **/
	onMount(async () => {
		console.info('%c[Layout][Mount]', Inf);

		//page ready show DOM
		isMounted = true;
	});

	/**
	 * closeWindow
	 */
	function closeWindow() {
		showModal = 'false';
		//showSocialModal = 'false';
	}

	let userAvatar =
		'background-image:url("/assets/images/best-medium-format-camera-for-starting-out.jpg")';
	userAvatar = '';
</script>

<style lang="scss">
	/**tmp*/
	.grid {
		padding: 20px;
		margin: 0px;
		display: grid;
		grid-gap: 18px;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		list-style: none;
		max-height: 305px;
		overflow: scroll;
	}
	.grid li {
		background: #f9fafc;
		border-radius: 20px;
		padding: 5px;
	}
	.grid li img {
		max-height: 100px;
		border-radius: 10px;
		overflow: hidden;
	}
	.grid figure {
		background: #fff;
		box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
		width: 100%;
		margin: 0px;
		padding: 0px;
		border-radius: 20px;
		padding: 10px;
		min-width: 90px;
		text-align: center;
	}
	.grid figcaption {
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.grid .active {
		background: #f0f0f0 !important;
	}
	.grid .active figure {
		box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2), inset 0px 0px 0px 2px #7c8b9a !important;
	}
	.priceField {
		border: solid 2px #eaeaea;
		border-radius: 100px;
		margin: 0px 20px 10px;
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
	}

	.priceField label img {
		margin: 0px 8px 0px 10px;
	}
	hr {
		display: none;
	}
	.hr {
		background: #f9fafc;
		border-radius: 50px;
		height: 9px;
		margin: 0px 20px;
	}
	dl.receivedOfferPanel {
		display: flex;
		margin: 10px 20px;
	}
	.receivedOfferPanel dd {
		display: flex;
		flex-direction: column;
		margin: 0px 0px 0px 10px;
		flex: 1;
	}
	.nftAvatarWrapper {
		width: 90px;
		height: 80px;
		background-image: url('/img/nft_white_blank.svg');
		background-size: cover;
		background-position: center;
		padding: 4px;
	}

	.nftAvatar {
		width: 100%;
		height: 100%;
		mask: url('/img/nft_mask.svg');
		background: black;
		-webkit-mask-image: url('/img/nft_mask.svg');
		-webkit-mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		background-image: url('/icon.svg');
	}
	.crypto {
		text-transform: uppercase;
		color: #5285ff;
		font-weight: bold;
		font-size: 0.875em;
		letter-spacing: 1px;
	}
	.receivedOfferPanel textarea {
		line-height: 1.44;
		font-size: 0.875em;
		border: solid 2px #eaeaea;
		border-radius: 10px;
		padding: 4px 8px;
	}
	.fromWallet {
		color: #3f3b52;
	}
	.priceLabel {
		color: #3f3b52;
		margin-top: 10px;
		margin-left: 30px;
		display: block;
	}
</style>

<PWA />

<ModalWindow
	on:closeWindow="{closeWindow}"
	show="{showModal}"
	header="{modalHeader}"
	subHeader="{modalSubHeader}"
	keyboardShown="{keyboardShown}"
	buttons="{modalButtons}"
	hasShadow="{modalHasShadow}">
	{#if modalTpl === 'price'}
		<div class="priceField">
			<label for="priceField">
				<div style="align-items:center;">
					<img width="26" src="/img/ico_matic.svg" alt="Matic" />
				</div>
				<div class="crypto">Matic</div>
				<!--<div><span></span></div>-->
			</label>
			<input id="priceField" type="text" placeholder="Enter amount" />
		</div>
	{/if}

	{#if modalTpl === 'recievedOffer'}
		<dl class="receivedOfferPanel">
			<dt>
				<div class="nftAvatarWrapper">
					<div class="nftAvatar" style="{userAvatar}"></div>
				</div>
			</dt>
			<dd>
				<label for="fromWallet" class="fromWallet">From</label>
				<textarea id="priceField" type="text" placeholder="Enter amount"
					>0x1Eb05E2Ab2e838EB2c5ce9AEfb66068313FFED7F</textarea>
			</dd>
		</dl>
		<div class="hr"><hr /></div>
		<label for="priceField" class="priceLabel">Price</label>
		<div class="priceField">
			<label for="priceField">
				<div style="align-items:center;">
					<img width="26" src="/img/ico_matic.svg" alt="Matic" />
				</div>
				<div class="crypto">Matic</div>
				<!--<div><span></span></div>-->
			</label>
			<input id="priceField" type="text" placeholder="Enter amount" />
		</div>
	{/if}

	{#if modalTpl === 'selectNFT'}
		<ul class="grid">
			<li class="active">
				<figure>
					<img width="100%" src="/img/ico_eth.svg" alt="Ethereum" />
					<figcaption>Test Token</figcaption>
				</figure>
			</li>
			<li>
				<figure>
					<img width="100%" src="/img/ico_eth.svg" alt="Ethereum" />
					<figcaption>Test Token</figcaption>
				</figure>
			</li>
			<li>
				<figure>
					<img width="100%" src="/img/ico_eth.svg" alt="Ethereum" />
					<figcaption>Test Token</figcaption>
				</figure>
			</li>
			<li>
				<figure>
					<img width="100%" src="/img/ico_eth.svg" alt="Ethereum" />
					<figcaption>Test Token</figcaption>
				</figure>
			</li>
		</ul>
	{/if}
</ModalWindow>
<!-- xModal Overlays -->

<div class="container">
	<main class="main-container">
		<slot />
	</main>
</div>
