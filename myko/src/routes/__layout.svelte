<nav>
  <div class="bottom-nav">
    <a href="/activities">göra</a>
    <a href="/">vi</a>
    <a href="/settings">jag</a>
    <a href="/faq">?</a>
  </div>
</nav>

<slot />

<style>
  nav a {
    color: red;
  }

  .bottom-nav {
    color: #5856d6;
    position: fixed;
    bottom: 0;
    overflow: hidden;
    border-top: 0.5px solid #ccc;
    width: 100%;
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
    background-color: #fafafa;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>
