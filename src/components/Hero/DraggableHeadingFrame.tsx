"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

type Position = { x: number; y: number };

export default function DraggableHeadingFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<Position>({ x: 0, y: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    position: Position;
    rect: { left: number; right: number; top: number; bottom: number };
  } | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const hero = frame?.closest<HTMLElement>("#home");
    if (!frame || !hero) return;

    const keepInsideHero = () => {
      const frameRect = frame.getBoundingClientRect();
      if (!frameRect.width || !frameRect.height) return;
      const heroRect = hero.getBoundingClientRect();
      const parent = frame.parentElement;
      const parentRect = parent?.getBoundingClientRect();
      const scaleX = parent && parentRect && parent.offsetWidth ? parentRect.width / parent.offsetWidth : 1;
      const scaleY = parent && parentRect && parent.offsetHeight ? parentRect.height / parent.offsetHeight : 1;
      const dx = Math.max(heroRect.left - frameRect.left, Math.min(0, heroRect.right - frameRect.right));
      const dy = Math.max(heroRect.top - frameRect.top, Math.min(0, heroRect.bottom - frameRect.bottom));

      if (dx || dy) {
        positionRef.current.x += dx / scaleX;
        positionRef.current.y += dy / scaleY;
        frame.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;
      }
    };

    const observer = new ResizeObserver(keepInsideHero);
    observer.observe(hero);
    observer.observe(frame);
    window.addEventListener("resize", keepInsideHero);

    return () => {
      document.body.classList.remove("heading-moving");
      observer.disconnect();
      window.removeEventListener("resize", keepInsideHero);
    };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    document.body.classList.add("heading-moving");
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      position: { ...positionRef.current },
      rect: (() => {
        const rect = event.currentTarget.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
      })(),
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const frame = frameRef.current;
    const hero = frame?.closest<HTMLElement>("#home");
    if (!drag || drag.pointerId !== event.pointerId || !frame || !hero) return;

    event.preventDefault();
    const heroRect = hero.getBoundingClientRect();
    const parent = frame.parentElement;
    const parentRect = parent?.getBoundingClientRect();
    const scaleX = parent && parentRect && parent.offsetWidth ? parentRect.width / parent.offsetWidth : 1;
    const scaleY = parent && parentRect && parent.offsetHeight ? parentRect.height / parent.offsetHeight : 1;
    const desiredX = event.clientX - drag.startX;
    const desiredY = event.clientY - drag.startY;
    const dx = Math.max(heroRect.left - drag.rect.left, Math.min(desiredX, heroRect.right - drag.rect.right));
    const dy = Math.max(heroRect.top - drag.rect.top, Math.min(desiredY, heroRect.bottom - drag.rect.bottom));

    positionRef.current = {
      x: drag.position.x + dx / scaleX,
      y: drag.position.y + dy / scaleY,
    };
    frame.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    document.body.classList.remove("heading-moving");
  };

  return (
    <div
      ref={frameRef}
      role="group"
      aria-label="Draggable hero heading"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      className={`relative touch-none select-none cursor-move ${className ?? ""}`}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 border border-[#D0D0D0]"
      >
        <span className="absolute -left-[4px] -top-[4px] h-[7px] w-[7px] border border-[#D0D0D0] bg-white" />
        <span className="absolute left-1/2 -top-[4px] h-[7px] w-[7px] -translate-x-1/2 border border-[#D0D0D0] bg-white" />
        <span className="absolute -right-[4px] -top-[4px] h-[7px] w-[7px] border border-[#D0D0D0] bg-white" />
        <span className="absolute -left-[4px] top-1/2 h-[7px] w-[7px] -translate-y-1/2 border border-[#D0D0D0] bg-white" />
        <span className="absolute -right-[4px] top-1/2 h-[7px] w-[7px] -translate-y-1/2 border border-[#D0D0D0] bg-white" />
        <span className="absolute -bottom-[4px] -left-[4px] h-[7px] w-[7px] border border-[#D0D0D0] bg-white" />
        <span className="absolute -bottom-[4px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 border border-[#D0D0D0] bg-white" />
        <span className="absolute -bottom-[4px] -right-[4px] h-[7px] w-[7px] border border-[#D0D0D0] bg-white" />
      </div>
    </div>
  );
}
