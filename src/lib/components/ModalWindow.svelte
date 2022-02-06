<script>
	//svelte
	import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import { bigBlue } from '$lib/components/conf/Buttons.js';

	import 'dialog-polyfill/dist/dialog-polyfill.css';

	export let show = 'false';
	export let header = false;
	export let subHeader = false;
	export let classes = '';
	export let buttons = [];
	export let buttonLayout = 'vertical';
	export let keyboardShown = false;
	export let showNotch = false;
	export let hasShadow = false;

	const dispatch = createEventDispatcher();

	let modalDom;
	let modalDomOverlay;
	let isMounted = false;
	let hideModal = false;
	let loading = false;

	$: if (isMounted && show) {
		if (show === 'true' && modalDom && modalDom.showModal) {
			modalDom.showModal();
		} else {
			closeModel();
		}
	}

	onMount(async () => {
		console.info('[Modal][Mount]');
		const dialogPolyfill = await import('dialog-polyfill'); //fixes firefox
		//console.log(dialogPolyfill);
		dialogPolyfill.default.registerDialog(modalDom);
		isMounted = true;
	});

	onDestroy(() => {
		//if (process.browser) {
		console.info('[Modal][Destroy]');

		//const modal = document.querySelector('#modal');
		if (modalDom && modalDom.open) {
			modalDom.close();
		}
		//}
	});

	/**
	 * closeModel
	 **/
	function closeModel() {
		console.info('[Modal][Close]');

		//const modal = document.querySelector('#modal');
		if (modalDom && modalDom.open) {
			hideModal = true;
			loading = false;
			const hideTheModal = function () {
				hideModal = false;
				modalDom.close();
				dispatchEvent('reset');
				modalDom.removeEventListener('webkitAnimationEnd', hideTheModal, false);
			};
			modalDom.addEventListener('webkitAnimationEnd', hideTheModal, false);
		}
	}

	function closeModelWin() {
		dispatchEvent({ action: 'closeWindow' });
	}
	/**
	 * dispatchEvent
	 * Dispatch event passing option data
	 **/
	const dispatchEvent = (options) => {
		console.log(`[Dispatch Event][${options.action}]`, options);

		dispatch(options.action, options);
	};

	/**
	 * handleWindowClick
	 * reset select if window clicked
	 **/
	function handleWindowClick(event) {
		if (!modalDomOverlay) return;
		const eventTarget = event.path && event.path.length > 0 ? event.path[0] : event.target;
		if (modalDomOverlay.contains(eventTarget)) return;

		if (modalDom && modalDom.open) {
			dispatchEvent({ action: 'closeWindow' });
		}
	}
</script>

<style>
	dialog::backdrop {
		overflow: hidden;
		backdrop-filter: blur(2px);
		opacity: 0;
	}
	:global(dialog + .backdrop) {
		background: rgba(0, 0, 0, 0.6) !important;
	}
	:global(dialog[open]::backdrop, dialog[open] + .backdrop) {
		animation-name: showBackdrop;
		animation-duration: 0.6s;
		animation-delay: 0.1s;
		animation-fill-mode: forwards;
		opacity: 0;
	}

	@keyframes showBackdrop {
		0% {
			opacity: 0;
		}
		1% {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes hideBackdrop {
		0% {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	:global(dialog[open].hide::backdrop, dialog[open].hide + .backdrop) {
		animation-name: hideBackdrop;
		animation-duration: 0.6s;
		animation-delay: 0.1s;
		animation-fill-mode: forwards;
		opacity: 1;
	}
	dialog {
		left: 0px;
		right: 0px;
		top: 0px;
		opacity: 0;
		background: #fff;
		width: auto;
		border-radius: 16px 16px 0px 0px;
		border: 0px;
		transition: bottom 0.2s;
		padding: 0px;
		position: fixed;
		will-change: transform, opacity;
		bottom: 0px;
		overflow: visible;
		background: #fff;
		max-width: 600px;
	}

	#modelWrapper {
		/*min-height:200px;*/
		position: relative;
		display: flex;
		flex-direction: column;
		/*padding-bottom: 25px;*/
	}


	header {
		position: relative;
		padding: 20px 20px 0px 20px;
		min-height: 50px; /*
		font-weight: bold;
		font-size: 1.3em;*/
	}
	.hasShadow::after {
		content: '';
		position: absolute;
		left: 0px;
		right: 0px;
		top: 100%;
		height: 4px;
		transition: opacity 0.3s;
		will-change: opacity;
		background: linear-gradient(
			rgba(9, 30, 66, 0.13) 0px,
			rgba(9, 30, 66, 0.13) 1px,
			rgba(9, 30, 66, 0.08) 1px,
			rgba(9, 30, 66, 0) 4px
		);
	}

	p {
		line-height: 1.4em;
		color: #3f3b52;
	}

	main {
		padding: 0px;
		max-width: 400px;
	}

	footer {
		text-align: center;
		padding: 0px;
		/*padding-top:20px*/
		min-height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: solid 1px #f5f7f5;
	}

	h2 {
		line-height: 1.4;
		color: #2c2c2c;
		margin: 0px;
	}

	.clear {
		background: transparent;
		/*border: 0.1px solid #F1F1F1;*/
		color: var(--color-core);
	}
	footer.vertical {
		flex-direction: column;
		padding: 0px 5px;
		align-items: stretch;
		align-items: center;
		padding: 10px 0px;
	}
	:global(footer.vertical > Button) {
		width: 260px;
	}

	:global(.error .button.primary) {
		background: #ee4238;
	}

	:global(.warning .button.primary) {
		background: #ffb800;
	}

	:global(dialog[open]) {
		top: auto;
		animation-name: showmodal;
		animation-duration: 0.6s;
		animation-delay: 0.1s;
		animation-fill-mode: forwards;
		opacity: 0;
		transform: translate3d(0%, 100%, 0px);
	}

	:global(dialog[open].hide) {
		animation-name: hidemodal;
		animation-duration: 0.6s;
		animation-delay: 0.1s;
		animation-fill-mode: forwards;
		opacity: 1;
		transform: translate3d(0%, 0%, 0px);
		/*bottom: 20px;*/
	}

	@keyframes showmodal {
		0% {
			transform: translate3d(0%, 100%, 0px);
			opacity: 0;
		}
		1% {
			opacity: 1;
		}
		to {
			transform: translate3d(0%, 0%, 0px);
			opacity: 1;
		}
	}

	@keyframes hidemodal {
		0% {
			transform: translate3d(0%, 0%, 0px);
			opacity: 1;
		}
		to {
			transform: translate3d(0%, 100%, 0px);
			opacity: 0;
		}
	}
	/*
@keyframes showmodal {
  0% {bottom: 0px; opacity: 0}
  1% {bottom:-200px; opacity: 1}
  to {bottom:20px; opacity: 1}
}

@keyframes hidemodal {
  0% {bottom: 20px; opacity: 1}
  to {bottom:-200px; opacity: 0}
}
*/
	.container {
		position: absolute;
		width: 200px;
		height: 200px;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		zoom: 0.2;
	}

	.item {
		width: 100px;
		height: 100px;
		position: absolute;
	}

	.item-1 {
		background-color: #fa5667;
		top: 0;
		left: 0;
		z-index: 1;
		animation: item-1_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 1) infinite;
	}

	.item-2 {
		background-color: #7a45e5;
		top: 0;
		right: 0;
		animation: item-2_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 1) infinite;
	}

	.item-3 {
		background-color: #1b91f7;
		bottom: 0;
		right: 0;
		z-index: 1;
		animation: item-3_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 1) infinite;
	}

	.item-4 {
		background-color: #fac24c;
		bottom: 0;
		left: 0;
		animation: item-4_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 1) infinite;
	}

	@keyframes item-1_move {
		0%,
		100% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(0, 100px);
		}
		50% {
			transform: translate(100px, 100px);
		}
		75% {
			transform: translate(100px, 0);
		}
	}

	@keyframes item-2_move {
		0%,
		100% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(-100px, 0);
		}
		50% {
			transform: translate(-100px, 100px);
		}
		75% {
			transform: translate(0, 100px);
		}
	}

	@keyframes item-3_move {
		0%,
		100% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(0, -100px);
		}
		50% {
			transform: translate(-100px, -100px);
		}
		75% {
			transform: translate(-100px, 0);
		}
	}

	@keyframes item-4_move {
		0%,
		100% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(100px, 0);
		}
		50% {
			transform: translate(100px, -100px);
		}
		75% {
			transform: translate(0, -100px);
		}
	}

	:global(#modal button) {
		margin: 10px;
		min-height: 40px;
	}
	.close {
		position: absolute;
		top: 10px;
		right: 10px;
		cursor: pointer;
		background-image: url('/img/ico_close.svg');
		background-repeat: no-repeat;
		background-size: contain;
		overflow: hidden;
		width: 30px;
		height: 40px;
		text-indent: 100px;
		z-index: 20;
	}

	.button {
		background: #00e3c6;
		color: #000;
		border: solid 2px #000;
		border-radius: 6px;
		font-weight: bold;
		padding: 12px 16px;
		margin: 10px;
		cursor: pointer;
		font-size: 1.6em;
		display: inline-block;
	}

	dialog.keyboard {
		top: unset !important;
		min-height: 370px;
	}

	.notch {
		background: #000;
		height: 8px;
		width: 60px;
		border-radius: 100px;
		margin: 10px auto;
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
</style>

<svelte:window on:click="{handleWindowClick}" />

<dialog
	id="modalWindow"
	class="{classes}"
	class:keyboard="{keyboardShown}"
	class:hide="{hideModal}"
	bind:this="{modalDom}">
	<div id="modelWrapper" bind:this="{modalDomOverlay}" on:click|stopPropagation>
		{#if showNotch}<div class="notch"></div>{/if}
		<i class="close" on:click|stopPropagation="{closeModelWin}">close</i>

		{#if header}
			<!-- Header -->
			<header class:hasShadow>
				<h2>{@html header}</h2>
				{#if subHeader}
					<p>{@html subHeader}</p>
				{/if}
			</header>
			{#if !hasShadow}
				<div class="hr"><hr /></div>
			{/if}
			<!-- xHeader -->
		{/if}

		<main>
			<slot />
		</main>

		{#if buttons}
			<!-- Footer -->
			<footer class="{buttonLayout}">
				{#each buttons as button}
					<Button
						{...bigBlue}
						cssName="{loading ? 'loading' : ''} {button.secondary ? 'secondary' : ''}"
						on:click="{() => {
							console.log('?xx');
							if (!loading) {
								if (button.action) {
									dispatchEvent({ action: button.action });
									loading = false;
								}
								if (button.method) {
									button.method();
								}
							} else {
								loading = true;
							}
						}}">
						{button.text}
					</Button>
				{/each}
			</footer>
			<!-- xFooter -->
		{/if}
	</div>
</dialog>
