// The nav turns light over light surfaces. Sections say so with data-tone; a pinned scene that changes colour while it is
// pinned (the homepage story) answers for itself through this hook instead.
export const toneAt: { current: ((probeY: number) => string | null) | null } = { current: null };
