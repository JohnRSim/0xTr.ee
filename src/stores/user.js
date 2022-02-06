import { writable } from 'svelte/store';
import { browser } from '$app/env';

const appConfig = { instance: 'DEV' }

/**
 * Store Framework
 */
const setup = {
	hasProfileFromDB:false,
	disablePanelScroll: false,
	userInfo: {},
	ethAddress: '',
	ft: [],
	nft: [],
	profile: {
		name: '',
		bio: '',
		profilePic: '',
		profileBGPic: '',
		socialLinks: {
			twitter: '',
			youTube: '',
			instagram: '',
		},
		showTokens: true,
		showNFTs: true,
		showLinks: false,
	},
	links: {}
};

/**
 * Store User Details
 * 
 */
function manageUser() {
	let store = setup;
	if (browser) {
		if (localStorage.getItem(`${appConfig.instance}_user`)) {
			const storedUpdates = JSON.parse(localStorage.getItem(`${appConfig.instance}_user`));
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
			console.info('[user][updateVal]', key, val);
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
		 * addLink
		 */
		addLink: (key, val) => {
			console.info('[user][addLink]', key, val);
			update((a) => {
				a.links[key] = val;
				return a;
			});
		},

		/**
		 * removeLink
		 */
		removeLink: (key) => {
			console.info('[user][removeLink]', key);
			update((a) => {
				//console.log('update',a,data)
				delete a.links[key];
				return a;
			});
		},

		/**
		 * clearUser
		 */
		clearUser: () => {
			console.info('[user][clearUser]');
			update((a) => {
				a.user = {
					user_metadata: {
						full_name: 'anonymous',
					}
				};

				return a;
			});
		},

		/**
		/**
		 * reset the state
		 */
		reset: () => {
			if (browser) {
				localStorage.setItem(`${appConfig.instance}_user`, {
					disablePanelScroll: false,
					userInfo: {},
					ethAddress: '',
					ft: [],
					nft: [],
					profile: {
						name: '',
						bio: '',
						profilePic: '',
						profileBGPic: '',
						socialLinks: {
							twitter: '',
							youTube: '',
							instagram: '',
						},
						showTokens: true,
						showNFTs: true,
						showLinks: false,
					},
					links: {}
				});
			}
			return set({
				disablePanelScroll: false,
				userInfo: {},
				ethAddress: '',
				ft: [],
				nft: [],
				profile: {
					name: '',
					bio: '',
					profilePic: '',
					profileBGPic: '',
					socialLinks: {
						twitter: '',
						youTube: '',
						instagram: '',
					},
					showTokens: true,
					showNFTs: true,
					showLinks: false,
				},
				links: {}
			});
		},
	};
}

const user = manageUser();
user.subscribe((val) => {
	if (browser) {
		localStorage.setItem(`${appConfig.instance}_user`, JSON.stringify(val));
	}
});

export { user };