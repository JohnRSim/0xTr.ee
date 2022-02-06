import { writable } from 'svelte/store';
import { browser } from '$app/env';

const appConfig = { instance: 'DEV' }

/**
 * Store Framework
 */
const setup = {
	cached: null, //last cached
	activeroute: 'Home',
	activePath: '/',
	activeID: null,
	global: {
		scrollTarget: '.scrollable',
		scrollBody: '.scrollable',
		enableUnderlay: false,
		displayNav: true,
		inlineHeaderNav: false,
		rightSpacer: false,
		showLogo: false,
		headerNavMaxHeight: 0,
	},
	path: {
		'/': {
			scrollTarget: '#XT-home.scrollable',
			scrollBody: '#XT-home',
			showBurger: true,
			showLogo: true,
			rightSpacer: true,
			inlineHeaderNav: true,
			headerNavMaxHeight: 60,
		},
		'/login': {
			scrollTarget: '#XT-login.scrollable',
			scrollBody: '#XT-login',
			displayNav: false,
		},
		'/*': {
			scrollTarget: '#XT-wallet.scrollable',
			scrollBody: '#XT-wallet',
			displayNav: true,
			headerNavTransparent: true,
			showLeftPanel: true,
			showRightPanel: true,
			showBurger: true,
		},
		'/edit': {
			scrollTarget: '#XT-editProfile.scrollable',
			scrollBody: '#XT-editProfile',
			showBack: true,
			pageTitle: 'Edit Profile',
			rightSpacer: true,
			inlineHeaderNav: true,
			headerNavMaxHeight: 60,
		},
		'/nft/*': {
			scrollTarget: '#XT-NFT.scrollable',
			scrollBody: '#XT-NFT',
			displayNav: true,
			headerNavTransparent: true,
			showLeftPanel: true,
			showRightPanel: true,
			showBack: true,
		},
		'/voting*': {
			scrollTarget: '#XT-voting.scrollable',
			scrollBody: '#XT-voting',
			displayNav: true,
			headerNavTransparent: true,
			showLeftPanel: true,
			showRightPanel: true,
			showBurger: true,
		},
	}
};

/**
 * Store route
 * 
 */
function manageRoute() {
	let store = setup;
	if (browser) {
		if (sessionStorage.getItem(`${appConfig.instance}_route`)) {
			const storedUpdates = JSON.parse(sessionStorage.getItem(`${appConfig.instance}_route`));
			store = {
				...setup,
				...storedUpdates,
			}
		} else {
			store = setup;
		}
	}

	const { subscribe, set, update } = writable(store);

	return {
		/**
		 * Subscribe to updates
		 */
		subscribe,
		/**
		 * updateCacheTime
		 */
		updateCacheTime: (time) => {
			console.info('[route][updateCacheTime]', time);
			update((a) => {
				a.cached = time;
				return a;
			});
		},
		/**
		 * updateVal
		 */
		updateVal: (key, val) => {
			console.info('[route][updateVal]', key, val);
			update((a) => {
				//console.log('update',a,data)
				if (typeof (a[key]) !== 'undefined') {
					console.log('updating.........', a[key], val);
					a[key] = val;
				}
				return a;
			});
		},
		/**
		 * reset the state
		 */
		reset: () => {
			if (process.browser) {
				sessionStorage.setItem(`${appConfig.instance}_route`, setup);
			}
			return set(setup);
		},
	};
}

const route = manageRoute();
route.subscribe((val) => {
	if (browser) {
		sessionStorage.setItem(`${appConfig.instance}_route`, JSON.stringify(val));
	}
});

export { route };