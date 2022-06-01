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

<div id="canvasContainer" />

<!-- <a href="/activities">Aktiviteter</a> -->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Lato&family=Roboto+Mono:wght@400;700&display=swap');

  :global(body) {
    height: 100vh;
    /* background-color: hsla(152, 43%, 93%, 1); */
  }

  /* :global(*) {
    font-family: 'Lato';
    color: #3b3b3b;
  } */
</style>
