<nav>
  <div class="nav-bottom">
    <div class="nav-left">
      <a href="/activities">göra</a>
      <a href="/">vi</a>
      <a href="/settings">jag</a>
    </div>
    <div class="nav-right">
      <a href="/faq">?</a>
    </div>
  </div>
</nav>

<slot />

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap');
  /* nav a {
    color: red;
  } */

  .nav-bottom {
    background-color: hsla(49, 100%, 96%, 1);
    /* border-top: 0.5px solid #ccc; */
    border-bottom: 2px solid hsla(185, 99%, 29%, 1);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);

    position: fixed;
    bottom: 0;
    overflow: hidden;
    margin-bottom: 8px;

    height: 48px;
    width: 100%;
    /* padding-top: 0.8rem;
    padding-bottom: 0.8rem; */
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    /* justify-content: space-evenly; */
    justify-content: space-between;
    align-items: center;

    font-family: 'Roboto Mono', monospace;
    font-weight: 700;
  }

  .nav-bottom a {
    text-decoration: none;
    color: hsla(0, 0%, 23%, 1);
  }
  /*
  [aria-current] .navbottom a {
    color: red;
  } */
  /* nav [aria-current='page'] {
    color: red;
  } */

  .nav-left {
    /* display: flex;
    justify-content: space-evenly; */
    margin-left: 24px;
  }

  .nav-left a {
    margin-right: 24px;
  }
  .nav-right {
    margin-right: 24px;
  }
</style>
