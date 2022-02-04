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
	//import Footer from '$lib/components/Footer.svelte';
	//import Header from '$lib/components/Header.svelte';
	import PWA from '$lib/components/PWA.svelte';
	import SiteWrapper from '$lib/template/SiteWrapper.svelte';
	import MainContentWrapper from '$lib/template/MainContentWrapper.svelte';
	import SiteLayoutWrapper from '$lib/template/SiteLayoutWrapper.svelte';
	import StickyHeader from '$lib/template/StickyHeader.svelte';
	import HeaderNav from '$lib/template/HeaderNav.svelte';
	import SideOverlayPanel from '$lib/template/SideOverlayPanel.svelte';
	import PanelMaskBlur from '$lib/template/PanelMaskBlur.svelte';
	import SideDrawerMenu from '$lib/template/SideDrawerMenu.svelte';
	import ModalWindow from '$lib/components/ModalWindow.svelte';
	import AddSocialLinks from '$lib/components/AddSocialLinks.svelte';

	//stores
	import { app as sApp } from '../stores/app.js';
	import { user as sUser } from '../stores/user';
	import { route as sRoute } from '../stores/routes.js';
	import { history as sHistory } from '../stores/history.js';
	import { modal as sModal } from '../stores/modal.js';
	import { socialModal as sSocialModal } from '../stores/socialModal.js';

	//console styles
	const Inf = 'background-color: #f8ffff; color: #276f86';

	//defaults
	let blur = false;
	let isMounted = false;
	let enableInset = false;
	let enableOutset = false;
	let opacityVal = 0;
	let activeFooterLink = 'Home';
	let enableAutoTransitions = true;
	let showNavMask = false;

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

	//bound to page
	let scrollTarget;
	let scrollBody;

	//route
	let routeConf = $sRoute.global;
	let routeCheck = {};
	let activeTab;

	//scroll
	let scrollChangeDirPos = 0;

	//timers
	let scrollTimer;
	let windowResizeTimer = null;
	let blurTimer;
	let maskTimer;

	//page header display
	let priorScrollPos = 0;
	let originalScrollPos = 0;
	let navYPos = 0;
	let heightDif = 0;
	let headerPageTitle = false;
	let initiativeTitle = false;
	let initiativeID = false;
	let headerImgURL = false;
	let detectUserScrollTimer;
	let initVerticalDirectionSet = false;
	let contentYPos = 0;
	let scrollDirection = 'down';
	let newNavBarHeight = 0;

	//LTR-RTL UI calc
	let langDirection = 'ltr';
	let activeLayout = 'home';
	let drawerMenuPos = langDirection === 'ltr' ? '-100%' : '100%';
	let sideOverlayPos = langDirection === 'ltr' ? '100%' : '-100%';

	//navbar height defaults;
	let headerSpace_small = 38;
	let headerSpace_normal = 60;
	let navBarHeight = 60;
	let headerSpace_medium = 98;
	let headerSpace_large = 120;

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

	//link tpl
	let activeLinkTpl = '';
	//used for modal window input text fields
	let keyboardShown = false;

	//social links
	let socialTwitterLink = $sUser.profile.socialLinks.twitter;
	let socialYouTubeLink = $sUser.profile.socialLinks.youTube;
	let socialInstagramLink = $sUser.profile.socialLinks.instagram;

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
	$: if ($sSocialModal && isMounted) {
		setTimeout(() => {
			showSocialModal = $sSocialModal.enable;
			socialModalHeader = $sSocialModal.title;
			socialModalTpl = $sSocialModal.tpl;
			socialModalButtons = $sSocialModal.buttons;
		}, 50);
	}

	const serverUrl = 'https://lzf1jh5sx176.usemoralis.com:2053/server';
	const appId = 'XmxLvKVKIGQZexV2bcx8583lGNlnpY5ksXjiQkM2';

	/**
	 * onMount
	 * initial page setup
	 **/
	onMount(async () => {
		console.info('%c[Layout][Mount]', Inf);

		//page ready show DOM
		isMounted = true;

		//connect to moralis
		Moralis.start({ serverUrl, appId });

		//calc uiType
		windowResize({
			target: {
				innerWidth: window.innerWidth,
			},
			init: true,
		});

		//set body width for dynamic css calculations
		const bodyWidth = document.body.offsetWidth;
		document.documentElement.style.setProperty('--site-width', `${bodyWidth}px`);
	});

	//subscribe to page changes to update global page vars
	page.subscribe(async (value) => {
		if (browser) {
			console.info('%c[Layout][Page Changed]', value, Inf);

			//remove active scrollTarget to new item
			if (scrollTarget && typeof scrollTarget !== 'string') {
				scrollTarget.scrollTo(0, 0);
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

			//tmp to review
			//document.body.classList.remove('scroll-down');
			//document.body.classList.remove('scroll-up');
			//document.body.classList.remove('endScroll');
			//document.body.classList.remove('shadow');

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
			initiativeTitle = false;
			initiativeID = false;
			headerImgURL = false;

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
				scrollTarget.scrollTo(0, 0);
			}
			setTimeout(() => {
				document.body.classList.remove('shadow');
				document.body.classList.remove('scroll-down');
				document.body.classList.add('scroll-up');
			}, 100);
		}
	});

	/**
	 * windowResize
	 * Triggered on page load and window resize
	 **/
	function windowResize(e) {
		clearTimeout(windowResizeTimer);
		windowResizeTimer = setTimeout(() => {
			calcCSSGlobalVars();
			opacityVal = 0;
		}, 500);
	}

	/**
	 * calcCSSGlobalVars
	 **/
	function calcCSSGlobalVars() {
		const bodyWidth = document.body.offsetWidth;
		const feedTileMargin = 20;
		const feedTileWidth = bodyWidth - feedTileMargin * 2;
		const feedTileRatio = '16x9';
		const feedTileAnimScale = bodyWidth / feedTileWidth;
		const feedTileHeight = (feedTileWidth / 16) * 9;
		const feedTileOffsetHeight = (feedTileHeight * feedTileAnimScale - feedTileHeight) / 2;

		console.log('bodyWidth', bodyWidth);
		console.log('feedTileMargin', feedTileMargin);
		console.log('feedTileWidth', feedTileWidth);
		console.log('feedTileRatiofeedTileRatio', feedTileRatio);
		console.log('feedTileAnimScale', feedTileAnimScale);
		console.log('feedTileHeight', feedTileHeight);
		console.log('feedTileOffsetHeight', feedTileOffsetHeight);

		document.documentElement.style.setProperty('--site-width', `${bodyWidth}px`);
		document.documentElement.style.setProperty('--feed-tile-margin', `${feedTileMargin}px`);
		document.documentElement.style.setProperty('--feed-tile-width', `${feedTileWidth}px`);
		document.documentElement.style.setProperty('--feed-tile-scale', `${feedTileAnimScale}`);
		document.documentElement.style.setProperty(
			'--feed-tile-anim-offsetHeight',
			`${feedTileOffsetHeight}px`,
		);
	}

	/**
	 * scrollStart
	 **/
	function scrollStart(e) {
		console.log('[scrollStart]');
		if ($sUser.disablePanelScroll || e.targetTouches.length >= 2 || e.changedTouches.length >= 2) {
			resetToContentView();
			return;
		}
		blur = false;
		startX = Math.round(e.touches[0].clientX);
		endX = Math.round(e.touches[0].clientX);
		startY = Math.round(e.touches[0].clientY);
		screenWidth = window.innerWidth;
		startOpacity = opacityVal;

		// is not near edge of view, exit
		if (e.pageX > 10 && e.pageX < window.innerWidth - 10) return;
		// prevent swipe to navigate back gesture
		//e.preventDefault();
	}

	/**
	 * resetToContentView
	 **/
	function resetToContentView(update) {
		//updateDisplay('home');
		const updateView = update || activeLayout;
		if (activeLayout !== updateView) {
			updateDisplay(updateView);
		}
	}

	/**
	 * checkDirection
	 **/
	function checkScrollDirection(e) {
		//if anonymous or disabled touch or touches more than 1 finger press disable.
		if ($sUser.disablePanelScroll || e.targetTouches.length >= 2 || e.changedTouches.length >= 2) {
			resetToContentView();
			return;
		}
		//get current touch position
		currentX = Math.round(e.touches[0].clientX);
		currentY = Math.round(e.touches[0].clientY);

		//has initialdirection been set if not get direction
		if (!initDirectionSet) {
			console.log('[checkScrollDirection]');

			scrollHorizontal = false;
			scrollVertical = false;

			if ($sApp.lockScroll) {
				sApp.updateVal('lockScroll', false);
			}
			if ($sApp.disablePullToRefresh) {
				sApp.updateVal('disablePullToRefresh', false);
			}
			//console.log(currentY,startY)
			if (currentY < startY - 5 || currentY > startY + 5) {
				if (currentY > startY || currentY < startY) {
					initDirectionSet = true;
					scrollVertical = true;
					endY = currentY;
					scrollChangeDirPos = startY;
				}
			} else {
				if (currentX < startX) {
					// Left
					//console.log('left');

					scrollHorizontal = true;
					initDirectionSet = true;
					direction = 'left';
				} else if (currentX > startX) {
					// Right
					//console.log('right');
					scrollHorizontal = true;
					initDirectionSet = true;
					direction = 'right';
				}
			}
		}

		//header scroll logic
		if (scrollVertical) {
		}

		//enable side panel swipe logic
		if (scrollHorizontal) {
			enableAutoTransitions = false;
			clearTimeout(maskTimer);
			showNavMask = true;

			let maxOpacity = 0.75;
			let calcDistance = Math.round((100 / screenWidth) * (currentX - startX)) / 100;
			let calcOpacity = startOpacity + calcDistance;
			let contentAlignment = Math.round((100 / screenWidth) * (currentX - startX));

			menuPos = currentX - startX < -screenWidth ? -screenWidth : currentX - startX;

			//show chat
			if (direction === 'left' && activeLayout === 'home') {
				//
				opacityVal = -calcOpacity > maxOpacity ? maxOpacity : -calcOpacity;

				if (langDirection === 'ltr') {
					sideOverlayPos = `calc(100% + ${menuPos}px)`;
				} else {
					drawerMenuPos = `calc(100% + ${menuPos}px)`;
				}
				if (!$sApp.lockScroll) {
					sApp.updateVal('lockScroll', true);
				}
				if (!$sApp.disablePullToRefresh) {
					sApp.updateVal('disablePullToRefresh', true);
				}
			}

			//show nav drawer
			else if (direction === 'right' && activeLayout === 'home') {
				//
				opacityVal = calcOpacity > maxOpacity ? maxOpacity : calcOpacity;

				if (langDirection === 'ltr') {
					menuPos = menuPos < screenWidth ? menuPos : screenWidth;
					drawerMenuPos = `calc(-100% + ${menuPos}px)`;
				} else {
					sideOverlayPos = `calc(-100% + ${menuPos}px)`;
				}
				if (!$sApp.lockScroll) {
					sApp.updateVal('lockScroll', true);
				}
				if (!$sApp.disablePullToRefresh) {
					sApp.updateVal('disablePullToRefresh', true);
				}
			}

			//hide chat
			else if (direction === 'right' && activeLayout === 'chat') {
				if (langDirection === 'ltr') {
					menuPos = menuPos < 0 ? 0 : menuPos;
					sideOverlayPos = `calc(0% + ${menuPos}px)`;
				} else {
					//sideOverlayPos = `calc(0% + ${menuPos}px)`;
				}

				if ($sApp.lockScroll) {
					sApp.updateVal('lockScroll', false);
				}
				if ($sApp.disablePullToRefresh) {
					sApp.updateVal('disablePullToRefresh', false);
				}
			}

			//hide chat
			else if (direction === 'left' && activeLayout === 'chat') {
				if (langDirection === 'ltr') {
					//sideOverlayPos = `calc(0% + ${menuPos}px)`;
				} else {
					//menuPos = (menuPos > 0)?0:menuPos;
					sideOverlayPos = `calc(0% + ${menuPos}px)`;
				}

				if ($sApp.lockScroll) {
					sApp.updateVal('lockScroll', false);
				}
				if ($sApp.disablePullToRefresh) {
					sApp.updateVal('disablePullToRefresh', false);
				}
			}

			//hide nav
			else if (direction === 'right' && activeLayout === 'nav') {
				calcOpacity = startOpacity - calcDistance;
				//console.log(calcOpacity,maxOpacity)
				//
				opacityVal = calcOpacity > maxOpacity ? maxOpacity : calcOpacity;

				if (langDirection === 'ltr') {
					opacityVal = maxOpacity;
					//drawerMenuPos = `calc(0% + ${menuPos}px)`;
				} else {
					menuPos = menuPos < 0 ? 0 : menuPos;
					drawerMenuPos = `calc(0% + ${menuPos}px)`;
				}
				if ($sApp.lockScroll) {
					sApp.updateVal('lockScroll', false);
				}
				if ($sApp.disablePullToRefresh) {
					sApp.updateVal('disablePullToRefresh', false);
				}
			}

			//hide nav
			if (direction === 'left' && activeLayout === 'nav') {
				//
				opacityVal = calcOpacity > maxOpacity ? maxOpacity : calcOpacity;

				if (langDirection === 'ltr') {
					menuPos = menuPos > 0 ? 0 : menuPos;
					drawerMenuPos = `calc(0% + ${menuPos}px)`;
				} else {
					opacityVal = maxOpacity;
					//drawerMenuPos = `calc(0% + ${menuPos}px)`;
				}
				if ($sApp.lockScroll) {
					sApp.updateVal('lockScroll', false);
				}
				if ($sApp.disablePullToRefresh) {
					sApp.updateVal('disablePullToRefresh', false);
				}
			}

			//calc final finger dir
			if (endX < currentX) {
				finalDirection = 'right';
			} else {
				finalDirection = 'left';
			}

			//store end pos for next pos to calculate final direction
			endX = currentX;
		}
	}

	/**
	 * scrollEnd
	 **/
	function scrollEnd(e) {
		console.log('[scrollEnd]');
		if ($sUser.disablePanelScroll || e.targetTouches.length >= 2 || e.changedTouches.length >= 2) {
			resetToContentView();
			return;
		}

		if (scrollHorizontal) {
			//console.log(direction,finalDirection,activeLayout)
			//on home return to home display
			if (direction === 'left' && finalDirection === 'right' && activeLayout === 'home') {
				updateDisplay('home');
			}

			//on home show sidebar
			else if (direction === 'left' && finalDirection === 'left' && activeLayout === 'home') {
				//show chat
				if (langDirection === 'ltr') {
					updateDisplay('chat');
					//show nav
				} else {
					updateDisplay('nav');
				}
			}

			//on home show sidebar
			else if (direction === 'right' && finalDirection === 'right' && activeLayout === 'home') {
				//show nav
				if (langDirection === 'ltr') {
					updateDisplay('nav');
					//show chat
				} else {
					updateDisplay('chat');
				}
			}

			//on home return to home display
			else if (direction === 'right' && finalDirection === 'left' && activeLayout === 'home') {
				updateDisplay('home');
			}

			//on chat
			else if (direction === 'right' && finalDirection === 'right' && activeLayout === 'chat') {
				//return to home
				if (langDirection === 'ltr') {
					updateDisplay('home');
					//stay on chat
				} else {
					sideOverlayPos = '0%';
				}
			}

			//on chat
			else if (direction === 'left' && finalDirection === 'left' && activeLayout === 'chat') {
				//stay on chat
				if (langDirection === 'ltr') {
					sideOverlayPos = '0%';
					//return to home
				} else {
					updateDisplay('home');
				}
			}

			//on chat
			else if (direction === 'left' && finalDirection === 'right' && activeLayout === 'chat') {
				//return to home
				if (langDirection === 'ltr') {
					updateDisplay('home');
					//stay on chat
				} else {
					sideOverlayPos = '0%';
				}
			}

			//on chat
			else if (direction === 'right' && finalDirection === 'left' && activeLayout === 'chat') {
				//stay on chat
				if (langDirection === 'ltr') {
					sideOverlayPos = '0%';
					//return to home
				} else {
					updateDisplay('home');
				}
			}

			//on nav
			else if (direction === 'right' && finalDirection === 'right' && activeLayout === 'nav') {
				//stay on nav
				if (langDirection === 'ltr') {
					drawerMenuPos = `0%`;
					//return to home
				} else {
					updateDisplay('home');
				}
			}

			//on nav
			else if (direction === 'left' && finalDirection === 'left' && activeLayout === 'nav') {
				//return to home
				if (langDirection === 'ltr') {
					updateDisplay('home');
					//stay on nav
				} else {
					drawerMenuPos = `0%`;
				}
			}

			//on nav
			else if (direction === 'left' && finalDirection === 'right' && activeLayout === 'nav') {
				//stay on nav
				if (langDirection === 'ltr') {
					drawerMenuPos = `0%`;
					//return to home
				} else {
					updateDisplay('home');
				}
			}

			//on nav
			else if (direction === 'right' && finalDirection === 'left' && activeLayout === 'nav') {
				//return to home
				if (langDirection === 'ltr') {
					updateDisplay('home');
					//stay on nav
				} else {
					drawerMenuPos = `0%`;
				}
			}
		}

		initDirectionSet = false;
		scrollHorizontal = false;
		enableAutoTransitions = true;
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

	/**
	 * updateDisplay
	 **/
	function updateDisplay(updateLayout) {
		//BUG - this is running multiple times..
		console.log('[Changing Nav]', updateLayout);
		activeLayout = updateLayout; //($sRoute.activeroute === '/*')?'home':updateLayout;

		clearTimeout(maskTimer);
		clearTimeout(blurTimer);

		blur = false;
		//console.log('xxxx', activeLayout);
		switch (activeLayout) {
			case 'nav':
				sApp.updateVal('lockScroll', true);
				sApp.updateVal('disablePullToRefresh', true);
				showNavMask = true;
				opacityVal = 0.75;
				drawerMenuPos = '0%';
				if (langDirection === 'ltr') {
					enableInset = false;
					enableOutset = true;
				} else {
					enableInset = true;
					enableOutset = false;
				}

				//blurs bg mask display
				blurTimer = setTimeout(() => {
					blur = true;
				}, 300);
				break;
			case 'chat':
				sApp.updateVal('lockScroll', true);
				sApp.updateVal('disablePullToRefresh', true);
				showNavMask = true;
				opacityVal = 0.75;
				sideOverlayPos = '0%';
				if (langDirection === 'ltr') {
					enableInset = true;
					enableOutset = false;
				} else {
					enableInset = false;
					enableOutset = true;
				}
				break;
			//home
			default:
				sApp.updateVal('lockScroll', false);
				sApp.updateVal('disablePullToRefresh', false);
				//enableAutoTransitions = true;
				opacityVal = 0;
				enableInset = false;
				enableOutset = false;
				if (langDirection === 'ltr') {
					sideOverlayPos = '100%';
					drawerMenuPos = '-100%';
				} else {
					sideOverlayPos = '-100%';
					drawerMenuPos = '100%';
				}
				maskTimer = setTimeout(() => {
					showNavMask = false;
				}, 300);
		}

		sApp.updateVal('updateActiveLayout', activeLayout);
	}

	/**
	 * signOut
	 **/
	function signOut() {
		console.log('[SigningOut...]');

		sUser.reset();
		localStorage.clear();

		//web3 signout
		///...
	}

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

	/**
	 * closeWindow
	 */
	function closeWindow() {
		showModal = 'false';
		//showSocialModal = 'false';
	}
	/**
	 * closeSocialWindow
	 */
	function closeSocialWindow() {
		//showModal = 'false';
		showSocialModal = 'false';
	}
	/**
	 * logout
	 */
	async function logOut() {
		await Moralis.User.logOut();
		console.log('logged out');
		goto('/login');
	}

	/**
	 * saveSocialLinks
	 */
	function saveSocialLinks() {
		console.log('adding links');
		let updateLinks = $sUser.profile;
		updateLinks.socialLinks = {
			twitter: socialTwitterLink,
			youTube: socialYouTubeLink,
			instagram: socialInstagramLink,
		};
		sUser.updateVal('profile', updateLinks);
		closeSocialWindow();
	}

	/**
	 * addToProfile
	 */
	function addToProfile(img) {
		console.log('adding profile img');
		let updateProfile = $sUser.profile;
		updateProfile.profilePic = img;
		sUser.updateVal('profile', updateProfile);
	}

	/**
	 * addToBGProfile
	 */
	function addToBGProfile(img) {
		console.log('adding bg profile img');
		let updateProfile = $sUser.profile;
		updateProfile.profileBGPic = img;
		sUser.updateVal('profile', updateProfile);
	}
	/*
	modalHeader = 'Choose Your Profile NFT';
	modalContent = 'selectNFT';
	modalButtons = [
		{
			text: 'confirm',
			action: 'closeWindow',
		},
	];*/

	let userAvatar =
		'background-image:url("/assets/images/best-medium-format-camera-for-starting-out.jpg")';
	userAvatar = '';

	showSocialModal = 'true';
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

	.photoGrid {
		padding: 0px;
		margin: 0px;
		display: grid;
		grid-gap: 18px;
		grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
		list-style: none;
		max-height: 305px;
		overflow: scroll;
	}
	.photoGrid li {
		background: #f9fafc;
		border-radius: 20px;
		padding: 5px;
		margin: 0px !important;
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
	form {
		display: flex;
		flex-direction: column;
	}
	form label {
		display: flex;
		margin: 8px 20px;
		border-radius: 8px;
		border: solid 4px #f9fafc;
	}
	form label input {
		text-indent: 10px;
	}
	form label input,
	form label textarea {
		flex: 1;
		border: 0px;
	}
	form label input {
		line-height: 50px;
	}
	form label textarea {
		padding: 10px;
	}
	form label input::placeholder,
	form label textarea::placeholder {
		color: #d9dde2;
	}
	.linkList {
		padding: 20px 0px;
		margin: 0px 0px 0px 0px;
	}
	.linkList li {
		list-style: none;
		border-radius: 16px;
		border: solid 4px #f9fafc;
		padding: 10px;
		margin-bottom: 16px;
		position: relative;
		transition: opacity 0.3s;
	}
	.linkList li > * {
		transition: opacity 0.3s;
	}
	.linkList li.active {
		border: solid 4px #1473e6;
		background: #fff;
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
		font-size: 0.65em;
		line-height: 1.44em;
		display: block;
		color: #383c3a;
	}
	.contentWrapper {
		padding: 0px 20px;
	}

	.galTitle {
		font-weight: bold;
		font-size: 1.2em;
		margin-top: -5px;
		margin-left: 4px;
	}
	.contentWrapper h4 {
		margin-top: 20px;
		margin-bottom: 0px;
		color: #383c3a;
	}
	.contentWrapper > p {
		line-height: 1.44em;
		display: block;
	}

	.linkList {
		max-height: 290px;
		overflow: auto;
	}

	.hasShadow {
		position: relative;
		z-index: 10;
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
	.linkList .grey > * {
		opacity: 0.3;
	}
	.linkList .active.grey > * {
		opacity: 1;
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
		border-radius: 10px;
		background: #f5f7f5;
	}
	.createOption dd {
		display: flex;
		align-items: center;
		margin: 0px 0px 0px 10px;
		font-weight: bold;
		font-size: 1.2em;
		background: #f5f7f5;
		border-radius: 10px;
		padding: 0px 20px;
	}
</style>

<!-- Global window events -->
<svelte:window
	on:resize="{windowResize}"
	on:touchstart="{scrollStart}"
	on:touchmove="{checkScrollDirection}"
	on:touchend="{scrollEnd}" />

<PWA />

<!-- Modal Overlays -->
<AddSocialLinks
	on:closeWindow="{closeSocialWindow}"
	on:saveSocialLinks="{saveSocialLinks}"
	on:addLink="{() => {
		closeSocialWindow();
	}}"
	on:addDetail="{() => {
		socialModalTpl = 'addDetail';
		socialModalButtons = [
			{
				text: 'Add Link',
				action: 'addLink',
			},
		];
	}}"
	show="{showSocialModal}"
	header="{socialModalHeader}"
	buttons="{socialModalButtons}">
	{#if socialModalTpl === 'addSocial'}
		<form>
			<label for="twitter">
				<div style="display:flex; padding:10px;align-items:center;">
					<img width="26" src="/img/ico_twitter.svg" alt="Matic" />
				</div>
				<div>
					<input bind:value="{socialTwitterLink}" id="twitter" placeholder="Twitter" />
				</div>
			</label>

			<label for="youTube">
				<div style="display:flex; padding:10px;align-items:center;">
					<img width="26" src="/img/ico_youtube.svg" alt="Matic" />
				</div>
				<div><input bind:value="{socialYouTubeLink}" id="YouTube" placeholder="YouTube" /></div>
			</label>

			<label for="instagram">
				<div style="display:flex; padding:10px;align-items:center;">
					<img width="26" src="/img/ico_instagram.svg" alt="Instagram" />
				</div>
				<div>
					<input bind:value="{socialInstagramLink}" id="instagram" placeholder="Instagram" />
				</div>
			</label>
		</form>
	{/if}
	{#if socialModalTpl === 'createNetwork'}
		<div class="contentWrapper hasShadow" style="min-height: 90px;">
			<h4>Choose a template</h4>
			<p>Select a link template from the below three options:</p>
		</div>
		<div class="contentWrapper">
			<ul class="linkList">
				<li
					class:active="{activeLinkTpl === 'description'}"
					class:grey="{activeLinkTpl.length > 0}"
					on:click="{() => {
						activeLinkTpl = 'description';
					}}">
					<dl>
						<dt class="mini">
							<img width="100" src="/img/ico_img_placeholder.svg" alt="Placeholder Img" />
						</dt>
						<dd>
							<div>
								<b>Descriptive Panel</b>
								<p>Info on the link content.<br /> What can the user find here?</p>
							</div>
						</dd>
					</dl>
				</li>
				<li
					class:active="{activeLinkTpl === 'simple'}"
					class:grey="{activeLinkTpl.length > 0}"
					on:click="{() => {
						activeLinkTpl = 'simple';
					}}">
					<dl>
						<dt class="mini">
							<img width="26" src="/img/ico_img_placeholder.svg" alt="Placeholder" />
						</dt>
						<dd>Simple Link</dd>
					</dl>
				</li>
				<li
					class:active="{activeLinkTpl === 'gallery'}"
					class:grey="{activeLinkTpl.length > 0}"
					on:click="{() => {
						activeLinkTpl = 'gallery';
					}}">
					<div class="galTitle">Gallery</div>
					<ul class="photoGrid">
						<li><img width="40" src="/img/ico_img_placeholder.svg" alt="Placeholder" /></li>
						<li><img width="40" src="/img/ico_img_placeholder.svg" alt="Placeholder" /></li>
						<li><img width="40" src="/img/ico_img_placeholder.svg" alt="Placeholder" /></li>
					</ul>
				</li>
			</ul>
		</div>
	{/if}
	{#if socialModalTpl === 'addDetail'}
		<div class="contentWrapper hasShadow" style="min-height: 90px;">
			<h4>Create link</h4>
			<p>Update the following fields:</p>
		</div>

		<form>
			<label for="title">
				<input id="title" placeholder="Title *" />
			</label>
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
					<dd
						on:click|stopPropagation="{() => {
							sModal.showModal({
								enable: 'true',
								title: 'Choose A Placeholder NFT',
								tpl: 'selectNFT',
								notch: true,
								hasShadow: true,
								subHeader: 'This NFT will be displayed as part of your link.',
								buttons: [
									{
										text: 'Confirm',
										action: 'closeWindow',
									},
								],
							});
						}}">
						Add NFT Image
					</dd>
				</dl>
			</div>

			<label for="description">
				<textarea id="description" placeholder="Description"></textarea>
			</label>

			<label for="linkURL">
				<input id="instagram" placeholder="link URL *" />
			</label>
		</form>
	{/if}
</AddSocialLinks>

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

	{#if modalTpl === 'selectNFT' || modalTpl === 'selectBGNFT'}
		<ul class="grid">
			{#if $sUser.nft && $sUser.nft.length > 0}
				{#each $sUser.nft as NFT}
					{#if NFT.metadata}
						<li
							on:click="{() => {
								if (modalTpl === 'selectNFT') {
									addToProfile(NFT.metadata.image);
								} else {
									addToBGProfile(NFT.metadata.image);
								}
							}}">
							<figure>
								<img width="100%" src="{NFT.metadata.image}" alt="{NFT.metadata.name}" />
								<figcaption>{NFT.metadata.name}</figcaption>
							</figure>
						</li>
					{/if}
				{/each}
			{/if}
			<!--<li class="active">
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
		<!-- Nav Header-->
		<StickyHeader headerNavTransparent="{routeConf.headerNavTransparent}">
			<!-- Mobile HeaderBar -->
			{#if routeConf.displayNav}
				<HeaderNav
					on:home="{() => {
						goto(`/`);
					}}"
					on:goBack="{(e) => {
						goBack(e.detail.path);
					}}"
					on:nav="{() => {
						updateDisplay('nav');
					}}"
					pageTitle="{routeConf.pageTitle}"
					showBurger="{routeConf.showBurger}"
					showBack="{routeConf.showBack}"
					headerTheme="{routeConf.headerTheme}"
					leftSpacer="{routeConf.leftSpacer}"
					rightSpacer="{routeConf.rightSpacer}"
					showLogo="{routeConf.showLogo}"
					showSaveProfile="{routeConf.showSaveProfile}" />
			{/if}
		</StickyHeader>
		<!-- xNav Header-->

		<!-- Side Panels -->
		<!-- Side Drawer Panel-->
		<SideDrawerMenu
			on:nav="{() => {
				updateDisplay('home');
			}}"
			on:signout="{signOut}"
			on:collapseMenu="{() => {
				updateDisplay('home');
			}}"
			enableAutoTransitions="{enableAutoTransitions}"
			drawerMenuPos="{drawerMenuPos}" />
		<!-- xSide Drawer Panel-->

		<!-- Side Overlay Panel -->
		<SideOverlayPanel
			on:collapseMenu="{() => {
				updateDisplay('home');
			}}"
			enableAutoTransitions="{enableAutoTransitions}"
			sideOverlayPos="{sideOverlayPos}" />
		<!-- xSide Overlay Panel -->

		<!-- Mask Blur-->
		<PanelMaskBlur blur="{blur}" opacityVal="{opacityVal}" />
		<!-- xMask Blur-->
		<!-- xSide Panels -->

		<!-- Page Content -->
		<MainContentWrapper enableInset="{enableInset}" enableOutset="{enableOutset}">
			<slot />
		</MainContentWrapper>
		<!-- xPage Content -->
	</SiteLayoutWrapper>
	<!-- xSite -->
</SiteWrapper>
