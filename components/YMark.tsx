// The Y mark (the logo triangle flipped, plus its stem): the shape the hero story ends on.
export function YMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 15" aria-hidden="true">
      <path d="M0.2 0.4 L9.8 0.4 L5 8.6 Z" fill="currentColor" />
      <rect x="3.9" y="7" width="2.2" height="7.6" fill="currentColor" />
    </svg>
  );
}
