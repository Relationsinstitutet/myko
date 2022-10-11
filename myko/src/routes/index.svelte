<script lang="ts">
  import CotimeInfo from '$lib/components/cotime/CotimeInfo.svelte';
  import type { Cotime } from '$lib/models/activity';

  import { reducedMotion } from 'svelte-reduced-motion';

  import P5 from 'p5-svelte';
  import type { Sketch, p5 } from 'p5-svelte';
  import type { Element } from 'p5';
  import { preload, setup, draw, windowResized } from '$lib/visualisation/sketch'; //

  const sketch: Sketch = (p5: p5) => {
    /**/ p5.preload = () => {
      preload(p5);
    };
    p5.setup = async () => {
      canvas = await setup(p5);
      showSnapshotButton = true;
    };
    p5.draw = () => {
      draw(p5);
    };
    p5.windowResized = () => {
      windowResized(p5);
    };
  };

  const takeSnapshot = () => {
    const buffer = p5Ref.createGraphics(p5Ref.width, p5Ref.height);
    buffer.copy(
      // source
      canvas,
      // source x, y, w, h
      0,
      0,
      p5Ref.width,
      p5Ref.height,
      // destination x, y, w, h
      0,
      0,
      buffer.width,
      buffer.height
    );

    buffer.textFont('Roboto Mono');
    buffer.fill(255, 255, 255);
    buffer.textSize(32);

    const textOffset = 20;
    const now = new Date();
    const dateText = now.toLocaleString();
    buffer.text(dateText, textOffset, buffer.height - textOffset);

    const shortDate = now.toLocaleString('sv-SE', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
    p5Ref.saveCanvas(buffer, `myko_${shortDate}`, 'png');
  };

  const storeInstance = (event: CustomEvent<p5>) => {
    p5Ref = event.detail;
  };

  export let nextUpcomingCotime: Cotime | undefined = undefined;
  let p5Ref: p5;
  let canvas: Element;
  let showSnapshotButton = false;
</script>

<main>
  {#if nextUpcomingCotime}
    <CotimeInfo cotime={nextUpcomingCotime} />
  {/if}

  <!--<h1>Myko</h1>-->

  {#if $reducedMotion}
    <p>
      Hej! Du har önskat mindre rörelse när du surfar, bakom här är vår visualisering som kan bli
      lite vild, men om du vill kolla på den får du stänga av det i inställningarna på din enhet.
      Det brukar heta Reduce motion eller liknande.
    </p>
  {:else}
    <P5 {sketch} on:instance={storeInstance} />

    {#if showSnapshotButton}
      <button on:click={takeSnapshot}>Snaphot!</button>
    {/if}
  {/if}
</main>

<style>
  main {
    /*background-image: url('/flowfield(4).png');
    background-repeat: repeat-y;
    background-size: cover;*/
    background: var(--ocean-800);
    align-items: center;
    padding: 70px 0 192px;
  }

  p {
    font-size: var(--20px);
    color: var(--grey-050);
  }

  @media (min-width: 45rem) {
    /*h1 {
      text-align: center;
    }*/
  }
</style>
