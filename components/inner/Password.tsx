"use client";
import { useState } from "react";

// Figma "Password visibility control": a 44px "Show" button inside the field. Its label stays "Show" (the only state
// Figma draws); aria-pressed carries the state, and the password itself becoming readable is the visible feedback.
export function Password({ id, placeholder, autoComplete }: { id: string; placeholder: string; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="pw">
      <input id={id} className="p2-input" name="password" type={show ? "text" : "password"} autoComplete={autoComplete} placeholder={placeholder} required />
      <button type="button" className="pw-btn" aria-pressed={show} aria-controls={id} aria-label="Show password" onClick={() => setShow(!show)}>Show</button>
    </span>
  );
}
