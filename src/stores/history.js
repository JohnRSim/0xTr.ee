import { writable } from 'svelte/store';
import { browser } from '$app/env';

const appConfig = { instance: 'DEV' }

/**
 * Store Framework
 */
const setup = {
	active: {
		scrollTop: 0,
		headerDisplay: '',
		animAttributes: {
			showAnimation: false,
			animateClassName: 'undefined',
			imgPosDimensions: {},
			style: {}
		},
		pageData: {},
		virtualScroll: {
			vertical: {
				scrollTop: 0,
				heightMap: [],
				start: 0,
				end: 0,
				averageHeight: null,
				top: 0,
				bottom: 0,
				name: false,
			},
			horizontal: {
				scrollLeft: 0,
				widthMap: [],
				start: 0,
				end: 0,
				averageWidth: null,
				left: 0,
				right: 0,
				name: false,
			},
		},
	},
	direction: 'forwards',
	history: [],
};

/**
 * Simple history tracker
 * mainly used for scroll position and animation.
 */
function manageHistory() {
	const { subscribe, set, update } = writable(setup);

	return {
		/**
		 * Subscribe to updates
		 */
		subscribe,
		/**
		 * add object of data on navigation
		 */
		addPageData: (data) => {
			console.info('[history][addPageData]', data);
			update((a) => {
				a.direction = 'forwards';
				//console.log('update',a,data)
				a.active = {
					scrollTop: 0,
					headerDisplay: '',
					animAttributes: data.animAttributes || {
						//animAttributes: {
						showAnimation: false,
						animateClassName: 'undefined',
						imgPosDimensions: {},
						style: {}
					},
					pageData: data.pageData,
					virtualScroll: {
						vertical: {
							scrollTop: 0,
							heightMap: [],
							start: 0,
							end: 0,
							averageHeight: null,
							top: 0,
							bottom: 0,
							name: false,
						},
						horizontal: {
							scrollLeft: 0,
							widthMap: [],
							start: 0,
							end: 0,
							averageWidth: null,
							left: 0,
							right: 0,
							name: false,
						},
					},
				};
				a.history.push(data);
				return a;
			});
		},
		/**
		 * showAnimation
		 */
		showAnimation: (show) => {
			console.info('[history][showAnimation]', show);
			update((a) => {
				a.active.animAttributes.showAnimation = show;
				return a;
			});
		},
		/**
		 * updateAnim
		 */
		updateAnim: (animAttributes) => {
			console.info('[history][updateAnim]', animAttributes);
			update((a) => {
				a.active.animAttributes = animAttributes;
				return a;
			});
		},
		/**
		 * window/history.back remove data update active
		 */
		setActive: () => {
			console.info('[history][setActive]');
			update((a) => {
				a.direction = 'back';
				//reset
				a.active = {
					scrollTop: 0,
					headerDisplay: '',
					animAttributes: {
						showAnimation: false,
						animateClassName: 'undefined',
						imgPosDimensions: {},
						style: {}
					},
					pageData: {},
					virtualScroll: {
						vertical: {
							scrollTop: 0,
							heightMap: [],
							start: 0,
							end: 0,
							averageHeight: null,
							top: 0,
							bottom: 0,
							name: false,
						},
						horizontal: {
							scrollLeft: 0,
							widthMap: [],
							start: 0,
							end: 0,
							averageWidth: null,
							left: 0,
							right: 0,
							name: false,
						},
					},
				};
				//update with history
				if (a.history.length > 0) {
					a.active = a.history[a.history.length - 1];
				}
				a.active.animAttributes.showAnimation = false;
				console.log('----', a.active);
				//set active
				if (a.history.length > 0) {
					a.active = a.history[a.history.length - 1];
					a.history.pop();
				}

				return a;
			});
		},
		/**
		 * window/history.back remove data update active
		 */
		resetActive: () => {
			console.info('[history][resetActive]');
			update((a) => {
				a.direction = 'forwards';
				//reset
				a.active = {
					scrollTop: 0,
					headerDisplay: '',
					animAttributes: {
						showAnimation: false,
						animateClassName: 'undefined',
						imgPosDimensions: {},
						style: {}
					},
					pageData: {},
					virtualScroll: {
						vertical: {
							scrollTop: 0,
							heightMap: [],
							start: 0,
							end: 0,
							averageHeight: null,
							top: 0,
							bottom: 0,
						},
						horizontal: {
							scrollLeft: 0,
							widthMap: [],
							start: 0,
							end: 0,
							averageWidth: null,
							left: 0,
							right: 0,
							name: false,
						},
					},
				};

				return a;
			});
		},
		/**
		 * reset the state
		 */
		reset: () => {
			if (browser) {
				localStorage.setItem(`${appConfig.instance}_history`, setup);
			}
			return set(setup);
		},
	};
}
const history = manageHistory();
history.subscribe((val) => {
	if (browser) {
		localStorage.setItem(`${appConfig.instance}_history`, JSON.stringify(val));
	}
});

export { history };