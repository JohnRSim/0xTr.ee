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
		padding:0px 20px
	}
</style>

<section style="transform: translate3d(0px, 60px, 0px);" id="XT-voting" class="scrollable gpu_acc">
	<div style="flex:1;display:flex;flex-direction:column;">
		<article style="flex:1;" dir="auto">
			<h4>DAO Voting Panel</h4>
			<p>Use your Tree tokens to vote for the next feature to be developed on 0xTr.ee</p>
		</article>
	</div>
</section>
