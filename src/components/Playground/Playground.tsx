"use client";

import { useEffect, useRef } from "react";

const playgroundItems = [
  {
    title: "Music Widget",

    subtitle: "Windows Desktop Utility",

    version: "V1.0.0",

    description:
      "A lightweight floating music widget that automatically detects Windows media sessions and displays album artwork, track information, playback progress, and media controls.",

    tags: ["Electron", "React", "TypeScript", "C#", ".NET 8", "GSMTC"],

    platform: "WINDOWS • DESKTOP",
  },
];

/* ============================================================

   HANGING D

   ============================================================

   - Fixed bottom-right ink pivot.

   - Rotation only.

   - No translation.

   - Starts slightly clockwise tilted.

   - Falls toward REST_DEG.

   - Resets when Playground leaves viewport.

   - Replays when Playground re-enters viewport.

   ============================================================ */

const REST_DEG = -180;

const REST = (REST_DEG * Math.PI) / 180;

/*

 * Initial position of D.

 *

 * Positive = clockwise.

 *

 * Change this value if you want more/less initial tilt.

 */

const START_DEG = 15;

const START = (START_DEG * Math.PI) / 180;

const GRAVITY = 28;

const DAMPING = 0.6;

const AIR_DRAG = 1.5;

const RESTITUTION = 0.35;

const CONTACT_COUPLING = 0.5;

const MAX_OMEGA = 18;

const HIT_PAD = 6;

const SUBSTEP = 1 / 240;

const START_DELAY_MS = 100;

/* ============================================================

   MEASURE ACTUAL D INK

   ============================================================ */

function measureInk(el: HTMLElement) {
  const ctx = document.createElement("canvas").getContext("2d");

  if (!ctx) return null;

  const cs = getComputedStyle(el);

  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

  const m = ctx.measureText("D");

  return {
    left: m.actualBoundingBoxLeft,

    right: m.actualBoundingBoxRight,

    ascent: m.actualBoundingBoxAscent,
  };
}

/* ============================================================

   HANGING D

   ============================================================ */

function HangingD() {
  const anchorRef = useRef<HTMLSpanElement>(null);

  const glyphRef = useRef<HTMLSpanElement>(null);

  const probeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const anchor = anchorRef.current;

    const glyph = glyphRef.current;

    const probe = probeRef.current;

    if (!anchor || !glyph || !probe) {
      return;
    }

    let raf = 0;

    let timer = 0;

    let cancelled = false;

    let inPlayground = false;

    let animationRunning = false;

    /* ========================================================

       PHYSICS STATE

       ======================================================== */

    /*

     * IMPORTANT:

     *

     * The D starts at START rather than 0.

     *

     * START_DEG = +8 degrees clockwise.

     */

    let theta = START;

    let omega = 0;

    let acc = 0;

    let last = performance.now();

    let prevX: number | null = null;

    let prevY: number | null = null;

    let vx = 0;

    let vy = 0;

    /* ========================================================

       REDUCED MOTION

       ======================================================== */

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* ========================================================

       APPLY ROTATION

       ======================================================== */

    const apply = (thetaValue: number) => {
      glyph.style.transform = `rotate(${(thetaValue * 180) / Math.PI}deg)`;
    };

    /* ========================================================

       D INK / PIVOT DATA

       ======================================================== */

    let ink = {
      w: 0,

      h: 0,

      pivotX: 0,

      pivotY: 0,
    };

    /* ========================================================

       MEASURE D / PIVOT

       ======================================================== */

    const measure = () => {
      const m = measureInk(glyph);

      if (!m || m.left + m.right < 10 || m.ascent < 10) {
        return;
      }

      const baseline =
        probe.getBoundingClientRect().top - glyph.getBoundingClientRect().top;

      ink = {
        w: m.left + m.right,

        h: m.ascent,

        pivotX: m.right,

        pivotY: baseline,
      };

      glyph.style.transformOrigin = `${ink.pivotX}px ${ink.pivotY}px`;
    };

    /* ========================================================

       POINTER

       ======================================================== */

    const ptr = {
      x: -1e5,

      y: -1e5,

      has: false,
    };

    const onPointerMove = (e: PointerEvent) => {
      ptr.x = e.clientX;

      ptr.y = e.clientY;

      ptr.has = true;
    };

    const onPointerLeave = () => {
      ptr.has = false;
    };

    window.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });

    document.addEventListener("pointerleave", onPointerLeave);

    /* ========================================================

       RESET

       ========================================================

       IMPORTANT:

       Reset is NOT zero degrees anymore.

       It resets to the slightly clockwise tilted

       starting position.

       ======================================================== */

    const resetD = () => {
      animationRunning = false;

      window.clearTimeout(timer);

      theta = START;

      omega = 0;

      acc = 0;

      last = performance.now();

      prevX = null;

      prevY = null;

      vx = 0;

      vy = 0;

      apply(START);
    };

    /* ========================================================

       PHYSICS LOOP

       ======================================================== */

    const tick = (now: number) => {
      if (cancelled) {
        return;
      }

      if (!animationRunning || !inPlayground) {
        raf = 0;

        return;
      }

      const dt = Math.min(Math.max((now - last) / 1000, 0.001), 0.05);

      last = now;

      /* ------------------------------------------------------

         CURSOR VELOCITY

         ------------------------------------------------------ */

      if (ptr.has && prevX !== null && prevY !== null) {
        vx += ((ptr.x - prevX) / dt - vx) * 0.5;

        vy += ((ptr.y - prevY) / dt - vy) * 0.5;
      } else {
        vx *= 0;

        vy *= 0;
      }

      prevX = ptr.has ? ptr.x : null;

      prevY = ptr.has ? ptr.y : null;

      /* ------------------------------------------------------

         CURSOR VS D COLLISION

         ------------------------------------------------------ */

      if (ptr.has) {
        const a = anchor.getBoundingClientRect();

        const px = a.left + ink.pivotX;

        const py = a.top + ink.pivotY;

        const dx = ptr.x - px;

        const dy = ptr.y - py;

        const c = Math.cos(theta);

        const s = Math.sin(theta);

        const lx = dx * c + dy * s;

        const ly = -dx * s + dy * c;

        const inside =
          lx > -ink.w - HIT_PAD &&
          lx < HIT_PAD &&
          ly > -ink.h - HIT_PAD &&
          ly < HIT_PAD;

        if (inside) {
          const dist = Math.hypot(dx, dy);

          const r = Math.max(dist, 14);

          /*

           * Tangent direction for

           * clockwise rotation.

           */

          const tx = -dy / (dist || 1);

          const ty = dx / (dist || 1);

          const vCursor = vx * tx + vy * ty;

          const vBody = omega * r;

          const rel = vCursor - vBody;

          if (Math.abs(vCursor) > 30 && rel * vCursor > 0) {
            omega += ((1 + RESTITUTION) * rel * CONTACT_COUPLING) / r;

            omega = Math.max(-MAX_OMEGA, Math.min(MAX_OMEGA, omega));
          }
        }
      }

      /* ------------------------------------------------------

         PENDULUM PHYSICS

         ------------------------------------------------------ */

      acc += dt;

      while (acc >= SUBSTEP) {
        const phi = theta - REST;

        const alpha =
          -2 * GRAVITY * Math.sin(phi / 2) -
          DAMPING * omega -
          AIR_DRAG * Math.abs(omega) * omega;

        omega += alpha * SUBSTEP;

        theta += omega * SUBSTEP;

        /* ----------------------------------------------------

           EXACT RESTING POSITION

           ---------------------------------------------------- */

        const restError = theta - REST;

        if (Math.abs(restError) < 0.01 && Math.abs(omega) < 0.08) {
          theta = REST;

          omega = 0;
        }

        acc -= SUBSTEP;
      }

      apply(theta);

      raf = requestAnimationFrame(tick);
    };

    /* ========================================================

       START ANIMATION

       ======================================================== */

    const startAnimation = () => {
      if (cancelled) {
        return;
      }

      /*

       * Start from the tilted

       * original position.

       */

      theta = START;

      omega = 0;

      acc = 0;

      last = performance.now();

      prevX = null;

      prevY = null;

      vx = 0;

      vy = 0;

      apply(START);

      /* ------------------------------------------------------

         REDUCED MOTION

         ------------------------------------------------------ */

      if (reduceMotion) {
        theta = REST;

        omega = 0;

        apply(REST);

        return;
      }

      /* ------------------------------------------------------

         DELAY BEFORE FALL

         ------------------------------------------------------ */

      timer = window.setTimeout(() => {
        if (cancelled || !inPlayground) {
          return;
        }

        animationRunning = true;

        last = performance.now();

        if (!raf) {
          raf = requestAnimationFrame(tick);
        }
      }, START_DELAY_MS);
    };

    /* ========================================================

       VIEWPORT OBSERVER

       ======================================================== */

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          /*

           * Already inside.

           * Do nothing.

           */

          if (inPlayground) {
            return;
          }

          inPlayground = true;

          startAnimation();
        } else {
          /*

           * Already outside.

           * Do nothing.

           */

          if (!inPlayground) {
            return;
          }

          inPlayground = false;

          /*

           * Reset to the

           * slightly clockwise

           * starting position.

           */

          resetD();

          if (raf) {
            cancelAnimationFrame(raf);

            raf = 0;
          }
        }
      },

      {
        threshold: 0.35,
      },
    );

    /* ========================================================

       INITIALIZE

       ======================================================== */

    const init = async () => {
      try {
        await document.fonts.ready;
      } catch {
        // Ignore font loading failure.
      }

      if (cancelled) {
        return;
      }

      measure();

      /*

       * Initial page state:

       * D is already tilted slightly

       * clockwise.

       */

      resetD();

      /*

       * Keep observer alive so the

       * animation can replay.

       */

      observer.observe(anchor);
    };

    init();

    /* ========================================================

       CLEANUP

       ======================================================== */

    return () => {
      cancelled = true;

      observer.disconnect();

      window.clearTimeout(timer);

      if (raf) {
        cancelAnimationFrame(raf);
      }

      window.removeEventListener("pointermove", onPointerMove);

      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <span
      ref={anchorRef}
      className="relative ml-[-8px] inline-block translate-y-[24px] max-[700px]:ml-[-3px] max-[700px]:translate-y-[8px]"
    >
      {/*

        Rotating D.

        The transform origin is

        measured again from the actual

        font ink.

      */}

      <span
        ref={glyphRef}
        data-hanging-d
        className="

          block

          select-none

          will-change-transform

          font-[family-name:var(--font-jersey-15)]

          text-[151px]
          max-[700px]:text-[clamp(34px,10.7vw,61px)]

          leading-[145px]

          tracking-[-3px]
          max-[700px]:leading-[0.9]
          max-[700px]:tracking-[-1px]

          text-[#111111]

        "
        style={{
          transformOrigin: "100% 100%",
        }}
      >
        D
        <span
          ref={probeRef}
          aria-hidden
          className="

            inline-block

            h-0

            w-0

            align-baseline

          "
        />
      </span>
    </span>
  );
}

/* ============================================================

   PLAYGROUND CARD

   ============================================================ */

function PlaygroundCard({ item }: { item: (typeof playgroundItems)[number] }) {
  return (
    <article
      className="
        relative
        box-border
        h-[174px]
        max-[700px]:h-auto
        max-[700px]:min-h-[220px]
        w-full
        max-w-[586px]
        overflow-hidden
        rounded-[8px]
        border-[1.5px]
        border-[#111111]
        bg-white
        shadow-[4px_4px_0_#000000]
        transition-transform
        duration-200
        hover:-translate-y-[2px]
      "
    >
      <div
        className="
          flex
          h-full
          max-[700px]:h-auto
          max-[700px]:min-h-[220px]
          w-full
          flex-col
          items-start
          gap-[10px]
          px-[18px]
          pb-[14px]
          pt-[16px]
          max-[700px]:gap-3
          max-[700px]:px-3
          max-[700px]:py-3
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            h-[36px]
            max-[700px]:h-auto
            max-[700px]:min-h-[40px]
            w-full
            items-center
            justify-between
            max-[700px]:flex-wrap
            max-[700px]:items-start
            max-[700px]:gap-y-2
          "
        >
          <div
            className="
              flex
              h-[36px]
              items-center
              gap-[10px]
            "
          >
            <div
              className="
                flex
                h-[36px]
                w-[36px]
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#111111]
              "
            >
              <span
                className="
                  h-[14px]
                  w-[14px]
                  rounded-full
                  border-[3px]
                  border-[#FAF8F3]
                  bg-[#F8DB6A]
                "
              />
            </div>

            <div
              className="
                flex
                flex-col
                items-start
                gap-[1px]
              "
            >
              <h3
                className="
                  m-0
                  font-[family-name:var(--font-poppins)]
                  text-[14px]
                  max-[700px]:text-[16px]
                  font-bold
                  leading-[17px]
                  text-[#111111]
                "
              >
                {item.title}
              </h3>

              <p
                className="
                  m-0
                  font-[family-name:var(--font-poppins)]
                  text-[10px]
                  max-[700px]:text-[12px]
                  max-[700px]:leading-[15px]
                  font-normal
                  leading-[12px]
                  text-[#555555]
                "
              >
                {item.subtitle}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              h-[17px]
              items-center
              gap-[6px]
              max-[700px]:ml-[46px]
              max-[700px]:h-auto
              max-[700px]:w-full
              max-[700px]:flex-wrap
              max-[700px]:gap-x-2
              max-[700px]:gap-y-2
            "
          >
            <span
              className="
                box-border
                flex
                h-[17px]
                items-start
                rounded-[20px]
                border
                border-[#111111]
                bg-[#B5F2AB]
                px-[8px]
                py-[3px]
                font-[family-name:var(--font-poppins)]
                text-[9px]
                max-[700px]:h-[22px]
                max-[700px]:px-[10px]
                max-[700px]:py-[4px]
                max-[700px]:text-[11px]
                max-[700px]:leading-[13px]
                font-semibold
                uppercase
                leading-[11px]
                text-[#111111]
              "
            >
              {item.version}
            </span>

            <span
              className="
                box-border
                flex
                h-[17px]
                items-start
                rounded-[20px]
                border
                border-[#111111]
                bg-[#F8DB6A]
                px-[8px]
                py-[3px]
                font-[family-name:var(--font-poppins)]
                text-[9px]
                max-[700px]:h-[22px]
                max-[700px]:px-[10px]
                max-[700px]:py-[4px]
                max-[700px]:text-[11px]
                max-[700px]:leading-[13px]
                font-semibold
                uppercase
                leading-[11px]
                text-[#111111]
              "
            >
              DOWNLOADABLE
            </span>

            <span
              className="
                ml-[8px]
                whitespace-nowrap
                font-[family-name:var(--font-poppins)]
                text-[9px]
                max-[700px]:text-[11px]
                max-[700px]:leading-[14px]
                font-medium
                uppercase
                leading-[11px]
                text-[#888888]
              "
            >
              {item.platform}
            </span>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px w-full shrink-0 bg-[#E8E8E8]" />

        {/* DESCRIPTION */}
        <p
          className="
            m-0
            min-h-[26px]
            h-auto
            w-full
            font-[family-name:var(--font-poppins)]
            text-[11px]
            max-[700px]:text-[13px]
            font-normal
            leading-[13px]
            max-[700px]:leading-[18px]
            text-[#333333]
          "
        >
          {item.description}
        </p>

        {/* BOTTOM ROW */}
        <div
          className="
            mt-auto
            flex
            h-[24px]
                max-[700px]:h-auto
                max-[700px]:flex-wrap
                max-[700px]:gap-3
                max-[700px]:items-start
            w-full
            items-center
            justify-between
          "
        >
          <div
            className="
              flex
              h-[17px]
              items-start
              gap-[5px]
            max-[700px]:h-auto
            max-[700px]:max-w-full
            max-[700px]:flex-wrap
            max-[700px]:gap-x-2
            max-[700px]:gap-y-2
            "
          >
            {item.tags.map((tag) => {
              const tagClass =
                tag === "React"
                  ? "border-[#111111] bg-[#9DD9F2] text-[#111111]"
                  : tag === "TypeScript"
                    ? "border-[#111111] bg-[#F2A7B5] text-[#111111]"
                    : "border-[#DDDDDD] bg-[#F5F5F5] text-[#444444]";

              return (
                <span
                  key={tag}
                  className={`
                    box-border
                    flex
                    h-[17px]
                    items-start
                    rounded-[4px]
                    border
                    px-[7px]
                    py-[3px]
                    font-[family-name:var(--font-poppins)]
                    text-[9px]
                    max-[700px]:h-[22px]
                    max-[700px]:px-2
                    max-[700px]:py-[4px]
                    max-[700px]:text-[10px]
                    max-[700px]:leading-[12px]
                    font-medium
                    leading-[11px]
                    ${tagClass}
                  `}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          <div
            className="
              flex
              h-[24px]
              items-center
              gap-[8px]
              max-[700px]:h-auto
              max-[700px]:gap-2
              max-[700px]:ml-auto
            "
          >
            <a
              href="https://github.com/Shamanth-k/music-widget"
              className="
                box-border
                flex
                h-[24px]
                w-[63px]
                max-[700px]:h-[34px]
                max-[700px]:w-[78px]
                items-start
                justify-center
                rounded-[5px]
                border
                border-[#111111]
                bg-white
                px-[12px]
                py-[6px]
                font-[family-name:var(--font-poppins)]
                text-[10px]
                max-[700px]:text-[12px]
                max-[700px]:leading-[16px]
                font-semibold
                uppercase
                leading-[12px]
                text-[#111111]
                transition-colors
                hover:bg-[#F8DB6A]
              "
            >
              GITHUB
            </a>

            <a
              href="https://github.com/Shamanth-k/music-widget/releases/tag/v1.0.0"
              className="
                box-border
                flex
                h-[24px]
                w-[89px]
                max-[700px]:h-[34px]
                max-[700px]:w-[104px]
                items-start
                justify-center
                rounded-[5px]
                border
                border-[#111111]
                bg-[#111111]
                px-[14px]
                py-[6px]
                font-[family-name:var(--font-poppins)]
                text-[10px]
                max-[700px]:text-[12px]
                max-[700px]:leading-[16px]
                font-bold
                uppercase
                leading-[12px]
                text-[#F8DB6A]
                transition-colors
                hover:bg-[#222222]
              "
            >
              DOWNLOAD
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ============================================================

   PLAYGROUND

   ============================================================ */

export default function Playground() {
  return (
    <section
      id="playground"
      className="

        relative

        mx-auto

        w-full

        max-w-[1240px]

        px-[20px]

        pb-[100px]
        max-[700px]:px-4
        max-[700px]:pb-8

      "
    >
      {/* ======================================================

          PLAYGROUND TITLE

         ====================================================== */}

      <div
        data-scroll-reveal
        className="

          relative

          mt-20

          h-[330px]
          max-[700px]:mt-6
          max-[700px]:h-[142px]

          w-full

        "
      >
        <div
          aria-label="PLAYGROUND"
          className="

            playground-title

            absolute

            left-1/2

            top-0

            flex

            -translate-x-1/2

            items-start

            justify-center

            whitespace-nowrap

          "
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          {/* P */}

          <span
            className="

              relative

              inline-block

              font-[family-name:var(--font-jersey-15)]

              text-[350px]
              max-[700px]:text-[clamp(78px,25vw,142px)]

              leading-[190px]

              tracking-[-20px]

              text-[#111111]

              -rotate-[4deg]

              translate-y-[-70px]
              max-[700px]:leading-[0.55]
              max-[700px]:tracking-[-5px]
              max-[700px]:translate-y-[clamp(-28px,-5vw,-16px)]

            "
          >
            P
          </span>

          {/* L */}

          <span
            className="

              relative

              ml-[-42px]

              inline-block

              font-[family-name:var(--font-jersey-15)]

              text-[128px]
              max-[700px]:text-[clamp(29px,9.1vw,52px)]

              leading-[130px]

              tracking-[-2px]

              text-[#111111]

              rotate-[1deg]

              translate-y-[33px]
              max-[700px]:leading-[0.9]
              max-[700px]:tracking-[-1px]
              max-[700px]:ml-[-16px]
              max-[700px]:translate-y-[10px]

              z-[2]

            "
          >
            L
          </span>

          {/* A */}

          <span
            className="

              relative

              ml-[6px]

              inline-block

              font-[family-name:var(--font-jersey-15)]

              text-[172px]
              max-[700px]:text-[clamp(39px,12.3vw,70px)]

              leading-[160px]

              tracking-[-3px]

              text-[#111111]

              -rotate-[3deg]

              translate-y-[3px]
              max-[700px]:leading-[0.9]
              max-[700px]:tracking-[-1px]
              max-[700px]:ml-[2px]
              max-[700px]:translate-y-[2px]

            "
          >
            A
          </span>

          {/* Y */}

          <span
            className="

              relative

              ml-[6px]

              inline-block

              font-[family-name:var(--font-jersey-15)]

              text-[143px]
              max-[700px]:text-[clamp(32px,10.2vw,59px)]

              leading-[140px]

              tracking-[-3px]

              text-[#111111]

              rotate-[3deg]

              translate-y-[30px]
              max-[700px]:leading-[0.9]
              max-[700px]:tracking-[-1px]
              max-[700px]:ml-[2px]
              max-[700px]:translate-y-[7px]

            "
          >
            Y
          </span>

          {/* G */}

          <span
            className="

              relative

              ml-[7px]

              inline-block

              font-[family-name:var(--font-jersey-15)]

              text-[181px]
              max-[700px]:text-[clamp(41px,11.9vw,68px)]

              leading-[168px]

              tracking-[-3px]

              text-[#111111]

              -rotate-[2deg]

              translate-y-[-7px]
              max-[700px]:leading-[0.9]
              max-[700px]:tracking-[-1px]
              max-[700px]:ml-[2px]
              max-[700px]:translate-y-[-2px]

            "
          >
            G
          </span>

          {/* R */}

          <span
            className="

              relative

              ml-[6px]

              inline-block

              font-[family-name:var(--font-jersey-15)]

              text-[137px]
              max-[700px]:text-[clamp(31px,9vw,51px)]

              leading-[135px]

              tracking-[-2px]

              text-[#111111]

              rotate-[5deg]

              translate-y-[28px]
              max-[700px]:leading-[0.9]
              max-[700px]:tracking-[-1px]
              max-[700px]:ml-[2px]
              max-[700px]:translate-y-[6px]

            "
          >
            R
          </span>

          {/* O */}

          <span
            className="

              relative

              ml-[6px]

              inline-block

              font-[family-name:var(--font-jersey-15)]

              text-[190px]
              max-[700px]:text-[clamp(43px,13vw,74px)]

              leading-[175px]

              tracking-[-4px]

              text-[#111111]

              -rotate-[4deg]

              translate-y-[-1px]
              max-[700px]:leading-[0.9]
              max-[700px]:tracking-[-1px]
              max-[700px]:ml-[2px]
              max-[700px]:translate-y-[-1px]

            "
          >
            O
          </span>

          {/* U */}

          <span
            className="

              relative

              ml-[7px]

              inline-block

              font-[family-name:var(--font-jersey-15)]

              text-[131px]
              max-[700px]:text-[clamp(29px,9vw,51px)]

              leading-[132px]

              tracking-[-2px]

              text-[#111111]

              rotate-[7deg]

              translate-y-[38px]
              max-[700px]:leading-[0.9]
              max-[700px]:tracking-[-1px]
              max-[700px]:ml-[2px]
              max-[700px]:translate-y-[8px]

            "
          >
            U
          </span>

          {/* N */}

          <span
            className="

              relative

              ml-[6px]

              inline-block

              font-[family-name:var(--font-jersey-15)]

              text-[166px]
              max-[700px]:text-[clamp(38px,11.3vw,64px)]

              leading-[158px]

              tracking-[-3px]

              text-[#111111]

              -rotate-[7deg]

              translate-y-[12px]
              max-[700px]:leading-[0.9]
              max-[700px]:tracking-[-1px]
              max-[700px]:ml-[2px]
              max-[700px]:translate-y-[3px]

            "
          >
            N
          </span>

          {/* D */}

          <HangingD />
        </div>

        {/* ====================================================

            JUST FOR FUN

           ==================================================== */}

        <div
          className="

            absolute

            left-[500px]
            max-[700px]:left-1/2

            top-[163px]
            max-[700px]:top-[91px]

            -translate-x-1/2

            rotate-[-4deg]

            text-center

          "
        >
          <span
            className="

              whitespace-nowrap

              font-[family-name:var(--font-just-another-hand)]

              text-[30px]
              max-[700px]:text-[26px]
              max-[700px]:leading-[28px]

              leading-[32px]

              tracking-[0.8px]

              text-[#111111]

            "
          >
            just for fun
          </span>

          <img
            src="/arrows/heading-underline.svg"
            alt=""
            loading="lazy"
            className="

    pointer-events-none

    absolute

    left-[70px]
    max-[700px]:left-1/2

    top-[26px]
    max-[700px]:top-[22px]

    h-[16px]

    w-[115px]
    max-[700px]:h-[12px]
    max-[700px]:w-[90px]

    -translate-x-1/2

  "
          />
        </div>
      </div>

      {/* ======================================================

          PLAYGROUND CARDS

         ====================================================== */}

      <div
        data-scroll-reveal
        className="

          grid

          grid-cols-2

          gap-x-[26px]

          gap-y-[26px]

          max-[1250px]:grid-cols-1
          max-[700px]:gap-y-4

        "
      >
        {playgroundItems.map((item, index) => (
          <PlaygroundCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}
