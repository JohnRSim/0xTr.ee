import { writable } from 'svelte/store';
import { browser } from '$app/env';

const appConfig = { instance: 'DEV' }

/**
 * Store Framework
 */
const setup = {
	version: "0.0.1",
	theme: "light",
	webpSupport: true,
	lockScroll: false,
	disablePullToRefresh: false,
	ready: false,
};

/**
 * Store Feed
 * 
 */
function manageApp() {
	let store = setup;
	if (browser) {
		if (localStorage.getItem(`${appConfig.instance}_app`)) {
			const storedUpdates = JSON.parse(localStorage.getItem(`${appConfig.instance}_app`));
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
		 * updateVal
		 */
		updateVal: (key, val) => {
			console.info('[app][updateVal]', key, val);
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
		 * add object of data on navigation
		 */
		updateScrollTarget: (data) => {
			console.info('[app][updateScrollTarget]', data);
			update((a) => {
				if (typeof (data) !== 'undefined') {
					a.stickyScrollTarget = data;
				}
				return a;
			});
		},
		/**
		 * set webp support flag
		 */
		webpSupport: (data) => {
			console.info('[app][webpSupport]', data);
			update((a) => {
				//console.log('update',a,data)
				a.webpSupport = data;
				return a;
			});
		},
		/**
		 * reset the state
		 */
		reset: () => set(setup),
	};
}

const app = manageApp();
app.subscribe((val) => {
	if (browser) {
		localStorage.setItem(`${appConfig.instance}_app`, JSON.stringify(val));
	}
});

export { app };