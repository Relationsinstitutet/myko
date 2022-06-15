<script lang="ts">
  import P5 from 'p5-svelte';
  import type { Sketch, p5 } from 'p5-svelte';
  import { setup, draw } from '$lib/visualisation/sketch';

  const sketch: Sketch = (p5: p5) => {
    p5.setup = () => {
      setup(p5);
    };
    p5.draw = () => {
      draw(p5);
    };
  };
</script>

<main>
  <h1>Myko</h1>

  <div class="p5" />
  <P5 {sketch} />
</main>

<style>
  main {
    background-color: var(--ocean-800);
    min-height: 100vh;
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
  @media (min-width: 45rem) {
    h1 {
      text-align: center;
    }
    /*.m-0 {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: center;
    }
    .p5Canvas {
      width: 500px;
    }*/
  }
</style>
