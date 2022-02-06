import { writable } from 'svelte/store';
import { browser } from '$app/env';

const appConfig = { instance: 'DEV' }

/**
 * Store Framework
 */
const setup = {
	chain: 'mumbai',
	treeContract: '0x87AA74bC1E6846818304480b7f4Fc5ce4e74e266',
	treeTokenAddress: '0x1F694658898D62b33b7a123E1A519b7A21f44E85',
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