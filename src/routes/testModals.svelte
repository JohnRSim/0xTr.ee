<script>
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';

	//stores
	import { modal as sModal } from '../stores/modal.js';

	//components
	import Button from '$lib/components/Button.svelte';
	import { bigBlue } from '$lib/components/conf/Buttons.js';
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
	img {
		width: 100%;
	}
	h2 {
		color: #383c3a;
	}
	h2 > span {
		color: #737675;
	}
</style>

<section style="transform: translate3d(0px, 60px, 0px);" id="XT-home" class="scrollable gpu_acc">
	<div style="flex:1;display:flex;flex-direction:column;">
		<article style="flex:1;" dir="auto">
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
			<Button
				{...bigBlue}
				on:click="{() => {
					sModal.showModal({
						enable: 'true',
						title: 'Confirm Your Offer',
						tpl: 'price',
						subHeader: false,
						buttons: [
							{
								text: 'Make An Offer',
								action: 'makeOfferConfirm',
							},
							{
								secondary: true,
								text: 'Edit Offer',
								action: 'editOffer',
							},
						],
					});
				}}">Confirm Offer</Button>
			<Button
				{...bigBlue}
				on:click="{() => {
					sModal.showModal({
						enable: 'true',
						title: 'Offer Sent',
						tpl: 'price',
						subHeader: 'Your offer for {...} has been sent to the owner',
						buttons: [
							{
								text: 'Close',
								action: 'closeWindow',
							},
						],
					});
				}}">Offer Sent</Button>
			<Button
				{...bigBlue}
				on:click="{() => {
					sModal.showModal({
						enable: 'true',
						title: 'Insufficient Funds',
						subHeader:
							'Sorry you do not have enough funds to make this offer. <br />Please deposit and try again.',
						buttons: [
							{
								text: 'Close',
								action: 'closeWindow',
							},
						],
					});
				}}">Insufficient Funds</Button>
			<Button
				{...bigBlue}
				on:click="{() => {
					sModal.showModal({
						enable: 'true',
						title: 'Offer Declined',
						subHeader: 'Unfortunately your offer for {...} has been declined.',
						buttons: [
							{
								text: 'Make Another Offer',
								action: 'makeAnotherOffer',
							},
							{
								secondary: true,
								text: 'View',
								action: 'viewOfferNFT',
							},
						],
					});
				}}">Offer Declined</Button>
			<Button
				{...bigBlue}
				on:click="{() => {
					sModal.showModal({
						enable: 'true',
						title: 'Offer Accepted',
						subHeader: 'You are now the proud owner of {...}. <br />Click below to view your NFT.',
						buttons: [
							{
								text: 'View',
								action: 'viewOfferNFT',
							},
						],
					});
				}}">Offer Accepted Seller</Button>
			<Button
				{...bigBlue}
				on:click="{() => {
					sModal.showModal({
						enable: 'true',
						title: 'Offer Accepted',
						subHeader: `Nice! You have accepted the offer for {...}, we'll let you know once your funds are in your wallet.`,
						buttons: [
							{
								text: 'Close',
								action: 'closeWindow',
							},
						],
					});
				}}">Offer Accepted Buyer</Button>
			<Button
				{...bigBlue}
				on:click="{() => {
					sModal.showModal({
						enable: 'true',
						title: 'Offer Recieved',
						tpl: 'recievedOffer',
						subHeader: 'Would you like to Accept or Decline this offer for {...}. ',
						buttons: [
							{
								text: 'Accept',
								action: 'acceptOffer',
							},
							{
								secondary: true,
								text: 'Decline',
								action: 'declineOffer',
							},
						],
					});
				}}">Offer Recieved</Button>
		</article>
	</div>
</section>
