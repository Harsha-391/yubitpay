// Link label that rolls up to a copy of itself on hover (gokiwi's data-text labels). CSS in sections.css (.roll).
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll" data-text={children}>
      <span>{children}</span>
    </span>
  );
}
