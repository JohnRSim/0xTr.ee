import { writable } from 'svelte/store';
import { browser } from '$app/env';

const appConfig = { instance: 'DEV' }

/**
 * Store Framework
 */
const setup = {
	id:{}
};

/**
 * Store Feed
 * 
 */
function manageNFT() {
	let store = setup;
	if (browser) {
		if (localStorage.getItem(`${appConfig.instance}_NFT`)) {
			const storedUpdates = JSON.parse(localStorage.getItem(`${appConfig.instance}_NFT`));
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
			console.info('[NFT][updateVal]', key, val);
			update((a) => {
				//console.log('update',a,data)
				if (typeof (a[key]) !== 'undefined') {
					console.log('updating.........', a[key], val);
					a[key] = val;
				}
				return a;
			});
		},

		addNFT: (key,meta) => {
			console.info('[NFT][addNFT]', key, meta);
			update((a) => {
				//console.log('update',a,data)
				a.id[key] = meta;
				return a;
			});

		},
		/**
		 * reset the state
		 */
		reset: () => set(setup),
	};
}

const nft = manageNFT();
nft.subscribe((val) => {
	if (browser) {
		localStorage.setItem(`${appConfig.instance}_NFT`, JSON.stringify(val));
	}
});

export { nft };