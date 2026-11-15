import { Fragment } from "react";

// Heading words fill in with scroll: opacity comes from the panel's --enter (set by Flow.tsx), so the line reads as it rises.
export function Words({ lines, className }: { lines: string[]; className: string }) {
  let w = 0;
  const n = lines.join(" ").split(" ").length;
  return (
    <h2 className={`${className} words`} style={{ "--n": n } as React.CSSProperties}>
      {lines.map((l, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {l.split(" ").map((word, k) => (
            <span key={k} className="w" style={{ "--w": w++ } as React.CSSProperties}>{word} </span>
          ))}
        </Fragment>
      ))}
    </h2>
  );
}
