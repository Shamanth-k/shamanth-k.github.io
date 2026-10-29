"use client";
import type { CSSProperties } from "react";
import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { LayoutGroup, motion, useMotionValue } from "framer-motion";
import { Settings } from "lucide-react";
import type { IconType } from "react-icons";
import { FaAws, FaDatabase } from "react-icons/fa6";
import { VscVscode } from "react-icons/vsc";
import {
  SiCss,
  SiBlender,
  SiDavinciresolve,
  SiDocker,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiJavascript,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPostman,
  SiPython,
  SiReact,
  SiSqlite,
  SiTerraform,
} from "react-icons/si";
import CertificationCardStack from "./CertificationCardStack";

type DragSession = {
  name: string;
  pointerId: number | null;
  touchIdentifier: number | null;
  grabOffsetX: number;
  grabOffsetY: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
};

type TouchCandidate = {
  name: string;
  identifier: number;
  startX: number;
  startY: number;
  timer: number;
  activated: boolean;
};

const ROW_SIZES = [5, 5, 4, 3, 4];
const ROW_BREAK_AFTER = new Set<number>();
let rowBreakIndex = 0;
ROW_SIZES.slice(0, -1).forEach((rowSize) => {
  rowBreakIndex += rowSize;
  ROW_BREAK_AFTER.add(rowBreakIndex);
});
const LAYOUT_EASE = [0.22, 1, 0.36, 1] as const;

const SKILLS = [
  { name: "AWS", color: "#B5F2AB" },
  { name: "CI/CD", color: "#F8DB6A" },
  { name: "Python", color: "#B5F2AB" },
  { name: "Kubernetes", color: "#F8DB6A" },
  { name: "Docker", color: "#9DD9F2" },

  { name: "Terraform", color: "#F8DB6A" },
  { name: "GitHub Actions", color: "#F2A7B5" },
  { name: "Git", color: "#B5F2AB" },
  { name: "GitHub", color: "#F8DB6A" },
  { name: "Linux", color: "#B5F2AB" },

  { name: "React", color: "#B5F2AB" },
  { name: "JavaScript", color: "#B5F2AB" },
  { name: "Express.js", color: "#9DD9F2" },
  { name: "Postman", color: "#F2A7B5" },

  { name: "Node.js", color: "#9DD9F2" },
  { name: "VS Code", color: "#F2A7B5" },
  { name: "CSS3", color: "#B5F2AB" },

  { name: "SQLite", color: "#F8DB6A" },
  { name: "MySQL", color: "#B5F2AB" },
  { name: "MongoDB", color: "#9DD9F2" },
  { name: "DynamoDB", color: "#F8DB6A" },
];

type Skill = (typeof SKILLS)[number];

const SKILL_BY_NAME = new Map(
  SKILLS.map((skill) => [skill.name, skill] as const),
);
const SKILL_ICONS: Record<string, IconType> = {
  AWS: FaAws,
  "CI/CD": Settings,
  Python: SiPython,
  Kubernetes: SiKubernetes,
  Docker: SiDocker,
  Terraform: SiTerraform,
  "GitHub Actions": SiGithubactions,
  Git: SiGit,
  GitHub: SiGithub,
  Linux: SiLinux,
  React: SiReact,
  JavaScript: SiJavascript,
  "Express.js": SiExpress,
  Postman: SiPostman,
  "Node.js": SiNodedotjs,
  "VS Code": VscVscode,
  CSS3: SiCss,
  SQLite: SiSqlite,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  DynamoDB: FaDatabase,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function Skills() {
  const pillClass = `
    inline-flex
    h-[54px]
    w-fit
    shrink-0
    items-center
    justify-between
    whitespace-nowrap
    rounded-none
    overflow-hidden
    [clip-path:polygon(0_0,calc(100%_-_9px)_0,100%_9px,100%_100%,8px_100%,0_calc(100%_-_8px))]
    border-0
    px-[13px]
    font-[family-name:var(--font-inter)]
    text-[16px]
    font-semibold
    leading-none
    tracking-[0.1px]
    text-black
    shadow-none
  `;

  const [skills, setSkills] = useState(SKILLS);
  const skillsRef = useRef<Skill[]>(SKILLS);
  const [previewOrder, setPreviewOrder] = useState<string[] | null>(null);
  const previewOrderRef = useRef<string[] | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const activeSkillRef = useRef<string | null>(null);
  const skillsAreaRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [pillWidths, setPillWidths] = useState<Record<string, number>>({});
  const dragSessionRef = useRef<DragSession | null>(null);
  const touchCandidateRef = useRef<TouchCandidate | null>(null);
  const pendingPointRef = useRef<{ x: number; y: number } | null>(null);
  const reorderFrameRef = useRef<number | null>(null);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const displayedOrder = previewOrder ?? skills.map(({ name }) => name);
  const displayedSkills = displayedOrder.flatMap((name) => {
    const skill = SKILL_BY_NAME.get(name);
    return skill ? [skill] : [];
  });

  useLayoutEffect(() => {
    skillsRef.current = skills;
  }, [skills]);

  useLayoutEffect(() => {
    const updateWidths = () => {
      const nextWidths: Record<string, number> = {};
      Object.entries(pillRefs.current).forEach(([name, pill]) => {
        if (pill) nextWidths[name] = pill.clientWidth;
      });
      setPillWidths(nextWidths);
    };

    updateWidths();
    const observer = new ResizeObserver(updateWidths);
    Object.values(pillRefs.current).forEach(
      (pill) => pill && observer.observe(pill),
    );
    return () => observer.disconnect();
  }, []);

  const startDrag = useCallback(
    (
      name: string,
      clientX: number,
      clientY: number,
      pointerId: number | null,
      touchIdentifier: number | null,
    ) => {
      const area = skillsAreaRef.current;
      const pill = pillRefs.current[name];
      if (!area || !pill) return false;

      const areaRect = area.getBoundingClientRect();
      const pillRect = pill.getBoundingClientRect();
      const scaleX = area.offsetWidth ? areaRect.width / area.offsetWidth : 1;
      const scaleY = area.offsetHeight
        ? areaRect.height / area.offsetHeight
        : 1;
      const order = skillsRef.current.map(({ name: skillName }) => skillName);

      dragSessionRef.current = {
        name,
        pointerId,
        touchIdentifier,
        grabOffsetX: (clientX - pillRect.left) / scaleX,
        grabOffsetY: (clientY - pillRect.top) / scaleY,
        width: pill.offsetWidth,
        height: pill.offsetHeight,
        scaleX,
        scaleY,
      };

      previewOrderRef.current = order;
      setPreviewOrder(order);
      dragX.set((pillRect.left - areaRect.left) / scaleX);
      dragY.set((pillRect.top - areaRect.top) / scaleY);
      activeSkillRef.current = name;
      setActiveSkill(name);
      return true;
    },
    [dragX, dragY],
  );

  const reorderAtPoint = useCallback((clientX: number, clientY: number) => {
    const activeName = activeSkillRef.current;
    const area = skillsAreaRef.current;
    const session = dragSessionRef.current;
    if (!activeName || !area || !session) return;
    const order = Array.from(
      area.querySelectorAll<HTMLElement>("[data-skill-pill]"),
    )
      .map((element) => element.dataset.skillPill)
      .filter((name): name is string => Boolean(name));
    if (order.length < 2) return;

    const areaRect = area.getBoundingClientRect();
    const localX = (clientX - areaRect.left) / session.scaleX;
    const localY = (clientY - areaRect.top) / session.scaleY;
    const activePill = pillRefs.current[activeName];
    if (activePill) {
      const activeLeft = activePill.offsetLeft;
      const activeTop = activePill.offsetTop;
      if (
        localX >= activeLeft &&
        localX <= activeLeft + activePill.offsetWidth &&
        localY >= activeTop &&
        localY <= activeTop + activePill.offsetHeight
      )
        return;
    }

    const candidates = order.flatMap((name) => {
      if (name === activeName) return [];
      const element = pillRefs.current[name];
      if (!element) return [];
      const rect = {
        left: element.offsetLeft,
        top: element.offsetTop,
        right: element.offsetLeft + element.offsetWidth,
        bottom: element.offsetTop + element.offsetHeight,
        width: element.offsetWidth,
        height: element.offsetHeight,
      };
      const inside =
        localX >= rect.left &&
        localX <= rect.right &&
        localY >= rect.top &&
        localY <= rect.bottom;
      const dx = Math.max(rect.left - localX, 0, localX - rect.right);
      const dy = Math.max(rect.top - localY, 0, localY - rect.bottom);
      return [{ name, rect, inside, distance: Math.hypot(dx, dy) }];
    });
    if (candidates.length === 0) return;

    const target =
      candidates.find(({ inside }) => inside) ??
      candidates.reduce((nearest, candidate) =>
        candidate.distance < nearest.distance ? candidate : nearest,
      );
    const sameRow = localY >= target.rect.top && localY <= target.rect.bottom;
    const placeAfter = sameRow
      ? localX > target.rect.left + target.rect.width / 2
      : localY > target.rect.top + target.rect.height / 2;
    const sourceIndex = order.indexOf(activeName);
    const targetIndex = order.indexOf(target.name);
    if (targetIndex < 0) return;
    const targetAfterRemoval =
      targetIndex - (sourceIndex < targetIndex ? 1 : 0);
    const destinationIndex = targetAfterRemoval + (placeAfter ? 1 : 0);
    if (destinationIndex === sourceIndex) return;

    const next = [...order];
    const [movingSkill] = next.splice(sourceIndex, 1);
    next.splice(clamp(destinationIndex, 0, next.length), 0, movingSkill);
    previewOrderRef.current = next;
    setPreviewOrder(next);
  }, []);

  const queueReorder = useCallback(
    (clientX: number, clientY: number) => {
      pendingPointRef.current = { x: clientX, y: clientY };
      if (reorderFrameRef.current !== null) return;
      reorderFrameRef.current = window.requestAnimationFrame(() => {
        reorderFrameRef.current = null;
        const point = pendingPointRef.current;
        pendingPointRef.current = null;
        if (point && dragSessionRef.current) reorderAtPoint(point.x, point.y);
      });
    },
    [reorderAtPoint],
  );

  const updateDrag = useCallback(
    (clientX: number, clientY: number) => {
      const session = dragSessionRef.current;
      const area = skillsAreaRef.current;
      if (!session || !area) return;

      const areaRect = area.getBoundingClientRect();
      const nextX = clamp(
        (clientX - areaRect.left) / session.scaleX - session.grabOffsetX,
        0,
        Math.max(0, area.offsetWidth - session.width),
      );
      const nextY = clamp(
        (clientY - areaRect.top) / session.scaleY - session.grabOffsetY,
        0,
        Math.max(0, area.offsetHeight - session.height),
      );
      dragX.set(nextX);
      dragY.set(nextY);
      queueReorder(clientX, clientY);
    },
    [dragX, dragY, queueReorder],
  );

  const handlePointerDown =
    (name: string) => (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      if (activeSkillRef.current) return;

      event.preventDefault();
      const area = skillsAreaRef.current;
      if (
        !area ||
        !startDrag(name, event.clientX, event.clientY, event.pointerId, null)
      )
        return;
      area.setPointerCapture(event.pointerId);
    };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    event.preventDefault();
    updateDrag(event.clientX, event.clientY);
  };

  const finishDrag = useCallback(
    (commit: boolean) => {
      const order = previewOrderRef.current;
      if (commit && order) {
        const nextSkills = order.flatMap((name) => {
          const skill = SKILL_BY_NAME.get(name);
          return skill ? [skill] : [];
        });
        skillsRef.current = nextSkills;
        setSkills(nextSkills);
      }
      if (reorderFrameRef.current !== null) {
        window.cancelAnimationFrame(reorderFrameRef.current);
        reorderFrameRef.current = null;
      }
      pendingPointRef.current = null;
      dragSessionRef.current = null;
      activeSkillRef.current = null;
      previewOrderRef.current = null;
      setPreviewOrder(null);
      setActiveSkill(null);
      dragX.set(0);
      dragY.set(0);
    },
    [dragX, dragY],
  );

  const finishPointerDrag = (
    event: ReactPointerEvent<HTMLDivElement>,
    commit: boolean,
  ) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    if (commit) {
      updateDrag(event.clientX, event.clientY);
      if (reorderFrameRef.current !== null) {
        window.cancelAnimationFrame(reorderFrameRef.current);
        reorderFrameRef.current = null;
      }
      pendingPointRef.current = null;
      reorderAtPoint(event.clientX, event.clientY);
    }
    finishDrag(commit);
  };

  useLayoutEffect(() => {
    const area = skillsAreaRef.current;
    if (!area) return;

    const handleTouchStart = (event: TouchEvent) => {
      if (
        event.touches.length !== 1 ||
        touchCandidateRef.current ||
        activeSkillRef.current
      )
        return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const pill = target.closest<HTMLElement>("[data-skill-pill]");
      if (!pill || !area.contains(pill)) return;

      const name = pill.dataset.skillPill;
      const touch = event.changedTouches.item(0);
      if (!name || !touch) return;

      const candidate: TouchCandidate = {
        name,
        identifier: touch.identifier,
        startX: touch.clientX,
        startY: touch.clientY,
        timer: window.setTimeout(() => {
          if (touchCandidateRef.current !== candidate) return;
          const started = startDrag(
            name,
            candidate.startX,
            candidate.startY,
            null,
            candidate.identifier,
          );
          if (!started) {
            touchCandidateRef.current = null;
            return;
          }
          candidate.activated = true;
        }, 180),
        activated: false,
      };
      touchCandidateRef.current = candidate;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const candidate = touchCandidateRef.current;
      if (!candidate) return;
      const touch = Array.from(event.changedTouches).find(
        ({ identifier }) => identifier === candidate.identifier,
      );
      if (!touch) return;

      if (!candidate.activated) {
        if (
          Math.hypot(
            touch.clientX - candidate.startX,
            touch.clientY - candidate.startY,
          ) > 8
        ) {
          window.clearTimeout(candidate.timer);
          touchCandidateRef.current = null;
        }
        return;
      }

      if (dragSessionRef.current?.touchIdentifier !== candidate.identifier)
        return;
      event.preventDefault();
      updateDrag(touch.clientX, touch.clientY);
    };

    const finishTouchDrag = (event: TouchEvent, commit: boolean) => {
      const candidate = touchCandidateRef.current;
      if (!candidate) return;
      const ended = Array.from(event.changedTouches).some(
        ({ identifier }) => identifier === candidate.identifier,
      );
      if (!ended) return;

      window.clearTimeout(candidate.timer);
      touchCandidateRef.current = null;
      if (dragSessionRef.current?.touchIdentifier === candidate.identifier) {
        if (commit) {
          const point = pendingPointRef.current;
          if (point) {
            if (reorderFrameRef.current !== null) {
              window.cancelAnimationFrame(reorderFrameRef.current);
              reorderFrameRef.current = null;
            }
            pendingPointRef.current = null;
            reorderAtPoint(point.x, point.y);
          }
        }
        finishDrag(commit);
      }
    };

    const handleTouchEnd = (event: TouchEvent) => finishTouchDrag(event, true);
    const handleTouchCancel = (event: TouchEvent) =>
      finishTouchDrag(event, false);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dragSessionRef.current) {
        event.preventDefault();
        finishDrag(false);
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      if (
        dragSessionRef.current?.touchIdentifier !== null &&
        dragSessionRef.current
      ) {
        event.preventDefault();
      }
    };

    area.addEventListener("touchstart", handleTouchStart, { passive: true });
    area.addEventListener("touchmove", handleTouchMove, { passive: false });
    area.addEventListener("touchend", handleTouchEnd, { passive: true });
    area.addEventListener("touchcancel", handleTouchCancel, { passive: true });
    area.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      area.removeEventListener("touchstart", handleTouchStart);
      area.removeEventListener("touchmove", handleTouchMove);
      area.removeEventListener("touchend", handleTouchEnd);
      area.removeEventListener("touchcancel", handleTouchCancel);
      area.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      if (touchCandidateRef.current)
        window.clearTimeout(touchCandidateRef.current.timer);
      touchCandidateRef.current = null;
      if (reorderFrameRef.current !== null) {
        window.cancelAnimationFrame(reorderFrameRef.current);
        reorderFrameRef.current = null;
      }
      pendingPointRef.current = null;
      dragSessionRef.current = null;
      activeSkillRef.current = null;
      previewOrderRef.current = null;
      dragX.set(0);
      dragY.set(0);
    };
  }, [dragX, dragY, finishDrag, reorderAtPoint, startDrag, updateDrag]);

  const renderSkillPill = (skill: Skill) => {
    const isDragging = activeSkill === skill.name;
    const SkillIcon = SKILL_ICONS[skill.name];

    return (
      <motion.span
        key={skill.name}
        layout="position"
        ref={(element) => {
          pillRefs.current[skill.name] = element;
        }}
        data-skill-pill={skill.name}
        className={`${pillClass} relative select-none cursor-grab${isDragging ? " cursor-grabbing" : ""}`}
        style={
          {
            "--pill-background":
              skill.name === "CI/CD" ||
              skill.name === "Kubernetes" ||
              skill.name === "Linux" ||
              skill.name === "MySQL"
                ? skill.name === "CI/CD"
                  ? "#FFE991"
                  : skill.color
                : "#F7F6F2",
            backgroundColor:
              skill.name === "CI/CD" ||
              skill.name === "Kubernetes" ||
              skill.name === "Linux" ||
              skill.name === "MySQL"
                ? skill.name === "CI/CD"
                  ? "#FFE991"
                  : skill.color
                : "rgba(255,255,255,0.04)",
            opacity: isDragging ? 0.2 : 1,
          } as CSSProperties & Record<`--${string}`, string>
        }
        transition={{ layout: { duration: 0.24, ease: LAYOUT_EASE } }}
        draggable={false}
        onPointerDown={handlePointerDown(skill.name)}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox={`0 0 ${pillWidths[skill.name] ?? 100} 54`}
        >
          <path
            d={`M.75 .75H${Math.max(0, (pillWidths[skill.name] ?? 100) - 9)}L${(pillWidths[skill.name] ?? 100) - 0.75} 9V53.25H8.5L.75 45Z`}
            fill="none"
            stroke="#20201e"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M4 5H10M4 5V11M${(pillWidths[skill.name] ?? 100) - 4} 49H${(pillWidths[skill.name] ?? 100) - 10}M${(pillWidths[skill.name] ?? 100) - 4} 49V43`}
            fill="none"
            stroke="#20201e"
            strokeWidth="1"
            strokeLinecap="square"
            opacity=".68"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <SkillIcon
          aria-hidden="true"
          className={`mr-3 h-[25px] w-[25px] shrink-0 ${skill.name === "Kubernetes" ? "text-[#326CE5]" : "text-[#111111]"}`}
        />
        <span>{skill.name}</span>
        <span
          aria-hidden="true"
          className="ml-3 inline-flex h-[11px] w-[11px] shrink-0 rotate-45 border-r-2 border-t-2 border-black"
        />
      </motion.span>
    );
  };

  const creativeTools = [
    "/creative-tools/premiere.png",
    "/creative-tools/photoshop.png",
    "/creative-tools/davinci.png",
    "/creative-tools/figma.png",
    "/creative-tools/blender.png",
    "/creative-tools/canva.png",
  ];
  const creativeToolNames = [
    "Premiere Pro",
    "Photoshop",
    "DaVinci Resolve",
    "Figma",
    "Blender",
    "Canva",
  ];
  const creativeToolIcons: (IconType | null)[] = [
    null,
    null,
    SiDavinciresolve,
    SiFigma,
    SiBlender,
    null,
  ];

  return (
    <section
      id="skills"
      className="
        relative
        min-h-[820px]
        w-full
        overflow-hidden
        bg-transparent
        max-[767px]:h-auto
        max-[767px]:min-h-0
        max-[767px]:overflow-visible
      "
    >
      {/* =====================================================
          12 COLUMN GRID
          
          Base width: 1024px
          Scale: 1.25
          Visual width: approximately 1280px
      ====================================================== */}

      <div
        data-scroll-reveal
        className="
          relative
          mx-auto
          min-h-[820px]
          w-[min(1700px,91vw)]
          origin-top
          scale-100
          max-[1100px]:h-auto
          max-[1100px]:w-full
          max-[1100px]:scale-100
          max-[900px]:px-6
          max-[900px]:py-12
        "
      >
        <div className="relative grid w-full grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] gap-x-14 pt-[99px] pb-[0.8px] before:absolute before:left-0 before:right-0 before:top-[40px] before:h-px before:bg-black/10 after:absolute after:bottom-0 after:left-[-8px] after:right-[-8px] after:h-px after:bg-black/10 max-[1100px]:gap-x-6 max-[1100px]:pt-[54px] max-[767px]:min-h-0 max-[767px]:grid-cols-1 max-[767px]:gap-y-10 max-[767px]:pb-0 max-[767px]:after:left-0 max-[767px]:after:right-0">
          <p className="absolute left-[49%] top-[82px] m-0 max-w-[230px] font-mono text-[12px] leading-[1.6] tracking-[0.08em] text-black/55 max-[900px]:hidden">
            TECHNOLOGIES, TOOLS AND
            <br />
            PLATFORMS I WORK WITH
            <br />
            TO BUILD AND SHIP THINGS.
          </p>
          {/* ===================================================
              LEFT SIDE — COLUMNS 1–6
          ==================================================== */}

          <div
            className="
              flex
              flex-col
              max-[767px]:col-span-1
            "
          >
            {/* =================================================
                SKILLS & TOOLS HEADING
            ================================================= */}

            <div
              className="
                relative
                h-[52px]
                w-fit
              "
            >
              <span
                className="
                  whitespace-nowrap
                  font-[family-name:var(--font-jersey-15)]
                  text-[48px]
                  max-[1100px]:text-[40px]
                  leading-[1]
                  tracking-[0.1px]
                  text-black
                "
              >
                Skills and Tools
              </span>
            </div>

            {/* =================================================
                SKILLS
            ================================================= */}

            <div
              ref={skillsAreaRef}
              onPointerMove={handlePointerMove}
              onPointerUp={(event) => finishPointerDrag(event, true)}
              onPointerCancel={(event) => finishPointerDrag(event, false)}
              onLostPointerCapture={(event) => finishPointerDrag(event, false)}
              className="
                relative
                mt-[28px]
                h-[350px]
                min-h-[350px]
                flex
                w-full
                flex-col
                items-start
                max-[767px]:h-auto
                max-[1439px]:h-auto
                max-[1439px]:min-h-0
              "
            >
              <LayoutGroup id="skills-sortable">
                <motion.div
                  layout="position"
                  className="flex w-full flex-wrap items-center gap-x-[10px] gap-y-[3px]"
                >
                  {displayedSkills.map((skill, index) => (
                    <Fragment key={skill.name}>
                      {renderSkillPill(skill)}
                      {ROW_BREAK_AFTER.has(index + 1) && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none h-0 w-full shrink-0 basis-full"
                          style={{ marginBottom: 2 }}
                        />
                      )}
                    </Fragment>
                  ))}
                </motion.div>
                {activeSkill && (
                  <motion.span
                    aria-hidden="true"
                    className={`${pillClass} pointer-events-none absolute left-0 top-0 z-50 select-none cursor-grabbing`}
                    style={{
                      backgroundColor:
                        activeSkill === "CI/CD"
                          ? "#FFE991"
                          : activeSkill === "Kubernetes" ||
                              activeSkill === "Linux" ||
                              activeSkill === "MySQL"
                            ? (SKILL_BY_NAME.get(activeSkill)?.color ??
                              "#F4F1E9")
                            : "#F4F1E9",
                      x: dragX,
                      y: dragY,
                    }}
                  >
                    {activeSkill}
                  </motion.span>
                )}
              </LayoutGroup>
            </div>

            {/* =================================================
                CREATIVE TOOLS HEADING
            ================================================= */}

            <div
              className="
                relative
                mt-[18px]
                h-[52px]
                w-fit
              "
            >
              <span
                className="
                  whitespace-nowrap
                  font-[family-name:var(--font-jersey-15)]
                  text-[46px]
                  max-[1100px]:text-[38px]
                  leading-[1]
                  tracking-[0.1px]
                  text-black
                "
              >
                Creative tools
              </span>
            </div>

            {/* =================================================
                CREATIVE TOOL ICONS
            ================================================= */}

            <div
              className="
                mt-[20px]
                flex
                items-center
                gap-[20px]
                max-[900px]:gap-4
                max-[1100px]:flex-wrap
                max-[767px]:gap-3
              "
            >
              {creativeTools.map((tool, index) => (
                <div
                  key={`${tool}-${index}`}
                  className="
                    flex
                    relative
                    h-[66px]
                    w-[66px]
                    max-[767px]:h-[58px]
                    max-[767px]:w-[58px]
                    shrink-0
                    items-center
                    justify-center
                  "
                >
                  <div
                    role="img"
                    aria-label={creativeToolNames[index]}
                    className="relative -translate-y-[5.1px] h-[66px] w-[66px] max-[767px]:h-[58px] max-[767px]:w-[58px]"
                  >
                    <span
                      className={`absolute left-0 top-0 flex h-[60px] w-[60px] items-center justify-center overflow-hidden [clip-path:polygon(0_0,calc(100%_-_7px)_0,100%_7px,100%_100%,7px_100%,0_calc(100%_-_7px))] max-[767px]:h-[52px] max-[767px]:w-[52px] ${index === 5 ? "bg-[#23bec7]" : index === 0 || index === 1 ? "bg-[#111b3d]" : index === 2 ? "bg-[#182f48]" : index === 3 ? "bg-[#1e1e1e]" : "bg-[#1b1b1b]"}`}
                    >
                      {index === 5 ? (
                        <img
                          src={tool}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      ) : creativeToolIcons[index] ? (
                        (() => {
                          const ToolIcon = creativeToolIcons[index];
                          const brandColor =
                            index === 2
                              ? "text-[#E2B833]"
                              : index === 3
                                ? "text-[#F24E1E]"
                                : "text-[#F5792A]";
                          return ToolIcon ? (
                            <ToolIcon
                              aria-hidden="true"
                              className={`h-[52px] w-[52px] ${brandColor}`}
                            />
                          ) : null;
                        })()
                      ) : (
                        <span
                          className={`flex h-[48px] w-[48px] items-center justify-center rounded-[4px] bg-[#111b3d] font-sans text-[24px] font-semibold tracking-[-0.08em] ${index === 0 ? "text-[#9999ff]" : "text-[#31a8ff]"}`}
                        >
                          {index === 0 ? "Pr" : "Ps"}
                        </span>
                      )}
                    </span>
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      viewBox="0 0 66 66"
                      fill="none"
                    >
                      <path
                        d="M.75 .75H52.5L59.25 7.5V59.25H7.5L.75 52.5Z"
                        stroke={index === 5 ? "#626a67" : "#202020"}
                        strokeWidth="1.25"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===================================================
              RIGHT SIDE — COLUMNS 7–12
          ==================================================== */}

          <div className="relative flex flex-col pl-14 before:absolute before:-left-[1px] before:bottom-0 before:top-[-58px] before:w-px before:bg-black/15 max-[1100px]:pl-6 max-[1100px]:before:-top-10 max-[767px]:pl-0 max-[767px]:pt-8 max-[767px]:before:hidden">
            {/* =================================================
                CERTIFICATIONS HEADING
            ================================================= */}

            <div
              className="
                relative
                h-[52px]
                w-fit
              "
            >
              <span
                className="
                  whitespace-nowrap
                  font-[family-name:var(--font-jersey-15)]
                  text-[48px]
                  max-[1100px]:text-[36px]
                  leading-[1]
                  tracking-[0.1px]
                  text-black
                "
              >
                Certifications
              </span>
            </div>

            {/* =================================================
                CERTIFICATION CARD STACK
            ================================================= */}

            <CertificationCardStack />
          </div>
        </div>
      </div>
    </section>
  );
}
