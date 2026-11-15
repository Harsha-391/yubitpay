import type Lenis from "lenis";

// Flow.tsx owns the Lenis instance; the phone menu needs it to lock scrolling while open.
export const lenisRef: { current: Lenis | null } = { current: null };
