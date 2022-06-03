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

<P5 {sketch} />

<a href="/activities">Aktiviteter</a>
