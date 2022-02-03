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
	}
</style>

<SEO {...seoProps} />

<section style="transform: translate3d(0px, 60px, 0px);" id="XT-home" class="scrollable gpu_acc">
	<div style="flex:1;display:flex;flex-direction:column;">
		<article style="flex:1;" dir="auto">
			<img src="/img/r2w3.png" alt="Road to Web3" />
			<div style="padding:0px 20px;">
				<h2>
					EthGlobal Hackathon Entry <br />
					<span>Road to Web3</span>
				</h2>
				<p>
					This entry is based off the <a target="_blank" href="https://www.linktr.ee">linktr.ee</a> web2
					application and our attempt to show a dApp taking latest web3 concepts with wallets to provide
					a NFT gateway to allow users to show off and sell and their NFTs in a social environment -
					whilst getting stats on the audience accessing their assets.
				</p>
			</div>
			<div>
				<Button
					{...basic}
					on:click="{() => {
						goto('/login');
					}}">Try Me...</Button>
			</div>
		</article>
	</div>
</section>
