"use client";

import { useEffect, useRef } from "react";

const roles = [
  { label: "DEVOPS", color: "#16A34A", start: [0.12, 0.2] },
  { label: "UI DESIGNER", color: "#7C3AED", start: [0.82, 0.22] },
  { label: "UX DESIGNER", color: "#DB2777", start: [0.08, 0.76] },
  { label: "DEVELOPER", color: "#2563EB", start: [0.84, 0.78] },
  { label: "BENGALURU, IN", color: "#EA580C", start: [0.48, 0.12] },
  { label: "GRAPHIC DESIGNER", color: "#0891B2", start: [0.9, 0.52] },
] as const;

type Point = { x: number; y: number };
type LabelMotion = {
  element: HTMLDivElement;
  position: Point;
  from: Point;
  to: Point;
  startedAt: number;
  duration: number;
  width: number;
  height: number;
};

const random = (min: number, max: number) => min + Math.random() * (max - min);

export default function FloatingRoleLabels() {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motions: LabelMotion[] = [];
    let frame = 0;
    let bounds = boundary.getBoundingClientRect();

    const isInHeadingZone = (point: Point, width: number, height: number) => {
      const centerX = point.x + width / 2;
      const centerY = point.y + height / 2;
      const nx = (centerX - bounds.width / 2) / (bounds.width * 0.39);
      const ny = (centerY - bounds.height * 0.48) / (bounds.height * 0.34);
      return nx * nx + ny * ny < 1;
    };

    const chooseDestination = (motion: LabelMotion): Point => {
      const maxX = Math.max(0, bounds.width - motion.width);
      const maxY = Math.max(0, bounds.height - motion.height);
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const candidate = { x: random(0, maxX), y: random(0, maxY) };
        if (!isInHeadingZone(candidate, motion.width, motion.height)) return candidate;
      }
      return { x: random(0, maxX), y: random(0, maxY) };
    };

    const beginTravel = (motion: LabelMotion, now: number) => {
      motion.from = motion.position;
      motion.to = chooseDestination(motion);
      motion.startedAt = now;
      motion.duration = random(2800, 4200);
    };

    const resize = () => {
      bounds = boundary.getBoundingClientRect();
      const now = performance.now();
      motions.forEach((motion) => {
        motion.width = motion.element.offsetWidth;
        motion.height = motion.element.offsetHeight;
        motion.position.x = Math.min(motion.position.x, Math.max(0, bounds.width - motion.width));
        motion.position.y = Math.min(motion.position.y, Math.max(0, bounds.height - motion.height));
        motion.element.style.transform = `translate3d(${motion.position.x}px, ${motion.position.y}px, 0)`;
      beginTravel(motion, now + random(0, 250));
      });
    };

    roles.forEach((role, index) => {
      const element = labelRefs.current[index];
      if (!element) return;
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const position = {
        x: Math.min((role.start[0] + random(-0.06, 0.06)) * bounds.width, Math.max(0, bounds.width - width)),
        y: Math.min((role.start[1] + random(-0.06, 0.06)) * bounds.height, Math.max(0, bounds.height - height)),
      };
      const motion: LabelMotion = {
        element,
        position,
        from: position,
        to: position,
        startedAt: 0,
        duration: 1,
        width,
        height,
      };
      element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      motions.push(motion);
    });

    const now = performance.now();
    motions.forEach((motion, index) => {
      beginTravel(motion, now + index * random(100, 250));
    });

    const animate = (time: number) => {
      motions.forEach((motion) => {
        if (time < motion.startedAt) return;
        const progress = Math.min(1, (time - motion.startedAt) / motion.duration);
        const eased = progress * progress * (3 - 2 * progress);
        motion.position.x = motion.from.x + (motion.to.x - motion.from.x) * eased;
        motion.position.y = motion.from.y + (motion.to.y - motion.from.y) * eased;
        motion.element.style.transform = `translate3d(${motion.position.x}px, ${motion.position.y}px, 0)`;
        if (progress >= 1) beginTravel(motion, time);
      });
      frame = window.requestAnimationFrame(animate);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(boundary);
    resize();
    if (!reduceMotion.matches) frame = window.requestAnimationFrame(animate);

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      window.cancelAnimationFrame(frame);
      if (!event.matches) frame = window.requestAnimationFrame(animate);
    };
    reduceMotion.addEventListener("change", onMotionPreferenceChange);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      reduceMotion.removeEventListener("change", onMotionPreferenceChange);
    };
  }, []);

  return (
    <div ref={boundaryRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[56px] bottom-0 z-[30] overflow-hidden">
      {roles.map((role, index) => (
        <div
          key={role.label}
          ref={(element) => { labelRefs.current[index] = element; }}
          className="absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-[5px] px-2.5 py-1.5 font-[family-name:var(--font-ui)] text-[11px] font-bold leading-none tracking-[0.04em] text-white shadow-sm max-[767px]:px-2 max-[767px]:py-1.5 max-[767px]:text-[9px]"
          style={{ backgroundColor: role.color, willChange: "transform" }}
        >
          {role.label}
          <svg
            aria-hidden="true"
            className="absolute -top-[18px] left-[7px] h-[20px] w-[16px] overflow-visible"
            viewBox="0 0 104 136"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 7C11.3 4.1 6.8 6.7 6.8 11.4L5.7 123.1C5.6 128.3 10.8 130.7 14.8 127.1L54.5 91.3L94.2 89.8C100 89.6 102.1 83.7 98 79.7L15 7Z"
              fill={role.color}
              stroke="white"
              strokeWidth="12"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
