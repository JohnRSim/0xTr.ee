import { writable } from 'svelte/store';
import { browser } from '$app/env';

const appConfig = { instance: 'DEV' }

/**
 * Store Framework
 */
const setup = {
	chain: 'mumbai',
	treeContract: '0xdb4911f8eC72f4E8B213e52bB932adE330Eb7EBb',//'0x094251c982cb00B1b1E1707D61553E304289D4D8',
	treeTokenAddress: '0x2a22886bFF44358Cbdd719eD40A3641E600138A6',
	nftContract: '',
	tokenId: '',
	latestBidPrice: '',
	buyerID: '',
	waitingTransaction: false,//tokenID
};

/**
 * Store Feed
 * 
 */
function manageBidding() {
	let store = setup;
	if (browser) {
		if (localStorage.getItem(`${appConfig.instance}_bidding`)) {
			const storedUpdates = JSON.parse(localStorage.getItem(`${appConfig.instance}_bidding`));
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
			console.info('[bidding][updateVal]', key, val);
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
		reset: () => set(setup),
	};
}

const bidding = manageBidding();
bidding.subscribe((val) => {
	if (browser) {
		localStorage.setItem(`${appConfig.instance}_bidding`, JSON.stringify(val));
	}
});

export { bidding };