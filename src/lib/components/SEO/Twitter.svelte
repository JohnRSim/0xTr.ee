<script>
	export let article = false;
	export let author;
	export let twitterUsername;
	export let image;
	export let timeToRead = 0;
	export let cardType = false;
	export let metadescription;
	export let playerURL;
	//export let siteUrl;
	export let url;

	/*
	 * When there is an equivalent og tag present, Twitter takes that so check OpenGraph before
	 * adding additional tags, unless you want to override OpenGraph.
	 */
</script>

<svelte:head>
	{#if cardType}
		<meta name="twitter:card" content="{cardType}" /><!-- player -->
		{#if playerURL}
			<meta name="twitter:player" content="{playerURL}" />
			<!--<meta name="twitter:player" content="https://modelviewer.dev/examples/twitter/player.html?src=https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb&poster=https://modelviewer.dev/shared-assets/models/NeilArmstrongPoster.webp&alt=Neil%20Armstrong%27s%20Spacesuit%20from%20the%20Smithsonian%20Digitization%20Programs%20Office%20and%20National%20Air%20and%20Space%20Museum&environmentImage=https://modelviewer.dev/shared-assets/environments/moon_1k.hdr"/>-->
			<meta name="twitter:player:width" content="480" />
			<meta name="twitter:player:height" content="480" />
		{/if}
	{:else}
		<meta name="twitter:card" content="summary_large_image" />
	{/if}

	{#if image}
		<meta name="twitter:image" content="{image.url}" />
	{/if}

	{#if twitterUsername}
		<meta name="twitter:creator" content="{`@${twitterUsername}`}" />
		<meta name="twitter:site" content="{`@${twitterUsername}`}" />
	{/if}

	<meta name="twitter:label1" content="Written by" />
	<meta name="twitter:data1" content="{author}" />

	{#if article && timeToRead > 0}
		<meta name="twitter:label2" content="Est. reading time" />
		<meta
			name="twitter:data2"
			content="{timeToRead !== 1 ? `${timeToRead} minutes` : '1 minute'}" />
	{/if}

	{#if metadescription}
		<meta property="og:description" content="{metadescription}" />
	{/if}

	{#if url}
		<!--<meta http-equiv="refresh" content="0; url='{url}'"/>-->
	{/if}
</svelte:head>
