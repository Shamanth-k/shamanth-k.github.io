"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  startNavbarNavigation,
  endNavbarNavigation,
  isNavbarNavigating,
} from "@/lib/navigation";
import { cancelPageLenisScroll, scrollPageTo } from "@/lib/smoothScroll";

const navigation = [
  {
    label: "HOME",
    href: "#home",
    id: "home",
    marker: "circle",
  },
  {
    label: "ABOUT",
    href: "#about",
    id: "about",
    marker: "square",
  },
  {
    label: "EDUCATION",
    href: "#education",
    id: "education",
    marker: "square",
  },
  {
    label: "PROJECTS",
    href: "#projects",
    id: "projects",
    marker: "triangle",
  },
  {
    label: "PLAYGROUND",
    href: "#playground",
    id: "playground",
    marker: "square",
  },
] as const;

function Marker({ type }: { type: "circle" | "square" | "triangle" }) {
  if (type === "circle") {
    return <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-black" />;
  }

  if (type === "triangle") {
    return (
      <span
        className="
          h-0
          w-0
          shrink-0
          border-l-[3px]
          border-r-[3px]
          border-t-[5px]
          border-l-transparent
          border-r-transparent
          border-t-black
        "
      />
    );
  }

  return <span className="h-[5px] w-[5px] shrink-0 bg-black" />;
}

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");

  const navigationAttemptRef = useRef(0);
  const navigationFrameRef = useRef<number | null>(null);
  const navigationTimeoutRef = useRef<number | null>(null);

  /*
   * CONTACT has a completely different active style.
   */
  const [contactActive, setContactActive] = useState(false);

  useEffect(() => {
    const closeMobileMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        document.querySelector("header details[open]")?.removeAttribute("open");
      }
    };
    window.addEventListener("keydown", closeMobileMenuOnEscape);
    return () => window.removeEventListener("keydown", closeMobileMenuOnEscape);
  }, []);

  /*
   * Navbar click navigation.
   */
  const handleNavbarNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    event.preventDefault();
    const targetId =
      sectionId === "education" ? "education-heading" : sectionId;

    const target = document.getElementById(targetId);

    if (!target) return;

    /*
     * Immediately make the clicked item active.
     *
     * This prevents the active state from travelling through
     * intermediate sections during smooth scrolling.
     */
    if (sectionId === "contact") {
      setContactActive(true);
    } else {
      setContactActive(false);
      setActiveSection(sectionId);
    }

    /*
     * Tell the Projects scroll controller:
     *
     * "This is a navbar navigation.
     * Do NOT activate the Projects scroll trap."
     */
    startNavbarNavigation();
    const navigationAttempt = ++navigationAttemptRef.current;

    if (navigationFrameRef.current !== null) {
      window.cancelAnimationFrame(navigationFrameRef.current);
      navigationFrameRef.current = null;
    }
    if (navigationTimeoutRef.current !== null) {
      window.clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }

    const finishNavigation = () => {
      if (navigationAttempt !== navigationAttemptRef.current) return;
      if (navigationFrameRef.current !== null) {
        window.cancelAnimationFrame(navigationFrameRef.current);
        navigationFrameRef.current = null;
      }
      if (navigationTimeoutRef.current !== null) {
        window.clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
      endNavbarNavigation();
    };

    /*
     * Directly scroll to the requested section.
     *
     * This means:
     *
     * HOME -> CONTACT
     * HOME -> PLAYGROUND
     * CONTACT -> HOME
     * PLAYGROUND -> ABOUT
     * etc.
     *
     * can all bypass the Projects scroll gate.
     */
    const navbarOffset =
      sectionId === "playground" ? 150 : sectionId === "education" ? 120 : 56;

    const targetTop =
      window.scrollY + target.getBoundingClientRect().top - navbarOffset;

    scrollPageTo(targetTop);

    /*
     * Wait until the requested section has actually arrived
     * at the top before ending navbar-navigation mode.
     */
    let stableFrames = 0;

    const checkArrival = () => {
      if (navigationAttempt !== navigationAttemptRef.current) return;

      const currentTarget = document.getElementById(targetId);

      if (!currentTarget) {
        finishNavigation();
        return;
      }

      const distance = Math.abs(
        currentTarget.getBoundingClientRect().top - navbarOffset,
      );

      if (distance <= 5) {
        stableFrames += 1;
      } else {
        stableFrames = 0;
      }

      /*
       * Require the target to remain in position for several
       * animation frames so the smooth scroll has really settled.
       */
      if (stableFrames >= 8) {
        if (sectionId === "contact") {
          setContactActive(true);
        } else {
          setContactActive(false);
          setActiveSection(sectionId);
        }

        finishNavigation();
        return;
      }

      navigationFrameRef.current = window.requestAnimationFrame(checkArrival);
    };

    // Smooth scrolling can stop short at the document bounds or be interrupted.
    // Always end the bypass and stop polling if the target never settles.
    navigationTimeoutRef.current = window.setTimeout(finishNavigation, 3000);
    navigationFrameRef.current = window.requestAnimationFrame(checkArrival);
  };

  useEffect(() => {
    const interruptNavigation = () => {
      if (!isNavbarNavigating()) return;
      cancelPageLenisScroll();
      navigationAttemptRef.current += 1;
      if (navigationFrameRef.current !== null) {
        window.cancelAnimationFrame(navigationFrameRef.current);
        navigationFrameRef.current = null;
      }
      if (navigationTimeoutRef.current !== null) {
        window.clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
      endNavbarNavigation();
    };

    window.addEventListener("wheel", interruptNavigation, true);
    window.addEventListener("touchstart", interruptNavigation, true);
    window.addEventListener("keydown", interruptNavigation, true);

    return () => {
      window.removeEventListener("wheel", interruptNavigation, true);
      window.removeEventListener("touchstart", interruptNavigation, true);
      window.removeEventListener("keydown", interruptNavigation, true);
      navigationAttemptRef.current += 1;
      if (navigationFrameRef.current !== null) {
        window.cancelAnimationFrame(navigationFrameRef.current);
        navigationFrameRef.current = null;
      }
      if (navigationTimeoutRef.current !== null) {
        window.clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
      endNavbarNavigation();
    };
  }, []);

  /*
   * Detect which section is active during NORMAL manual scrolling.
   *
   * During navbar-controlled scrolling we completely ignore this.
   */
  useEffect(() => {
    const updateActiveSection = () => {
      if (isNavbarNavigating()) {
        return;
      }

      /*
       * CONTACT
       */
      const contact = document.getElementById("contact");

      if (contact) {
        const contactRect = contact.getBoundingClientRect();

        const contactIsActive =
          contactRect.top <= window.innerHeight * 0.5 &&
          contactRect.bottom > 56;

        if (contactIsActive) {
          setContactActive(true);
          return;
        }
      }

      setContactActive(false);

      const playground = document.getElementById("playground");

      if (playground) {
        const rect = playground.getBoundingClientRect();

        if (rect.top <= window.innerHeight * 0.5 && rect.bottom > 56) {
          setActiveSection("playground");
          return;
        }
      }

      const projects = document.getElementById("projects");

      if (projects) {
        const rect = projects.getBoundingClientRect();

        if (rect.top <= 56 && rect.bottom > 56) {
          setActiveSection("projects");
          return;
        }
      }

      let closestSection = "home";
      let closestDistance = Infinity;

      navigation.forEach((item) => {
        let section: HTMLElement | null = null;

        if (item.id === "education") {
          section = document.getElementById("education-heading");
        } else {
          section = document.getElementById(item.id);
        }

        if (!section) return;

        const rect = section.getBoundingClientRect();

        /*
         * Ignore sections completely above the navbar.
         */
        if (rect.bottom <= 56) {
          return;
        }

        const distance = Math.abs(rect.top - 56);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = item.id;
        }
      });

      setActiveSection(closestSection);
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });

    window.addEventListener("resize", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);

      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-[100] h-[56px] w-full bg-white">
      <nav aria-label="Main navigation" className="relative flex h-full w-full items-center px-[clamp(14px,2vw,27px)]">
        <Link
          href="#home"
          aria-label="Shamanth home"
          onClick={(event) => handleNavbarNavigation(event, "home")}
          className="absolute left-[clamp(14px,2vw,27px)] top-1/2 flex -translate-y-1/2 items-center gap-2 text-black"
        >
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#F4B6D2] text-[12px] leading-none">✦</span>
          <span className="font-[var(--font-ui)] text-[12px] font-extrabold uppercase leading-none tracking-[0.1em]">SHAMANTH</span>
        </Link>

        <Link
          href="#contact"
          onClick={(event) => handleNavbarNavigation(event, "contact")}
          aria-current={contactActive ? "location" : undefined}
          className={`absolute right-[clamp(14px,2vw,27px)] top-1/2 flex h-[28px] -translate-y-1/2 items-center gap-[4px] rounded-full border border-black px-[9px] font-[var(--font-ui)] text-[10px] font-semibold leading-none tracking-[0.8px] transition-all duration-300 ease-out ${contactActive ? "bg-black text-white" : "bg-white text-black"}`}
        >
          <span className={`text-[16px] leading-none transition-colors duration-300 ${contactActive ? "text-[#FF1F3D]" : "text-black"}`} aria-hidden="true">♥</span>
          CONTACT
        </Link>

        <details className="group absolute left-[clamp(124px,30vw,220px)] top-1/2 z-20 -translate-y-1/2 min-[1024px]:hidden">
          <summary aria-label="Toggle section navigation" aria-controls="mobile-navigation" className="flex h-10 w-10 cursor-pointer list-none flex-col items-center justify-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black [&::-webkit-details-marker]:hidden">
            <span className="h-px w-5 bg-black transition-transform group-open:translate-y-[6px] group-open:rotate-45" />
            <span className="h-px w-5 bg-black transition-opacity group-open:opacity-0" />
            <span className="h-px w-5 bg-black transition-transform group-open:-translate-y-[6px] group-open:-rotate-45" />
          </summary>
          <div id="mobile-navigation" className="absolute left-0 top-[calc(100%+8px)] z-[110] w-[min(88vw,20rem)] rounded-lg border border-black/10 bg-white px-3 py-2 shadow-sm">
            <div className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(event) => {
                    event.currentTarget.closest("details")?.removeAttribute("open");
                    handleNavbarNavigation(event, item.id);
                  }}
                  className={`flex min-h-11 items-center gap-3 border-b border-black/10 px-2 font-[var(--font-ui)] text-[11px] font-semibold tracking-[0.12em] text-black last:border-0 ${activeSection === item.id && !contactActive ? "text-black" : "text-black/70"}`}
                >
                  <Marker type={item.marker} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
