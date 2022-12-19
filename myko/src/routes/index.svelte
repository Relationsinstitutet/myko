<script lang="ts">
  import CotimeInfo from '$lib/components/cotime/CotimeInfo.svelte';
  import type { Cotime } from '$lib/models/activity';

  import { reducedMotion } from 'svelte-reduced-motion';

  import P5 from 'p5-svelte';
  import type { Sketch, p5 } from 'p5-svelte';
  import type { Element } from 'p5';
  import { preload, setup, draw, windowResized } from '$lib/visualisation/sketch'; //
  import { onDestroy } from 'svelte';

  const sketch: Sketch = (p5: p5) => {
    p5.preload = () => {
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

  onDestroy(() => {
    if (p5Ref) {
      p5Ref.remove();
    }
  });

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

    buffer.rectMode(p5Ref.CENTER);
    const cutOutCenterX = buffer.width * 0.5;
    const cutOutCenterY = 125;
    const cutOutWidth = 250;
    const cutOutheight = 38;

    buffer.fill(229, 245, 238);
    buffer.noStroke();
    buffer.rect(cutOutCenterX, cutOutCenterY, cutOutWidth, cutOutheight);

    const now = new Date();
    const dateText = now.toLocaleString();
    buffer.textFont('Roboto Mono');
    buffer.fill(59, 59, 59);
    buffer.textSize(18);
    buffer.textAlign(p5Ref.CENTER, p5Ref.CENTER);
    buffer.text(dateText, cutOutCenterX, cutOutCenterY, cutOutWidth, cutOutheight);
    const title = 'M Y K O';
    buffer.fill(255, 255, 255);
    buffer.textSize(30);
    buffer.text(title, cutOutCenterX, cutOutCenterY - 40, cutOutWidth, cutOutheight);

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
      <div class="wrapper">
        <button on:click={takeSnapshot}>Snapshot!</button>
      </div>
    {/if}
  {/if}
</main>

<style>
  main {
    background: var(--ocean-800);
    align-items: center;
    padding: 70px 0 192px;
  }

  p {
    background: var(--ocean-800);
    background-image: url('/flowfield.png');
    background-repeat: repeat-y;
    min-width: 85%;
    min-height: 54vh;
    padding: 50px 4%;
    background-size: cover;
    font-size: var(--20px);
    color: var(--grey-050);
  }

  button {
    height: fit-content;
  }

  .wrapper {
    position: fixed;
    bottom: 0;
    margin-bottom: 72px;
    display: flex;
    justify-content: right;
    width: 100%;
    left: 0;
    padding: 8px;
    z-index: 1;
  }

  @media (min-width: 45rem) {
    p {
      padding: 50px 20%;
    }
  }
</style>
