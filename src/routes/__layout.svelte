<script>
  // Lora - supported variants:
  // weights: [400, 500, 600, 700]
  // styles: italic, normal
  import '@fontsource/lora/400.css';
  import '@fontsource/lora/600.css';
  import '@fontsource/lora/700.css';
  import '@fontsource/lora/700-italic.css';

  // Source Sans Pro - supported variants:
  // weights: [200, 300, 400, 600, 700, 900]
  // styles: italic, normal
  import '@fontsource/source-sans-pro/400.css';
  import '@fontsource/source-sans-pro/400-italic.css';

  import '$lib/styles/normalise.css';
  import '$lib/styles/index.scss';

  import PWA from '$lib/components/PWA.svelte';
</script>

<PWA />

<div class="container">
  <main class="main-container">
    <slot />
  </main>
</div>

<style lang="scss">
</style>
