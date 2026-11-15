// Change-only writer: a value is written to the DOM only when it differs from the last one written to that element,
// so a scroll frame that changes nothing costs nothing. Every scroll-driven style or attribute goes through one of these.
export function createPut() {
  const seen = new WeakMap<Element, Record<string, string>>();
  return {
    put(el: Element | null, k: string, v: string, attr = false) {
      if (!el) return;
      const c = seen.get(el) ?? {};
      if (c[k] === v) return;
      c[k] = v; seen.set(el, c);
      if (attr) el.setAttribute(k, v); else (el as HTMLElement).style.setProperty(k, v);
    },
    forget(el: Element) { seen.delete(el); }, // after something else changed the element (e.g. a new viewBox)
  };
}
