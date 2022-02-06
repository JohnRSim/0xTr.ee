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

			//send across tab path if defined
			return {
				props: {
					slug,
					tab: tab ? tab : 'Tokens',
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
	import { user as sUser } from '../../stores/user';
	import { wallet as sWallet } from '../../stores/wallet';
	import { socialModal as sSocialModal } from '../../stores/socialModal.js';
	import { app as sApp } from '../../stores/app.js';
	import { route as sRoute } from '../../stores/routes.js';
	import { history as sHistory } from '../../stores/history.js';
	import { bidding as sBidding } from '../../stores/bidding.js';

	import { keys } from 'object-hash';

	export let tab, slug;

	$: userAccount = false;

	$: hasTabs = [];

	/*
	hasTabs.push({
		name: 'Links',
		path: `/${slug}?tab=Links`,
	});*/

	$: userAvatar =
		$sUser.profile.profilePic && userAccount
			? `background-image:url("${$sUser.profile.profilePic}")`
			: '';

	$: userBG =
		$sUser.profile.profileBGPic && userAccount
			? `background-image:url("${$sUser.profile.profileBGPic}"); background-size:cover;`
			: '';

	$: tokenList = [];
	$: NFTs = [];
	$: socialLinks = [];

	$: if (slug) {
		refresh();
	}

	let oldslug = slug;
	let runOnce = true;
	async function refresh() {
		userAccount = $sUser.ethAddress.length > 0 && slug === $sUser.ethAddress;
		
		//console.log('-----------------slug', oldslug, slug, oldslug === slug, userAccount);
		/*
		if (oldslug !== slug) {
			console.log('.......slug', slug, $sUser.ethAddress, userAccount);
			userAccount = $sUser.ethAddress.length > 0 && slug === $sUser.ethAddress;
			console.log('.......userAcc', userAccount);
			if (userAccount) {
				let userTabs = [];
				if ($sUser.profile.showTokens) {
					userTabs.push({
						name: 'Tokens',
						path: `/${slug}?tab=Tokens`,
					});
					showTokensTabContent = true;
				}
				if ($sUser.profile.showNFTs) {
					userTabs.push({
						name: 'NFTs',
						path: `/${slug}?tab=NFTs`,
					});
					showNFTsTabContent = true;
				}
				if ($sUser.profile.showLinks) {
					userTabs.push({
						name: 'Links',
						path: `/${slug}?tab=Links`,
					});
					showLinksTabContent = true;
				}
				hasTabs = userTabs;

				tokenList = $sUser.ft;
				NFTs = $sUser.nft;
				socialLinks = Object.entries($sUser.profile.socialLinks);
				loading = false;
				getUserProfile();
			} else {
				hasTabs = [
					{
						name: 'Tokens',
						path: `/${slug}?tab=Tokens`,
					},
					{
						name: 'NFTs',
						path: `/${slug}?tab=NFTs`,
					},
				];
				showTokensTabContent = true;
				showNFTsTabContent = true;
				showLinksTabContent = false;
				if ($sWallet[slug]) {
					tokenList = $sWallet[slug].ft;
					NFTs = $sWallet[slug].nft;
					socialLinks = Object.entries($sWallet[slug].profile.socialLinks);
					loading = false;
				} else {
					updateWallet();
				}
				//checkAccountExists(slug);
			}
			oldslug = slug;
		}
		*/
		if (runOnce) {
			runOnce = false;

			if (userAccount) {
				let userTabs = [];
				if ($sUser.profile.showTokens) {
					userTabs.push({
						name: 'Tokens',
						path: `/${slug}?tab=Tokens`,
					});
					showTokensTabContent = true;
				}
				if ($sUser.profile.showNFTs) {
					userTabs.push({
						name: 'NFTs',
						path: `/${slug}?tab=NFTs`,
					});
					showNFTsTabContent = true;
				}
				if ($sUser.profile.showLinks) {
					userTabs.push({
						name: 'Links',
						path: `/${slug}?tab=Links`,
					});
					showLinksTabContent = true;
				}
				hasTabs = userTabs;

				tokenList = $sUser.ft;
				NFTs = $sUser.nft;
				socialLinks = Object.entries($sUser.profile.socialLinks);
				loading = false;
				getUserProfile();
			} else {
				hasTabs = [
					{
						name: 'Tokens',
						path: `/${slug}?tab=Tokens`,
					},
					{
						name: 'NFTs',
						path: `/${slug}?tab=NFTs`,
					},
				];

				showTokensTabContent = true;
				showNFTsTabContent = true;
				showLinksTabContent = false;

				if ($sWallet[slug]) {
					tokenList = $sWallet[slug].ft;
					NFTs = $sWallet[slug].nft;
					socialLinks = Object.entries($sWallet[slug].profile.socialLinks);
					loading = false;
				}
				//checkAccountExists(slug);
			}

			
			if ((window) && ((typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined'))) {
				await Moralis.enableWeb3();
			}

			//isMounted = true;
			updateWallet();
		} else {

			if (oldslug !== slug) {
				console.log('.......slug', slug, $sUser.ethAddress, userAccount);
				userAccount = $sUser.ethAddress.length > 0 && slug === $sUser.ethAddress;
				console.log('.......userAcc', userAccount);
				if (userAccount) {
					let userTabs = [];
					if ($sUser.profile.showTokens) {
						userTabs.push({
							name: 'Tokens',
							path: `/${slug}?tab=Tokens`,
						});
						showTokensTabContent = true;
					}
					if ($sUser.profile.showNFTs) {
						userTabs.push({
							name: 'NFTs',
							path: `/${slug}?tab=NFTs`,
						});
						showNFTsTabContent = true;
					}
					if ($sUser.profile.showLinks) {
						userTabs.push({
							name: 'Links',
							path: `/${slug}?tab=Links`,
						});
						showLinksTabContent = true;
					}
					hasTabs = userTabs;

					tokenList = $sUser.ft;
					NFTs = $sUser.nft;
					socialLinks = Object.entries($sUser.profile.socialLinks);
					loading = false;
					getUserProfile();
				} else {
					hasTabs = [
						{
							name: 'Tokens',
							path: `/${slug}?tab=Tokens`,
						},
						{
							name: 'NFTs',
							path: `/${slug}?tab=NFTs`,
						},
					];
					showTokensTabContent = true;
					showNFTsTabContent = true;
					showLinksTabContent = false;
					if ($sWallet[slug]) {
						tokenList = $sWallet[slug].ft;
						NFTs = $sWallet[slug].nft;
						socialLinks = Object.entries($sWallet[slug].profile.socialLinks);
						loading = false;
					} else {
						updateWallet();
					}
					//checkAccountExists(slug);
				}
				oldslug = slug;
			}
		}
	}

	let claimedWallet = true;
	let userAvatar =
		'background-image:url("/assets/images/best-medium-format-camera-for-starting-out.jpg")';
	userAvatar = '';

	let isMounted = false;
	let loading = true;

	let showTokensTabContent = false;
	let showNFTsTabContent = false;
	let showLinksTabContent = false;
	$: if ((isMounted) && ($sApp.ready)) {
		refresh();
	}

	onMount(async () => {
		console.log('[onMount][wallet]');
		isMounted = true;


	});

	/**
	 * checkAccountExists
	 */
	async function checkAccountExists(test) {
		console.log('[checkAccountExists]',test)
		//console.log(`'${slug}'`, `'${$sUser.ethAddress}'`)
		//console.log('0x123e710c69b6806ef32Cf52e49dCC5EEEc368a22' === slug)
		let params = {ethAddress: '0x123e710c69b6806ef32cf52e49dcc5eeec368a22'};
		//console.log(params,'x1')
		console.log('test',test)
		console.log('test',test+'')
		params = {ethAddress: test};
		//params = {ethAddress: '0x123e710c69b6806ef32cf52e49dcc5eeec368a22'};
		let res = await Moralis.Cloud.run('checkAddress',params)
		//console.log(params,'x2');
		
		console.log('[checkAccountExists]',res)
		return (res.length > 0);
	}

	/**
	 * updateWallet
	 */
	async function updateWallet() {
		let grabNFTs = {};
		if (userAccount) {
			tokenList = await Moralis.Web3API.account.getTokenBalances({ chain: 'mumbai' });
			grabNFTs = await Moralis.Web3API.account.getNFTs({ chain: 'mumbai' });
		} else {
			tokenList = await Moralis.Web3API.account.getTokenBalances({
				chain: 'mumbai',
				address: slug,
			});
			grabNFTs = await Moralis.Web3API.account.getNFTs({ chain: 'mumbai', address: slug });
		}

		NFTs = grabNFTs.result.filter((nft) => {
			if (nft.metadata !== null) {
				nft.metadata = JSON.parse(nft.metadata);
			}
			return nft.metadata !== null;
		});

		console.log('hasNFTs', NFTs);
		console.log(tokenList);
		console.log(grabNFTs);

		if (userAccount) {
			sUser.updateVal('ft', tokenList);
			sUser.updateVal('nft', NFTs);
		} else {
			sWallet.updateWallet(slug, {
				id: slug,
				ft: tokenList,
				nft: NFTs,
			});
		}
		loading = false;
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
	 * claimWallet
	*/
	async function claimWallet() {
		if ($sUser.ethAddress) {
			sModal.showModal({
				enable: 'true',
				title: 'User Logged In',
				subHeader:
					'We will log you out and allow you to authenticate with the address that matches - this will allow you to claim this wallet.',
				buttons: [
					{
						text: 'Claim Wallet',
						action: 'claimWallet',
					},
					{
						text: 'Cancel',
						action: 'closeWindow',
					},
				],
			});
		} else {
			await Moralis.User.logOut();
			
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
			
			//let user
			await Moralis.authenticate({ signingMessage: 'Log in to claim wallet' })
				.then(function (user) {
					console.log('logged in user:', user);
					console.log(user.get('ethAddress'));
					sUser.updateVal('userInfo', user);
					sUser.updateVal('ethAddress', user.attributes.ethAddress);
					goto(`/${user.attributes.ethAddress}`);
				})
				.catch(function (error) {
					console.log(error);
				});
		}
	}

	async function updateUsertest() {
		console.log('testuser')
		
		let params = {ethAddress: slug};
		//params = {ethAddress: '0x123e710c69b6806ef32cf52e49dcc5eeec368a22'};
		let res = await Moralis.Cloud.run('updateUser2',params)
		//console.log(params,'x2');
		
		console.log('[checkAccountExists]',res)
	}

	/**
	 * get user profile object
	 */
	async function getUserProfile() {
		if (!$sUser.hasProfileFromDB) {
			let params = {};
			let res = await Moralis.Cloud.run('getProfile',params);

			console.log('[getUserProfile]',res)
			if ((res) && (Object.keys(res).length > 5)) {//hack
				sUser.updateVal('profile',res);
				sUser.updateVal('hasProfileFromDB',true);
			}
		}
	}
	/*
	Moralis.Cloud.define("generateSpecialData", async (request) => {
    if (!request.user.get("specialData")) {
        request.user.set("specialData", "0x0000000000000000000000000000000000000000");
        await request.user.save({useMasterKey: true});
        return request.user;
    }
    return 2;
}, {
    requireUser: true,
    useMasterKey: true
});*/
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
	}

	article {
		display: flex;
		justify-content: start;
		flex-direction: column;
		margin: 0px;
		text-align: left;
		align-items: center;
	}

	.tokenList dl {
		display: flex;
	}
	.tokenList dt {
		background: #f9fafc;
		border-radius: 20px;
		padding: 5px;
	}
	.tokenList dd {
		margin-left: 20px;
		display: flex;
		align-items: center;
	}
	.tokenList figure {
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
	.tokenList figcaption {
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	.tokenList img {
		display: block;
		margin: 0px auto;
	}

	.grid {
		padding: 0;
		margin: 20px 0px 0px 0px;
		display: grid;
		grid-gap: 18px;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		list-style: none;
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

	header {
		width: 100%;
		position: relative;
		z-index: 10;
	}
	header::after {
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
		padding: 30px 20px;
		color: #383c3a;
	}

	.claimed .profileBG {
		min-height: 160px;
	}

	.editProfile {
		display: none;
		position: absolute;
		bottom: 20px;
		right: 20px;
		border-radius: 100px;
		border: solid 4px #f5f7f5;
		background: #fff;
		padding: 4px 12px;
	}
	.claimed .editProfile {
		display: inline-block;
	}
	.claimed .claimWallet {
		/*display: none;*/
	}
	.claimWallet {
		position: absolute;
		top: 20px;
		right: 20px;
		background: #1473e6;
		color: #fff;
		border-radius: 100px;
		border: solid 4px #f5f7f5;
		padding: 4px 12px;
	}
	.browse {
		background: #f9fafc;
		border-radius: 100px;
		padding: 5px;
	}
	.browse button {
		background: #fff;
		box-shadow: 0px 1px 2px rgb(0 0 0 / 20%);
		width: 100%;
		margin: 0px;
		padding: 0px;
		border-radius: 100px;
		padding: 10px;
		min-width: 90px;
		text-align: center;
		border: 0px;
		font-weight: bold;
		color: #5a566a;
		font-size: 0.8em;
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
		background-image: url('/img/ico_polygon1.svg');
		background-size: 24px;
		background-position: 0px;
		background-repeat: no-repeat;
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
	/*.floatingLinks li.update {
		border: solid 4px #f5f7f5;
		border-radius: 100px;
		width: 40px;
		background: #fff;
		background-image: url('/img/ico_plus.svg ');
		background-size: 16px;
		background-repeat: no-repeat;
		background-position: center;
	}*/
	.bio {
		margin: 0px;
	}
	
	.loader {
		min-width: 40px;
		height: 40px;
		background-color: #383c3a;
		background-image: url('/img/spinner_oval.svg');
		background-size: 24px;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 6px;
		transition: background 0.2s;
	}

	.loadingWallet {
		display: flex;
		border: solid 4px #eaeaea;
		border-radius: 100px;
		margin: 20px 20px 10px;
		overflow: hidden;
		background: #fff;
	}
	.loadingWallet .txt {
		padding-left: 10px;
		display: flex;
		align-items: center;
		font-weight: bold;
	}

</style>

{#if isMounted}
	<section style="transform: translate3d(0px, 0px, 0px);" id="XT-wallet" class="scrollable gpu_acc">
		<div style="flex:1;display:flex;flex-direction:column;">
			<article style="flex:1;" dir="auto">
				<header class:claimed="{claimedWallet}">
					<div class="profileBG" style="{userBG}">
						{#if userAccount}
							<button
								class="editProfile"
								on:click="{() => {
									goto(`/edit`);
								}}">Edit Profile</button>
						{/if}
						<div class="nftAvatarWrapper">
							<div class="updateNFTIco"></div>
							<div class="nftAvatar" style="{userAvatar}"></div>
						</div>
					</div>
					<div class="walletID">
						{userAccount ? $sUser.ethAddress : slug}
					</div>
					<div class="profileInfo">
						{#if !userAccount}
							<button on:click="{claimWallet}" class="claimWallet">Claim this Wallet</button>
						{:else}
							<ul class="floatingLinks">
									{#each Object.entries($sUser.profile.socialLinks) as [site, url], i}
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
							</ul>
						{/if}
						<b>{$sUser.profile.name ? $sUser.profile.name : 'Anonymous Wallet'}</b>
						{#if $sUser.profile.bio}
							<p class="bio">
								{$sUser.profile.bio}
							</p>
						{/if}
					</div>
				</header>

				<div style="padding:20px">
					<HeaderTabList
						on:tab="{(e) => {
							goto(e.detail.path, { replaceState: true, noscroll: true });
						}}"
						hasTabs="{hasTabs}"
						activeTab="{tab}" />

					<div style="width:100%;">
						{#if tab === 'Tokens' && showTokensTabContent}
							{#if loading && tokenList.length === 0}
								<div class="loadingWallet">
									<div><div class="loader"></div></div>

									<div class="txt">
										Loading Wallet...
									</div>
								</div>
							{:else}
								<div class="tokenList">
									{#if tokenList && tokenList.length > 0}
										{#each tokenList as token}
											<dl>
												<dt>
													<figure>
														{#if token.logo}
															<img width="20" src="{token.logo}" alt="{token.name}" />
														{:else}
															<img width="40" src="/icon.svg" alt="{token.name}" />
														{/if}
														<figcaption>{token.symbol}</figcaption>
													</figure>
												</dt>
												<dd>
													{#if window && window._ethers}
														{window._ethers.utils.formatEther(token.balance)}<br />
													{/if}
													{token.name}
												</dd>
											</dl>
										{/each}
										<!--<dl>
										<dt>
											<figure>
												<img width="20" src="/img/ico_eth.svg" alt="Ethereum" />
												<figcaption>Eth</figcaption>
											</figure>
										</dt>
										<dd>
											23.532<br />
											Ethereum
										</dd>
									</dl>
									<div class="hr"><hr /></div>
									<dl>
										<dt>
											<figure>
												<img width="20" src="/img/ico_eth.svg" alt="Ethereum" />
												<figcaption>Matic</figcaption>
											</figure>
										</dt>
										<dd>
											1234567.234<br />
											Matic
										</dd>
									</dl>
									<div class="hr"><hr /></div>
									<dl>
										<dt>
											<figure>
												<img width="20" src="/img/ico_eth.svg" alt="Ethereum" />
												<figcaption>Matic</figcaption>
											</figure>
										</dt>
										<dd>
											1234567.234<br />
											Matic
										</dd>
									</dl>
									<div class="hr"><hr /></div>
									<dl>
										<dt>
											<figure>
												<img width="20" src="/img/ico_eth.svg" alt="Ethereum" />
												<figcaption>Matic</figcaption>
											</figure>
										</dt>
										<dd>
											1234567.234<br />
											Matic
										</dd>
									</dl>
									<div class="hr"><hr /></div>
									<dl>
										<dt>
											<figure>
												<img width="20" src="/img/ico_eth.svg" alt="Ethereum" />
												<figcaption>Matic</figcaption>
											</figure>
										</dt>
										<dd>
											1234567.234<br />
											Matic
										</dd>
									</dl>
									<div class="hr"><hr /></div>
									<dl>
										<dt>
											<figure>
												<img width="20" src="/img/ico_eth.svg" alt="Ethereum" />
												<figcaption>Matic</figcaption>
											</figure>
										</dt>
										<dd>
											1234567.234<br />
											Matic
										</dd>
									</dl>-->
									{:else}
										<img
											style="margin-top:20px"
											width="170"
											src="/img/placeholder_moonpay.png"
											alt="Pay with Moonpay today" />

										<div style="text-align:center">
											<Button
												on:click="{() => {
													sModal.showModal({
														enable: 'true',
														title: 'Work in Progress',
														subHeader:
															'Didn`t have time to build an integration with Moonpay - but the plan would be to use moonpay to purchase tokens for the user wallet..',
														buttons: [
															{
																text: 'Close',
																action: 'closeWindow',
															},
														],
													});
												}}"
												{...bigBlue}>Purchase Tokens</Button>
										</div>
									{/if}
								</div>
							{/if}
						{:else if tab === 'NFTs' && showNFTsTabContent}
							{#if loading && NFTs.length === 0}
								
								<div class="loadingWallet">
									<div><div class="loader"></div></div>

									<div class="txt">
										Loading Wallet...
									</div>
								</div>
							{:else}
								<ul class="grid">
									{#if NFTs && NFTs.length > 0}
										{#each NFTs as NFT}
											{#if NFT.metadata}
												<li
													on:click="{() => {
														goto(`/nft/${NFT.token_address}_${NFT.token_id}`);
													}}">
													<figure>
														<img
															width="100%"
															src="{NFT.metadata.image}"
															alt="{NFT.metadata.name}" />
														<figcaption>{NFT.metadata.name}</figcaption>
													</figure>
												</li>
											{/if}
										{/each}
									{/if}
									<!--
								<li
									on:click="{() => {
										goto('/nft/0x123');
									}}">
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
								<li>
									<figure>
										<img width="100%" src="/img/ico_eth.svg" alt="Ethereum" />
										<figcaption>Test Token</figcaption>
									</figure>
								</li>-->
									<li>
										<figure
											on:click="{() => {
												sModal.showModal({
													enable: 'true',
													title: 'Work in Progress',
													subHeader:
														'Didn`t have time to build a marketplace for this hackathon :( - maybe phase 2 ',
													buttons: [
														{
															text: 'Close',
															action: 'closeWindow',
														},
													],
												});
											}}">
											<img
												style="margin-top:10px;"
												width="74%"
												src="/img/ico_logo.svg"
												alt="Ethereum" />
											<figcaption class="browse">
												<button> Browse<br />NFT Marketplace</button>
											</figcaption>
										</figure>
									</li>
								</ul>
							{/if}
						{:else if tab === 'Links' && showLinksTabContent}
							<ul class="linkList">
								{#each Object.keys($sUser.links) as link}
									{#if $sUser.links[link].tpl === 'simple'}
										<li
											on:click="{() => {
												goto($sUser.links[link].url);
											}}">
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
											{#if $sUser.links[link].url.includes('youtube')}
												<img
													class="overlayIco"
													width="26"
													src="/img/ico_youtube.svg"
													alt="Youtube" />
											{/if}
											{#if $sUser.links[link].url.includes('twitter')}
												<img
													class="overlayIco"
													width="26"
													src="/img/ico_twitter.svg"
													alt="twitter" />
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
											WIP<br />
											{$sUser.links[link].title}
										</li>
									{/if}
								{/each}
								<!--
								<li>
									<img class="overlayIco" width="26" src="/img/ico_youtube.svg" alt="Youtube" />
									<dl>
										<dt class="mini">
											<img width="100" src="/tmp/example.png" alt="Youtube" />
										</dt>
										<dd>
											<div>
												My CryptoTube Channel<br />
												<p>The one and only amazing evilhag Crypto channel</p>
											</div>
										</dd>
									</dl>
								</li>
								<li>
									<dl>
										<dt class="mini">
											<img width="26" src="/img/ico_twitter.svg" alt="Twitter" />
										</dt>
										<dd>NFT Tweets (follow me)</dd>
									</dl>
								</li>
								<li>
									<dl>
										<dt class="mini">
											<img width="26" src="/img/ico_instagram.svg" alt="Instagram" />
										</dt>
										<dd>Checkout my NFT AR Gallery</dd>
									</dl>
								</li>
								<li>
									<dl>
										<dt class="mini">
											<img width="26" src="/img/ico_nft.svg" alt="Twitter" />
										</dt>
										<dd>The Imperial Collection</dd>
									</dl>
								</li>-->
							</ul>
						{/if}
					</div>
				</div>
			</article>
		</div>
	</section>
{/if}
