"use client";

import { useEffect, useRef } from "react";

type ScrollColorParagraphProps = {
  className?: string;
  openingEmphasis: string;
  continuation: TextPart[];
};

type TextPart = { text: string; italic?: boolean };

const MUTED = [146, 146, 146] as const;
const REVEALED = [17, 17, 17] as const;
const WORDS_PER_REVEAL = 3;

export default function ScrollColorParagraph({
  className = "",
  openingEmphasis,
  continuation,
}: ScrollColorParagraphProps) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const renderWords = (copy: string, region: string) => {
    let wordIndex = 0;
    return copy.split(/(\s+)/).map((token, tokenIndex) => {
      if (!token || /^\s+$/.test(token)) return token;
      return (
        <span key={`${region}-${wordIndex++}-${tokenIndex}`} data-about-word>
          {token}
        </span>
      );
    });
  };

  const renderParts = (parts: TextPart[], region: string) =>
    parts.map((part, partIndex) => {
      const content = renderWords(part.text, `${region}-${partIndex}`);
      return part.italic ? (
        <em key={`${region}-${partIndex}`} className="about-copy-emphasis">
          {content}
        </em>
      ) : (
        <span key={`${region}-${partIndex}`}>{content}</span>
      );
    });

  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (!paragraph) return;

    const words = Array.from(
      paragraph.querySelectorAll<HTMLElement>("[data-about-word]"),
    );
    if (words.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopPin = window.matchMedia("(min-width: 768px)");
    const track = paragraph.closest<HTMLElement>("[data-about-scroll-track]");
    const stickyContent = paragraph.closest<HTMLElement>("[data-about-sticky]");
    let frame = 0;

    const paintProgress = () => {
      frame = 0;
      if (reduceMotion.matches) {
        words.forEach((word) => {
          word.style.color = "rgb(17, 17, 17)";
        });
        return;
      }

      let progress: number;
      if (desktopPin.matches && track && stickyContent) {
        const trackRect = track.getBoundingClientRect();
        const stickyTop =
          Number.parseFloat(getComputedStyle(stickyContent).top) || 0;
        const scrollRange = Math.max(
          track.offsetHeight - stickyContent.offsetHeight,
          1,
        );
        progress = (stickyTop - trackRect.top) / scrollRange;
      } else {
        const rect = paragraph.getBoundingClientRect();
        const travel = Math.max(window.innerHeight + rect.height, 1);
        progress = (window.innerHeight - rect.top) / travel;
      }
      progress = Math.max(0, Math.min(1, progress));

      const revealGroupCount = Math.ceil(words.length / WORDS_PER_REVEAL);
      const revealPosition = progress * revealGroupCount;

      words.forEach((word, index) => {
        const groupIndex = Math.floor(index / WORDS_PER_REVEAL);
        const rawAmount = Math.max(
          0,
          Math.min(1, revealPosition - groupIndex),
        );
        // Reveal a short phrase at a time so the highlight advances in
        // readable steps, while still easing smoothly with scroll position.
        const amount = rawAmount * rawAmount * (3 - 2 * rawAmount);
        const color = MUTED.map((start, channel) =>
          Math.round(start + (REVEALED[channel] - start) * amount),
        );
        word.style.color = `rgb(${color.join(", ")})`;
      });
    };

    const schedulePaint = () => {
      if (frame === 0) frame = window.requestAnimationFrame(paintProgress);
    };

    const resizeObserver = new ResizeObserver(schedulePaint);
    resizeObserver.observe(paragraph);
    if (track) resizeObserver.observe(track);
    if (stickyContent) resizeObserver.observe(stickyContent);
    window.addEventListener("scroll", schedulePaint, { passive: true });
    window.addEventListener("resize", schedulePaint, { passive: true });
    reduceMotion.addEventListener("change", schedulePaint);
    desktopPin.addEventListener("change", schedulePaint);
    schedulePaint();

    return () => {
      window.removeEventListener("scroll", schedulePaint);
      window.removeEventListener("resize", schedulePaint);
      reduceMotion.removeEventListener("change", schedulePaint);
      desktopPin.removeEventListener("change", schedulePaint);
      resizeObserver.disconnect();
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <p ref={paragraphRef} className={`about-scroll-copy ${className}`}>
      <strong className="font-bold">{renderWords(openingEmphasis, "lead")}</strong>{" "}
      {renderParts(continuation, "continuation")}
    </p>
  );
}
