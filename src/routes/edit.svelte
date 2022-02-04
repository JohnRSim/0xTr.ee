<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ fetch, params, url }) {
		const { pathname } = url;
		const { slug } = params;

		//check address is potential wallet path
		//TODO add more checking ;)
		const searchParams = url.searchParams;
		const tab = searchParams.get('tab');

		//send across tab path if defined
		return {
			props: {
				tab: tab ? tab : 'Profile',
			},
		};
		//if it isn't 0x then 404 page..
	}
</script>

<script>
	//sveltkit
	import { goto } from '$app/navigation';

	// svelte
	import { onDestroy, onMount } from 'svelte';

	//stores
	import { modal as sModal } from '../stores/modal.js';
	import { socialModal as sSocialModal } from '../stores/socialModal.js';

	//components
	import HeaderTabList from '$lib/components/HeaderTabList.svelte';
	import Button from '$lib/components/Button.svelte';
	import { bigBlue } from '$lib/components/conf/Buttons.js';

	export let tab;

	let hasTabs = [
		{
			name: 'Profile',
			path: `/edit?tab=Profile`,
		},
		{
			name: 'Network',
			path: `/edit?tab=Network`,
		},
		{
			name: 'Settings',
			path: `/edit?tab=Settings`,
		},
	];

	let claimedWallet = true;
	let userAvatar =
		'background-image:url("/assets/images/best-medium-format-camera-for-starting-out.jpg")';
	userAvatar = '';

	//profile info
	let name = '';
	let bio = '';

	let socialLinks = [];

	let isMounted = false;
	onMount(async () => {
		isMounted = true;
	});

	/**
	 * goBack
	 */
	function goBack(defaultRoute) {
		if (defaultRoute) {
			goto(defaultRoute);
		} else {
			window.history.go(-1);
		}
	}
</script>

<style>
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
		padding-bottom: 60px;
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
		min-height: 80px;
		position: relative;
		width: 100%;
	}
	.nftAvatarWrapper {
		position: absolute;
		left: 20px;
		bottom: -56px;
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

	.walletID {
		background: #f9fafc;
		height: 30px;
		width: 100%;
		padding-left: 115px;
		font-size: 0.7em;
		display: flex;
		align-items: center;
	}

	.profileInfo b {
		font-size: 0.875em;
	}
	.profileInfo {
		position: relative;
		padding: 30px 20px 0px;
		color: #383c3a;
	}

	.claimed .profileBG {
		min-height: 160px;
		background-color: #f9fafc;
		background-image: url('/img/ico_edit_main.svg');
		background-size: 100px;
		background-position: center;
		background-repeat: no-repeat;
	}

	.updateNFTIco {
		border-radius: 50%;
		width: 30px;
		height: 30px;
		bottom: 3px;
		right: -2px;
		background: #ffffff;
		border: solid 3px #f5f7f5;
		position: absolute;
		z-index: 10;
		background-image: url('/img/ico_cam.svg');
		background-size: 16px;
		background-position: 3px 3px;
		background-repeat: no-repeat;
	}

	.editSocial {
		position: absolute;
		right: 20px;
		top: 10px;
		border-radius: 100px;
		border: solid 4px #f5f7f5;
		background: #fff;
		padding: 4px 12px;
	}
	.floatingLinks {
		position: absolute;
		right: 20px;
		top: 10px;
		background: #fff;
		display: flex;
		margin: 0px;
	}
	.floatingLinks li {
		list-style: none;
		margin-left: 4px;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.floatingLinks li.update {
		border: solid 4px #f5f7f5;
		border-radius: 100px;
		background: #fff;
		background-image: url('/img/ico_plus.svg ');
		background-size: 16px;
		background-repeat: no-repeat;
		background-position: center;
	}
	.editCollection {
		position: absolute;
		right: 20px;
		top: 50px;
		border-radius: 100px;
		border: solid 4px #f5f7f5;
		background: #fff;
		padding: 4px 12px;
	}

	form {
		display: flex;
		flex-direction: column;
	}
	form label {
		display: flex;
		margin: 8px 0px;
		border-radius: 8px;
		border: solid 4px #f9fafc;
		padding: 0px 10px;
	}
	form label input,
	form label textarea {
		flex: 1;
		border: 0px;
		line-height: 50px;
		font-size: 1.5em;
	}
	form label input::placeholder,
	form label textarea::placeholder {
		color: #d9dde2;
	}

	.save {
		color: #fff;
		background: #1473e6;
		padding: 16px 32px;
		border: 0px;
		border-radius: 100px;
	}
	.center {
		text-align: center;
		font-size: 1.2em;
	}
	.bio {
		line-height: 1.44;
		font-size: 0.875em;
		margin: 0px;
	}
	.createOption {
		display: flex;
		margin: 5px 0px 0px 0px;
	}

	.createOption dt {
		width: 40px;
		height: 40px;

		display: flex;
		align-items: center;
		padding: 10px;
		border-radius: 100px;
		background: #f5f7f5;
	}
	.createOption dd {
		display: flex;
		align-items: center;
		margin: 0px 0px 0px 10px;
		font-weight: bold;
		font-size: 1.2em;
	}
</style>

{#if isMounted}
	<section
		style="transform: translate3d(0px, 60px, 0px);"
		id="XT-editProfile"
		class="scrollable gpu_acc">
		<div style="flex:1;display:flex;flex-direction:column;">
			<article style="flex:1;" dir="auto">
				<div style="padding:0px 20px 10px">
					<HeaderTabList
						on:tab="{(e) => {
							goto(e.detail.path, { replaceState: true, noscroll: true });
						}}"
						hasTabs="{hasTabs}"
						activeTab="{tab}" />
				</div>
				{#if tab === 'Profile'}
					<header class:claimed="{claimedWallet}">
						<div
							class="profileBG"
							on:click="{() => {
								sModal.showModal({
									enable: 'true',
									title: 'Choose Your Header NFT',
									tpl: 'selectNFT',
									notch: true,
									hasShadow: true,
									subHeader: 'This NFT will be displayed as your header picture.',
									buttons: [
										{
											text: 'Confirm',
											action: 'closeWindow',
										},
									],
								});
							}}">
							<div
								class="nftAvatarWrapper"
								on:click|stopPropagation="{() => {
									sModal.showModal({
										enable: 'true',
										title: 'Choose Your Profile NFT',
										tpl: 'selectNFT',
										notch: true,
										hasShadow: true,
										subHeader: 'This NFT will be displayed as your profile picture.',
										buttons: [
											{
												text: 'Confirm',
												action: 'closeWindow',
											},
										],
									});
								}}">
								<div class="updateNFTIco"></div>
								<div class="nftAvatar" style="{userAvatar}"></div>
							</div>
						</div>
						<div class="walletID">0x1Eb05E2Ab2e838EB2c5ce9AEfb66068313FFED7F</div>
						<div class="profileInfo">
							{#if socialLinks && socialLinks.length > 0}
								<ul class="floatingLinks">
									{#each socialLinks as link}
										<li>{link.name}</li>
									{/each}
									<li
										class="update"
										on:click="{() => {
											sSocialModal.showModal({
												enable: 'true',
												title: 'Update Social Links',
												tpl: 'addSocial',
												buttons: [
													{
														text: 'Save Links',
														action: 'saveSocialLinks',
													},
												],
											});
										}}">
									</li>
								</ul>
							{:else}
								<button
									class="editSocial"
									on:click="{() => {
										sSocialModal.showModal({
											enable: 'true',
											title: 'Update Social Links',
											tpl: 'addSocial',
											buttons: [
												{
													text: 'Save Links',
													action: 'saveSocialLinks',
												},
											],
										});
									}}">Add Social Links</button>
							{/if}
							<!--<button
								class="editCollection"
								on:click="{() => {
									goto(`/`);
								}}">Add NFT Collection</button>-->
							<b>{name ? name : 'Anonymous Wallet'}</b>
							{#if bio}
								<p class="bio">
									{bio}
								</p>
							{/if}
						</div>
						<div style="padding:20px;">
							<form>
								<label
									><input
										maxlength="22"
										bind:value="{name}"
										placeholder="Your name or alias" /></label>
								<label
									><textarea maxlength="255" bind:value="{bio}" placeholder="Your bio"></textarea
									></label>
								<!--<label><input placeholder="Location" /></label>
								<label><input placeholder="Date of Birth" /></label>-->
							</form>
						</div>
						<div class="center">
							<button
								class="save"
								on:click="{() => {
									goBack();
								}}">Save your profile</button>
						</div>
					</header>
				{:else if tab === 'Network'}
					<div style="width:100%;padding:0px 20px;">
						<dl
							class="createOption"
							on:click="{() => {
								sSocialModal.showModal({
									enable: 'true',
									title: '',
									tpl: 'createNetwork',
									buttons: [
										{
											text: 'Add Detail',
											action: 'addDetail',
										},
									],
								});
							}}">
							<dt>
								<img width="26" src="/img/ico_edit_main.svg" alt="Create" />
							</dt>
							<dd>Create Network Category</dd>
						</dl>
					</div>
				{:else if tab === 'Settings'}
					<div>WIP</div>
				{/if}
			</article>
		</div>
	</section>
{/if}
