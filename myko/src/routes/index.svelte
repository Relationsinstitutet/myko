<svelte:head>
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js"
    integrity="sha512-NxocnqsXP3zm0Xb42zqVMvjQIktKEpTIbCXXyhBPxqGZHqhcOXHs4pXI/GoZ8lE+2NJONRifuBpi9DxC58L0Lw=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer">
  </script>
  <script src="/sketch.js"></script>
  <script src="/class.js"></script>
</svelte:head>

<main>
  <h1>Myko</h1>
  <div id="canvasContainer" />
</main>

<style>
  main {
    background-color: var(--ocean-800);
    height: 100vh;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 48px;
  }

  h1 {
    font-family: 'Roboto Mono', monospace;
    font-weight: 400;
    text-transform: uppercase;
    font-size: var(--20px);
    color: var(--grey-050);
  }
</style>
