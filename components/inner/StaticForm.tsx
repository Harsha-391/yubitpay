"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../Icon";

/*
  The Figma forms are static ("This is a static form example; it does not send data"), so nothing leaves the page:
  the browser checks the fields; an invalid submit outlines what to fix ([data-tried] in inner.css, plus the `.form-fail`
  notice among the children), a valid one swaps the form for `done`. The submit button stays disabled until hydrated,
  so without JS the form can't submit at all and personal details never end up in a URL.
    go    open this page on a valid submit instead (contact → its success page)
    busy  show this button label for a moment first (the auth specimens' loading state)
    keep  keep the form and show `done` below the button (the auth specimens: "Keep the form visible while submitting")
*/
export function StaticForm({ label, done, go, busy, keep, after, className, children }: { label: string; done?: React.ReactNode; go?: string; busy?: string; keep?: boolean; after?: React.ReactNode; className?: string; children: React.ReactNode }) {
  const [state, setState] = useState<"idle" | "tried" | "busy" | "done">("idle");
  const [ready, setReady] = useState(false);
  const router = useRouter();
  useEffect(() => setReady(true), []);
  const finish = () => (go ? router.push(go) : setState("done"));
  if (state === "done" && !keep) return <div className={`${className ?? ""} form-done`} role="status">{done}</div>;
  return (
    <form
      className={className} noValidate data-tried={state === "tried" || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        if (state === "busy") return;
        if (!f.checkValidity()) { setState("tried"); f.querySelector<HTMLElement>(":invalid")?.focus(); return; }
        if (busy) { setState("busy"); setTimeout(finish, 900); } else finish();
      }}
    >
      {children}
      <button type="submit" className="btn btn-lime" disabled={!ready} aria-busy={state === "busy" || undefined}>
        {state === "busy" ? busy : label}<Icon n="arrow-up-right-dark" w={18} />
      </button>
      {keep && state === "done" && <div className="form-done" role="status">{done}</div>}
      {after}
    </form>
  );
}
