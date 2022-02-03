<script>
	import { page } from '$app/stores';
	import { browser } from '$app/env';
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';

	// svelte
	import { onMount, onDestroy, tick } from 'svelte';

	// Source Sans Pro - supported variants:
	// weights: [200, 300, 400, 600, 700, 900]
	// styles: italic, normal
	import '@fontsource/source-sans-pro/400.css';
	import '@fontsource/source-sans-pro/400-italic.css';

	//normalise styles
	import '$lib/styles/normalise.css';
	import '$lib/styles/index.scss';

	//tpl
	import PWA from '$lib/components/PWA.svelte';
	import ModalWindow from '$lib/components/ModalWindow.svelte';
	import SiteWrapper from '$lib/template/SiteWrapper.svelte';
	import MainContentWrapper from '$lib/template/MainContentWrapper.svelte';
	import SiteLayoutWrapper from '$lib/template/SiteLayoutWrapper.svelte';

	//stores
	import { app as sApp } from '../stores/app.js';
	import { modal as sModal } from '../stores/modal.js';
	import { route as sRoute } from '../stores/routes.js';
	import { history as sHistory } from '../stores/history.js';
	import { user as sUser } from '../stores/user';

	//console styles
	const Inf = 'background-color: #f8ffff; color: #276f86';

	//defaults
	let isMounted = false;

	//nav
	let currentX;
	let currentY;
	let scrollHorizontal = false;
	let scrollVertical = false;
	let startX = 0;
	let startY = 0;
	let endX = 0;
	let endY = 0;
	let screenWidth;
	let initDirectionSet = false;
	let startOpacity = 0;
	let direction;
	let menuPos = 0;
	let finalDirection;

	//timers
	let scrollTimer;

	//route
	let routeConf = $sRoute.global;
	let routeCheck = {};
	let activeTab;
	let activeFooterLink = 'Home';

	//LTR-RTL UI calc
	let langDirection = 'ltr';

	//bound to page
	let scrollTarget;
	let scrollBody;

	//page header display
	let headerPageTitle = false;
	let detectUserScrollTimer;
	let initVerticalDirectionSet = false;
	let priorScrollPos = 0;
	let originalScrollPos = 0;

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

	//subscribe to page changes to update global page vars
	page.subscribe(async (value) => {
		if (browser) {
			console.info('%c[Layout][Page Changed]', value, Inf);

			//remove active scrollTarget to new item
			if (scrollTarget && typeof scrollTarget !== 'string') {
				scrollTarget.removeEventListener('scroll', verticalScroll);
				scrollTarget = null;
			}

			//reset header display
			if ($sHistory.active.headerDisplay !== '') {
				document.body.classList.add('stopHeaderAnim');
				document.body.classList.remove('scroll-down');
				document.body.classList.remove('scroll-up');
				document.body.classList.add($sHistory.active.headerDisplay);
			}

			//reset val
			sUser.updateVal('disablePanelScroll', false);

			//get url params and define tabs
			const urlParams = new URLSearchParams(window.location.search);
			activeTab = urlParams.get('tab');

			//split path in consumable arr
			const pathArr = value.url.pathname.split('/');

			//set activeFooter link
			activeFooterLink = pathArr[2];

			//generic globals to reset on route change
			headerPageTitle = false;

			//setup global defaults
			routeConf = $sRoute.global;

			//update globals based off define route vars
			let updateCheck = value.url.pathname;
			routeCheck = $sRoute.path[`${updateCheck}`];

			//if route not found check dynamic routes
			if (typeof routeCheck === 'undefined') {
				const route = pathArr.slice(0);
				sRoute.updateVal('activeID', route[route.length - 1]);
				route.pop();

				updateCheck = `${route.join('/')}/*`;
				routeCheck = $sRoute.path[updateCheck];
				//reset
			} else {
				sRoute.updateVal('activeID', null);
				sRoute.updateVal('coreContentType', null);
			}

			//path found update routeConf
			if (typeof routeCheck !== 'undefined') {
				sRoute.updateVal('activeroute', updateCheck);

				routeConf = {
					...routeConf,
					...routeCheck,
				};

				//check if tabs are defined
				if (routeConf.hasTabs) {
					const currentPath = `${window.location.pathname}${window.location.search}`;
					let tabPos = 0;

					//set active tab
					routeConf.hasTabs.forEach((tab, i) => {
						if (tab.path === currentPath) {
							tabPos = i;
						}
					});

					//if mobile use mobile scroller
					if (uiType === 'Mobile') {
						if (routeConf.hasTabs[tabPos].scrollTarget) {
							routeConf.scrollTarget = routeConf.hasTabs[tabPos].scrollTarget;
						}
					}
				}

				//
				sApp.updateScrollTarget(routeConf.scrollTarget);

				//update active tab if available
				if (typeof activeTab !== 'string' && typeof routeConf.hasTabs !== 'undefined') {
					if (routeConf.hasTabs.length > 0) {
						activeTab = routeConf.hasTabs[0].name;
					}
				}
			}

			console.log('[Active Page Conf]', routeConf);

			//wait for DOM
			await tick();

			console.log(
				'[scroll]',
				scrollTarget,
				routeConf.scrollTarget,
				document.querySelector(routeConf.scrollTarget),
			);
			if (!scrollTarget) {
				console.log('setting obj');
				scrollTarget = document.querySelector(routeConf.scrollTarget);
			}
			scrollBody = document.querySelector(routeConf.scrollBody);

			if (scrollTarget) {
				console.log('add eve');
				scrollTarget.addEventListener('scroll', verticalScroll);
			}
		}
	});

	/**
	 * closeWindow
	 */
	function closeWindow() {
		showModal = 'false';
		//showSocialModal = 'false';
	}

	/**
	 * verticalScroll
	 **/
	function verticalScroll(e) {
		if (scrollHorizontal) {
			return;
		}

		//helps to improve performance and disable animated transitions during scroll.
		clearTimeout(detectUserScrollTimer);

		if (routeConf.displayNav) {
			clearTimeout(scrollTimer);
			let activeHeader = document.querySelector('header.trigger-menu-wrapperx');
			//console.log(initVerticalDirectionSet);
			//has initialdirection been set if not get direction
			if (!initVerticalDirectionSet) {
				//console.log(priorScrollPos);
				//console.log('init',Math.round(scrollable.scrollTop));
				priorScrollPos = Math.round(scrollTarget.scrollTop);
				originalScrollPos = Math.round(scrollTarget.scrollTop);
				const headerTransformStyle = activeHeader.style.transform.split(/\w+\(|\);?/);
				if (headerTransformStyle[1]) {
					const transformStyle = headerTransformStyle[1]
						.split(/,\s?/g)
						.map((numStr) => parseInt(numStr));
					newNavBarHeight = transformStyle[1];
					navYPos = transformStyle[1];
				}
				if (document.body.classList.contains('endScroll')) {
					if (document.body.classList.contains('scroll-up')) {
						//console.log('scrollup start');
						newNavBarHeight = 0;
						navYPos = 0;
					}
					if (document.body.classList.contains('scroll-down')) {
						//console.log('scrolldown start');
						newNavBarHeight = navBarHeight;
						navYPos = -navBarHeight;
					}
				}
				//reset height dif
				heightDif = navYPos;
				initVerticalDirectionSet = true;
				scrollVertical = true;

				//remove end scroll settings during scroll
				document.body.classList.remove('scroll-down');
				document.body.classList.remove('scroll-up');
				document.body.classList.remove('endScroll');

				if (Math.round(scrollTarget.scrollTop) === 0) {
					document.body.classList.remove('shadow');
				} else {
					document.body.classList.add('shadow');
				}
			}

			if (scrollVertical) {
				let currentScrollPost = Math.round(scrollTarget.scrollTop);
				//console.log(currentScrollPost - priorScrollPos);
				if (currentScrollPost - priorScrollPos > 0) {
					//console.log('down',scrollDirection);
					//change direction
					if (scrollDirection === 'up') {
						scrollDirection = 'down';
						originalScrollPos = Math.round(scrollTarget.scrollTop);
						newNavBarHeight = navYPos;
					}
					let calc = originalScrollPos - currentScrollPost;
					if (navYPos === -navBarHeight) {
						heightDif = -navBarHeight;
					} else {
						heightDif =
							calc + newNavBarHeight <= -navBarHeight ? -navBarHeight : calc + newNavBarHeight;
					}
				} else if (currentScrollPost - priorScrollPos < 0) {
					//console.log('up',scrollDirection);
					//change direction
					if (scrollDirection === 'down') {
						scrollDirection = 'up';
						originalScrollPos = Math.round(scrollTarget.scrollTop);
						newNavBarHeight = navYPos;
					}

					let calc = originalScrollPos - currentScrollPost;
					heightDif = calc + newNavBarHeight >= 0 ? 0 : calc + newNavBarHeight;
				}

				//calculate offset
				navYPos = heightDif;

				//update offset header
				activeHeader.style.transform = `translate3d(0, ${navYPos}px, 0)`;
				if (routeConf.inlineHeaderNav) {
					//contentYPos = navYPos + navBarHeight;
					contentYPos =
						headerSpace_normal - currentScrollPost <= 0
							? 0
							: headerSpace_normal - currentScrollPost;
				}
				if (routeConf.inlineDoubleHeaderNav) {
					if (scrollDirection === 'up') {
						contentYPos =
							headerSpace_medium - currentScrollPost <= headerSpace_small
								? headerSpace_small
								: headerSpace_medium - currentScrollPost;
					}

					if (scrollDirection === 'down') {
						contentYPos =
							headerSpace_medium - currentScrollPost <= headerSpace_small
								? headerSpace_small
								: headerSpace_medium - currentScrollPost;
					}
				}
				if (routeConf.inlineDoubleHeaderLargeNav) {
					if (scrollDirection === 'up') {
						contentYPos =
							headerSpace_large - currentScrollPost <= headerSpace_normal
								? headerSpace_normal
								: headerSpace_large - currentScrollPost;
					}

					if (scrollDirection === 'down') {
						contentYPos =
							headerSpace_large - currentScrollPost <= headerSpace_normal
								? headerSpace_normal
								: headerSpace_large - currentScrollPost;
					}
				}
				if (routeConf.headerNavTransparent && !routeConf.inlineHeaderNav) {
					contentYPos = 0;
				}

				scrollBody.style.transform = `translate3d(0, ${contentYPos}px, 0)`;

				//grab prior scroll to calculate direction
				priorScrollPos = Math.round(scrollTarget.scrollTop);

				//user actively scrolling
				document.body.classList.add('userScroll');

				scrollTimer = setTimeout(() => {
					if (currentScrollPost === 0) {
						document.body.classList.remove('shadow');
					} else {
						document.body.classList.add('shadow');
					}

					document.body.classList.remove('userScroll');
					document.body.classList.add('endScroll');
					if (scrollTarget && scrollTarget.scrollTop < navBarHeight) {
						//user finished scrolling
						document.body.classList.add('scroll-up');
						navYPos = 0;
						newNavBarHeight = 0;
						activeHeader.style.transform = `translate3d(0, ${navYPos}px, 0)`;
						//scrollTarget.style.transform = `translate3d(0, ${contentYPos}px, 0)`;
					} else {
						//finish sroll position update
						if (scrollDirection === 'up') {
							document.body.classList.add('scroll-up');
							navYPos = 0;
							newNavBarHeight = 0;
							activeHeader.style.transform = `translate3d(0, ${navYPos}px, 0)`;
							//scrollTarget.style.transform = `translate3d(0, ${contentYPos}px, 0)`;
						} else {
							document.body.classList.add('scroll-down');
							navYPos = -navBarHeight;
							newNavBarHeight = -navBarHeight;
							activeHeader.style.transform = `translate3d(0, ${navYPos}px, 0)`;
							//scrollTarget.style.transform = `translate3d(0, ${contentYPos}px, 0)`;
						}
					}
					//reset scroll
					initVerticalDirectionSet = false;
				}, 600);
			}
		}
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

<!-- Site Wrapper -->
<SiteWrapper
	internalTheme="{routeConf.internalTheme}"
	activePageLayout=""
	langDirection="{langDirection}">
	<!-- Site -->
	<SiteLayoutWrapper>
		<!-- Page Content -->
		<MainContentWrapper>
			<slot />
		</MainContentWrapper>
		<!-- xPage Content -->
	</SiteLayoutWrapper>
	<!-- xSite -->
</SiteWrapper>
