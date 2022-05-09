<script>
  // @ts-nocheck

  import { onMount } from 'svelte';

  function p5Sketch() {
    const sketch = (p) => {
      let x = 0;
      let y = 0;
      let size = 15;
      let threshold = 0;

      p.setup = function() {
        const c = p.createCanvas(700, 410);
        c.parent('canvasContainer');
      };

      p.draw = function() {
        // TODO replace with 'art' visualization
        p.stroke(1);
        threshold = p.random(0.75);

        if (threshold < 0.1) p.line(x, y, x + size, y + size);
        else if (0.505 > threshold > 0.5) p.line(x, y, x, y + size);
        else p.line(x, y + size, x + size, y);

        x = x + size;
        if (x > p.width) {
          x = 0;
          y = y + size;
        }
      };
    };

    new p5(sketch);
  }

  onMount(p5Sketch);
</script>

<svelte:head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js"
          integrity="sha512-NxocnqsXP3zm0Xb42zqVMvjQIktKEpTIbCXXyhBPxqGZHqhcOXHs4pXI/GoZ8lE+2NJONRifuBpi9DxC58L0Lw=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer">
  </script>
</svelte:head>

<div id="canvasContainer"></div>

<a href="/activities">Aktiviteter</a>
