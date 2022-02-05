import { writable } from 'svelte/store';
import { browser } from '$app/env';

const appConfig = { instance: 'DEV' }

/**
 * Store Framework
 */
const setup = {
	id: {}
};

/**
 * Store User Details
 * 
 */
function manageWallet() {
	let store = setup;
	if (browser) {
		if (localStorage.getItem(`${appConfig.instance}_wallet`)) {
			const storedUpdates = JSON.parse(localStorage.getItem(`${appConfig.instance}_wallet`));
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
			console.info('[wallet][updateVal]', key, val);
			update((a) => {
				//console.log('update',a,data)
				if (typeof (a[key]) !== 'undefined') {
					console.log('updating.........', a[key], val);
					a[key] = val;
				}
				return a;
			});
		},

		updateWallet: (walletID, data) => {
			console.info('[wallet][updateWallet]', walletID, data);
			update((a) => {
				//console.log('update',a,data)
				if (typeof (a.id[walletID]) === 'undefined') {
					console.log('creating........', a.id[walletID], data);
					a.id[walletID] = {};
				}

				a.id[walletID].ft = data.ft;
				a.id[walletID].nft = data.nft;
				return a;
			});
		},
		/**
		/**
		 * reset the state
		 */
		reset: () => {
			if (browser) {
				localStorage.setItem(`${appConfig.instance}_wallet`, setup);
			}
			return set(setup);
		},
	};
}

const wallet = manageWallet();
wallet.subscribe((val) => {
	if (browser) {
		localStorage.setItem(`${appConfig.instance}_wallet`, JSON.stringify(val));
	}
});

export { wallet };