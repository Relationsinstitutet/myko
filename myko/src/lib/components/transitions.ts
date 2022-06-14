import { cubicOut } from 'svelte/easing';
import type { EasingFunction, TransitionConfig } from 'svelte/types/runtime/transition';

type FlyParams = {
  delay?: number;
  duration?: number;
  easing?: EasingFunction;
  x?: number | string;
  y?: number | string;
  opacity?: number;
};
/*
 * Drop in replacement for built-in fly with support for units (particularly `%`)
 * derived from: https://github.com/sveltejs/svelte/pull/6050
 */
export function fly(
  node: Element,
  { delay = 0, duration = 0, easing = cubicOut, x = 0, y = 0, opacity = 0 }: FlyParams
): TransitionConfig {
  const style = getComputedStyle(node);
  const targetOpacity = +style.opacity;
  const transform = style.transform === 'none' ? '' : style.transform;

  const od = targetOpacity * (1 - opacity);

  let xValue = 0;
  let xUnit = 'px';
  if (typeof x === 'number') {
      xValue = x;
  } else {
    const xMatch = x.match(/([-\d.]+)(\D+)/);
    if (xMatch !== null && xMatch.length === 3) {
      xValue = Number(xMatch[1]);
      xUnit = xMatch[2];
    }
  }

  let yValue = 0;
  let yUnit = 'px';
  if (typeof y === 'number') {
      yValue = y;
  } else {
    const yMatch = y.match(/([-\d.]+)(\D+)/);
    console.log(yMatch)
    if (yMatch !== null && yMatch.length === 3) {
      yValue = Number(yMatch[1]);
      yUnit = yMatch[2];
    }
  }

  return {
    delay,
    duration,
    easing,
    css: (t, u) =>
      `transform: ${transform} translate(${(1 - t) * xValue}${xUnit}, ${(1 - t) * yValue}${yUnit});
	   opacity: ${targetOpacity - od * u}`,
  };
}
