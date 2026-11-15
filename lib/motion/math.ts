export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const seg = (s: number, a: number, b: number) => clamp((s - a) / (b - a)); // 0→1 while s goes a→b
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - (1 - t) ** 3;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
export const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
// Document position from layout alone (offsetTop chain): unlike docTop it ignores transforms, so it is safe to read
// while another scene has the element scaled or moved. Not for elements inside a sticky parent.
export const layoutTop = (el: HTMLElement) => { let y = 0; for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop; return y; };
