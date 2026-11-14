"use client";
import { useEffect } from "react";

// Adds `.in` to every [data-r] once it scrolls into view (CSS does the motion). Also the "JS is alive" signal for the failsafe in layout.tsx.
export function Reveal() {
  useEffect(() => {
    document.documentElement.dataset.ready = "1";
    const els = [...document.querySelectorAll<HTMLElement>("[data-r]")];
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return null;
}
