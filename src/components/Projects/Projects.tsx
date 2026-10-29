"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  isNavbarNavigating,
  NAVBAR_NAVIGATION_END,
  NAVBAR_NAVIGATION_START,
} from "@/lib/navigation";
import {
  scrollPageInstantlyTo,
  startPageLenis,
  stopPageLenis,
} from "@/lib/smoothScroll";

const projects = [
  {
    number: "01",
    title: "Gamification of Digital Laws",
    description:
      "A project exploring the use of gamification to make digital laws more engaging and accessible.",
    tech: "",
    githubUrl: "https://github.com/Shamanth-k/Gamification_DigitalLaws",
    liveUrl: null,
  },
  {
    number: "02",
    title: "Passwordless Authentication System",
    description:
      "A secure passwordless authentication system using WebAuthn and FIDO2 for biometric and public-key based login.",
    tech: "REACT · NODE.JS · WEBAUTHN · FIDO2 · EXPRESS",
    githubUrl:
      "https://github.com/Shamanth-k/passwordless-password-authentication-system",
    liveUrl: null,
    images: [
      "register.jpg",
      "pass key.jpg",
      "login success.jpg",
      "home sceen.jpg",
      "authentication.jpg",
    ].map(
      (file) => `/project-images/password%20less/${encodeURIComponent(file)}`,
    ),
  },
  {
    number: "03",
    title: "Cloud Media Gallery",
    description:
      "A cloud-based media gallery for managing images and videos with scalable AWS S3 storage.",
    tech: "REACT · NODE.JS · MONGODB · EXPRESS · AWS S3",
    githubUrl: "https://github.com/Shamanth-k/cloud-gallery",
    liveUrl: null,
    images: ["upload image.jpg", "login.jpg", "gallery.jpg"].map(
      (file) => `/project-images/cloud-gallery/${encodeURIComponent(file)}`,
    ),
  },
  {
    number: "04",
    title: "Art Gallery Management System",
    description:
      "A full-stack platform for managing artists, exhibitions, artwork and gallery operations with secure authentication.",
    tech: "REACT · NODE.JS · SQL · EXPRESS · AUTH",
    githubUrl: "https://github.com/Shamanth-k/Art-gallery",
    liveUrl: null,
    images: [
      "admin exhibition page.jpg",
      "admin artist page.jpg",
      "add exhibition.jpg",
      "add artist.jpg",
      "all exhibition page.jpg",
      "all artist page.jpg",
      "buy ticket.jpg",
      "home screen.jpg",
      "signup page.jpg",
      "my tickets.jpg",
      "login page.jpg",
    ].map((file) => `/project-images/art-gallery/${encodeURIComponent(file)}`),
  },
  {
    number: "05",
    title: "E-commerce Website for Handicrafts",
    description:
      "An online marketplace for handicrafts with dynamic products, shopping cart functionality and payment integration.",
    tech: "REACT · NODE.JS · MONGODB · EXPRESS · PAYMENT",
    githubUrl: "https://github.com/Shamanth-k/Roots-Tech",
    liveUrl: null,
  },
  {
    number: "06",
    title: "Hostel Room Booking System",
    description:
      "A hostel accommodation platform for checking room availability, managing bookings and handling accommodation data.",
    tech: "REACT · NODE.JS · MONGODB · EXPRESS",
    githubUrl: "https://github.com/Shamanth-k/hostel-room-booking",
    liveUrl: null,
  },
  {
    number: "07",
    title: "LifeLine — Emergency Healthcare",
    description:
      "An emergency healthcare platform connecting patients, ambulances and hospitals for faster emergency response.",
    tech: "REACT · NODE.JS · MONGODB · EXPRESS",
    githubUrl: "https://github.com/Shamanth-k/emergency-health-care-webapp-",
    liveUrl: null,
    images: [
      "patient page.jpg",
      "hospital page.jpg",
      "homepage.jpg",
      "ambulance page.jpg",
    ].map(
      (file) =>
        `/project-images/lifeline%20project%20images/${encodeURIComponent(file)}`,
    ),
  },
  {
    number: "08",
    title: "Personal Developer Portfolio",
    description:
      "A responsive developer portfolio showcasing projects, technical skills, experience and creative work.",
    tech: "REACT · TAILWIND CSS · RESPONSIVE · NETLIFY",
    githubUrl: "https://github.com/Shamanth-k/portfolio",
    liveUrl: "https://shamanth-prfolio.netlify.app/",
  },
  {
    number: "09",
    title: "AI Blog Generator",
    description:
      "An AI-powered application that generates editable long-form blog content from short user prompts.",
    tech: "REACT · NODE.JS · EXPRESS · HUGGING FACE · LLM",
    githubUrl: "https://github.com/Shamanth-k/Blog-generator",
    liveUrl: null,
  },
];

// Desktop scroll advances through the intro panel, then each project panel.
const GROUP_COUNT = projects.length + 1;
const LAST_GROUP_INDEX = GROUP_COUNT - 1;
const ENTRY_READ_PAUSE_MS = 650;

const WHEEL_INPUT_GRACE_MS = 500;
const TOUCH_INPUT_GRACE_MS = 1200;
const JUMP_KEY_GRACE_MS = 1500;
const NATIVE_JUMP_THRESHOLD = 40;
const PIN_EPSILON = 1;
const DESKTOP_QUERY = "(min-width: 1024px)";

type Project = (typeof projects)[number];
type GallerySelection = { project: Project; imageIndex: number };
type ProjectsControllerState = "normal" | "pinned" | "navbar";
type ScrollDirection = "down" | "up";
const projectImages = (project: Project) => project.images ?? [];
const projectCategory = (project: Project) =>
  project.tech.includes("LLM")
    ? "AI Application"
    : project.title.includes("Emergency")
      ? "Healthcare Platform"
      : project.title.includes("Authentication")
        ? "Security · Authentication"
        : project.title.includes("Gallery")
          ? "Full-stack Platform"
          : project.title.includes("Portfolio")
            ? "Portfolio"
            : "Web Application";

function updateProjectCoverTilt(
  event: ReactPointerEvent<HTMLDivElement>,
  reset = false,
) {
  const card = event.currentTarget;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const touchLayout = window.matchMedia("(hover: none)").matches;
  if (reset || reducedMotion || touchLayout || event.pointerType === "touch") {
    card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    return;
  }

  const bounds = card.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return;

  const horizontal = Math.max(
    0,
    Math.min(1, (event.clientX - bounds.left) / bounds.width),
  );
  const vertical = Math.max(
    0,
    Math.min(1, (event.clientY - bounds.top) / bounds.height),
  );
  const rotateX = (0.5 - vertical) * 6;
  const rotateY = (horizontal - 0.5) * 6;
  card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
}

function scrollInstantlyTo(top: number) {
  scrollPageInstantlyTo(top);
}

/* True when the wheel/touch started inside the expanded card's own scroller AND it can still scroll that way. */
function innerScrollerCanScroll(
  target: EventTarget | null,
  direction: ScrollDirection,
) {
  if (!(target instanceof Element)) return false;
  const scroller = target.closest<HTMLElement>("[data-projects-scroll]");
  if (!scroller) return false;
  const max = scroller.scrollHeight - scroller.clientHeight;
  if (max <= 1) return false;
  return direction === "down"
    ? scroller.scrollTop < max - 1
    : scroller.scrollTop > 1;
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const editorialTrackRef = useRef<HTMLDivElement | null>(null);
  const editorialStepRef = useRef(0);
  const [editorialStep, setEditorialStep] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  const activeGroupRef = useRef(0);
  const targetGroupRef = useRef(0);
  const progressFrameRef = useRef<number | null>(null);
  const [activeGroup, setActiveGroup] = useState(0);
  const [, setControllerStateValue] =
    useState<ProjectsControllerState>("normal");
  const controllerStateRef = useRef<ProjectsControllerState>("normal");
  const lastScrollYRef = useRef<number | null>(null);
  const galleryOpenRef = useRef(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const selectedProjectRef = useRef<Project | null>(null);
  const caseStudyExitTimerRef = useRef<number | null>(null);
  const [isCaseStudyExiting, setIsCaseStudyExiting] = useState(false);
  const [gallerySelection, setGallerySelection] =
    useState<GallerySelection | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasEntered(true);
      },
      { threshold: 0.08 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = editorialTrackRef.current;
    if (!track) return;

    const measure = () => {
      const firstSlide = track.firstElementChild as HTMLElement | null;
      if (!firstSlide) return;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      // Measure layout width, not the transformed bounding box. The reveal
      // rotation expands getBoundingClientRect() and compounds track drift.
      const step = firstSlide.offsetWidth + gap;
      editorialStepRef.current = step;
      setEditorialStep(step);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    if (track.firstElementChild) observer.observe(track.firstElementChild);
    window.addEventListener("resize", measure);
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const setControllerState = useCallback(
    (nextState: ProjectsControllerState) => {
      const previousState = controllerStateRef.current;
      if (previousState !== "pinned" && nextState === "pinned") {
        stopPageLenis();
      } else if (previousState === "pinned" && nextState !== "pinned") {
        startPageLenis();
      }
      controllerStateRef.current = nextState;
      setControllerStateValue(nextState);
    },
    [],
  );

  const setGroup = useCallback((group: number) => {
    if (progressFrameRef.current !== null) {
      window.cancelAnimationFrame(progressFrameRef.current);
      progressFrameRef.current = null;
    }
    activeGroupRef.current = group;
    targetGroupRef.current = group;
    setActiveGroup(group);
  }, []);

  const changeGroup = useCallback(
    (progress: number) => {
      if (controllerStateRef.current !== "pinned") return;
      targetGroupRef.current = Math.max(
        0,
        Math.min(LAST_GROUP_INDEX, progress),
      );
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setGroup(targetGroupRef.current);
        return;
      }
      if (progressFrameRef.current !== null) return;

      const animateProgress = () => {
        const difference = targetGroupRef.current - activeGroupRef.current;
        if (Math.abs(difference) < 0.001) {
          activeGroupRef.current = targetGroupRef.current;
          setActiveGroup(targetGroupRef.current);
          progressFrameRef.current = null;
          return;
        }

        const nextProgress = activeGroupRef.current + difference * 0.28;
        activeGroupRef.current = nextProgress;
        setActiveGroup(nextProgress);
        progressFrameRef.current =
          window.requestAnimationFrame(animateProgress);
      };

      progressFrameRef.current = window.requestAnimationFrame(animateProgress);
    },
    [setGroup],
  );

  const openProject = useCallback((project: Project) => {
    if (caseStudyExitTimerRef.current !== null) {
      window.clearTimeout(caseStudyExitTimerRef.current);
      caseStudyExitTimerRef.current = null;
    }
    setIsCaseStudyExiting(false);
    selectedProjectRef.current = project;
    setSelectedProject(project);
  }, []);
  const closeProject = useCallback(() => {
    if (!selectedProjectRef.current || caseStudyExitTimerRef.current !== null) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      selectedProjectRef.current = null;
      setSelectedProject(null);
      setIsCaseStudyExiting(false);
      return;
    }

    setIsCaseStudyExiting(true);
    const exitDuration = window.matchMedia("(max-width: 767px)").matches
      ? 360
      : 450;
    caseStudyExitTimerRef.current = window.setTimeout(() => {
      caseStudyExitTimerRef.current = null;
      selectedProjectRef.current = null;
      setSelectedProject(null);
      setIsCaseStudyExiting(false);
    }, exitDuration);
  }, []);

  useEffect(
    () => () => {
      if (caseStudyExitTimerRef.current !== null) {
        window.clearTimeout(caseStudyExitTimerRef.current);
      }
    },
    [],
  );

  /*
   * ==========================================================
   * LIGHTBOX SCROLL LOCK
   * ==========================================================
   */
  useEffect(() => {
    if (!gallerySelection) return;
    galleryOpenRef.current = true;

    const originalY = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    // Measure BEFORE hiding overflow; afterwards the scrollbar is gone and this reads 0.
    const scrollbarGap = window.innerWidth - root.clientWidth;
    const old = {
      bodyOverflow: body.style.overflow,
      rootOverflow: root.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${originalY}px`;
    body.style.width = "100%";
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGallerySelection(null);
      if (event.key === "ArrowLeft")
        setGallerySelection(
          (current) =>
            current && {
              ...current,
              imageIndex:
                (current.imageIndex -
                  1 +
                  projectImages(current.project).length) %
                projectImages(current.project).length,
            },
        );
      if (event.key === "ArrowRight")
        setGallerySelection(
          (current) =>
            current && {
              ...current,
              imageIndex:
                (current.imageIndex + 1) %
                projectImages(current.project).length,
            },
        );
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = old.bodyOverflow;
      root.style.overflow = old.rootOverflow;
      body.style.position = old.position;
      body.style.top = old.top;
      body.style.width = old.width;
      body.style.paddingRight = old.paddingRight;
      galleryOpenRef.current = false;
      lastScrollYRef.current = null; // the restore below must not look like a scroll direction
      scrollInstantlyTo(originalY);
    };
  }, [gallerySelection]);

  /*
   * ==========================================================
   * PROJECTS SCROLL CONTROLLER
   * ==========================================================
   *
   * - Entering from above lands on the intro panel; entering from below lands
   *   on the last project.
   * - While pinned, each scroll delta directly updates horizontal track progress.
   * - The page releases naturally at either end of the track.
   */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    let touchY: number | null = null;
    let inputGraceUntil = 0;
    let jumpUntil = 0;
    let entryPauseTimer: number | null = null;
    let entryPauseActive = false;
    let queuedProgress = 0;
    let releasedToward: ScrollDirection | null = null;

    const isEnabled = () => !galleryOpenRef.current;
    const sectionOffset = () => (desktop.matches ? 0 : 56);
    const sectionTop = () =>
      section.getBoundingClientRect().top - sectionOffset();
    const updateApproachOpacity = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        section.style.opacity = "1";
        return;
      }

      const rect = section.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
      );
      const visibleRatio = Math.min(
        1,
        visibleHeight / Math.min(rect.height, window.innerHeight),
      );
      section.style.opacity = String(0.24 + visibleRatio * 0.76);
    };
    const hasRecentInput = () => performance.now() < inputGraceUntil;
    const isJumping = () => performance.now() < jumpUntil;
    const noteInput = (graceMs: number) => {
      inputGraceUntil = performance.now() + graceMs;
      jumpUntil = 0;
    };

    const clearEntryPause = () => {
      if (entryPauseTimer !== null) {
        window.clearTimeout(entryPauseTimer);
        entryPauseTimer = null;
      }
      entryPauseActive = false;
      queuedProgress = 0;
    };

    const navbarBusy = () => {
      if (controllerStateRef.current === "navbar" && !isNavbarNavigating()) {
        setControllerState("normal"); // END event was missed; don't stay locked out
      }
      return controllerStateRef.current === "navbar" || isNavbarNavigating();
    };

    // When Projects is fully off-screen, choose the group the next entry should show.
    const syncGroupToPosition = () => {
      const rect = section.getBoundingClientRect();
      const offset = sectionOffset();
      if (rect.bottom <= offset) {
        if (targetGroupRef.current !== LAST_GROUP_INDEX)
          setGroup(LAST_GROUP_INDEX);
        return true;
      }
      if (rect.top >= window.innerHeight) {
        if (targetGroupRef.current !== 0) setGroup(0);
        return true;
      }
      return false;
    };

    const canPin = (direction: ScrollDirection, top: number) => {
      const height = section.offsetHeight;
      return direction === "down"
        ? targetGroupRef.current < LAST_GROUP_INDEX &&
            top <= PIN_EPSILON &&
            top > -height
        : // Enter from below at the same top-edge lock position as downward entry.
          targetGroupRef.current > 0 &&
            top >= -PIN_EPSILON &&
            top <= PIN_EPSILON;
    };

    const pinProjects = () => {
      if (controllerStateRef.current !== "normal") return;
      setHasEntered(true);
      setControllerState("pinned");
      updateApproachOpacity();
      clearEntryPause();
      entryPauseActive = true;
      entryPauseTimer = window.setTimeout(() => {
        entryPauseTimer = null;
        entryPauseActive = false;
        const pendingProgress = queuedProgress;
        queuedProgress = 0;
        if (pendingProgress !== 0) {
          changeGroup(targetGroupRef.current + pendingProgress);
        }
      }, ENTRY_READ_PAUSE_MS);
    };

    // Put the section exactly back on the viewport after layout shifts or stray scroll.
    const realign = () => {
      const top = sectionTop();
      if (Math.abs(top) > PIN_EPSILON) scrollInstantlyTo(window.scrollY + top);
    };

    const realignIfPinned = () => {
      if (galleryOpenRef.current) return;
      const state = controllerStateRef.current;
      if (state === "pinned") realign();
    };

    const forceRelease = (group: number) => {
      clearEntryPause();
      setGroup(group);
      setControllerState("normal");
    };

    const handleIntent = (
      direction: ScrollDirection,
      distance: number,
      preventDefault: () => void,
    ) => {
      if (!desktop.matches) return;
      if (distance <= 0) return;
      const state = controllerStateRef.current;

      if (state === "pinned") realign();

      if (state === "pinned") {
        const atOutwardEdge =
          (direction === "down" &&
            targetGroupRef.current >= LAST_GROUP_INDEX) ||
          (direction === "up" && targetGroupRef.current <= 0);
        if (atOutwardEdge) {
          const visualAtEdge =
            direction === "down"
              ? activeGroupRef.current >= LAST_GROUP_INDEX - 0.001
              : activeGroupRef.current <= 0.001;
          if (visualAtEdge) {
            clearEntryPause();
            releasedToward = direction;
            setControllerState("normal");
            return;
          }
          preventDefault();
          changeGroup(targetGroupRef.current);
          return;
        }
        const deltaProgress =
          (distance / Math.max(editorialStepRef.current, 1)) *
          (direction === "down" ? 1 : -1);
        if (entryPauseActive) {
          preventDefault();
          queuedProgress += deltaProgress;
          return;
        }
        const nextProgress = targetGroupRef.current + deltaProgress;
        if (nextProgress < 0 || nextProgress > LAST_GROUP_INDEX) {
          preventDefault();
          changeGroup(nextProgress);
          return;
        }
        preventDefault();
        changeGroup(nextProgress);
        return;
      }

      if (state === "normal" && canPin(direction, sectionTop())) {
        preventDefault();
        pinProjects();
        const deltaProgress =
          (distance / Math.max(editorialStepRef.current, 1)) *
          (direction === "down" ? 1 : -1);
        queuedProgress += deltaProgress;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY === 0) return; // ctrl+wheel = zoom
      if (!isEnabled() || navbarBusy()) return;
      noteInput(WHEEL_INPUT_GRACE_MS);

      const delta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? event.deltaY * 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? event.deltaY * window.innerHeight
            : event.deltaY;
      const direction: ScrollDirection = delta > 0 ? "down" : "up";

      // Let the expanded card scroll its own content without changing groups.
      if (innerScrollerCanScroll(event.target, direction)) {
        return;
      }
      if (selectedProjectRef.current) {
        event.preventDefault();
        return;
      }

      handleIntent(direction, Math.abs(delta), () => event.preventDefault());
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const nextY = event.touches[0]?.clientY;
      if (touchY === null || nextY === undefined) return;
      const movement = touchY - nextY;
      touchY = nextY;
      if (movement === 0) return;
      if (!isEnabled() || navbarBusy()) return;
      noteInput(TOUCH_INPUT_GRACE_MS);

      const direction: ScrollDirection = movement > 0 ? "down" : "up";
      if (innerScrollerCanScroll(event.target, direction)) {
        return;
      }
      if (selectedProjectRef.current) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      handleIntent(direction, Math.abs(movement), () => {
        if (event.cancelable) event.preventDefault();
      });
    };

    const handleTouchEnd = () => {
      touchY = null;
      noteInput(TOUCH_INPUT_GRACE_MS); // keep the grace window open for touch momentum
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      )
        return;
      if (!isEnabled() || navbarBusy()) return;

      const target = event.target;
      if (target instanceof HTMLElement) {
        if (
          target.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
        )
          return;
        if (event.key === " " && target.closest("button, a, summary")) return;
      }

      noteInput(WHEEL_INPUT_GRACE_MS);
      const state = controllerStateRef.current;

      if (event.key === "Home" || event.key === "End") {
        // Jump keys aren't a one-group gesture: leave at the matching edge and let the browser jump.
        if (state === "pinned") {
          forceRelease(event.key === "End" ? LAST_GROUP_INDEX : 0);
        }
        jumpUntil = performance.now() + JUMP_KEY_GRACE_MS;
        return;
      }

      const direction: ScrollDirection | null =
        event.key === "ArrowDown" || event.key === "PageDown"
          ? "down"
          : event.key === "ArrowUp" || event.key === "PageUp"
            ? "up"
            : event.key === " "
              ? event.shiftKey
                ? "up"
                : "down"
              : null;
      if (!direction) return;

      handleIntent(
        direction,
        event.key === "ArrowDown" || event.key === "ArrowUp"
          ? 40
          : window.innerHeight,
        () => event.preventDefault(),
      );
    };

    /*
     * Safety net. Runs after the browser has moved the document, so it also
     * catches smooth-scroll animation, momentum and fast flicks that passed the
     * boundary between wheel events.
     */
    const handleScroll = () => {
      const y = window.scrollY;
      const previous = lastScrollYRef.current;
      lastScrollYRef.current = y;

      if (!isEnabled()) {
        lastScrollYRef.current = null;
        return;
      }
      if (navbarBusy()) return;

      const state = controllerStateRef.current;
      const rect = section.getBoundingClientRect();
      const top = rect.top - sectionOffset();
      updateApproachOpacity();

      if (state === "pinned") {
        if (Math.abs(top) <= PIN_EPSILON) return;
        if (!hasRecentInput() && Math.abs(top) > NATIVE_JUMP_THRESHOLD) {
          // Scrollbar drag / autoscroll / anchor jump: the visitor is leaving on purpose.
          forceRelease(top < 0 ? LAST_GROUP_INDEX : 0);
          return;
        }
        scrollInstantlyTo(y + top);
        return;
      }

      if (state !== "normal") return;
      if (!desktop.matches) return;
      if (isJumping() || previous === null || previous === y) {
        syncGroupToPosition();
        return;
      }

      // Only pin movement that came from the visitor, not a scrollbar drag.
      if (!hasRecentInput()) {
        syncGroupToPosition();
        return;
      }

      const direction: ScrollDirection = y > previous ? "down" : "up";
      if (releasedToward) {
        if (direction === releasedToward) {
          const movedPastLock =
            direction === "down" ? top < -PIN_EPSILON : top > PIN_EPSILON;
          if (movedPastLock) releasedToward = null;
          return;
        }
        releasedToward = null;
      }

      const previousTop = top + (y - previous);
      const crossedLockPosition =
        direction === "down"
          ? previousTop >= 0 && top <= 0
          : previousTop <= 0 && top >= 0;

      // Lenis can move across the exact lock pixel between animation frames.
      // Catch that crossing in either direction and correct only the tiny overshoot.
      if (crossedLockPosition && Math.abs(top) <= NATIVE_JUMP_THRESHOLD) {
        setGroup(direction === "down" ? 0 : LAST_GROUP_INDEX);
        if (Math.abs(top) > PIN_EPSILON) {
          scrollInstantlyTo(y + top);
        }
        pinProjects();
        return;
      }

      if (syncGroupToPosition()) return;
      if (canPin(direction, top)) {
        pinProjects();
      }
    };

    const handleNavbarStart = () => {
      clearEntryPause();
      setControllerState("navbar");
    };

    const handleNavbarEnd = () => {
      if (controllerStateRef.current !== "navbar") return;
      setControllerState("normal");
      lastScrollYRef.current = window.scrollY;
      // The navbar landed on Projects itself: show the first group, pinned.
      if (
        desktop.matches &&
        Math.abs(sectionTop()) < window.innerHeight * 0.5
      ) {
        setGroup(0);
        pinProjects();
      } else {
        syncGroupToPosition();
      }
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(realignIfPinned)
        : null;
    resizeObserver?.observe(document.body);

    const handleDesktopChange = () => {
      if (!desktop.matches) {
        clearEntryPause();
        setControllerState("normal");
        setGroup(0);
      }
    };

    window.addEventListener("wheel", handleWheel, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchstart", handleTouchStart, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchmove", handleTouchMove, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchend", handleTouchEnd, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchcancel", handleTouchEnd, {
      capture: true,
      passive: true,
    });
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", realignIfPinned);
    window.addEventListener(NAVBAR_NAVIGATION_START, handleNavbarStart);
    window.addEventListener(NAVBAR_NAVIGATION_END, handleNavbarEnd);
    desktop.addEventListener("change", handleDesktopChange);

    lastScrollYRef.current = window.scrollY;
    updateApproachOpacity();
    syncGroupToPosition();

    return () => {
      window.removeEventListener("wheel", handleWheel, true);
      window.removeEventListener("touchstart", handleTouchStart, true);
      window.removeEventListener("touchmove", handleTouchMove, true);
      window.removeEventListener("touchend", handleTouchEnd, true);
      window.removeEventListener("touchcancel", handleTouchEnd, true);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", realignIfPinned);
      resizeObserver?.disconnect();
      window.removeEventListener(NAVBAR_NAVIGATION_START, handleNavbarStart);
      window.removeEventListener(NAVBAR_NAVIGATION_END, handleNavbarEnd);
      desktop.removeEventListener("change", handleDesktopChange);
      section.style.removeProperty("opacity");
      clearEntryPause();
      if (progressFrameRef.current !== null) {
        window.cancelAnimationFrame(progressFrameRef.current);
        progressFrameRef.current = null;
      }
      setControllerState("normal");
    };
  }, [changeGroup, editorialStep, setControllerState, setGroup]);

  const displayGroup = Math.max(
    0,
    Math.min(projects.length, Math.round(activeGroup)),
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="
        projects-section
        relative
        z-20
        w-full
        overflow-hidden
        text-[#F5F2E9]
      "
      style={{
        backgroundColor: hasEntered ? "#4B543E" : "transparent",
        transition: "background-color 800ms ease-out",
      }}
    >
      <div className="relative hidden h-screen min-h-[680px] w-full overflow-hidden lg:block">
        <div className="absolute bottom-[13%] left-[clamp(24px,3.5vw,70px)] right-[clamp(28px,6vw,88px)] top-[13%] overflow-hidden">
          <div
            ref={editorialTrackRef}
            className="flex h-full w-max items-center gap-[clamp(52px,6vw,112px)]"
            style={{
              transform: `translate3d(-${activeGroup * editorialStep}px, 0, 0)`,
              transition: "none",
            }}
          >
            <div
              data-revealed={hasEntered}
              className={`projects-slide-reveal flex h-full w-[min(40vw,780px)] shrink-0 origin-bottom-left flex-col justify-center transition-[opacity,translate,rotate] delay-75 duration-[760ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${hasEntered ? "translate-y-0 rotate-0 opacity-100" : "translate-y-8 rotate-[2deg] opacity-0"}`}
            >
              <h2 className="projects-heading-reveal m-0 origin-bottom-left font-[family-name:var(--font-jersey-15)] text-[clamp(96px,9.5vw,190px)] uppercase leading-[0.78] tracking-[-0.035em] text-[#F5F2E9]">
                Selected
                <br />
                Work
              </h2>
              <p className="mt-8 max-w-[370px] font-[family-name:var(--font-poppins)] text-[16px] leading-[1.7] text-[#F5F2E9]/75">
                A collection of digital products and platforms, designed and
                built with care.
              </p>
              <div className="mt-12 flex items-center gap-3 font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.16em] text-[#F5F2E9]/60">
                <span className="h-px w-10 bg-[#F5F2E9]/50" /> Scroll to explore
              </div>
            </div>
            {projects.map((project, index) => (
              <EditorialSlide
                key={project.number}
                project={project}
                active={index + 1 === displayGroup}
                revealed={hasEntered}
                stagger={Math.max(0, index + 1 - activeGroup)}
                onOpen={() => openProject(project)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto min-h-screen w-full max-w-4xl px-5 pb-14 pt-10 lg:hidden">
        <div
          className={`projects-mobile-header-reveal mb-10 border-b border-[#F5F2E9]/25 pb-6 transition-[opacity,translate,filter] duration-700 ease-out motion-reduce:transition-none ${hasEntered ? "translate-y-0 opacity-100 blur-0" : "translate-y-7 opacity-0 blur-[7px]"}`}
        >
          <h2
            className={`projects-heading-reveal m-0 origin-bottom-left font-[family-name:var(--font-jersey-15)] text-[clamp(54px,14vw,82px)] uppercase leading-[0.82] tracking-[-0.03em] transition-[opacity,translate,rotate,filter] delay-75 duration-[760ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${hasEntered ? "translate-y-0 rotate-0 opacity-100 blur-0" : "translate-y-10 rotate-[8deg] opacity-0 blur-[6px]"}`}
          >
            Selected Work
          </h2>
          <p className="mb-0 mt-5 max-w-lg font-[family-name:var(--font-poppins)] text-sm leading-6 text-[#F5F2E9]/75">
            A collection of digital products and platforms, designed and built
            with care.
          </p>
        </div>
        <div className="case-study-scrollbar-hidden max-[1023px]:h-[min(390px,calc(100svh-280px))] max-[1023px]:overflow-y-auto max-[1023px]:overscroll-contain max-[1023px]:snap-y max-[1023px]:snap-mandatory divide-y divide-[#F5F2E9]/25">
          {projects.map((project, index) => (
            <MobileProjectRow
              key={project.number}
              project={project}
              index={index}
              revealed={hasEntered}
              onOpen={() => openProject(project)}
            />
          ))}
        </div>
      </div>

      {selectedProject &&
        typeof document !== "undefined" &&
        createPortal(
          <ProjectCaseStudy
            project={selectedProject}
            onClose={closeProject}
            exiting={isCaseStudyExiting}
            onOpenImage={(imageIndex) =>
              setGallerySelection({ project: selectedProject, imageIndex })
            }
          />,
          document.body,
        )}
      {gallerySelection &&
        typeof document !== "undefined" &&
        createPortal(
          <ImageLightbox
            selection={gallerySelection}
            onClose={() => setGallerySelection(null)}
            onChange={(imageIndex) =>
              setGallerySelection(
                (current) => current && { ...current, imageIndex },
              )
            }
          />,
          document.body,
        )}
    </section>
  );
}

function projectPalette(project: Project) {
  const palettes: Record<
    string,
    { background: string; foreground: string; accent: string }
  > = {
    "01": { background: "#633C45", foreground: "#F4EBDD", accent: "#D6A9AE" },
    "02": { background: "#51404B", foreground: "#F4EBDD", accent: "#E4E2DC" },
    "03": { background: "#252525", foreground: "#F4EBDD", accent: "#707B61" },
    "04": { background: "#76524A", foreground: "#F4EBDD", accent: "#D6A9AE" },
    "05": { background: "#594733", foreground: "#F4EBDD", accent: "#E4E2DC" },
    "06": { background: "#707B61", foreground: "#F4EBDD", accent: "#D6A9AE" },
    "07": { background: "#3B4651", foreground: "#F4EBDD", accent: "#E4E2DC" },
    "08": { background: "#49364B", foreground: "#F4EBDD", accent: "#D6A9AE" },
    "09": { background: "#3B3C49", foreground: "#F4EBDD", accent: "#D6A9AE" },
  };
  return palettes[project.number] ?? palettes["07"];
}

function ProjectCover({ project }: { project: Project }) {
  const palette = projectPalette(project);
  return (
    <div
      className="relative isolate flex h-full w-full flex-col justify-between overflow-hidden p-[clamp(18px,3vw,42px)]"
      style={{ backgroundColor: palette.background, color: palette.foreground }}
    >
      <span
        className="relative z-10 font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.18em]"
        style={{ color: palette.accent }}
      >
        {projectCategory(project)}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[clamp(40px,20vw,00px)] top-[35%] z-0 -translate-y-1/2 select-none font-[family-name:var(--font-jersey-15)] text-[clamp(200px,400vw,400px)] leading-[0.72] opacity-[0.16]"
        style={{ color: palette.accent }}
      >
        {project.number}
      </span>
      <div className="relative z-10">
        <h3 className="relative z-10 mt-3 max-w-[88%] font-[family-name:var(--font-jersey-15)] text-[clamp(36px,4.6vw,68px)] uppercase leading-[0.88]">
          {project.title}
        </h3>
      </div>
    </div>
  );
}

function EditorialSlide({
  project,
  active,
  revealed,
  stagger,
  onOpen,
}: {
  project: Project;
  active: boolean;
  revealed: boolean;
  stagger: number;
  onOpen: () => void;
}) {
  const entranceDelay = 160 + stagger * 170;
  return (
    <article
      aria-current={active ? "step" : undefined}
      data-revealed={revealed}
      className={`projects-slide-reveal flex h-full w-[min(40vw,780px)] shrink-0 flex-col origin-bottom-left transition-[opacity,translate,rotate] duration-[760ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${revealed ? "translate-y-0 rotate-0 opacity-100" : "translate-y-7 rotate-[2deg] opacity-0"}`}
      style={{ transitionDelay: revealed ? `${entranceDelay}ms` : "0ms" }}
    >
      <div className="mb-3 flex items-center justify-between pt-3 font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.16em] text-[#F5F2E9]/70">
        <span>
          {project.number} / {String(projects.length).padStart(2, "0")}
        </span>
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open case study: ${project.title}`}
        className="group flex min-h-0 flex-1 flex-col border-0 bg-transparent p-0 text-left text-inherit focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5F2E9]"
      >
        <div
          className="group/visual h-[min(52vh,520px)] min-h-[300px] w-full shrink-0 overflow-hidden rounded-[22px] border transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{
            borderColor: projectPalette(project).accent,
            transform: "perspective(1200px) rotateX(0deg) rotateY(0deg)",
          }}
          onPointerMove={(event) => updateProjectCoverTilt(event)}
          onPointerLeave={(event) => updateProjectCoverTilt(event, true)}
        >
          <div className="h-full w-full">
            <ProjectCover project={project} />
          </div>
        </div>
        <div className="grid min-h-[148px] grid-cols-[1fr_auto] grid-rows-[1fr_auto] gap-x-8 gap-y-2 border-b border-[#F5F2E9]/35 py-4">
          <div>
            <h3 className="m-0 line-clamp-2 min-h-[2em] font-[family-name:var(--font-jersey-15)] text-[clamp(28px,3vw,42px)] uppercase leading-none text-[#F5F2E9]">
              {project.title}
            </h3>
          </div>
        </div>
        <p className="mb-0 mt-auto line-clamp-1 pt-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.13em] text-[#F5F2E9]/55">
          {project.tech || "Concept · Research · Design"}
        </p>
      </button>
    </article>
  );
}

function MobileProjectRow({
  project,
  index,
  revealed,
  onOpen,
}: {
  project: Project;
  index: number;
  revealed: boolean;
  onOpen: () => void;
}) {
  const palette = projectPalette(project);
  const rowDelay = (index + 1) * 160;
  return (
    <article
      data-revealed={revealed}
      className={`projects-mobile-row-reveal snap-start py-5 first:pt-0 last:pb-0 origin-bottom-left transition-[opacity,translate,rotate] duration-[760ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${revealed ? "translate-y-0 rotate-0 opacity-100" : "translate-y-6 rotate-[1deg] opacity-0"}`}
      style={{ transitionDelay: revealed ? `${rowDelay}ms` : "0ms" }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="grid w-full grid-cols-[104px_minmax(0,1fr)] gap-4 border-0 bg-transparent p-0 text-left text-inherit focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5F2E9]"
      >
        <div
          className="h-[82px] w-[104px] overflow-hidden rounded-[9px] border-2"
          style={{
            backgroundColor: palette.background,
            borderColor: palette.accent,
          }}
        >
          <div
            className="flex h-full flex-col justify-between p-2"
            style={{ color: palette.foreground }}
          >
            <span
              className="font-[family-name:var(--font-inter)] text-[7px] uppercase tracking-[0.12em]"
              style={{ color: palette.accent }}
            >
              {projectCategory(project)} · {project.number}
            </span>
            <span className="font-[family-name:var(--font-jersey-15)] text-[14px] uppercase leading-[0.9]">
              {project.title}
            </span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="m-0 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.14em] text-[#F5F2E9]/60">
            {String(index + 1).padStart(2, "0")} · {projectCategory(project)}
          </p>
          <h3 className="mb-0 mt-1 font-[family-name:var(--font-jersey-15)] text-[24px] uppercase leading-[0.95]">
            {project.title}
          </h3>
        </div>
      </button>
    </article>
  );
}

function ProjectCaseStudy({
  project,
  onClose,
  exiting,
  onOpenImage,
}: {
  project: Project;
  onClose: () => void;
  exiting: boolean;
  onOpenImage: (imageIndex: number) => void;
}) {
  const palette = projectPalette(project);
  const images = projectImages(project);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      data-projects-scroll
      data-lenis-prevent
      className={`${exiting ? "project-case-study-exit" : "project-case-study-enter"} case-study-scrollbar-hidden fixed inset-0 z-[500] overflow-y-auto overscroll-y-contain`}
      style={{ backgroundColor: palette.background, color: palette.foreground }}
    >
      <header
        className="sticky top-0 z-10 flex min-h-[60px] items-center justify-between border-b border-current/20 px-5 sm:px-10"
        style={{ backgroundColor: palette.background }}
      >
        <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.16em] opacity-70">
          Project {project.number} / {String(projects.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="border-0 bg-transparent p-2 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.14em] underline underline-offset-4"
          aria-label="Close case study"
        >
          Close ×
        </button>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-10 sm:pt-12">
        <section className="grid gap-10 lg:min-h-[66vh] lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-14">
          <div className="relative py-3 lg:py-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-3 -top-16 font-[family-name:var(--font-jersey-15)] text-[clamp(180px,24vw,360px)] leading-none opacity-[0.09]"
              style={{ color: palette.accent }}
            >
              {project.number}
            </span>
            <div className="relative z-10">
              <p className="mb-6 flex items-center gap-3 font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.18em] opacity-75">
                <span
                  className="h-[7px] w-[7px] rounded-full"
                  style={{ backgroundColor: palette.accent }}
                />
                {projectCategory(project)} <span className="opacity-45">/</span>{" "}
                {project.number}
              </p>
              <h1 className="m-0 max-w-[640px] font-[family-name:var(--font-jersey-15)] text-[clamp(54px,6vw,100px)] uppercase leading-[0.84] tracking-[-0.025em]">
                {project.title}
              </h1>
              <p className="mb-0 mt-7 max-w-[480px] font-[family-name:var(--font-poppins)] text-[14px] leading-[1.75] opacity-80">
                {project.description}
              </p>
            </div>
          </div>

          <div className="relative px-1 pb-5 pt-4 sm:px-3 sm:pb-6">
            <div
              className="absolute right-3 top-0 z-10 flex items-center gap-2 rounded-full border px-3 py-1.5 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.14em] backdrop-blur-sm"
              style={{
                borderColor: `${palette.accent}99`,
                backgroundColor: `${palette.background}CC`,
                color: palette.foreground,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: palette.accent }}
              />{" "}
              Project preview
            </div>
            <figure
              className="m-0 aspect-[1.55] max-h-[58vh] overflow-hidden rounded-[24px] border-2 p-2 sm:p-3"
              style={{
                backgroundColor: `${palette.background}CC`,
                borderColor: palette.accent,
                boxShadow: `12px 14px 0 ${palette.accent}30`,
              }}
            >
              {images[0] ? (
                <img
                  src={images[0]}
                  alt={`${project.title} preview`}
                  className="h-full w-full rounded-[16px] object-contain"
                />
              ) : (
                <ProjectCover project={project} />
              )}
            </figure>
            <div
              className="absolute bottom-0 left-5 flex items-center gap-3 rounded-full px-4 py-2 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.14em]"
              style={{
                backgroundColor: palette.accent,
                color: palette.background,
              }}
            >
              <span>{projectCategory(project)}</span>
            </div>
          </div>
        </section>
        <div className="mt-12 grid gap-8 border-y border-current/25 py-6 sm:grid-cols-[0.8fr_1.7fr_0.8fr]">
          <div>
            <p
              className="mb-2 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.16em]"
              style={{ color: palette.accent }}
            >
              Discipline
            </p>
            <p className="m-0 font-[family-name:var(--font-poppins)] text-[13px]">
              {projectCategory(project)}
            </p>
          </div>
          <div>
            <p
              className="mb-2 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.16em]"
              style={{ color: palette.accent }}
            >
              Built with
            </p>
            <p className="m-0 font-[family-name:var(--font-poppins)] text-[13px] leading-6">
              {project.tech || "Concept development"}
            </p>
          </div>
          <div>
            <p
              className="mb-2 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.16em]"
              style={{ color: palette.accent }}
            >
              Collection progress
            </p>
            <div
              className="mt-3 h-[2px] w-full"
              style={{ backgroundColor: `${palette.accent}55` }}
            >
              <div
                className="h-full"
                style={{
                  width: `${(Number(project.number) / projects.length) * 100}%`,
                  backgroundColor: palette.accent,
                }}
              />
            </div>
          </div>
        </div>{" "}
        {images.length > 0 && (
          <section
            className="mt-10"
            aria-label={`${project.title} screenshots`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="m-0 font-[family-name:var(--font-jersey-15)] text-3xl uppercase">
                Screens from the project
              </h2>
              <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.14em] opacity-60">
                {String(images.length).padStart(2, "0")} images
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((src, imageIndex) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => onOpenImage(imageIndex)}
                  className="aspect-[4/3] overflow-hidden rounded-[9px] border-2 p-[5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                  style={{
                    backgroundColor: palette.background,
                    borderColor: palette.accent,
                  }}
                >
                  <img
                    src={src}
                    alt={`${project.title} screenshot ${imageIndex + 1}`}
                    className="h-full w-full rounded-[4px] object-contain transition-transform duration-500 hover:scale-[1.03] motion-reduce:transition-none"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>
        )}
        <footer className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-current/25 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="border-0 bg-transparent p-0 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.14em] underline underline-offset-4"
          >
            ← Back to Selected Work
          </button>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.14em] underline underline-offset-4"
              >
                GitHub ↗
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.14em] underline underline-offset-4"
              >
                Live project ↗
              </a>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}

function ImageLightbox({
  selection,
  onClose,
  onChange,
}: {
  selection: GallerySelection;
  onClose: () => void;
  onChange: (imageIndex: number) => void;
}) {
  const { project, imageIndex } = selection;
  const images = projectImages(project);
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-4 sm:p-8"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute right-4 top-4 z-10 rounded-full bg-white px-4 py-2 font-semibold text-[#111] shadow-lg sm:right-8 sm:top-8"
      >
        Close <span aria-hidden="true">×</span>
      </button>
      <div
        className="flex max-h-full max-w-full flex-col items-center gap-3"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} screenshot ${imageIndex + 1}`}
      >
        <img
          src={images[imageIndex]}
          alt={`${project.title} screenshot ${imageIndex + 1}`}
          className="max-h-[82vh] max-w-[92vw] rounded-[8px] object-contain shadow-2xl"
          onMouseDown={(event) => event.stopPropagation()}
        />
        {images.length > 1 && (
          <div className="flex items-center gap-5 text-white">
            <button
              type="button"
              onClick={() =>
                onChange((imageIndex - 1 + images.length) % images.length)
              }
              aria-label="Previous screenshot"
              className="rounded px-3 py-1 hover:bg-white/15"
            >
              ← Previous
            </button>
            <span aria-live="polite">
              {imageIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => onChange((imageIndex + 1) % images.length)}
              aria-label="Next screenshot"
              className="rounded px-3 py-1 hover:bg-white/15"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
