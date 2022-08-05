<script lang="ts">
  import { page } from '$app/stores';

  function gradientColor(pageUrl: string): string {
    let gradientColor = 'gradient-basic';

    if (pageUrl === '/') {
      gradientColor = 'gradient-home';
      return gradientColor;
    } else if (pageUrl === '/activities') {
      gradientColor = 'gradient-activities';
      return gradientColor;
    } else if (pageUrl === '/settings') {
      gradientColor = 'gradient-settings';
      return gradientColor;
    } else if (pageUrl === '/faq') {
      gradientColor = 'gradient-faq';
      return gradientColor;
    } else {
      return gradientColor;
    }
  }
</script>

<nav>
  <div class="bottom-gradient {gradientColor($page.url.pathname)}">
    <div class="nav-bottom">
      <div class="nav-left">
        <a href="/" class:is-active={$page.url.pathname === '/'}> vi</a>
        <a href="/activities" class:is-active={$page.url.pathname === '/activities'}> göra</a>
        <a href="/samtid" class:is-active={$page.url.pathname === '/samtid'}> samtid</a>
        <a href="/settings" class:is-active={$page.url.pathname === '/settings'}> jag</a>
      </div>
      <div class="nav-right">
        <a href="/faq" class:is-active={$page.url.pathname === '/faq'}>?</a>
      </div>
    </div>
  </div>
</nav>

<slot />

<style>
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Roboto+Mono:wght@300;400;500;700&display=swap');

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
    --ocean-900: hsla(185, 94%, 17%, 1);
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

    /*  Button shadows */
    --shadow-color: 350deg 40% 50%;
    --shadow-elevation-low: 0.5px 0.7px 0.8px hsl(var(--shadow-color) / 0.32),
      1.5px 2.2px 3px -1px hsl(var(--shadow-color) / 0.46);
    --shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.2),
      1px 1.7px 2.4px -0.9px hsl(var(--shadow-color) / 0.32),
      3.9px 6.4px 10.7px -1.7px hsl(var(--shadow-color) / 0.4);
  }

  .bottom-gradient {
    position: fixed;
    bottom: 0;
    height: 246px;
    width: 100%;
  }

  .gradient-basic {
    background: linear-gradient(
      0deg,
      hsla(180deg, 50%, 50%) -3%,
      hsla(180deg, 30%, 80%) 8%,
      hsla(190deg, 50%, 50%) 15%,
      hsla(315deg, 45%, 65%, 0.7) 34%,
      hsla(328deg, 50%, 75%, 0.42) 55%,
      hsla(340deg, 60%, 90%, 0.17) 80%,
      hsla(0deg, 85%, 95%, 0) 100%
    );
  }

  .gradient-home {
    background: linear-gradient(
      0deg,
      /*smoother gradient from josh comeau*/ hsl(187deg 53% 55%) -4%,
      hsl(195deg 43% 65%) 22%,
      hsla(250deg, 45%, 75%, 0.85) 30%,
      hsla(300deg, 55%, 70%, 0.58) 45%,
      hsla(320deg, 40%, 65%, 0.45) 60%,
      hsla(310deg, 20%, 50%, 0.32) 77%,
      hsla(290deg, 20%, 45%, 0.17) 88%,
      hsla(260deg, 20%, 35%, 0) 100%
    );
  }

  .gradient-activities {
    background: linear-gradient(
      3deg,
      hsla(180deg, 50%, 50%) -3%,
      hsla(180deg, 30%, 80%) 8%,
      hsla(190deg, 50%, 50%) 15%,
      hsla(315deg, 45%, 65%, 0.65) 40%,
      hsla(328deg, 50%, 75%, 0.32) 60%,
      hsla(340deg, 60%, 90%, 0.12) 80%,
      hsla(0deg, 85%, 95%, 0) 99%
    );
  }

  .gradient-settings {
    background: linear-gradient(
      359deg,
      #ec9e9e -2.94%,
      #ec9e9e 2.28%,
      rgba(252, 228, 223, 0) 94.66%
    );
  }

  .gradient-faq {
    background: linear-gradient(
      359deg,
      #ec9e9e -2.94%,
      #ec9e9e 2.28%,
      rgba(252, 228, 223, 0) 94.66%
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
    color: var(--grey-600);
  }

  .nav-left {
    margin-left: 24px;
  }

  .nav-left a {
    margin-right: 16px;
  }
  .nav-right {
    margin-right: 24px;
  }

  .nav-bottom .is-active {
    color: var(--grey-800);
  }

  .nav-bottom a {
    position: relative;
  }

  .nav-bottom .is-active::before {
    content: '';
    width: 13px;
    height: 12px;
    border-radius: 7.5px;
    background: var(--ocean-600);
    position: absolute;

    top: 100%;
    left: 50%;
    transform: translate(-50%, 50%);
  }

  @media (min-width: 45rem) {
    .nav-bottom {
      justify-content: center;
    }
    .nav-bottom a {
      letter-spacing: 0.1rem;
    }
    .nav-left {
      /*margin-left: 48px;*/
      margin-left: 24px;
    }

    .nav-left a {
      margin-right: 72px; /*48,72,96*/
    }
    .nav-right {
      /*position: absolute;
      right: 16px;*/
      margin-right: 24px;
      margin-left: 72px;
    }
  }
</style>
