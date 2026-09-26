import { useEffect, type DependencyList } from 'react';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const easeIn = (value: number) => value * value;

/**
 * Publishes `--pull-in` (0 → 1 as an element sinks toward the bottom of the viewport)
 * and `--pull-out` (0 → 1 as it rises past the top) on every `[data-pull]` element.
 * Styles read those variables on descendants, so the measured element must stay untransformed.
 */
export function useScrollPull(deps: DependencyList) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-pull]'));
    const visible = new Set<HTMLElement>();
    let frame = 0;

    const update = () => {
      frame = 0;
      const half = window.innerHeight / 2;
      for (const item of visible) {
        const rect = item.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2 - half) / (half + rect.height / 2);
        item.style.setProperty('--pull-in', easeIn(clamp((progress - 0.05) / 0.9)).toFixed(4));
        item.style.setProperty('--pull-out', easeIn(clamp((-progress - 0.15) / 0.85)).toFixed(4));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const item = entry.target as HTMLElement;
        if (entry.isIntersecting) visible.add(item); else visible.delete(item);
      }
      schedule();
    }, { rootMargin: '25% 0px' });
    items.forEach(item => observer.observe(item));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, deps);
}
