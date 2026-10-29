import FloatingRoleLabels from "@/components/Hero/FloatingRoleLabels";
import DraggableHeadingFrame from "@/components/Hero/DraggableHeadingFrame";
import Navbar from "@/components/Navbar/Navbar";
import { FaAws } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { SiDocker } from "react-icons/si";
import { SiNextdotjs } from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

function FigmaMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 48"
      className="relative z-10 h-[34px] w-[23px] max-[767px]:h-[27px] max-[767px]:w-[18px]"
    >
      <path d="M16 0H8a8 8 0 0 0 0 16h8V0Z" fill="#F24E1E" />
      <path d="M16 0h8a8 8 0 0 1 0 16h-8V0Z" fill="#FF7262" />
      <path d="M16 16H8a8 8 0 0 0 0 16h8V16Z" fill="#A259FF" />
      <circle cx="24" cy="24" r="8" fill="#1ABCFE" />
      <path d="M16 32H8a8 8 0 1 0 8 8v-8Z" fill="#0ACF83" />
    </svg>
  );
}

function TechTileGrain() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(rgba(20,20,20,0.12)_0.5px,transparent_0.75px)] bg-[length:4px_4px] opacity-10"
    />
  );
}

function FloatingTechLogos() {
  const tileClass =
    "relative flex size-[48px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[#E7E7E7] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] opacity-100 max-[767px]:size-[38px] max-[767px]:rounded-[9px]";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[68px] z-[200] flex h-[56px] items-center justify-center gap-4 px-4 max-[767px]:top-[64px] max-[767px]:gap-2 max-[479px]:gap-1"
    >
      <div
        className={`animate-float-slow absolute right-[30%] top-[15%] ${tileClass}`}
      >
        <TechTileGrain />
        <VscVscode
          aria-hidden="true"
          size={27}
          color="#007ACC"
          className="relative z-10 max-[767px]:!h-[20px] max-[767px]:!w-[20px]"
        />
      </div>
      <div
        className={`animate-float-delayed absolute right-[40%] top-[25%] ${tileClass}`}
        style={{ animationDelay: "-1.4s" }}
      >
        <TechTileGrain />
        <FigmaMark />
      </div>
      <div
        className={`animate-float-slow absolute left-[50%] top-[95%] ${tileClass}`}
        style={{ animationDelay: "-2.6s" }}
      >
        <TechTileGrain />
        <FaAws
          aria-hidden="true"
          size={30}
          color="#FF9900"
          className="relative z-10 max-[767px]:!h-[22px] max-[767px]:!w-[22px]"
        />
      </div>
      <div
        className={`animate-float-delayed absolute left-[10%] top-[80%] ${tileClass}`}
        style={{ animationDelay: "-2s" }}
      >
        <TechTileGrain />
        <span className="relative z-10 flex size-[30px] items-center justify-center text-black max-[767px]:size-[23px]">
          <SiNextdotjs
            aria-hidden="true"
            size={20}
            color="#111111"
            className="max-[767px]:!h-[16px] max-[767px]:!w-[16px]"
          />
        </span>
      </div>
      <div
        className={`animate-float-delayed absolute right-[25%] top-[95%] ${tileClass}`}
        style={{ animationDelay: "-3.2s" }}
      >
        <TechTileGrain />
        <VscAzure
          aria-hidden="true"
          size={27}
          color="#0078D4"
          className="relative z-10 max-[767px]:!h-[20px] max-[767px]:!w-[20px]"
        />
      </div>
      <div
        className={`animate-float-slow absolute left-[10%] top-[25%] ${tileClass}`}
        style={{ animationDelay: "-4.4s" }}
      >
        <TechTileGrain />
        <SiDocker
          aria-hidden="true"
          size={30}
          color="#2496ED"
          className="relative z-10 max-[767px]:!h-[22px] max-[767px]:!w-[22px]"
        />
      </div>
    </div>
  );
}

function AvailabilityCard({ className = "" }: { className?: string }) {
  return (
    <div
      role="group"
      aria-label="Online right now. I BUILD THINGS THAT WORK."
      className={`flex w-[min(310px,100%)] items-center gap-3 rounded-[24px] border border-[#E8E8E8] bg-white px-4 py-3 text-left shadow-[0_6px_24px_rgba(0,0,0,0.08)] ${className}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111111]">
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="none"
        >
          <path
            d="M3.25 2.5v11l3.1-3.05 2.15 3.05 1.7-1.2-2.15-3.05h4.2L3.25 2.5Z"
            fill="white"
          />
        </svg>
      </span>
      <span className="min-w-0 font-[family-name:var(--font-inter)]">
        <span className="flex items-baseline gap-1.5 text-[13px] leading-5">
          <span className="font-semibold text-[#171717]">Shamanth</span>
          <span className="font-normal text-[#929292]">online</span>
        </span>
        <span className="block whitespace-nowrap text-[11px] leading-4 text-[#333333] max-[360px]:whitespace-normal">
          I BUILD THINGS THAT WORK.
        </span>
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="
    relative
    isolate
    h-[calc(100vh-42px)]
    min-h-[620px]
    w-full
    overflow-hidden
    bg-transparent
    max-[767px]:min-h-[100svh]
    max-[767px]:h-auto
    max-[767px]:px-6
    max-[767px]:pt-24
    max-[767px]:pb-10
    max-[767px]:flex
    max-[767px]:flex-col
    max-[767px]:justify-center
    max-[767px]:box-border
  "
    >
      <Navbar />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[56px] bottom-0 z-[2]"
      >
        <img
          src="/hero-wireframe-profile.svg"
          alt=""
          fetchPriority="high"
          className="animate-float-slow absolute left-[clamp(18px,5vw,70px)] top-[34%] h-auto w-[clamp(150px,18vw,210px)] drop-shadow-[0_5px_10px_rgba(0,0,0,0.04)] max-[767px]:left-auto max-[767px]:right-2 max-[767px]:top-[14%] max-[767px]:w-[96px]"
        />
        <img
          src="/hero-wireframe-contact.svg"
          alt=""
          loading="lazy"
          className="animate-float-delayed absolute left-[clamp(90px,15vw,300px)] top-[75%] h-auto w-[clamp(155px,17vw,210px)] drop-shadow-[0_5px_10px_rgba(0,0,0,0.04)] max-[767px]:left-2 max-[767px]:top-[78%] max-[767px]:w-[112px]"
        />
        <img
          src="/hero-wireframe-cursor.svg"
          alt=""
          loading="lazy"
          className="animate-float-delayed absolute bottom-[clamp(24px,6vh,60px)] right-[clamp(20px,6vw,88px)] h-auto w-[clamp(155px,17vw,210px)] drop-shadow-[0_5px_10px_rgba(0,0,0,0.04)] max-[767px]:bottom-[22%] max-[767px]:right-3 max-[767px]:w-[104px]"
          style={{ animationDelay: "-1.7s" }}
        />
      </div>
      <FloatingTechLogos />
      <FloatingRoleLabels />
      <div className="relative z-10">
        <div
          className="
    absolute
    left-1/2
    top-[56px]
    h-[800px]
    w-[1440px]
    -translate-x-1/2
    origin-top
    scale-[0.82]
    max-[1100px]:scale-[0.68]
    max-[900px]:scale-[0.52]
    max-[767px]:hidden
  "
        >
          {/* ========================================================= */}
          {/* DEVOPS */}
          {/* ========================================================= */}

          <div
            className="
          hidden
          absolute
          left-[21.3%]
          top-[181px]
          flex
          h-[43px]
          w-[180px]
          -rotate-[1deg]
          items-center
          justify-center
          rounded-full
          border-[5px]
          border-white
          bg-[#B5F2AB]
          shadow-[5px_7px_13.6px_rgba(0,0,0,0.25)]
        "
          >
            <span
              className="
            font-[family-name:var(--font-jersey-15)]
            text-[32px]
            leading-[34px]
            tracking-[0.8px]
            text-black
          "
            >
              DEVOPS
            </span>
          </div>

          {/* ========================================================= */}
          {/* FULL-STACK */}
          {/* ========================================================= */}

          <div
            className="
          hidden
          absolute
          right-[22.9%]
          top-[150px]
          flex
          h-[43px]
          w-[180px]
          rotate-[1deg]
          items-center
          justify-center
          rounded-full
          border-[5px]
          border-white
          bg-[#F8DB6A]
          shadow-[5px_7px_13.6px_rgba(0,0,0,0.25)]
        "
          >
            <span
              className="
            font-[family-name:var(--font-jersey-15)]
            text-[32px]
            leading-[34px]
            tracking-[0.8px]
            text-black
          "
            >
              FULL-STACK
            </span>
          </div>

          {/* ========================================================= */}
          {/* MY NAME IS */}
          {/* ========================================================= */}

          {/* <div
          className="
          absolute
          left-1/2
          top-[194px]
          h-[35px]
          w-[150px]
          -translate-x-1/2
        "
        >
          <span
            className="
                absolute
                left-0
                top-0
                whitespace-nowrap
                font-[family-name:var(--font-just-another-hand)]
                text-[34px]
                leading-[29px]
                tracking-[0.8px]
                text-black
             "
          >
            my name is
          </span>

          <img
            src="/arrows/heading-underline.svg"
            alt=""
            className="
            pointer-events-none
            absolute
            left-[40px]
            top-[27px]
            h-[20px]
            w-[90px]
          "
          />
        </div> */}

          {/* ========================================================= */}
          {/* NAME BOX */}
          {/* ========================================================= */}

          <DraggableHeadingFrame
            className="
          absolute
          left-1/2
          top-[238px]
          h-[288px]
          w-[800px]
          -translate-x-1/2
          max-[1100px]:h-[252px]
          max-[1100px]:w-[525px]
          max-[900px]:h-[194px]
          max-[900px]:w-[404px]
        "
          >
            {/* Actual Figma hand-drawn border */}
            {/* <img
              src="/arrows/name-box.svg"
              alt=""
              className="
            pointer-events-none
            absolute
            inset-0
            h-full
            w-full
          "
            /> */}

            {/* Name */}
            <h1
              className="
            absolute
            inset-0
            z-10
            flex
            items-center
            justify-center
            pb-[4px]
            text-center
            font-[family-name:var(--font-jersey-15)]
            text-[190px]
            leading-[140px]
            tracking-[0.8px]
            text-black
          "
            >
              <span>
                SHAMANTH
                <br />
                KRISHNA
              </span>
            </h1>
          </DraggableHeadingFrame>

          {/* ========================================================= */}
          {/* BENGALURU LABEL */}
          {/* ========================================================= */}

          <div
            className="
          hidden
          absolute
          left-[1088px]
          top-[470px]
          z-20
          flex
          h-[60px]
          w-[141px]
          items-center
          justify-center
          bg-[#B5F2AB]
          shadow-[7px_8px_10.1px_rgba(0,0,0,0.25)]
        "
          >
            <span
              className="
                whitespace-nowrap
                font-[family-name:var(--font-just-another-hand)]
                text-[32px]
                leading-[32px]
                tracking-[0.8px]
                text-black
                    "
            >
              Bengaluru, IN
            </span>
          </div>

          {/* ========================================================= */}
          {/* BENGALURU ARROW */}
          {/* ========================================================= */}

          {/* <img
            src="/arrows/bengaluru-arrow.svg"
            alt=""
            className="
            pointer-events-none
            absolute
            z-10
            left-[1015px]
            top-[380px]
            h-[82px]
            w-[115px]
            "
          /> */}
          {/* ========================================================= */}
          {/* SOFTWARE ENGINEER LABEL */}
          {/* ========================================================= */}

          <div
            className="
          hidden
          absolute
          left-[243px]
          top-[581px]
          z-20
          flex
          h-[60px]
          w-[141px]
          items-center
          justify-center
          bg-[#F8DB6A]
          shadow-[7px_8px_10.1px_rgba(0,0,0,0.25)]
        "
          >
            <span
              className="
                whitespace-nowrap
                font-[family-name:var(--font-just-another-hand)]
                text-[32px]
                leading-[32px]
                tracking-[0.8px]
                text-black
             "
            >
              software engineer
            </span>
          </div>

          {/* ========================================================= */}
          {/* SOFTWARE ENGINEER ARROW */}
          {/* ========================================================= */}

          {/* <img
            src="/arrows/software-arrow.svg"
            alt=""
            className="
            pointer-events-none
            absolute
            left-[395px]
            top-[535px]
            z-10
            h-[82px]
            w-[116px]
        "
          /> */}

          {/* ========================================================= */}
          {/* OPEN TO WORK */}
          {/* ========================================================= */}

          <img
            src="/open-to-work-toggle.svg"
            alt="OPEN TO WORK"
            className="absolute left-1/2 top-[553px] h-auto w-[210px] -translate-x-1/2"
          />
          {/* ========================================================= */}
          {/* MAIN STATEMENT */}
          {/* ========================================================= */}

          <div className="absolute left-1/2 top-[630px] -translate-x-1/2">
            <AvailabilityCard />
          </div>

          {/* ========================================================= */}
          {/* CONTACT BUTTON */}
          {/* ========================================================= */}

          {/* CONTACT BUTTON */}
          {/* <a
            href="#contact"
            className="
    absolute
    left-1/2
    top-[712px]
    flex
    h-[56px]
    w-[177px]
    -translate-x-1/2
    items-center
    rounded-[28px]
    bg-[#1E1E20]
    font-[family-name:var(--font-inter)]
    text-[14px]
    font-bold
    leading-none
    tracking-[0.2px]
    text-white
    transition-transform
    duration-200
    hover:scale-105
  "
          >
            <span
              className="
      ml-[3px]
      mr-[8px]
      flex
      h-[50px]
      w-[50px]
      shrink-0
      items-center
      justify-center
      rounded-full
      bg-[#17106F]
    "
            >
              <span className="h-[8px] w-[8px] rounded-full bg-black" />
            </span>

            <span className="whitespace-nowrap">CONTACT ME</span>
          </a> */}
        </div>
      </div>
      <div className="mx-auto hidden w-full min-w-0 max-w-xl flex-col items-center gap-6 px-5 pt-24 pb-12 text-center max-[767px]:!flex max-[767px]:max-w-none max-[767px]:gap-8 max-[767px]:px-0 max-[767px]:pt-0 max-[767px]:pb-0">
        <div className="hidden flex w-full flex-wrap items-center justify-center gap-3">
          <span className="rounded-full border-4 border-white bg-[#B5F2AB] px-4 py-1 font-[family-name:var(--font-jersey-15)] text-[clamp(18px,6vw,24px)] leading-none shadow-md">
            DEVOPS
          </span>
          <span className="rounded-full border-4 border-white bg-[#F8DB6A] px-4 py-1 font-[family-name:var(--font-jersey-15)] text-[clamp(18px,6vw,24px)] leading-none shadow-md">
            FULL-STACK
          </span>
        </div>
        <p className="m-0 font-[family-name:var(--font-just-another-hand)] text-2xl leading-none text-black max-[767px]:hidden">
          my name is
        </p>
        <div className="relative flex min-h-[190px] w-full items-center justify-center px-3 py-5">
          <img
            src="/arrows/name-box.svg"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full max-[767px]:hidden"
          />
          <DraggableHeadingFrame className="px-2 py-2">
            <h1 className="relative z-10 m-0 max-w-full font-[family-name:var(--font-jersey-15)] text-[clamp(2.75rem,12vw,3.5rem)] leading-[1.05] tracking-wide text-black">
              SHAMANTH
              <br />
              KRISHNA
            </h1>
          </DraggableHeadingFrame>
        </div>
        <div className="hidden flex w-full flex-wrap items-center justify-center gap-3">
          <span className="bg-[#F8DB6A] px-3 py-2 font-[family-name:var(--font-just-another-hand)] text-[clamp(16px,5vw,20px)] leading-none text-black shadow-md">
            software engineer
          </span>
          <span className="bg-[#B5F2AB] px-3 py-2 font-[family-name:var(--font-just-another-hand)] text-[clamp(16px,5vw,20px)] leading-none text-black shadow-md">
            Bengaluru, IN
          </span>
        </div>
        <img
          src="/open-to-work-toggle.svg"
          alt="OPEN TO WORK"
          className="-my-4 h-auto w-[210px] max-w-full max-[767px]:my-0 max-[767px]:w-[140px]"
        />
        <AvailabilityCard className="-my-4 max-[767px]:my-0 max-[767px]:scale-[0.78]" />
        <a
          href="#contact"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1E1E20] py-1 pl-1 pr-5 font-[var(--font-inter)] text-sm font-bold text-white max-[767px]:hidden"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17106F]">
            <span className="h-2 w-2 rounded-full bg-black" />
          </span>
          CONTACT ME
        </a>
      </div>
    </section>
  );
}
