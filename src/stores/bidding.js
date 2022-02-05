import { writable } from 'svelte/store';
import { browser } from '$app/env';

const appConfig = { instance: 'DEV' }

/**
 * Store Framework
 */
const setup = {
	chain: 'mumbai',
	treeContract: '0x5BC4C96c45a341499d400BeECa4c3DFe7a4089a8',
	treeTokenAddress: '0x5CF531386C449ce7fEA6aef2De6467018FFFdA50',
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