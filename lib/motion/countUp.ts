const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const ease = (t: number) => 1 - (1 - t) ** 3;

// ₹ amount counts up from 0 (writes textContent only; the box is sized by its final value, so nothing reflows around it).
export function countUp(node: HTMLElement, to: number, ms = 1200) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { node.textContent = `₹${fmt.format(to)}`; return; }
  const t0 = performance.now();
  const step = (t: number) => { const k = Math.min(1, (t - t0) / ms); node.textContent = `₹${fmt.format(to * ease(k))}`; if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
