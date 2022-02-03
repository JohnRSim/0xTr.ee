<script>
  import ExternalLink from '$lib/components/ExternalLink.svelte';
  import FacebookIcon from '$lib/components/Icons/Facebook.svelte';
  import GitHubIcon from '$lib/components/Icons/GitHub.svelte';
  import LinkedinIcon from '$lib/components/Icons/LinkedIn.svelte';
  import TiktokIcon from '$lib/components/Icons/Tiktok.svelte';
  import TwitterIcon from '$lib/components/Icons/Twitter.svelte';
  import RodneyLabCredit from '$lib/components/RodneyLabCredit.svelte';
  import website from '$lib/config/website';
  import { COPYRIGHT_ENTITY } from '$lib/constants/entities';

  const { facebookPage, linkedinProfile, githubPage, tiktokUsername, twitterUsername } = website;
</script>

<footer class="footer-container">
  <div>
    Created by <a
      aria-label="0xtree"
      href="https://0xtree.netlify.app/"
      target="_blank"
      rel="noopener noreferrer">0xtree</a
    >. Copyright {COPYRIGHT_ENTITY} 2022.
  </div>
  <nav class="footer-icons">
    <ul>
      <li class="hover-jump">
        <ExternalLink
          ariaLabel="Go to the NFTHACK2022 REPO"
          href={`https://github.com/JohnRSim/NFTHACK2022`}><GitHubIcon /></ExternalLink
        >
      </li>
    </ul>
  </nav>
</footer>

<style lang="scss">
  .footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: $max-width-wrapper;
    margin: $spacing-12 auto $spacing-0;
    width: 100%;
  }

  .footer-icons {
    display: flex;
    list-style-type: none;

    ul {
      display: flex;
      margin: $spacing-6 $spacing-0;

      li {
        display: flex;
        margin: $spacing-0 $spacing-4 $spacing-0 $spacing-0;
      }
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .hover-jump {
      transition: all 0.25s ease-in-out;
    }
  }

  .hover-jump:focus,
  .hover-jump:hover {
    transform: translateY(-$spacing-2);
  }
</style>
