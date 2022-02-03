import { writable } from 'svelte/store';

const appConfig = { instance: 'DEV' }

/**
 * Store Framework
 */
const setup = {
	enable: 'false', //show/hide
	type: '', //['default, warning, error, alert]
	headerAnimation: false, //[info]
	title: '', //title
	subHeader: '', //subHeader
	text: '', //html string
	tpl: '', //defines a standard modal tpl to use
	buttons: [], //object {text:'cancel', call: () => { ..doSomething}}
	buttonLayout: '',
	showNotch: false,
};

/**
 * Store Feed
 * 
 */
function manageModal() {
	const { subscribe, set, update } = writable(setup);

	return {
		/**
		 * Subscribe to updates
		 */
		subscribe,
		/**
		 * show Modal window
		 */
		showModal: (data) => {
			console.info('[modal][showModel]', data);
			update((a) => {
				//console.log('update',a,data)
				a = data;
				return a;
			});
		},
		/**
		 * close Modal window
		 */
		close: () => {
			console.info('[modal][close]');
			update((a) => {
				//console.log('update',a,data)
				a.enable = 'false';
				return a;
			});
		},
		/**
		 * reset the state
		 */
		reset: () => set(setup),
	};
}

export const modal = manageModal();