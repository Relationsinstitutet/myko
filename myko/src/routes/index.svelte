<script lang="ts">
  import CotimeInfo from '$lib/components/cotime/CotimeInfo.svelte';
  import type { Cotime } from '$lib/models/activity';

  import P5 from 'p5-svelte';
  import type { Sketch, p5 } from 'p5-svelte';
  import { setup, draw, windowResized } from '$lib/visualisation/sketch';

  let reduce = false;

  const sketch: Sketch = (p5: p5) => {
    p5.setup = () => {
      setup(p5);
    };
    p5.draw = () => {
      draw(p5);
    };
    /*if (!reduce) {
      p5.draw = () => {
        draw(p5, !reduce);
      };
    } else {
      p5.draw = () => {
        draw(p5, reduce);
      };
    }*/
    p5.windowResized = () => {
      windowResized(p5);
    };
  };

  /*const sketchLogo: Sketch = (p5: p5) => {
    p5.setup = () => {
      setup(p5);
    };
    p5.draw = () => {
      draw(p5);
    };
  };*/

  export let nextUpcomingCotime: Cotime | undefined = undefined;
</script>

<main>
  {#if nextUpcomingCotime}
    <CotimeInfo cotime={nextUpcomingCotime} />
  {/if}

  <h1>Myko</h1>

  <!--<P5 {sketchLogo}-->
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
    padding-bottom: 192px;
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
  }
</style>
