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
	import { user as sUser } from '../stores/user';
	import { app as sApp } from '../stores/app.js';
	import { route as sRoute } from '../stores/routes.js';
	import { history as sHistory } from '../stores/history.js';
	import { bidding as sBidding } from '../stores/bidding.js';
	import { wallet as sWallet } from '../stores/wallet.js';

	//components
	import HeaderTabList from '$lib/components/HeaderTabList.svelte';
	import Button from '$lib/components/Button.svelte';
	import { bigBlue } from '$lib/components/conf/Buttons.js';
	import Toggle from '$lib/components/Toggle2.svelte';
	import { toggle_class } from 'svelte/internal';
	import { UserCheckIcon } from 'svelte-feather-icons';

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

	$: showTokens = $sUser.profile.showTokens;
	$: showNFTs = $sUser.profile.showNFTs;
	$: showLinks = $sUser.profile.showLinks;

	let claimedWallet = true;
	$: userAvatar = $sUser.profile.profilePic
		? `background-image:url("${$sUser.profile.profilePic}")`
		: '';
	$: userBG = $sUser.profile.profileBGPic
		? `background-image:url("${$sUser.profile.profileBGPic}"); background-size:cover;`
		: '';

	$: if ($sUser) {
		updateUserProfile();
	}
	//userAvatar = '';

	//profile info
	let name = $sUser.profile.name;
	let bio = $sUser.profile.bio;

	$: socialLinks = Object.entries($sUser.profile.socialLinks);
	//Object.keys($sUser.profile.socialLinks).map((key) => [
	//Number(key),
	//$sUser.profile.socialLinks[key],
	//]);
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

	function save() {
		let userProfile = $sUser.profile;
		userProfile.name = name;
		userProfile.bio = bio;
		sUser.updateVal('profile', userProfile);
	}

	/**
	 * deleteAllCookies
	 **/
	function deleteAllCookies() {
		const cookies = document.cookie.split(';');

		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf('=');
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}
	}

	/**
	 * reset
	 */
	function reset() {
		localStorage.clear();
		sessionStorage.clear();
		deleteAllCookies();
		caches.keys().then(function (keyList) {
			return Promise.all(
				keyList.map(function (key) {
					//if (cachesToKeep.indexOf(key) === -1) {
					return caches.delete(key);
					//}
				}),
			);
		});
		sModal.reset();
		sSocialModal.reset();
		sUser.reset();
		sApp.reset();
		sRoute.reset();
		sHistory.reset();
		sBidding.reset();
		sWallet.reset();
		window.location = '/';
	}

	/**
	 * toggle
	 */
	function toggle(toggleName, val) {
		console.log('toggle', toggleName, val);
		let userProfile = $sUser.profile;
		userProfile[toggleName] = val;
		sUser.updateVal('profile', userProfile);
	}
	/**
	 * removeLink
	 */
	function removeLink(linkTitle) {
		const key = linkTitle.replace(/ /g, '_');
		sUser.removeLink(key);
	}
	
	/**
	 * updateUserProfile
	 */
	async function updateUserProfile() {
		console.log('[updateUserProfile]',$sUser.profile)
		let params = {};
		let res = await Moralis.Cloud.run('updateUserProfile',{profile:$sUser.profile})

		console.log('[updateUserProfile]',res);
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
		width: 30px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.floatingLinks li.update {
		border: solid 4px #f5f7f5;
		border-radius: 100px;
		width: 40px;
		background: #fff;
		background-image: url('/img/ico_plus.svg ');
		background-size: 16px;
		background-repeat: no-repeat;
		background-position: center;
	}
	/*
	.editCollection {
		position: absolute;
		right: 20px;
		top: 50px;
		border-radius: 100px;
		border: solid 4px #f5f7f5;
		background: #fff;
		padding: 4px 12px;
	}*/

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
	.colSettings {
		width: 100%;
		margin: 0px;
		padding: 0px 20px;
	}

	.colSettings li {
		list-style: none;
		border-bottom: 0.1px solid var(--color-seperator-sidenav);
	}
	.colSettings li:first-child {
		border-top: 0.1px solid var(--color-seperator-sidenav);
	}
	.labelRow {
		display: flex;
		min-height: 64px;
	}
	.labelRow .label {
		align-self: center;
		flex: 1;
		padding: 0px 20px;
		text-transform: uppercase;
	}
	.labelRow .val {
		align-self: center;
		display: flex;
		padding: 0px 15px;
	}
	.groupTitle {
		background: var(--bg-search);
	}
	.groupTitle label {
		padding: 10px 20px;
		font-size: 1.3em;
		margin: 0px;
		display: block;
		font-weight: bold;
	}
	h4 {
		margin: 0px;
	}
	.hr hr {
		display: none;
	}
	.hr {
		background: #f9fafc;
		border-radius: 50px;
		height: 9px;
		margin: 20px 0px;
	}

	.alignCenter {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.linkList {
		margin: 20px 0px 0px 0px;
	}
	.linkList li {
		list-style: none;
		border-radius: 16px;
		border: solid 4px #f9fafc;
		padding: 10px;
		margin-bottom: 16px;
		position: relative;
	}

	.linkList li .overlayIco {
		position: absolute;
		z-index: 5;
		top: 10px;
		right: 10px;
	}
	.linkList li dl {
		margin: 0px;
		display: flex;
	}
	.linkList li dl dt {
		display: flex;
		align-items: center;
	}
	.linkList li dl dd {
		display: flex;
		align-items: center;
		margin-left: 10px;
		font-weight: bold;
		font-size: 1.2em;
	}
	.linkList p {
		font-size: 0.75em;
	}
	.removeLink {
		width: 30px;
		height: 30px;
		display: block;
		position: absolute;
		top: -15px;
		left: -15px;
		border-radius: 50%;
		border-radius: 100px;
		border: solid 4px #f5f7f5;
		background: #fff;
		padding: 4px 12px;
		background-image: url('/img/ico_close.svg');
		background-position: center;
		background-repeat: no-repeat;
		background-size: 20px;
	}
	select {
		border-radius: 100px;
		border: solid 4px #f5f7f5;
		background: #fff;
		padding: 4px 12px;
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
							style="{userBG}"
							class="profileBG"
							on:click="{() => {
								sModal.showModal({
									enable: 'true',
									title: 'Choose Your Header NFT',
									tpl: 'selectBGNFT',
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
						<div class="walletID">
							{$sUser.ethAddress ? $sUser.ethAddress : 'Unknown'}
						</div>
						<div class="profileInfo">
							{#if socialLinks && socialLinks.length > 0}
								<ul class="floatingLinks">
									{#each socialLinks as [site, url], i}
										{#if url}
											<li>
												<a target="_blank" href="{url}">
													<img
														style="display:block;"
														width="26"
														src="/img/ico_{site}.svg"
														alt="{site}" /></a>
											</li>
										{/if}
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
									save();
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

						<ul class="linkList">
							{#each Object.keys($sUser.links) as link}
								{#if $sUser.links[link].tpl === 'simple'}
									<li
										on:click="{() => {
											goto($sUser.links[link].url);
										}}">
										<i
											class="removeLink"
											on:click|stopPropagation="{() => {
												removeLink($sUser.links[link].title);
											}}"></i>
										<dl>
											<dt class="mini">
												{#if $sUser.links[link].url.includes('youtube')}
													<img width="26" src="/img/ico_youtube.svg" alt="Youtube" />
												{/if}
												{#if $sUser.links[link].url.includes('twitter')}
													<img width="26" src="/img/ico_twitter.svg" alt="twitter" />
												{/if}
												{#if $sUser.links[link].url.includes('instagram')}
													<img width="26" src="/img/ico_instagram.svg" alt="instagram" />
												{/if}
											</dt>
											<dd>{$sUser.links[link].title}</dd>
										</dl>
									</li>
								{/if}
								{#if $sUser.links[link].tpl === 'description'}
									<li
										on:click="{() => {
											goto($sUser.links[link].url);
										}}">
										<i
											class="removeLink"
											on:click|stopPropagation="{() => {
												removeLink($sUser.links[link].title);
											}}"></i>
										{#if $sUser.links[link].url.includes('youtube')}
											<img class="overlayIco" width="26" src="/img/ico_youtube.svg" alt="Youtube" />
										{/if}
										{#if $sUser.links[link].url.includes('twitter')}
											<img class="overlayIco" width="26" src="/img/ico_twitter.svg" alt="twitter" />
										{/if}
										{#if $sUser.links[link].url.includes('instagram')}
											<img
												class="overlayIco"
												width="26"
												src="/img/ico_instagram.svg"
												alt="instagram" />
										{/if}
										<dl>
											<dt class="mini">
												<img width="100" src="/tmp/example.png" alt="Youtube" />
											</dt>
											<dd>
												<div>
													{$sUser.links[link].title}<br />
													<p>{$sUser.links[link].description}</p>
												</div>
											</dd>
										</dl>
									</li>
								{/if}
								{#if $sUser.links[link].tpl === 'gallery'}
									<li
										on:click="{() => {
											goto($sUser.links[link].url);
										}}">
										<i
											class="removeLink"
											on:click|stopPropagation="{() => {
												removeLink($sUser.links[link].title);
											}}"></i>
										WIP<br />
										{$sUser.links[link].title}
									</li>
								{/if}
							{/each}
						</ul>
					</div>
				{:else if tab === 'Settings'}
					<ul class="colSettings">
						<li class="groupTitle">
							<label for="chain">Chain Setup</label>
						</li>
						<li>
							<div class="alignCenter" style="flex-direction:column">
								<h4>Selected Chain:</h4>
								<select>
									<option value="polygon">Polgyon Mainet</option>
									<option selected value="mumbai">Mumbai Test Network</option>
									<option value="ethereum">Ethereum Mainet</option>
									<option value="rinkeby">Rinkeby Test Network</option>
								</select>
							</div>
						</li>
						<li>
							<div class="hr"><hr /></div>
						</li>
						<li class="groupTitle">
							<label for="profile">Profile Page Display</label>
						</li>
						<li>
							<div class="labelRow">
								<div class="label">Show Tokens</div>
								<div class="val">
									<Toggle
										on:toggle="{(e) => {
											toggle('showTokens', e.detail.val);
										}}"
										inputVal="{showTokens}"
										disableClick="{true}" />
								</div>
							</div>
						</li>
						<li>
							<div class="labelRow">
								<div class="label">Show NFTs</div>
								<div class="val">
									<Toggle
										on:toggle="{(e) => {
											toggle('showNFTs', e.detail.val);
										}}"
										inputVal="{showNFTs}"
										disableClick="{true}" />
								</div>
							</div>
						</li>
						<li>
							<div class="labelRow">
								<div class="label">Show Links</div>
								<div class="val">
									<Toggle
										on:toggle="{(e) => {
											toggle('showLinks', e.detail.val);
										}}"
										inputVal="{showLinks}"
										disableClick="{true}" />
								</div>
							</div>
						</li>
						<li>
							<div class="hr"><hr /></div>
						</li>
						<li>
							<div class="alignCenter">
								<button class="save" on:click="{reset}">Reset Profile</button>
							</div>
						</li>
						<li>
							<div class="hr"><hr /></div>
						</li>
					</ul>
				{/if}
			</article>
		</div>
	</section>
{/if}
