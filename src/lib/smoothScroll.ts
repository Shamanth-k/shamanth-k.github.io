import type Lenis from "lenis";

let pageLenis: Lenis | null = null;

export function registerPageLenis(instance: Lenis) {
  pageLenis = instance;
  return () => {
    if (pageLenis === instance) pageLenis = null;
  };
}

export function stopPageLenis() {
  if (!pageLenis || pageLenis.isStopped) return;
  pageLenis.scrollTo(window.scrollY, { immediate: true });
  pageLenis.stop();
}

export function startPageLenis() {
  if (!pageLenis || !pageLenis.isStopped) return;
  pageLenis.start();
  pageLenis.scrollTo(window.scrollY, { immediate: true });
}

export function cancelPageLenisScroll() {
  pageLenis?.scrollTo(window.scrollY, { immediate: true, force: true });
}

export function scrollPageTo(top: number) {
  if (pageLenis) {
    pageLenis.scrollTo(top, {
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    return;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({ top, behavior: reduceMotion ? "instant" : "smooth" });
}

export function scrollPageInstantlyTo(top: number) {
  if (!pageLenis) {
    window.scrollTo({ top, behavior: "instant" });
    return;
  }

  const wasStopped = pageLenis.isStopped;
  if (wasStopped) pageLenis.start();
  pageLenis.scrollTo(top, { immediate: true });
  if (wasStopped) pageLenis.stop();
}
