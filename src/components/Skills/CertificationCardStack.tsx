"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useAnimate, useReducedMotion } from "framer-motion";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  CERTIFICATES,
  INITIAL_DECK_ORDER,
  type Certificate,
  type CertificateId,
} from "./certificates";

type Position = {
  x: number;
  y: number;
  rotate: number;
  rotateX: number;
  rotateY: number;
  transformPerspective: number;
};
type AnimationControl = {
  finished: Promise<unknown>;
  pause: () => void;
  play: () => void;
  stop: () => void;
};

const stackPosition = (index: number): Position => {
  const offsets = [42, 26, 12, 0];
  const rotations = [0, 0, 0, 0];
  const safeIndex = Math.min(index, offsets.length - 1);

  return {
    x: offsets[safeIndex],
    y: Math.round(offsets[safeIndex] * 0.75),
    rotate: rotations[safeIndex],
    rotateX: 0,
    rotateY: 0,
    transformPerspective: 1200,
  };
};

const SHUFFLE_EASE = [0.22, 1, 0.36, 1] as const;
const VISIBLE_CARD_COUNT = 4;

export default function CertificationCardStack() {
  const [scope, animateInScope] = useAnimate<HTMLDivElement>();
  const [deckOrder, setDeckOrder] = useState<CertificateId[]>([
    ...INITIAL_DECK_ORDER,
  ]);
  const [selectedCertificateId, setSelectedCertificateId] =
    useState<CertificateId | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const deckOrderRef = useRef(deckOrder);
  const activeAnimationsRef = useRef<AnimationControl[]>([]);
  const viewerOpenRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const hasOpenedViewerRef = useRef(false);

  const selectedCertificate = CERTIFICATES.find(
    (certificate) => certificate.id === selectedCertificateId,
  );
  const isViewerOpen = selectedCertificateId !== null;

  const openViewer = useCallback(
    (certificate: Certificate, event: ReactMouseEvent<HTMLButtonElement>) => {
      triggerRef.current = event.currentTarget;
      viewerOpenRef.current = true;
      activeAnimationsRef.current.forEach((control) => control.pause());
      setSelectedCertificateId(certificate.id);
    },
    [],
  );

  const closeViewer = useCallback(() => {
    if (!viewerOpenRef.current) return;

    viewerOpenRef.current = false;
    activeAnimationsRef.current.forEach((control) => control.play());
    setSelectedCertificateId(null);
  }, []);

  useEffect(() => {
    // Skills mounts before Projects, so this capture listener can keep modal
    // scroll input away from the Projects page-scroll gate while open.
    const containViewerScroll = (event: WheelEvent | TouchEvent) => {
      if (!viewerOpenRef.current) return;

      const target = event.target;
      const isInsideDialog =
        target instanceof Node && dialogRef.current?.contains(target);

      if (!isInsideDialog) event.preventDefault();
      event.stopImmediatePropagation();
    };

    window.addEventListener("wheel", containViewerScroll, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchmove", containViewerScroll, {
      capture: true,
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", containViewerScroll, true);
      window.removeEventListener("touchmove", containViewerScroll, true);
    };
  }, []);

  useEffect(() => {
    if (!isViewerOpen) return;

    const body = document.body;
    const root = document.documentElement;
    const bodyProperties = ["overflow", "padding-right", "overscroll-behavior"] as const;
    const rootProperties = ["overflow", "overscroll-behavior"] as const;
    const originalBodyStyles = bodyProperties.map((property) => ({
      property,
      value: body.style.getPropertyValue(property),
      priority: body.style.getPropertyPriority(property),
    }));
    const originalRootStyles = rootProperties.map((property) => ({
      property,
      value: root.style.getPropertyValue(property),
      priority: root.style.getPropertyPriority(property),
    }));
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const bodyPaddingRight =
      Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    root.style.setProperty("overflow", "hidden");
    root.style.setProperty("overscroll-behavior", "none");
    body.style.setProperty("overflow", "hidden");
    body.style.setProperty("overscroll-behavior", "none");

    if (scrollbarWidth > 0) {
      body.style.setProperty(
        "padding-right",
        `${bodyPaddingRight + scrollbarWidth}px`,
      );
    }

    const restoreStyles = (
      element: HTMLElement,
      styles: Array<{ property: string; value: string; priority: string }>,
    ) => {
      styles.forEach(({ property, value, priority }) => {
        if (value) {
          element.style.setProperty(property, value, priority);
        } else {
          element.style.removeProperty(property);
        }
      });
    };

    return () => {
      restoreStyles(body, originalBodyStyles);
      restoreStyles(root, originalRootStyles);
    };
  }, [isViewerOpen]);

  useEffect(() => {
    if (!scope.current) return;

    if (shouldReduceMotion) {
      activeAnimationsRef.current.forEach((control) => control.stop());
      activeAnimationsRef.current = [];

      const order = deckOrderRef.current;
      const visibleOrder = order.slice(-VISIBLE_CARD_COUNT);
      CERTIFICATES.forEach((certificate) => {
        const index = visibleOrder.indexOf(certificate.id);
        const element = scope.current?.querySelector<HTMLElement>(
          `[data-certificate-card="${certificate.id}"]`,
        );
        if (!element) return;

        animateInScope(
          element,
          {
            ...stackPosition(Math.max(index, 0)),
            scale: 1,
            zIndex: order.indexOf(certificate.id) + 1,
          },
          { duration: 0 },
        );
      });

      return;
    }

    let cancelled = false;
    let delayId: number | undefined;

    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        delayId = window.setTimeout(resolve, duration);
      });

    const runShuffle = async () => {
      while (!cancelled) {
        await wait(650);
        if (cancelled) return;
        if (viewerOpenRef.current) continue;

        const currentOrder = deckOrderRef.current;
        const frontCardId = currentOrder[currentOrder.length - 1];
        const frontCard = scope.current?.querySelector<HTMLElement>(
          `[data-certificate-card="${frontCardId}"]`,
        );
        if (!frontCard) continue;
        const departing = animateInScope(
          frontCard,
          {
            x: 180,
            y: -32,
            rotate: 0,
            scale: 1.04,
            zIndex: CERTIFICATES.length + 1,
          },
          { duration: 0.72, ease: SHUFFLE_EASE },
        );
        activeAnimationsRef.current = [departing];
        if (viewerOpenRef.current) departing.pause();
        await departing.finished;

        if (cancelled) return;

        const nextOrder = [
          currentOrder[currentOrder.length - 1],
          ...currentOrder.slice(0, -1),
        ];
        deckOrderRef.current = nextOrder;
        setDeckOrder(nextOrder);

        const visibleOrder = nextOrder.slice(-VISIBLE_CARD_COUNT);
        const repositionAnimations = nextOrder.flatMap((certificateId) => {
          const element = scope.current?.querySelector<HTMLElement>(
            `[data-certificate-card="${certificateId}"]`,
          );
          if (!element) return [];
          const visibleIndex = visibleOrder.indexOf(certificateId);
          const position = stackPosition(Math.max(visibleIndex, 0));
          return [animateInScope(
            element,
            { ...position, scale: 1, zIndex: nextOrder.indexOf(certificateId) + 1 },
            { duration: 0.62, ease: SHUFFLE_EASE },
          )];
        });
        activeAnimationsRef.current = repositionAnimations;
        if (viewerOpenRef.current) {
          repositionAnimations.forEach((control) => control.pause());
        }
        await Promise.all(
          repositionAnimations.map((control) => control.finished),
        );

        if (cancelled) return;
        activeAnimationsRef.current = [];
      }
    };

    void runShuffle();

    return () => {
      cancelled = true;
      if (delayId !== undefined) window.clearTimeout(delayId);
      activeAnimationsRef.current.forEach((control) => control.stop());
      activeAnimationsRef.current = [];
    };
  }, [animateInScope, scope, shouldReduceMotion]);

  useEffect(() => {
    if (!selectedCertificate) {
      if (hasOpenedViewerRef.current) {
        triggerRef.current?.focus({ preventScroll: true });
        hasOpenedViewerRef.current = false;
      }
      return;
    }

    hasOpenedViewerRef.current = true;
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeViewer, selectedCertificate]);

  const modal = selectedCertificate ? (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto overscroll-contain p-3 sm:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close certificate viewer"
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-[2px]"
        onClick={closeViewer}
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-title"
        tabIndex={-1}
        data-lenis-prevent
        className="relative z-10 my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-2xl bg-[#FFFDF7] p-4 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-7"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: SHUFFLE_EASE }}
      >
        <div className="mb-4 flex items-start justify-between gap-4 sm:mb-6">
          <div className="min-w-0">
            <p className="mb-1 font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#8A3D3D]">
              {selectedCertificate.mediaType === "application/pdf"
                ? "PDF certificate"
                : "Image certificate"}
            </p>
            <h2
              id="certificate-title"
              className="font-sans text-xl font-bold text-[#292525] sm:text-2xl"
            >
              {selectedCertificate.title}
            </h2>
            {selectedCertificate.issuer && (
              <p className="mt-1 font-sans text-sm text-[#5C5555]">
                Issued by {selectedCertificate.issuer}
              </p>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close certificate viewer"
            onClick={closeViewer}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 text-2xl leading-none text-[#332F2F] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A3D3D]"
          >
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 3.5 12.5 12.5M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mb-4 flex min-h-[45dvh] w-full items-center justify-center overflow-hidden overscroll-contain rounded-xl border border-black/10 bg-white shadow-sm sm:min-h-[60dvh]">
          {selectedCertificate.mediaType === "application/pdf" ? (
            <iframe
              src={selectedCertificate.url}
              title={selectedCertificate.title}
              className="h-[55dvh] min-h-[360px] max-h-[720px] w-full"
            >
              <p className="p-6 font-sans text-sm text-[#494343]">
                This browser cannot display the PDF inline. Use Open Certificate
                to view it in a new tab.
              </p>
            </iframe>
          ) : selectedCertificate.mediaType.startsWith("image/") ? (
            <img
              src={selectedCertificate.url}
              alt={selectedCertificate.title}
              loading="lazy"
              className="max-h-[65dvh] max-w-full object-contain"
            />
          ) : (
            <p className="p-6 font-sans text-sm text-[#494343]">
              This file format cannot be previewed in the browser.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={closeViewer}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-black/15 px-5 font-sans text-sm font-semibold text-[#373232] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A3D3D]"
          >
            Close
          </button>
          {selectedCertificate.verifyUrl && (
            <a
              href={selectedCertificate.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#8A3D3D]/35 px-5 font-sans text-sm font-semibold text-[#703333] transition-colors hover:bg-[#8A3D3D]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A3D3D]"
            >
              Verify Certificate
            </a>
          )}
          <a
            href={selectedCertificate.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-black/15 px-5 font-sans text-sm font-semibold text-[#373232] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A3D3D]"
          >
            Open Certificate
          </a>
          <a
            href={selectedCertificate.url}
            download={selectedCertificate.filename}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#F8DB6A] px-5 font-sans text-sm font-bold text-[#262323] shadow-sm transition-colors hover:bg-[#F2CF49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A3D3D]"
          >
            Download Certificate
          </a>
        </div>
      </motion.div>
    </div>
  ) : null;

  return (
    <div
      ref={scope}
      className="relative mt-[40px] h-[390px] w-full max-w-full overflow-visible max-[1100px]:h-[260px] max-[767px]:mx-auto max-[767px]:mt-6 max-[767px]:h-[390px]"
    >
      {CERTIFICATES.map((certificate) => {
        const deckIndex = deckOrder.indexOf(certificate.id);
        const visibleOrder = deckOrder.slice(-VISIBLE_CARD_COUNT);
        const visibleIndex = visibleOrder.indexOf(certificate.id);
        const isVisible = visibleIndex >= 0;
        const position = stackPosition(Math.max(visibleIndex, 0));
        const fileType =
          certificate.mediaType === "application/pdf" ? "PDF file" : "Image file";
        const faceColor = certificate.design === "red"
          ? "#F0E7E9"
          : certificate.design === "gray"
            ? "#F1EFE8"
            : "#E9EFEC";

        return (
          <motion.button
            key={certificate.id}
            type="button"
            data-certificate-card={certificate.id}
            aria-label={`Open certificate: ${certificate.title}. File: ${certificate.filename}`}
            aria-haspopup="dialog"
            onClick={(event) => openViewer(certificate, event)}
            className={`absolute left-[2%] top-0 h-auto aspect-[1.5] w-[min(445px,73%)] overflow-hidden rounded-[16px] border border-[#242424] p-0 text-left focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#242020] ${isVisible ? "visible" : "invisible pointer-events-none"}`}
            style={{
              x: position.x,
              y: position.y,
              rotate: position.rotate,
              rotateX: 0,
              rotateY: 0,
              transformPerspective: 1200,
              scale: 1,
              zIndex: deckIndex + 1,
              boxShadow: "4px 5px 0 #1a1a1a",
              backgroundColor: certificate.cardColor,
            }}
            initial={false}
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-[4px] rounded-[12px] border border-black/20" style={{ backgroundColor: faceColor }} />
            <span className="relative flex h-full flex-col justify-between p-5 max-[500px]:p-4">
              <span className="flex items-center justify-between gap-2">
                <span
                  className="font-mono text-[13px] uppercase tracking-[0.18em] text-[#292929]"
                >
                  Certificate
                </span>
                <span aria-hidden="true" className="grid grid-cols-2 gap-[2px] p-[1px]">
                  <span className="size-[4px] bg-black" /><span className="size-[4px] bg-black" />
                  <span className="size-[4px] bg-black" /><span className="size-[4px] bg-black" />
                </span>
              </span>

              <span className="block max-w-[90%] text-[#111111]">
                <span className="block line-clamp-2 font-[family-name:var(--font-jersey-15)] text-[clamp(21px,1.65vw,31px)] leading-[0.95]">
                  {certificate.title}
                </span>
                {certificate.issuer && (
                  <span className="mt-2 block truncate font-mono text-[10px] uppercase tracking-wide text-black/65">
                    {certificate.issuer}
                  </span>
                )}
              </span>

              <span className="flex items-end justify-between gap-2">
                <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-[#292929]">
                  {fileType}
                </span>
                <span aria-hidden="true" className="mr-2 h-3 w-3 rotate-45 border-r-2 border-t-2 border-black" />
              </span>
            </span>
          </motion.button>
        );
      })}

      <div className="absolute right-0 top-[340px] flex items-start gap-3 font-mono text-[12px] uppercase leading-[1.5] tracking-[0.12em] text-black/75 max-[1100px]:top-[190px] max-[767px]:top-[340px]">
        <span>CONTINUOUS<br />LEARNING...</span>
      </div>

      {modal && typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </div>
  );
}
