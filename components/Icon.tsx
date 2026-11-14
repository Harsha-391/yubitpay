// Figma SVG icons live in one inline sprite (components/sprite.generated.ts) so they cost zero extra requests.
export function Icon({ n, w, h = w, className }: { n: string; w: number; h?: number; className?: string }) {
  return (
    <svg className={className} style={{ width: `calc(${w} * var(--u))`, height: `calc(${h} * var(--u))`, flex: "none" }} aria-hidden="true" focusable="false">
      <use href={`#${n}`} />
    </svg>
  );
}
