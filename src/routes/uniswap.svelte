<script>
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';
</script>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.scrollable {
		overflow-y: scroll;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior-y: none;
		position: fixed;
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		background-color: var(--bg-baseWrap);
		padding-bottom: 60px;
	}

	article {
		display: flex;
		justify-content: start;
		flex-direction: column;
		margin: 0px;
		text-align: left;
		align-items: center;
	}
</style>

<section style="transform: translate3d(0px, 60px, 0px);" id="XT-home" class="scrollable gpu_acc">
	<div style="flex:1;display:flex;flex-direction:column;">
		<iframe
			title=""
			src="https://app.uniswap.org/#/swap?exactField=input&exactAmount=5&outputCurrency=0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889&inputCurrency=0x2a22886bFF44358Cbdd719eD40A3641E600138A6"
			height="660px"
			width="100%"
			style="flex:1;
    border: 0;
    margin: 0 auto;
    margin-bottom: .5rem;
    display: block;
    border-radius: 10px;
    max-width: 960px;
    min-width: 300px;
  "></iframe>
	</div>
</section>
