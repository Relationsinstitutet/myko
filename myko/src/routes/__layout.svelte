<script lang="ts">
  import { page } from '$app/stores';

</script>

<nav>
  <div class="bottom-gradient">
    <div class="nav-bottom">
      <div class="nav-left">
        <a href="/">vi</a>
        <a href="/activities">göra</a>
        <a href="/settings">jag</a>
      </div>
      <div class="nav-right">
        <a href="/faq">?</a>
      </div>
      <div class="nav-right">
        <p>{$page.url.pathname}</p>
      </div>
    </div>
  </div>
</nav>

<slot />

<style>
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&family=Roboto+Mono:wght@300;400;500;700&display=swap');

  :global(:root) {
    /* Font sizes */
    --12px: 0.75rem;
    --14px: 0.875rem;
    --16px: 1rem;
    --18px: 1.125rem;
    --20px: 1.25rem;
    --24px: 1.5rem;
    --30px: 1.875rem;
    --36px: 2.25rem;
    --48px: 3rem;
    --60px: 3.75rem;
    --72px: 4.5rem;

    /* Grey colors */
    --grey-900: hsla(0, 0%, 13%, 1); /* Typography */
    --grey-800: hsla(0, 0%, 23%, 1); /* Typography */
    --grey-700: hsla(0, 0%, 32%, 1);
    --grey-600: hsla(0, 0%, 38%, 1); /* Typography */
    --grey-500: hsla(0, 0%, 49%, 1);
    --grey-400: hsla(0, 0%, 62%, 1);
    --grey-300: hsla(0, 0%, 69%, 1);
    --grey-200: hsla(0, 0%, 81%, 1);
    --grey-100: hsla(0, 0%, 88%, 1);
    --grey-050: hsla(0, 0%, 97%, 1);

    /* Ocean colors */
    --ocean-800: hsla(185, 97%, 23%, 1);
    --ocean-600: hsla(185, 99%, 29%, 1);
    --ocean-400: hsla(187, 54%, 51%, 1);
    --ocean-100: hsla(152, 43%, 93%, 1);

    /* Peach colors */
    --peach-700: hsla(358, 93%, 79%, 1);
    --peach-500: hsla(30, 100%, 85%, 1);
    --peach-300: hsla(28, 100%, 90%, 1);
    --peach-100: hsla(49, 100%, 96%, 1);

    /* Purple colors */
    --purple-700: hsla(311, 26%, 49%, 1);
    --purple-500: hsla(314, 23%, 59%, 1);
    --purple-400: hsla(332, 49%, 70%, 1);
    --purple-200: hsla(341, 50%, 85%, 1);
  }

  .bottom-gradient {
    position: fixed;
    bottom: 0;
    height: 236px;
    width: 100%;
    background: linear-gradient(
      3deg,
      #3fb6c6 -2.94%,
      #c1c6e0 8.67%,
      #349dab 19.14%,
      rgba(200, 131, 180, 0.83) 33.09%,
      rgba(216, 160, 193, 0.57678) 54.02%,
      rgba(236, 198, 210, 0.25322) 80.76%,
      rgba(252, 228, 223, 0) 101.68%
    );
  }

  .nav-bottom {
    background-color: var(--peach-100);
    /* border-top: 0.5px solid #ccc; */ /* TODO test with color and/or shadow*/
    border-bottom: 2px solid var(--ocean-600);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25); /* TODO test with colored shadow*/
    position: fixed;
    bottom: 0;
    overflow: hidden;
    margin-bottom: 8px;
    height: 48px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    font-family: 'Roboto Mono', monospace;
    font-weight: 700;
  }

  .nav-bottom a {
    text-decoration: none;
    color: var(--grey-800);
  }

  .nav-left {
    margin-left: 24px;
  }

  .nav-left a {
    margin-right: 24px;
  }
  .nav-right {
    margin-right: 24px;
  }
</style>
