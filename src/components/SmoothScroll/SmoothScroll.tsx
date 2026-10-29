"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { registerPageLenis } from "@/lib/smoothScroll";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.1,
      wheelMultiplier: 1,
      anchors: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });
    const unregister = registerPageLenis(lenis);

    return () => {
      unregister();
      lenis.destroy();
    };
  }, []);

  return null;
}
