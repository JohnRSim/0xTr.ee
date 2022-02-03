<script>
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { writable } from 'svelte/store';

	// components
	import Ripple from '../transitions/Ripple.svelte';

	/*
	import Ripple from '../../transitions/Ripple.svelte';
    */

	//gestures
	//import { tap } from '@sveltejs/gestures';

	export let cssName = '',
		txt = '',
		rippleBlur = 2,
		speed = 500,
		border = 'none',
		color = '#fff',
		colorHover = '',
		fontSize = '1rem',
		fontWeight = 'normal',
		bgColor = '93, 120, 255',
		bgColorOpacity = 1,
		bgHover = bgColor,
		bgActive = bgColor,
		rippleColor = '#264169',
		round = '0.5rem',
		height = 60,
		width = 250,
		sizeIn = 20,
		opacityIn = 0.2,
		margin = 0,
		padding = 0,
		shadow = 'none',
		shadowHover = 'none',
		shadowActive = 'none',
		textTransform = 'uppercase',
		fontFamily = 'Arial',
		align = 'center',
		bgImage = '',
		bgSize = '',
		bgPos = '',
		decoration = '',
		secondaryBGColor = '',
		secondaryBorder = '',
		secondaryColor = '';

	let shadows = {
			none: 'none',
			1: '0 0 0 1px rgba(0, 0, 0, 0.05)',
			2: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
			3: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
			4: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
			5: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
			6: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
			7: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
		},
		mouseX,
		mouseY;

	function handleRipple() {
		const ripples = writable([]);

		return {
			subscribe: ripples.subscribe,

			add: (item) => {
				ripples.update((items) => {
					return [...items, item];
				});
			},
			clear: () => {
				ripples.update((items) => {
					return [];
				});
			},
		};
	}

	export const ripples = handleRipple();

	let rect,
		rippleBtn,
		w,
		h,
		x,
		y,
		offsetX,
		offsetY,
		deltaX,
		deltaY,
		locationY,
		locationX,
		scale_ratio,
		timer;

	let coords = { x: 50, y: 50 };

	$: (offsetX = Math.abs(w / 2 - coords.x)),
		(offsetY = Math.abs(h / 2 - coords.y)),
		(deltaX = w / 2 + offsetX),
		(deltaY = h / 2 + offsetY),
		(scale_ratio = Math.sqrt(Math.pow(deltaX, 2.2) + Math.pow(deltaY, 2.2)));

	const debounce = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			ripples.clear();
		}, speed + speed * 2);
	};

	let touch;

	function handleClick(e, type) {
		console.log('e', e, type);
		if (type == 'touch') {
			touch = true;
			ripples.add({ x: e.pageX - locationX, y: e.pageY - locationY, size: scale_ratio });
		} else {
			if (!touch) {
				ripples.add({ x: e.clientX - locationX, y: e.clientY - locationY, size: scale_ratio });
			}
			touch = false;
		}
		debounce();
	}

	onMount(() => {
		w = rippleBtn.offsetWidth;
		h = rippleBtn.offsetHeight;
		rect = rippleBtn.getBoundingClientRect();
		locationY = rect.y;
		locationX = rect.x;
	});
</script>

<style>
	button {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		border: var(--border);
		color: var(--color);
		font-size: var(--font-size);
		font-weight: var(--font-weight);
		min-height: var(--height);
		width: var(--width);
		max-width: 100%;
		margin: var(--margin);
		padding: var(--padding);
		position: relative;
		border-radius: var(--radius);
		cursor: pointer;
		-webkit-transition: 200ms all ease-out;
		transition: 200ms all ease-out;
		background-color: rgba(var(--bg-color), var(--bgColorOpacity));
		overflow: hidden;
		box-shadow: var(--shadow);
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		text-transform: var(--textTransform);
		font-family: var(--fontFamily);
		flex: 1;
	}

	button.disabled {
		background: #cbcccd !important;
		border: solid 4px #cbcccd !important;
	}

	button:hover,
	button:focus {
		outline: none;
		background-color: rgba(var(--bg-hover), 1);
		box-shadow: var(--shadow-h);
		color: var(--colorHover);
	}

	.ico {
		position: absolute;
		width: 40px;
		left: 5px;
		height: 100%;
		background-image: var(--bg-image);
		background-size: var(--bg-size);
		background-position: var(--bg-pos);
		background-repeat: no-repeat;
	}

	button:focus:hover {
		/*box-shadow: inset 0px 0px 0px 1px #fff;*/
	}

	button:active {
		outline: none;
		background-color: rgba(var(--bg-active), 1);
		box-shadow: var(--shadow-a);
		color: var(--colorHover);
	}
	span {
		position: relative;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: var(--align);
		margin: 0;
		padding: 0;
		z-index: 1;
		text-decoration: var(--text-decoration);
	}
	svg {
		height: 100%;
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		width: 100%;
	}
	button.secondary {
		background: var(--bg-button-secondary-login);
		border: var(--secondary-border);
		color: var(--secondary-color);
	}
	.loading {
		background-image: url('/img/anim/loader.gif') !important;
		background-position: center !important;
		background-repeat: no-repeat !important;
		background-size: 70px !important;
	}
</style>

<button
	on:click|stopPropagation
	class="{cssName}"
	style="--secondary-color:{secondaryColor};--secondary-border:{secondaryBorder};--bg-button-secondary-login:{secondaryBGColor};--bg-pos: {bgPos};--bg-size: {bgSize};--bg-image: {bgImage};--colorHover: {colorHover};--font-family: {fontFamily};--text-transform: {textTransform};--bgColorOpacity: {bgColorOpacity};--border: {border};--color: {color};--padding: {padding};--margin: {margin};--font-size: {fontSize};--font-weight: {fontWeight};--bg-color: {bgColor};--bg-hover: {bgHover};--bg-active: {bgActive};--radius: {round};--ripple: {rippleColor};--height: {height};--width: {width};--shadow: {shadows[
		shadow
	]};--shadow-h: {shadows[shadowHover]};--shadow-a: {shadows[shadowActive]}"
	bind:this="{rippleBtn}"
	on:touchstart="{(e) => handleClick(e.touches[0], 'touch')}"
	on:mousedown="{(e) => handleClick(e, 'click')}">
	{#if bgImage !== ''}
		<i class="ico"></i>
	{/if}
	<span style="--text-decoration:{decoration};--align: {align};">
		{txt}
		<slot />
	</span>
	<svg>
		{#each $ripples as ripple, index}
			<Ripple
				x="{ripple.x}"
				y="{ripple.y}"
				size="{ripple.size}"
				speed="{speed}"
				sizeIn="{sizeIn}"
				opacityIn="{opacityIn}"
				rippleBlur="{rippleBlur}" />
		{/each}
	</svg>
</button>
