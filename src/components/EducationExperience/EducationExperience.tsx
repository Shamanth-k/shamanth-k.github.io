"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, GraduationCap } from "lucide-react";

type Experience = {
  year: string;
  company: string;
  role: string;
  dates: string;
  work: string[];
};

const experiences: Experience[] = [
  {
    year: "2026",
    company: "RDL Technologies Pvt Ltd",
    role: "FULL-STACK DEVELOPER INTERN",
    dates: "JAN — MAY",
    work: [
      "Worked as a Full-Stack Developer Intern.",
      "Contributed to full-stack application development.",
      "Worked across frontend and backend development.",
    ],
  },
  {
    year: "2024-2025",
    company: "GDG ON CAMPUS SCEM",
    role: "MEDIA LEAD",
    dates: "SEP,2024 — SEP,2025",
    work: [
      "Served as Media Lead at GDG On Campus SCEM.",
      "Worked on media and creative responsibilities for the organization.",
    ],
  },
];

const educationCards = [
  {
    year: "2022 - 2026",
    school: "SAHYADRI COLLEGE OF ENGINEERING AND MANAGEMENT",
    program: "INFORMATION SCIENCE & ENGINEERING",
    qualification: "BACHELOR OF ENGINEERING",
  },
  {
    year: "2020 - 2022",
    school: "JNANODAYA BETHANY P.U COLLEGE NELLYADY",
    program: "PCMC",
    qualification: "PRE-UNIVERSITY",
  },
  {
    year: "2020",
    school: "JNANODAYA BETHANY P.U COLLEGE NELLYADY",
    program: "10TH STANDARD",
    qualification: "SECONDARY EDUCATION",
  },
];

function EducationCard({
  year,
  school,
  program,
  qualification,
}: (typeof educationCards)[number]) {
  return (
    <article className="education-card relative h-[230px] min-h-[230px] w-full p-6 [clip-path:polygon(8px_0,calc(100%_-_8px)_0,100%_8px,100%_calc(100%_-_8px),calc(100%_-_8px)_100%,8px_100%,0_calc(100%_-_8px),0_8px)] max-[700px]:p-5">
      <div className="flex h-[28px] w-fit items-center rounded-full bg-[#F3D35C] px-[14px]">
        <span className="font-mono text-[12px] font-bold leading-none tracking-[0.08em] text-[#171717]">
          {year}
        </span>
      </div>
      <GraduationCap
        aria-hidden="true"
        className="absolute right-6 top-[22px] h-5 w-5 text-white/50"
      />
      <h3 className="m-0 mt-3 max-w-[94%] font-[family-name:var(--font-jersey-15)] text-[clamp(30px,3vw,44px)] font-normal leading-[0.95] tracking-[0.02em] text-white">
        {program}
      </h3>
      <p className="m-0 mt-[7px] max-w-[82%] pb-[4px] font-mono text-[13px] font-normal leading-[1.45] tracking-[0.08em] text-white/70">
        {school}
      </p>
      <div className="absolute bottom-[19px] left-6 right-6 border-t border-white/25 pt-[9px] max-[700px]:left-5 max-[700px]:right-5">
        <p className="m-0 pr-8 font-mono text-[11px] font-normal uppercase leading-[1.2] tracking-[0.1em] text-white/75">
          {qualification}
        </p>
      </div>
      <ArrowUpRight
        aria-hidden="true"
        className="absolute bottom-[17px] right-6 h-4 w-4 text-white/75 max-[700px]:right-5"
      />
    </article>
  );
}

export default function EducationExperience() {
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);

  /*
   * Lock the page behind the modal.
   * The modal itself remains scrollable if its content
   * becomes taller than the viewport.
   */
  useEffect(() => {
    if (selectedExperience) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedExperience]);

  /*
   * Allow ESC to close the popup.
   */
  useEffect(() => {
    if (!selectedExperience) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedExperience(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedExperience]);

  return (
    <section
      id="education-experience"
      className="
        relative
        w-full
        overflow-visible
        bg-transparent
        pt-[0px]
        pb-[80px]
    "
    >
      <div
        data-scroll-reveal
        className="
          mx-auto
          w-full
          max-w-[1200px]
          px-[40px]
        "
      >
        {/* ===================================================== */}
        {/* COLUMNS */}
        {/* ===================================================== */}

        <div
          className="
            mt-[30px]
            grid
            grid-cols-[minmax(0,486px)_minmax(0,486px)]
            justify-between
            gap-[40px]
            max-[1023px]:grid-cols-1
            max-[1023px]:gap-8
            max-[700px]:grid-cols-1
            max-[700px]:gap-8
          "
        >
          {/* =================================================== */}
          {/* EDUCATION COLUMN                                    */}
          {/* =================================================== */}

          <div id="education" className="flex flex-col gap-[35px]">
            <h2
              id="education-heading"
              className="
                m-0
                whitespace-nowrap
                font-[family-name:var(--font-jersey-15)]
                text-[clamp(44px,8vw,128px)]
                font-normal
                leading-[0.95]
                tracking-[0.8px]
                text-black
              "
            >
              EDUCATION
            </h2>
            {educationCards.map((education) => (
              <EducationCard key={education.year} {...education} />
            ))}
          </div>

          {/* =================================================== */}
          {/* EXPERIENCE COLUMN                                   */}
          {/* =================================================== */}

          <div id="experience" className="flex flex-col gap-[35px]">
            <h2
              className="
                m-0
                whitespace-nowrap
                font-[family-name:var(--font-jersey-15)]
                text-[clamp(44px,8vw,128px)]
                font-normal
                leading-[0.95]
                tracking-[0.8px]
                text-black
              "
            >
              EXPERIENCE
            </h2>
            {experiences.map((experience) => (
              <button
                key={experience.role}
                type="button"
                onClick={() => setSelectedExperience(experience)}
                className="
                  group
                  experience-card
                  relative
                  h-[230px]
                  min-h-[230px]
                  max-h-[230px]
                  w-full
                  cursor-pointer
                  rounded-none
                  [clip-path:polygon(8px_0,calc(100%_-_8px)_0,100%_8px,100%_calc(100%_-_8px),calc(100%_-_8px)_100%,8px_100%,0_calc(100%_-_8px),0_8px)]
                  bg-transparent
                  p-0
                  text-left
                  transition-transform
                  duration-200
                  hover:-translate-y-[4px]
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#282724]
                  focus-visible:ring-offset-4
                "
              >
                {/* YEAR */}
                <div
                  className="
                    absolute
                    left-6
                    max-[700px]:left-5
                    top-6
                    flex
                    h-[32px]
                    w-[146px]
                    items-center
                    justify-center
                    rounded-[38px]
                    bg-[#b5f2ab]
                  "
                >
                  <span
                    className="
                      font-mono
                      text-[12px]
                      font-bold
                      leading-none
                      tracking-[0.08em]
                      text-[#282724]
                    "
                  >
                    {experience.year}
                  </span>
                </div>

                {/* COMPANY */}
                <p
                  className="
                    absolute
                    left-6
                    max-[700px]:left-5
                    top-[145px]
                    m-0
                    font-mono
                    text-[15px]
                    max-[700px]:right-5
                    max-[700px]:whitespace-normal
                    font-normal
                    leading-[18px]
                    tracking-[0.8px]
                    text-[#282724]
                  "
                >
                  {experience.company}
                </p>

                {/* ROLE */}
                <p
                  className="
                    absolute
                    left-6
                    max-[700px]:left-5
                    top-[64px]
                    max-[700px]:top-[64px]
                    m-0
                    w-[455px]
                    max-[700px]:w-[calc(100%-32px)]
                    font-[family-name:var(--font-jersey-15)]
                    text-[clamp(30px,3vw,44px)]
                    font-medium
                    leading-[0.88]
                    tracking-[0.8px]
                    text-[#282724]
                  "
                >
                  {experience.role === "FULL-STACK DEVELOPER INTERN" ? (
                    <>
                      FULL-STACK
                      <br />
                      DEVELOPER INTERN
                    </>
                  ) : (
                    experience.role
                  )}
                </p>

                {/* TIMELINE */}
                <div
                  className="
                    absolute
                    left-[34px]
                    top-[194px]
                    h-[1px]
                    w-[320px]
                    max-[700px]:w-[calc(100%-68px)]
                    bg-[#282724]
                  "
                />

                {/* LEFT DOT */}
                <span
                  className="
                    absolute
                    left-[34px]
                    top-[191px]
                    h-[7px]
                    w-[7px]
                    rounded-full
                    bg-[#282724]
                  "
                />

                {/* RIGHT DOT */}
                <span
                  className="
                    absolute
                    left-[354px]
                    max-[700px]:left-[calc(100%-39px)]
                    top-[191px]
                    h-[7px]
                    w-[7px]
                    rounded-full
                    bg-[#282724]
                  "
                />

                {/* START DATE */}
                <span
                  className="
                    absolute
                    left-[23px]
                    top-[196px]
                    whitespace-nowrap
                    font-mono
                    text-[10px]
                    font-normal
                    leading-[12px]
                    tracking-[0.8px]
                    text-[#282724]
                  "
                >
                  {experience.dates.split(" — ")[0]}
                </span>

                {/* END DATE */}
                <span
                  className="
                    absolute
                    left-[350px]
                    max-[700px]:right-4
                    max-[700px]:left-auto
                    top-[196px]
                    whitespace-nowrap
                    font-mono
                    text-[10px]
                    font-normal
                    leading-[12px]
                    tracking-[0.8px]
                    text-[#282724]
                  "
                >
                  {experience.dates.split(" — ")[1]}
                </span>

                {/* VIEW */}
                <span
                  className="
                    absolute
                    right-[24px]
                    max-[700px]:right-5
                    top-[20px]
                    flex
                    items-center
                    gap-[4px]
                    rounded-[6px]
                    border
                    border-[#282724]
                    px-[10px]
                    py-[4px]
                    font-mono
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[1.2px]
                    text-[#282724]
                    transition-colors
                    duration-200
                    group-hover:bg-[#282724]
                    group-hover:text-[#FAF8F3]
                  "
                >
                  VIEW <ArrowUpRight className="h-3 w-3" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* EXPERIENCE MODAL                                         */}
      {/* ========================================================= */}

      {selectedExperience && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/40
            px-[24px]
            py-[40px]
            backdrop-blur-[3px]
          "
          onClick={() => setSelectedExperience(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            aria-label={`${selectedExperience.role} experience`}
            onClick={(event) => event.stopPropagation()}
            className="
              relative
              my-auto
              max-h-[calc(100vh-80px)]
              w-full
              max-w-[620px]
              overflow-y-auto
              rounded-[32px]
              border-[2px]
              border-[#111111]
              bg-[#F8F7F2]
              p-[36px]
              shadow-[10px_12px_0px_rgba(0,0,0,0.18)]
            "
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              aria-label="Close experience details"
              onClick={() => setSelectedExperience(null)}
              className="
                absolute
                right-[20px]
                top-[18px]
                flex
                h-[38px]
                w-[38px]
                items-center
                justify-center
                rounded-full
                border-[2px]
                border-[#111111]
                bg-transparent
                font-mono
                text-[24px]
                leading-none
                text-[#111111]
                transition-transform
                duration-200
                hover:rotate-90
              "
            >
              ×
            </button>

            {/* YEAR */}
            <div
              className="
                mb-[18px]
                inline-flex
                h-[34px]
                min-w-[120px]
                items-center
                justify-center
                rounded-full
                bg-[#282724]
                px-[20px]
                font-[family-name:var(--font-inter)]
                text-[16px]
                font-medium
                tracking-[0.8px]
                text-[#FAF8F3]
              "
            >
              {selectedExperience.year}
            </div>

            {/* ROLE */}
            <h3
              className="
                m-0
                pr-[45px]
                font-[family-name:var(--font-jersey-15)]
                text-[54px]
                font-normal
                leading-[0.95]
                tracking-[0.8px]
                text-black
              "
            >
              {selectedExperience.role}
            </h3>

            {/* COMPANY */}
            <p
              className="
                m-0
                mt-[12px]
                font-[family-name:var(--font-inter)]
                text-[16px]
                font-medium
                tracking-[0.8px]
                text-[#282724]
              "
            >
              {selectedExperience.company}
            </p>

            {/* DIVIDER */}
            <div
              className="
                my-[24px]
                h-[1px]
                w-full
                bg-[#111111]
              "
            />

            {/* WORK TITLE */}
            <h4
              className="
                m-0
                font-[family-name:var(--font-inter)]
                text-[14px]
                font-semibold
                uppercase
                tracking-[1.5px]
                text-[#282724]
              "
            >
              Work &amp; Responsibilities
            </h4>

            {/* WORK LIST */}
            <ul
              className="
                m-0
                mt-[14px]
                space-y-[12px]
                pl-[20px]
                font-[family-name:var(--font-inter)]
                text-[15px]
                leading-[1.6]
                tracking-[0.3px]
                text-[#282724]
              "
            >
              {selectedExperience.work.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {/* DATES */}
            <div
              className="
                mt-[28px]
                font-[family-name:var(--font-inter)]
                text-[11px]
                font-medium
                uppercase
                tracking-[1.2px]
                text-[#282724]/60
              "
            >
              {selectedExperience.dates}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
