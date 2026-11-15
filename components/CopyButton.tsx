"use client";
import { useState } from "react";
import { Icon } from "./Icon";

// Copy-to-clipboard with visible and spoken feedback (success or failure).
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const copy = () => {
    const done = (k: "ok" | "fail") => { setCopied(k); setTimeout(() => setCopied(""), 1600); };
    if (!navigator.clipboard) return done("fail");
    navigator.clipboard.writeText(text).then(() => done("ok"), () => done("fail"));
  };
  return (
    <>
      <button type="button" className="copy-btn" data-state={copied} onClick={copy} aria-label="Copy code">
        <Icon n={copied === "ok" ? "check" : "copy"} w={16} />
      </button>
      <span className="copy-tip mono" role="status">{copied === "ok" ? "Copied" : copied === "fail" ? "Couldn’t copy" : ""}</span>
    </>
  );
}
