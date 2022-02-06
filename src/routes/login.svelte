<script>
	import { onMount } from 'svelte';

	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';

	//card imgs
	import ogSquareImageSrc from '$lib/assets/home/home-open-graph-square.jpg';
	import ogImageSrc from '$lib/assets/home/home-open-graph.jpg';
	import twitterImageSrc from '$lib/assets/home/home-twitter.jpg';
	import featuredImageSrc from '$lib/assets/home/home.jpg';

	//img
	import SEO from '$lib/components/SEO/index.svelte';

	//components
	import Button from '$lib/components/Button.svelte';

	//conf
	import website from '$lib/config/website';
	import { basic } from '$lib/components/conf/Buttons.js';

	//stores
	import { user as sUser } from '../stores/user';

	/* Authentication code */
	async function login() {
		let user = Moralis.User.current();
		if (!user) {
			user = await Moralis.authenticate({ signingMessage: 'Log in using Moralis' })
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
		} else {
			sUser.updateVal('userInfo', user);
			sUser.updateVal('ethAddress', user.attributes.ethAddress);
			goto(`/${user.attributes.ethAddress}`);
		}
	}

	let web3AuthInstance = null;
	onMount(async() => {
		const polygonMumbaiConfig = {
			chainNamespace: "eip155",
			rpcTarget: "https://rpc-mumbai.maticvigil.com",
			blockExplorer: "https://mumbai-explorer.matic.today",
			chainId: "0x13881",
			displayName: "Polygon Mumbai Testnet",
			ticker: "matic",
			tickerName: "matic",
		};
		const web3authSdk = window.Web3auth;

		web3AuthInstance = new web3authSdk.Web3Auth({
			chainConfig: polygonMumbaiConfig,
			clientId: "BMY_C-OsMtW4rJTqqpsygsbOxcpUMQ1jsGQXtXMN2CP4coUsZctqVBOTVw3QAbKCguFxqyxU15vRU7VsA-frDVI" // get your clientId from https://developer.web3auth.io
		});
		//subscribeAuthEvents(web3AuthInstance);
		await web3AuthInstance.initModal();
	});

	/**
	 * web3Auth Jim do you stuff here :)
	 */
	async function jimsMagic() {
		console.log('....jimsMagic')
		const provider = await web3AuthInstance.connect()
		console.log('...huh',provider );
		
        const user = await web3AuthInstance.getUserInfo();
		console.log(user);
		const web3 = new Web3(web3AuthInstance.provider);
      	const address = (await web3.eth.getAccounts())[0];
      	//const balance = await web3.eth.getBalance(address);
		  
		
		sUser.updateVal('userInfo', user);
		sUser.updateVal('ethAddress', address);
		goto(`/${address}`);
		//this updates the user profile eth address
		//window.open("https://metamask.io"); 
		/*
		let newProfileAddress = '0x........';
		sUser.updateVal('ethAddress', newProfileAddress);
		//this redirects to the new user profile page
		goto(`/${newProfileAddresss}`);
		*/
	}

	const { author, siteUrl } = website;
	basic.width = '400px';
	let title = 'Home';
	const breadcrumbs = [
		{
			name: 'Home',
			slug: '',
		},
	];

	let metadescription = '';
	const featuredImageAlt = '';
	const featuredImage = {
		url: featuredImageSrc,
		alt: featuredImageAlt,
		width: 672,
		height: 448,
		caption: 'Home page',
	};
	const ogImage = {
		url: ogImageSrc,
		alt: featuredImageAlt,
	};
	const ogSquareImage = {
		url: ogSquareImageSrc,
		alt: featuredImageAlt,
	};

	const twitterImage = {
		url: twitterImageSrc,
		alt: featuredImageAlt,
	};
	const entityMeta = {
		url: `${siteUrl}/`,
		faviconWidth: 512,
		faviconHeight: 512,
		caption: author,
	};
	const seoProps = {
		title,
		slug: '',
		entityMeta,
		datePublished: '2022-01-04T14:19:33.000+0100',
		lastUpdated: '2022-01-04T14:19:33.000+0100',
		breadcrumbs,
		metadescription,
		featuredImage,
		ogImage,
		ogSquareImage,
		twitterImage,
	};
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
	}

	article {
		display: flex;
		justify-content: start;
		flex-direction: column;
		margin: 0px;
		text-align: center;
		align-items: center;
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
	header {
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 140px;
		position: relative;
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
	#XT-connect {
		position: relative;
	}
	#XT-connect img {
		position: absolute;
		width: 50px;
		height: 50px;
		left: 50%;
		z-index: 10;
		margin-left: -25px;
		top: -25px;
	}
	#XT-create {
		position: relative;
	}
	#XT-create img {
		position: absolute;
		width: 100px;
		height: 50px;
		left: 50%;
		z-index: 10;
		margin-left: -50px;
		top: -25px;
	}
	h2 {
		color: #1a1c1a;
		margin: 20px 10px 5px;
	}
	p {
		display: block;
		line-height: 1.44em;
		margin-bottom: 30px;
	}
</style>

<SEO {...seoProps} />

<section style="transform: translate3d(0px, 0px, 0px);" id="XT-login" class="scrollable gpu_acc">
	<div style="flex:1;display:flex;flex-direction:column;">
		<article style="flex:1;" dir="auto">
			<header>
				<img width="180" height="78" src="/logo_group.svg" alt="0xtr.ee" />
			</header>
			<div style="padding:0px 20px; width:100%;">
				<h2>An NFT Portal</h2>
				<p>Deigned to show &amp; manage<br />your assets to the world</p>

				<div id="XT-connect">
					<img src="/img/ico_metamask.svg" alt="" />
					<Button
						{...basic}
						on:click="{() => {
							//goto('/0x');
							login();
						}}">Connect your wallet</Button>
				</div>

				<div class="hr" style="margin-bottom:30px"><hr /></div>

				<div id="XT-create">
					<img src="/img/ico_socialcons.svg" alt="" />
					<Button {...basic} on:click="{jimsMagic}">Create wallet</Button>
				</div>

				<footer>
					By logging in... you accept the<br />
					<a href="/#">Terms of Service</a> and consent to the<br />
					<a href="/#">Privacy Policy</a> of <b>0xTr.ee</b>
				</footer>
			</div>
		</article>
	</div>
</section>
