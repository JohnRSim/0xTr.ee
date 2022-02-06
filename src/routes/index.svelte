<script>
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

	let searchAddress;

	const { author, siteUrl } = website;

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
		playerURL: 'https://www.0xtr.ee/player/nft?contract=123&wallet=123',
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
		font-size: 0.8em;
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
	.web3InfoPanel,
	#deepLink {
		border-top: solid 8px #00c7b6;
		border-radius: 8px;
		padding: 16px 24px 24px 24px;
		margin: 20px;
		box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
			rgba(14, 30, 37, 0.12) 0px 2px 4px 0px;
	}
		#deepLink {
			display: flex;

		}

		#deepLink a {
			color: #0d1821;
			text-decoration: none;
			font-weight: bold;
			font-size: 1.1em;
		}
	.hr hr {
		display: none;
	}
	.hr {
		background: #f9fafc;
		border-radius: 50px;
		height: 9px;
		margin: 20px 0px;
		width:160px;
	}
	.mini {
		font-size:0.875em;
	}
	p {
		line-height:1.44;
	}
</style>

<SEO {...seoProps} />

<section style="transform: translate3d(0px, 60px, 0px);" id="XT-home" class="scrollable gpu_acc">
	<div style="flex:1;display:flex;flex-direction:column;">
		<article style="flex:1;" dir="auto">
			<img src="/img/r2w3.png" alt="Road to Web3" />
			<div style="padding:0px 20px;">
				<h2>
					EthGlobal Hackathon<br />
					<span>Bridging Web2 To Web3</span>
				</h2>
				<p>
					<b>Designed for mobile only current..</b><br />
					<span class="mini">Also deployed to moralis - https://lzf1jh5sx176.usemoralis.com/</span>
				</p>
				<div style="padding:0px 20px;">
					<Button
						{...basic}
						on:click="{() => {
							goto('/login');
						}}">Try Me...</Button>
				</div>
				<br />
				<div style="padding:0px 20px;">
					<Button
						{...basic}
						on:click="{() => {
							window.location.href = 'https://metamask.app.link/dapp/0xtr.ee';
						}}">...or Launch in Metamask Mobile</Button>
				</div>
				<h4>Introducing 0xTree</h4>
				<p>
				0xTree connects your social accounts to your NFT wallet enabling friends and collectors to browse, bid and buy your NFT’s without releasing custody.
				</p><p>
				You can crawl any wallet address using the domain 0xTr.ee and browse a gallery of all the NFT’s that a wallet holds. It’s live. You can pause the video and try it now with any Polygon wallet.
			</p><p>
				Owners can publish their 0xTree spaces to social media platforms to show off their collections and galleries can be claimed and customized via web3 login by the wallet owner.
			</p><p>
				Social sharing is taken to a new level with Twitter custom cards which bring NFT’s to life natively within the Twitter app. There is currently no better way to share your latest purchase.
			</p><p>
				Linktr.ee provided a simple solution for sharing all our social profiles in a single space. It has grown to become a staple of web2 technologies and receives 145 million visitors every month.
			</p><p>
				We want 0xTree to become the industry standard way to share and display NFT’s bridging web2.0 social platforms with emerging web3 technologies.
			</p>
				<h4>A New Way To Trade NFT’s</h4>
			<p>
				Imagine being able to place an offer for any NFT without the owner listing it on a 3rd party marketplace. A buyer can stake funds in a smart contract to place a bid on any NFT in any wallet. The owner will be notified when browsing their own wallet address that there is an offer pending which they can accept, reject or ignore.
			</p><p>
				Opensea is currently the largest NFT marketplace with over 500,000 users and $4B in monthly trading volume*. Our product differentiates itself by flipping the initiative from the seller to the buyer.
			</p><p>
				Trading fees are lower too, 90% lower in fact, incentivising NFT traders to use a truly decentralized product that doesn’t need to charge 2.5% on every trade.
			</p>

				<h4>TREE Tokenomics</h4>
			<p>
				Fee revenues go straight from the smart contract into a Uniswap liquidity pool increasing liquidity for the TREE governance token and providing incentives for stakeholder to participate.
			</p><p>
				If 0xTree can gain traction to become key infrastructure in the NFT space then governance of that protocol will become very valuable, as will the liquidity from fees.
			</p><p>
				0xTree and the TREE token will go live with a truly fair launch tokenomic program. No pre-mines, no team allocation, no vested investor tokens. The project will incentivise early growth through the distribution of its governance token based on trading volumes. This will provide the necessary traction needed to get sellers to regularly check their 0xTree wallets for bids.
			</p><p>
				By distributing the token to users we further empower a community of NFT traders to go out and promote the project to new participants.
			</p>
				<h4>TreeDAO Community Governance</h4>
			<p>
				Tree token holders are the stakeholders and governors of the protocol. The tree token has native functions built in for voting and delegating votes.
			</p><p>
				Proposals could include future developments of the platform. We were limited by the timeframe for the hackathon but future development opportunities could include:-
			</p><p>
				Wallet to Wallet on-chain messaging, direct communication between buyers & sellers
			</p><p>
				Multi-chain expansions to new blockchain ecosystems
			</p><p>
				Integration of social tokens, gaming tokens and other emerging digital assets
			</p><p>
				Staking pools for the TREE token and TREE-MATIC LP tokens
			</p><p>
				Funded governance proposals rewarding developers and attracting talent
			</p><p>
				Cross-chain bridging systems to move & trade non-fungible assets between chains
			</p><p>
				The prioritization of these opportunities will be at the discretion of the community.
			</p>
			</div>
			<div class="hr"><hr /></div>
			<br />
			<div>
				<dl id="deepLink">
					<dt><img width="20" src="/img/ico_metamask.svg" alt="metamask" /></dt>
					<dd><a target="_blank" id="deepLinkURL" href="https://metamask.app.link/dapp/0xtr.ee">
						Launch with Metamask Mobile</a>
					</dd>
				</dl>
			</div>
			<br />
			<form on:submit|preventDefault>
				<div class="priceField">
					<label for="priceField">
						<div style="align-items:center;">
							<img width="26" src="/img/ico_search.svg" alt="Search by wallet id" />
						</div>
						<div class="crypto">Search</div>
					</label>
					<input
						on:keyup="{(e) => {
							if (e.key === 'Enter') {
								goto(`/${searchAddress}`);
							}
						}}"
						id="priceField"
						bind:value="{searchAddress}"
						type="text"
						placeholder="Enter Wallet ID" />
				</div>
			</form>
			<br />
			<div style="padding:0px 20px;">
				<Button
					{...basic}
					on:click="{() => {
						goto('/0x123e710c69b6806ef32Cf52e49dCC5EEEc368a22');
					}}">Lookup Tree Address</Button>
			</div>
			<br />
		</article>
	</div>
</section>
